<template>
  <div class="results">
    <v-row>
      <v-col>
        <h1 style="text-align: center">Wyniki MatHandlu</h1>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col>
        <h2 style="margin-bottom: 2rem; text-align: center">Ładujemy dane... 🧐</h2>
        <v-progress-linear indeterminate striped></v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" sm="8">
        <!-- <h2 style="text-align: center; margin-bottom: 0">{{ chosenMh.title }}</h2> -->
        <v-select
          v-model="chosenMhId"
          :items="latestMhEditions"
          item-value="objectid"
          item-text="objectname"
          placeholder="Wybierz edycję MatHandlu"
        ></v-select>
      </v-col>
      <v-col cols="9" sm="4" class="ml-auto">
        <v-text-field v-model="username" autofocus name="username" label="Twoja nazwa użytkownika z BGG"></v-text-field>
      </v-col>
      <v-col v-if="!resultsFiles || !resultsFiles.length" cols="12">
        <h2 style="text-align: center">Brak wyników w tej edycji - ona wciąż trwa! :)</h2>
      </v-col>
      <v-col v-else cols="12">
        <v-row>
          <v-col>
            <v-radio-group v-model="currentFileName" style="flex-direction: row">
              <v-radio
                v-for="file in resultsFiles"
                :key="file.name"
                :label="getFileNameWithoutExt(file)"
                :value="file.name"
                class="mx-2"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-if="currentFileName">
              <template v-if="mappedUserTrades && mappedUserTrades.length">
                <v-subheader>Twoje wymiany ({{ mappedUserTrades.length }}/{{ userGamesInTrade.length }}):</v-subheader>
                <v-card
                  v-for="trade in mappedUserTrades"
                  :key="`${trade.owner.username}${trade.ownerGame.number}`"
                  elevation="10"
                  class="mb-4 pa-3"
                >
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-row>
                          <v-col>
                            <strong>Wysyłasz <v-icon>mdi-arrow-right-bold-circle-outline</v-icon></strong>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="4">
                            <a :href="trade.ownerGame.link">
                              <v-img :src="trade.ownerGame.image" max-width="5rem" max-height="5rem"></v-img>
                            </a>
                          </v-col>
                          <v-col cols="8">
                            <strong>{{ trade.ownerGame.name }}</strong> (<a :href="trade.ownerGame.link"
                              >#{{ trade.ownerGame.number }}</a
                            >) do
                            <a :href="trade.sendsTo.composeMessageLink">{{ trade.sendsTo.username }}</a>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-row>
                          <v-col>
                            <strong>Dostajesz <v-icon>mdi-arrow-left-bold-circle-outline</v-icon></strong>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="4">
                            <a :href="trade.receivesGame.link">
                              <v-img :src="trade.receivesGame.image" max-width="6rem" max-height="6rem"></v-img>
                            </a>
                          </v-col>
                          <v-col cols="8">
                            <strong>
                              <em
                                >{{ trade.receivesGame.name }} (<a :href="trade.receivesGame.link"
                                  >#{{ trade.receivesGame.number }}</a
                                >)</em
                              >
                            </strong>
                            od
                            <strong
                              ><a :href="trade.receivesFrom.composeMessageLink">{{
                                trade.receivesFrom.username
                              }}</a></strong
                            >
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
              <template v-else-if="username">
                <h2 style="text-align: center">Brak wymian dla {{ username }}</h2>
              </template>
              <template v-else>
                <h2 style="text-align: center">Wprowadź nazwę użytkownika z BGG</h2>
              </template>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, useContext, watch } from '@nuxtjs/composition-api';
import { useGeeklist } from '~/composables/useGeeklist';
import { useMhGeeklist } from '~/composables/useMhGeeklist';
import { ListItem } from '~/composables/useMhGeeklist/types';
import { useMhGithub } from '~/composables/useMhGithub';
import { MhTrade } from '~/composables/useMhGithub/types';
import { GEEKLIST_OF_GEEKLISTS_ID } from '~/utils/consts';

export default defineComponent({
  setup() {
    const { query } = useContext();
    const { geeklist, loading, load } = useGeeklist();
    const { loading: mhGeeklistLoading, loadGeeklist, geeklistItems } = useMhGeeklist();
    const {
      loadMhRepo,
      loading: mhRepoLoading,
      setMhNumber,
      resultsFiles,
      getFileNameWithoutExt,
      getTrades,
    } = useMhGithub();

    const chosenMhId: Ref<string | null> = ref(null);
    const chosenMh = computed(() => geeklist.value?.item.find((item: any) => item.objectid === chosenMhId.value));
    const latestMhEditions: Ref<any[]> = ref([]);

    load(GEEKLIST_OF_GEEKLISTS_ID).then(() => {
      latestMhEditions.value = geeklist.value?.item.slice(Math.max(geeklist.value?.item.length - 10, 0)).reverse();
      chosenMhId.value = (query.value?.geeklistId as string) ?? latestMhEditions.value[0]?.objectid;
    });

    watch(
      chosenMh,
      async () => {
        if (!chosenMh.value) {
          return;
        }

        const mhEditionNumber = chosenMh.value?.objectname.match(/#(?<number>[0-9,]+)/)?.groups?.number;
        setMhNumber(mhEditionNumber);
        await loadMhRepo();
        if (resultsFiles.value.length) {
          loadGeeklist(chosenMhId.value as any);
        }
      },
      { immediate: true },
    );

    const username = ref((query.value?.bggUser as string) ?? '');
    const currentFileName: Ref<string | null> = ref(null);
    const trades = computed(() => getTrades(currentFileName.value));
    const userTrades = computed(() =>
      trades.value?.filter((trade: any) => trade.owner === username.value.toUpperCase()),
    );

    const getComposeMessageLink = (username: string): string =>
      `https://boardgamegeek.com/geekmail/compose?touser=${username}`;

    const getListItemLink = (listItem: ListItem): string =>
      `https://boardgamegeek.com/geeklist/${chosenMhId.value}/item/${listItem.listItemId}#item${listItem.listItemId}`;

    const tradesMapper = (trade: MhTrade) => {
      const listItem = geeklistItems.value[parseInt(trade.ownerGame, 10) - 1];
      const receivesItem = geeklistItems.value[parseInt(trade.receivesGame, 10) - 1];
      const sendsForItem = geeklistItems.value[parseInt(trade.sendsFor, 10) - 1];

      const getGamesNames = (item: ListItem): string =>
        [item.name, ...item.itemsInComments.map(subitem => subitem.name)].join(' + ');

      return {
        ...trade,
        owner: {
          username: listItem.userName,
          composeMessageLink: getComposeMessageLink(listItem.userName),
        },
        ownerGame: {
          number: listItem.number,
          name: getGamesNames(listItem),
          link: getListItemLink(listItem),
          image: listItem.image,
        },
        receivesFrom: {
          username: receivesItem.userName,
          composeMessageLink: getComposeMessageLink(receivesItem.userName),
        },
        receivesGame: {
          number: receivesItem.number,
          name: getGamesNames(receivesItem),
          link: getListItemLink(receivesItem),
          image: receivesItem.image,
        },
        sendsTo: {
          username: sendsForItem.userName,
          composeMessageLink: getComposeMessageLink(sendsForItem.userName),
        },
        sendsFor: {
          number: sendsForItem.number,
          name: getGamesNames(sendsForItem),
          link: getListItemLink(sendsForItem),
          image: sendsForItem.image,
        },
      };
    };
    const mappedUserTrades = computed(() => userTrades.value?.map(tradesMapper));

    const userGamesInTrade = computed(() =>
      geeklistItems.value.filter(item => item.userName.toLowerCase() === username.value.toLowerCase()),
    );

    watch(resultsFiles, () => {
      currentFileName.value = resultsFiles.value?.[0]?.name;
    });

    return {
      loading: computed(() => loading.value || mhGeeklistLoading.value || mhRepoLoading.value),
      username,
      chosenMh,
      chosenMhId,
      resultsFiles,
      getFileNameWithoutExt,
      currentFileName,
      trades,
      userTrades,
      mappedUserTrades,
      userGamesInTrade,
      latestMhEditions,
    };
  },
  head() {
    return {
      title: 'Wyniki',
    };
  },
});
</script>

<style lang="scss" scoped>
.results {
  ::v-deep.v-input--radio-group--column .v-input--radio-group__input {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>

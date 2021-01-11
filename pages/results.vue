<template>
  <div class="results">
    <v-row>
      <v-col>
        <h1 style="text-align: center">Wyniki mathandlu</h1>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col>
        <h2 style="margin-bottom: 2rem; text-align: center">Ładujemy dane... 🧐</h2>
        <v-progress-linear indeterminate striped></v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <h2 style="text-align: center; margin-bottom: 0">{{ mhGeeklist.title }}</h2>
      </v-col>
      <v-col cols="9" sm="4" class="ml-auto">
        <v-text-field v-model="username" name="username" label="Twoja nazwa użytkownika z BGG"></v-text-field>
      </v-col>
      <v-col cols="12">
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
                  :key="`${trade.owner.name}${trade.ownerGame.number}`"
                  elevation="10"
                  class="mb-4 pa-3"
                >
                  <v-card-text
                    style="display: flex; flex-direction: row; align-items: center; justify-content: space-around"
                  >
                    <a :href="trade.receivesGame.link">
                      <v-img :src="trade.receivesGame.image" max-width="20vw" max-height="20vw"></v-img>
                    </a>
                    <v-icon large class="mx-2">mdi-arrow-right-bold-circle-outline</v-icon>
                    <a :href="trade.ownerGame.link">
                      <v-img :src="trade.ownerGame.image" max-width="15vw" max-height="15vw"></v-img>
                    </a>
                    <v-icon large class="mx-2">mdi-arrow-right-bold-circle-outline</v-icon>
                    <a :href="trade.sendsFor.link">
                      <v-img :src="trade.sendsFor.image" max-width="10vw" max-height="10vw"></v-img>
                    </a>
                    <v-icon large class="mx-2">mdi-arrow-right-bold-circle-outline</v-icon>
                  </v-card-text>
                  <v-card-actions>
                    <span>
                      <strong>{{ trade.ownerGame.name }}</strong> >>
                      <strong
                        ><a :href="trade.receivesFrom.composeMessageLink">{{ trade.receivesFrom.username }}</a></strong
                      >
                      wysyła Ci
                      <strong>
                        <em>{{ trade.receivesGame.name }}</em> </strong
                      >, Ty wysyłasz do <a :href="trade.sendsTo.composeMessageLink">{{ trade.sendsTo.username }}</a> (za
                      <em>{{ trade.sendsFor.name }}</em
                      >)
                    </span>
                  </v-card-actions>
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
import { computed, defineComponent, Ref, ref, watch } from '@nuxtjs/composition-api';
import { useGeeklist } from '~/composables/useGeeklist';
import { useMhGeeklist } from '~/composables/useMhGeeklist';
import { ListItem } from '~/composables/useMhGeeklist/types';
import { useMhGithub } from '~/composables/useMhGithub';
import { MhTrade } from '~/composables/useMhGithub/types';
import { GEEKLIST_OF_GEEKLISTS_ID } from '~/utils/consts';

export default defineComponent({
  head() {
    return {
      title: 'Wyniki',
    };
  },
  setup() {
    const { geeklist, loading, load } = useGeeklist();
    const { loading: mhGeeklistLoading, geeklist: mhGeeklist, loadGeeklist, geeklistItems } = useMhGeeklist();
    const {
      loadMhRepo,
      loading: mhRepoLoading,
      setMhNumber,
      resultsFiles,
      getFileNameWithoutExt,
      getTrades,
    } = useMhGithub();

    load(GEEKLIST_OF_GEEKLISTS_ID);
    loadMhRepo();

    const latestMh = computed(() => geeklist.value?.item.pop());
    const latestMhId = computed(() => parseInt(latestMh.value?.objectid, 10));

    watch(latestMh, () => {
      if (!latestMh.value) {
        return;
      }

      const mhNumber = latestMh.value?.objectname.match(/#(?<number>[0-9,]+)/)?.groups?.number;
      setMhNumber(mhNumber);
      loadGeeklist(latestMhId.value);
    });

    const username = ref('');
    const currentFileName: Ref<string | null> = ref(null);
    const trades = computed(() => getTrades(currentFileName.value));
    const userTrades = computed(() =>
      trades.value?.filter((trade: any) => trade.owner === username.value.toUpperCase()),
    );

    const getComposeMessageLink = (username: string): string =>
      `https://boardgamegeek.com/geekmail/compose?touser=${username}`;

    const getListItemLink = (listItem: ListItem): string =>
      `https://boardgamegeek.com/geeklist/${latestMhId.value}/item/${listItem.listItemId}#item${listItem.listItemId}`;

    const tradesMapper = (trade: MhTrade) => {
      const listItem = geeklistItems.value[parseInt(trade.ownerGame, 10) - 1];
      const receivesItem = geeklistItems.value[parseInt(trade.receivesGame, 10) - 1];
      const sendsForItem = geeklistItems.value[parseInt(trade.sendsFor, 10) - 1];
      return {
        ...trade,
        owner: {
          username: listItem.userName,
          composeMessageLink: getComposeMessageLink(listItem.userName),
        },
        ownerGame: {
          number: listItem.number,
          name: listItem.name,
          link: getListItemLink(listItem),
          image: listItem.image,
        },
        receivesFrom: {
          username: receivesItem.userName,
          composeMessageLink: getComposeMessageLink(receivesItem.userName),
        },
        receivesGame: {
          number: receivesItem.number,
          name: receivesItem.name,
          link: getListItemLink(receivesItem),
          image: receivesItem.image,
        },
        sendsTo: {
          username: sendsForItem.userName,
          composeMessageLink: getComposeMessageLink(sendsForItem.userName),
        },
        sendsFor: {
          number: sendsForItem.number,
          name: sendsForItem.name,
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
      mhGeeklist,
      resultsFiles,
      getFileNameWithoutExt,
      currentFileName,
      trades,
      userTrades,
      mappedUserTrades,
      userGamesInTrade,
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

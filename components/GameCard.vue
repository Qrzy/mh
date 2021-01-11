<template>
  <div>
    <v-card height="100%">
      <v-row>
        <v-col cols="4" sm="3" md="2">
          <v-row>
            <v-col cols="12">
              <v-img :src="game.thumbnail" height="100%" contain></v-img>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="8" sm="9" md="10" class="pl-3">
          <v-row>
            <v-col>
              <v-card-title class="ma-0 pl-0 pt-1">
                <h3>
                  <a v-if="game.listItemId" :href="geeklistItemUrl" target="_blank">#{{ game.number }}</a>
                  <a :href="gameUrl" target="_blank" class="ml-2">{{ game.name }}</a>
                </h3>
              </v-card-title>
            </v-col>
          </v-row>
          <v-row v-if="game.listItemId">
            <v-col cols="12">
              <strong>Wystawiający:</strong>
              <a :href="getUserUrl(game.userName)" target="_blank">{{ game.userName }}</a>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card-actions class="text-xs-center" style="position: relative">
            <v-btn color="primary" small text @click.native="toggleDescription(game)">
              <v-icon left>{{ !isDescriptionShown ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
              {{ !isDescriptionShown ? 'Pokaż opis' : 'Schowaj opis' }}
            </v-btn>
            <v-btn
              v-if="game.listItemId"
              fab
              small
              absolute
              :color="isGameChosen ? 'primary' : ''"
              style="bottom: 5px; right: 5px; z-index: 0"
              @click.stop="isGameChosen ? removeChosenGame() : addChosenGame()"
            >
              <v-icon dark>mdi-dice-multiple</v-icon>
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
      <v-slide-y-transition>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <v-card-text v-show="isDescriptionShown" v-html="gameDesc"></v-card-text>
      </v-slide-y-transition>
    </v-card>
    <template v-if="game.itemsInComments">
      <game-card
        v-for="(subitem, index) in game.itemsInComments"
        :key="`${game.number}-${index}-subgame-${subitem.thingId}`"
        :game="subitem"
        :mh-id="mhId"
        class="ml-4"
      ></game-card>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from '@nuxtjs/composition-api';
import { getThingUrl, getUserUrl } from '~/composables/useMhGeeklist/getters';
import { ListItem } from '~/composables/useMhGeeklist/types';
import { useWanted } from '~/composables/useWanted';
import { WantLevel } from '~/composables/useWanted/types';

export default defineComponent({
  name: 'GameCard',
  props: {
    game: {
      type: Object as PropType<ListItem>,
      required: true,
    },
    mhId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { getWanted, setWanted, wanted } = useWanted();

    const isDescriptionShown = ref(false);

    const gameDesc = computed(() => props.game.body.replace(/\r?\n/g, '<br />'));
    const toggleDescription = () => (isDescriptionShown.value = !isDescriptionShown.value);
    const gameUrl = computed(() => getThingUrl(props.game));
    const isGameChosen = computed(() => getWanted(props.game.listItemId) === WantLevel.TAKE_MY_MONEY);
    const geeklistItemUrl = computed(
      () =>
        `https://boardgamegeek.com/geeklist/${props.mhId}/item/${props.game.listItemId}#item${props.game.listItemId}`,
    );
    const addChosenGame = (): void => {
      setWanted(props.game.listItemId, WantLevel.TAKE_MY_MONEY);
    };
    const removeChosenGame = (): void => {
      setWanted(props.game.listItemId, WantLevel.NEUTRAL);
    };

    return {
      gameDesc,
      toggleDescription,
      isDescriptionShown,
      gameUrl,
      getUserUrl,
      isGameChosen,
      geeklistItemUrl,
      addChosenGame,
      removeChosenGame,
      wanted,
    };
  },
});
</script>

<style scoped>
.card__text {
  white-space: pre-wrap;
}
</style>

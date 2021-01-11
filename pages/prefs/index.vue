<template>
  <div>
    <v-row>
      <v-col>
        <h2>{{ mhTitle }}</h2>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col>Ładuję...</v-col>
    </v-row>
    <template v-else>
      <v-row>
        <v-col>
          <v-pagination
            :length="noOfPages"
            :value="pageNumber"
            :total-visible="5"
            @input="setPageNumber"
          ></v-pagination>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <details>
            <summary>Gry na geekliście</summary>
            <pre>{{ JSON.stringify(items, null, 2) }}</pre>
          </details>
          <game-card
            v-for="item in items"
            :key="item.listItemId"
            :game="item"
            :mh-id="latestMhId"
            class="mb-5"
          ></game-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from '@nuxtjs/composition-api';
import { useFilters } from '~/composables/useFilters';
import { useGeeklist } from '~/composables/useGeeklist';
import { useMhGeeklist } from '~/composables/useMhGeeklist';
import { GEEKLIST_OF_GEEKLISTS_ID } from '~/utils/consts';

export default defineComponent({
  head() {
    return {
      title: '',
    };
  },
  setup() {
    const { geeklist: geeklistOfGeeklists, loading: geeklistOfGeeklistsLoading, load: loadGeeklist } = useGeeklist();
    const {
      loadGeeklist: loadMhGeeklist,
      geeklistItems,
      geeklist: mhGeeklist,
      loading: mhGeeklistLoading,
    } = useMhGeeklist();
    const { pageData: items, setPageNumber, pageNumber, noOfPages } = useFilters(geeklistItems);

    loadGeeklist(GEEKLIST_OF_GEEKLISTS_ID);
    const latestMh = computed(() => geeklistOfGeeklists.value?.item.pop());
    const latestMhId = computed(() => parseInt(latestMh.value?.objectid, 10));
    const mhTitle = computed(() => mhGeeklist.value?.title);

    watch(latestMh, () => {
      loadMhGeeklist(latestMhId.value);
    });

    return {
      items,
      pageNumber,
      noOfPages,
      setPageNumber,
      mhGeeklist,
      mhTitle,
      latestMhId,
      loading: computed(() => geeklistOfGeeklistsLoading.value || mhGeeklistLoading.value),
    };
  },
});
</script>

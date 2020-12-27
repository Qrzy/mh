<template>
  <div>
    <div>
      <v-text-field v-model="username" name="username" label="Twoja nazwa użytkownika z BGG"></v-text-field>
      <template v-if="!loading">
        <pre>{{ JSON.stringify(mhGeeklist.title, null, 2) }}</pre>
        <v-radio-group v-model="currentFileName">
          <v-radio
            v-for="file in resultsFiles"
            :key="file.name"
            :label="getFileNameWithoutExt(file)"
            :value="file.name"
          ></v-radio>
        </v-radio-group>
        <div v-if="currentFileName">
          <template v-if="userTrades && userTrades.length">
            <div v-for="trade in userTrades" :key="`${trade.owner}${trade.ownerGame}`">
              {{ trade.ownerGame }}: {{ trade.receivesFrom }} wysyła Ci {{ trade.receivesGame }}, Ty wysyłasz do
              {{ trade.sendsTo }}
            </div>
          </template>
          <template v-else-if="username"
            ><h2>Brak wymian dla {{ username }}</h2></template
          >
          <template v-else>
            <div v-for="trade in trades" :key="`${trade.owner}${trade.ownerGame}`">
              {{ trade.ownerGame }}: {{ trade.receivesFrom }} wysyła Ci {{ trade.receivesGame }}, Ty wysyłasz do
              {{ trade.sendsTo }}
            </div>
          </template>
        </div>
      </template>
      <span v-else>Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from '@nuxtjs/composition-api';
import { useGeeklist } from '~/composables/useGeeklist';
import { useMhGeeklist } from '~/composables/useMhGeeklist';
import { useMhGithub } from '~/composables/useMhGithub';

export default defineComponent({
  setup() {
    const { geeklist, loading, load } = useGeeklist();
    const { loading: mhGeeklistLoading, geeklist: mhGeeklist, loadGeeklist } = useMhGeeklist();
    const {
      loadMhRepo,
      loading: mhRepoLoading,
      setMhNumber,
      resultsFiles,
      getFileNameWithoutExt,
      getTrades,
    } = useMhGithub();

    load(184664);
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
    };
  },
});
</script>

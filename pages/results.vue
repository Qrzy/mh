<template>
  <div>
    <div>
      <v-text-field v-model="username" name="username" label="Twoja nazwa użytkownika z BGG"></v-text-field>
      <template v-if="!loading">
        <pre>{{ JSON.stringify(mhGeeklist.title, null, 2) }}</pre>
        <pre>{{ JSON.stringify(partialResultsFiles, null, 2) }}</pre>
        <pre>{{ JSON.stringify(finalResultsFile, null, 2) }}</pre>
      </template>
      <span v-else>Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@nuxtjs/composition-api';
import { useGeeklist } from '~/composables/useGeeklist';
import { useMhGeeklist } from '~/composables/useMhGeeklist';
import { useMhGithub } from '~/composables/useMhGithub';

export default defineComponent({
  setup() {
    const { geeklist, loading, load } = useGeeklist();
    const { loading: mhGeeklistLoading, geeklist: mhGeeklist, loadGeeklist } = useMhGeeklist();
    const { loadMhRepo, repoData, loading: mhRepoLoading } = useMhGithub();

    load(184664);
    loadMhRepo();

    const latestMh = computed(() => geeklist.value?.item.pop());
    const latestMhId = computed(() => parseInt(latestMh.value?.objectid, 10));

    watch(latestMh, () => {
      if (!latestMh.value) {
        return;
      }

      loadGeeklist(latestMhId.value);
    });

    const mhNumber = computed(() => latestMh.value?.objectname.match(/#(?<number>[0-9,]+)/)?.groups?.number);

    const chosenMhFiles = computed(() =>
      repoData.value?.object.entries
        .find((entry: any) => entry.name === `Polski MatHandel #${mhNumber.value}`)
        ?.object.entries.filter((entry: any) => (entry.name as string).endsWith('.txt')),
    );

    const partialResultsFiles = computed(() =>
      chosenMhFiles.value?.filter((file: any) => file.name.startsWith('Wyniki wstepne')),
    );

    const finalResultsFile = computed(() =>
      chosenMhFiles.value?.find((file: any) => file.name.startsWith('Wyniki koncowe')),
    );

    return {
      loading: computed(() => loading.value || mhGeeklistLoading.value || mhRepoLoading.value),
      geeklist,
      username: ref(''),
      latestMh,
      latestMhId,
      mhGeeklistLoading,
      mhGeeklist,
      repoData,
      partialResultsFiles,
      finalResultsFile,
    };
  },
});
</script>

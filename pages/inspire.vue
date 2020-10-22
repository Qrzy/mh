<template>
  <div class="home">
    <div
      v-if="loading"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <h1>Ładuję...</h1>
    </div>
    <template v-else>
      <button v-for="file in files" :key="file.name" type="button" @click="show(file.name)">
        {{ file.name }}
      </button>
      <pre style="border: 1px solid grey; padding: 2rem; word-wrap: wrap" v-html="fileContent"></pre>
      <pre>{{ JSON.stringify(files, null, 2) }}</pre>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@nuxtjs/composition-api';
import { useMhGithub } from '@/composables/useMhGithub';

export default defineComponent({
  name: 'Home',
  setup() {
    const latestMhName = 'Polski MatHandel #37,5';
    const { repoData, loadMhRepo, loading } = useMhGithub();
    loadMhRepo();
    const latestMhData = computed(() =>
      repoData.value.object.entries.find((entry: { name: string }) => entry.name === latestMhName),
    );
    const files = computed(() =>
      latestMhData.value.object.entries.filter((file: { name: string }) => file.name.startsWith('Wyniki')),
    );

    const currentFile = ref(null);
    const show = (fileName: null) => (currentFile.value = fileName);
    const fileContent = computed(
      () => files.value.find((file: { name: null }) => file.name === currentFile.value)?.object.text || '',
    );

    return {
      latestMhData,
      loading,
      files,
      show,
      fileContent,
    };
  },
});
</script>

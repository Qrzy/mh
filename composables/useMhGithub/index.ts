import { computed, ref } from '@nuxtjs/composition-api';
import { gqlWithAuth } from './gqlWithAuth';
import { query } from './query';

const repoData = ref<any>(null);
const loading = ref(false);

const loadMhRepo = async () => {
  loading.value = true;
  const { repository } = await gqlWithAuth(query, {
    owner: 'polskimathandel',
    name: 'PolskiMathandel.github.io',
  });
  repoData.value = repository;
  loading.value = false;
};

export const useMhGithub = () => {
  return {
    repoData: computed(() => repoData.value),
    loadMhRepo,
    loading: computed(() => loading.value),
  };
};

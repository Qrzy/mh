import { computed } from '@nuxtjs/composition-api';
import { UseGeeklist } from './types';
import { geeklist, geeklistRawData, loading } from './sharedState';
import { loadGeeklist } from './loadGeeklist';

export const useMhGeeklist = (): UseGeeklist => {
  return {
    geeklistRawData: computed(() => geeklistRawData.value),
    geeklistRawItems: computed(() => geeklistRawData.value?.item ?? []),
    geeklist: computed(() => geeklist.value),
    geeklistItems: computed(() => geeklist.value?.items ?? []),
    loadGeeklist,
    loading: computed(() => loading.value.gamesData || loading.value.geeklistData),
  };
};

/* istanbul ignore file */
import { computed, watch } from '@nuxtjs/composition-api';
import { UseGeeklist } from './types';
import { geeklistId, geeklistRawData, geeklist, loading } from './sharedState';
import { loadDefaultMhId } from './loadDefaultMhId';
import { setGeeklistId } from './setGeeklistId';
import { loadGeeklist } from './loadGeeklist';

export const useGeeklist = (mhId?: number): UseGeeklist => {
  if (!mhId) {
    loadDefaultMhId();
  }

  watch([geeklistId], loadGeeklist, { immediate: Boolean(mhId) });

  return {
    geeklistId: computed(() => geeklistId.value),
    geeklistRawData: computed(() => geeklistRawData.value),
    geeklist: computed(() => geeklist.value),
    setGeeklistId,
    loading: computed(() => loading.value.defaultGeeklistId || loading.value.gamesData || loading.value.geeklistData),
  };
};

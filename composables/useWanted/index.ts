import { Ref, computed, ref, set, del } from '@nuxtjs/composition-api';
import { WantLevel, UseWanted } from './types';

const wanted: Ref<Record<number, WantLevel>> = ref({});

const getWanted = (itemId: number): WantLevel => wanted.value[itemId] ?? WantLevel.NEUTRAL;

const removeWanted = (itemId: number): void => {
  del(wanted.value, itemId);
};

const setWanted = (itemId: number, wantLevel: WantLevel): void => {
  if (wantLevel === WantLevel.NEUTRAL) {
    removeWanted(itemId);
  } else {
    set(wanted.value, itemId, wantLevel);
  }
};

export const useWanted = (): UseWanted => {
  return {
    wanted: computed(() => wanted.value),
    getWanted,
    setWanted,
  };
};

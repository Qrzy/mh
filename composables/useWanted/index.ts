import { Ref, computed } from '@nuxtjs/composition-api';
import { storedRef } from '@/utils/storedRef';
import { WantLevel, UseWanted } from './types';

const wanted: Ref<Record<number, WantLevel>> = storedRef('wanted', {});

const getWanted = (itemId: number): WantLevel | undefined => wanted.value[itemId];

const removeWanted = (itemId: number): void => {
  delete wanted.value[itemId];
};

const setWanted = (itemId: number, wantLevel: WantLevel): void => {
  if (wantLevel === WantLevel.NEUTRAL) {
    removeWanted(itemId);
  } else {
    wanted.value[itemId] = wantLevel;
  }
};

export const useWanted = (): UseWanted => {
  return {
    wanted: computed(() => wanted.value),
    getWanted,
    setWanted,
  };
};

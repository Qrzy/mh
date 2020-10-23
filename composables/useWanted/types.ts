import { ComputedRef } from '@nuxtjs/composition-api';

export enum WantLevel {
  NO_THANKS = -3,
  NEUTRAL = 0,
  OH_MAYBE = 3,
  TAKE_MY_MONEY = 6,
}

export interface UseWanted {
  wanted: ComputedRef<Record<number, WantLevel>>;
  getWanted: (itemId: number) => WantLevel | undefined;
  setWanted: (itemId: number, want: WantLevel) => void;
}

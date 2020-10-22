import { ComputedRef } from '@nuxtjs/composition-api';

export interface UsePreferences {
  preferences: ComputedRef<Record<number, string[]>>;
  setPreference: (itemId: number, groupName: string) => void;
}

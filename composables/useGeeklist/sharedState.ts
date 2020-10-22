import { storedRef } from '@/utils/storedRef';
import { Ref, ref } from '@nuxtjs/composition-api';
import { RawItem, ListItem } from './types';

export const geeklistId: Ref<number | null> = storedRef('geeklistId', null);
export const geeklistRawData: Ref<RawItem[]> = ref([]);
export const geeklist: Ref<ListItem[]> = ref([]);
export const loading = ref({
  defaultGeeklistId: false,
  geeklistData: false,
  gamesData: false,
});

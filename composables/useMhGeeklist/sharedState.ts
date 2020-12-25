import { ref, Ref } from '@nuxtjs/composition-api';
import { BggGeeklist, Geeklist } from './types';

export const geeklistRawData: Ref<BggGeeklist | null> = ref(null);
export const geeklist: Ref<Geeklist | null> = ref(null);
export const loading = ref({
  geeklistData: false,
  gamesData: false,
});

import { computed, Ref, ssrRef } from '@nuxtjs/composition-api';
import { getBggGeeklist } from 'bgg-xml-api-client';

const geeklist: Ref<any> = ssrRef(null);
const loading: Ref<boolean> = ssrRef(false);

export const useGeeklist = () => {
  const load = async (id: number) => {
    loading.value = true;
    try {
      const response = await getBggGeeklist({ id, comments: 1 });
      geeklist.value = response.data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    geeklist: computed(() => geeklist.value),
    loading: computed(() => loading.value),
    load,
  };
};

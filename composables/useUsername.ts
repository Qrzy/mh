import { computed, ref, Ref } from '@nuxtjs/composition-api';
import { firebase } from '@/utils/firebase';
import { useAuth } from './useAuth';

interface UsernameLoading {
  loadUsername: boolean;
  setUsername: boolean;
}

const username: Ref<string> = ref('');
const loading: Ref<UsernameLoading> = ref({
  loadUsername: false,
  setUsername: false,
});

export const useUsername = () => {
  const { user } = useAuth();

  const setUsername = async (newUsername: string) => {
    try {
      loading.value.setUsername = true;
      await firebase.database().ref(`usernames/${user.value?.uid}`).set(newUsername);
      loading.value.loadUsername = true;
      loading.value.setUsername = false;
      await load();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      loading.value.setUsername = false;
      loading.value.loadUsername = false;
    }
  };
  const load = async () => {
    loading.value.loadUsername = true;
    try {
      const snap = await firebase.database().ref(`usernames/${user.value?.uid}`).once('value');
      username.value = snap.val();
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      loading.value.loadUsername = false;
    }
  };

  return {
    username: computed(() => username.value),
    loading: computed(() => loading.value.loadUsername || loading.value.setUsername),
    load,
    setUsername,
  };
};

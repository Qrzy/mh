import { computed, Ref, ref, ssrRef } from '@nuxtjs/composition-api';
import { createClient, User } from '@supabase/supabase-js';
import { useLogger } from '../useLogger';

const supabase = createClient(
  'https://vxaxpelrmhrwhegqvzus.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDcyODY2OSwiZXhwIjoxOTI2MzA0NjY5fQ.41T6RZelNiXEx3AKJD2t3wjl92IZzJMgDxRSxY_ZYaI',
);

const logger = useLogger();

const user: Ref<User | null> = ssrRef(null);
const loading: Ref<boolean> = ref(false);

const signIn = async (email: string, password: string): Promise<void> => {
  loading.value = true;
  try {
    const { user: loggedUser } = await supabase.auth.signIn({ email, password });
    user.value = loggedUser;
  } catch (err) {
    logger.error(err);
  } finally {
    loading.value = false;
  }
};

const signUp = async (email: string, password: string): Promise<void> => {
  loading.value = true;
  try {
    const { user: registeredUser } = await supabase.auth.signUp({ email, password });
    user.value = registeredUser;
  } catch (err) {
    logger.error(err);
  } finally {
    loading.value = false;
  }
};

const signOut = async (): Promise<void> => {
  loading.value = true;
  try {
    await supabase.auth.signOut();
    user.value = null;
  } catch (err) {
    logger.error(err);
  } finally {
    loading.value = false;
  }
};

const init = async () => {
  loading.value = true;
  try {
    const { user: loggedUser } = await supabase.auth.refreshSession();
    user.value = loggedUser;
  } finally {
    loading.value = false;
  }
};

export const useAuth = () => {
  return {
    user: computed(() => user.value),
    isLoggedIn: computed(() => !!user.value),
    init,
    signIn,
    signUp,
    signOut,
  };
};

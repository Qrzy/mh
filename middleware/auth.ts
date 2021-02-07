import { defineNuxtMiddleware } from '@nuxtjs/composition-api';
import { useAuth } from '~/composables/useAuth';

export default defineNuxtMiddleware(async ({ redirect }) => {
  const { init, isLoggedIn } = useAuth();
  await init();
  if (!isLoggedIn.value) {
    redirect('/signin');
  }
});

<template>
  <div class="home">
    <button type="button" @click="logout">Wyloguj się</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api';
import { useAuth } from '~/composables/useAuth';

export default defineComponent({
  name: 'Home',
  setup() {
    const { redirect } = useContext();
    const { signOut } = useAuth();

    const logout = async () => {
      await signOut();
      redirect('/');
    };

    return {
      logout,
    };
  },
});
</script>

<style lang="scss" scoped>
.home {
  color: #fff;
  input {
    color: #fff;
  }
}
</style>

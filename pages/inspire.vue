<template>
  <div class="home">
    <button type="button" @click="logout">Wyloguj się</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'Home',
  setup(_props, { root: { $fire } }) {
    const { redirect } = useContext();
    // const { user, signUp, signOut } = useAuth();

    const loginData = ref({
      email: 'qrzy88@gmail.com',
      pass: '',
    });
    const logout = async () => {
      await $fire.auth.signOut();
      redirect('/signin');
    };

    return {
      loginData,
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

<template>
  <div class="home">
    <form @submit.prevent="register()">
      <input v-model="loginData.email" type="email" placeholder="email" />
      <input v-model="loginData.pass" type="password" placeholder="password" />
      <input type="submit" value="Zarejestruj się" />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'Home',
  setup(_props, ctx) {
    const loginData = ref({
      email: 'qrzy88@gmail.com',
      pass: 'chujcidotego',
    });
    const register = async () => {
      const response = await ctx.root.$fireAuth.createUserWithEmailAndPassword(
        loginData.value.email,
        loginData.value.pass,
      );
      console.warn('Response: ', response);
      // TODO:
    };

    return {
      loginData,
      register,
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

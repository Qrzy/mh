<template>
  <v-container grid-list-xs class="grow d-flex align-center">
    <v-row>
      <v-col lg="6" offset-lg="3">
        <v-tabs v-model="tab" color="primary" dark grow slider-color="primary">
          <v-tab>Zaloguj się</v-tab>
          <v-tab>Zarejestruj się</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-form class="d-flex flex-column justify-center align-right py-10 px-16" @submit.prevent="login">
              <v-text-field
                id="email"
                v-model="formFields.email"
                name="email"
                label="e-mail"
                type="email"
              ></v-text-field>
              <v-text-field
                id="pass"
                v-model="formFields.pass"
                name="pass"
                label="hasło"
                type="password"
              ></v-text-field>
              <v-btn class="align-self-end" type="submit">Zaloguj się</v-btn>
            </v-form>
          </v-tab-item>
          <v-tab-item>
            <v-form class="d-flex flex-column justify-center align-right py-10 px-16" @submit.prevent="register">
              <v-text-field
                id="email"
                v-model="formFields.email"
                name="email"
                label="e-mail"
                type="email"
              ></v-text-field>
              <v-text-field
                id="pass"
                v-model="formFields.pass"
                name="pass"
                label="hasło"
                type="password"
              ></v-text-field>
              <v-btn class="align-self-end" type="submit">Zarejestruj się</v-btn>
            </v-form>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api';
import { useAuth } from '~/composables/useAuth';

export default defineComponent({
  layout: 'empty',
  middleware: async ({ redirect }) => {
    const { isLoggedIn, init } = useAuth();
    await init();
    if (isLoggedIn.value) {
      redirect('/');
    }
  },
  setup() {
    const { redirect } = useContext();
    const { user, signIn, signUp } = useAuth();

    const formFields = ref({ email: '', pass: '' });
    const tab = ref(null);

    const login = async () => {
      try {
        await signIn(formFields.value.email, formFields.value.pass);
        redirect('/');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };

    const register = async () => {
      try {
        await signUp(formFields.value.email, formFields.value.pass);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };

    return {
      formFields,
      login,
      register,
      tab,
      user,
    };
  },
});
</script>

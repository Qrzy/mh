<template>
  <v-container grid-list-xs class="grow d-flex align-center">
    <v-row>
      <v-col md="2" offset-md="5">
        <v-form class="d-flex flex-column justify-center align-right" @submit.prevent="save">
          <v-text-field
            id="username"
            v-model="username"
            name="username"
            label="Nazwa użytkownika z BGG"
            type="text"
          ></v-text-field>
          <v-btn class="align-self-end" type="submit" :disabled="loading">Zapisz</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api';
// import { useUsername } from '~/composables/useUsername';

export default defineComponent({
  layout: 'empty',
  setup() {
    const { redirect } = useContext();
    // const { setUsername, loading } = useUsername();

    const username = ref('');
    const save = () => {
      // await setUsername(username.value);
      //  TODO:
      redirect('/inspire');
    };

    return {
      username,
      save,
      // loading,
    };
  },
});
</script>

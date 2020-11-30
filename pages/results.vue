<template>
  <div>
    <div>
      <v-text-field v-model="username" name="username" label="Twoja nazwa użytkownika z BGG"></v-text-field>
      <pre v-if="!loading">{{ JSON.stringify(geeklist, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { useGeeklist } from '~/composables/useGeeklist';

export default defineComponent({
  setup() {
    const { geeklist, loading } = useGeeklist();
    return {
      loading,
      geeklist,
      username: ref(''),
    };
  },
});
</script>

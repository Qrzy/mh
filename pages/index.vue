<template>
  <div class="wip">
    <h1>WORK IN PROGRESS... 😎</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  layout: 'empty',
});
</script>

<style scoped>
.wip {
  color: #fff;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background: black;
  z-index: 9;
}
</style>

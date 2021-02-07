<template>
  <v-container class="wip">
    <v-row>
      <v-col>
        <h1>WORK IN PROGRESS...<br />😎</h1>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col>
        <v-btn href="/results" link nuxt color="primary" class="pa-3" height="auto"
          >Sprawdź wyniki<br />
          MatHandlu</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.wip {
  height: 50vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    text-align: center;
  }

  .row {
    flex-grow: 0;
  }

  .v-btn {
    text-align: center;
  }
}
</style>

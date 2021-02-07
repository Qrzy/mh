<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed app d-flex justify="space-between">
      <v-list>
        <v-list-item v-for="(item, i) in menuItems" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- <v-list>
        <v-list-item v-if="!isLoggedIn" to="/signIn" router exact>
          <v-list-item-action>
            <v-icon>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Zaloguj się</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <template v-else>
          <v-list-item>
            <v-list-item-action>
              <v-icon>mdi-account</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ userEmail }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-title>Wyloguj się</v-list-item-title>
          </v-list-item>
        </template>
      </v-list> -->
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="''" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="true" temporary fixed>
      <Filters></Filters>
    </v-navigation-drawer>
    <v-footer app> Wciąż w budowie... </v-footer>
  </v-app>
</template>

<script>
import { computed, defineComponent, ref, useContext } from '@nuxtjs/composition-api';
import Filters from '@/components/Filters';
import { useAuth } from '~/composables/useAuth';

const menuItems = [
  {
    icon: 'mdi-apps',
    title: 'Homescreen',
    to: '/',
  },
  // {
  //   icon: 'mdi-chart-bubble',
  //   title: 'Inspire',
  //   to: '/inspire',
  // },
  // {
  //   icon: '',
  //   title: 'Preferencje',
  //   to: '/prefs',
  // },
  {
    icon: 'mdi-format-list-checks',
    title: 'Wyniki',
    to: '/results',
  },
];

export default defineComponent({
  // middleware: 'auth',
  components: {
    Filters,
  },
  setup() {
    const { isLoggedIn, user, signOut } = useAuth();
    const { redirect } = useContext();
    const logout = async () => {
      await signOut();
      redirect('/');
    };

    return {
      logout,
      menuItems,
      userEmail: computed(() => user.value?.email),
      isLoggedIn,
      drawer: ref(false),
      rightDrawer: ref(false),
    };
  },
});
</script>

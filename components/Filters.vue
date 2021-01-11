<template>
  <div>
    <h2 class="pa-3">Filtry</h2>
    <v-form>
      <v-list class="pa-1">
        <v-list-item v-for="filter in filters" :key="filter.name">
          <template v-if="filter.type === 'switch'">
            <v-checkbox v-model="filter.value" :label="filter.label" :true-value="true"></v-checkbox>
          </template>
          <template v-else-if="filter.type === 'text'">
            <v-text-field v-model="filter.value" :label="filter.label" clearable></v-text-field>
          </template>
          <template v-else-if="filter.type === 'number'">
            <v-text-field v-model="filter.value" type="number" min="0" :label="filter.label" clearable></v-text-field>
          </template>
        </v-list-item>
      </v-list>
    </v-form>
    <h3 class="px-3 py-4 text-xs-right">
      Liczba pasujących wyników: <v-chip>{{ itemsCount }}</v-chip>
    </h3>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref, watch } from '@nuxtjs/composition-api';
import { Filter, useFilters } from '~/composables/useFilters';
import { useMhGeeklist } from '~/composables/useMhGeeklist';
import { ListItem } from '~/composables/useMhGeeklist/types';

enum filterType {
  SWITCH = 'switch',
  TEXT = 'text',
  SINGLE_CHOICE = 'singleChoice',
  MULTI_CHOICE = 'multiChoice',
  NUMBER = 'number',
}

export default defineComponent({
  setup() {
    const { geeklistItems } = useMhGeeklist();
    const { setFilters, itemsCount } = useFilters(geeklistItems);

    // MOCKS
    const bggUser: string = 'Qrzy88';
    const userOwned: number[] = [];
    const userPrevOwned: number[] = [];
    const userWishlist: number[] = [];

    const filters = ref([
      {
        name: 'noUserGames',
        label: 'Bez wystawionych przeze mnie',
        type: filterType.SWITCH,
        value: false,
        predicate: (checked: boolean) => (listItem: ListItem) =>
          checked && listItem.userName.toLowerCase() !== bggUser.toLowerCase(),
      },
      {
        name: 'noUserOwnedGames',
        label: 'Bez posiadanych przeze mnie',
        type: filterType.SWITCH,
        value: false,
        predicate: (checked: boolean) => (listItem: ListItem) => checked && !userOwned.includes(listItem.thingId),
      },
      {
        name: 'noUserPrevOwnedGames',
        label: 'Bez posiadanych dawniej przeze mnie',
        type: filterType.SWITCH,
        value: false,
        predicate: (checked: boolean) => (listItem: ListItem) => checked && !userPrevOwned.includes(listItem.thingId),
      },
      {
        name: 'wishlistOnly',
        label: 'Tylko gry z mojej wishlisty',
        type: filterType.SWITCH,
        value: false,
        predicate: (checked: boolean) => (listItem: ListItem) =>
          checked &&
          (userWishlist.includes(listItem.thingId) ||
            listItem.itemsInComments.some(subitem => userWishlist.includes(subitem.thingId))),
      },
      {
        name: 'name',
        label: 'Nazwa gry',
        type: filterType.TEXT,
        value: '',
        predicate: (namePart: string) => (listItem: ListItem) =>
          listItem.name.toLowerCase().includes(namePart.toLowerCase()) ||
          listItem.itemsInComments.some(item => item.name.toLowerCase().includes(namePart.toLowerCase())),
      },
      {
        name: 'bggMainRank',
        label: 'Max pozycja w rankingu',
        type: filterType.NUMBER,
        value: '',
        predicate: (max: number) => (listItem: ListItem) =>
          !max ||
          (listItem.mainrank && listItem.mainrank <= max) ||
          listItem.itemsInComments.some(item => item.mainrank && item.mainrank <= max),
      },
      {
        name: 'bggUser',
        label: 'Użytkownik wystawiający (nick BGG)',
        type: filterType.TEXT,
        value: '',
        predicate: (nickPart: string) => (listItem: ListItem) =>
          listItem.userName.toLowerCase().includes(nickPart.toLowerCase()),
      },
    ]);
    const activeFilters: ComputedRef<Filter<ListItem>[]> = computed(() =>
      filters.value
        .filter(fil => !!fil.value)
        .map(fil => ({
          name: fil.name,
          value: fil.value,
          predicate: fil.predicate,
        })),
    ) as ComputedRef<Filter<ListItem>[]>;

    watch(
      filters,
      () => {
        setFilters(activeFilters.value);
      },
      { deep: true },
    );

    return {
      filters,
      itemsCount,
    };
  },
});
</script>

<style lang="scss" scoped>
.filters {
  background: gray;
}
</style>

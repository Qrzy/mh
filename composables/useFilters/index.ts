import { computed, ComputedRef, ref, Ref, watchEffect } from '@nuxtjs/composition-api';
import { filter, compose, into } from 'ramda';

export interface Filter<T> {
  name: string;
  value: boolean | string | number | [min: number, max: number];
  predicate: (value: boolean | string | number | [min: number, max: number]) => (item: T) => boolean;
}

// PAGINATION
const pageNumber: Ref<number> = ref(1);
const pageSize: Ref<number> = ref(10);

const filters: Ref<Filter<any>[]> = ref([]);

export const useFilters = <ITEM_TYPE>(dataRef: Ref<ITEM_TYPE[]>) => {
  const itemsCount: ComputedRef<number> = computed(() => filteredItems.value.length);
  const noOfPages: ComputedRef<number> = computed(() => Math.ceil(filteredItems.value?.length / pageSize.value));

  const setPageNumber = (pageNo: number) => (pageNumber.value = pageNo);
  const setPageSize = (newSize: number) => (pageSize.value = newSize);

  // FILTERS

  const setFilters = (newFilters: Filter<ITEM_TYPE>[]) => (filters.value = newFilters);

  // RESULT
  const filteredItems = computed(() => {
    let filtered = dataRef.value;
    if (filters.value.length > 0) {
      const transducer = compose(
        // @ts-ignore
        ...filters.value.filter(filterr => !!filterr.value).map(filterr => filter(filterr.predicate(filterr.value))),
      );
      filtered = into([], transducer, dataRef.value) as ITEM_TYPE[];
    }
    return filtered;
  });

  const pageData: ComputedRef<ITEM_TYPE[]> = computed(() => {
    return (
      ((filteredItems.value as unknown) as ITEM_TYPE[]).slice(
        pageSize.value * (pageNumber.value - 1),
        pageSize.value * pageNumber.value,
      ) ?? []
    );
  });

  watchEffect(() => {
    if (itemsCount.value <= (pageNumber.value - 1) * pageSize.value) {
      pageNumber.value = 1;
    }
  });

  return {
    pageNumber: computed(() => pageNumber.value),
    pageSize: computed(() => pageSize.value),
    filters: computed(() => filters.value),
    pageData,
    noOfPages,
    itemsCount,
    setPageNumber,
    setPageSize,
    setFilters,
  };
};

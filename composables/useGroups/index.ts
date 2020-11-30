import { normalizeDiacritics } from 'normalize-text';
import { ref, Ref, computed } from '@nuxtjs/composition-api';
import { ListItem } from '../useMhGeeklist/types';
import { WantLevel } from '../useWanted/types';
import { UseGroups } from './types';

const groups: Ref<Record<string, number[]>> = ref({});
const loading = ref({
  addingItem: false,
  removingItem: false,
  removingGroup: false,
  generatingGroups: false,
});

const generateGroupName = (listItem: ListItem): string => {
  const initName = listItem.name + listItem.itemsInComments.reduce((prev, subitem) => `${prev}+${subitem.name}`, '');
  const nameWithoutDiacritics = normalizeDiacritics(initName);
  const groupName = nameWithoutDiacritics
    .replace(/[^a-z0-9_]+/gi, '_')
    .replace(/_+$/i, '')
    .toUpperCase();
  return `%${groupName}`;
};

const getWantedChecker = (wanted: Record<number, WantLevel>) => (listItem: ListItem): boolean =>
  !!wanted[listItem.listItemId] && wanted[listItem.listItemId] > WantLevel.NEUTRAL;

const generateGroupsFromWanted = (wanted: Record<number, WantLevel>, geeklist: ListItem[]): void => {
  loading.value.generatingGroups = true;
  const wantedGames = geeklist.filter(getWantedChecker(wanted));
  wantedGames.forEach(addToGroups);
  loading.value.generatingGroups = false;
};

const addToGroups = (listItem: ListItem): void => {
  const groupName = generateGroupName(listItem);
  if (!groups.value[groupName]) {
    groups.value[groupName] = [];
  }

  if (!groups.value[groupName].includes(listItem.listItemId)) {
    groups.value[groupName].push(listItem.listItemId);
  }
};

export const useGroups = (): UseGroups => {
  return {
    groups: computed(() => groups.value),
    loading: computed(() => Object.values(loading.value).some(Boolean)),
    generateGroupName,
    addToGroups,
    generateGroupsFromWanted,
  };
};

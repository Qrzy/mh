import { ComputedRef } from '@nuxtjs/composition-api';
import { ListItem } from '../useGeeklist/types';
import { WantLevel } from '../useWanted/types';

export interface UseGroups {
  groups: ComputedRef<Record<string, number[]>>;
  loading: ComputedRef<boolean>;
  generateGroupName: (listItem: ListItem) => string;
  addToGroups: (listItem: ListItem) => void;
  generateGroupsFromWanted: (wanted: Record<number, WantLevel>, geeklist: ListItem[]) => void;
}

import { fetchGamesData } from './fetchGamesData';
import { getRawData } from './getRawData';
import { mapGeeklist } from './mapGeeklist';
import { mergeItemsData } from './mergeItemsData';
import { geeklist, geeklistRawData, loading } from './sharedState';
import { BggGeeklist } from './types';

export const loadGeeklist = async (geeklistId: number): Promise<void> => {
  loading.value.geeklistData = true;
  geeklistRawData.value = (await getRawData(geeklistId)) as BggGeeklist;
  const mappedGeeklist = {
    ...geeklistRawData.value,
    items: mapGeeklist(geeklistRawData.value.item),
  };
  loading.value.geeklistData = false;

  loading.value.gamesData = true;
  const gamesData = await fetchGamesData(mappedGeeklist.items);
  geeklist.value = {
    ...mappedGeeklist,
    items: mergeItemsData(mappedGeeklist.items, gamesData),
  };
  loading.value.gamesData = false;
};

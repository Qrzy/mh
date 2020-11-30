import { getRawData } from './getRawData';
import { geeklist, geeklistRawData, geeklistId, loading } from './sharedState';
import { mapGeeklist } from './mapGeeklist';
import { fetchGamesData } from './fetchGamesData';
import { mergeItemsData } from './mergeItemsData';

export const loadGeeklist = async (): Promise<void> => {
  if (!geeklistId.value) {
    return;
  }

  loading.value.geeklistData = true;
  const fetchedGeeklist = await getRawData(geeklistId.value as number);
  console.log(JSON.stringify(fetchedGeeklist, null, 2));
  geeklistRawData.value = mapGeeklist(fetchedGeeklist.item);
  loading.value.geeklistData = false;

  loading.value.gamesData = true;
  const gamesData = await fetchGamesData(geeklistRawData.value);
  geeklist.value = mergeItemsData(geeklistRawData.value, gamesData);
  loading.value.gamesData = false;
};

import { getBggGeeklist } from 'bgg-xml-api-client';
import { geeklistId, loading } from './sharedState';

export const loadDefaultMhId = async (): Promise<void> => {
  loading.value.defaultGeeklistId = true;
  const { data } = (await getBggGeeklist({ id: 184664 })) as any;
  const lastMhId = data.item.pop().objectid;
  geeklistId.value = parseInt(lastMhId as string, 10);
  loading.value.defaultGeeklistId = false;
};

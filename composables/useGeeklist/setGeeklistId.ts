import { geeklistId } from './sharedState';

export const setGeeklistId = (id: number | null): void => {
  geeklistId.value = id;
};

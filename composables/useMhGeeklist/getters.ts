import { ListItem } from './types';

export const getThingUrl = (thing: ListItem): string => `https://boardgamegeek.com/boardgame/${thing.thingId}`;

export const getUserUrl = (username: string): string =>
  `https://boardgamegeek.com/user/${encodeURIComponent(username)}`;

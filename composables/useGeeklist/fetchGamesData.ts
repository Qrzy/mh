import { getBggThing } from 'bgg-xml-api-client';
import { RawItem, BggThingData, ThingData } from './types';
import { reduceGameData } from './reduceGameData';

const CHUNK_SIZE = 200;

const getGameIds = (geeklist: RawItem[]): number[] => {
  const mainIds = geeklist.map(listItem => listItem.thingId);
  const fromComments = geeklist.map(listItem => listItem.itemsInComments.map(subitem => subitem.thingId)).flat();
  return [...new Set([...mainIds, ...fromComments])];
};

const makeChunks = <T>(array: T[], chunkSize: number): T[][] => {
  const chunked = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunked.push(array.slice(i, i + chunkSize));
  }
  return chunked;
};

async function* fetchGamesChunked(chunks: number[][]): AsyncGenerator<BggThingData, void, void> {
  for (const ids of chunks) {
    yield getBggThing({ id: (ids.join(',') as unknown) as number, stats: 1 });
  }
}

export const fetchGamesData = async (geeklist: RawItem[]): Promise<ThingData[]> => {
  const gameIds = getGameIds(geeklist);
  const chunkedIds = makeChunks(gameIds, CHUNK_SIZE);
  let games: BggThingData[] = [];
  // let flag = true;
  for await (const response of fetchGamesChunked(chunkedIds)) {
    // flag && console.log(response.data.item[0]), (flag = false);
    games = [...games, ...response.data.item];
  }
  console.log({ length: games.length, games });
  return games.map(reduceGameData);
};

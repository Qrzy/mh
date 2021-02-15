import { BggThingData, ThingData } from './types';

enum LinkProps {
  ARTISTS = 'boardgameartist',
  AUTHORS = 'boardgamedesigner',
  CATEGORIES = 'boardgamecategory',
  FAMILIES = 'boardgamefamily',
  MECHANICS = 'boardgamemechanic',
  PUBLISHERS = 'boardgamepublisher',
}

const extractLink = (gamedata: BggThingData, linkProp: string): { id: number; name: string }[] => {
  if (Array.isArray(gamedata.link)) {
    return gamedata.link
      .filter((link: { type: string; id: string; value: string }) => link.type === linkProp)
      .map((link: { type: string; id: string; value: string }) => ({ id: parseInt(link.id, 10), name: link.value }));
  }

  if (gamedata.link.type === linkProp) {
    return [{ id: parseInt(gamedata.link.id, 10), name: gamedata.link.value }];
  }

  return [];
};

const extractMainRank = (gamedata: BggThingData): number | null => {
  if (!Array.isArray(gamedata.statistics.ratings.ranks.rank)) {
    return parseInt(gamedata.statistics.ratings.ranks.rank.value, 10);
  }

  const rankObj = gamedata.statistics.ratings.ranks.rank.find((rank: { id: string; value: string }) => rank.id === '1');
  return rankObj ? parseInt(rankObj.value, 10) : null;
};

const extractName = (gamedata: BggThingData): string => {
  if (Array.isArray(gamedata.name)) {
    const primary = gamedata.name.find(({ type }: { type: string }) => type === 'primary').value;
    return primary || gamedata.name[0].value;
  }

  return gamedata.name.value;
};

export const reduceGameData = (gamedata: BggThingData): ThingData => ({
  artists: extractLink(gamedata, LinkProps.ARTISTS),
  authors: extractLink(gamedata, LinkProps.AUTHORS),
  categories: extractLink(gamedata, LinkProps.CATEGORIES),
  families: extractLink(gamedata, LinkProps.FAMILIES),
  id: parseInt(gamedata.id, 10),
  image: gamedata.image,
  mainrank: extractMainRank(gamedata),
  maxPlayers: gamedata.maxplayers ? parseInt(gamedata.maxplayers.value, 10) : null,
  maxPlayTime: gamedata.maxplaytime ? parseInt(gamedata.maxplaytime.value, 10) : null,
  mechanics: extractLink(gamedata, LinkProps.MECHANICS),
  minAge: gamedata.minage ? parseInt(gamedata.minage.value, 10) : null,
  minPlayers: gamedata.minplayers ? parseInt(gamedata.minplayers.value, 10) : null,
  minPlayTime: gamedata.minplaytime ? parseInt(gamedata.minplaytime.value, 10) : null,
  name: extractName(gamedata),
  publishers: extractLink(gamedata, LinkProps.PUBLISHERS),
  thumbnail: gamedata.thumbnail,
  type: gamedata.type,
  weight: parseFloat(gamedata.statistics.ratings.averageweight.value),
  yearpublished: gamedata.yearpublished ? parseInt(gamedata.yearpublished.value, 10) : null,
});

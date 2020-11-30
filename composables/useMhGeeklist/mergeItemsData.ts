import { RawItem, ThingData, ListItem, RawCommentItem } from './types';

const getThingFinder = (things: ThingData[]) => (item: RawItem | RawCommentItem): ThingData =>
  things.find(thing => thing.id === item.thingId)!;

export const mergeItemsData = (geeklistRaw: RawItem[], things: ThingData[]): ListItem[] => {
  const findThing = getThingFinder(things);
  return geeklistRaw.map(geeklistItem => ({
    ...geeklistItem,
    ...findThing(geeklistItem),
    itemsInComments: geeklistItem.itemsInComments.map(itemInComment => ({
      ...itemInComment,
      ...findThing(itemInComment),
    })),
  }));
};

import { bbCodeParser } from '@/utils/bbCodeParser';
import { BggGeeklistItemComment, RawItem, RawCommentItem, BggGeeklistItem } from './types';

const THING_REGEX = /(?:\[(?:thing|gameid|boardgame|boardgameexpansion|boardgameaccessory)=([\d]+)\])/g;
const THING_ID_REGEX = /^\[(?:thing|gameid|boardgame|boardgameexpansion|boardgameaccessory)=(?<id>[\d]+)\]$/i;

const parseItemsFromComments = (comments: BggGeeklistItemComment | BggGeeklistItemComment[]): RawCommentItem[] => {
  if (!comments) {
    return [];
  }

  if (!Array.isArray(comments)) {
    comments = [comments];
  }

  return comments.flatMap(comment => {
    const matches = comment.text.match(THING_REGEX) || [];
    return matches.map(match => ({
      thingId: parseInt(THING_ID_REGEX.exec(match)!.groups!.id, 10),
      body: bbCodeParser(comment.text),
    }));
  });
};

export const mapGeeklist = (geeklistItems: BggGeeklistItem[]): RawItem[] =>
  geeklistItems.map((item: BggGeeklistItem, index: number) => ({
    number: index + 1,
    listItemId: parseInt(item.id, 10),
    thingId: parseInt(item.objectid, 10),
    objectType: item.objecttype,
    objectSubtype: item.subtype,
    mainName: item.objectname,
    userName: item.username,
    thumbs: parseInt(item.thumbs, 10),
    imageId: parseInt(item.imageid, 10),
    body: bbCodeParser(item.body),
    itemsInComments: parseItemsFromComments(item.comment),
  }));

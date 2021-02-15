import { ComputedRef } from '@nuxtjs/composition-api';

export type BbCodeParser = (bbCode: string) => string;

export interface RawCommentItem {
  thingId: number;
  body: string;
}

export interface RawItem {
  number: number;
  listItemId: number;
  thingId: number;
  objectType: string;
  objectSubtype: string;
  mainName: string;
  userName: string;
  thumbs: number;
  imageId: number;
  body: string;
  itemsInComments: RawCommentItem[];
}

export interface LinkItem {
  id: number;
  name: string;
}

export type Nullable<T> = T | null;

export interface ThingData {
  id: number;
  image: string;
  artists: LinkItem[];
  authors: LinkItem[];
  categories: LinkItem[];
  families: LinkItem[];
  mechanics: LinkItem[];
  publishers: LinkItem[];
  maxPlayers: Nullable<number>;
  maxPlayTime: Nullable<number>;
  minAge: Nullable<number>;
  minPlayers: Nullable<number>;
  minPlayTime: Nullable<number>;
  name: string;
  thumbnail: string;
  type: string;
  yearpublished: Nullable<number>;
  mainrank: Nullable<number>;
  weight: number;
}

export interface CommentItem extends RawCommentItem, ThingData {}

export interface ListItem extends ThingData, RawItem {
  itemsInComments: CommentItem[];
}

export type BggGeeklistItem = any;

export interface BggGeeklist {
  item: BggGeeklistItem[];
  [prop: string]: any;
}

export interface Geeklist {
  items: ListItem[];
  [prop: string]: any;
}

export interface UseGeeklist {
  geeklistRawData: ComputedRef<BggGeeklist | null>;
  geeklistRawItems: ComputedRef<BggGeeklistItem[]>;
  geeklist: ComputedRef<Geeklist | null>;
  geeklistItems: ComputedRef<ListItem[]>;
  loadGeeklist: (geeklistId: number) => void;
  loading: ComputedRef<boolean>;
}

// temp types for api response

export type BggThingData = any;

export interface BggGeeklistItemComment {
  text: string;
  username: string;
  date: string;
  postdate: string;
  editdate: string;
  thumbs: string;
}

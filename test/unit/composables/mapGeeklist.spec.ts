import { mapGeeklist } from '@/composables/useGeeklist/mapGeeklist';
import { BggGeeklistItem } from '@/composables/useGeeklist/types';

let itemFromBgg: BggGeeklistItem;

describe('mapping geeklist', () => {
  beforeEach(() => {
    itemFromBgg = {
      id: '1',
      objectid: '11',
      objecttype: 'thing',
      subtype: 'boardgame',
      objectname: 'Best Game Evah',
      username: 'Qrzy88',
      thumbs: '10',
      imageid: '1111',
      body: '',
    };
  });

  it('handles empty array on input', () => {
    expect(mapGeeklist([])).toEqual([]);
  });

  it('maps items without comments', () => {
    expect(mapGeeklist([itemFromBgg])).toEqual([
      {
        number: 1,
        listItemId: 1,
        thingId: 11,
        objectType: 'thing',
        objectSubtype: 'boardgame',
        mainName: 'Best Game Evah',
        userName: 'Qrzy88',
        thumbs: 10,
        imageId: 1111,
        body: '',
        itemsInComments: [],
      },
    ]);
  });

  it('maps items with comments', () => {
    itemFromBgg.comment = { text: '[thing=222] Another game!' };

    expect(mapGeeklist([itemFromBgg])).toEqual([
      {
        number: 1,
        listItemId: 1,
        thingId: 11,
        objectType: 'thing',
        objectSubtype: 'boardgame',
        mainName: 'Best Game Evah',
        userName: 'Qrzy88',
        thumbs: 10,
        imageId: 1111,
        body: '',
        itemsInComments: [{ thingId: 222, body: '[thing=222] Another game!' }],
      },
    ]);
  });

  it('maps items with multiple comments', () => {
    itemFromBgg.comment = [{ text: '[thing=222] Another game!' }, { text: '[gameid=333] Yet another one' }];

    expect(mapGeeklist([itemFromBgg])).toEqual([
      {
        number: 1,
        listItemId: 1,
        thingId: 11,
        objectType: 'thing',
        objectSubtype: 'boardgame',
        mainName: 'Best Game Evah',
        userName: 'Qrzy88',
        thumbs: 10,
        imageId: 1111,
        body: '',
        itemsInComments: [
          { thingId: 222, body: '[thing=222] Another game!' },
          { thingId: 333, body: '[gameid=333] Yet another one' },
        ],
      },
    ]);
  });

  it('maps items with comments without thing in them', () => {
    itemFromBgg.comment = { text: 'Another game!' };

    expect(mapGeeklist([itemFromBgg])).toEqual([
      {
        number: 1,
        listItemId: 1,
        thingId: 11,
        objectType: 'thing',
        objectSubtype: 'boardgame',
        mainName: 'Best Game Evah',
        userName: 'Qrzy88',
        thumbs: 10,
        imageId: 1111,
        body: '',
        itemsInComments: [],
      },
    ]);
  });

  it('maps items with accessories in comments', () => {
    itemFromBgg.comment = { text: '[boardgameaccessory=222] Another game!' };

    expect(mapGeeklist([itemFromBgg])).toEqual([
      {
        number: 1,
        listItemId: 1,
        thingId: 11,
        objectType: 'thing',
        objectSubtype: 'boardgame',
        mainName: 'Best Game Evah',
        userName: 'Qrzy88',
        thumbs: 10,
        imageId: 1111,
        body: '',
        itemsInComments: [{ thingId: 222, body: '[boardgameaccessory=222] Another game!' }],
      },
    ]);
  });
});

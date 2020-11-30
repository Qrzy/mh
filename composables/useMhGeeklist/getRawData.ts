import { getBggGeeklist } from 'bgg-xml-api-client';

export const getRawData = async (mhId: number) => {
  const { data: geeklistResponse } = (await getBggGeeklist({ id: mhId, comments: 1 })) as any;
  if (parseInt(geeklistResponse.numitems, 10) !== geeklistResponse.item.length) {
    throw new Error(
      `Response contains invalid number of items. Should be ${geeklistResponse.geeklist.numitems}, received ${geeklistResponse.geeklist.item.length}`,
    );
  }

  return geeklistResponse;
};

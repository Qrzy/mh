import { getBggGeeklist } from 'bgg-xml-api-client';

export const getRawData = async (mhId: number) => {
  const { data: geeklistResponse } = await getBggGeeklist({ id: mhId, comments: 1 });
  if (parseInt(geeklistResponse.numitems, 10) !== geeklistResponse.item.length) {
    // eslint-disable-next-line no-console
    console.error(
      `Response contains invalid number of items. Should be ${geeklistResponse.numitems}, received ${geeklistResponse.item.length}`,
    );
  }

  return geeklistResponse;
};

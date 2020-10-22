import { bbCodeParser } from '@/utils/bbCodeParser';

describe('BBCode parser', () => {
  it('gets loaded', () => {
    expect(bbCodeParser).not.toBeNull();
  });

  it('parses simple header', () => {
    expect(bbCodeParser('[h1]Header[/h1]')).toEqual('<h1>Header</h1>');
  });
});

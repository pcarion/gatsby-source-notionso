import extractPageIdFromPublicUrl from '../src/util/extractPageIdFromPublicUrl';

describe.skip('extractPageIdFromPublicUrl', () => {
  it('should work with somewhat valid URL', () => {
    expect(
      extractPageIdFromPublicUrl(
        'https://www.notion.so/whatever-8ebca155ffda547fb5d49b0892672dea',
      ),
    ).toEqual('8ebca155-ffda-547f-b5d4-9b0892672dea');
  });
  it('should work with id only', () => {
    expect(
      extractPageIdFromPublicUrl('8ebca155ffda547fb5d49b0892672dea'),
    ).toEqual('8ebca155-ffda-547f-b5d4-9b0892672dea');
  });
  it('should sail if input too short', () => {
    expect(extractPageIdFromPublicUrl('too-short-01234')).toBeNull();
  });
});

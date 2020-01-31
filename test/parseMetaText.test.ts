import { NotionMeta } from '../src/types/notion';
import parseMetaText from '../src/notion/parser/parseMetaText';

describe('parseMetaText', () => {
  it('should parse excerpt 1', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!! hello world')).toBeTruthy();
    expect(meta).toEqual({ excerpt: 'hello world' });
  });
  it('should parse excerpt 2', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!! hello ')).toBeTruthy();
    expect(meta).toEqual({ excerpt: 'hello' });
  });
  it('should parse slug 1', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!slug a-b ')).toBeTruthy();
    expect(meta).toEqual({ slug: 'a-b' });
  });
  it('should parse slug 2', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!slug b t/notok')).toBeTruthy();
    expect(meta).toEqual({ slug: 'b-t-notok' });
  });
  it('should parse slug 3', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!slug allons enfants / de la patrie')).toBeTruthy();
    expect(meta).toEqual({ slug: 'allons-enfants-de-la-patrie' });
  });
  it('should parse date 1', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!date 2020/01/30')).toBeTruthy();
    expect(meta).toEqual({ date: '2020-01-30T00:00:00.000Z' });
  });
  it('should parse date 2', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!date 2020/05')).toBeTruthy();
    expect(meta).toEqual({ date: '2020-05-01T00:00:00.000Z' });
  });
  it('should parse date 3', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!date xyz')).toBeTruthy();
    expect(meta).toEqual({ date: null });
  });
  it('should parse tags 1', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!tags t1')).toBeTruthy();
    expect(meta).toEqual({ tags: ['t1'] });
  });
  it('should parse tags 2', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!tags t1, t2,  t 3')).toBeTruthy();
    expect(meta).toEqual({ tags: ['t1', 't2', 't 3'] });
  });
  it('should parse tags 3', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!tags t1 t2 t3')).toBeTruthy();
    expect(meta).toEqual({ tags: ['t1 t2 t3'] });
  });
  it('should parse isDraft 1', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!draft')).toBeTruthy();
    expect(meta).toEqual({ isDraft: true });
  });
  it('should parse isDraft 2', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!draft false')).toBeTruthy();
    expect(meta).toEqual({ isDraft: false });
  });
  it('should parse isDraft 3', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!draft 0')).toBeTruthy();
    expect(meta).toEqual({ isDraft: false });
  });
  it('should parse isDraft 4', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!draft x')).toBeTruthy();
    expect(meta).toEqual({ isDraft: true });
  });
  it('should not parse regular text 1', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('hello')).toBeFalsy();
    expect(meta).toEqual({});
  });
  it('should not parse regular text 2', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!hello')).toBeFalsy();
    expect(meta).toEqual({});
  });
  it('should not parse regular text 3', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('')).toBeFalsy();
    expect(meta).toEqual({});
  });
  it('should parse multiple texts', () => {
    const meta: NotionMeta = {};
    const parser = parseMetaText(meta);
    expect(parser('!date: 2020/03/28')).toBeTruthy();
    expect(parser('!tags :t1, t2, t3')).toBeTruthy();
    expect(parser('!hello')).toBeFalsy();
    expect(parser('!! world')).toBeTruthy();
    expect(meta).toEqual({
      date: '2020-03-28T00:00:00.000Z',
      excerpt: 'world',
      tags: ['t1', 't2', 't3'],
    });
  });
});

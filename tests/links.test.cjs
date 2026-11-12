const assert = require('node:assert/strict');
const { test } = require('node:test');
const { parseLinkPath, parseListLinkParams } = require('@data/linkParams');

test('card links need a positive integer id', () => {
  assert.deepEqual(parseLinkPath('card/123'), { screen: 'card', id: 123 });
  assert.deepEqual(parseLinkPath('/card/123/'), { screen: 'card', id: 123 });
  for (const path of ['card/0', 'card/-4', 'card/1.5', 'card/abc', 'card']) {
    assert.deepEqual(parseLinkPath(path), { screen: 'list' }, path);
  }
  assert.deepEqual(parseLinkPath('card/1/extra'), { screen: 'list' });
});

test('list links parse filters; unknown paths leave filters alone', () => {
  assert.deepEqual(parseLinkPath('cards?q=Luke&sets=SOR,shd'), {
    screen: 'list',
    filters: { search: 'Luke', expansions: ['SOR', 'SHD'] },
  });
  // No params resets to all cards.
  assert.deepEqual(parseLinkPath('cards'), { screen: 'list', filters: {} });
  for (const path of ['', '/', 'nope', 'cards/extra']) {
    assert.deepEqual(parseLinkPath(path), { screen: 'list' }, path);
  }
});

test('filter params: missing means all, empty means none, unknown values are dropped', () => {
  assert.deepEqual(parseListLinkParams(''), {});
  assert.deepEqual(parseListLinkParams('?sets='), { expansions: [] });
  assert.deepEqual(parseListLinkParams('aspects=vigilance,Nope,Neutral'), {
    aspects: ['Vigilance', 'Neutral'],
  });
  // A param with only unknown values is ignored rather than matching nothing.
  assert.deepEqual(parseListLinkParams('rarities=Mythic'), {});
  assert.deepEqual(parseListLinkParams('types=Leader&q=%20%20'), {
    types: ['Leader'],
  });
  // Repeated params arrive as arrays and are ignored.
  assert.deepEqual(parseListLinkParams('sets=SOR&sets=SHD'), {});
});

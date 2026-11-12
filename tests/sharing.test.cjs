const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');

const files = new Set();
let downloads = 0;
let cachePath = '/image-cache/card.png';
let available = true;
let shareError;
let copyError;
let finishShare;
let holdShare = false;
let shares = 0;

class File {
  constructor(parent, name) {
    this.uri = name ? `${parent.uri}/${name}` : parent;
    assert.ok(
      this.uri.startsWith('file://'),
      'Native File requires an absolute URI',
    );
  }
  get exists() {
    return files.has(this.uri);
  }
  async copy(destination) {
    await new Promise((resolve) => setImmediate(resolve));
    if (copyError) throw copyError;
    files.add(destination.uri);
  }
  delete() {
    files.delete(this.uri);
  }
  static async downloadFileAsync(_url, destination) {
    downloads++;
    files.add(destination.uri);
  }
}
class Directory {
  constructor(parent, name) {
    this.uri = `${parent}/${name}`;
  }
  create() {}
  list() {
    return [...files]
      .filter((path) => path.startsWith(`${this.uri}/`))
      .map((path) => new File(path));
  }
}
const mocks = {
  'expo-file-system': { Directory, File, Paths: { cache: 'file:///cache' } },
  'expo-image': { Image: { getCachePathAsync: async () => cachePath } },
  'expo-sharing': {
    isAvailableAsync: async () => available,
    shareAsync: async (uri, options) => {
      shares++;
      assert.ok(files.has(uri));
      assert.equal(options.mimeType, 'image/png');
      if (shareError) throw shareError;
      if (holdShare)
        await new Promise((resolve) => {
          finishShare = resolve;
        });
    },
  },
};
const load = Module._load;
Module._load = function (id, ...args) {
  return mocks[id] ?? load.call(this, id, ...args);
};
const { shareCardImage } = require('../src/data/shareCardImage.ts');
Module._load = load;

test('sharing reuses cached art, cleans owned exports, and releases its concurrency guard', async () => {
  const cachedUri = `file://${cachePath}`;
  files.add(cachedUri);
  files.add('file:///cache/card-shares/interrupted.png');
  await shareCardImage('https://example.test/card.png');
  assert.equal(downloads, 0);
  assert.deepEqual([...files], [cachedUri]);

  cachePath = cachedUri;
  await shareCardImage('https://example.test/card.png');
  assert.equal(downloads, 0);
  assert.deepEqual([...files], [cachedUri]);

  copyError = new Error('Could not copy cached image');
  const sharesBeforeFailedCopy = shares;
  await assert.rejects(
    shareCardImage('https://example.test/card.png'),
    /Could not copy cached image/,
  );
  assert.equal(shares, sharesBeforeFailedCopy);
  assert.deepEqual([...files], [cachedUri]);
  copyError = undefined;
  await shareCardImage('https://example.test/card.png');
  assert.equal(shares, sharesBeforeFailedCopy + 1);
  assert.deepEqual([...files], [cachedUri]);

  cachePath = null;
  await shareCardImage('https://example.test/card.png');
  assert.equal(downloads, 1);
  assert.equal(files.size, 1);

  shareError = new Error('Share cancelled');
  await assert.rejects(
    shareCardImage('https://example.test/card.png'),
    /Share cancelled/,
  );
  assert.equal(files.size, 1);
  shareError = undefined;

  holdShare = true;
  const pending = shareCardImage('https://example.test/card.png');
  while (!finishShare) await new Promise((resolve) => setImmediate(resolve));
  const before = shares;
  await shareCardImage('https://example.test/other.png');
  assert.equal(shares, before);
  finishShare();
  await pending;
  holdShare = false;
  assert.equal(files.size, 1);

  available = false;
  await assert.rejects(
    shareCardImage('https://example.test/card.png'),
    /unavailable/,
  );
  available = true;
  await shareCardImage('https://example.test/card.png');
  assert.equal(shares, before + 1);
  assert.equal(files.size, 1);
});

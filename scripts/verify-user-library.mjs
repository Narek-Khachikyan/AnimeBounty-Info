import assert from 'node:assert/strict';

import {
  USER_LIBRARY_STORAGE_KEY,
  addOrUpdateLibraryItem,
  getLibraryItems,
  removeLibraryItem,
  toggleLibraryFavorite,
  updateLibraryStatus,
} from '../src/features/userLibrary.js';

const createMemoryStorage = (initialValue) => {
  const values = new Map();

  if (initialValue !== undefined) {
    values.set(USER_LIBRARY_STORAGE_KEY, initialValue);
  }

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
};

const animeSnapshot = {
  id: 1,
  type: 'anime',
  title: 'Cowboy Bebop',
  imageUrl: 'https://example.com/bebop.webp',
  score: 8.9,
  route: '/anime/1',
};

const mangaSnapshot = {
  id: 2,
  type: 'manga',
  title: 'Yotsuba&!',
  imageUrl: 'https://example.com/yotsuba.webp',
  score: 8.8,
  route: '/manga/2',
};

const corruptStorage = createMemoryStorage('{not valid json');
assert.deepEqual(getLibraryItems(corruptStorage), []);

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');

Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: Object.defineProperty({}, 'localStorage', {
    get: () => {
      throw new Error('localStorage denied');
    },
  }),
});
assert.deepEqual(getLibraryItems(), []);

if (originalWindowDescriptor) {
  Object.defineProperty(globalThis, 'window', originalWindowDescriptor);
} else {
  delete globalThis.window;
}

const storage = createMemoryStorage();
const firstSave = addOrUpdateLibraryItem(storage, animeSnapshot, {
  status: 'watching',
  favorite: true,
  now: '2026-04-27T10:00:00.000Z',
});
assert.equal(firstSave.length, 1);
assert.equal(firstSave[0].status, 'watching');
assert.equal(firstSave[0].favorite, true);
assert.equal(firstSave[0].savedAt, '2026-04-27T10:00:00.000Z');
assert.equal(firstSave[0].updatedAt, '2026-04-27T10:00:00.000Z');

const secondSave = addOrUpdateLibraryItem(storage, {
  ...animeSnapshot,
  title: 'Cowboy Bebop: Complete',
}, {
  status: 'completed',
  now: '2026-04-27T10:05:00.000Z',
});
assert.equal(secondSave.length, 1);
assert.equal(secondSave[0].title, 'Cowboy Bebop: Complete');
assert.equal(secondSave[0].status, 'completed');
assert.equal(secondSave[0].favorite, true);
assert.equal(secondSave[0].savedAt, '2026-04-27T10:00:00.000Z');
assert.equal(secondSave[0].updatedAt, '2026-04-27T10:05:00.000Z');

addOrUpdateLibraryItem(storage, mangaSnapshot, {
  status: 'planning',
  favorite: false,
  now: '2026-04-27T10:10:00.000Z',
});
assert.equal(getLibraryItems(storage).length, 2);

const toggled = toggleLibraryFavorite(storage, 'manga', 2, {
  now: '2026-04-27T10:12:00.000Z',
});
const toggledManga = toggled.find((item) => item.type === 'manga' && item.id === 2);
assert.equal(toggledManga.favorite, true);
assert.equal(toggledManga.status, 'planning');

const updated = updateLibraryStatus(storage, 'manga', 2, 'completed', {
  now: '2026-04-27T10:15:00.000Z',
});
const completedManga = updated.find((item) => item.type === 'manga' && item.id === 2);
assert.equal(completedManga.status, 'completed');
assert.equal(completedManga.favorite, true);

const removed = removeLibraryItem(storage, 'anime', 1);
assert.equal(removed.length, 1);
assert.equal(removed[0].type, 'manga');

console.log('User library storage checks passed.');

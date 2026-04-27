import { useCallback, useEffect, useMemo, useState } from "react";

export const USER_LIBRARY_STORAGE_KEY = "animebounty:user-library:v1";
export const USER_LIBRARY_UPDATED_EVENT = "animebounty:user-library-updated";

export const LIBRARY_STATUSES = ["watching", "planning", "completed", "dropped"];

const DEFAULT_STATUS = "planning";

const getBrowserStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const isValidLibraryItem = (item) => (
  item &&
  (item.type === "anime" || item.type === "manga") &&
  Number.isFinite(Number(item.id)) &&
  typeof item.title === "string" &&
  LIBRARY_STATUSES.includes(item.status)
);

const normalizeStatus = (status) => (
  LIBRARY_STATUSES.includes(status) ? status : DEFAULT_STATUS
);

const getItemKey = (type, id) => `${type}:${Number(id)}`;

const readItems = (storage) => {
  if (!storage) {
    return [];
  }

  try {
    const rawItems = storage.getItem(USER_LIBRARY_STORAGE_KEY);

    if (!rawItems) {
      return [];
    }

    const parsedItems = JSON.parse(rawItems);

    if (!Array.isArray(parsedItems)) {
      storage.setItem(USER_LIBRARY_STORAGE_KEY, "[]");
      return [];
    }

    return parsedItems.filter(isValidLibraryItem);
  } catch {
    try {
      storage.setItem(USER_LIBRARY_STORAGE_KEY, "[]");
    } catch {
      return [];
    }

    return [];
  }
};

const writeItems = (storage, items) => {
  if (!storage) {
    return items;
  }

  try {
    storage.setItem(USER_LIBRARY_STORAGE_KEY, JSON.stringify(items));
  } catch {
    return items;
  }

  return items;
};

export const getLibraryItems = (storage = getBrowserStorage()) => readItems(storage);

export const getLibraryItem = (storage = getBrowserStorage(), type, id) => (
  getLibraryItems(storage).find((item) => item.type === type && Number(item.id) === Number(id)) ?? null
);

export const createLibrarySnapshot = (source, type) => {
  const id = Number(source?.mal_id ?? source?.id);
  const title = source?.title_english || source?.title || source?.title_japanese || "Untitled";
  const imageUrl =
    source?.images?.webp?.large_image_url ||
    source?.images?.webp?.image_url ||
    source?.imageUrl ||
    "";

  return {
    id,
    type,
    title,
    imageUrl,
    score: source?.score ?? null,
    route: `/${type}/${id}`,
  };
};

export const addOrUpdateLibraryItem = (
  storage = getBrowserStorage(),
  snapshot,
  { status, favorite, now = new Date().toISOString() } = {}
) => {
  const items = getLibraryItems(storage);
  const normalizedSnapshot = {
    ...snapshot,
    id: Number(snapshot.id),
    score: snapshot.score ?? null,
    imageUrl: snapshot.imageUrl ?? "",
    route: snapshot.route || `/${snapshot.type}/${Number(snapshot.id)}`,
  };
  const existingItem = items.find((item) => (
    item.type === normalizedSnapshot.type && Number(item.id) === normalizedSnapshot.id
  ));
  const nextItem = {
    ...existingItem,
    ...normalizedSnapshot,
    status: normalizeStatus(status ?? existingItem?.status),
    favorite: favorite ?? existingItem?.favorite ?? false,
    savedAt: existingItem?.savedAt ?? now,
    updatedAt: now,
  };
  const nextItems = existingItem
    ? items.map((item) => (getItemKey(item.type, item.id) === getItemKey(nextItem.type, nextItem.id) ? nextItem : item))
    : [nextItem, ...items];

  return writeItems(storage, nextItems);
};

export const removeLibraryItem = (storage = getBrowserStorage(), type, id) => {
  const nextItems = getLibraryItems(storage).filter((item) => (
    getItemKey(item.type, item.id) !== getItemKey(type, id)
  ));

  return writeItems(storage, nextItems);
};

export const updateLibraryStatus = (
  storage = getBrowserStorage(),
  type,
  id,
  status,
  { now = new Date().toISOString() } = {}
) => {
  const nextItems = getLibraryItems(storage).map((item) => (
    getItemKey(item.type, item.id) === getItemKey(type, id)
      ? { ...item, status: normalizeStatus(status), updatedAt: now }
      : item
  ));

  return writeItems(storage, nextItems);
};

export const toggleLibraryFavorite = (
  storage = getBrowserStorage(),
  type,
  id,
  { now = new Date().toISOString() } = {}
) => {
  const nextItems = getLibraryItems(storage).map((item) => (
    getItemKey(item.type, item.id) === getItemKey(type, id)
      ? { ...item, favorite: !item.favorite, updatedAt: now }
      : item
  ));

  return writeItems(storage, nextItems);
};

const notifyLibraryUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USER_LIBRARY_UPDATED_EVENT));
  }
};

export const useUserLibrary = () => {
  const [items, setItems] = useState(() => getLibraryItems());

  useEffect(() => {
    const syncItems = () => setItems(getLibraryItems());

    window.addEventListener(USER_LIBRARY_UPDATED_EVENT, syncItems);
    window.addEventListener("storage", syncItems);

    return () => {
      window.removeEventListener(USER_LIBRARY_UPDATED_EVENT, syncItems);
      window.removeEventListener("storage", syncItems);
    };
  }, []);

  const saveItem = useCallback((snapshot, options) => {
    const nextItems = addOrUpdateLibraryItem(getBrowserStorage(), snapshot, options);
    setItems(nextItems);
    notifyLibraryUpdated();
    return nextItems;
  }, []);

  const removeItem = useCallback((type, id) => {
    const nextItems = removeLibraryItem(getBrowserStorage(), type, id);
    setItems(nextItems);
    notifyLibraryUpdated();
    return nextItems;
  }, []);

  const updateStatus = useCallback((type, id, status) => {
    const nextItems = updateLibraryStatus(getBrowserStorage(), type, id, status);
    setItems(nextItems);
    notifyLibraryUpdated();
    return nextItems;
  }, []);

  const toggleFavorite = useCallback((type, id) => {
    const nextItems = toggleLibraryFavorite(getBrowserStorage(), type, id);
    setItems(nextItems);
    notifyLibraryUpdated();
    return nextItems;
  }, []);

  const getItem = useCallback((type, id) => (
    items.find((item) => item.type === type && Number(item.id) === Number(id)) ?? null
  ), [items]);

  return useMemo(() => ({
    items,
    getItem,
    saveItem,
    removeItem,
    updateStatus,
    toggleFavorite,
  }), [getItem, items, removeItem, saveItem, toggleFavorite, updateStatus]);
};

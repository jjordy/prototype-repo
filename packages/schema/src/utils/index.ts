export function keysToArray<T = Record<string, string>>(obj: T) {
  return Object.keys(obj)?.map((key) => obj[key as keyof typeof obj]);
}

export function getAllowedKeys<T = Record<string, any>>(
  obj: T,
  keywordList: string[]
) {
  const payload: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    if (keywordList.includes(key)) {
      const k = key as keyof T;
      payload[k] = obj[k];
    }
  });
  return payload;
}

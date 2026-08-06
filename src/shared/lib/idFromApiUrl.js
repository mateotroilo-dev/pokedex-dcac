export const idFromApiUrl = (url) => Number(url.split('/').filter(Boolean).at(-1));

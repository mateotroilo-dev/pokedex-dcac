export const POKEMON_ID_PARAM = 'id';

export const ROUTES = Object.freeze({
  HOME: '/',
  POKEMON_DETAIL: `/pokemon/:${POKEMON_ID_PARAM}`,
  NOT_FOUND: '*',
});

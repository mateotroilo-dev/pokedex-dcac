import { createContext } from 'react';

export const FreshnessContext = createContext({
  freshness: null,
  reportFreshness: () => {},
});

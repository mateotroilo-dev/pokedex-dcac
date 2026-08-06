import { useCallback, useMemo, useState } from 'react';
import { FreshnessContext } from 'src/features/connection/components/FreshnessProvider/FreshnessProvider.context.js';

const FreshnessProvider = ({ children }) => {
  const [freshness, setFreshness] = useState(null);

  const reportFreshness = useCallback((nextFreshness) => setFreshness(nextFreshness), []);

  const value = useMemo(() => ({ freshness, reportFreshness }), [freshness, reportFreshness]);

  return <FreshnessContext.Provider value={value}>{children}</FreshnessContext.Provider>;
};

export default FreshnessProvider;

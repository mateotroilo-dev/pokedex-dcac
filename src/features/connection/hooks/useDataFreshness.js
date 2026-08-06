import { useContext, useEffect } from 'react';
import { FreshnessContext } from 'src/features/connection/components/FreshnessProvider/FreshnessProvider.context.js';

export const useDataFreshness = ({ fulfilledTimeStamp, isFetching, tags }) => {
  const { reportFreshness } = useContext(FreshnessContext);

  useEffect(() => {
    reportFreshness({ fulfilledTimeStamp, isFetching, tags });
    return () => reportFreshness(null);
  }, [fulfilledTimeStamp, isFetching, tags, reportFreshness]);
};

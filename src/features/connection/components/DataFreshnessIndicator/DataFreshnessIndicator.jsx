import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectHydratedAt } from 'src/app/uiSlice.js';
import {
  CACHED_LABEL,
  REFRESH_LABEL,
} from 'src/features/connection/components/DataFreshnessIndicator/DataFreshnessIndicator.constants.js';
import {
  AgeLabel,
  RefreshButton,
  RefreshIcon,
  Wrapper,
} from 'src/features/connection/components/DataFreshnessIndicator/DataFreshnessIndicator.styles.js';
import { FreshnessContext } from 'src/features/connection/components/FreshnessProvider/FreshnessProvider.context.js';
import { formatDataAge } from 'src/features/connection/lib/formatDataAge.js';
import { baseApi } from 'src/services/baseApi.js';
import { useOnlineStatus } from 'src/shared/hooks/useOnlineStatus.js';
import VisuallyHidden from 'src/shared/ui/VisuallyHidden/VisuallyHidden.jsx';

// Sin nada reportado no hay que decir - ni "sin datos" ni un placeholder -, porque la pagina
// todavia no escribio nada al contexto (recien montada) o no aplica (/team, /compare).
const DataFreshnessIndicator = () => {
  const { freshness } = useContext(FreshnessContext);
  const hydratedAt = useSelector(selectHydratedAt);
  const isOnline = useOnlineStatus();
  const dispatch = useDispatch();

  // `fulfilledTimeStamp` en null/undefined es "la query todavia no resolvio" (loading, o
  // skipeada por un id invalido): nada que decir todavia, no un tramo roto.
  if (!freshness || freshness.fulfilledTimeStamp == null) return null;

  const { fulfilledTimeStamp, isFetching, tags } = freshness;
  const isCached = hydratedAt !== null && fulfilledTimeStamp < hydratedAt;

  const handleRefresh = () => dispatch(baseApi.util.invalidateTags(tags));

  // Sin setInterval a proposito: la edad se recalcula sola en cada render que ya dispara otra cosa,
  // y un tramo ancho no miente lo suficiente como para pagar un timer vivo.
  // eslint-disable-next-line react-hooks/purity -- Date.now() en render es la decision, no un descuido.
  const label = formatDataAge(fulfilledTimeStamp, Date.now());

  return (
    <Wrapper>
      <RefreshButton onClick={handleRefresh} disabled={!isOnline || isFetching}>
        <RefreshIcon viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M21 12a9 9 0 1 1-3.06-6.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M21 3v6h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </RefreshIcon>
        <VisuallyHidden>{REFRESH_LABEL}</VisuallyHidden>
      </RefreshButton>
      <AgeLabel>
        {label}
        {isCached && CACHED_LABEL}
      </AgeLabel>
    </Wrapper>
  );
};

export default DataFreshnessIndicator;

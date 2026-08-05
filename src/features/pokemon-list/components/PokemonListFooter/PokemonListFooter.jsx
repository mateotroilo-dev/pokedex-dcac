import ErrorState from 'src/shared/ui/ErrorState/ErrorState.jsx';
import InfiniteScrollSentinel from 'src/shared/ui/InfiniteScrollSentinel/InfiniteScrollSentinel.jsx';
import {
  DEX_COMPLETE_MESSAGE,
  LOAD_MORE_ERROR_MESSAGE,
} from 'src/features/pokemon-list/components/PokemonListFooter/PokemonListFooter.constants.js';
import { ClosingMessage } from 'src/features/pokemon-list/components/PokemonListFooter/PokemonListFooter.styles.js';

const PokemonListFooter = ({
  hasNextPage,
  isFetchNextPageError,
  isFetchingNextPage,
  onLoadMore,
}) => {
  if (isFetchNextPageError) {
    return <ErrorState message={LOAD_MORE_ERROR_MESSAGE} onRetry={onLoadMore} />;
  }

  if (!hasNextPage) {
    return <ClosingMessage>{DEX_COMPLETE_MESSAGE}</ClosingMessage>;
  }

  // Apagar el sentinel mientras la pagina esta en vuelo no es para evitar el dispatch de mas (de eso
  // ya se encarga el `condition` del thunk): es lo que lo vuelve a armar al terminar. El observer
  // solo avisa transiciones, asi que si el sentinel quedo en pantalla cuando aterrizo la pagina no
  // hay entrada nueva que reportar y la cadena se corta hasta que el usuario sube y vuelve a bajar.
  // Al pasar de false a true, observe() lo reevalua y encadena la siguiente sola.
  return <InfiniteScrollSentinel onLoadMore={onLoadMore} enabled={!isFetchingNextPage} />;
};

export default PokemonListFooter;

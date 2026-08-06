import {
  OFFLINE_LABEL,
  ONLINE_LABEL,
} from 'src/features/connection/components/ConnectionIndicator/ConnectionIndicator.constants.js';
import {
  Dot,
  Wrapper,
} from 'src/features/connection/components/ConnectionIndicator/ConnectionIndicator.styles.js';
import { useOnlineStatus } from 'src/shared/hooks/useOnlineStatus.js';

// El texto es la fuente de verdad del estado; el punto de color solo lo acompaña, asi que un
// usuario que no distingue color sigue teniendo la informacion completa.
const ConnectionIndicator = () => {
  const isOnline = useOnlineStatus();

  return (
    <Wrapper role="status" aria-live="polite">
      <Dot $online={isOnline} />
      {isOnline ? ONLINE_LABEL : OFFLINE_LABEL}
    </Wrapper>
  );
};

export default ConnectionIndicator;

import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { Message, RetryButton, Wrapper } from 'src/shared/ui/ErrorState/ErrorState.styles.js';

const ErrorState = ({ message, onRetry }) => (
  <Wrapper role="alert">
    <Message>{message}</Message>
    <RetryButton type="button" onClick={onRetry}>
      {RETRY_LABEL}
    </RetryButton>
  </Wrapper>
);

export default ErrorState;

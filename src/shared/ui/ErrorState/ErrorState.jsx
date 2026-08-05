import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { Message, RetryButton, Wrapper } from 'src/shared/ui/ErrorState/ErrorState.styles.js';

const ErrorState = ({ message, onRetry, children }) => (
  <Wrapper role="alert">
    <Message>{message}</Message>
    {onRetry && (
      <RetryButton type="button" onClick={onRetry}>
        {RETRY_LABEL}
      </RetryButton>
    )}
    {children}
  </Wrapper>
);

export default ErrorState;

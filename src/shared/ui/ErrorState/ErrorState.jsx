import Button from 'src/shared/ui/Button/Button.jsx';
import { RETRY_LABEL } from 'src/shared/ui/ErrorState/ErrorState.constants.js';
import { Message, Wrapper } from 'src/shared/ui/ErrorState/ErrorState.styles.js';

const ErrorState = ({ message, onRetry, children }) => (
  <Wrapper role="alert">
    <Message>{message}</Message>
    {onRetry && <Button onClick={onRetry}>{RETRY_LABEL}</Button>}
    {children}
  </Wrapper>
);

export default ErrorState;

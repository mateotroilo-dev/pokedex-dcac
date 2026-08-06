import { Message, Wrapper } from 'src/shared/ui/EmptyState/EmptyState.styles.js';

const EmptyState = ({ message, children }) => (
  <Wrapper>
    <Message>{message}</Message>
    {children}
  </Wrapper>
);

export default EmptyState;

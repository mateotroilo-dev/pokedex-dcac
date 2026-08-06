import { Illustration, Message, Wrapper } from 'src/shared/ui/EmptyState/EmptyState.styles.js';

// Pokebola vacia: decorativa, no aporta informacion que el mensaje no diga ya.
const EmptyState = ({ message, children }) => (
  <Wrapper>
    <Illustration viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M4 32h20a8 8 0 0 0 16 0h20" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
    </Illustration>
    <Message>{message}</Message>
    {children}
  </Wrapper>
);

export default EmptyState;

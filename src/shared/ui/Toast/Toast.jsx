import { TOAST_DISMISS_LABEL } from 'src/shared/ui/Toast/Toast.constants.js';
import { DismissButton, Message, Wrapper } from 'src/shared/ui/Toast/Toast.styles.js';

const Toast = ({ message, variant = 'default', onDismiss }) => (
  <Wrapper $variant={variant}>
    <Message>{message}</Message>
    <DismissButton type="button" onClick={onDismiss} aria-label={TOAST_DISMISS_LABEL}>
      ×
    </DismissButton>
  </Wrapper>
);

export default Toast;

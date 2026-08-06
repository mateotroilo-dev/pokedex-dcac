import { useCallback, useEffect, useRef, useState } from 'react';
import Toast from 'src/shared/ui/Toast/Toast.jsx';
import { ToastContext } from 'src/shared/ui/ToastProvider/ToastProvider.context.js';
import { TOAST_DURATION_MS } from 'src/shared/ui/ToastProvider/ToastProvider.constants.js';
import { Viewport } from 'src/shared/ui/ToastProvider/ToastProvider.styles.js';

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const timeouts = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    clearTimeout(timeouts.current.get(id));
    timeouts.current.delete(id);
  }, []);

  const showToast = useCallback(
    (message, variant = 'default') => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, variant }]);
      timeouts.current.set(
        id,
        setTimeout(() => dismissToast(id), TOAST_DURATION_MS),
      );
    },
    [dismissToast],
  );

  // Si el provider se desmonta con toasts pendientes, sus timers quedarian corriendo y
  // dispararian un dismiss sobre un componente ya fuera del arbol.
  useEffect(() => {
    const pendingTimeouts = timeouts.current;
    return () => pendingTimeouts.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Montada siempre, con o sin toasts: una region que aparece recien con su contenido no la
          anuncia el lector de pantalla. */}
      <Viewport role="status" aria-live="polite">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            variant={toast.variant}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </Viewport>
    </ToastContext.Provider>
  );
};

export default ToastProvider;

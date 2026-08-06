import { useContext } from 'react';
import { ToastContext } from 'src/shared/ui/ToastProvider/ToastProvider.context.js';

export const useToast = () => useContext(ToastContext).showToast;

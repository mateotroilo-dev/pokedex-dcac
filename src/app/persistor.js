import { persistStore } from 'redux-persist';
import store from 'src/app/store.js';

// El unico modulo que llama a `persistStore`. En `store.js` no puede vivir: ese modulo lo importa
// `renderWithProviders`, asi que cada archivo de test despacharia PERSIST y escribiria en el
// localStorage de jsdom sin haberlo pedido.
export const persistor = persistStore(store);

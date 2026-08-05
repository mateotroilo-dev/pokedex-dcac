import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store from 'src/app/store.js';
import { persistor } from 'src/app/persistor.js';

const Providers = ({ children }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>{children}</PersistGate>
  </Provider>
);

export default Providers;

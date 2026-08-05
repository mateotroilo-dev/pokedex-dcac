import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import store from 'src/app/store.js';
import { persistor } from 'src/app/persistor.js';
import { theme } from 'src/shared/styles/theme.js';

const Providers = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  </ThemeProvider>
);

export default Providers;

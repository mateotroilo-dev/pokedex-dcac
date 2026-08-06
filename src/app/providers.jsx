import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import store from 'src/app/store.js';
import { persistor } from 'src/app/persistor.js';
import PokemonGridSkeleton from 'src/features/pokemon-list/components/PokemonGridSkeleton/PokemonGridSkeleton.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';
import AppHeader from 'src/shared/ui/AppHeader/AppHeader.jsx';
import PageLayout from 'src/shared/ui/PageLayout/PageLayout.jsx';
import ToastProvider from 'src/shared/ui/ToastProvider/ToastProvider.jsx';
import { GlobalStyle } from 'src/shared/styles/GlobalStyle.js';
import { theme } from 'src/shared/styles/theme.js';

// El gate bloquea el render hasta rehidratar, asi que su fallback tiene que ser el mismo esqueleto
// que muestra la pagina mientras carga: con `null` la primera pintura es una pantalla en blanco, y
// con la grilla suelta el layout salta al abrirse el gate.
const Providers = ({ children }) => (
  <ThemeProvider theme={theme}>
    {/* Fuera del gate a proposito: adentro, el reset y el fondo del body tampoco existen mientras
        rehidrata, y el fallback se renderiza con los margenes que trae el browser. */}
    <GlobalStyle />
    <Provider store={store}>
      <ToastProvider>
        <PersistGate
          persistor={persistor}
          loading={
            <>
              <AppHeader>{APP_TITLE}</AppHeader>
              <PageLayout>
                <PokemonGridSkeleton />
              </PageLayout>
            </>
          }
        >
          {children}
        </PersistGate>
      </ToastProvider>
    </Provider>
  </ThemeProvider>
);

export default Providers;

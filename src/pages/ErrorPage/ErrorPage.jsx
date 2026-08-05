import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import AppHeader from 'src/shared/ui/AppHeader/AppHeader.jsx';
import ErrorState from 'src/shared/ui/ErrorState/ErrorState.jsx';
import HomeLink from 'src/shared/ui/HomeLink/HomeLink.jsx';
import PageLayout from 'src/shared/ui/PageLayout/PageLayout.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';
import { ERROR_MESSAGE } from 'src/pages/ErrorPage/ErrorPage.constants.js';

// errorElement de la ruta raiz: reemplaza a AppLayout entero en vez de convivir con el, asi que
// monta su propio AppHeader en lugar de heredarlo (ver Contexto del plan de slice 5).
const ErrorPage = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : ERROR_MESSAGE;

  return (
    <>
      <AppHeader>{APP_TITLE}</AppHeader>
      <PageLayout>
        <ErrorState message={message}>
          <HomeLink />
        </ErrorState>
      </PageLayout>
    </>
  );
};

export default ErrorPage;

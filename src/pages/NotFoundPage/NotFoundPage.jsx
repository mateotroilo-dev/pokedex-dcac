import ErrorState from 'src/shared/ui/ErrorState/ErrorState.jsx';
import HomeLink from 'src/shared/ui/HomeLink/HomeLink.jsx';
import PageLayout from 'src/shared/ui/PageLayout/PageLayout.jsx';
import { NOT_FOUND_MESSAGE } from 'src/pages/NotFoundPage/NotFoundPage.constants.js';

const NotFoundPage = () => (
  <PageLayout>
    <ErrorState message={NOT_FOUND_MESSAGE}>
      <HomeLink />
    </ErrorState>
  </PageLayout>
);

export default NotFoundPage;

import { Page, Title } from 'src/shared/ui/PageLayout/PageLayout.styles.js';

const PageLayout = ({ title, children }) => (
  <Page>
    <Title>{title}</Title>
    {children}
  </Page>
);

export default PageLayout;

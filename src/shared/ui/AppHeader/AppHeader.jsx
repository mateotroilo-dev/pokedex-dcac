import { Header, Title } from 'src/shared/ui/AppHeader/AppHeader.styles.js';

// El titulo del h1 llega por children en vez de armar el Link adentro del componente: el fallback
// del PersistGate se pinta fuera de todo contexto de router (ver providers.jsx), y un <Link> ahi
// revienta el invariant de react-router. AppLayout pasa <Link to={ROUTES.HOME}>, el fallback pasa
// el titulo pelado; mismo markup y mismo alto en los dos casos, que es lo que evita el salto de
// layout cuando el gate termina de rehidratar.
const AppHeader = ({ children, nav }) => (
  <Header>
    <Title>{children}</Title>
    {nav}
  </Header>
);

export default AppHeader;

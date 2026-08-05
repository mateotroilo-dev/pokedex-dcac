import { Layout } from 'src/shared/ui/Grid/Grid.styles.js';

const Grid = ({ minItemWidth, children }) => (
  <Layout $minItemWidth={minItemWidth}>{children}</Layout>
);

export default Grid;

import { Fill, Track } from 'src/shared/ui/ProgressBar/ProgressBar.styles.js';

const ProgressBar = ({ value, max, color }) => {
  const percentage = Math.min(value / max, 1) * 100;

  return (
    // La pista va aria-hidden: el valor numerico se muestra como texto al lado, a cargo de quien
    // use esta barra, asi que el lector de pantalla ya lo tiene. Un role="meter" aca solo
    // repetiria el numero.
    <Track aria-hidden="true">
      <Fill $percentage={percentage} $color={color} />
    </Track>
  );
};

export default ProgressBar;

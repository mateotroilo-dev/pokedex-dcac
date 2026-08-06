import { STAT_LABELS, TOTAL_LABEL } from 'src/shared/lib/constants/stats.js';

const sumStats = (stats) => stats.reduce((total, stat) => total + stat.value, 0);

const toWinner = (valueA, valueB) => {
  if (valueA === valueB) return null;
  return valueA > valueB ? 'a' : 'b';
};

const toStatValues = (stats) => Object.fromEntries(stats.map((stat) => [stat.name, stat.value]));

export const toStatComparison = (pokemonA, pokemonB) => {
  const statsA = toStatValues(pokemonA.stats);
  const statsB = toStatValues(pokemonB.stats);

  const rows = Object.entries(STAT_LABELS).map(([name, label]) => {
    const valueA = statsA[name];
    const valueB = statsB[name];
    return { name, label, valueA, valueB, winner: toWinner(valueA, valueB) };
  });

  const totalA = sumStats(pokemonA.stats);
  const totalB = sumStats(pokemonB.stats);

  return [
    ...rows,
    {
      name: 'total',
      label: TOTAL_LABEL,
      valueA: totalA,
      valueB: totalB,
      winner: toWinner(totalA, totalB),
    },
  ];
};

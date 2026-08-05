const toStat = (rawStat) => ({ name: rawStat.stat.name, value: rawStat.base_stat });

const toSprites = (rawSprites) => ({
  front: rawSprites.front_default,
  shiny: rawSprites.front_shiny,
  back: rawSprites.back_default,
  artwork: rawSprites.other?.['official-artwork']?.front_default ?? null,
});

// El detalle crudo de /pokemon/1 pesa 271 KB y 268 KB de eso es `moves`, que la app no usa.
// Recortado a estas claves queda en 759 B: la dex entera pesa 0.98 MB en vez de 350 MB, que es lo
// que hace que el cache entre en los ~5 MB de localStorage.
export const toPokemon = (rawPokemon) => ({
  id: rawPokemon.id,
  name: rawPokemon.name,
  height: rawPokemon.height,
  weight: rawPokemon.weight,
  types: rawPokemon.types.map((rawType) => rawType.type.name),
  stats: rawPokemon.stats.map(toStat),
  abilities: rawPokemon.abilities.map((rawAbility) => rawAbility.ability.name),
  sprites: toSprites(rawPokemon.sprites),
});

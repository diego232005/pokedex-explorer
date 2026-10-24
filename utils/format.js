export function formatPokemonNumber(id) {
  return String(id).padStart(3, '0');
}

export function capitalizeName(name) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

export function getStatLabel(statName) {
  return STAT_LABELS[statName] || capitalizeName(statName);
}

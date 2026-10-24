const BASE_URL = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 20;

// Concept: fetch — network request to a REST API
async function fetchJson(url) {
  const response = await fetch(url);

  // Concept: response.ok — PokéAPI returns plain text on 404, not JSON
  if (!response.ok) {
    if (response.status === 404) {
      const error = new Error('NOT_FOUND');
      error.code = 'NOT_FOUND';
      throw error;
    }
    throw new Error('NETWORK_ERROR');
  }

  return response.json();
}

function extractIdFromUrl(url) {
  const parts = url.replace(/\/$/, '').split('/');
  return Number(parts[parts.length - 1]);
}

export function getListSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getDetailSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export async function fetchPokemonPage(offset = 0, limit = PAGE_SIZE) {
  const data = await fetchJson(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );

  const results = data.results.map((item) => {
    const id = extractIdFromUrl(item.url);
    return {
      id,
      name: item.name,
      imageUrl: getListSpriteUrl(id),
    };
  });

  return {
    results,
    nextOffset: offset + results.length,
    hasMore: Boolean(data.next),
  };
}

export async function fetchPokemonByNameOrId(query) {
  const normalized = String(query).trim().toLowerCase();
  if (!normalized) {
    const error = new Error('EMPTY_QUERY');
    error.code = 'EMPTY_QUERY';
    throw error;
  }

  const data = await fetchJson(`${BASE_URL}/pokemon/${normalized}`);

  return {
    id: data.id,
    name: data.name,
    height: data.height / 10, // decimetres → metres
    weight: data.weight / 10, // hectograms → kilograms
    imageUrl: data.sprites?.other?.['official-artwork']?.front_default
      || getDetailSpriteUrl(data.id),
    types: data.types.map((entry) => entry.type.name),
    stats: data.stats.map((entry) => ({
      name: entry.stat.name,
      value: entry.base_stat,
    })),
  };
}

export { PAGE_SIZE };

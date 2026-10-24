import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { capitalizeName, formatPokemonNumber } from '../utils/format';

// Concept: Image with remote URI needs explicit width and height
export default function PokemonCard({ pokemon, onPress }) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(pokemon)}>
      <Image
        source={{ uri: pokemon.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.number}>#{formatPokemonNumber(pokemon.id)}</Text>
      <Text style={styles.name}>{capitalizeName(pokemon.name)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  image: {
    width: 96,
    height: 96,
  },
  number: {
    marginTop: 4,
    fontSize: 12,
    color: '#777',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
});

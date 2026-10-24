import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import StatusView from '../components/StatusView';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import { fetchPokemonByNameOrId } from '../services/pokeApi';
import { capitalizeName, formatPokemonNumber } from '../utils/format';

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  // Concept: useEffect dependency on id — refetch when route param changes
  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      setStatus('loading');
      setErrorMessage('');
      try {
        const data = await fetchPokemonByNameOrId(id);
        if (cancelled) return;
        setPokemon(data);
        setStatus('success');
      } catch (error) {
        if (cancelled) return;
        if (error.code === 'NOT_FOUND') {
          setStatus('empty');
          setErrorMessage('No se encontró ese Pokémon.');
        } else {
          setStatus('error');
          setErrorMessage('No se pudo cargar la ficha.');
        }
      }
    }

    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [id, retryKey]);

  if (status === 'loading') {
    return <StatusView status="loading" message="Cargando ficha..." />;
  }

  if (status === 'error') {
    return (
      <StatusView
        status="error"
        message={errorMessage}
        onRetry={() => setRetryKey((k) => k + 1)}
      />
    );
  }

  if (status === 'empty' || !pokemon) {
    return (
      <StatusView
        status="empty"
        message={errorMessage}
        onRetry={() => router.replace('/')}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: pokemon.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.name}>{capitalizeName(pokemon.name)}</Text>
      <Text style={styles.number}>#{formatPokemonNumber(pokemon.id)}</Text>

      <View style={styles.types}>
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </View>

      <Text style={styles.meta}>
        Altura: {pokemon.height.toFixed(1)} m · Peso: {pokemon.weight.toFixed(1)} kg
      </Text>

      <Text style={styles.sectionTitle}>Estadísticas base</Text>
      {pokemon.stats.map((stat) => (
        <StatBar key={stat.name} name={stat.name} value={stat.value} />
      ))}

      <View style={styles.backButton}>
        <Button
          title="Volver a la lista"
          onPress={() => router.back()}
          color="#E3350D"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: 220,
    height: 220,
    alignSelf: 'center',
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: '#222',
    marginTop: 8,
  },
  number: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
    marginBottom: 16,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },
  meta: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  backButton: {
    marginTop: 24,
    marginBottom: 40,
  },
});

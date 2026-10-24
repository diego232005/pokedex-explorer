import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import SearchBar from '../components/SearchBar';
import PokemonCard from '../components/PokemonCard';
import StatusView from '../components/StatusView';
import { fetchPokemonPage, fetchPokemonByNameOrId, PAGE_SIZE } from '../services/pokeApi';

export default function HomeScreen() {
  const router = useRouter();

  // Concept: useState — list data and UI status
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState('loading'); // loading | error | empty | success
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Concept: useEffect + dependency array — controls when the request runs
  useEffect(() => {
    if (isSearchMode) return;

    let cancelled = false;

    async function loadFirstPage() {
      setStatus('loading');
      setErrorMessage('');
      try {
        const page = await fetchPokemonPage(0, PAGE_SIZE);
        if (cancelled) return;
        setPokemonList(page.results);
        setOffset(page.nextOffset);
        setHasMore(page.hasMore);
        setStatus(page.results.length ? 'success' : 'empty');
      } catch {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage('No se pudo cargar la lista de Pokémon.');
      }
    }

    loadFirstPage();
    return () => {
      cancelled = true;
    };
  }, [isSearchMode, retryKey]);

  const loadMore = useCallback(async () => {
    if (isSearchMode || loadingMore || !hasMore || status !== 'success') return;

    setLoadingMore(true);
    try {
      const page = await fetchPokemonPage(offset, PAGE_SIZE);
      setPokemonList((prev) => [...prev, ...page.results]);
      setOffset(page.nextOffset);
      setHasMore(page.hasMore);
    } catch {
      // Keep current list; user can keep scrolling later
    } finally {
      setLoadingMore(false);
    }
  }, [isSearchMode, loadingMore, hasMore, status, offset]);

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setIsSearchMode(false);
      setRetryKey((k) => k + 1);
      return;
    }

    setIsSearchMode(true);
    setStatus('loading');
    setErrorMessage('');

    try {
      const pokemon = await fetchPokemonByNameOrId(query);
      setPokemonList([
        {
          id: pokemon.id,
          name: pokemon.name,
          imageUrl: pokemon.imageUrl,
        },
      ]);
      setHasMore(false);
      setStatus('success');
    } catch (error) {
      if (error.code === 'NOT_FOUND') {
        setPokemonList([]);
        setStatus('empty');
        setErrorMessage('No existe un Pokémon con ese nombre o número.');
      } else {
        setStatus('error');
        setErrorMessage('No se pudo completar la búsqueda.');
      }
    }
  };

  const handleRetry = () => {
    if (isSearchMode && searchQuery.trim()) {
      handleSearch();
    } else {
      setIsSearchMode(false);
      setRetryKey((k) => k + 1);
    }
  };

  const openDetail = (pokemon) => {
    router.push(`/detail?id=${pokemon.id}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>PokéDex Explorer</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
      />

      {status === 'loading' && pokemonList.length === 0 ? (
        <StatusView status="loading" message="Cargando Pokémon..." />
      ) : null}

      {status === 'error' ? (
        <StatusView status="error" message={errorMessage} onRetry={handleRetry} />
      ) : null}

      {status === 'empty' ? (
        <StatusView status="empty" message={errorMessage} onRetry={handleRetry} />
      ) : null}

      {status === 'success' ? (
        // Concept: FlatList — efficient list rendering (avoid map for long lists)
        <FlatList
          data={pokemonList}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PokemonCard pokemon={item} onPress={openDetail} />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator color="#E3350D" />
                <Text style={styles.footerText}>Cargando más...</Text>
              </View>
            ) : null
          }
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#E3350D',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: '#666',
  },
});

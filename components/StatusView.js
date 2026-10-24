import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';

// Concept: UI states — loading, error, empty, success
export default function StatusView({ status, message, onRetry }) {
  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E3350D" />
        <Text style={styles.text}>{message || 'Cargando...'}</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {message || 'Ocurrió un error al cargar los datos.'}
        </Text>
        {onRetry ? <Button title="Reintentar" onPress={onRetry} color="#E3350D" /> : null}
      </View>
    );
  }

  if (status === 'empty') {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          {message || 'No se encontraron resultados.'}
        </Text>
        {onRetry ? <Button title="Reintentar" onPress={onRetry} color="#E3350D" /> : null}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#B00020',
    textAlign: 'center',
  },
});

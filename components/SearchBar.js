import { View, TextInput, Button, StyleSheet } from 'react-native';

// Concept: TextInput + Button controlled with useState
export default function SearchBar({ value, onChangeText, onSearch }) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Busca por nombre o número..."
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      <Button title="Buscar" onPress={onSearch} color="#E3350D" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
});

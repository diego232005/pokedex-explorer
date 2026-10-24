import { View, Text, StyleSheet } from 'react-native';
import { getTypeColor } from '../constants/typeColors';
import { capitalizeName } from '../utils/format';

export default function TypeBadge({ type }) {
  return (
    <View style={[styles.badge, { backgroundColor: getTypeColor(type) }]}>
      <Text style={styles.text}>{capitalizeName(type)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
});

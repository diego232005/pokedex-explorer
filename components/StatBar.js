import { View, Text, StyleSheet } from 'react-native';
import { getStatLabel } from '../utils/format';

const MAX_STAT = 255;

export default function StatBar({ name, value }) {
  const widthPercent = Math.min((value / MAX_STAT) * 100, 100);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{getStatLabel(name)}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${widthPercent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 88,
    fontSize: 13,
    color: '#444',
  },
  value: {
    width: 36,
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EEE',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#3B5CA8',
  },
});

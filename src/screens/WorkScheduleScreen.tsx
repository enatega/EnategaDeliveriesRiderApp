import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../components/Text';

export default function WorkScheduleScreen() {
  return <View style={styles.container}><Text>Work Schedule</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' } });

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../components/Text';

export default function BankManagementScreen() {
  return <View style={styles.container}><Text>Bank Management</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center' } });

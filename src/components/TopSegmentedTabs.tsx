import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import { useAppTheme } from '../theme/ThemeProvider';

type Props<T extends string> = {
  tabs: readonly T[];
  activeTab: T;
  onChange: (tab: T) => void;
  labelMap: Record<T, string>;
};

export default function TopSegmentedTabs<T extends string>({ tabs, activeTab, onChange, labelMap }: Props<T>) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = tab === activeTab;
        return (
          <Pressable key={tab} style={[styles.tab, active && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]} onPress={() => onChange(tab)}>
            <Text
              variant="caption"
              weight={active ? 'semiBold' : 'medium'}
              color={active ? theme.colors.gray900 : theme.colors.gray500}
              style={styles.label}
            >
              {labelMap[tab]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
});

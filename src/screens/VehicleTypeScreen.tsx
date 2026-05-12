import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import Text from '../components/Text';
import { useSidebar } from '../hooks/useSidebar';
import { useTranslations } from '../localization/LocalizationProvider';
import { useAppTheme } from '../theme/ThemeProvider';
import { MainStackParamList } from '../navigation/types';

type VehicleTypeOption = 'bicycle' | 'motorcycle' | 'car' | 'truck';

export default function VehicleTypeScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const sidebar = useSidebar();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedType, setSelectedType] = useState<VehicleTypeOption>('motorcycle');

  const options = useMemo<Array<{ key: VehicleTypeOption; label: string; Icon: React.ComponentType<{ color: string }> }>>(
    () => [
      { key: 'bicycle', label: t('vehicle_type_bicycle'), Icon: BicycleIcon },
      { key: 'motorcycle', label: t('vehicle_type_motorcycle'), Icon: MotorcycleIcon },
      { key: 'car', label: t('vehicle_type_car'), Icon: CarIcon },
      { key: 'truck', label: t('vehicle_type_truck'), Icon: TruckIcon },
    ],
    [t],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={sidebar.openSidebar} style={styles.menuButton}>
          <HamburgerIcon color={theme.colors.gray900} />
        </Pressable>
        <Text
          weight="semiBold"
          style={{ fontSize: theme.typography.size.md, lineHeight: theme.typography.lineHeight.md }}
        >
          {t('menu_vehicle_type')}
        </Text>
        <View style={styles.menuButton} />
      </View>

      <View style={styles.optionsSection}>
        {options.map((option) => (
          <VehicleTypeRow
            key={option.key}
            label={option.label}
            Icon={option.Icon}
            selected={selectedType === option.key}
            onPress={() => setSelectedType(option.key)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          label={t('vehicle_type_update_button')}
          onPress={() => navigation.goBack()}
          textColor={theme.colors.gray900}
          containerStyle={styles.updateButton}
        />
      </View>

      <Sidebar
        visible={sidebar.sidebarOpen}
        availability={sidebar.availability}
        onAvailabilityChange={sidebar.setAvailability}
        onClose={sidebar.closeSidebar}
        onNavigate={(screen) => navigation.navigate(screen)}
        onSwitchTab={() => navigation.navigate('Home', { screen: 'ProfileTab' })}
      />
    </SafeAreaView>
  );
}

function VehicleTypeRow({
  label,
  Icon,
  selected,
  onPress,
}: {
  label: string;
  Icon: React.ComponentType<{ color: string }>;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useAppTheme();
  return (
    <Pressable onPress={onPress} style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}>
      <View style={styles.rowLeft}>
        <Icon color={theme.colors.gray600} />
        <Text
          weight="semiBold"
          style={[
            styles.rowLabel,
            {
              color: theme.colors.gray900,
              fontSize: theme.typography.size.sm,
              lineHeight: 20,
            },
          ]}
        >
          {label}
        </Text>
      </View>
      <SelectionCircle selected={selected} />
    </Pressable>
  );
}

function SelectionCircle({ selected }: { selected: boolean }) {
  const { theme } = useAppTheme();
  return (
    <View
      style={[
        styles.selectionOuter,
        { borderColor: selected ? theme.colors.primary : theme.colors.gray300 },
      ]}
    >
      {selected ? <View style={[styles.selectionInner, { backgroundColor: theme.colors.primary }]} /> : null}
    </View>
  );
}

function HamburgerIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M4.5 7.5H19.5M4.5 12H19.5M4.5 16.5H19.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BicycleIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Circle cx={7} cy={21} r={4.25} stroke={color} strokeWidth={1.8} />
      <Circle cx={21} cy={21} r={4.25} stroke={color} strokeWidth={1.8} />
      <Path d="M7 21L12 12H16L13 21M16 12L21 21M10 8H14" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MotorcycleIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Circle cx={8} cy={20.5} r={3.75} stroke={color} strokeWidth={1.8} />
      <Circle cx={21} cy={20.5} r={3.75} stroke={color} strokeWidth={1.8} />
      <Path d="M8 20.5L12.5 15H17L20 20.5M13 13.5H16.5L18 16.5M12 15L9.5 15" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={3} y={10} width={4} height={4} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function CarIcon({ color }: { color: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Path d="M5 20L8.5 14H23.5L27 20V24H5V20Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Circle cx={10} cy={24} r={2} stroke={color} strokeWidth={1.8} />
      <Circle cx={22} cy={24} r={2} stroke={color} strokeWidth={1.8} />
      <Path d="M10 14V11H22V14" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  );
}

function TruckIcon({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Rect x={2.5} y={9} width={12} height={12} stroke={color} strokeWidth={1.8} />
      <Path d="M14.5 12H20L24.5 16V21H14.5V12Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Circle cx={8} cy={21} r={2.25} stroke={color} strokeWidth={1.8} />
      <Circle cx={20} cy={21} r={2.25} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  optionsSection: {
    marginTop: 39,
    marginHorizontal: 21,
  },
  row: {
    minHeight: 62,
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 36,
    gap: 16,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  selectionOuter: {
    position: 'absolute',
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  updateButton: {
    height: 54,
    borderRadius: 40,
  },
});

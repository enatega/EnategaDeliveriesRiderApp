import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';
import Text from '../components/Text';
import { useSidebar } from '../hooks/useSidebar';
import { useTranslations } from '../localization/LocalizationProvider';
import { MainStackParamList } from '../navigation/types';
import { useAppTheme } from '../theme/ThemeProvider';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export default function WorkScheduleScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const sidebar = useSidebar();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [enabledDays, setEnabledDays] = useState<Record<DayKey, boolean>>({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: true,
  });

  const dayItems = useMemo<Array<{ key: DayKey; label: string }>>(
    () => [
      { key: 'mon', label: t('work_schedule_mon') },
      { key: 'tue', label: t('work_schedule_tue') },
      { key: 'wed', label: t('work_schedule_wed') },
      { key: 'thu', label: t('work_schedule_thu') },
      { key: 'fri', label: t('work_schedule_fri') },
      { key: 'sat', label: t('work_schedule_sat') },
      { key: 'sun', label: t('work_schedule_sun') },
    ],
    [t],
  );

  const toggleDay = (day: DayKey) => {
    setEnabledDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={sidebar.openSidebar} style={styles.menuButton}>
          <HamburgerIcon color={theme.colors.gray900} />
        </Pressable>
        <Text
          weight="semiBold"
          style={{ color: theme.colors.gray900, fontSize: theme.typography.size.md, lineHeight: theme.typography.lineHeight.md }}
        >
          {t('menu_work_schedule')}
        </Text>
        <View style={styles.menuButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsWrap}>
          {dayItems.map((day) => (
            <DayScheduleCard
              key={day.key}
              dayLabel={day.label}
              enabled={enabledDays[day.key]}
              onToggle={() => toggleDay(day.key)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={t('work_schedule_update_button')}
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

function DayScheduleCard({
  dayLabel,
  enabled,
  onToggle,
}: {
  dayLabel: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.dayCard, { borderColor: theme.colors.gray200 }]}>
      <View style={styles.dayHeaderRow}>
        <Text
          weight="semiBold"
          style={{ color: theme.colors.black, fontSize: theme.typography.size.sm, lineHeight: 20 }}
        >
          {dayLabel}
        </Text>
        <Pressable
          onPress={onToggle}
          style={[
            styles.switchTrack,
            { backgroundColor: enabled ? theme.colors.primary : theme.colors.gray300 },
          ]}
        >
          <View
            style={[
              styles.switchThumb,
              {
                backgroundColor: theme.colors.white,
                shadowColor: theme.colors.black,
                transform: [{ translateX: enabled ? 0 : -27 }],
              },
            ]}
          />
        </Pressable>
      </View>

      <View style={styles.timeRow}>
        <TimeInput value="00:00" />
        <View style={[styles.timeDash, { backgroundColor: theme.colors.gray300 }]} />
        <TimeInput value="23:59" />
        <Pressable style={styles.addButton}>
          <AddIcon color={theme.colors.primary} iconColor={theme.colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

function TimeInput({ value }: { value: string }) {
  const { theme } = useAppTheme();
  return (
    <View
      style={[
        styles.timeInput,
        {
          borderColor: theme.colors.gray300,
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.black,
        },
      ]}
    >
      <Text style={{ color: theme.colors.gray800, fontSize: theme.typography.size.sm, lineHeight: 20 }}>
        {value}
      </Text>
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

function AddIcon({ color, iconColor }: { color: string; iconColor: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Circle cx={14} cy={14} r={12.5} fill={color} />
      <Path d="M14 8.5V19.5M8.5 14H19.5" stroke={iconColor} strokeWidth={1.8} strokeLinecap="round" />
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
  scrollContent: {
    paddingTop: 32,
    paddingBottom: 130,
  },
  cardsWrap: {
    paddingHorizontal: 18,
    gap: 12,
  },
  dayCard: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 18,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  switchTrack: {
    width: 51,
    height: 24,
    borderRadius: 12,
    marginLeft: 'auto',
    paddingHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1.5,
    elevation: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  timeDash: {
    width: 25,
    height: 2,
  },
  addButton: {
    width: 28,
    height: 28,
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
  },
  updateButton: {
    height: 54,
    borderRadius: 40,
  },
});

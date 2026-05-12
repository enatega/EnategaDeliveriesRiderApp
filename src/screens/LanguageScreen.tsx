import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../components/Button';
import Text from '../components/Text';
import { useLocalization, useTranslations } from '../localization/LocalizationProvider';
import { SupportedLanguage } from '../localization/i18n';
import { MainStackParamList } from '../navigation/types';
import { useAppTheme } from '../theme/ThemeProvider';

type LanguageOptionKey = 'english' | 'francais' | 'japanese' | 'chinese' | 'deutsche' | 'arabic';

export default function LanguageScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const { language, setLanguage } = useLocalization();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOptionKey>(
    language === 'fr' ? 'francais' : 'english',
  );

  const options = useMemo<
    Array<{
      key: LanguageOptionKey;
      label: string;
      mappedLanguage?: SupportedLanguage;
      Flag: React.ComponentType;
    }>
  >(
    () => [
      { key: 'english', label: t('language_option_english'), mappedLanguage: 'en', Flag: EnglishFlag },
      { key: 'francais', label: t('language_option_francais'), mappedLanguage: 'fr', Flag: FrenchFlag },
      { key: 'japanese', label: t('language_option_japanese'), Flag: JapaneseFlag },
      { key: 'chinese', label: t('language_option_chinese'), Flag: ChineseFlag },
      { key: 'deutsche', label: t('language_option_deutsche'), Flag: GermanFlag },
      { key: 'arabic', label: t('language_option_arabic'), Flag: ArabicFlag },
    ],
    [t],
  );

  const onUpdateLanguage = async () => {
    const selected = options.find((opt) => opt.key === selectedLanguage);
    if (selected?.mappedLanguage) {
      await setLanguage(selected.mappedLanguage);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
          <BackIcon color={theme.colors.gray800} />
        </Pressable>
        <Text
          weight="semiBold"
          style={{ color: theme.colors.gray900, fontSize: theme.typography.size.md, lineHeight: theme.typography.lineHeight.md }}
        >
          {t('menu_language')}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.list}>
          {options.map((option) => (
            <LanguageRow
              key={option.key}
              label={option.label}
              Flag={option.Flag}
              selected={selectedLanguage === option.key}
              onPress={() => setSelectedLanguage(option.key)}
            />
          ))}
        </View>

        <Button
          label={t('language_update_button')}
          onPress={onUpdateLanguage}
          textColor={theme.colors.gray900}
          containerStyle={styles.updateButton}
        />
      </View>
    </SafeAreaView>
  );
}

function LanguageRow({
  label,
  Flag,
  selected,
  onPress,
}: {
  label: string;
  Flag: React.ComponentType;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onPress} style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}>
      <Flag />
      <Text
        weight="semiBold"
        style={{ flex: 1, color: theme.colors.black, fontSize: theme.typography.size.sm, lineHeight: 20 }}
      >
        {label}
      </Text>
      <View style={[styles.selectionCircle, { borderColor: selected ? theme.colors.primary : theme.colors.gray300 }]}>
        {selected ? <View style={[styles.selectionDot, { backgroundColor: theme.colors.primary }]} /> : null}
      </View>
    </Pressable>
  );
}

function BackIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EnglishFlag() {
  return (
    <View style={[styles.flagBase, { backgroundColor: '#FFFFFF' }]}>
      <View style={[styles.flagCrossVertical, { backgroundColor: '#C8102E' }]} />
      <View style={[styles.flagCrossHorizontal, { backgroundColor: '#C8102E' }]} />
    </View>
  );
}

function FrenchFlag() {
  return (
    <View style={[styles.flagBase, styles.flagRow]}>
      <View style={{ flex: 1, backgroundColor: '#002654' }} />
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
      <View style={{ flex: 1, backgroundColor: '#CE1126' }} />
    </View>
  );
}

function JapaneseFlag() {
  return (
    <View style={[styles.flagBase, { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }]}>
      <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: '#BC002D' }} />
    </View>
  );
}

function ChineseFlag() {
  return (
    <View style={[styles.flagBase, { backgroundColor: '#EE1C25', alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: 3, paddingTop: 2 }]}>
      <View style={{ width: 4, height: 4, borderRadius: 1, backgroundColor: '#FFDE00' }} />
    </View>
  );
}

function GermanFlag() {
  return (
    <View style={[styles.flagBase, styles.flagColumn]}>
      <View style={{ flex: 1, backgroundColor: '#000000' }} />
      <View style={{ flex: 1, backgroundColor: '#DD0000' }} />
      <View style={{ flex: 1, backgroundColor: '#FFCE00' }} />
    </View>
  );
}

function ArabicFlag() {
  return (
    <View style={[styles.flagBase, { backgroundColor: '#006C35', alignItems: 'center', justifyContent: 'center' }]}>
      <View style={{ width: 16, height: 2, backgroundColor: '#FFFFFF' }} />
    </View>
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
  iconButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  content: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 24,
  },
  list: {
    gap: 16,
  },
  row: {
    height: 36,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
  },
  flagBase: {
    width: 30,
    height: 18,
  },
  flagRow: {
    flexDirection: 'row',
  },
  flagColumn: {
    flexDirection: 'column',
  },
  flagCrossVertical: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    width: 6,
  },
  flagCrossHorizontal: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    height: 6,
  },
  selectionCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  updateButton: {
    height: 54,
    borderRadius: 40,
  },
});

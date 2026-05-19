import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Text from '../components/Text';
import TextInput from '../components/TextInput';
import { useTranslations } from '../localization/LocalizationProvider';
import { MainStackParamList } from '../navigation/types';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = NativeStackScreenProps<MainStackParamList, 'OrderChat'>;

export default function OrderChatScreen({ navigation, route }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const title = route.params?.name?.trim() || '—';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { borderBottomColor: theme.colors.gray200, backgroundColor: theme.colors.surface }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18L9 12L15 6"
              stroke={theme.colors.gray900}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
        <Text weight="semiBold" style={{ color: theme.colors.gray900, fontSize: 22, lineHeight: 30 }}>
          {title}
        </Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.emptyState}>
        <Text style={{ color: theme.colors.gray500, fontSize: 22, lineHeight: 30 }}>
          {t('chat_no_messages')}
        </Text>
      </View>

      <View style={[styles.inputArea, { borderTopColor: theme.colors.gray200, paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={t('chat_enter_concern')}
          containerStyle={styles.inputWrap}
          style={styles.input}
        />
        <Pressable style={[styles.sendButton, { backgroundColor: theme.colors.primary }]} hitSlop={6}>
          <Text weight="medium" style={{ color: theme.colors.gray900, fontSize: 20, lineHeight: 28 }}>
            {t('chat_send')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputArea: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrap: {
    flex: 1,
  },
  input: {
    fontSize: 20,
    lineHeight: 28,
  },
  sendButton: {
    height: 48,
    minWidth: 100,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

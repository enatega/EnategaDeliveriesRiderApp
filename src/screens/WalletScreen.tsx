import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/Text';
import { RiderWalletHistoryItem } from '../api/riderWalletTypes';
import { useTranslations } from '../localization/LocalizationProvider';
import { useAppTheme } from '../theme/ThemeProvider';
import {
  useRiderWalletBalanceQuery,
  useRiderWalletHistoryInfiniteQuery,
  useRiderWalletWithdrawMutation,
} from '../hooks/useRiderWalletQueries';
import WalletHeader from './wallet/components/WalletHeader';
import WalletBalanceCard from './wallet/components/WalletBalanceCard';
import WalletTransactionRow from './wallet/components/WalletTransactionRow';
import WithdrawBottomSheet from './wallet/components/WithdrawBottomSheet';
import WithdrawSuccessModal from './wallet/components/WithdrawSuccessModal';

const parseWithdrawAmount = (value: string): number => {
  const normalized = value.replace(/[^0-9.]/g, '');
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
};

export default function WalletScreen() {
  const navigation = useNavigation();
  const { t } = useTranslations('app');
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [isWithdrawSheetVisible, setIsWithdrawSheetVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  const [successMessage, setSuccessMessage] = useState(t('wallet_withdraw_success_subtitle'));

  const balanceQuery = useRiderWalletBalanceQuery();
  const historyQuery = useRiderWalletHistoryInfiniteQuery('all');
  const withdrawMutation = useRiderWalletWithdrawMutation();

  const transactions = useMemo(
    () => historyQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [historyQuery.data?.pages],
  );

  const refreshing = balanceQuery.isRefetching || historyQuery.isRefetching;

  const onRefresh = () => {
    balanceQuery.refetch();
    historyQuery.refetch();
  };

  const onOpenWithdraw = () => {
    setWithdrawAmountInput('');
    setIsWithdrawSheetVisible(true);
  };

  const onConfirmWithdraw = async () => {
    const amount = parseWithdrawAmount(withdrawAmountInput);
    if (amount <= 0) {
      return;
    }

    try {
      const response = await withdrawMutation.mutateAsync({ amount });
      setSuccessMessage(response.eta_message || t('wallet_withdraw_success_subtitle'));
      setIsWithdrawSheetVisible(false);
      setIsSuccessModalVisible(true);
    } catch {
      // Error states are intentionally non-blocking for now.
    }
  };

  const onEndReached = () => {
    if (historyQuery.hasNextPage && !historyQuery.isFetchingNextPage) {
      historyQuery.fetchNextPage();
    }
  };

  const renderItem: ListRenderItem<RiderWalletHistoryItem> = ({ item }) => (
    <WalletTransactionRow item={item} />
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <WalletHeader
        title={t('nav_wallet')}
        onBackPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.transaction_id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom + 110, 130) },
        ]}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <WalletBalanceCard
              currentBalance={balanceQuery.data?.current_balance ?? 0}
              onWithdrawPress={onOpenWithdraw}
              withdrawLabel={t('wallet_withdraw_now')}
              balanceLabel={t('wallet_current_balance')}
            />

            <Text weight="semiBold" style={[styles.sectionTitle, { color: theme.colors.gray900 }]}>
              {t('wallet_recent_transactions')}
            </Text>
          </View>
        }
        ListEmptyComponent={
          historyQuery.isLoading ? (
            <View style={styles.centered}><ActivityIndicator color={theme.colors.primary} /></View>
          ) : (
            <View style={styles.centered}>
              <Text style={{ color: theme.colors.gray500 }}>{t('wallet_no_transactions')}</Text>
            </View>
          )
        }
        ListFooterComponent={
          historyQuery.isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      />

      <WithdrawBottomSheet
        visible={isWithdrawSheetVisible}
        availableAmount={balanceQuery.data?.available_amount ?? 0}
        amountInput={withdrawAmountInput}
        onAmountInputChange={setWithdrawAmountInput}
        onClose={() => setIsWithdrawSheetVisible(false)}
        onConfirm={onConfirmWithdraw}
        confirmLabel={t('wallet_confirm_withdraw')}
        availableLabel={t('wallet_available_amount')}
        enterAmountLabel={t('wallet_enter_amount')}
        isLoading={withdrawMutation.isPending}
        bottomInset={insets.bottom}
      />

      <WithdrawSuccessModal
        visible={isSuccessModalVisible}
        title={t('wallet_withdraw_success_title')}
        subtitle={successMessage}
        onClose={() => setIsSuccessModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  listHeader: {
    paddingTop: 8,
    paddingBottom: 10,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 28,
  },
  centered: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

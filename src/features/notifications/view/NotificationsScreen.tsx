import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { RefreshControl, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../shared/components/AppHeader';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { LoadingView } from '../../../shared/components/LoadingView';
import type { NotificationItem } from '../model/Notification';
import { useNotificationsViewModel } from '../viewmodel/useNotificationsViewModel';

type NotificationsScreenProps = {
  onUnreadCountChange?: (count: number) => void;
  onBackPress?: () => void;
};

export const NotificationsScreen = ({ onBackPress, onUnreadCountChange }: NotificationsScreenProps) => {
  const viewModel = useNotificationsViewModel();
  const { loadNotifications } = viewModel;

  useFocusEffect(
    useCallback(() => {
      loadNotifications(true);
    }, [loadNotifications]),
  );

  useEffect(() => {
    onUnreadCountChange?.(viewModel.unreadCount);
  }, [onUnreadCountChange, viewModel.unreadCount]);

  const handleNotificationPress = (notification: NotificationItem) => {
    if (!notification.isRead) {
      viewModel.markRead(notification.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {onBackPress ? (
        <AppHeader title="Notifications" showBack onBackPress={onBackPress} />
      ) : null}
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={viewModel.isRefreshing}
            onRefresh={() => viewModel.loadNotifications(true)}
            tintColor="#6B941F"
            colors={['#6B941F']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>
              {viewModel.unreadCount > 0
                ? `${viewModel.unreadCount} unread`
                : 'All caught up'}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={viewModel.unreadCount === 0 || viewModel.isUpdating}
            onPress={viewModel.markAllRead}
            style={[
              styles.markAllButton,
              (viewModel.unreadCount === 0 || viewModel.isUpdating) && styles.disabledButton,
            ]}
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </Pressable>
        </View>

        <ErrorMessage message={viewModel.error} />
        {viewModel.isLoading ? <LoadingView /> : null}

        {!viewModel.isLoading && viewModel.notifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={28} color="#6B941F" />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>Appointment updates and reminders will appear here.</Text>
          </View>
        ) : null}

        {!viewModel.isLoading
          ? viewModel.notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={() => handleNotificationPress(notification)}
              />
            ))
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};

type NotificationCardProps = {
  notification: NotificationItem;
  onPress: () => void;
};

const NotificationCard = ({ notification, onPress }: NotificationCardProps) => {
  const createdAt = new Date(notification.createdAt);
  const formattedDate = Number.isNaN(createdAt.getTime())
    ? 'Date unavailable'
    : createdAt.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, !notification.isRead && styles.unreadCard]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, !notification.isRead && styles.unreadIcon]}>
          <Ionicons
            name={notification.isRead ? 'notifications-outline' : 'notifications'}
            size={22}
            color="#6B941F"
          />
        </View>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.cardTitle}>{notification.title}</Text>
          <Text style={styles.cardDate}>{formattedDate}</Text>
        </View>
        {!notification.isRead ? <View style={styles.unreadDot} /> : null}
      </View>

      <Text style={styles.cardMessage}>{notification.message}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  title: {
    color: '#303A28',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#66715E',
    fontSize: 14,
    marginTop: 5,
  },
  markAllButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D2',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  markAllText: {
    color: '#6B941F',
    fontSize: 12,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyCard: {
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 19,
  },
  emptyTitle: {
    color: '#303A28',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: '#66715E',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#FCFDF9',
    borderColor: '#BFD2A7',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 15,
    marginRight: 12,
  },
  unreadIcon: {
    backgroundColor: '#E9F2DA',
  },
  cardTitleWrap: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    color: '#1F271A',
    fontSize: 16,
    fontWeight: '800',
  },
  cardDate: {
    color: '#66715E',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    backgroundColor: '#6B941F',
    borderRadius: 5,
  },
  cardMessage: {
    color: '#526249',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
});

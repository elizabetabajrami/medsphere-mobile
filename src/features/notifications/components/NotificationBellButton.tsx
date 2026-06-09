import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type NotificationBellButtonProps = {
  unreadCount: number;
  onPress: () => void;
};

export const NotificationBellButton = ({ unreadCount, onPress }: NotificationBellButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Open notifications"
    onPress={onPress}
    style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
  >
    <Ionicons name="notifications-outline" size={23} color="#6B941F" />
    {unreadCount > 0 ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
      </View>
    ) : null}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D2',
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -3,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D92D20',
    borderColor: '#FFFFFF',
    borderRadius: 9,
    borderWidth: 2,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});

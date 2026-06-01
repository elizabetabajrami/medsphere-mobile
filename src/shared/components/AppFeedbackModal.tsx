import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type FeedbackType = 'success' | 'error' | 'info';
type IconName = ComponentProps<typeof Ionicons>['name'];

type AppFeedbackModalProps = {
  visible: boolean;
  type: FeedbackType;
  title: string;
  message: string;
  primaryButtonText: string;
  onClose: () => void;
};

const feedbackStyles: Record<
  FeedbackType,
  {
    icon: IconName;
    color: string;
    backgroundColor: string;
    borderColor: string;
  }
> = {
  success: {
    icon: 'checkmark-circle',
    color: '#6B941F',
    backgroundColor: '#F2F6EC',
    borderColor: '#DDEACB',
  },
  error: {
    icon: 'alert-circle',
    color: '#C2413A',
    backgroundColor: '#FFF1EF',
    borderColor: '#F6D0CC',
  },
  info: {
    icon: 'information-circle',
    color: '#4F6F1D',
    backgroundColor: '#F2F6EC',
    borderColor: '#DDEACB',
  },
};

export const AppFeedbackModal = ({
  visible,
  type,
  title,
  message,
  primaryButtonText,
  onClose,
}: AppFeedbackModalProps) => {
  const currentStyle = feedbackStyles[type];

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: currentStyle.backgroundColor,
                borderColor: currentStyle.borderColor,
              },
            ]}
          >
            <Ionicons name={currentStyle.icon} size={34} color={currentStyle.color} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: currentStyle.color },
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 39, 26, 0.42)',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    backgroundColor: '#FCFDF9',
    borderColor: '#E8EEDF',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
    elevation: 8,
  },
  iconContainer: {
    width: 66,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 18,
  },
  title: {
    color: '#1F271A',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: '#66715E',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginTop: 24,
  },
  primaryButtonPressed: {
    opacity: 0.88,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

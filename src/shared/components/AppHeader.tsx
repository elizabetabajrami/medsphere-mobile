import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
};

export const AppHeader = ({ title, showBack = false, onBackPress }: AppHeaderProps) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    <View style={styles.header}>
      {showBack ? (
        <Pressable accessibilityRole="button" onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#303A28" />
        </Pressable>
      ) : (
        <View style={styles.headerSpacer} />
      )}

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAF5',
  },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 14,
    borderWidth: 1,
  },
  title: {
    flex: 1,
    color: '#303A28',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 42,
  },
});

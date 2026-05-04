import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const LoadingView = () => (
  <View style={styles.container}>
    <ActivityIndicator />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
});

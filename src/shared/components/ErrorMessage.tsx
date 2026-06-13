import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type ErrorMessageProps = {
  message?: string | null;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={18} color="#B42318" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF1EF',
    borderColor: '#F1CFCF',
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    flex: 1,
    color: '#B42318',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
});

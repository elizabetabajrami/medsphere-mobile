import { StyleSheet, Text } from 'react-native';

type ErrorMessageProps = {
  message?: string | null;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return <Text style={styles.text}>{message}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: '#b00020',
    marginBottom: 12,
  },
});

import type { ComponentProps } from 'react';
import { StyleSheet, TextInput } from 'react-native';

type CustomInputProps = ComponentProps<typeof TextInput>;

export const CustomInput = (props: CustomInputProps) => (
  <TextInput
    autoCapitalize="none"
    placeholderTextColor="#777"
    style={[styles.input, props.style]}
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
});

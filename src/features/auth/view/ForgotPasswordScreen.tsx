import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { AuthStackParamList } from '../../../navigation/types';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { authService } from '../service/authService';

type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword(email.trim());
      setMessage('Password reset request sent.');
    } catch {
      setError('Unable to send password reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Ionicons name="heart" size={30} color="#FFFFFF" />
          </View>

          <Text style={styles.brand}>MedSphere</Text>
          <Text style={styles.subtitle}>Reset your password</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#8A9581" style={styles.inputIcon} />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#A7B09E"
                  style={styles.input}
                  value={email}
                />
              </View>
            </View>

            <ErrorMessage message={error} />
            {message && <Text style={styles.successMessage}>{message}</Text>}

            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
              onPress={handleForgotPassword}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && !isLoading && styles.primaryButtonPressed,
                isLoading && styles.primaryButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Send reset link</Text>
              )}
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Login')}
            style={styles.backButton}
          >
            <Text style={styles.footerLink}>Back to Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    backgroundColor: '#FCFDF9',
    borderColor: '#E8EEDF',
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 4,
  },
  logoContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 18,
    marginBottom: 18,
  },
  brand: {
    color: '#6B941F',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#66715E',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 28,
  },
  form: {
    width: '100%',
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: '#303A28',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D2',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1F271A',
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 15 : 11,
  },
  successMessage: {
    color: '#6B941F',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  primaryButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
    marginTop: 4,
    width: '100%',
  },
  primaryButtonPressed: {
    opacity: 0.88,
  },
  primaryButtonDisabled: {
    opacity: 0.72,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  backButton: {
    marginTop: 24,
  },
  footerLink: {
    color: '#6B941F',
    fontSize: 14,
    fontWeight: '800',
  },
});

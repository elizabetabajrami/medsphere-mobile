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
import { AppFeedbackModal } from '../../../shared/components/AppFeedbackModal';
import { AppHeader } from '../../../shared/components/AppHeader';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { authService } from '../service/authService';

type ResetPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen = ({ navigation, route }: ResetPasswordScreenProps) => {
  const initialEmail = route.params?.email || '';
  const initialCode = route.params?.code || '';
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialCode);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Login');
  };

  const handleResetPassword = async () => {
    setError(null);

    const normalizedEmail = email.trim();
    const normalizedCode = code.trim();

    if (!normalizedEmail) {
      setError('Email is required.');
      return;
    }

    if (!normalizedCode) {
      setError('Reset code is required.');
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Password and confirmation are required.');
      return;
    }

    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword({
        email: normalizedEmail,
        code: normalizedCode,
        password,
      });
      setIsSuccessModalVisible(true);
    } catch {
      setError('Unable to reset password. Please request a new code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessModalVisible(false);
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <AppHeader title="New Password" showBack onBackPress={handleBack} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Ionicons name="lock-closed-outline" size={30} color="#FFFFFF" />
          </View>

          <Text style={styles.brand}>Reset password</Text>
          <Text style={styles.subtitle}>Enter the email code and create a new password.</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#8A9581"
                  style={styles.inputIcon}
                />
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

            <View style={styles.field}>
              <Text style={styles.label}>Reset code</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color="#8A9581"
                  style={styles.inputIcon}
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={setCode}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#A7B09E"
                  style={styles.input}
                  value={code}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>New password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#8A9581"
                  style={styles.inputIcon}
                />
                <TextInput
                  onChangeText={setPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#A7B09E"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#8A9581"
                  style={styles.inputIcon}
                />
                <TextInput
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#A7B09E"
                  secureTextEntry
                  style={styles.input}
                  value={confirmPassword}
                />
              </View>
            </View>

            <ErrorMessage message={error} />

            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
              onPress={handleResetPassword}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && !isLoading && styles.primaryButtonPressed,
                isLoading && styles.primaryButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Update Password</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <AppFeedbackModal
        visible={isSuccessModalVisible}
        type="success"
        title="Password Updated"
        message="You can now sign in with your new password."
        primaryButtonText="Sign In"
        onClose={handleSuccessClose}
      />
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
    textAlign: 'center',
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
});

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
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
import type { UserRole } from '../model/AuthTypes';
import { useLoginViewModel } from '../viewmodel/useLoginViewModel';
import { AppHeader } from '../../../shared/components/AppHeader';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import type { AuthStackParamList } from '../../../navigation/types';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'> & {
  onAuthenticated: (role: UserRole) => void;
};

export const LoginScreen = ({ navigation, onAuthenticated }: LoginScreenProps) => {
  const viewModel = useLoginViewModel();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!viewModel.pendingVerificationEmail) {
      return;
    }

    navigation.navigate('VerifyEmail', {
      email: viewModel.pendingVerificationEmail,
      from: 'Login',
    });
  }, [navigation, viewModel.pendingVerificationEmail]);

  const handleLogin = async () => {
    const role = await viewModel.login();

    if (role) {
      onAuthenticated(role);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Landing');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <AppHeader title="Sign In" showBack onBackPress={handleBack} />
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
          <Text style={styles.subtitle}>Welcome back</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#8A9581" style={styles.inputIcon} />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={viewModel.setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#A7B09E"
                  style={styles.input}
                  value={viewModel.email}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#8A9581"
                  style={styles.inputIcon}
                />
                <TextInput
                  onChangeText={viewModel.setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#A7B09E"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={viewModel.password}
                />
                <Pressable
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                  onPress={() => setShowPassword((current) => !current)}
                  style={styles.passwordToggle}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={21}
                    color="#6B755F"
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotButton}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <ErrorMessage message={viewModel.error} />

            <Pressable
              accessibilityRole="button"
              disabled={viewModel.isLoading}
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.signInButton,
                pressed && !viewModel.isLoading && styles.signInButtonPressed,
                viewModel.isLoading && styles.signInButtonDisabled,
              ]}
            >
              {viewModel.isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Do not have an account?</Text>
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}> Sign up</Text>
            </Pressable>
          </View>
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
  passwordToggle: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -10,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
    marginTop: -2,
  },
  forgotText: {
    color: '#6B941F',
    fontSize: 14,
    fontWeight: '700',
  },
  signInButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
    marginTop: 4,
    width: '100%',
  },
  signInButtonPressed: {
    opacity: 0.88,
  },
  signInButtonDisabled: {
    opacity: 0.72,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  signupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: '#66715E',
    fontSize: 14,
  },
  signupLink: {
    color: '#6B941F',
    fontSize: 14,
    fontWeight: '800',
  },
});

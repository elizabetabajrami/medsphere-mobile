import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
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
} from "react-native";
import type { AuthStackParamList } from "../../../navigation/types";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppFeedbackModal } from "../../../shared/components/AppFeedbackModal";
import { ErrorMessage } from "../../../shared/components/ErrorMessage";
import { useVerifyEmailViewModel } from "../viewmodel/useVerifyEmailViewModel";

type VerifyEmailScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "VerifyEmail"
>;

export const VerifyEmailScreen = ({
  navigation,
  route,
}: VerifyEmailScreenProps) => {
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const { email } = route.params;
  const viewModel = useVerifyEmailViewModel(email);

  const handleVerifyEmail = async () => {
    const isVerified = await viewModel.verifyEmail();

    if (isVerified) {
      setIsSuccessModalVisible(true);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessModalVisible(false);
    navigation.navigate("Login");
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate(route.params.from === "Register" ? "Register" : "Login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <AppHeader title="Verify Email" showBack onBackPress={handleBack} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Ionicons name="mail-open-outline" size={30} color="#FFFFFF" />
          </View>

          <Text style={styles.brand}>Verify your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit verification code to your email.
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Verification code</Text>
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
                  onChangeText={viewModel.setCode}
                  placeholder="Enter verification code"
                  placeholderTextColor="#A7B09E"
                  style={styles.input}
                  value={viewModel.code}
                />
              </View>
            </View>

            <ErrorMessage message={viewModel.error} />
            {viewModel.message ? (
              <Text style={styles.messageText}>{viewModel.message}</Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              disabled={viewModel.isLoading}
              onPress={handleVerifyEmail}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && !viewModel.isLoading && styles.primaryButtonPressed,
                viewModel.isLoading && styles.primaryButtonDisabled,
              ]}
            >
              {viewModel.isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify Email</Text>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={viewModel.isResending}
              onPress={viewModel.resendVerification}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                {viewModel.isResending ? "Sending..." : "Resend code"}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("Login")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Back to Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <AppFeedbackModal
        visible={isSuccessModalVisible}
        type="success"
        title="Email Verified"
        message="Your account is active. You can now sign in."
        primaryButtonText="Sign In"
        onClose={handleSuccessClose}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    backgroundColor: "#FCFDF9",
    borderColor: "#E8EEDF",
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: "#23330D",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 4,
  },
  logoContainer: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B941F",
    borderRadius: 18,
    marginBottom: 18,
  },
  brand: {
    color: "#6B941F",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#66715E",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 10,
    textAlign: "center",
  },
  emailText: {
    color: "#303A28",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 28,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: "#303A28",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#DDE6D2",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#1F271A",
    fontSize: 16,
    paddingVertical: Platform.OS === "ios" ? 15 : 11,
  },
  primaryButton: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B941F",
    borderRadius: 16,
    marginTop: 4,
    width: "100%",
  },
  primaryButtonPressed: {
    opacity: 0.88,
  },
  primaryButtonDisabled: {
    opacity: 0.72,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    marginTop: 14,
  },
  secondaryButtonText: {
    color: "#6B941F",
    fontSize: 14,
    fontWeight: "800",
  },
  messageText: {
    color: "#4F7217",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
});

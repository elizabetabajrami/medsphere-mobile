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
import type { UserRole } from "../model/AuthTypes";
import { useRegisterViewModel } from "../viewmodel/useRegisterViewModel";

type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
> & {
  onAuthenticated: (role: UserRole) => void;
};

export const RegisterScreen = ({
  navigation,
}: RegisterScreenProps) => {
  const viewModel = useRegisterViewModel();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleRegister = async () => {
    const isRegistered = await viewModel.register();

    if (isRegistered) {
      setIsSuccessModalVisible(true);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessModalVisible(false);
    navigation.navigate("VerifyEmail", { email: viewModel.email.trim(), from: "Register" });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <AppHeader title="Create Account" showBack onBackPress={() => navigation.navigate("Landing")} />
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
          <Text style={styles.subtitle}>Create your account</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>First name</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#8A9581"
                  style={styles.inputIcon}
                />
                <TextInput
                  autoCapitalize="words"
                  onChangeText={viewModel.setFirstName}
                  placeholder="Enter your first name"
                  placeholderTextColor="#A7B09E"
                  style={styles.input}
                  value={viewModel.firstName}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Last name</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#8A9581"
                  style={styles.inputIcon}
                />
                <TextInput
                  autoCapitalize="words"
                  onChangeText={viewModel.setLastName}
                  placeholder="Enter your last name"
                  placeholderTextColor="#A7B09E"
                  style={styles.input}
                  value={viewModel.lastName}
                />
              </View>
            </View>

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
                  secureTextEntry
                  style={styles.input}
                  value={viewModel.password}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Personal Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color="#8A9581"
                  style={styles.inputIcon}
                />
                <TextInput
                  keyboardType="numeric"
                  onChangeText={viewModel.setPersonalNumber}
                  placeholder="Enter your personal number"
                  placeholderTextColor="#A7B09E"
                  style={styles.input}
                  value={viewModel.personalNumber}
                />
              </View>
            </View>

            <ErrorMessage message={viewModel.error} />

            <Pressable
              accessibilityRole="button"
              disabled={viewModel.isLoading}
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && !viewModel.isLoading && styles.primaryButtonPressed,
                viewModel.isLoading && styles.primaryButtonDisabled,
              ]}
            >
              {viewModel.isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.footerLink}> Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <AppFeedbackModal
        visible={isSuccessModalVisible}
        type="success"
        title="Account Created"
        message="Please verify your email to continue."
        primaryButtonText="Continue"
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
  },
  subtitle: {
    color: "#66715E",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 28,
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
  footerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#66715E",
    fontSize: 14,
  },
  footerLink: {
    color: "#6B941F",
    fontSize: 14,
    fontWeight: "800",
  },
});

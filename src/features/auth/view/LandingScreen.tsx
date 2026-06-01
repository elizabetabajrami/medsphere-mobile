import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { AuthStackParamList } from "../../../navigation/types";

type LandingScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Landing"
>;

const features = [
  {
    icon: "calendar-outline",
    title: "Book appointments",
  },
  {
    icon: "search-outline",
    title: "Find doctors",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Manage your care",
  },
] as const;

export const LandingScreen = ({ navigation }: LandingScreenProps) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.background}>
      <View style={styles.topGlow} />
      <View style={styles.middleGlow} />
      <View style={styles.bottomGlow} />

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.brandRow}>
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.brand}>MedSphere</Text>
          </View>

          <View style={styles.illustrationCard}>
            <View style={styles.illustrationHalo} />
            <View style={styles.illustrationMain}>
              <Ionicons name="medkit-outline" size={48} color="#6B941F" />
            </View>
            <View style={styles.floatingBadge}>
              <Ionicons name="pulse-outline" size={18} color="#6B941F" />
            </View>
            <View style={[styles.floatingBadge, styles.floatingBadgeRight]}>
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.headline}>Your health, one tap away</Text>
          <Text style={styles.subtitle}>
            Book appointments, connect with doctors, and manage your care
            easily.
          </Text>

          <View style={styles.featureGrid}>
            {features.map((feature) => (
              <View key={feature.title} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon} size={20} color="#6B941F" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("Register")}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Book Appointment</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("Login")}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New to MedSphere?</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.footerLink}> Create Account</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },
  background: {
    flex: 1,
    backgroundColor: "#F8FAF5",
    overflow: "hidden",
  },
  topGlow: {
    position: "absolute",
    top: -100,
    right: -120,
    width: 300,
    height: 300,
    backgroundColor: "#DCEBCB",
    borderRadius: 150,
    opacity: 0.9,
  },
  middleGlow: {
    position: "absolute",
    top: 220,
    left: -120,
    width: 260,
    height: 260,
    backgroundColor: "#EEF6E7",
    borderRadius: 130,
  },
  bottomGlow: {
    position: "absolute",
    bottom: -130,
    right: -90,
    width: 320,
    height: 320,
    backgroundColor: "#E4F0D9",
    borderRadius: 160,
    opacity: 0.82,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  heroCard: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,
    maxHeight: "100%",
    alignItems: "center",
    backgroundColor: "#FCFDF9",
    borderColor: "#E8EEDF",
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#23330D",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 4,
  },
  brandRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logoContainer: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B941F",
    borderRadius: 16,
    marginRight: 12,
  },
  brand: {
    color: "#6B941F",
    fontSize: 26,
    fontWeight: "800",
  },
  illustrationCard: {
    width: "100%",
    height: 138,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F7EC",
    borderColor: "#E0EAD5",
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 18,
    overflow: "hidden",
  },
  illustrationHalo: {
    position: "absolute",
    width: 160,
    height: 160,
    backgroundColor: "#DCEBCB",
    borderRadius: 80,
  },
  illustrationMain: {
    width: 78,
    height: 78,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E5CA",
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: "#23330D",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
    elevation: 4,
  },
  floatingBadge: {
    position: "absolute",
    left: "18%",
    top: 24,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E5CA",
    borderRadius: 14,
    borderWidth: 1,
  },
  floatingBadgeRight: {
    top: undefined,
    left: undefined,
    right: "18%",
    bottom: 24,
    backgroundColor: "#6B941F",
    borderColor: "#6B941F",
  },
  headline: {
    color: "#1F271A",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 31,
    textAlign: "center",
  },
  subtitle: {
    color: "#66715E",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 16,
    maxWidth: 330,
    textAlign: "center",
  },
  featureGrid: {
    width: "100%",
    gap: 8,
    marginBottom: 16,
  },
  featureCard: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E0EAD5",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featureIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F7EC",
    borderRadius: 12,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: "#303A28",
    fontSize: 14,
    fontWeight: "800",
  },
  actions: {
    width: "100%",
    gap: 10,
  },
  primaryButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B941F",
    borderRadius: 16,
    width: "100%",
  },
  primaryButtonPressed: {
    opacity: 0.88,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#C9D8B7",
    borderRadius: 16,
    borderWidth: 1,
    width: "100%",
  },
  secondaryButtonPressed: {
    backgroundColor: "#F2F7EC",
  },
  secondaryButtonText: {
    color: "#6B941F",
    fontSize: 16,
    fontWeight: "800",
  },
  footerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
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

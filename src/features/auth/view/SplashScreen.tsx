import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { AuthStackParamList } from "../../../navigation/types";

type SplashScreenProps = NativeStackScreenProps<AuthStackParamList, "Splash">;

export const SplashScreen = ({ navigation }: SplashScreenProps) => {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.88)).current;
  const contentTranslateX = useRef(new Animated.Value(-18)).current;
  const pulseScale = useRef(new Animated.Value(0.8)).current;
  const pulseOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.18,
            duration: 1300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.35,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseAnimation.start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateX, {
          toValue: 42,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.replace("Landing");
      });
    }, 1200);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, [
    contentOpacity,
    contentScale,
    contentTranslateX,
    navigation,
    pulseOpacity,
    pulseScale,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />
        <View style={styles.medicalChip}>
          <Ionicons name="medical-outline" size={18} color="#6B941F" />
        </View>
        <View style={[styles.medicalChip, styles.medicalChipRight]}>
          <Ionicons name="pulse-outline" size={18} color="#6B941F" />
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [
                { translateX: contentTranslateX },
                { scale: contentScale },
              ],
            },
          ]}
        >
          <View style={styles.logoWrap}>
            <Animated.View
              style={[
                styles.logoPulse,
                {
                  opacity: pulseOpacity,
                  transform: [{ scale: pulseScale }],
                },
              ]}
            />
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={38} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.brand}>MedSphere</Text>
          <Text style={styles.subtitle}>Your health, our priority.</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAF5",
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAF5",
    overflow: "hidden",
  },
  topGlow: {
    position: "absolute",
    top: -90,
    right: -80,
    width: 260,
    height: 260,
    backgroundColor: "#DCEBCB",
    borderRadius: 130,
    opacity: 0.86,
  },
  bottomGlow: {
    position: "absolute",
    bottom: -120,
    left: -90,
    width: 320,
    height: 320,
    backgroundColor: "#EEF6E7",
    borderRadius: 160,
  },
  medicalChip: {
    position: "absolute",
    top: "22%",
    left: 34,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E0EAD5",
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#23330D",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  medicalChipRight: {
    top: "64%",
    left: undefined,
    right: 36,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoWrap: {
    width: 116,
    height: 116,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoPulse: {
    position: "absolute",
    width: 116,
    height: 116,
    backgroundColor: "#BFD9A3",
    borderRadius: 36,
  },
  logoContainer: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6B941F",
    borderRadius: 26,
    shadowColor: "#23330D",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 26,
    elevation: 6,
  },
  brand: {
    color: "#6B941F",
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#66715E",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
});

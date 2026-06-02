import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList } from '../../../navigation/types';
import { AppHeader } from '../../../shared/components/AppHeader';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { usePatientProfileViewModel } from '../viewmodel/usePatientProfileViewModel';

type ProfileEditScreenProps = NativeStackScreenProps<PatientStackParamList, 'ProfileEdit'>;

export const ProfileEditScreen = ({ navigation }: ProfileEditScreenProps) => {
  const { error, isSaving, profile, saveProfile } = usePatientProfileViewModel();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone === 'Not provided' ? '' : profile.phone);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  useEffect(() => {
    setName(profile.name);
    setPhone(profile.phone === 'Not provided' ? '' : profile.phone);
    setAvatarUrl(profile.avatarUrl);
  }, [profile]);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('PatientTabs', { screen: 'PatientProfile' });
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to choose a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const didSave = await saveProfile({
      name,
      phone,
      avatarUrl,
    });

    if (didSave) {
      navigation.navigate('PatientTabs', { screen: 'PatientProfile' });
    } else {
      Alert.alert('Profile not saved', 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <AppHeader
        title="Edit Profile"
        showBack
        onBackPress={handleBack}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ErrorMessage message={error} />
        <View style={styles.card}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-outline" size={42} color="#6B941F" />
              )}
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={handlePickPhoto}
              style={({ pressed }) => [styles.photoButton, pressed && styles.photoButtonPressed]}
            >
              <Ionicons name="camera-outline" size={18} color="#6B941F" />
              <Text style={styles.photoButtonText}>Change Photo</Text>
            </Pressable>
          </View>

          <Field
            icon="person-outline"
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
          <Field
            icon="mail-outline"
            label="Email"
            value={profile.email}
            editable={false}
            placeholder="Email"
          />
          <Field
            icon="call-outline"
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Add phone number"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={isSaving}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            (pressed || isSaving) && styles.saveButtonPressed,
          ]}
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

type FieldProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

const Field = ({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  keyboardType = 'default',
}: FieldProps) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer, !editable && styles.inputContainerDisabled]}>
      <Ionicons name={icon} size={20} color="#8A9581" style={styles.inputIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A7B09E"
        editable={editable}
        keyboardType={keyboardType}
        style={[styles.input, !editable && styles.inputDisabled]}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  avatar: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  photoButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#DDE6D2',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  photoButtonPressed: {
    opacity: 0.84,
  },
  photoButtonText: {
    color: '#6B941F',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  field: {
    marginBottom: 16,
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
    backgroundColor: '#FCFDF9',
    borderColor: '#DDE6D2',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputContainerDisabled: {
    backgroundColor: '#F5F7F1',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1F271A',
    fontSize: 16,
    paddingVertical: 12,
  },
  inputDisabled: {
    color: '#66715E',
  },
  saveButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
    marginTop: 18,
  },
  saveButtonPressed: {
    opacity: 0.88,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

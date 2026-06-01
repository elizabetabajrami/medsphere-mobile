import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { UserRole } from '../features/auth/model/AuthTypes';
import { ForgotPasswordScreen } from '../features/auth/view/ForgotPasswordScreen';
import { LandingScreen } from '../features/auth/view/LandingScreen';
import { LoginScreen } from '../features/auth/view/LoginScreen';
import { RegisterScreen } from '../features/auth/view/RegisterScreen';
import { SplashScreen } from '../features/auth/view/SplashScreen';
import { VerifyEmailScreen } from '../features/auth/view/VerifyEmailScreen';
import type { AuthStackParamList } from './types';

type AuthNavigatorProps = {
  onAuthenticated: (role: UserRole) => void;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = ({ onAuthenticated }: AuthNavigatorProps) => (
  <Stack.Navigator initialRouteName="Splash">
    <Stack.Screen
      name="Splash"
      component={SplashScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Landing"
      component={LandingScreen}
      options={{ animation: 'slide_from_right', headerShown: false }}
    />
    <Stack.Screen name="Login">
      {(props) => <LoginScreen {...props} onAuthenticated={onAuthenticated} />}
    </Stack.Screen>
    <Stack.Screen name="Register">
      {(props) => <RegisterScreen {...props} onAuthenticated={onAuthenticated} />}
    </Stack.Screen>
    <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { UserRole } from '../features/auth/model/AuthTypes';
import { ForgotPasswordScreen } from '../features/auth/view/ForgotPasswordScreen';
import { LoginScreen } from '../features/auth/view/LoginScreen';
import { RegisterScreen } from '../features/auth/view/RegisterScreen';
import type { AuthStackParamList } from './types';

type AuthNavigatorProps = {
  onAuthenticated: (role: UserRole) => void;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = ({ onAuthenticated }: AuthNavigatorProps) => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login">
      {(props) => <LoginScreen {...props} onAuthenticated={onAuthenticated} />}
    </Stack.Screen>
    <Stack.Screen name="Register">
      {(props) => <RegisterScreen {...props} onAuthenticated={onAuthenticated} />}
    </Stack.Screen>
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// multi-role-auth-appwrite/client/navigation/AuthStack.tsx

import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { Signin } from "../src/screens/Signin";
import { Signup } from "../src/screens/Signup";

export type AuthStackParamList = {
  Signin: undefined;
  Signup: undefined;
};

export const AuthStack = () => {
  const Stack = createStackNavigator<AuthStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Signin">
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};

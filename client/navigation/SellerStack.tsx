// multi-role-auth-appwrite/client/navigation/SellerStack.tsx

import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { SellerLanding } from "../src/screens/SellerLanding";

export type SellerStackParamList = {
  SellerLanding: undefined;
};

export const SellerStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="SellerLanding">
      <Stack.Screen name="SellerLanding" component={SellerLanding} />
    </Stack.Navigator>
  );
};

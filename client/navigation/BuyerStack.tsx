// multi-role-auth-appwrite/client/navigation/BuyerStack.tsx

import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { BuyerLanding } from "../src/screens/BuyerLanding";

export type BuyerStackParamList = {
  BuyerLanding: undefined;
};

export const BuyerStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="BuyerLanding">
      <Stack.Screen name="BuyerLanding" component={BuyerLanding} />
    </Stack.Navigator>
  );
};

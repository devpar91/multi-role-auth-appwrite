// multi-role-auth-appwrite/client/src/screens/SellerLanding.tsx

import React, { useState } from "react";
import { Text, Button } from "react-native";
import { useAuth } from "../providers/authProvider";

export const SellerLanding = () => {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const logout = async () => {
    setLoadingLogout(true);
    const user = await signOut();
    setLoadingLogout(false);
  };

  const { signOut, userState } = useAuth();
  return (
    <>
      <Text>{userState?.name}</Text>
      <Button onPress={logout} disabled={loadingLogout} title="Logout" />
    </>
  );
};

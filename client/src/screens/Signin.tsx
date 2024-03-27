// multi-role-auth-appwrite/client/src/screens/Signin.tsx

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableHighlight,
} from "react-native";
import { useAuth } from "../providers/authProvider";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigation/AuthStack";

type SigninProps = StackNavigationProp<AuthStackParamList, "Signup">;

export const Signin = () => {
  const { signIn } = useAuth();
  const navigation = useNavigation<SigninProps>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signinError, setSigninError] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    const user = await signIn(email, password);
    setLoading(false);
    if (user.error) {
      setSigninError(user.error.message);
    } else {
      setSigninError("");
    }
  };

  return (
    <View style={styles.container}>
      {signinError && <Text style={styles.errorText}>{signinError}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <Button title="Signin" onPress={handleSignIn} disabled={loading} />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text>Don't have an account? </Text>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={{ color: "blue" }}>Signup</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

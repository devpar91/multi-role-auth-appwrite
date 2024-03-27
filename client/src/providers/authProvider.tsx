// multi-role-auth-appwrite/client/src/providers/authProvider.tsx

import { appwrite } from "../appwrite/service";
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { Models, AppwriteException } from "appwrite";
import * as SecureStore from "expo-secure-store";

type SignInResponse = {
  data: Models.User<Models.Preferences> | undefined;
  error: Error | undefined;
};

type SignUpResponse = {
  data: Models.User<Models.Preferences> | undefined;
  error: string | undefined;
};

type SignUpRestRes = {
  data: Models.User<Models.Preferences> | undefined;
  error: AppwriteException | undefined;
};

type SignOutResponse = {
  error: any | undefined;
  data: {} | undefined;
};

type AuthContextValue = {
  signIn: (e: string, p: string) => Promise<SignInResponse>;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    seller?: boolean
  ) => Promise<SignUpResponse>;
  signOut: () => Promise<SignOutResponse>;
  getJWTFromSecureStore: (
    user: Models.User<Models.Preferences> | null
  ) => Promise<string | null>;
  renewJWT: () => Promise<{
    success: boolean;
  }>;
  userState: Models.User<Models.Preferences> | null;
  authInitialized: boolean;
  loading: boolean;
};

type ProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = (props: ProviderProps) => {
  const [userState, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const user = await appwrite.account.get();
        setUser(user);
        setAuthInitialized(true);
        const jwt = await getJWTFromSecureStore(user);

        if (!jwt) {
          await createJWT(user);
        }
      } catch (error) {
        console.error("Error initializing authentication:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await appwrite.account.createEmailSession(email, password);

      const user = await appwrite.account.get();
      setUser(user);
      setAuthInitialized(true);
      const jwt = await getJWTFromSecureStore(user);

      if (!jwt) {
        await createJWT(user);
      }

      return { data: user, error: undefined };
    } catch (e) {
      setUser(null);
      console.error("Error sigining in: ", e);
      return { error: e as AppwriteException, data: undefined };
    }
  };

  const signOut = async (): Promise<SignOutResponse> => {
    try {
      const response = await appwrite.account.deleteSession("current");
      setAuthInitialized(false);
      if (userState) SecureStore.deleteItemAsync(userState.$id);
      return { error: undefined, data: response };
    } catch (error) {
      console.error("Error Signing out: ", error);
      return { error, data: undefined };
    } finally {
      setUser(null);
    }
  };

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    seller?: boolean
  ): Promise<SignUpResponse> => {
    const name = firstName + " " + lastName;
    try {
      const url = process.env.EXPO_PUBLIC_REST_URI + "signup";
      const userRes = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, seller }),
      });
      const user: SignUpRestRes = await userRes.json();
      if (user.error) {
        console.error("Appwrite error creating new user: ", user.error);
        return {
          error:
            // @ts-ignore: Unreachable code error
            user.error?.response?.message ||
            "Could not create user, something went wrong!",
          data: undefined,
        };
      }
      return { error: undefined, data: user.data };
    } catch (error) {
      console.error("Error creating new user: ", error);
      return {
        error: "Could not create user, something went wrong!",
        data: undefined,
      };
    }
  };

  //create jwt and set it to secure storage
  const createJWT = async (user: Models.User<Models.Preferences> | null) => {
    try {
      const jwt = await appwrite.account.createJWT();
      if (user) {
        await SecureStore.setItemAsync(user.$id, jwt.jwt);
      } else {
        console.error("Error creating JWT, active user not found");
        return { success: false };
      }
      return { success: true };
    } catch (error) {
      console.error("Error creating JWT: ", error);
      return { success: false };
    }
  };

  const getJWTFromSecureStore = async (
    user: Models.User<Models.Preferences> | null
  ) => {
    try {
      if (user) {
        return await SecureStore.getItemAsync(user?.$id);
      } else {
        console.error("Error retrieving jwt, active user not found");
        return null;
      }
    } catch (error) {
      console.log("Error retrieving jwt: ", error);
      return null;
    }
  };

  const renewJWT = async () => {
    try {
      if (userState) {
        await SecureStore.deleteItemAsync(userState.$id);
        return await createJWT(userState);
      } else {
        console.error("Error renewing JWT, userState not found");
        return { success: false };
      }
    } catch (error) {
      console.error("Error renewing JWT");
      return { success: false };
    }
  };

  const contextValue: AuthContextValue = {
    signIn,
    signOut,
    signUp,
    getJWTFromSecureStore,
    renewJWT,
    userState,
    authInitialized,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return authContext;
};

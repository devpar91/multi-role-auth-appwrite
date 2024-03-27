// // multi-role-auth-appwrite/client/navigation/index.tsx

import { AuthStack } from "./AuthStack";
import { BuyerStack } from "./BuyerStack";
import { SellerStack } from "./SellerStack";
import { useAuth } from "../src/providers/authProvider";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_URI,
});

export const RootNavigation = () => {
  const {
    authInitialized,
    loading,
    getJWTFromSecureStore,
    userState,
    renewJWT,
  } = useAuth();

  const getRenewedJWT = async () => {
    await renewJWT();
    const jwt = await getJWTFromSecureStore(userState);
    return `Bearer ${jwt}`;
  };

  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          switch (err.extensions.code) {
            case "UNAUTHENTICATED":
              console.warn("JWT expired, refetching: ", err);
              return new Observable((observer) => {
                getRenewedJWT()
                  .then((res) => {
                    const oldHeaders = operation.getContext().headers;
                    operation.setContext({
                      headers: {
                        ...oldHeaders,
                        authorization: res,
                      },
                    });
                  })
                  .then(() => {
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    };
                    return forward(operation).subscribe(subscriber);
                  })
                  .catch((error) => {
                    observer.error(error);
                  });
              });
          }
        }
      }

      // To retry on network errors, we recommend the RetryLink
      // instead of the onError link. This just logs the error.
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }
  );

  const authLink = setContext(async (_, { headers }) => {
    const token = await getJWTFromSecureStore(userState);

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
  });

  const getRouteStack = () => {
    if (authInitialized) {
      if (userState?.labels[0] === "seller") {
        return <SellerStack />;
      } else {
        return <BuyerStack />;
      }
    } else {
      return <AuthStack />;
    }
  };
  if (loading) return <Text>Loading....</Text>;
  else
    return (
      <ApolloProvider client={client}>
        <NavigationContainer>{getRouteStack()}</NavigationContainer>
      </ApolloProvider>
    );
};

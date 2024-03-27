// multi-role-auth-appwrite/client/App.tsx

import "react-native-gesture-handler";
import { AuthProvider } from "./src/providers/authProvider";
import { RootNavigation } from "./navigation";

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}

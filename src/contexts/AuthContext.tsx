import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  getAdditionalUserInfo
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { sendWelcomeEmail } from "../services/emailService";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signupWithEmail: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const handleNewUserWelcome = (result: Awaited<ReturnType<typeof signInWithPopup>>) => {
  const additionalInfo = getAdditionalUserInfo(result);
  if (additionalInfo?.isNewUser && result.user) {
    console.log("📧 Triggering welcome email for new user:", result.user.email);
    sendWelcomeEmail(
      result.user.displayName || "Explorer",
      result.user.email || ""
    );
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Handle the result when returning from signInWithRedirect fallback.
  // This only runs if signInWithPopup was blocked and we fell back to redirect.
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (!result) return;
        console.log("🔐 Google redirect login — email:", result.user?.email);
        handleNewUserWelcome(result);
      })
      .catch((err) => {
        // "missing-initial-state" means sessionStorage was cleared — safe to ignore,
        // the user just needs to try signing in again.
        if (err?.code !== "auth/missing-initial-state") {
          console.error("Google redirect error:", err);
        }
      });
  }, []);

  const loginWithGoogle = async () => {
    try {
      // Popup is the preferred method: instant, no sessionStorage dependency,
      // no page reload. Works in the vast majority of browsers.
      const result = await signInWithPopup(auth, googleProvider);
      handleNewUserWelcome(result);
    } catch (err: any) {
      if (err?.code === "auth/popup-blocked") {
        // Browser explicitly blocked the popup (e.g. no user gesture, strict settings).
        // Fall back to redirect — the page will navigate away and come back.
        // getRedirectResult() in the useEffect above will handle the result.
        console.warn("Popup blocked — falling back to redirect flow.");
        await signInWithRedirect(auth, googleProvider);
      } else if (err?.code === "auth/popup-closed-by-user") {
        // User dismissed the popup — not an error, just do nothing.
        return;
      } else {
        throw err;
      }
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);

    // Send welcome email for every new signup
    if (result.user) {
      sendWelcomeEmail(
        result.user.displayName || email.split("@")[0],
        result.user.email || email
      );
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

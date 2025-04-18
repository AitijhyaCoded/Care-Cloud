
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, displayName?: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      toast({
        title: "Account created!",
        description: "You have successfully signed up.",
        variant: "default",
      });
      
      return userCredential.user;
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        variant: "default",
      });
      
      return userCredential.user;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "There was an error logging in.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<User> => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      toast({
        title: "Welcome!",
        description: "You have successfully logged in with Google.",
        variant: "default",
      });
      
      return userCredential.user;
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "There was an error logging in with Google.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      
      toast({
        title: "Logged out successfully 💫",
        description: "You have been logged out of your account.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "There was an error logging out.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string): Promise<void> => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, { displayName });
        
        // Force refresh the user object
        setCurrentUser({ ...currentUser });
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
          variant: "default",
        });
      } else {
        throw new Error("No user is logged in");
      }
    } catch (error: any) {
      toast({
        title: "Profile update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

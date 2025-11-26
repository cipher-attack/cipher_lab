
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { auth, db, googleProvider, githubProvider, twitterProvider } from "./firebase";
import { ChatMessage } from '../types';

export interface UserProfile {
  uid: string;
  username: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  lastModified: any; // Firestore Timestamp
  messages: ChatMessage[];
}

// Helper to remove undefined fields for Firestore
const sanitizeMessage = (msg: ChatMessage) => {
  const clean = { ...msg };
  if (clean.image === undefined) {
    delete (clean as any).image;
  }
  return clean;
};

export const AuthService = {
  // --- AUTHENTICATION ---

  // Email/Password Signup
  signup: async (username: string, email: string, password: string) => {
    try {
      // 1. Create User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Profile Name
      await updateProfile(user, { displayName: username });
      
      // 3. EXPLICITLY SEND VERIFICATION EMAIL
      // Ensure this runs. If it fails, we catch the error in the main block and report it.
      await sendEmailVerification(user);
      
      // 4. Force Logout immediately 
      // User must verify before accessing the app
      await signOut(auth);

      return { 
        success: true, 
        user: null, 
        message: 'Account created successfully! A verification link has been sent to your email. Please check your Inbox and SPAM folder before logging in.' 
      };
    } catch (error: any) {
      console.error("Signup Error:", error);
      return { success: false, message: error.message };
    }
  },

  // Email/Password Login
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // --- CRITICAL: CHECK VERIFICATION ---
      if (!user.emailVerified) {
          // If not verified, kick them out immediately
          await signOut(auth);
          return { 
            success: false, 
            message: 'Access Denied: Your email address is not verified yet. Please check your email (including Spam folder) and click the link.' 
          };
      }

      return { success: true, user: mapUser(user), message: 'Access Granted.' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  // Social Login (Google/GitHub/Twitter)
  // Client Secrets are handled in Firebase Console, NOT here.
  loginWithProvider: async (providerName: 'google' | 'github' | 'twitter') => {
    try {
      let provider;
      if (providerName === 'google') provider = googleProvider;
      else if (providerName === 'github') provider = githubProvider;
      else if (providerName === 'twitter') provider = twitterProvider;
      
      if (!provider) throw new Error("Invalid provider");

      const result = await signInWithPopup(auth, provider);
      
      return { success: true, user: mapUser(result.user), message: `Authenticated via ${providerName.toUpperCase()}` };
    } catch (error: any) {
      console.error("Social Login Error:", error);
      return { success: false, message: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },

  // Listen for Auth Changes (Session Persistence)
  onAuthStateChange: (callback: (user: UserProfile | null) => void) => {
    return onAuthStateChanged(auth, (user) => {
      // DOUBLE CHECK: Even if session persists, ensure email is verified
      if (user) {
        // For email/password users, strictly enforce verification
        const isPasswordAuth = user.providerData.some(p => p.providerId === 'password');
        
        if (isPasswordAuth && !user.emailVerified) {
           // If somehow logged in but not verified, force logout
           signOut(auth);
           callback(null);
        } else {
           callback(mapUser(user));
        }
      } else {
         callback(null);
      }
    });
  },

  // --- FIRESTORE CHAT HISTORY ---

  getSessions: async (userId: string): Promise<ChatSession[]> => {
    try {
      const q = query(
        collection(db, "sessions"), 
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      const sessions: ChatSession[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          lastModified: data.lastModified?.toDate() || new Date(),
          messages: data.messages || []
        });
      });
      
      // Client-side sort: Newest first
      return sessions.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return [];
    }
  },

  createSession: async (userId: string, firstMessage: ChatMessage): Promise<ChatSession | null> => {
    try {
      // Generate Title
      let title = firstMessage.text.split(' ').slice(0, 5).join(' ');
      if (firstMessage.text.length > 30) title += '...';
      if (!title) title = "New Conversation";

      const newSessionData = {
        userId,
        title,
        lastModified: serverTimestamp(),
        messages: [sanitizeMessage(firstMessage)]
      };

      const docRef = await addDoc(collection(db, "sessions"), newSessionData);
      
      return {
        id: docRef.id,
        userId,
        title,
        lastModified: new Date(),
        messages: [firstMessage]
      };
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    }
  },

  saveSessionMessages: async (sessionId: string, messages: ChatMessage[]) => {
    try {
      const sessionRef = doc(db, "sessions", sessionId);
      await updateDoc(sessionRef, {
        messages: messages.map(sanitizeMessage),
        lastModified: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  },

  deleteSession: async (sessionId: string) => {
    try {
      await deleteDoc(doc(db, "sessions", sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }
};

// Helper to map Firebase User to our UserProfile
const mapUser = (user: User): UserProfile => {
  return {
    uid: user.uid,
    username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
    email: user.email,
    photoURL: user.photoURL
  };
};

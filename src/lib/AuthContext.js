"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore"; // Ganti getDoc jadi onSnapshot

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    let unsubscribeDoc = null; // Penampung listener Firestore

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // REALTIME LISTENER: Pantau terus perubahan di dokumen user ini
        const docRef = doc(db, "users", currentUser.uid);
        unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            // Update state user & role secara live
            setUser(prev => ({ ...prev, ...userData })); 
            setUserRole(userData.role);
            console.log("Role Updated:", userData.role); // Cek console untuk debug
          }
        }, (error) => {
            console.error("Error fetching user role:", error);
        });

      } else {
        setUser(null);
        setUserRole(null);
        if (unsubscribeDoc) unsubscribeDoc(); // Matikan listener jika logout
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRole, loading }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
           <div className="flex flex-col items-center gap-3">
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
             <p className="text-sm text-slate-500 font-medium">Verifying Credentials...</p>
           </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
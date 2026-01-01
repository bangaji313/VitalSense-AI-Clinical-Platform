import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const logActivity = async (userData, action, resource, status = "SUCCESS") => {
  if (!userData) return;

  try {
    await addDoc(collection(db, "audit_logs"), {
      timestamp: serverTimestamp(),
      user: userData.displayName || userData.fullName || "Unknown",
      role: userData.role || "User",
      action: action,     
      resource: resource, 
      status: status,     
      userAgent: window.navigator.userAgent 
    });
    console.log(`[AUDIT] ${action} recorded.`);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
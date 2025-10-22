"use client";

import React, { createContext, useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const userContext = createContext();

function AuthProvider({ children }) {
  const user = useUser();
  const CreateUser = useMutation(api.users.CreateUser);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    if (user) {
      CreateNewUser();
    } else {
      setIsLoading(false); // ✅ No user, stop loading
    }
  }, [user]);

  const CreateNewUser = async () => {
    try {
      setIsLoading(true);
      
      const userId = await CreateUser({
        name: user?.displayName,
        email: user?.primaryEmail,
      });
      
      setUserData({
        _id: userId,
        name: user?.displayName,
        email: user?.primaryEmail,
      });
      
      console.log("✅ User created/loaded with ID:", userId);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error creating user:", error);
      setIsLoading(false);
    }
  };

  return (
    <userContext.Provider value={{ userData, setUserData, isLoading }}>
      {children}
    </userContext.Provider>
  );
}

export default AuthProvider;

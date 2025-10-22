"use client";

import React from "react";
import AuthProvider from "./AuthProvider";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const Provider = ({ children }) => {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ConvexProvider>
  );
};

export default Provider;

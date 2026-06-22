"use client";

import React from "react";
import { AuthProvider } from "../../../context/AuthContext";
import PerfilContent from "./PerfilContent";

export default function PerfilPage() {
  return (
    <AuthProvider>
      <PerfilContent />
    </AuthProvider>
  );
}

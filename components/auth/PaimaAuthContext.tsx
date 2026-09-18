"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface PaimaAuthContextType {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const PaimaAuthContext = createContext<PaimaAuthContextType | undefined>(undefined);

export function PaimaAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <PaimaAuthContext.Provider
      value={{
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </PaimaAuthContext.Provider>
  );
}

export function usePaimaAuth() {
  const context = useContext(PaimaAuthContext);
  if (!context) {
    throw new Error("usePaimaAuth must be used within a PaimaAuthProvider");
  }
  return context;
}

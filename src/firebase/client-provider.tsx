"use client";

import { useMemo, type ReactNode } from "react";
import { initializeFirebase } from "@/firebase";
import { FirebaseProvider } from "@/firebase/provider";

type Props = {
  children: ReactNode;
};

export function FirebaseClientProvider({ children }: Props) {
  const firebase = useMemo(() => {
    return initializeFirebase();
  }, []);

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ActiveNumericInput {
  applyValue: (value: number) => void;
}

interface QuickValuesFocusContextValue {
  activeInput: ActiveNumericInput | null;
  registerActiveInput: (input: ActiveNumericInput) => void;
  clearActiveInput: () => void;
}

const QuickValuesFocusContext =
  createContext<QuickValuesFocusContextValue | null>(null);

export function QuickValuesFocusProvider({ children }: { children: ReactNode }) {
  const [activeInput, setActiveInput] = useState<ActiveNumericInput | null>(
    null,
  );

  const registerActiveInput = useCallback((input: ActiveNumericInput) => {
    setActiveInput(input);
  }, []);

  const clearActiveInput = useCallback(() => {
    setActiveInput(null);
  }, []);

  const value = useMemo(
    () => ({ activeInput, registerActiveInput, clearActiveInput }),
    [activeInput, registerActiveInput, clearActiveInput],
  );

  return (
    <QuickValuesFocusContext.Provider value={value}>
      {children}
    </QuickValuesFocusContext.Provider>
  );
}

export function useQuickValuesFocus() {
  const context = useContext(QuickValuesFocusContext);
  if (!context) {
    throw new Error(
      "useQuickValuesFocus must be used within QuickValuesFocusProvider",
    );
  }
  return context;
}
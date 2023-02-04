import React, { useCallback, useState } from "react";
import { createContext } from "react";
import type { FormContext as TFormContext } from "../../types";

export const FormContext = createContext<TFormContext>({
  registerForm: () => {},
  forms: {}
});

interface FormSchemaProviderProps {
  children: React.ReactNode;
}

export function FormSchemaProvider({ children }: FormSchemaProviderProps) {
  const [forms, setForms] = useState<any>({});

  const registerForm = useCallback((
    v: { name: string, ref: React.RefObject<HTMLFormElement>}) => {
    setForms({ ...forms, [v.name]: { name: v.name, ref: v.ref } });
  }, []);

  return (
    <FormContext.Provider value={{ registerForm, forms }}>
      {children}
    </FormContext.Provider>
  );
}

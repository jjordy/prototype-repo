import React from "react";
import { UseFormReturn } from "react-hook-form";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser/dist/lib/types";
export type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

export type JSONFormSchema = {
  component?: string;
  dependentOn?: {
    name: string;
    value: string | number;
  };
} & JSONSchema;

type UIControlsMain = {
  RowRenderer: React.ElementType<any>;
  AddRowButton: React.ElementType<any>;
  RemoveRowButton: React.ElementType<any>;
  SubmitButton: React.ElementType<any>;
  ArrayErrorMessage: React.ElementType<any>;
  ArrayTitle: React.ElementType<any>;
  RowContainer: React.ElementType<any>;
};

export type UIControls = Partial<UIControlsMain>;

export type UISchema = {
  rowMap?: string[][];
  controls: UIControls;
};

export type FormProps = Omit<UseFormReturn, "handleSubmit">;

export type FieldComponentProps = {} & Field & FormProps;

export interface Field {
  type: KnownKeys<DefaultComponentDictionary>;
  name: string;
  label?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

export interface DefaultComponentDictionary {
  text: React.ReactNode;
  select: React.ReactNode;
  number: React.ReactNode;
  date: React.ReactNode;
  password: React.ReactNode;
  array: React.ReactNode;
}

export interface FormContext {
  registerForm: (v: any) => any;
  forms: Record<
    string,
    { name: string; ref: React.RefObject<HTMLFormElement> }
  >;
}

export type AnyOfRecord = {
  fieldName: string;
  visible: boolean;
};

import { JSONFormSchema } from "../types";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { FormContext } from "../Components/FormContext";
import useRenderSchema from "./useRenderSchema";
import { buildResolver } from "../lib/buildResolver";
import ComponentDictionary, { ComponentTypeMap } from "../Components/fields";
import get from "lodash.get";

export type UseFormSchemaProps = {
  name: string;
  schema: JSONFormSchema;
  defaultValues: any;
  debug: boolean;
  components?: Record<string, React.ElementType<any>>;
};

export function useFormSchema({
  name,
  schema,
  defaultValues,
  debug = false,
  components,
}: UseFormSchemaProps) {
  const ctx = useContext(FormContext);
  const formProps = useForm({
    shouldFocusError: false,
    resolver: async (data, context, options) => {
      const r = await buildResolver(schema, debug, data, context, options);
      return r(data, context, options);
    },
    defaultValues,
  });
  const { fields: fields_base } = useRenderSchema({ schema, formProps });
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (ctx && formRef.current) {
      ctx.registerForm({ name, ref: formRef.current });
    }
  }, []);
  const allComponents: any = { ...ComponentDictionary, ...components };
  const fields = useMemo(() => {
    return fields_base.map((field) => {
      const { type, component, ...fieldProps } = field;
      const error = get(formProps.formState.errors, fieldProps.name, null);
      if (components) {
        const Component = component
          ? (allComponents[component] ?? allComponents[component]) ||
            (allComponents[ComponentTypeMap[component]] ??
              allComponents[ComponentTypeMap[component]])
          : (allComponents[type] ?? allComponents[type]) ||
            (allComponents[ComponentTypeMap[type]] ??
              allComponents[ComponentTypeMap[type]]);
        return {
          ...field,
          Component,
          error,
        };
      }
      return field;
    });
  }, [fields_base, formProps.formState, components]);
  return {
    ref: formRef,
    formProps,
    fields,
  };
}

import React, { useContext, useEffect, useRef } from "react";
import { useForm, Resolver } from "react-hook-form";
import { FormContext } from "../FormContext";
import RenderSchema from "../RenderSchema";
import type { JSONFormSchema, UISchema, FormProps } from "../../types";
import { buildResolver } from "../../lib/buildResolver";
import { getVocabulary, schemaWalk } from "../../lib/schemaWalk";

export interface FormSchemaProps {
  uiSchema?: UISchema;
  name: string;
  schema: JSONFormSchema;
  defaultValues: any;
  onSubmit: (values: any) => void;
  children?: (props: FormProps) => React.ReactNode;
  components?: Record<string, React.ElementType<any>>;
  className?: string;
  debug?: boolean;
}

export const FormSchema = ({
  schema,
  className = "",
  defaultValues = {},
  name,
  onSubmit = (v) => console.log(v),
  components = {},
  uiSchema,
  debug = false,
  children,
}: FormSchemaProps) => {
  const ctx = useContext(FormContext);
  const { handleSubmit, ...formProps } = useForm({
    shouldFocusError: false,
    resolver: async (data, context, options) => {
      const resolver = await buildResolver(
        schema,
        debug,
        data,
        context,
        options
      );
      return resolver(data, context, options);
    },
    defaultValues,
  });
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (ctx && formRef.current) {
      ctx.registerForm({ name, ref: formRef.current });
    }
  }, []);

  return (
    <form
      data-testid={`test_${name}`}
      onSubmit={handleSubmit((values) => onSubmit(values))}
      ref={formRef}
      className={className}
      name={name}
    >
      <RenderSchema
        formProps={formProps}
        schema={schema}
        components={components}
        uiSchema={uiSchema}
        defaultValues={defaultValues}
        renderSubmit={typeof children !== "function"}
      />
      {children && children(formProps)}
    </form>
  );
};

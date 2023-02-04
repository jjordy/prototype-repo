import React, { useCallback, useEffect, useMemo, useState } from "react";
import { schemaToFields } from "../lib/schemaToFields";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import produce from "immer";
import { Field, JSONFormSchema, AnyOfRecord } from "../types";
import { UseFormReturn } from "react-hook-form";
import merger from "../lib/merge-allof";

type UseRenderSchemaProps = {
  schema: JSONFormSchema;
  formProps: Omit<UseFormReturn, "handleSubmit">;
};

export default function useRenderSchema({
  schema,
  formProps,
}: UseRenderSchemaProps) {
  const [fields, setFields] = useState<Field[]>([]);

  const updateFields = useCallback(
    (field: Field[]) => {
      if (Array.isArray(field)) {
        const newFields = produce(fields, (draft) => {
          field.forEach((f) => {
            const indexOfCurrentField = fields.findIndex(
              (ft: any) => ft.name === f.name
            );
            if (indexOfCurrentField > -1) {
              draft.splice(indexOfCurrentField, 1, f);
            }
          });
        });
        setFields(newFields);
      }
    },
    [fields]
  );

  useEffect(() => {
    const subscription = formProps.watch((values, { name }: any) => {
      const correspondingFields = fields
        .filter(
          (field) =>
            field?.dependentOn?.name === name &&
            field?.dependentOn?.value === values[name]
        )
        .map((field) => ({ ...field, visible: true }));

      const otherFieldsForName = fields
        .filter(
          (field) =>
            field?.dependentOn?.name === name &&
            field?.dependentOn?.value !== values[name]
        )
        .map((field) => ({ ...field, visible: false }));
      updateFields([...correspondingFields, ...otherFieldsForName]);
    });
    return () => subscription.unsubscribe();
  }, [formProps, fields, updateFields]);

  useEffect(() => {
    try {
      //@ts-expect-error
      const { normalized } = schemaToFields(merger(schema));
      setFields(normalized);
    } catch (err) {
      console.warn(`Error parsing schema`, err);
    }
  }, [schema]);

  return {
    fields,
  };
}

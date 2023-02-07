import React from "react";
import { UseFormReturn } from "react-hook-form";
import RenderComponent from "../RenderComponent";
import useControls from "../../hooks/useControls";
import useRenderSchema from "../../hooks/useRenderSchema";
import { UISchema } from "../../types";

type RenderSchemaProps = {
  schema: any;
  components: Record<string, React.ElementType> | {};
  formProps: Omit<UseFormReturn, "handleSubmit">;
  defaultValues: any;
  uiSchema?: UISchema | null;
  renderSubmit?: boolean;
};

export default function RenderSchema({
  schema,
  components,
  formProps,
  uiSchema = null,
  renderSubmit = true,
}: RenderSchemaProps) {
  const { fields } = useRenderSchema({ schema, formProps });
  const controls = useControls({ uiSchema });
  return (
    <div>
      {uiSchema &&
        uiSchema.rowMap &&
        uiSchema.rowMap.map((row: string[], rowId: number) => {
          const elements = (
            <controls.RowRenderer row={row}>
              {row.map((fieldName, fieldId) => {
                const field = fields.find(
                  (field: any) => field.name === fieldName
                );
                if (field) {
                  return (
                    <RenderComponent
                      key={`rhfs_row_${rowId}_field_${fieldId}`}
                      components={components}
                      field={field}
                      controls={controls}
                      {...formProps}
                    />
                  );
                }
                return null;
              })}
            </controls.RowRenderer>
          );
          return <div key={`rhfs_row_${rowId}`}>{elements}</div>;
        })}
      {!uiSchema?.rowMap &&
        fields &&
        fields.map((field: any, index: number) => {
          if (typeof field?.visible === "boolean") {
            if (field.visible) {
              return (
                <div key={`page_${index}_field_${index}`}>
                  <RenderComponent
                    components={components}
                    field={field}
                    controls={controls}
                    {...formProps}
                  />
                </div>
              );
            }
            return null;
          } else {
            return (
              <div key={`page_${index}_field_${index}`}>
                <RenderComponent
                  components={components}
                  field={field}
                  controls={controls}
                  {...formProps}
                />
              </div>
            );
          }
        })}
      {renderSubmit && <controls.SubmitButton />}
    </div>
  );
}

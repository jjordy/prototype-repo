import React from "react";
import { FieldValues, useFieldArray } from "react-hook-form";
import get from "lodash.get";

function renderArrayItems({
  key,
  parentName,
  items,
  components,
  idx,
  formState,
  ...rest
}: any) {
  return items.map(
    ({ type, component = null, ...fieldProps }: any, index: number) => {
      const error =
        fieldProps.name !== ""
          ? get(
              formState.errors,
              `${parentName}.${idx}.${fieldProps.name}`,
              null
            )
          : get(formState.errors, `${parentName}.${idx}`);

      const Component =
        components[component || type] ?? components[component || type];
      if (!Component) {
        console.warn(
          `Component: ${type} was not found. Check the 'interface' key 
         and make sure it matches something in your component dictionary.`
        );
        return null;
      }
      return (
        <Component
          {...rest}
          {...fieldProps}
          error={error}
          name={`${parentName}.${idx}${
            fieldProps.name !== "" ? `.${fieldProps.name}` : ""
          }`}
          id={`id_${parentName}.${idx}${
            fieldProps.name !== "" ? `.${fieldProps.name}` : ""
          }`}
          components={components}
          key={`${key}_${index}`}
        />
      );
    }
  );
}

export default function ArrayField({
  components,
  items,
  name,
  control,
  controls,
  title,
  error,
  ...rest
}: any) {
  const { fields, remove, append } = useFieldArray<
    FieldValues,
    string,
    "rhfs__internal__form_array_id"
  >({
    control,
    keyName: "rhfs__internal__form_array_id",
    name,
    ...rest,
  });

  const addRowValues = () => {
    const names = items?.map((item: { name: string }) => item.name);
    // if theres no name we know this is a string
    if (names && names[0] === "") {
      return "";
    }
    return names?.reduce((acc: Record<string, string>, curr: string) => {
      acc[curr] = "";
      return acc;
    }, {});
  };
  return (
    <div>
      <controls.ArrayTitle>{title}</controls.ArrayTitle>
      {fields?.map((field, index: number) => (
        <controls.RowContainer key={field.rhfs__internal__form_array_id}>
          <controls.RowRenderer row={items}>
            {renderArrayItems({
              ...rest,
              components,
              items,
              parentName: name,
              key: field.rhfs__internal__form_array_id,
              idx: index,
            })}
          </controls.RowRenderer>

          <controls.RemoveRowButton onClick={() => remove(index)} />
        </controls.RowContainer>
      ))}
      <controls.AddRowButton onClick={() => append(addRowValues())} />
      {error && (
        <controls.ArrayErrorMessage>{error.message}</controls.ArrayErrorMessage>
      )}
    </div>
  );
}

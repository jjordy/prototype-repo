import React from "react";
import { UseFormReturn } from "react-hook-form";
import ComponentDictionary, { ComponentTypeMap } from "../fields";
import { Field } from "../../types";
import get from "lodash.get";

interface RenderComponentProps extends Omit<UseFormReturn, "handleSubmit"> {
  components: Record<string, React.ElementType<any>>;
  field: Field;
  controls: Record<string, React.ElementType<any>>;
}

export default function RenderComponent({
  components,
  field: { type, component = null, ...fieldProps },
  formState,
  ...rest
}: RenderComponentProps) {
  const error = get(formState.errors, fieldProps.name, null);
  const allComponents: any = { ...ComponentDictionary, ...components };

  /**
   * If theres a component prop passed then we use that to override
   * We first search through the allComponents object to look for a match
   * if no match is found we look through the allComponents object with the type
   */
  let Component: any;
  if (component && allComponents[component]) {
    Component = allComponents[component];
  } else if (allComponents[type]) {
    Component = allComponents[type];
  }
  if (!Component) {
    console.warn(
      `Component: ${
        component || type
      } was not found. Check the 'type' or 'component' key and make sure it matches something in your component dictionary.`
    );
    return null;
  }

  return (
    <Component
      {...fieldProps}
      {...rest}
      formState={formState}
      components={allComponents}
      error={error}
    />
  );
}

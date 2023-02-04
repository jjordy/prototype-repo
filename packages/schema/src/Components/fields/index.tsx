import React from "react";
import ArrayField from "./Array";
import TextInput from "./TextInput";

const ComponentDictionary = {
  array: ArrayField,
  string: TextInput,
  integer: (props: any) => <TextInput type="number" {...props} />,
  date: (props: any) => <TextInput type="date" {...props} />,
};

export const ComponentTypeMap: Record<string, string> = {
  string: "text",
  integer: "number",
  date: "date",
  object: "object",
};

export default ComponentDictionary;

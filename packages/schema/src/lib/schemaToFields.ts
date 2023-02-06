import { Field, JSONFormSchema } from "../types";
import { getVocabulary, schemaWalk } from "./schemaWalk";
import { nanoid } from "nanoid/non-secure";
import { RHFS_COMPOSITION_KEYWORDS } from "./schemaOptions";

export function schemaToFields(s: JSONFormSchema) {
  const vocab = getVocabulary(s);
  const normalized: Field[] = [];
  schemaWalk(
    s,
    (schemaObj, pathFromParent, parentSchemaObj, rootPath) => {
      const fieldName = getFieldName(rootPath, pathFromParent);
      if (fieldName) {
        // check if our item is an array type for special handling
        const arr = buildArrayItem(schemaObj, fieldName, rootPath);
        if (arr) {
          normalized.push(arr);
        }
        const item = buildRootItem(
          schemaObj,
          fieldName,
          parentSchemaObj,
          rootPath
        );
        if (item) {
          normalized.push(item);
        }
      }
      const composition = buildCompositionItem(
        schemaObj,
        parentSchemaObj || {},
        fieldName,
        rootPath
      );
      if (composition) {
        normalized.push(composition);
      }
    },
    null,
    vocab
  );
  return { normalized };
}
/**
 * buildArrayItem
 * Builds the array field with the required sub items
 * this method supports building a complex array -> or basic array
 */
const buildArrayItem = (
  schemaObj: JSONFormSchema,
  fieldName: string,
  rootPath: any[]
) => {
  if (schemaObj.type === "array" && typeof schemaObj.items === "object") {
    const { type, properties = {} } = schemaObj?.items as JSONFormSchema;
    let items: any[] = [];
    switch (type) {
      case "string":
      case "boolean":
      case "integer":
      case "number":
        items = [{ id: `id_${fieldName}`, name: "", component: "string" }];
        break;
      case "object":
        items = Object.keys(properties).map((key) => {
          if (typeof properties?.[key]) {
            return buildItemProperties(
              key,
              properties?.[key] as JSONFormSchema,
              rootPath
            );
          }
        });
        break;
      default:
    }
    if (items && items.length > 0) {
      const field: Field = {
        name: fieldName,
        items,
        type: "array",
        title: schemaObj?.title,
        description: schemaObj?.description,
      };
      return field;
    }
  }
  return null;
};
/**
 * buildCompositionItem
 * build out items for json schema composition
 * in the context of our forms. allOf, anyOf, oneOf, not
 */
const buildCompositionItem = (
  schemaObj: JSONFormSchema,
  parentSchemaObj: JSONFormSchema,
  fieldName: string,
  rootPath?: any[]
) => {
  if (schemaObj?.anyOf) {
    if (Array.isArray(schemaObj?.anyOf)) {
      if (schemaObj.anyOf.length === 2) {
        const [ref, allowNull] = schemaObj.anyOf;
        const item = buildItemProperties(
          fieldName,
          //@ts-expect-error $ref is valid on this type is wrong.
          { ...schemaObj, component: ref.$ref, type: "string" },
          rootPath || []
        );
        console.log(item);
        return item;
      }
    }
  }
  if (schemaObj?.oneOf) {
    // TODO: Add oneOf logic
  }
  if (schemaObj?.not) {
    // TODO: Add not logic
  }
  return null;
};
/**
 *
 * buildRootItem
 * build a root type item This is an item that
 * will directly link to a component
 */
const buildRootItem = (
  schemaObj: JSONFormSchema,
  fieldName: string,
  parentSchemaObj?: JSONFormSchema,
  rootPath?: any[]
) => {
  // dont push anything if the parent is an array we took care of this above.
  if (parentSchemaObj?.type !== "array") {
    if (Array.isArray(schemaObj.type)) {
      schemaObj.type = schemaObj.type[0];
      return buildItemProperties(fieldName, schemaObj, rootPath || []);
    }
    switch (schemaObj.type) {
      case "string":
      case "integer":
      case "number":
      case "boolean":
        return buildItemProperties(fieldName, schemaObj, rootPath || []);
    }
    if (schemaObj.type === "object" && schemaObj.component) {
      return buildItemProperties(fieldName, schemaObj, rootPath || []);
    }
  }
  return;
};

/**
 * get the fields name calculates this based on the parent and root path.
 */
const getFieldName = (rootPath: any[], pathFromParent: any[]) => {
  const [__, rootFieldName] = rootPath;
  const [_, itemFieldName] = pathFromParent;
  let fieldName = "";
  if (rootPath.length > 0) {
    const parsedPath = rootPath?.filter(
      (v: string) =>
        v !== "properties" &&
        v !== "items" &&
        !RHFS_COMPOSITION_KEYWORDS.includes(v) &&
        isNaN(parseFloat(v))
    );
    if (parsedPath.length > 0) {
      fieldName = `${parsedPath.join(".")}${
        itemFieldName ? `.${itemFieldName}` : ""
      }`;
    } else {
      fieldName = itemFieldName;
    }
  } else {
    fieldName = itemFieldName;
  }
  return fieldName;
};
/**
 * Build the item properties
 *
 */
const buildItemProperties = (
  fieldName: string,
  {
    component,
    type,
    format,
    title = fieldName,
    description,
    default: defaultValue,
    ...rest
  }: JSONFormSchema,
  rootPath: any[]
) => {
  const field: Partial<Field> = {
    title,
    description,
  };
  field.id = `id_${fieldName}`;
  field.name = fieldName;
  field.component = component || type;
  field.type = type as any;
  field.defaultValue = defaultValue;
  // we dont pull this out in the spread because
  // enum is a reserved word i guess
  if (rest.enum) {
    field.component = component || "select";
    field.options = rest.enum.map((option: any) => ({
      label: option,
      value: option,
    }));
  }
  if (format) {
    switch (format) {
      case "date":
        field.component = component || "datetime";
        break;
      case "email":
        field.component = component || "email";
        break;
      case "password":
        field.component = component || "password";
        break;
      case "date-time":
        field.component = component || "datetime";
    }
  }
  return field as Field;
};

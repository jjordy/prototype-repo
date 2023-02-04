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
  rootPath?: any[]
) => {
  if (schemaObj?.anyOf) {
    if (Array.isArray(schemaObj?.anyOf)) {
      const anyOf: any = schemaObj?.anyOf;
      const name = nanoid();
      const anyOfOptions = anyOf.map(
        (obj: JSONFormSchema, idx: number) => obj?.title || idx + 1
      );

      schemaObj?.anyOf?.forEach((_item, id: number) => {
        if (schemaObj.anyOf && typeof _item === "object") {
          schemaObj.anyOf[id] = buildDepedencyTree(
            _item,
            name,
            _item.title || id
          );
        }
      });
      const anyOfSelect = buildItemProperties(
        name,
        { ...schemaObj, enum: anyOfOptions },
        rootPath || []
      );
      return anyOfSelect;
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
 * buildDependencyTree
 * this helper method will walk the properties of a schema
 * adding a custom dependentOn object used
 * by the form to conditionally hide and show fields
 */
const buildDepedencyTree = (
  schemaObj: JSONFormSchema,
  name: string,
  value: string | number
) => {
  const newObj = { ...schemaObj };
  switch (schemaObj?.type) {
    case "object":
      if (schemaObj?.properties) {
        newObj.properties = Object.keys(schemaObj?.properties).reduce(
          (acc: any, curr: any) => {
            if (typeof schemaObj.properties?.[curr] === "object") {
              acc[curr] = {
                // @ts-expect-error
                ...schemaObj.properties?.[curr],
                dependentOn: { name, value },
              };
            }

            return acc;
          },
          {}
        );
      }
  }
  return newObj;
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
      default:
        return;
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
    dependentOn,
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
  field.component = type;
  field.type = type as any;
  field.dependentOn = dependentOn;
  field.defaultValue = defaultValue;

  if (field.dependentOn) {
    field.visible = false;
  }
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
        field.component = component || "date";
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

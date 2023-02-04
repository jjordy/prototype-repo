export const RHFS_ALLOWED_KEYWORDS = {
  COMPONENT: "component",
  IS_NOT_EMPTY: "isNotEmpty",
  TRUE_REQUIRED: "trueRequired"
};

export const RHFS_COMPOSITION_KEYWORDS = ["anyOf", "oneOf", "not"];

export const RHFSCustomSchemaOptions = {
  keywords: [
    {
      keyword: RHFS_ALLOWED_KEYWORDS.COMPONENT,
      type: "string"
    },
    {
      keyword: RHFS_ALLOWED_KEYWORDS.IS_NOT_EMPTY,
      validate: (schema: any, data: any) => {
        return typeof data === "string" && data.trim() !== "";
      },
      errors: false
    },
    {
      keyword: RHFS_ALLOWED_KEYWORDS.TRUE_REQUIRED,
      validate: (schema: any, data: any) => {
        return typeof data === "boolean" && data;
      },
      errors: false
    }
  ]
};

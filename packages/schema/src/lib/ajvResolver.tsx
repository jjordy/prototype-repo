import { FieldValues, ResolverOptions, ResolverResult } from "react-hook-form";
import Ajv, { DefinedError } from "ajv";
import ajvErrors from "ajv-errors";
import ajvFormats from "ajv-formats";
import { appendErrors, FieldError } from "react-hook-form";

export type Resolver = <T>(
  schema: JSONFormSchema,
  schemaOptions?: any,
  factoryOptions?: { mode?: "async" | "sync" }
) => <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>
) => Promise<ResolverResult<TFieldValues>>;

import { toNestError, validateFieldsNatively } from "@hookform/resolvers";
import { JSONFormSchema } from "../types";

const parseErrorSchema = (
  ajvErrors: DefinedError[],
  validateAllFieldCriteria: boolean
) => {
  // Ajv will return empty instancePath when require errorajv
  ajvErrors.forEach((error) => {
    if (error.keyword === "required") {
      error.instancePath += "/" + error.params.missingProperty;
    }
  });

  return ajvErrors.reduce<Record<string, FieldError>>((previous, error) => {
    // `/deepObject/data` -> `deepObject.data`
    const path = error.instancePath.substring(1).replace(/\//g, ".");

    if (!previous[path]) {
      previous[path] = {
        message: error.message,
        type: error.keyword,
      };
    }

    if (validateAllFieldCriteria) {
      const types = previous[path].types;
      const messages = types && types[error.keyword];

      previous[path] = appendErrors(
        path,
        validateAllFieldCriteria,
        previous,
        error.keyword,
        //@ts-expect-error
        messages
          ? //@ts-expect-error
            ([] as string[]).concat(messages as string[], error.message || "")
          : error.message
      ) as FieldError;
    }

    return previous;
  }, {});
};

export const ajvResolver: Resolver =
  (schema, schemaOptions, resolverOptions = {}) =>
  async (values, _, options) => {
    const ajv = new Ajv({
      allErrors: true,
      validateSchema: true,
      ...schemaOptions,
    });
    console.log(schema);
    ajvFormats(ajv);
    ajvErrors(ajv);

    const validate = ajv.compile(
      Object.assign({ $async: resolverOptions?.mode === "async" }, schema)
    );
    const valid = validate(values);

    if (!valid) {
      return {
        values: {},
        errors: toNestError(
          parseErrorSchema(
            validate.errors as DefinedError[],
            !options.shouldUseNativeValidation && options.criteriaMode === "all"
          ),
          options
        ),
      };
    }

    options.shouldUseNativeValidation && validateFieldsNatively({}, options);

    return {
      values,
      errors: {},
    };
  };

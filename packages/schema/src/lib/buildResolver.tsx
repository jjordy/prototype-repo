import { Resolver, ResolverResult } from "react-hook-form";
import { JSONFormSchema } from "../types";
import { ajvResolver } from "./ajvResolver";
import { RHFSCustomSchemaOptions } from "./schemaOptions";
// we use a custom ajv resolver
// this provides 2 benefits
// # 1 We can use ajv/formats to get rich formatting using the format field in the schema
// # 2 We can pass a debug value and give some feedback if required about which field might not be validating
export async function buildResolver(
  schema: JSONFormSchema,
  debug: boolean,
  data: any,
  context: any,
  options: any
) {
  if (debug) {
    console.log("RHFS: Data", data);
    console.log(
      "RHFS: Validation result",
      await ajvResolver(schema, RHFSCustomSchemaOptions)(data, context, options)
    );
  }
  return ajvResolver(schema, RHFSCustomSchemaOptions);
}

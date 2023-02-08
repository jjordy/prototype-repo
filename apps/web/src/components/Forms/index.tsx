import React from "react";
import {
  FieldComponentProps,
  UIControls,
  FormSchema as BaseFormSchema,
  FormSchemaProps,
} from "@jjordy/form-schema";
import styles from "./index.module.css";
import { HiPlus, HiSaveAs, HiX } from "react-icons/hi";
import { Button, Combobox } from "@jjordy/ui";
import { RichTextEditor } from "./RichTextEditor";
import { trpc } from "@/lib/clients/trpc";

const Label = ({
  id,
  children,
}: {
  id?: string;
  children?: React.ReactNode;
}) => {
  return (
    <label htmlFor={id} className={styles.label}>
      {children}
    </label>
  );
};

const FieldGroup = ({
  children,
  inline = false,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) => (
  <div className={`${styles.fieldGroup} ${inline ? styles.inline : ""}`}>
    {children}
  </div>
);

export const ComponentDictionary = {
  string: ({
    register,
    name,
    id,
    title,
    error,
    description,
  }: FieldComponentProps) => (
    <FieldGroup>
      <Label id={id}>{title}</Label>
      <input
        type="text"
        {...register(name)}
        id={id}
        className={`${styles.inputBase} ${error ? styles.error : ""}`}
      />
      <p className={styles.description}>{description && description}</p>
      <p className={styles.errorMessage}>{error && error.message}</p>
    </FieldGroup>
  ),
  email: ({
    register,
    name,
    id,
    title,
    error,
    description,
  }: FieldComponentProps) => (
    <FieldGroup>
      <Label id={id}>{title}</Label>
      <input
        type="email"
        {...register(name)}
        id={id}
        className={`${styles.inputBase} ${error ? styles.error : ""}`}
      />
      <p className={styles.description}>{description && description}</p>
      <p className={styles.errorMessage}>{error && error.message}</p>
    </FieldGroup>
  ),
  hidden: ({
    register,
    name,
    id,
    title,
    error,
    description,
  }: FieldComponentProps) => (
    <FieldGroup>
      <input
        type="hidden"
        {...register(name)}
        id={id}
        className={`${styles.inputBase} ${error ? styles.error : ""}`}
      />
    </FieldGroup>
  ),
  password: ({
    register,
    name,
    id,
    title,
    error,
    description,
  }: FieldComponentProps) => (
    <FieldGroup>
      <Label id={id}>{title}</Label>
      <input
        type="password"
        {...register(name)}
        id={id}
        className={`${styles.inputBase} ${error ? styles.error : ""}`}
      />
      <p className={styles.description}>{description && description}</p>
      <p className={styles.errorMessage}>{error && error.message}</p>
    </FieldGroup>
  ),
  integer: ({
    register,
    name,
    id,
    title,
    error,
    description,
  }: FieldComponentProps) => (
    <FieldGroup>
      <Label id={id}>{title}</Label>
      <input
        type="number"
        {...register(name, { valueAsNumber: true })}
        id={id}
        className={`${styles.inputBase} ${error ? styles.error : ""}`}
      />
      <p className={styles.description}>{description && description}</p>
      <p className={styles.errorMessage}>{error && error.message}</p>
    </FieldGroup>
  ),
  number: ({
    register,
    name,
    id,
    title,
    error,
    description,
  }: FieldComponentProps) => (
    <FieldGroup>
      <Label id={id}>{title}</Label>
      <input
        type="number"
        {...register(name)}
        id={id}
        className={`${styles.inputBase} ${error ? styles.error : ""}`}
      />
      <p className={styles.description}>{description && description}</p>
      <p className={styles.errorMessage}>{error && error.message}</p>
    </FieldGroup>
  ),
  datetime: ({
    register,
    name,
    id,
    title,
    error,
    description,
  }: FieldComponentProps) => (
    <FieldGroup>
      <Label id={id}>{title}</Label>
      <input
        type="date"
        {...register(name)}
        id={id}
        className={`${styles.inputBase} ${error ? styles.error : ""}`}
      />
      <p className={styles.description}>{description && description}</p>
      <p className={styles.errorMessage}>{error && error.message}</p>
    </FieldGroup>
  ),
  select: ({
    title,
    name,
    register,
    options,
    id,
    defaultValue,
    error,
  }: FieldComponentProps) => {
    return (
      <FieldGroup>
        <Label id={id}>{title}</Label>
        <select
          {...register(name)}
          id={id}
          defaultValue={defaultValue}
          className={`${styles.inputBase} ${error ? styles.error : ""}`}
        >
          <option>Select a value</option>
          {options?.map((option: any, idx: any) => (
            <option value={option?.value} key={`${name}_opt_${idx}`}>
              {option?.label}
            </option>
          ))}
        </select>
        <p className={styles.errorMessage}>{error && error.message}</p>
      </FieldGroup>
    );
  },
  boolean: ({ title, name, register, id, error }: FieldComponentProps) => {
    return (
      <FieldGroup inline>
        <input
          type="checkbox"
          className={styles.inputCheck}
          {...register(name)}
          id={id}
        />
        <Label id={id}>{title}</Label>
        {error && <p className="!ml-2">({error.message})</p>}
      </FieldGroup>
    );
  },
  rte: ({
    title,
    name,
    register,
    id,
    error,
    setValue,
    getValues,
  }: FieldComponentProps) => {
    const value = getValues(name);
    const handleChangeValue = (v: any) => {
      setValue(name, { schema: v });
    };
    return (
      <>
        <Label id={id}>{title}</Label>
        <RichTextEditor
          initialValue={
            value || [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ]
          }
          onChange={(v) => handleChangeValue(v)}
        />
      </>
    );
  },
  textarea: ({ title, name, register, id, error }: FieldComponentProps) => {
    return (
      <>
        <Label id={id}>{title}</Label>
        <textarea
          {...register(name)}
          id={id}
          className={styles.inputBase}
          style={{ height: 150 }}
        />
      </>
    );
  },
  "#/definitions/User": ({
    title,
    name,
    register,
    id,
    error,
    setValue,
    getValues,
  }: FieldComponentProps) => {
    const value = getValues(name);
    const { data: { items } = { items: [] } } = trpc.user.list.useQuery({});
    const handleSetUser = (value: { id: number }) => {
      const user = items?.find((u: any) => u.id === value.id);
      setValue(name, user, { shouldValidate: true });
    };
    return (
      <>
        <Label id={id}>{title}</Label>
        {items && (
          <Combobox
            value={value || { id: null, name: "Select a value" }}
            options={items}
            onChange={handleSetUser}
          />
        )}
      </>
    );
  },
};

export const controls: UIControls = {
  RemoveRowButton: (props) => (
    <button
      className="ml-2 rounded-lg border-2 border-pink-500 p-1 text-pink-500"
      {...props}
    >
      <HiX className="h-5 w-5" />
    </button>
  ),
  AddRowButton: (props) => (
    <button
      type="button"
      className=" flex items-center rounded bg-sky-100 p-1 text-sky-500"
      {...props}
    >
      <HiPlus className="h-5 w-5" />
    </button>
  ),
  SubmitButton: (props) => (
    <Button
      type="submit"
      variant="success"
      {...props}
      className="flex w-full items-center justify-center text-xl font-semibold uppercase"
    >
      Save <HiSaveAs className="ml-2 h-5 w-5" />
    </Button>
  ),
  ArrayErrorMessage: ({ children }) => (
    <p className="font-medium text-pink-500">{children}</p>
  ),
  ArrayTitle: ({ children }) => (
    <div className="mb-4 text-3xl font-thin text-pink-500">{children}</div>
  ),
  RowContainer: ({ children }) => (
    <div className="mb-4 flex items-start rounded-xl border-2 border-sky-300 p-2">
      {children}
    </div>
  ),
};

type UISchema = FormSchemaProps["uiSchema"] & {
  // controls?: never;
  rowMap: string[][];
};

type LocalFormSchemaProps = FormSchemaProps & {
  uiSchema?: UISchema;
};

export const FormSchema = (props: LocalFormSchemaProps) => (
  <BaseFormSchema
    components={{ ...(props.components || {}), ...ComponentDictionary }}
    {...props}
    uiSchema={{ ...(props.uiSchema || {}), controls }}
  />
);

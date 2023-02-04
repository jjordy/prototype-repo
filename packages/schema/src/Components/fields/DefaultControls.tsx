import React, { PropsWithChildren } from "react";

export const DefaultRowRenderer = ({ row, children }: any) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
        gap: "1rem",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

export const DefaultAddRowButton = ({ children, ...rest }: any) => {
  return (
    <button type="button" title="Add Item" {...rest}>
      Add Row
    </button>
  );
};

export const DefaultRemoveRowButton = (props: any) => {
  return (
    <button type="button" title="Remove Item" {...props}>
      ❌
    </button>
  );
};

export const DefaultSubmitButton: React.FC<any> = (props) => {
  return (
    <button type="submit" {...props}>
      Submit Form
    </button>
  );
};

export const DefaultArrayErrorMsg: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <p style={{ color: "#f30" }}>{children}</p>;
};

export const DefaultArrayTitle: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <div style={{ fontSize: 20 }}>{children}</div>;
};

export const DefaultRowContainer: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <div style={{ display: "flex", alignItems: "flex-start" }}>{children}</div>
);

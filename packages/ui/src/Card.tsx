import * as React from "react";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={` rounded-2xl bg-white shadow-2xl ${className ?? ""}`}>
      <div className="p-4">{children}</div>
    </div>
  );
};

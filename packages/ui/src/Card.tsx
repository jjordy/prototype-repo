import * as React from "react";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={` ui-bg-white/10 ui-text-white ui-rounded-2xl ui-shadow-2xl ${
        className ?? ""
      }`}
    >
      <div className="ui-p-4">{children}</div>
    </div>
  );
};

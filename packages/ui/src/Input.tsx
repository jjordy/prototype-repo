import * as React from "react";
import cn from "classnames";

type InputProps = {
  label: string | React.ReactNode;
} & React.ComponentProps<"input">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, label, name, ...rest }, ref) => {
    return (
      <div className="ui-flex ui-flex-col ui-mb-2 ui-w-full">
        {label && (
          <>
            {typeof label === "string" ? (
              <label
                htmlFor={`id_${name}`}
                className="ui-font-semibold ui-text-white/70 ui-tracking-wide ui-mb-1"
              >
                {label}
              </label>
            ) : (
              { label }
            )}
          </>
        )}
        <input
          ref={ref}
          {...rest}
          id={`id_${name}`}
          name={name}
          className={cn(
            "ui-h-10 focus:ui-outline-none focus:ui-ring focus:ui-ring-3 focus:ui-ring-indigo-900/70 ui-px-2 ui-shadow ui-rounded-lg ui-bg-blue-900/40 ",
            className
          )}
        />
      </div>
    );
  }
);

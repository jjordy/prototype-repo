import * as React from "react";
import cn from "classnames";

type InputProps = {
  label: string | React.ReactNode;
  inline?: boolean;
} & React.ComponentProps<"input">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, label, name, inline = false, ...rest }, ref) => {
    return (
      <div
        className={cn(
          "flex w-full items-center",
          !inline && "mb-2 flex-col",
          inline && "my-8"
        )}
      >
        {label && (
          <>
            {typeof label === "string" ? (
              <label
                htmlFor={`id_${name}`}
                className={cn(
                  "mb-1 self-start font-semibold tracking-wide",
                  inline && "w-full max-w-sm"
                )}
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
            " focus:ring-3 shadow-200 h-10 w-full rounded-lg border border-slate-200 px-2 focus:outline-none focus:ring focus:ring-indigo-900/70 disabled:bg-slate-500/40 ",
            className,
            inline && "h-16"
          )}
        />
      </div>
    );
  }
);

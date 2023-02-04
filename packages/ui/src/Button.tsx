import * as React from "react";
import cn from "classnames";

type ButtonProps = React.ComponentProps<"button"> & {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "error" | "transparent";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, size = "medium", variant = "primary", ...rest },
    ref
  ) => {
    return (
      <button
        {...rest}
        className={cn(
          "rounded-lg transition duration-75 ease-in-out",
          className,
          size === "small" && " px-3 py-2",
          size === "medium" && " px-4 py-3",
          variant === "primary" &&
            "bg-indigo-500 text-white shadow-xl hover:bg-indigo-600",
          variant === "transparent" && ""
        )}
      >
        {children}
      </button>
    );
  }
);

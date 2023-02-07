import * as React from "react";
import cn from "classnames";

type ButtonProps = React.ComponentProps<"button"> & {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "error" | "transparent" | "success";
  active?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      size = "medium",
      variant = "primary",
      active = false,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        type="button"
        {...rest}
        className={cn(
          "rounded-2xl shadow-2xl transition duration-75 ease-in-out",
          className,
          size === "small" && " px-3 py-2",
          size === "medium" && " px-4 py-3",
          variant === "primary" &&
            "bg-indigo-500 text-white hover:bg-indigo-600",
          variant === "transparent" && "",
          variant === "success" && "bg-emerald-500 text-white",
          active && "bg-blue-600"
        )}
      >
        {children}
      </button>
    );
  }
);

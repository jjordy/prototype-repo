import * as React from "react";
import cn from "classnames";

type ButtonProps = React.ComponentProps<"button">;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <button
        {...rest}
        className={cn(
          "ui-rounded-lg ui-bg-indigo-500 hover:ui-bg-indigo-600 ui-transition ui-duration-75 ui-ease-in-out ui-px-4 ui-py-3 ui-shadow-xl",
          className
        )}
      >
        {children}
      </button>
    );
  }
);

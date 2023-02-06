import classNames from "classnames";

type BadgeProps = {
  variant?: string;
  children?: React.ReactNode;
  className?: string;
};
export function Badge({ children, variant, className, ...rest }: BadgeProps) {
  return (
    <div
      className={classNames(
        "inline-flex rounded-2xl px-4 py-0.5 text-sm font-semibold",
        variant === "primary" && "bg-indigo-500 text-white",
        variant === "secondary" && "bg-slate-200 text-slate-700",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

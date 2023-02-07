import classNames from "classnames";

type AvatarProps = {
  url?: string;
  name?: string;
} & React.ComponentProps<"div">;

function getInitials(name?: string) {
  return `${
    name
      ? name
          .split(" ")
          .map((c) => c.charAt(0))
          .join("")
      : "N/A"
  }`;
}

export default function Avatar({ url, name, className, ...rest }: AvatarProps) {
  return (
    <div
      className={classNames(
        "flex h-8 w-8 items-center justify-center rounded-full  text-xs ",
        className,
        name ? "bg-sky-500 text-white" : "bg-slate-200 text-slate-700"
      )}
    >
      {getInitials(name)}
    </div>
  );
}

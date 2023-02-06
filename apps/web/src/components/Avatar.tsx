import classNames from "classnames";

type AvatarProps = {
  url?: string;
  name?: string;
} & React.ComponentProps<"div">;

function getInitials(name: string) {
  return `${name
    .split(" ")
    .map((c) => c.charAt(0))
    .join("")}`;
}

export default function Avatar({ url, name, className, ...rest }: AvatarProps) {
  return (
    <div
      className={classNames(
        "flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white",
        className
      )}
    >
      {name && getInitials(name)}
    </div>
  );
}

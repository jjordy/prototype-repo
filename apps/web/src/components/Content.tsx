import { serialize } from "@/lib/content";
import cn from "classnames";
import { JsonValue } from "@jjordy/sync";
type ContentProps = React.ComponentProps<"div"> & {
  content?: JsonValue;
};

export default function Content({ content, className }: ContentProps) {
  return (
    <div
      className={cn(
        "prose prose-slate container mx-auto max-w-[1150px]",
        className
      )}
      dangerouslySetInnerHTML={{
        __html: serialize({
          children: content,
        }),
      }}
    />
  );
}

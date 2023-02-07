import { formatDistanceToNowStrict } from "date-fns";

export default function DateLabel({
  date,
  label = "Date: ",
}: {
  date?: Date;
  label?: string;
}) {
  return (
    <div className="flex items-center justify-between font-semibold">
      <span>Created: </span>
      <span className="rounded-2xl bg-slate-300 px-4 py-1 text-sm font-semibold text-slate-700">
        {date &&
          formatDistanceToNowStrict(date, {
            addSuffix: true,
          })}
      </span>
    </div>
  );
}

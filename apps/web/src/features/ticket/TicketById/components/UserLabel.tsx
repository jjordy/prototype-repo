export default function UserLabel({
  name,
  label,
}: {
  name?: string;
  label?: string;
}) {
  return (
    <div className="flex items-center justify-between font-semibold">
      {label}:{" "}
      {name && (
        <div className="rounded-2xl bg-indigo-300 px-4 py-1 text-sm font-semibold text-indigo-700">
          {name}
        </div>
      )}
    </div>
  );
}

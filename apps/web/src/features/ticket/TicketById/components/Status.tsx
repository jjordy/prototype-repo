export default function Status({ status }: { status: string | undefined }) {
  return (
    <div className="flex items-center justify-center rounded bg-slate-100 p-1 text-xs font-bold text-slate-700 ">
      {status}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="ml-1 h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
        />
      </svg>
    </div>
  );
}

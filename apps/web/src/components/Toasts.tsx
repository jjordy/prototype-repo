import useToast from "@/hooks/useToast";
import classNames from "classnames";
import { BiCheckShield, BiX } from "react-icons/bi";

export default function Toasts() {
  const { toasts, deleteToast } = useToast({});
  return (
    <div className="relative">
      <div className="fixed right-0 z-10 flex h-12 w-96 flex-col items-center">
        {toasts?.map((toast) => (
          <div
            key={`active_toast_${toast.id}`}
            className={classNames(
              "z-10 mt-4 mr-24 w-96 rounded-2xl p-4",
              toast.variant === "primary" && " bg-indigo-500 text-white",
              toast.variant === "error" && "bg-red-500 text-white"
            )}
          >
            <div className="flex items-center">
              {toast.variant === "primary" && (
                <BiCheckShield className="mr-2" />
              )}
              <div className="flex flex-col">
                <div className="font-semibold">{toast.title}</div>
                {toast.content}
              </div>
              <div className="mr-auto"></div>
              <button
                className="flex items-center rounded bg-slate-200 p-0.5 text-xs text-slate-700"
                onClick={() => deleteToast(toast)}
              >
                Clear <BiX className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { atomWithImmer as atom } from "jotai-immer";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";

type Toast = {
  content: React.ReactNode;
  title: React.ReactNode;
  variant: "primary" | "info" | "error";
  id?: string;
};

type UseToastProps = {};

const toastsAtom = atom<Toast[]>([]);

export default function useToast({}: UseToastProps) {
  const [toasts, setToasts] = useAtom(toastsAtom);
  let _timer;
  const createToast = (toast: Toast) => {
    const newToast = { ...toast, id: nanoid() };
    setToasts((t) => [...t, newToast]);
    _timer = setTimeout(() => {
      deleteToast(newToast);
    }, 1500);
  };
  useEffect(() => {
    return () => clearTimeout(_timer);
  }, []);
  const deleteToast = (toast: Toast) => {
    setToasts((t) => {
      const index = t.findIndex((s) => s.id === toast.id);
      if (index !== -1) t.splice(index, 1);
    });
  };

  return {
    createToast,
    toasts,
    deleteToast,
  };
}

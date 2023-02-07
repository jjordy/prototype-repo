import { useMemo } from "react";
import { trpc } from "@/lib/clients/trpc";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/clients/rest";
import useToast from "./useToast";

type UseAuthProps = {
  onFail?: () => any;
};

export default function useAuth({ onFail }: UseAuthProps = {}) {
  const { createToast } = useToast();
  const { isError, isLoading, isFetched, refetch } = trpc.auth.get.useQuery();
  const { mutateAsync: setToken } = useMutation({
    mutationFn: async (data: { token: string }) => api.post("/token", data),
    onSuccess: () => {
      refetch();
    },
    onError: () => {},
  });
  const authenticated = useMemo(() => {
    if (!isError && !isLoading) {
      return true;
    }
    if (isError && !isLoading && isFetched && onFail) {
      onFail();
    }
    return false;
  }, [isError, isLoading]);

  const { data: user } = trpc.user.byId.useQuery(
    { id: 1 },
    { enabled: authenticated }
  );
  return {
    authenticated,
    user,
    setToken,
  };
}

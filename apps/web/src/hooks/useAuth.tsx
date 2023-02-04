import { api } from "@/lib";
import useSWR from "swr";
import { Prisma } from "@jjordy/data";
import { useMemo } from "react";

type User = Omit<Prisma.UserSelect, "salt" | "hash" | "_count">;

type UseAuthProps = {
  onFail?: () => any;
};

export default function useAuth({ onFail }: UseAuthProps = {}) {
  const { error, isLoading, isValidating } = useSWR("/auth", api.get);
  const { data: user } = useSWR<User>(!error && !isLoading && "/user", api.get);

  const authenticated = useMemo(() => {
    if (!isLoading && !error) {
      return true;
    }
    if (error && !isLoading && !isValidating && onFail) {
      onFail();
    }
    return false;
  }, [error, isLoading]);
  return {
    authenticated,
    user,
  };
}

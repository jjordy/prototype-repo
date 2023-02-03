import { api } from "@/lib";
import useSWR from "swr";
import { Prisma } from "@jjordy/data";

type User = Omit<Prisma.UserSelect, "salt" | "hash" | "_count">;

export default function useAuth() {
  const { error, isLoading } = useSWR("/auth", api.get);
  const { data: user } = useSWR<User>(!error && !isLoading && "/user", api.get);
  return {
    authenticated: !error,
    user,
  };
}

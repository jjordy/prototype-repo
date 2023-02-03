import { api } from "../lib";
import useSWR from "swr";

export default function useAuth() {
  const { error } = useSWR("/auth", api.get);
  const { data: user } = useSWR(!error && "/user", api.get);
  console.log(error);
  return {
    authenticated: !error,
    user,
  };
}

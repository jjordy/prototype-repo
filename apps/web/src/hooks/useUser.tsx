import { trpc } from "@/lib/clients/trpc";
import { useRouter } from "next/router";
import useAuth from "./useAuth";
import useToast from "./useToast";

export default function useUser() {
  const { push } = useRouter();
  const { user, setToken } = useAuth({ onFail: () => push("/sign-in") });
  const { createToast } = useToast();
  const { data: profile, refetch } = trpc.user.byId.useQuery(
    { id: (user && user.id) || 0 },
    { enabled: Boolean(user?.id) }
  );

  const { mutate: update } = trpc.user.update.useMutation({
    onSuccess: () => {
      refetch();
      createToast({
        title: "Success",
        content: "Profile updated",
        variant: "primary",
      });
    },
    onError: () => {
      createToast({
        title: "Error",
        content: "Unable to update profile",
        variant: "error",
      });
    },
  });

  const { mutate: signin } = trpc.user.signin.useMutation({
    onError: (err) => {
      if (err?.data?.code === "NOT_FOUND") {
        createToast({
          title: "Error",
          content: "Unable to log you in with that information",
          variant: "error",
        });
      } else {
        createToast({
          title: "Error",
          content: "Unable to log you in with that information",
          variant: "error",
        });
      }
    },
    onSuccess: (data) => {
      setToken(data).then(() => push("/"));
    },
  });

  const { mutate: signup } = trpc.user.signup.useMutation({
    onSuccess: (data) => {
      createToast({
        title: "Success",
        content: "Account created successfully.",
        variant: "primary",
      });
      setToken(data).then(() => push("/profile"));
    },
    onError: () => {
      createToast({
        title: "Error",
        content: "Unable to sign you up, please try again later.",
        variant: "error",
      });
    },
  });
  return {
    update,
    profile,
    signin,
    signup,
  };
}

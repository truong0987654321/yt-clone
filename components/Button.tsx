import { useLogout } from "@/hooks/useLogout";
import { CircleUser } from "lucide-react";
import { Button } from "./ui/element/button";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { Loading } from "./Loading";
import { cn } from "@/lib/utils/cn";
import { HtmlHTMLAttributes } from "react";

export const ButtonLogin = () => {
  const googleLoginMutation = useMutation({
    mutationFn: authService.googleLogin,

    onSuccess: (data) => {
      window.location.href = data.auth_url;
    },

    onError: (error) => {
      console.error("Google login failed:", error);
    },
  });
  function handleLogin() {
    const state = crypto.randomUUID();

    sessionStorage.setItem("oauth_state", state);

    googleLoginMutation.mutate({ state });
  }
  const loading = googleLoginMutation.isPending;
  return (
    <Button
      disabled={loading}
      onClick={handleLogin}
      className="flex flex-row gap-1 border border-solid border-border px-3 h-9 items-center justify-center rounded-2xl cursor-pointer hover:bg-[#def1ff] hover:border-transparent"
    >
      {loading ? (
        <Loading className="text-btn-action" />
      ) : (
        <CircleUser className="size-6 text-btn-action" />
      )}
      <span className="text-ellipsis overflow-hidden whitespace-nowrap text-[14px] text-btn-action">
        Sign in
      </span>
    </Button>
  );
};

export const ButtonLogout = ({ children }: { children: React.ReactNode }) => {
  const { mutate: logout, isPending: loading } = useLogout();

  const handleLogout = () => {
    logout();
  };
  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm mb-2 w-full"
    >
      {loading ? <Loading /> : children}
    </Button>
  );
};
interface ButtonActionProps extends HtmlHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
}

export const ButtonAction = ({
  children,
  active,
  ...props
}: ButtonActionProps) => {
  return (
    <Button
      data-active={active}
      className="group inline-flex text-inherit border-none cursor-pointer outline-0 box-border bg-none no-underline p-0 "
      {...props}
    >
      <div className="group-data-[active=true]:text-foreground-selected group-data-[active=true]:bg-btn-selected text-foreground bg-btn px-3 py-0 relative inline-flex items-center border-none rounded-lg h-8 min-w-3 whitespace-nowrap text-[14px] leading-8 font-medium w-full">
        {children}
      </div>
    </Button>
  );
};

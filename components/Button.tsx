import { useLogout } from "@/hooks/useLogout";
import { CircleUser } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { Loading } from "./Loading";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ComponentProps<typeof Button>;

export const ButtonLogin = () => {
  const { t } = useI18n();

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
      className="flex flex-row gap-1 border border-solid border-border px-3 h-9 items-center justify-center rounded-2xl cursor-pointer hover:bg-btn-action-hover hover:border-transparent"
    >
      {loading ? (
        <Loading className="text-btn-action" />
      ) : (
        <CircleUser className="size-6 text-btn-action" />
      )}
      <span className="text-ellipsis overflow-hidden whitespace-nowrap text-sm text-btn-action">
        {t("app.signIn")}
      </span>
    </Button>
  );
};

export const ButtonLogout = ({ children, ...props }: ButtonProps) => {
  const { mutate: logout, isPending: loading } = useLogout();

  const handleLogout = () => {
    logout();
  };
  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm mb-2 w-full"
      {...props}
    >
      {loading ? <Loading /> : children}
    </Button>
  );
};
interface ButtonCategoryProps extends ButtonProps {
  active?: boolean;
}

export const ButtonCategory = ({
  children,
  active,
  ...props
}: ButtonCategoryProps) => {
  return (
    <Button
      data-active={active}
      className="group inline-flex text-inherit border-none cursor-pointer outline-0 box-border bg-none no-underline my-3"
      {...props}
    >
      <div className="group-data-[active=true]:text-foreground-selected group-data-[active=true]:bg-btn-selected text-foreground bg-btn px-3 py-0 relative inline-flex items-center border-none rounded-lg h-8 min-w-3 whitespace-nowrap text-sm leading-8 font-medium w-full">
        {children}
      </div>
    </Button>
  );
};

export const ButtonProfilePhoto = () => {
  const { t } = useI18n();

  return (
    <Button className="flex flex-row gap-1 border-0 px-3 h-9 items-center justify-center rounded-2xl cursor-pointer hover:bg-btn-action-hover hover:border-transparent">
      <span className="text-ellipsis overflow-hidden whitespace-nowrap text-sm text-btn-action">
        {t("app.selectPicture")}
      </span>
    </Button>
  );
};

export const ButtonAction = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <Button
      className={cn(
        "text-foreground bg-btn hover:bg-btn-hover relative m-0 whitespace-nowrap min-w-0 font-medium border-none cursor-pointer outline-0 flex items-center justify-center flex-row px-4 py-0 text-sm leading-9 rounded-[18px] h-9",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export const ButtonControl = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <Button
      className={cn(
        "text-foreground-selected bg-btn-selected hover:bg-btn-selected/80 relative m-0 whitespace-nowrap min-w-0 font-medium border-none cursor-pointer outline-0 flex items-center justify-center flex-row px-4 py-0 text-sm leading-9 rounded-[18px] h-9",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

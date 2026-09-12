"use client";

import { ButtonIcon } from "./ui/button";
import { Bell, Plus } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SettingsMenu } from "./navbar/SettingsMenu";
import { ButtonAction, ButtonLogin } from "./Button";
import { useI18n } from "@/i18n/context";
import { useActiveChannel } from "@/hooks/useChannel";

export const UserButton = () => {
  const { t } = useI18n();

  const { data: user, isLoading } = useCurrentUser();
  const activeChannel = useActiveChannel();

  if (isLoading) {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <SettingsMenu />
        <ButtonLogin />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center">
      <div className="mr-2 flex max-mb:mr-0">
        <ButtonAction>
          <Plus className="mr-1.5 -ml-1.5" />
          {t("app.create")}
        </ButtonAction>
      </div>
      <div className="mr-2 flex max-mb:mr-0 max-mb:ml-2 max-mb-sm:hidden">
        <ButtonIcon
          sizeIcon="size-6"
          className="[&_span:first-child]:bg-background [&_span:first-child]:group-hover/button:before:bg-btn [&_span:first-child]:group-hover/button:before:opacity-100 *:text-foreground"
          position="bottom"
          content={t("app.notification")}
        >
          <Bell fill="none" stroke="currentColor" strokeWidth="2" />
        </ButtonIcon>
      </div>
      <div>
        <SettingsMenu user={user} channel={activeChannel} />
      </div>
    </div>
  );
};

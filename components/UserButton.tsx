"use client";

import { ButtonIcon } from "./ui/button";
import { Bell, Plus } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SettingsMenu } from "./navbar/SettingsMenu";
import { ButtonLogin } from "./Button";

export const UserButton = () => {
  const { data: user, isLoading } = useCurrentUser();

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
      <div className="mr-2 flex">
        <button className="text-foreground bg-btn hover:bg-btn-hover relative m-0 whitespace-nowrap min-w-0 font-medium border-none cursor-pointer outline-0 flex items-center justify-center flex-row px-4 py-0 h-9 text-[14px] leading-9 rounded-[18px]">
          <Plus className="mr-1.5 -ml-1.5" />
          Create
        </button>
      </div>
      <div className="mr-2 flex max-[656px]:mr-0 max-[428px]:hidden">
        <ButtonIcon
          sizeIcon="size-6"
          className="[&_span:first-child]:bg-background [&_span:first-child]:group-hover/button:before:bg-btn [&_span:first-child]:group-hover/button:before:opacity-100 *:text-foreground"
          position="bottom"
          content="Notification"
        >
          <Bell fill="none" stroke="currentColor" strokeWidth="2" />
        </ButtonIcon>
      </div>
      <div>
        <SettingsMenu user={user} />
      </div>
    </div>
  );
};

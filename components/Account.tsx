"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useI18n } from "@/i18n/context";
import { Avatar } from "./ui/avatar";
import { useActiveChannel } from "@/hooks/useChannel";
import { ChannelCreateModal } from "./modals/ChannelCreateModal";
import { useState } from "react";
import Link from "next/link";
import { PAGES } from "@/lib/constants";

export const Account = () => {
  const { t } = useI18n();
  const { data: user } = useCurrentUser();

  const activeChannel = useActiveChannel();

  const [openCreateChannel, setOpenCreateChannel] = useState(false);

  if (!user) return null;
  return (
    <>
      {/* Header */}
      <div className="min-h-45 flex border-b border-border">
        <div className="w-full grow pt-12 justify-between flex flex-row">
          <div className="pb-6">
            <div className="text-base font-medium">{t("account.title")}</div>
            <div className="mx-0 my-[40px_12px] text-[24px] leading-8 font-bold">
              {t("account.introduction")}
            </div>
            <div className="text-sm font-normal text-foreground-tertiary">
              {t("account.signedInAs", { email: user.email })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-b border-border flex-col">
        <div className="flex justify-between flex-col">
          <h2 className="pt-6 pb-2 text-xl font-bold truncate">
            {t("account.yourChannel", { name: t("app.name") })}
          </h2>
          <span className="text-xs font-normal truncate text-foreground-tertiary">
            {t("account.ycDescription")}
          </span>
        </div>
        <div className="flex flex-row py-5 justify-start">
          <div className="w-40 min-w-20 mr-14 text-sm font-medium">
            {t("account.yourChannel", { name: "" })}
          </div>
          <div className="w-full flex justify-center flex-col">
            {activeChannel && (
              <div className="flex justify-start pb-5 pt-1 items-center">
                <Avatar className="mr-5">
                  <Avatar.Img
                    src={activeChannel.avatar_url ?? "/logo.svg"}
                    alt={activeChannel.name ?? "user"}
                    size={50}
                    className="ml-0"
                  />
                </Avatar>
                <span>{activeChannel.name}</span>
              </div>
            )}
            <div>
              {activeChannel ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href={""}
                    className="text-sm font-normal text-btn-action"
                  >
                    {t("account.channelStatus")}
                  </Link>
                  <Link
                    href={PAGES.CHANNEL}
                    className="text-sm font-normal text-btn-action"
                  >
                    {t("account.channelManage")}
                  </Link>
                </div>
              ) : (
                <span
                  onClick={() => setOpenCreateChannel(true)}
                  className="text-sm font-normal text-btn-action"
                >
                  {t("settings.createChannel")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChannelCreateModal
        open={openCreateChannel}
        onOpenChange={setOpenCreateChannel}
      />
    </>
  );
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMyChannels } from "@/hooks/useChannel";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, AlertCircle, Camera } from "lucide-react";
import { Loading } from "@/components/Loading";
import Link from "next/link";
import { ChannelDescriptionModal } from "@/components/modals/ChannelDescriptionModal";
import { HoverCard } from "@/components/ui/hover-card";
import Image from "next/image";
import { ButtonAction, ButtonControl } from "@/components/Button";
import { useI18n } from "@/i18n/context";
import { PAGES } from "@/lib/constants";
import { Channel } from "@/lib/types";

type ViewChannelProps = {
  channel: Channel | undefined;
  isLoading: boolean;
  isError: boolean;
  channelIdentifier: string;
};

export default function ViewChannel({
  channel,
  isLoading,
  isError,
  channelIdentifier,
}: ViewChannelProps) {
  const router = useRouter();
  const { t } = useI18n();

  const { data: currentUser } = useCurrentUser();
  const { data: myChannels = [] } = useMyChannels();

  const [showChannelDescriptionModal, setShowChannelDescriptionModal] =
    useState(false);

  const isOwner =
    currentUser &&
    (channel?.user_id === currentUser.id ||
      myChannels.some((c) => c.id === channel?.id));

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading className="size-16" />
      </div>
    );
  }

  if (isError || !channel) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="size-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">{t("channel.notFound")}</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {t("channel.notFoundDescription", { identifier: channelIdentifier })}
        </p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("backToHome")}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex-none block relative z-0">
        <div className="before:absolute before:right-0 before:-bottom-1.25 before:left-0 before:w-full before:h-1.25 before:content-[''] before:transition-opacity before:duration-40 before:pointer-events-none before:opacity-0 before:shadow-[inset_0_5px_6px_-3px_rgba(0,0,0,.4)] before:will-change-[opacity]">
          <div className="bg-transparent relative flex-col flex">
            {/* Banner */}
            {channel.banner_url && (
              <div className="pr-[calc(50%-535px)] pl-[calc(50%-535px)] max-mb:py-5">
                <HoverCard
                  placement="custom"
                  className="overflow-hidden rounded-2xl h-43 max-mb:h-14.5 max-mb:rounded-lg"
                >
                  <Image
                    src={"/test-img.png"}
                    alt="banner"
                    width={450}
                    height={450}
                    className="size-full object-cover inline-block min-h-px min-w-px "
                  />
                  {isOwner && (
                    <HoverCard.Content className="bottom-4 right-4">
                      <ButtonControl className="flex items-center justify-center gap-2">
                        <Camera className="h-6" />
                        <span className="text-sm font-normal">
                          {t("app.edit")}
                        </span>
                      </ButtonControl>
                    </HoverCard.Content>
                  )}
                </HoverCard>
              </div>
            )}

            {/* Channel */}
            <div className="pr-[calc(50%-535px)] pl-[calc(50%-535px)] max-mb:py-5 pt-4 h-full block">
              <div className="grid gap-x-4 gap-y-0 grid-cols-[160px_1fr] [grid-template-areas:'avatar_info'_'avatar_button'] max-mb:grid-cols-[72px_1fr] max-mb:[grid-template-areas:'avatar_info'_'button_button']">
                {/* AVATAR */}
                <div className="[grid-area:avatar] flex items-center">
                  <HoverCard placement="custom">
                    <Avatar>
                      <Avatar.Img
                        src={channel.avatar_url ?? "/logo.svg"}
                        alt={channel.name ?? "channel"}
                        size={160}
                        className="m-0 max-mb:size-18"
                      />
                    </Avatar>
                    {isOwner && (
                      <HoverCard.Content className="inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)] size-full rounded-full">
                        <div className="">
                          <Camera className="text-foreground-secondary" />
                        </div>
                      </HoverCard.Content>
                    )}
                  </HoverCard>
                </div>

                {/* INFO: Name, Handle, Description */}
                <div className="[grid-area:info] flex flex-col grow min-w-0">
                  {/* Name */}
                  <h1 className="truncate text-[36px] leading-12.5 font-bold max-mb:text-[24px] max-mb:leading-8">
                    <span>{channel.name}</span>
                  </h1>

                  {/* Handle */}
                  <div className="flex items-center mt-0.5 overflow-hidden min-w-0 max-w-full">
                    <span className="truncate text-sm font-normal max-mb:text-[12px] max-mb:leading-4.5">
                      {channel.handle}
                    </span>
                    {channel.subscribers_count && (
                      <>
                        <span className="text-sm mt-0.5 m-1 text-foreground-tertiary max-mb:text-[12px] max-mb:leading-4.5">
                          •
                        </span>
                        <span className="text-sm mt-0.5 m-1 text-foreground-tertiary max-mb:text-[12px] max-mb:leading-4.5">
                          {t("channel.subscriber", {
                            subscriber: channel.subscribers_count,
                          })}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <div
                    className="cursor-pointer mt-3 flex items-center max-w-150"
                    onClick={() => setShowChannelDescriptionModal(true)}
                  >
                    {channel.description ? (
                      <span className="overflow-hidden whitespace-nowrap inline-block text-sm font-normal mask-[linear-gradient(to_top,transparent_0%,transparent_2rem,rgb(0,0,0)2rem,rgb(0,0,0)100%),linear-gradient(to_right,rgb(0,0,0)_0px,rgb(0,0,0)486px,)transparent_520px] max-mb:text-[12px] max-mb:leading-4.5">
                        {channel.description}
                      </span>
                    ) : (
                      <span className="text-sm font-normal text-foreground-tertiary max-mb:text-[12px] max-mb:leading-4.5">
                        {t("channel.noDescription")}
                      </span>
                    )}
                    <span className="mx-0.5">...</span>
                    <button className="text-sm font-medium cursor-pointer whitespace-nowrap text-foreground max-mb:text-[12px] max-mb:leading-4.5">
                      {t("app.more")}
                    </button>
                  </div>
                </div>

                {/* BUTTON */}
                <div className="[grid-area:button] mt-2">
                  <div className="flex items-center gap-2 max-mb:w-full">
                    {isOwner ? (
                      <>
                        <ButtonAction className="max-mb:flex-1">
                          <Link
                            href={PAGES.CHANNEL}
                            className="text-sm leading-10 truncate font-medium"
                          >
                            {t("app.customiseChannel")}
                          </Link>
                        </ButtonAction>
                        <ButtonAction className="max-mb:flex-1">
                          <Link
                            href={PAGES.CHANNEL}
                            className="text-sm leading-10 truncate font-medium"
                          >
                            {t("app.manageVideos")}
                          </Link>
                        </ButtonAction>
                      </>
                    ) : (
                      <ButtonControl className="max-mb:flex-1">
                        {t("app.subscribe")}
                      </ButtonControl>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChannelDescriptionModal
        open={showChannelDescriptionModal}
        onOpenChange={setShowChannelDescriptionModal}
        channel={channel}
      />
    </>
  );
}

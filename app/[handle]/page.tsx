"use client";

import { use } from "react";
import { useChannelByHandle } from "@/hooks/useChannel";
import ViewChannel from "@/modules/home/ui/views/ViewChannel";
import { PageTitle } from "@/components/PageTitle";

type PageProps = {
  params: Promise<{ handle: string }>;
};

export default function ChannelHandlePage({ params }: PageProps) {
  const { handle: rawHandle } = use(params);

  // Chuẩn hóa handle (đảm bảo có @)
  const decoded = decodeURIComponent(rawHandle);

  const handle = decoded.startsWith("@") ? decoded : `@${decoded}`;

  const { data: channel, isLoading, isError } = useChannelByHandle(handle);

  return (
    <>
      <PageTitle titleKey="settings.title" />
      <ViewChannel
        channel={channel}
        isLoading={isLoading}
        isError={isError}
        channelIdentifier={handle}
      />
    </>
  );
}

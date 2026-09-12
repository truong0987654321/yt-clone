"use client";

import { use } from "react";
import { useChannelById } from "@/hooks/useChannel";
import ViewChannel from "@/modules/home/ui/views/ViewChannel";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ChannelPage({ params }: PageProps) {
  const { id } = use(params);
  const decodedParam = decodeURIComponent(id);

  const { data: channel, isLoading, isError } = useChannelById(decodedParam);

  return (
    <ViewChannel
      channel={channel}
      isLoading={isLoading}
      isError={isError}
      channelIdentifier={id}
    />
  );
}

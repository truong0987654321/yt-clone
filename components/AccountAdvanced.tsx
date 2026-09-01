"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Copy } from "./ui/Copy";
import { useMyChannels } from "@/hooks/useChannel";
import { useState } from "react";
import { ChannelDeleteModal } from "./modals/ChannelDeleteModal";
import { Channel } from "@/lib/types";

export const AccountAdvanced = () => {
  const { data: user } = useCurrentUser();
  const { data: channels = [] } = useMyChannels();

  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);

  if (!user) return null;

  const hasChannel = channels.length > 0;

  return (
    <>
      <div className="min-h-45 flex border-b border-border">
        <div className="w-full grow pt-12 justify-between flex flex-row">
          <div className="pb-6">
            <div className="text-[16px] leading-5.5 font-medium">
              Advanced settings
            </div>
            <div className="mx-0 my-[40px_12px] text-[24px] leading-8 font-bold">
              Set up YouTube exactly how you want it
            </div>
          </div>
        </div>
      </div>
      <div className="m-0 flex flex-col">
        {/* User ID Row */}
        <div className="px-0 py-5 flex flex-row justify-start">
          <div className="w-40 min-w-20 mr-14 text-foreground text-[14px] leading-5 font-medium flex items-center">
            User ID
          </div>
          <div className="w-full justify-center flex flex-col">
            <div className="inline-block w-full max-w-87.5">
              <Copy
                valueCopy={user.id}
                className="flex justify-between items-center border border-border bg-transparent px-0 py-1 rounded-xl"
              >
                <Copy.Text className="ml-4 border-none w-full truncate text-foreground text-[14px] min-w-0" />

                <div className="px-2 py-0 flex">
                  <Copy.Button className="px-3.75 py-0 border border-border rounded-[20px] h-10" />
                </div>
              </Copy>
            </div>
          </div>
        </div>

        {/* CHỈ HIỂN THỊ HÀNG CHANNEL ID VÀ DELETE CHANNEL KHI ĐÃ CÓ CHANNEL */}
        {hasChannel && (
          <>
            {/* Channel ID Row */}
            <div className="px-0 py-5 flex flex-row justify-start">
              <div className="w-40 min-w-20 mr-14 text-foreground text-[14px] leading-5 font-medium flex items-center">
                Channel ID
              </div>
              <div className="w-full justify-center flex flex-col">
                <div className="flex flex-col gap-3">
                  {channels.map((chan) => (
                    <div
                      key={chan.id}
                      className="inline-block w-full max-w-87.5"
                    >
                      {channels.length > 1 && (
                        <span className="text-xs text-muted-foreground block mb-1 font-medium">
                          {chan.name} ({chan.handle})
                        </span>
                      )}
                      <Copy
                        valueCopy={chan.id}
                        className="flex justify-between items-center border border-border bg-transparent px-0 py-1 rounded-xl"
                      >
                        <Copy.Text className="ml-4 border-none w-full truncate text-foreground text-[14px] min-w-0" />

                        <div className="px-2 py-0 flex">
                          <Copy.Button className="px-3.75 py-0 border border-border rounded-[20px] h-10" />
                        </div>
                      </Copy>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delete Channel Row */}
            <div className="px-0 py-5 flex flex-row justify-start">
              <div className="w-40 min-w-20 mr-14 text-foreground text-[14px] leading-5 font-medium flex">
                Delete channel
              </div>
              <div className="w-full justify-center flex flex-col gap-3">
                {channels.map((chan) => (
                  <div key={chan.id} className="flex flex-col">
                    <div
                      className="text-btn-action font-medium text-[14px] leading-5 cursor-pointer hover:underline"
                      onClick={() => setChannelToDelete(chan)}
                    >
                      Delete Channel{" "}
                      {channels.length > 1 ? `(${chan.name})` : ""}
                    </div>
                    <span className="text-foreground-tertiary text-[14px] leading-5">
                      Deleting your YouTubeCL channel won&apos;t close your
                      Google Account
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <ChannelDeleteModal
        open={!!channelToDelete}
        onOpenChange={(open) => {
          if (!open) setChannelToDelete(null);
        }}
        channel={channelToDelete}
      />
    </>
  );
};

"use client";

import { Channel } from "@/lib/types";
import { Dialog } from "../ui/dialog";
import { useI18n } from "@/i18n/context";
import { InfoChannel } from "../InfoChannel";
import { ButtonAction } from "../Button";
import { Share } from "../icons/Icon";
import { Scrollbar } from "../ui/scrollbar";

interface ChannelDescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel?: Channel | null;
}
export const ChannelDescriptionModal = ({
  open,
  onOpenChange,
  channel,
}: ChannelDescriptionModalProps) => {
  const { t } = useI18n();

  if (!channel) return null;

  return (
    <Dialog open={open} setOpen={onOpenChange}>
      <Dialog.Content className="min-h-50 max-h-[calc(100vh-8rem)] pr-1">
        <Dialog.Header className="text-[20px] font-bold leading-7 pl-4">
          {channel.name}
        </Dialog.Header>
        <Scrollbar size={2}>
          <div className="px-4">
            {channel.description && (
              <>
                <h2 className="mt-4 mb-2 text-[20px] leading-7 font-bold">
                  <span>{t("channelDescription.title")}</span>
                </h2>
                <div className="pb-4">{channel.description}</div>
              </>
            )}
            <h2 className="block mt-4 mb-2 text-[20px] leading-7 font-bold">
              {t("channelDescription.moreInfo")}
            </h2>
            <InfoChannel channel={channel} />
          </div>
          <Dialog.Footer className="justify-between pb-6 mt-3">
            <ButtonAction className="h-10">
              <Share className="mr-1.5" /> Share channel
            </ButtonAction>
          </Dialog.Footer>
        </Scrollbar>
      </Dialog.Content>
    </Dialog>
  );
};

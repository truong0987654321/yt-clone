import { Channel } from "@/lib/types";
import { Dialog } from "../ui/dialog";
import { useDeleteChannel } from "@/hooks/useChannel";
import { useState } from "react";
import { useI18n } from "@/i18n/context";

interface ChannelDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel?: Channel | null;
}

export const ChannelDeleteModal = ({
  open,
  onOpenChange,
  channel,
}: ChannelDeleteModalProps) => {
  const { t, tRich } = useI18n();

  const deleteChannel = useDeleteChannel();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!channel) return null;

  const handleDelete = () => {
    setErrorMsg(null);
    deleteChannel.mutate(channel.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: (err: unknown) => {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setErrorMsg(
          axiosErr.response?.data?.message ||
            "Failed to delete channel. Please try again.",
        );
      },
    });
  };

  return (
    <Dialog open={open} setOpen={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title className="text-[24px] leading-8 font-bold">
            {t("channelDeleteModal.title", { name: channel.name })} ?
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Description className="flex flex-col text-sm font-normal py-4 px-6 gap-3">
          <p>
            {tRich("channelDeleteModal.description", {
              description: (
                <>
                  <strong>{channel.name}</strong> ({channel.handle})
                </>
              ),
            })}
          </p>
          <p className="text-foreground-error text-xs font-semibold">
            {t("channelDeleteModal.warning")}
          </p>
          {errorMsg && (
            <p className="text-foreground-error font-medium text-sm mt-1">
              {errorMsg}
            </p>
          )}
        </Dialog.Description>
        <Dialog.Footer>
          <Dialog.Cancel className="rounded-2xl bg-background-secondary hover:bg-btn-hover border-0">
            {t("app.cancel")}
          </Dialog.Cancel>
          <Dialog.Action
            onClick={handleDelete}
            disabled={deleteChannel.isPending}
            className="rounded-2xl bg-background-secondary text-foreground-error [&:hover,&:focus]:bg-background-error"
          >
            {deleteChannel.isPending ? "" : t("app.deleteChannel")}
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

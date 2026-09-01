import { Channel } from "@/lib/types";
import { Dialog } from "../ui/dialog";
import { useDeleteChannel } from "@/hooks/useChannel";
import { useState } from "react";

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
            Delete channel &ldquo;{channel.name}&rdquo;?
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Description className="flex flex-col text-[14px] leading-5 font-normal py-4 px-6 gap-3">
          <p>
            Deleting your YouTubeCL channel <strong>{channel.name}</strong> (@
            {channel.handle}) will permanently delete your channel including all
            content, videos, comments, and playlists.
          </p>
          <p className="text-red-500 text-xs font-semibold">
            This action is permanent and cannot be undone.
          </p>
          {errorMsg && (
            <p className="text-red-600 font-medium text-sm mt-1">{errorMsg}</p>
          )}
        </Dialog.Description>
        <Dialog.Footer>
          <Dialog.Cancel className="rounded-2xl bg-btn-secondary hover:bg-btn-hover border-0">
            Cancel
          </Dialog.Cancel>
          <Dialog.Action
            onClick={handleDelete}
            disabled={deleteChannel.isPending}
            className="rounded-2xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteChannel.isPending ? "" : "Delete Channel"}
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

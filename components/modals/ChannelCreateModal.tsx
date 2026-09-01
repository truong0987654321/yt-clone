"use client";

import { useEffect, useState } from "react";
import { ButtonProfilePhoto } from "../Button";
import { DefaultUser } from "../icons/Icon";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Scrollbar } from "../ui/scrollbar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCreateChannel, useMyChannels } from "@/hooks/useChannel";
import { Channel } from "@/lib/types";
import { AxiosError } from "axios";
import { AlertCircle, X } from "lucide-react";

interface ApiErrorResponse {
  message?: string;
}

interface ChannelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (channel: Channel) => void;
}

export const ChannelCreateModal = ({
  open,
  onOpenChange,
  onSuccess,
}: ChannelModalProps) => {
  const { data: user } = useCurrentUser();
  const { data: channels = [] } = useMyChannels();

  const createChannelMutation = useCreateChannel();

  const [name, setName] = useState<string>("");
  const [handle, setHandle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (channels.length === 0 && user?.name) {
        // When user has NO channel yet -> Auto-fill Name & Handle with random suffix
        const rawName = user.name.trim();
        const cleanSlug = rawName.replace(/\s+/g, "");
        const randomSuffix = Math.random().toString(36).substring(2, 6);

        setName(rawName);
        setHandle(`@${cleanSlug}-${randomSuffix}`);
      } else {
        // When user ALREADY HAS channel(s) -> Keep empty for creating a new channel
        setName("");
        setHandle("@");
      }
    }
  }, [open, channels.length, user?.name]);

  const handleNameChange = (val: string) => {
    setName(val);
    // Suggest handle automatically when typing name
    if (
      !handle ||
      handle === "@" ||
      handle === `@${name.toLowerCase().replace(/\s+/g, "")}`
    ) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]/g, "");
      setHandle(slug ? `@${slug}` : "@");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Channel name is required.");
      return;
    }

    if (!handle.trim() || handle.trim() === "@") {
      setError("Channel handle is required.");
      return;
    }

    setError(null);

    let cleanHandle = handle.trim();
    if (!cleanHandle.startsWith("@")) {
      cleanHandle = "@" + cleanHandle;
    }

    // Check handle duplication locally among user's existing channels
    const isDuplicate = channels.some(
      (c) => c.handle.toLowerCase() === cleanHandle.toLowerCase(),
    );

    if (isDuplicate) {
      setError("This handle is already taken. Please choose another handle.");
      return;
    }

    createChannelMutation.mutate(
      {
        name: name.trim(),
        handle: cleanHandle,
        avatar_url: user?.avatar_url,
      },
      {
        onSuccess: (newChan) => {
          onSuccess?.(newChan);
          onOpenChange(false);
        },
        onError: (err: Error) => {
          const axiosErr = err as AxiosError<ApiErrorResponse>;
          const serverMsg = axiosErr?.response?.data?.message;
          if (
            serverMsg &&
            (serverMsg.toLowerCase().includes("already taken") ||
              serverMsg.toLowerCase().includes("handle"))
          ) {
            setError(
              "This handle is already taken. Please choose another handle.",
            );
          } else {
            setError(
              serverMsg || "Failed to create channel. Please try again.",
            );
          }
        },
      },
    );
  };

  const isSubmitting = createChannelMutation.isPending;

  return (
    <Dialog open={open} setOpen={onOpenChange}>
      <Dialog.Content className="min-h-50 w-184.5 max-w-full max-h-[calc(100vh-2rem)] max-[57.438rem]:absolute max-[57.438rem]:bottom-0 max-[57.438rem]:max-h-[calc(100vh-10rem)]">
        <Dialog.Header>
          <Dialog.Title className="text-[24px] leading-8 font-bold">
            How you&apos;ll appear
          </Dialog.Title>
        </Dialog.Header>
        <Scrollbar className="flex flex-col mx-1" size={2}>
          <Dialog.Description className="flex flex-col text-[14px] leading-5 font-normal p-[28px_140px_0]"></Dialog.Description>
          <div className="mt-9 inline-flex justify-center">
            <div className="border border-solid border-border w-30 h-30 m-[0_8px] rounded-[50%] overflow-hidden">
              <DefaultUser
                className="max-h-30 max-w-30 ml-auto mr-auto"
                size={120}
              />
            </div>
          </div>
          <div className="my-4 flex items-center justify-center">
            <ButtonProfilePhoto />
          </div>

          {error && (
            <div className="mx-35 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          <div className="px-35 py-0">
            <div className="text-foreground text-[14px] leading-5 text-left mb-7 flex flex-col gap-3">
              <Input
                id="name"
                name="Name"
                type="text"
                label="Name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder=" "
              />
              <Input
                id="handle"
                name="Handle"
                type="text"
                label="Handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder=" "
              />
            </div>
          </div>
        </Scrollbar>
        <Dialog.Footer>
          <Dialog.Cancel
            disabled={isSubmitting}
            className="rounded-2xl bg-btn-secondary hover:bg-btn-hover border-0"
          >
            Cancel
          </Dialog.Cancel>
          <Dialog.Action
            disabled={isSubmitting || !name.trim() || !handle.trim()}
            className="rounded-2xl bg-btn-secondary text-btn-action hover:bg-btn-action-hover"
            onClick={handleSubmit}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

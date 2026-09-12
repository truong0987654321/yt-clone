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
import { useI18n } from "@/i18n/context";

interface ApiErrorResponse {
  message?: string;
}

interface ChannelCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (channel: Channel) => void;
}

export const ChannelCreateModal = ({
  open,
  onOpenChange,
  onSuccess,
}: ChannelCreateModalProps) => {
  const { t } = useI18n();
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
        // Tự động gợi ý tên & handle (không chứa ký tự @ trong state vì @ đã cố định ở UI)
        const rawName = user.name.trim();
        const cleanSlug = rawName.replace(/\s+/g, "");
        const randomSuffix = Math.random().toString(36).substring(2, 6);

        setName(rawName);
        setHandle(`${cleanSlug}-${randomSuffix}`);
      } else {
        setName("");
        setHandle("");
      }
    }
  }, [open, channels.length, user?.name]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!handle || handle === name.toLowerCase().replace(/\s+/g, "")) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]/g, "");
      setHandle(slug);
    }
  };

  const handleHandleChange = (val: string) => {
    // Tự động lọc bỏ ký tự @ nếu người dùng gõ hoặc paste vào, giữ ký tự @ hiển thị cố định ở Input
    const cleanVal = val.replace(/^@+/, "");
    setHandle(cleanVal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(
        t("channelCreateModal.textRequired", {
          text: "Channel name",
        }),
      );
      return;
    }

    if (!handle.trim()) {
      setError(
        t("channelCreateModal.textRequired", {
          text: "Channel handle",
        }),
      );
      return;
    }

    setError(null);

    const fullHandle = `@${handle.trim().replace(/^@+/, "")}`;

    // Kiểm tra trùng lặp handle với các kênh của user hiện tại
    const isDuplicate = channels.some(
      (c) => c.handle.toLowerCase() === fullHandle.toLowerCase(),
    );

    if (isDuplicate) {
      setError(t("channelCreateModal.handleAlreadyTaken"));
      return;
    }

    createChannelMutation.mutate(
      {
        name: name.trim(),
        handle: fullHandle,
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
            setError(t("channelCreateModal.handleAlreadyTaken"));
          } else {
            setError(serverMsg || t("channelCreateModal.createFailed"));
          }
        },
      },
    );
  };

  const isSubmitting = createChannelMutation.isPending;

  return (
    <Dialog open={open} setOpen={onOpenChange}>
      <Dialog.Content className="min-h-50 w-184.5 max-w-full max-h-[calc(100vh-2rem)] max-mb:absolute max-mb:max-h-[calc(100vh-8rem)]">
        <Dialog.Header>
          <Dialog.Title className="text-[24px] leading-8 font-bold">
            {t("channelCreateModal.title")}
          </Dialog.Title>
        </Dialog.Header>
        <Scrollbar className="flex flex-col mx-1" size={2}>
          <Dialog.Description className="flex flex-col text-sm font-normal p-[28px_140px_0]"></Dialog.Description>
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
            <div className="mb-4 max-mb:mx-10 mx-35 p-3 rounded-xl bg-background-error border border-border-error text-foreground-error flex items-center justify-between text-xs font-medium">
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

          <div className="px-35 py-0 max-mb:px-10">
            <div className="text-foreground text-sm text-left mb-7 flex flex-col gap-3">
              <Input
                id="name"
                name="Name"
                type="text"
                label={t("channelCreateModal.name")}
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder=" "
              />
              <Input
                id="handle"
                name="Handle"
                type="text"
                label={t("channelCreateModal.handle")}
                prefixText="@"
                value={handle}
                onChange={(e) => handleHandleChange(e.target.value)}
                placeholder=" "
              />
            </div>
          </div>
        </Scrollbar>
        <Dialog.Footer className="flex-row justify-end">
          <Dialog.Cancel
            disabled={isSubmitting}
            className="rounded-2xl border-0 p-0 px-4 h-10"
          >
            {t("app.cancel")}
          </Dialog.Cancel>
          <Dialog.Action
            disabled={isSubmitting || !name.trim() || !handle.trim()}
            loading={isSubmitting}
            className="rounded-2xl bg-btn-secondary hover:bg-btn-action-hover text-btn-action focus:bg-btn-action-hover p-0 px-4 h-10"
            onClick={handleSubmit}
          >
            {isSubmitting ? "" : t("settings.createChannel")}
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

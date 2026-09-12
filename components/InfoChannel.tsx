import { useI18n } from "@/i18n/context";
import { Subscriber, Youtube } from "./icons/Icon";
import Link from "next/link";
import { APP_URL } from "@/lib/constants";
import { Info } from "lucide-react";
import { Channel } from "@/lib/types";

interface InfoChannelProps {
  channel: Channel | null;
}

export const InfoChannel = ({ channel }: InfoChannelProps) => {
  const { date, t } = useI18n();

  if (!channel) return null;
  return (
    <div className="flex flex-col gap-3">
      {/* Handle */}

      <div className="h-10 flex flex-row items-center">
        <div className="w-9 text-sm font-normal">
          <Youtube />
        </div>
        <div className="text-sm font-normal">
          <Link
            href={channel.handle}
            className="inline-block cursor-pointer decoration-0 text-foreground"
          >
            {APP_URL}/{channel.handle}
          </Link>
        </div>
      </div>

      {/* Created date */}
      <div className="h-10 flex flex-row items-center">
        <div className="w-9 text-sm font-normal">
          <Info />
        </div>
        <div className="text-sm font-normal">
          <span>
            {t("channelDescription.joined", {
              date: date(channel.created_at),
            })}
          </span>
        </div>
      </div>

      {/* Subscribers */}
      {channel.subscribers_count > 0 && (
        <div className="h-10 flex flex-row items-center">
          <div className="w-9 text-sm font-normal">
            <Subscriber />
          </div>
          <div className="text-sm font-normal">
            <span>
              {t("channelDescription.subscribers", {
                subscriber: channel.subscribers_count,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

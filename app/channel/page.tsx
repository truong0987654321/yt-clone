"use client";

import { Avatar, AvatarImg } from "@/components/ui/avatar/avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PageChannel() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-full max-w-125 rounded-2xl border border-border bg-background p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImg
                src={user?.avatar_url ?? "logo.svg"}
                alt={user?.name ?? "user"}
                size={56}
              />
            </Avatar>

            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground">
                {user?.name ?? "Chưa có tên"}
              </h3>

              <p className="truncate text-sm text-muted-foreground">
                {user?.email ?? "Chưa có email"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition-all border border-border hover:border-white hover:bg-gray-200 "
          >
            <ArrowLeft className="size-4 transition-transform" />
            Back to Home
          </button>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">User ID</span>

            <span className="max-w-75 truncate text-sm font-medium text-foreground">
              {user?.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

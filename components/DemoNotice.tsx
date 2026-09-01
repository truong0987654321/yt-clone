"use client";

import { HAS_SEEN_NOTICE_KEY } from "@/lib/constants";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function DemoNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem(HAS_SEEN_NOTICE_KEY);

    if (!hasSeenNotice) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(HAS_SEEN_NOTICE_KEY, "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <main className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
      <div className="w-full flex flex-col items-center max-w-2xl rounded-lg bg-white p-6 shadow-xl text-center">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="flex items-center justify-center">
              <Image
                src={"logo.svg"}
                alt="logo"
                width={45}
                height={45}
                className="w-11 h-auto"
              ></Image>
            </p>

            <p className="mt-3 text-muted-foreground">
              A YouTube clone application.
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              This is a non-commercial project created for learning purposes.
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="mt-5 rounded-md bg-black px-4 py-2 text-white cursor-pointer w-full hover:bg-black/85"
        >
          Cancel
        </button>
      </div>
    </main>
  );
}

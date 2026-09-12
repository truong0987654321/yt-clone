"use client";

import { useEffect } from "react";
import { useI18n, Cle } from "@/i18n/context";

interface PageTitleProps {
  /** Khóa bản dịch i18n (ví dụ: "settings.title") */
  titleKey?: Cle;
  /** Hoặc chuỗi tiêu đề trực tiếp (dùng cho dữ liệu động như Tên Kênh/Tên Video) */
  title?: string;
  /** Hậu tố tiêu đề (Mặc định: "YouTube") */
  suffix?: string;
}

export function PageTitle({
  titleKey,
  title,
  suffix = "YouTube",
}: PageTitleProps) {
  const { t, langue } = useI18n();

  useEffect(() => {
    // 1. Ưu tiên lấy theo i18n key, nếu không có thì lấy chuỗi trực tiếp
    const rawTitle = titleKey ? t(titleKey) : title;

    // 2. Cập nhật title của trình duyệt (ví dụ: "Cài đặt - YouTube")
    if (rawTitle) {
      document.title = `${rawTitle} - ${suffix}`;
    } else {
      document.title = suffix;
    }
  }, [titleKey, title, suffix, t, langue]);

  return null;
}

"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component bọc dùng chung cho toàn bộ dự án.
 * Giúp bọc các giao diện động phụ thuộc vào trạng thái Auth/Browser
 * mà KHÔNG CẦN phải viết useState(false) / useEffect(setMounted) lặp đi lặp lại ở từng component con.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

"use client";

import { useState } from "react";
import { createQueryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/theme/context";
import { I18nProvider } from "@/i18n/context";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <I18nProvider>{children}</I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

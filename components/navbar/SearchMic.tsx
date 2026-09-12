import { Mic } from "lucide-react";
import { ButtonIcon } from "../ui/button";
import { useI18n } from "@/i18n/context";

export const SearchMic = () => {
  const { t } = useI18n();
  return (
    <div className="ml-3 max-mb:ml-0 max-mb-sm:hidden group-data-active:flex">
      <ButtonIcon
        className="[&_span:first-child]:group-hover/button:before:opacity-100 max-mb:[&_span:first-child]:bg-background max-mb:[&_span:first-child]:group-hover/button:before:bg-btn max-mb:[&_span:first-child]:group-hover/button:before:opacity-100"
        sizeIcon="size-6"
        position="bottom"
        content={t("app.searchInMic")}
      >
        <Mic />
      </ButtonIcon>
    </div>
  );
};

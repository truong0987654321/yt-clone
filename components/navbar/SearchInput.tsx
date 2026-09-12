import { Keyboard, Search } from "lucide-react";
import { ButtonIcon } from "../ui/button";
import { useI18n } from "@/i18n/context";

interface SearchInputProps {
  active: boolean;
  setActive?: () => void;
}
export const SearchInput = ({ active, setActive }: SearchInputProps) => {
  const { t } = useI18n();
  return (
    <>
      <div className="flex w-full max-mb:hidden max-mb:m-0 group-data-active:flex">
        <div className="relative flex items-center flex-1 cursor-text border border-border border-r-0 border-solid bg-background shadow-[inset_0_1px_2px_var(--color-shadow-zinc-200)] rounded-l-[40px] ml-8 p-[0_4px_0_16px] max-mb:ml-0">
          <form className="flex flex-1 h-6 items-center">
            <input
              type="text"
              className="p-[1px_0] m-0 w-full h-full bg-transparent border-none text-inherit outline-none text-[15px] leading-[2.2rem] font-normal"
              placeholder={t("app.search")}
              name="seatch_query"
            />
            <div className="px-0.5">
              <div className="cursor-pointer p-1 m-0 outline-0 bg-none border-none block">
                <Keyboard />
              </div>
            </div>
          </form>
        </div>
        <button className="border border-border border-solid bg-btn hover:bg-btn-hover w-16 rounded-r-[40px] cursor-pointer p-0 m-0 text-inherit flex items-center justify-center">
          <Search />
        </button>
      </div>
      {!active && (
        <div className="hidden max-mb:block">
          <ButtonIcon
            sizeIcon="size-6"
            className="[&_span:first-child]:bg-background [&_span:first-child]:group-hover/button:before:bg-btn [&_span:first-child]:group-hover/button:before:opacity-100 *:text-foreground"
            position="bottom"
            content={t("app.search")}
            onClick={setActive}
          >
            <Search />
          </ButtonIcon>
        </div>
      )}
    </>
  );
};

import { Keyboard, Mic, Search } from "lucide-react";
import { ButtonIcon } from "../ui/element/button";

interface SearchInputProps {
  setActive?: () => void;
}
export const SearchInput = ({ setActive }: SearchInputProps) => {
  return (
    <div className="flex-1 flex relative m-[0_0_0_40px] p-[0_4px] h-10 max-[656px]:flex-1 max-[656px]:basis-[0.000000001px] max-[656px]:justify-end max-[656px]:m-0 max-[656px]:gap-1 group-data-active:m-0">
      <div className="flex w-full max-[656px]:hidden max-[656px]:m-0 group-data-active:flex">
        <div className="relative flex items-center flex-1 cursor-text border border-border border-r-0 border-solid bg-background shadow-[inset_0_1px_2px_var(--color-shadow-zinc-200)] rounded-l-[40px] ml-8 p-[0_4px_0_16px] ">
          <form className="flex flex-1 h-6 items-center">
            <input
              type="text"
              className="p-[1px_0] m-0 w-full h-full bg-transparent border-none text-inherit outline-none text-[15px] leading-[2.2rem] font-normal"
              placeholder="Search"
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
      <div className="hidden max-[656px]:block ">
        <ButtonIcon
          sizeIcon="size-6"
          className="[&_span:first-child]:bg-background [&_span:first-child]:group-hover/button:before:bg-btn [&_span:first-child]:group-hover/button:before:opacity-100 *:text-foreground"
          position="bottom"
          content="Search"
          onClick={setActive}
        >
          <Search />
        </ButtonIcon>
      </div>
      <div className="ml-3 max-[656px]:ml-0 max-[428px]:hidden">
        <ButtonIcon
          className="[&_span:first-child]:group-hover/button:before:opacity-100 max-[656px]:[&_span:first-child]:bg-background max-[656px]:[&_span:first-child]:group-hover/button:before:bg-btn max-[656px]:[&_span:first-child]:group-hover/button:before:opacity-100"
          sizeIcon="size-6"
          position="bottom"
          content="Search with your voice"
        >
          <Mic />
        </ButtonIcon>
      </div>
    </div>
  );
};

"use client";

import {
  ArrowLeft,
  Check,
  ChevronRight,
  EllipsisVertical,
  Keyboard,
  Languages,
  LogOut,
  Moon,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { ButtonIcon } from "../ui/element/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu/dropdown-menu";
import { useState } from "react";
import { User } from "@/lib/types";
import Link from "next/link";
import { ButtonLogout } from "../Button";
import { PAGES } from "@/lib/constants";
import { Avatar, AvatarImg } from "../ui/avatar/avatar";
import { useAccountActions } from "@/hooks/useAccountActions";
import { StoredAccount, useAccountStore } from "@/store/useAccountStore";

enum SettingMenu {
  START,
  THEME,
  LANGUAGE,
  SWITCH_ACCOUNT,
}

const themeOptions = [
  { label: "Device theme", value: "system" },
  { label: "Dark theme", value: "dark" },
  { label: "Light theme", value: "light" },
];

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Tiếng Việt", value: "vi" },
];

type SettingMenuConfig = {
  label: string;
  icon?: React.ReactNode;
  selected?: string;
  group?: string;
  component: (label: string) => React.ReactNode;
};

type SettingsMenuProps = {
  user?: User | null;
};

type StartSettingsMenuProps = {
  onNavigate: (screen: SettingMenu) => void;
  labels: Record<SettingMenu, SettingMenuConfig>;
  user?: User | null;
};

export const SettingsMenu = ({ user }: SettingsMenuProps) => {
  const [screen, setScreen] = useState(SettingMenu.START);
  const [open, setOpen] = useState(false); // ← thêm controlled state

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) setScreen(SettingMenu.START);
  };

  const goBack = () => {
    setScreen(SettingMenu.START);
  };

  const submitClose = () => {
    setScreen(SettingMenu.START);
    handleOpenChange(false);
  };

  const [selectedTheme, setSelectedTheme] = useState(themeOptions[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  // const [selectedSwitchAccount, setSelectedSwitchAccount] = useState()

  const screenConfig: Record<SettingMenu, SettingMenuConfig> = {
    [SettingMenu.START]: {
      label: "",
      component: () => (
        <StartSettingsMenu
          onNavigate={setScreen}
          labels={screenConfig}
          user={user}
        />
      ),
    },
    [SettingMenu.THEME]: {
      label: "Appearance",
      icon: <Moon className="size-6" />,
      selected: selectedTheme.label,
      component: (label) => (
        <ThemeMenu
          goBack={goBack}
          label={label}
          options={themeOptions}
          note="Setting applies to this browser only"
          submitClose={submitClose}
          selected={selectedTheme}
          onSelect={setSelectedTheme}
        />
      ),
    },
    [SettingMenu.LANGUAGE]: {
      label: "Display language",
      icon: <Languages className="size-6" />,
      selected: selectedLanguage.label,
      component: (label) => (
        <LanguageMenu
          goBack={goBack}
          label={label}
          note="Buttons and display text on this browser"
          submitClose={submitClose}
          options={languageOptions}
          selected={selectedLanguage}
          onSelect={setSelectedLanguage}
        />
      ),
    },
    [SettingMenu.SWITCH_ACCOUNT]: {
      label: "Switch account",
      icon: <Users className="size-6" />,
      component: () => (
        <SwitchAccountMenu goBack={goBack} label="Accounts" user={user} />
      ),
    },
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="max-[656px]:mr-0 mr-2">
        {user ? (
          <Avatar>
            <AvatarImg
              src={user.avatar_url ?? "/logo.svg"}
              alt={user.name ?? "user"}
              size={32}
            />
          </Avatar>
        ) : (
          <ButtonIcon
            className="[&_span:first-child]:group-hover/button:before:opacity-100 max-[656px]:[&_span:first-child]:bg-background max-[656px]:[&_span:first-child]:group-hover/button:before:bg-btn max-[656px]:[&_span:first-child]:group-hover/button:before:opacity-100"
            content="Settings"
            position="bottom"
          >
            <EllipsisVertical className="size-6" />
          </ButtonIcon>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border-none min-w-80 max-w-80"
        hasOverlay={true}
        placement="bottom-left"
      >
        {screenConfig[screen].component(screenConfig[screen].label)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StartSettingsMenu = ({
  onNavigate,
  labels,
  user,
}: StartSettingsMenuProps) => {
  return (
    <>
      {user && (
        <>
          <DropdownMenuGroup>
            <UserSettingMenu user={user} />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <SettingMenuItem
              icon={labels[SettingMenu.SWITCH_ACCOUNT].icon}
              label={labels[SettingMenu.SWITCH_ACCOUNT].label}
              onClick={() => onNavigate(SettingMenu.SWITCH_ACCOUNT)}
            />
            <div className="border-b border-border mb-2">
              <ButtonLogout>
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <span className="mr-2">
                      <LogOut className="size-6" />
                    </span>
                    <span>Sign out</span>
                  </div>
                </DropdownMenuItem>
              </ButtonLogout>
            </div>
          </DropdownMenuGroup>
        </>
      )}
      <DropdownMenuGroup>
        <SettingMenuItem
          icon={labels[SettingMenu.THEME].icon}
          label={labels[SettingMenu.THEME].label}
          selected={labels[SettingMenu.THEME].selected}
          onClick={() => onNavigate(SettingMenu.THEME)}
        />
        <SettingMenuItem
          icon={labels[SettingMenu.LANGUAGE].icon}
          label={labels[SettingMenu.LANGUAGE].label}
          selected={labels[SettingMenu.LANGUAGE].selected}
          onClick={() => onNavigate(SettingMenu.LANGUAGE)}
        />
      </DropdownMenuGroup>

      <DropdownMenuGroup>
        <DropdownMenuItem>
          <div className="flex items-center gap-2">
            <span className="mr-2">
              <Keyboard className="size-6" />
            </span>
            <span>Keyboard shortcuts</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  );
};

const UserSettingMenu = ({ user }: SettingsMenuProps) => {
  if (!user) return null;

  return (
    <div className="border-b border-border mb-2">
      <div className="relative box-border py-4 flex flex-row">
        <Avatar className="mr-4">
          <AvatarImg
            src={user?.avatar_url ?? "/logo.svg"}
            alt={user?.name ?? "user"}
            size={40}
          />
        </Avatar>
        <div className="flex flex-col justify-center">
          <p className="text-[1rem] leading-5.5 font-normal truncate">
            {user?.name}
          </p>
          <p className="text-[1rem] leading-5.5 font-normal truncate">
            @{user?.name}
          </p>
          <div className="mt-2 text-[14px] leading-5 font-normal truncate">
            <Link href={PAGES.DASHBOARD} className="text-btn-action">
              View your channel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

type SettingMenuItemProps = {
  icon?: React.ReactNode;
  label: string;
  selected?: string;
  onClick: () => void;
};

const SettingMenuItem = ({
  icon,
  label,
  selected,
  onClick,
}: SettingMenuItemProps) => (
  <div
    className="flex justify-between px-2 py-1.5 cursor-pointer hover:bg-btn-active"
    onClick={onClick}
  >
    <div className="flex items-center gap-2">
      {icon && <span className="mr-2">{icon}</span>}
      <span>
        {label}{" "}
        {selected && (
          <span className="text-muted-foreground text-sm">: {selected}</span>
        )}
      </span>
    </div>
    <ChevronRight className="size-6 ml-2" />
  </div>
);
interface Option {
  label: string;
  value: string;
}

interface IScreenProps {
  label: string;
  note?: string;
  goBack: () => void;
  children: React.ReactNode;
}

interface SelectableOptionProps {
  option: Option;
  selected: Option;
  onSelect: (option: Option) => void;
}

interface IOptionScreenProps {
  label: string;
  note?: string;
  goBack: () => void;
  submitClose: () => void;
  options: Option[];
  selected: Option;
  onSelect: (option: Option) => void;
}

const ScreenMenu = ({ goBack, label, note, children }: IScreenProps) => {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-border pb-0.5">
        <ButtonIcon
          className="[&_span:first-child]:bg-background [&_span:first-child]:group-hover/button:before:bg-btn-hover [&_span:first-child]:group-hover/button:before:opacity-100"
          onClick={goBack}
          sizeIcon="size-6"
        >
          <ArrowLeft className="size-6" />
        </ButtonIcon>
        <div>{label}</div>
      </div>
      {note && (
        <div className="text-sm text-foreground opacity-75 p-4">{note}</div>
      )}
      {children}
    </>
  );
};

const SelectableOption = ({
  option,
  selected,
  onSelect,
}: SelectableOptionProps) => (
  <DropdownMenuItem onClick={() => onSelect(option)}>
    {selected.value === option.value ? (
      <Check className="size-6" />
    ) : (
      <span className="size-6" />
    )}
    <span>{option.label}</span>
  </DropdownMenuItem>
);

const ThemeMenu = ({
  goBack,
  label,
  note,
  submitClose,
  options,
  selected,
  onSelect,
}: IOptionScreenProps) => {
  const handleSelect = (option: Option) => {
    onSelect(option);
    submitClose();
  };

  return (
    <ScreenMenu goBack={goBack} label={label} note={note}>
      {options.map((option) => (
        <SelectableOption
          key={option.value}
          option={option}
          selected={selected}
          onSelect={handleSelect}
        />
      ))}
    </ScreenMenu>
  );
};

const LanguageMenu = ({
  goBack,
  label,
  note,
  submitClose,
  options,
  selected,
  onSelect,
}: IOptionScreenProps) => {
  const handleSelect = (option: Option) => {
    onSelect(option);
    submitClose();
  };

  return (
    <ScreenMenu goBack={goBack} label={label} note={note}>
      {options.map((option) => (
        <SelectableOption
          key={option.value}
          option={option}
          selected={selected}
          onSelect={handleSelect}
        />
      ))}
    </ScreenMenu>
  );
};

interface SwitchAccountMenuProps {
  label: string;
  goBack: () => void;
  user?: User | null;
}

const SwitchAccountMenu = ({ goBack, label, user }: SwitchAccountMenuProps) => {
  const { accounts, activeAccountId } = useAccountStore();
  const { switchAccount, addAccount, signOutAll, removeAccount } =
    useAccountActions();

  if (!user) return null;

  // Tách tài khoản đang chọn ra khỏi danh sách các tài khoản khác
  const otherAccounts = accounts.filter(
    (acc) => acc.user.id !== user.id && acc.user.id !== activeAccountId,
  );

  const handleSwitch = (acc: StoredAccount) => {
    switchAccount.mutate(acc);
  };

  const handleAdd = () => {
    addAccount.mutate();
  };

  const handleSignOutAll = () => {
    signOutAll.mutate();
  };

  const handleRemove = (e: React.MouseEvent, targetUserId: string) => {
    e.stopPropagation();
    removeAccount(targetUserId);
  };

  return (
    <ScreenMenu goBack={goBack} label={label}>
      <div className="border-b border-border mb-2">
        {/* Phần 1: Tài khoản đang được chọn (Active User Header) */}
        <div className="border-b border-border mx-4 py-3 flex flex-col">
          <span className="text-[12px] leading-4.5 font-normal">
            {user?.name}
          </span>
          <span className="text-[12px] leading-4.5 font-normal text-foreground-tertiary">
            {user?.email}
          </span>
        </div>
        <DropdownMenuItem>
          <div className="flex items-center gap-3">
            <Avatar className="flex items-center">
              <AvatarImg
                src={user.avatar_url ?? "/logo.svg"}
                alt={user.name ?? "user"}
                size={40}
                className="size-12"
              />
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-foreground-tertiary truncate">
                {user.email}
              </p>
            </div>
          </div>
          <Check className="size-5 text-btn-action shrink-0 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem className="mb-2 px-4">
          View your channel
        </DropdownMenuItem>
      </div>

      {otherAccounts.length > 0 && (
        <div className="max-h-60 overflow-y-auto border-b border-border py-1 mb-2">
          <div className="px-3 relative mb-2">
            <span className="text-sm font-medium">Other accounts</span>
          </div>

          {otherAccounts.map((acc) => (
            <DropdownMenuItem
              key={acc.user.id || acc.user.email}
              onClick={() => handleSwitch(acc)}
              className="mb-2 flex cursor-pointer items-center justify-between px-3 hover:bg-btn-hover"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="flex items-center">
                  <AvatarImg
                    src={acc.user.avatar_url ?? "/logo.svg"}
                    alt={acc.user.name ?? "user"}
                    size={36}
                    className="size-12"
                  />
                </Avatar>

                <div className="flex min-w-0 flex-col truncate">
                  <p className="truncate text-sm font-medium">
                    {acc.user.name}
                  </p>

                  <p className="truncate text-xs text-foreground-tertiary">
                    {acc.user.email}
                  </p>
                </div>
              </div>

              <div className="ml-2 flex shrink-0 items-center gap-1">
                <button
                  onClick={(e) => handleRemove(e, acc.user.id)}
                  title="Remove account"
                  className="rounded-full p-1 text-foreground-tertiary transition-colors hover:bg-black/10 hover:text-red-500 dark:hover:bg-white/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      )}
      <DropdownMenuItem onClick={handleAdd}>
        <div className="flex items-center gap-2">
          <span className="mr-2">
            <UserPlus className="size-6" />
          </span>

          <span>Add Account</span>
        </div>
      </DropdownMenuItem>
      <ButtonLogout>
        <DropdownMenuItem onClick={handleSignOutAll}>
          <div className="flex items-center gap-2">
            <span className="mr-2">
              <LogOut className="size-6" />
            </span>
            <span>Sign out of all accounts</span>
          </div>
        </DropdownMenuItem>
      </ButtonLogout>
    </ScreenMenu>
  );
};

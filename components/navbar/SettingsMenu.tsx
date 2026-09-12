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
  Settings,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { ButtonIcon } from "../ui/button";
import { DropdownMenu } from "../ui/dropdown-menu";
import { useState } from "react";
import { Channel, User } from "@/lib/types";
import Link from "next/link";
import { ButtonLogout } from "../Button";
import { PAGES } from "@/lib/constants";
import { Avatar } from "../ui/avatar";
import { useAccountActions } from "@/hooks/useAccountActions";
import { StoredAccount, useAccountStore } from "@/store/useAccountStore";
import { useActiveChannel, useMyChannels } from "@/hooks/useChannel";
import { ChannelCreateModal } from "../modals/ChannelCreateModal";
import { Scrollbar } from "../ui/scrollbar";
import { useI18n } from "@/i18n/context";
import { useRouter } from "next/navigation";
import { useTheme } from "@/theme/context";
import { useChannelStore } from "@/store/useChannelStore";

enum SettingMenu {
  START,
  THEME,
  LANGUAGE,
  SWITCH_ACCOUNT,
}

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
  channel?: Channel | null;
  onOpenCreateChannelModal?: () => void;
  onCloseMenu?: () => void;
};

type StartSettingsMenuProps = {
  onNavigate: (screen: SettingMenu) => void;
  labels: Record<SettingMenu, SettingMenuConfig>;
  user?: User | null;
  channel?: Channel | null;
  onOpenCreateChannelModal?: () => void;
  onCloseMenu?: () => void;
};

export const SettingsMenu = ({ user, channel }: SettingsMenuProps) => {
  const { t, langue, setLangue } = useI18n();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { label: t("settings.theme.system"), value: "system" },
    { label: t("settings.theme.dark"), value: "dark" },
    { label: t("settings.theme.light"), value: "light" },
  ];

  const [screen, setScreen] = useState(SettingMenu.START);
  const [open, setOpen] = useState(false); // ← thêm controlled state
  const [showChannelCreateModal, setShowChannelCreateModal] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) setScreen(SettingMenu.START);
  };

  const handleOpenCreateChannelModal = () => {
    handleOpenChange(false); // Ẩn SettingsMenu dropdown khi mở modal tạo kênh
    setShowChannelCreateModal(true);
  };

  const goBack = () => {
    setScreen(SettingMenu.START);
  };

  const submitClose = () => {
    setScreen(SettingMenu.START);
    handleOpenChange(false);
  };

  const currentThemeOption =
    themeOptions.find((opt) => opt.value === theme) || themeOptions[0];

  const handleThemeSelect = (option: Option) => {
    setTheme(option.value);
  };
  const currentLanguageOption =
    languageOptions.find((opt) => opt.value === langue) || languageOptions[0];

  const handleLanguageSelect = (option: Option) => {
    setLangue(option.value);
  };

  const screenConfig: Record<SettingMenu, SettingMenuConfig> = {
    [SettingMenu.START]: {
      label: "",
      component: () => (
        <StartSettingsMenu
          onNavigate={setScreen}
          labels={screenConfig}
          user={user}
          channel={channel}
          onOpenCreateChannelModal={handleOpenCreateChannelModal}
          onCloseMenu={() => handleOpenChange(false)}
        />
      ),
    },
    [SettingMenu.THEME]: {
      label: t("settings.appearance"),
      icon: <Moon className="size-6" />,
      selected: currentThemeOption.label,
      component: (label) => (
        <ThemeMenu
          goBack={goBack}
          label={label}
          options={themeOptions}
          note={t("settings.theme.note")}
          submitClose={submitClose}
          selected={currentThemeOption}
          onSelect={handleThemeSelect}
        />
      ),
    },
    [SettingMenu.LANGUAGE]: {
      label: t("settings.language.title"),
      icon: <Languages className="size-6" />,
      selected: currentLanguageOption.label,
      component: (label) => (
        <LanguageMenu
          goBack={goBack}
          label={label}
          note={t("settings.language.note")}
          submitClose={submitClose}
          options={languageOptions}
          selected={currentLanguageOption}
          onSelect={handleLanguageSelect}
        />
      ),
    },
    [SettingMenu.SWITCH_ACCOUNT]: {
      label: t("settings.switchAccount.title"),
      icon: <Users className="size-6" />,
      component: () => (
        <SwitchAccountMenu
          goBack={goBack}
          label={t("settings.switchAccount.accounts")}
          user={user}
        />
      ),
    },
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenu.Trigger className="max-mb:mr-0 mr-2">
          {user ? (
            <Avatar>
              <Avatar.Img
                src={channel?.avatar_url ?? user.avatar_url ?? "/logo.svg"}
                alt={channel?.name ?? user.name ?? "user"}
                size={32}
              />
            </Avatar>
          ) : (
            <ButtonIcon
              className="[&_span:first-child]:group-hover/button:before:opacity-100 max-mb:[&_span:first-child]:bg-background max-mb:[&_span:first-child]:group-hover/button:before:bg-btn max-mb:[&_span:first-child]:group-hover/button:before:opacity-100"
              content={t("settings.title")}
              position="bottom"
            >
              <EllipsisVertical className="size-6" />
            </ButtonIcon>
          )}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className="border-none min-w-80 max-w-80"
          hasOverlay={true}
          placement="bottom-left"
        >
          {screenConfig[screen].component(screenConfig[screen].label)}
        </DropdownMenu.Content>
      </DropdownMenu>
      <ChannelCreateModal
        open={showChannelCreateModal}
        onOpenChange={setShowChannelCreateModal}
      />
    </>
  );
};

const StartSettingsMenu = ({
  onNavigate,
  labels,
  user,
  channel,
  onOpenCreateChannelModal,
  onCloseMenu,
}: StartSettingsMenuProps) => {
  const { t } = useI18n();
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push(PAGES.ACCOUNT);
  };

  return (
    <>
      {user && (
        <UserSettingMenu
          user={user}
          channel={channel}
          onOpenCreateChannelModal={onOpenCreateChannelModal}
          onCloseMenu={onCloseMenu}
        />
      )}
      <Scrollbar className="min-h-0 flex-1 pr-2" size={1}>
        {user && (
          <DropdownMenu.Group className="shrink-0">
            <SettingMenuItem
              icon={labels[SettingMenu.SWITCH_ACCOUNT].icon}
              label={labels[SettingMenu.SWITCH_ACCOUNT].label}
              onClick={() => onNavigate(SettingMenu.SWITCH_ACCOUNT)}
            />
            <div className="border-b border-border mb-2">
              <ButtonLogout>
                <DropdownMenu.Item>
                  <div className="flex items-center gap-2">
                    <span className="mr-2">
                      <LogOut className="size-6" />
                    </span>
                    <span>{t("settings.signOut")}</span>
                  </div>
                </DropdownMenu.Item>
              </ButtonLogout>
            </div>
          </DropdownMenu.Group>
        )}

        <DropdownMenu.Group>
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
        </DropdownMenu.Group>

        <div className="mb-2">
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              <div className="flex items-center gap-2">
                <span className="mr-2">
                  <Keyboard className="size-6" />
                </span>
                <span>{t("settings.keyboardShortcuts")}</span>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </div>
        <div className="border-t border-border mb-2">
          <DropdownMenu.Group className="mt-2">
            <DropdownMenu.Item onClick={() => handleSettingsClick()}>
              <div className="flex items-center gap-2">
                <span className="mr-2">
                  <Settings className="size-6" />
                </span>
                <span>{t("settings.title")}</span>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </div>
      </Scrollbar>
    </>
  );
};

const UserSettingMenu = ({
  user,
  channel,
  onOpenCreateChannelModal,
  onCloseMenu,
}: SettingsMenuProps) => {
  const { t } = useI18n();
  const [openCreateChannel, setOpenCreateChannel] = useState(false);

  const { data: channels = [] } = useMyChannels();
  const hasChannel = channels.length > 0;

  if (!user) return null;

  const handleClickChannelAction = (e: React.MouseEvent) => {
    if (hasChannel) {
      onCloseMenu?.();
    } else {
      e.preventDefault();
      onOpenCreateChannelModal?.();
    }
  };

  return (
    <div className="border-b border-border mb-2">
      <div className="relative box-border py-4 flex flex-row">
        <Avatar className="mr-4">
          <Avatar.Img
            src={channel?.avatar_url || user?.avatar_url || "/logo.svg"}
            alt={channel?.name || user?.name || "user"}
            size={40}
          />
        </Avatar>
        <div className="flex flex-col justify-center">
          <p className="text-[1rem] leading-5.5 font-normal truncate">
            {channel?.name || user?.name}
          </p>
          <p className="text-[1rem] leading-5.5 font-normal truncate">
            {channel ? channel.handle : user?.email}
          </p>
          <div className="mt-2 text-sm font-normal truncate">
            {hasChannel && channel ? (
              <Link
                href={
                  channel.handle.startsWith("/")
                    ? channel.handle
                    : `/${channel.handle}`
                }
                className="text-btn-action"
              >
                {t("settings.viewChannel")}
              </Link>
            ) : (
              <div
                className="text-btn-action cursor-pointer"
                onClick={handleClickChannelAction}
              >
                {t("settings.createChannel")}
              </div>
            )}
          </div>
        </div>
      </div>
      <ChannelCreateModal
        open={openCreateChannel}
        onOpenChange={setOpenCreateChannel}
      />
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
          className="[&_span:first-child]:bg-background-secondary [&_span:first-child]:group-hover/button:before:bg-btn-hover [&_span:first-child]:group-hover/button:before:opacity-100"
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
  <DropdownMenu.Item onClick={() => onSelect(option)}>
    {selected.value === option.value ? (
      <Check className="size-6" />
    ) : (
      <span className="size-6" />
    )}
    <span>{option.label}</span>
  </DropdownMenu.Item>
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
  const { setLangue } = useI18n();

  const handleSelect = (option: Option) => {
    setLangue(option.value);
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
  const { t } = useI18n();

  const { accounts, activeAccountId } = useAccountStore();
  const { switchAccount, addAccount, signOutAll, removeAccount } =
    useAccountActions();

  const { data: channels = [] } = useMyChannels();
  const activeChannel = useActiveChannel();
  const setActiveChannel = useChannelStore((s) => s.setActiveChannel);
  const activeChannelId =
    useChannelStore((s) => s.activeChannelId) || activeChannel?.id;

  if (!user) return null;

  // Tách tài khoản đang chọn ra khỏi danh sách các tài khoản khác
  const otherAccounts = accounts.filter(
    (acc) => acc.user.id !== user.id && acc.user.id !== activeAccountId,
  );

  const handleSwitch = (acc: StoredAccount, targetChan?: Channel) => {
    if (targetChan) {
      setActiveChannel(targetChan);
    } else if (acc.channels && acc.channels.length > 0) {
      setActiveChannel(acc.channels[0]);
    }
    switchAccount.mutate({ acc, targetChannel: targetChan });
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
      <Scrollbar className="pr-1">
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

          {/* Nếu tài khoản có kênh -> Hiển thị TẤT CẢ các kênh của tài khoản này */}
          {channels.length > 0 ? (
            channels.map((chan) => {
              const isActive = activeChannelId === chan.id;
              return (
                <DropdownMenu.Item
                  key={chan.id}
                  onClick={() => {
                    setActiveChannel(chan);
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="flex items-center">
                      <Avatar.Img
                        src={chan.avatar_url || user.avatar_url || "/logo.svg"}
                        alt={chan.name}
                        size={40}
                        className="size-12"
                      />
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {chan.name}
                      </p>
                      {chan.subscribers_count > 0 ? (
                        <p className="truncate text-xs text-foreground-tertiary">
                          {t("channelDescription.subscribers", {
                            subscriber: chan.subscribers_count,
                          })}
                        </p>
                      ) : (
                        <p className="truncate text-xs text-foreground-tertiary">
                          {t("channel.noSubscribers")}
                        </p>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <Check className="size-5 text-btn-action shrink-0 ml-auto" />
                  )}
                </DropdownMenu.Item>
              );
            })
          ) : (
            /* Nếu tài khoản chưa tạo kênh nào -> Hiển thị tài khoản */
            <DropdownMenu.Item>
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="flex items-center">
                  <Avatar.Img
                    src={user.avatar_url ?? "/logo.svg"}
                    alt={user.name ?? "user"}
                    size={40}
                    className="size-12"
                  />
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-foreground-tertiary truncate">
                    {t("channel.noChannel")}
                  </p>
                </div>
              </div>
              <Check className="size-5 text-btn-action shrink-0 ml-auto" />
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Item className="mb-2 px-4">
            <Link href={PAGES.CHANNEL} className="w-full h-full">
              {t("settings.switchAccount.viewAllChannels")}
            </Link>
          </DropdownMenu.Item>
        </div>

        {otherAccounts.length > 0 && (
          <div className="border-b border-border py-1 mb-2">
            <div className="px-3 relative mb-2">
              <span className="text-sm font-medium">
                {t("settings.switchAccount.otherAccounts")}
              </span>
            </div>

            {otherAccounts.map((acc) => {
              const hasAccChannels = acc.channels && acc.channels.length > 0;

              return (
                <div key={acc.user.id || acc.user.email} className="mb-2">
                  <span className="text-xs font-normal px-3 text-foreground-tertiary">
                    {acc.user.email}
                  </span>

                  {hasAccChannels ? (
                    acc.channels!.map((chan) => (
                      <DropdownMenu.Item
                        key={chan.id}
                        onClick={() => handleSwitch(acc, chan)}
                        className="mt-1 flex cursor-pointer items-center justify-between px-3 hover:bg-btn-hover"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="flex items-center">
                            <Avatar.Img
                              src={
                                chan.avatar_url ||
                                acc.user.avatar_url ||
                                "/logo.svg"
                              }
                              alt={chan.name}
                              size={36}
                              className="size-12"
                            />
                          </Avatar>

                          <div className="flex min-w-0 flex-col truncate">
                            <p className="truncate text-sm font-medium">
                              {chan.name}
                            </p>
                            {chan.subscribers_count > 0 ? (
                              <p className="truncate text-xs text-foreground-tertiary">
                                {t("channelDescription.subscribers", {
                                  subscriber: chan.subscribers_count,
                                })}
                              </p>
                            ) : (
                              <p className="truncate text-xs text-foreground-tertiary">
                                {t("channel.noSubscribers")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="ml-2 flex shrink-0 items-center gap-1">
                          <button
                            onClick={(e) => handleRemove(e, acc.user.id)}
                            title="Remove account"
                            className="rounded-full p-1 text-foreground-tertiary transition-colors hover:text-foreground-error"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </DropdownMenu.Item>
                    ))
                  ) : (
                    <DropdownMenu.Item
                      onClick={() => handleSwitch(acc)}
                      className="mt-1 flex cursor-pointer items-center justify-between px-3 hover:bg-btn-hover"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="flex items-center">
                          <Avatar.Img
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
                            {t("channel.noChannel")}
                          </p>
                        </div>
                      </div>

                      <div className="ml-2 flex shrink-0 items-center gap-1">
                        <button
                          onClick={(e) => handleRemove(e, acc.user.id)}
                          title="Remove account"
                          className="rounded-full p-1 text-foreground-tertiary transition-colors hover:text-foreground-error"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </DropdownMenu.Item>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <DropdownMenu.Item onClick={handleAdd}>
          <div className="flex items-center gap-2">
            <span className="mr-2">
              <UserPlus className="size-6" />
            </span>

            <span>{t("settings.switchAccount.addAccount")}</span>
          </div>
        </DropdownMenu.Item>
        <ButtonLogout>
          <DropdownMenu.Item onClick={handleSignOutAll}>
            <div className="flex items-center gap-2">
              <span className="mr-2">
                <LogOut className="size-6" />
              </span>
              <span>{t("settings.switchAccount.signOutAll")}</span>
            </div>
          </DropdownMenu.Item>
        </ButtonLogout>
      </Scrollbar>
    </ScreenMenu>
  );
};

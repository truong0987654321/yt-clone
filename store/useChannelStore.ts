import { getProjectKey } from "@/lib/constants";
import { Channel } from "@/lib/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StoredAccount, useAccountStore } from "./useAccountStore";

export const CHANNELS_STORAGE_KEY = getProjectKey("channels_storage");

interface ChannelState {
  channels: Channel[];
  activeChannelId: string | null;
  activeChannel: Channel | null;
  setChannels: (channels: Channel[]) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (id: string, updated: Partial<Channel>) => void;
  deleteChannel: (id: string) => void;
  setActiveChannel: (channelOrId: Channel | string | null) => void;
  setActiveChannelId: (id: string | null) => void;
  getActiveChannel: () => Channel | null;
  clearAllChannels: () => void;
}

/**
 * Tối ưu hóa dữ liệu kênh trước khi lưu xuống localStorage
 */
function sanitizeChannel(c: Channel): Channel {
  return {
    id: c.id,
    user_id: c.user_id,
    name: c.name,
    handle: c.handle,
    avatar_url: c.avatar_url,
    banner_url: c.banner_url || "",
    description: c.description || "",
    subscribers_count: c.subscribers_count || 0,
    created_at: c.created_at,
    updated_at: c.updated_at,
  };
}

function getInitialChannelState(): {
  channels: Channel[];
  activeChannelId: string | null;
  activeChannel: Channel | null;
} {
  if (typeof window === "undefined") {
    return { channels: [], activeChannelId: null, activeChannel: null };
  }
  try {
    const rawChan = localStorage.getItem(CHANNELS_STORAGE_KEY);
    let activeChan: Channel | null = null;
    if (rawChan) {
      const parsedChan = JSON.parse(rawChan);
      activeChan = parsedChan?.state?.activeChannel || null;
    }

    const rawAcc = localStorage.getItem("yt-clone_accounts_storage");
    let activeChanId: string | null = activeChan?.id || null;

    if (rawAcc) {
      const parsedAcc = JSON.parse(rawAcc);
      const activeAccountId: string | undefined =
        parsedAcc?.state?.activeAccountId;
      const accounts: StoredAccount[] = parsedAcc?.state?.accounts || [];
      const currentAcc = accounts.find((a) => a.user?.id === activeAccountId);

      if (currentAcc?.activeChannelId) {
        activeChanId = currentAcc.activeChannelId;
      }

      if (
        !activeChan &&
        currentAcc?.channels &&
        currentAcc.channels.length > 0
      ) {
        const match = currentAcc.channels.find((c) => c.id === activeChanId);
        activeChan = match || currentAcc.channels[0];
      } else if (
        activeChan &&
        currentAcc?.channels &&
        currentAcc.channels.length > 0
      ) {
        const match = currentAcc.channels.find((c) => c.id === activeChanId);
        if (match) {
          activeChan = match;
        }
      }
    }

    return {
      channels: [],
      activeChannelId: activeChanId,
      activeChannel: activeChan,
    };
  } catch {
    return { channels: [], activeChannelId: null, activeChannel: null };
  }
}

const initialChannelState = getInitialChannelState();

export const useChannelStore = create<ChannelState>()(
  persist(
    (set, get) => ({
      channels: initialChannelState.channels,
      activeChannelId: initialChannelState.activeChannelId,
      activeChannel: initialChannelState.activeChannel,

      setChannels: (newChannels) => {
        set((state) => {
          const sanitized = newChannels.map(sanitizeChannel);
          if (sanitized.length === 0) {
            return {
              channels: [],
              activeChannelId: null,
              activeChannel: null,
            };
          }

          let targetActiveId = state.activeChannelId || state.activeChannel?.id;

          if (!targetActiveId) {
            const activeAcc = useAccountStore.getState().getActiveAccount();
            if (activeAcc && activeAcc.user.id === sanitized[0].user_id) {
              targetActiveId = activeAcc.activeChannelId || undefined;
            }
          }

          const foundActive = sanitized.find((c) => c.id === targetActiveId);

          if (foundActive) {
            useAccountStore
              .getState()
              .setAccountActiveChannelId(foundActive.user_id, foundActive.id);
            return {
              channels: sanitized,
              activeChannelId: foundActive.id,
              activeChannel: foundActive,
            };
          }

          useAccountStore
            .getState()
            .setAccountActiveChannelId(sanitized[0].user_id, sanitized[0].id);
          return {
            channels: sanitized,
            activeChannelId: sanitized[0].id,
            activeChannel: sanitized[0],
          };
        });
      },

      addChannel: (channel) => {
        set((state) => {
          const sanitized = sanitizeChannel(channel);
          const existingIndex = state.channels.findIndex(
            (c) => c.id === sanitized.id,
          );

          const updatedChannels = [...state.channels];
          if (existingIndex >= 0) {
            updatedChannels[existingIndex] = sanitized;
          } else {
            updatedChannels.unshift(sanitized);
          }

          useAccountStore
            .getState()
            .setAccountActiveChannelId(sanitized.user_id, sanitized.id);

          return {
            channels: updatedChannels,
            activeChannelId: sanitized.id,
            activeChannel: sanitized,
          };
        });
      },

      updateChannel: (id, updated) => {
        set((state) => {
          const updatedChannels = state.channels.map((c) =>
            c.id === id ? sanitizeChannel({ ...c, ...updated }) : c,
          );
          const currentActive =
            updatedChannels.find((c) => c.id === state.activeChannelId) ||
            (state.activeChannel?.id === id
              ? sanitizeChannel({ ...state.activeChannel, ...updated })
              : state.activeChannel) ||
            updatedChannels[0] ||
            null;

          if (currentActive) {
            useAccountStore
              .getState()
              .setAccountActiveChannelId(
                currentActive.user_id,
                currentActive.id,
              );
          }

          return {
            channels: updatedChannels,
            activeChannel: currentActive,
          };
        });
      },

      deleteChannel: (id) => {
        set((state) => {
          const updatedChannels = state.channels.filter((c) => c.id !== id);
          let newActiveId = state.activeChannelId;

          if (state.activeChannelId === id || state.activeChannel?.id === id) {
            newActiveId =
              updatedChannels.length > 0 ? updatedChannels[0].id : null;
          }

          const currentActive =
            updatedChannels.find((c) => c.id === newActiveId) ||
            updatedChannels[0] ||
            null;

          if (currentActive) {
            useAccountStore
              .getState()
              .setAccountActiveChannelId(
                currentActive.user_id,
                currentActive.id,
              );
          }

          return {
            channels: updatedChannels,
            activeChannelId: newActiveId,
            activeChannel: currentActive,
          };
        });
      },

      setActiveChannel: (channelOrId) => {
        set((state) => {
          if (!channelOrId) {
            return { activeChannelId: null, activeChannel: null };
          }

          if (typeof channelOrId === "object") {
            const sanitized = sanitizeChannel(channelOrId);
            useAccountStore
              .getState()
              .setAccountActiveChannelId(sanitized.user_id, sanitized.id);
            return {
              activeChannelId: sanitized.id,
              activeChannel: sanitized,
            };
          }

          const id = channelOrId;
          const found =
            state.channels.find((c) => c.id === id) ||
            (state.activeChannel?.id === id ? state.activeChannel : null);

          const resolvedActive =
            found || state.activeChannel || state.channels[0] || null;

          if (resolvedActive) {
            useAccountStore
              .getState()
              .setAccountActiveChannelId(
                resolvedActive.user_id,
                resolvedActive.id,
              );
          }

          return {
            activeChannelId: id,
            activeChannel: resolvedActive,
          };
        });
      },

      setActiveChannelId: (id) => {
        get().setActiveChannel(id);
      },

      getActiveChannel: () => {
        const { channels, activeChannelId, activeChannel } = get();
        if (
          activeChannel &&
          activeChannelId &&
          activeChannel.id === activeChannelId
        ) {
          return activeChannel;
        }
        if (channels.length > 0) {
          if (activeChannelId) {
            const found = channels.find((c) => c.id === activeChannelId);
            if (found) return found;
          }
          return channels[0];
        }
        return activeChannel || null;
      },

      clearAllChannels: () => {
        set({ channels: [], activeChannelId: null, activeChannel: null });
      },
    }),
    {
      name: CHANNELS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Cấu hình partialize: CHỈ lưu kênh đang chọn (activeChannel) xuống localStorage, KHÔNG lưu activeChannelId
      partialize: (state) => {
        const active = state.getActiveChannel();
        return {
          activeChannel: active ? sanitizeChannel(active) : null,
        };
      },
    },
  ),
);

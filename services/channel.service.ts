import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/constants";
import { Channel } from "@/lib/types";

export interface CreateChannelDTO {
  name: string;
  handle: string;
  description?: string;
  avatar_url?: string;
}

export interface UpdateChannelDTO {
  name?: string;
  handle?: string;
  description?: string;
  avatar_url?: string;
  banner_url?: string;
}

export const channelService = {
  getMyChannels: async (): Promise<Channel[]> => {
    const { data } = await api.get<Channel[]>(API_ROUTES.CHANNELS.MY_CHANNELS);
    return data || [];
  },
  createChannel: async (dto: CreateChannelDTO): Promise<Channel> => {
    const { data } = await api.post<Channel>(API_ROUTES.CHANNELS.CREATE, dto);
    return data;
  },
  getById: async (id: string): Promise<Channel> => {
    const { data } = await api.get<Channel>(API_ROUTES.CHANNELS.BY_ID(id));
    return data;
  },
  getByHandle: async (handle: string): Promise<Channel> => {
    const { data } = await api.get<Channel>(
      API_ROUTES.CHANNELS.BY_HANDLE(handle),
    );
    return data;
  },
  updateChannel: async (
    id: string,
    dto: UpdateChannelDTO,
  ): Promise<Channel> => {
    const { data } = await api.put<Channel>(API_ROUTES.CHANNELS.BY_ID(id), dto);
    return data;
  },
  deleteChannel: async (id: string): Promise<void> => {
    await api.delete(API_ROUTES.CHANNELS.BY_ID(id));
  },
};

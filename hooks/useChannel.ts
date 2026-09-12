import { qKeys } from "@/lib/queryClient";
import { Channel } from "@/lib/types";
import {
  channelService,
  CreateChannelDTO,
  UpdateChannelDTO,
} from "@/services/channel.service";
import { useChannelStore } from "@/store/useChannelStore";
import { useAccountStore } from "@/store/useAccountStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";

/**
 * Hook lấy danh sách tất cả các kênh của user đang đăng nhập.
 * Kết hợp Zustand useChannelStore để trả về dữ liệu hiển thị tức thì (0ms)
 * và tự động đồng bộ khi React Query hoàn tất.
 */
export function useMyChannels() {
  const { data: user } = useCurrentUser();
  const storedChannels = useChannelStore((s) => s.channels);
  const setChannels = useChannelStore((s) => s.setChannels);

  const q = useQuery<Channel[]>({
    queryKey: qKeys.channels.myChannels,
    queryFn: channelService.getMyChannels,
    retry: false,
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 phút mới tự động kiểm tra lại API một lần
    refetchOnWindowFocus: false,
  });

  // Tự động đồng bộ kết quả mới từ API vào Zustand Store
  useEffect(() => {
    if (q.data) {
      setChannels(q.data);
      if (user?.id) {
        useAccountStore.getState().updateAccountChannels(user.id, q.data);
      }
    }
  }, [q.data, user?.id, setChannels]);

  // Ưu tiên trả về danh sách kênh từ Zustand Store (0ms instant render)
  const displayChannels =
    storedChannels.length > 0 ? storedChannels : q.data || [];

  return {
    ...q,
    data: displayChannels,
    isLoading: storedChannels.length > 0 ? false : q.isLoading,
  };
}

/**
 * Hook lấy thông tin Kênh đang được chọn (Active Channel) của user đang đăng nhập.
 */
export function useActiveChannel(): Channel | null {
  const { data: channels = [] } = useMyChannels();
  const activeChannelId = useChannelStore((s) => s.activeChannelId);
  const storedActiveChannel = useChannelStore((s) => s.activeChannel);

  if (
    storedActiveChannel &&
    (!activeChannelId || storedActiveChannel.id === activeChannelId)
  ) {
    if (channels.length > 0) {
      const found = channels.find((c) => c.id === storedActiveChannel.id);
      if (found) return found;
    }
    return storedActiveChannel;
  }

  if (channels.length === 0) return storedActiveChannel || null;

  const targetId = activeChannelId || storedActiveChannel?.id;
  if (!targetId) return channels[0] || null;

  return (
    channels.find((c) => c.id === targetId) ||
    storedActiveChannel ||
    channels[0] ||
    null
  );
}

/**
 * Hook lấy chi tiết 1 kênh theo handle (ví dụ: @Thuc-a8b2 hoặc Thuc-a8b2)
 */
export function useChannelByHandle(handle: string) {
  return useQuery<Channel>({
    queryKey: qKeys.channels.byHandle(handle),
    queryFn: () => channelService.getByHandle(handle),
    retry: false,
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook lấy chi tiết 1 kênh theo ID
 */
export function useChannelById(id: string) {
  return useQuery<Channel>({
    queryKey: qKeys.channels.detail(id),
    queryFn: () => channelService.getById(id),
    retry: false,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook tạo kênh mới cho user đang đăng nhập
 */
export function useCreateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateChannelDTO) => channelService.createChannel(dto),
    onSuccess: (newChan) => {
      // Cập nhật tức thì vào Zustand Store
      useChannelStore.getState().addChannel(newChan);
      queryClient.invalidateQueries({ queryKey: qKeys.channels.myChannels });
    },
  });
}

/**
 * Hook cập nhật kênh
 */
export function useUpdateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateChannelDTO }) =>
      channelService.updateChannel(id, dto),
    onSuccess: (updatedChan, variables) => {
      // Cập nhật tức thì vào Zustand Store
      useChannelStore.getState().updateChannel(variables.id, updatedChan);
      queryClient.invalidateQueries({ queryKey: qKeys.channels.myChannels });
      queryClient.invalidateQueries({
        queryKey: qKeys.channels.detail(variables.id),
      });
    },
  });
}

/**
 * Hook xóa kênh
 */
export function useDeleteChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => channelService.deleteChannel(id),
    onSuccess: (_, deletedId) => {
      // Xóa tức thì khỏi Zustand Store
      useChannelStore.getState().deleteChannel(deletedId);
      queryClient.invalidateQueries({ queryKey: qKeys.channels.myChannels });
    },
  });
}

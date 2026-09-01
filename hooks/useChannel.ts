import { qKeys } from "@/lib/queryClient";
import { Channel } from "@/lib/types";
import {
  channelService,
  CreateChannelDTO,
  UpdateChannelDTO,
} from "@/services/channel.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";

/**
 * Hook lấy danh sách tất cả các kênh của user đang đăng nhập
 */
export function useMyChannels() {
  const { data: user } = useCurrentUser();

  return useQuery<Channel[]>({
    queryKey: qKeys.channels.myChannels,
    queryFn: channelService.getMyChannels,
    retry: false,
    enabled: !!user, // Chỉ gửi request lấy kênh khi user ĐÃ đăng nhập (tránh spam 401)
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook tạo kênh mới cho user đang đăng nhập
 */
export function useCreateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateChannelDTO) => channelService.createChannel(dto),
    onSuccess: () => {
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
    onSuccess: (_, variables) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qKeys.channels.myChannels });
    },
  });
}

import { Dictionary } from "../context";
import en from "./en";

const vi: Dictionary<typeof en> = {
  app: {
    name: "YouTubeCL",
    create: "Tạo",
    cancel: "Hủy",
    save: "Lưu",
    delete: "Xóa",
    deleteChannel: "Xóa kênh",
    loading: "Đang tải...",
    notification: "Thông báo",
    search: "Tìm kiếm",
    searchInMic: "Tìm kiếm bằng giọng nói",
    selectPicture: "Chọn ảnh",
    more: "Xêm thêm",
    customiseChannel: "Tùy chỉnh kênh",
    manageVideos: "Quản lý video",
    subscribe: "Đăng ký",
    subscribed: "Đã đăng ký",
    edit: "Chỉnh sửa",
    next: "Tiếp theo",
    Previous: "Trước",
    signIn: "Đăng nhập",
  },

  notice: {
    title: "Một ứng dụng clone YouTube.",
    description:
      "Đây là một dự án phi thương mại được tạo ra nhằm mục đích học tập.",
    missingTokens: "Thiếu mã xác thực từ Google. Vui lòng thử đăng nhập lại.",
  },

  sidebar: {
    home: "Trang chủ",
    shorts: "Shorts",
    subscriptions: "Kênh đăng ký",
    you: "Bạn",
    history: "Video đã xem",
    playlists: "Danh sách phát",
    likedVideos: "Video đã thích",
    note: "Đây không phải là một ứng dụng thương mại thực sự.",
    noteSignIn: "Đăng nhập để thích video, bình luận và đăng ký.",
  },
  settings: {
    title: "Cài đặt",
    createChannel: "Tạo kênh",
    viewChannel: "Xem kênh của bạn",
    switchAccount: {
      title: "Chuyển đổi tài khoản",
      accounts: "Tài khoản",
      viewAllChannels: "Xem tất cả kênh",
      otherAccounts: "Tài khoản khác",
      addAccount: "Thêm tài khoản",
      signOutAll: "Đăng xuất khỏi tất cả các tài khoản",
    },
    signOut: "Đăng xuất",
    appearance: "Giao diện",
    language: {
      title: "Ngôn ngữ hiển thị",
      note: "Các nút và văn bản hiển thị trên trình duyệt này",
    },
    keyboardShortcuts: "Phím tắt",
    theme: {
      note: "Tùy chọn cài đặt chỉ áp dụng cho trình duyệt này",
      system: "Giao diện thiết bị",
      dark: "Giao diện tối",
      light: "Giao diện sáng",
    },
  },
  advancedSettings: {
    title: "Cài đặt nâng cao",
    account: "Tài khoản",
    introduction: "Thiết lập YouTubeCL theo đúng ý bạn",
    userID: "ID người dùng",
    channelID: "Mã nhận dạng kênh",
    deleteChannel: "Xóa kênh",
    deleteChannelDescription:
      "Việc xóa kênh YouTube sẽ không làm Tài khoản Google của bạn bị đóng",
  },
  channelCreateModal: {
    title: "Cách bạn sẽ xuất hiện",
    name: "Tên",
    handle: "Tên người dùng",
    handleAlreadyTaken:
      "Tên định danh này đã được sử dụng. Vui lòng chọn tên khác.",
    createFailed: "Không thể tạo kênh. Vui lòng thử lại.",
    textRequired: "{text} is required.",
  },
  channelDeleteModal: {
    title: "Xóa kênh {name}",
    description:
      "Việc xóa kênh YouTubeCL {description} sẽ xóa vĩnh viễn kênh của bạn, bao gồm tất cả nội dung, video, bình luận và danh sách phát.",
    warning: "Hành động này là vĩnh viễn và không thể hoàn tác.",
  },
  channelDescription: {
    title: "Mô tả",
    moreInfo: "Thông tin khác",
    joined: "Đã tham gia {date}",
    subscribers: "{subscriber} người đăng ký",
    videos: "{video} video",
    views: "{view} lượt xem",
  },
  channel: {
    subscriber: "{subscriber} người đăng ký",
    noDescription: "Tìm hiểu thêm về kênh này",
    notFound: "Không tìm thấy kênh",
    notFoundDescription:
      'Kênh "{identifier}" không tồn tại hoặc có thể đã bị xóa.',
    noChannel: "Không có kênh",
    noSubscribers: "Không có người đăng ký",
  },
  category: {
    mixes: "Danh sách kết hợp",
    all: "Tất cả",
    recentlyUploaded: "Mới tải lên gần đây",
    watched: "Đã xem",
    gaming: "Trò chơi",
    music: "Âm Nhạc",
    failed: "Không thể tải các danh mục.",
  },
  account: {
    title: "Tài khoản",
    introduction:
      "Chọn cách bạn xuất hiện và nội dung bạn muốn xem trên YouTube",
    signedInAs: "Đăng nhập bằng  {email}",
    yourChannel: "Kênh {name} của bạn",
    ycDescription:
      "Đây là sự hiện diện công khai của bạn trên YouTube. Bạn cần có một kênh để tải video của riêng mình lên, bình luận về các video hoặc tạo danh sách phát.",
    channelStatus: "Trạng thái và tính năng của kênh",
    channelManage: "Thêm hoặc quản lý (các) kênh của bạn",
  },
  backToSignIn: "Quay lại đăng nhập",
  backToHome: "Quay lại trang chủ",
};

export default vi;

export const LANGUES = [
  { id: "en", tag: "en", emoji: "🇬🇧", nom: "English" },
  { id: "vi", tag: "vi", emoji: "🇻🇳", nom: "Tiếng Việt" },
];
export type Langue = (typeof LANGUES)[number]["id"];

export const LANGUE_PAR_DEFAUT: Langue = "en";

/**
 * Type guard kiểm tra xem một chuỗi bất kỳ có phải là mã ngôn ngữ hợp lệ (`Langue`) hay không.
 * 
 * @param valeur Giá trị chuỗi (hoặc null/undefined) cần kiểm tra
 * @returns `true` nếu nằm trong danh sách ngôn ngữ hỗ trợ (`LANGUES`), ngược lại `false`
 */
export function estLangue(valeur: string | null | undefined): valeur is Langue {
  return LANGUES.some((l) => l.id === valeur);
}

/**
 * Lấy mã BCP 47 language tag tương ứng với ID ngôn ngữ truyền vào.
 * 
 * @param langue Mã ID ngôn ngữ (ví dụ: "en", "vi")
 * @returns Mã BCP 47 tag (ví dụ: "en", "vi")
 */
export function tagDe(langue: Langue): string {
  return LANGUES.find((l) => l.id === langue)!.tag;
}

/**
 * Tự động chọn ngôn ngữ phù hợp nhất cho người dùng theo thứ tự ưu tiên:
 * 1. Ngôn ngữ đã được lưu trước đó (nếu hợp lệ)
 * 2. Ngôn ngữ ưu tiên từ cấu hình trình duyệt người dùng (navigator.languages)
 * 3. Ngôn ngữ mặc định của ứng dụng (LANGUE_PAR_DEFAUT)
 * 
 * @param memorisee Mã ngôn ngữ đã được lưu lại trong bộ nhớ local (localStorage)
 * @param preferences Danh sách mã ngôn ngữ được ưu tiên bởi trình duyệt
 * @returns Mã ngôn ngữ (`Langue`) được lựa chọn
 */
export function choisirLangue(
  memorisee: string | null,
  preferences: readonly string[],
): Langue {
  if (estLangue(memorisee)) return memorisee;
  for (const tag of preferences) {
    let base: string;
    try {
      base = new Intl.Locale(tag).language;
    } catch {
      // Một thẻ nhãn ngôn ngữ không hợp lệ trong navigator.languages sẽ bị bỏ qua thay vì gây lỗi ứng dụng
      continue;
    }
    if (estLangue(base)) return base;
  }
  return LANGUE_PAR_DEFAUT;
}

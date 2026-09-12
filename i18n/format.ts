const SEPARATEUR = " | ";

/**
 * Thay thế các biến giữ chỗ dạng `{key}` trong chuỗi văn bản bằng giá trị tương ứng.
 *
 * @param texte Chuỗi văn bản gốc chứa các placeholder (ví dụ: "Xin chào {name}")
 * @param valeurs Đối tượng chứa danh sách các cặp key-value để chèn vào văn bản
 * @returns Chuỗi văn bản hoàn chỉnh sau khi đã nội suy các giá trị
 */
export function interpoler(
  texte: string,
  valeurs?: Record<string, string | number>,
): string {
  if (!valeurs) return texte;
  let sortie = texte;
  for (const [nom, valeur] of Object.entries(valeurs)) {
    sortie = sortie.replaceAll(`{${nom}}`, String(valeur));
  }
  return sortie;
}

/**
 * Xác định và trả về dạng số ít hoặc số nhiều của chuỗi văn bản dựa vào số lượng `n` và ngôn ngữ `tag`.
 *
 * @param gabarit Chuỗi mẫu chứa các dạng từ phân cách bằng " | " (ví dụ: "món hàng | những món hàng")
 * @param n Số lượng để xác định quy tắc số ít/số nhiều
 * @param tag Mã BCP 47 đại diện cho ngôn ngữ (ví dụ: "en", "vi")
 * @returns Dạng từ tương ứng (số ít ở chỉ số 0, số nhiều ở chỉ số 1)
 */
export function formePlurielle(
  gabarit: string,
  n: number,
  tag: string,
): string {
  const formes = gabarit.split(SEPARATEUR);
  if (formes.length < 2) return formes[0]!;
  const index = new Intl.PluralRules(tag).select(n) === "one" ? 0 : 1;
  return formes[index] ?? formes[0]!;
}

function toDate(valeur: string | Date | number): Date {
  if (valeur instanceof Date) return valeur;
  return new Date(valeur);
}

const formateursDate = new Map<string, Intl.DateTimeFormat>();

export type OptionFormatDate =
  | "date"
  | "datetime"
  | "time"
  | "full"
  | Intl.DateTimeFormatOptions;

/**
 * Định dạng chuỗi ngày tháng ISO (ví dụ: "2026-09-10T12:13:21.657805+07:00") theo quy chuẩn của ngôn ngữ `tag`.
 *
 * @param valeur Chuỗi ISO, timestamp hoặc Date object
 * @param tag Mã BCP 47 đại diện cho ngôn ngữ (ví dụ: "en", "vi")
 * @param options Cấu hình Intl.DateTimeFormatOptions hoặc preset ('date' | 'datetime' | 'time' | 'full')
 * @returns Chuỗi ngày tháng đã định dạng theo ngôn ngữ
 */
export function formeDate(
  valeur: string | Date | number,
  tag: string,
  options: OptionFormatDate = "date",
): string {
  const d = toDate(valeur);
  if (isNaN(d.getTime())) return String(valeur);

  let opts: Intl.DateTimeFormatOptions;
  if (typeof options === "string") {
    switch (options) {
      case "date":
        opts = { year: "numeric", month: "short", day: "numeric" };
        break;
      case "datetime":
        opts = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        break;
      case "time":
        opts = { hour: "2-digit", minute: "2-digit" };
        break;
      case "full":
        opts = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        break;
      default:
        opts = { year: "numeric", month: "short", day: "numeric" };
    }
  } else {
    opts = options;
  }

  const memoKey = `${tag}:${JSON.stringify(opts)}`;
  let f = formateursDate.get(memoKey);
  if (!f) {
    f = new Intl.DateTimeFormat(tag, opts);
    formateursDate.set(memoKey, f);
  }

  return f.format(d);
}

const formateursRelative = new Map<string, Intl.RelativeTimeFormat>();

/**
 * Định dạng khoảng thời gian tương đối (time ago, ví dụ: "2 giờ trước", "3 days ago")
 * từ chuỗi ISO theo ngôn ngữ `tag`.
 *
 * @param valeur Chuỗi ISO, timestamp hoặc Date object
 * @param tag Mã BCP 47 đại diện cho ngôn ngữ ("en", "vi")
 * @returns Chuỗi thời gian tương đối đã định dạng
 */
export function formeTempsRelatif(
  valeur: string | Date | number,
  tag: string,
): string {
  const d = toDate(valeur);
  if (isNaN(d.getTime())) return String(valeur);

  const maintenant = Date.now();
  const diffEnSecondes = Math.round((d.getTime() - maintenant) / 1000);

  const minute = 60;
  const heure = minute * 60;
  const jour = heure * 24;
  const semaine = jour * 7;
  const mois = jour * 30;
  const annee = jour * 365;

  const absDiff = Math.abs(diffEnSecondes);

  let val: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (absDiff < minute) {
    val = diffEnSecondes;
    unit = "second";
  } else if (absDiff < heure) {
    val = Math.round(diffEnSecondes / minute);
    unit = "minute";
  } else if (absDiff < jour) {
    val = Math.round(diffEnSecondes / heure);
    unit = "hour";
  } else if (absDiff < semaine) {
    val = Math.round(diffEnSecondes / jour);
    unit = "day";
  } else if (absDiff < mois) {
    val = Math.round(diffEnSecondes / semaine);
    unit = "week";
  } else if (absDiff < annee) {
    val = Math.round(diffEnSecondes / mois);
    unit = "month";
  } else {
    val = Math.round(diffEnSecondes / annee);
    unit = "year";
  }

  let rtf = formateursRelative.get(tag);
  if (!rtf) {
    rtf = new Intl.RelativeTimeFormat(tag, { numeric: "auto" });
    formateursRelative.set(tag, rtf);
  }

  return rtf.format(val, unit);
}

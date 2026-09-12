"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  choisirLangue,
  estLangue,
  type Langue,
  LANGUE_PAR_DEFAUT,
  tagDe,
} from "./langues";
import en from "./locales/en";
import vi from "./locales/vi";
import {
  formeDate,
  formePlurielle,
  formeTempsRelatif,
  interpoler,
  type OptionFormatDate,
} from "./format";
import { LANGUAGE_KEY } from "@/lib/constants";

export { LANGUES, type Langue } from "./langues";
export { formeDate, formeTempsRelatif } from "./format";

export type Dictionary<T> = {
  [K in keyof T]: T[K] extends string ? string : Dictionary<T[K]>;
};
const dictionnaires: Record<Langue, Dictionary<typeof en>> = { en, vi };

type Chemins<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : Chemins<T[K], `${P}${K}.`>;
}[keyof T & string];

export type Cle = Chemins<typeof en>;

type ValeurDeChemin<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? ValeurDeChemin<T[K], R>
    : never
  : P extends keyof T
    ? T[P]
    : never;

type Placeholders<T extends string> =
  T extends `${string}{${infer P}}${infer Rest}`
    ? P | Placeholders<Rest>
    : never;

type RichValeurs<C extends Cle> = {
  [P in Placeholders<
    Extract<ValeurDeChemin<typeof en, C>, string>
  >]: React.ReactNode;
};

const formateurs = new Map<string, Intl.NumberFormat>();

/**
 * Tạo mới hoặc lấy lại đối tượng `Intl.NumberFormat` từ bộ nhớ đệm (cache) dựa trên tag và khóa memoization.
 * Giúp tối ưu hiệu năng khi định dạng số/phần trăm liên tục.
 *
 * @param tag Mã BCP 47 đại diện cho ngôn ngữ
 * @param cle Khóa phân biệt cấu hình định dạng (ví dụ: "%", "n2")
 * @param options Cấu hình định dạng dành cho Intl.NumberFormat
 * @returns Đối tượng Intl.NumberFormat đã được cache
 */
function creerFormateur(
  tag: string,
  cle: string,
  options: Intl.NumberFormatOptions,
) {
  const memo = `${tag}:${cle}`;
  let f = formateurs.get(memo);
  if (!f) {
    f = new Intl.NumberFormat(tag, options);
    formateurs.set(memo, f);
  }
  return f;
}

interface CtxI18n {
  langue: Langue;
  setLangue: (l: Langue) => void;
  t: (cle: Cle, valeurs?: Record<string, string | number>) => string;
  tRich: <C extends Cle>(cle: C, valeurs: RichValeurs<C>) => React.ReactNode;
  pluriel: (
    cle: Cle,
    n: number,
    valeurs?: Record<string, string | number>,
  ) => string;
  nombre: (valeur: number, decimales?: number) => string;
  pourcentage: (fraction: number) => string;
  date: (valeur: string | Date | number, options?: OptionFormatDate) => string;
  tempsRelatif: (valeur: string | Date | number) => string;
  tag: string;
}

const Ctx = createContext<CtxI18n | null>(null);

/**
 * Custom React Hook để lấy context i18n hiện tại.
 *
 * @returns CtxI18n Đối tượng chứa ngôn ngữ hiện tại và các hàm dịch thuật/định dạng
 * @throws Lỗi nếu được gọi bên ngoài component <I18nProvider>
 */
export function useI18n(): CtxI18n {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useI18n() doit etre appele dans un <I18nProvider>");
  return ctx;
}

/**
 * Component Provider quản lý trạng thái ngôn ngữ và cung cấp các hàm dịch thuật cho toàn bộ các component con.
 */
export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [courante, setCourante] = useState<Langue>(LANGUE_PAR_DEFAUT);
  // Tự động phát hiện và khôi phục ngôn ngữ đã lưu hoặc theo trình duyệt khi ở phía Client
  useEffect(() => {
    const memorisee = localStorage.getItem(LANGUAGE_KEY);
    const detectee = choisirLangue(
      memorisee,
      navigator.languages ?? [navigator.language],
    );
    setCourante(detectee);
  }, []);

  /**
   * Cập nhật ngôn ngữ hiện tại của ứng dụng và lưu vào bộ nhớ cục bộ.
   */
  const setLangue = useCallback((valeur: Langue): void => {
    if (!estLangue(valeur)) return;
    setCourante(valeur);
    localStorage.setItem(LANGUAGE_KEY, valeur);
  }, []);

  const dictionnaire = useMemo(() => dictionnaires[courante], [courante]);
  const tag = useMemo(() => tagDe(courante), [courante]);

  /**
   * Tra cứu chuỗi bản dịch thô từ dictionnaire thông qua khóa (key) chấm phân cấp (ví dụ: "app.title").
   */
  const brut = useCallback(
    (cle: Cle): string => {
      const noeud = cle
        .split(".")
        .reduce<unknown>(
          (n, k) => (n as Record<string, unknown>)[k],
          dictionnaire,
        );
      return noeud as string;
    },
    [dictionnaire],
  );

  /**
   * Hàm dịch chuỗi theo khóa `cle` và chèn các biến động (`valeurs`).
   */
  const t = useCallback(
    (cle: Cle, valeurs?: Record<string, string | number>): string =>
      interpoler(brut(cle), valeurs),
    [brut],
  );
  /**
   * Hàm dịch chuỗi có hỗ trợ chèn các React Node (ví dụ: link, strong, icon...)
   * vào các placeholder dạng `{name}` trong chuỗi bản dịch.
   *
   * @param cle Khóa bản dịch cần lấy từ dictionnaire.
   * @param valeurs Các giá trị React Node được chèn vào các placeholder tương ứng.
   * @returns Chuỗi hoặc React Node đã được thay thế placeholder.
   */
  const tRich = useCallback(
    <C extends Cle>(cle: C, valeurs: RichValeurs<C>): React.ReactNode => {
      const texte = brut(cle);

      const parts = texte.split(/(\{[^}]+\})/g);

      return parts.map((part, index) => {
        const match = part.match(/^\{([^}]+)\}$/);

        if (!match) return part;

        const valeur = valeurs[match[1] as keyof RichValeurs<C>];

        if (valeur === undefined) return part;

        return <React.Fragment key={index}>{valeur}</React.Fragment>;
      });
    },
    [brut],
  );

  /**
   * Hàm dịch chuỗi có xử lý số ít / số nhiều theo số lượng `n` và chèn các biến động.
   */
  const pluriel = useCallback(
    (cle: Cle, n: number, valeurs?: Record<string, string | number>): string =>
      interpoler(formePlurielle(brut(cle), n, tag), { n, ...valeurs }),
    [brut, tag],
  );

  /**
   * Định dạng một tỉ lệ dạng phân số thành chuỗi phần trăm (ví dụ: 0.75 -> "75%").
   */
  const pourcentage = useCallback(
    (fraction: number): string =>
      creerFormateur(tag, "%", {
        style: "percent",
        maximumFractionDigits: 0,
      }).format(fraction),
    [tag],
  );

  /**
   * Định dạng số theo quy chuẩn quốc tế của ngôn ngữ hiện tại.
   */
  const nombre = useCallback(
    (valeur: number, decimales: number = 0): string =>
      creerFormateur(tag, `n${decimales}`, {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
      }).format(valeur),
    [tag],
  );

  /**
   * Định dạng ngày tháng (ISO string/Date) theo ngôn ngữ hiện tại.
   */
  const date = useCallback(
    (
      valeur: string | Date | number,
      options: OptionFormatDate = "date",
    ): string => formeDate(valeur, tag, options),
    [tag],
  );

  /**
   * Định dạng thời gian tương đối (ví dụ: "2 giờ trước", "3 days ago") theo ngôn ngữ hiện tại.
   */
  const tempsRelatif = useCallback(
    (valeur: string | Date | number): string => formeTempsRelatif(valeur, tag),
    [tag],
  );

  // Đồng bộ ngôn ngữ HTML (`<html lang="...">`) và tiêu đề trang khi ngôn ngữ thay đổi
  useEffect(() => {
    document.documentElement.lang = tag;
  }, [tag, t]);

  const value = useMemo<CtxI18n>(
    () => ({
      langue: courante,
      setLangue,
      t,
      tRich,
      pluriel,
      nombre,
      pourcentage,
      date,
      tempsRelatif,
      tag,
    }),
    [
      courante,
      setLangue,
      t,
      tRich,
      pluriel,
      nombre,
      pourcentage,
      date,
      tempsRelatif,
      tag,
    ],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

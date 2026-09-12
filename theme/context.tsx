"use client";

import {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { script } from "./script";
import { disableAnimation, getSystemTheme, getTheme, MEDIA } from "./helpers";
import { THEME_KEY } from "@/lib/constants";

interface ValueObject {
  [themeName: string]: string;
}
type DataAttribute = `data-${string}`;

interface ScriptProps extends React.DetailedHTMLProps<
  React.ScriptHTMLAttributes<HTMLScriptElement>,
  HTMLScriptElement
> {
  [dataAttribute: DataAttribute]: unknown;
}
export type Attribute = DataAttribute | "class";

interface ThemeProviderProps extends PropsWithChildren<unknown> {
  themes?: string[] | undefined;
  forcedTheme?: string | undefined;
  enableSystem?: boolean | undefined;
  disableTransitionOnChange?: boolean | undefined;
  enableColorScheme?: boolean | undefined;
  storageKey?: string | undefined;
  defaultTheme?: string | undefined;
  attribute?: Attribute | Attribute[] | undefined;
  value?: ValueObject | undefined;
  nonce?: string;
  scriptProps?: ScriptProps;
}

interface UseThemeProps {
  themes: string[];
  forcedTheme?: string | undefined;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  theme?: string | undefined;
  resolvedTheme?: string | undefined;
  systemTheme?: "dark" | "light" | undefined;
}

const colorSchemes = ["light", "dark"];
const defaultThemes = ["light", "dark"];

const ThemeContext = createContext<UseThemeProps | undefined>(undefined);
const defaultContext: UseThemeProps = { setTheme: () => {}, themes: [] };

export function useTheme(): UseThemeProps {
  const ctx = useContext(ThemeContext) ?? defaultContext;
  if (!ctx)
    throw new Error("useTheme() doit etre appele dans un <ThemeProvider>");
  return ctx;
}

const saveToLS = (storageKey: string, value: string) => {
  // Save to storage
  localStorage.setItem(storageKey, value);
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // Unsupported
  }
};

export const ThemeProvider = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = THEME_KEY,
  themes = defaultThemes,
  defaultTheme = enableSystem ? "system" : "light",
  attribute = "data-theme",
  value,
  children,
  nonce,
  scriptProps,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<string>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<string | undefined>(() =>
    defaultTheme === "system" ? getSystemTheme() : defaultTheme,
  );

  useEffect(() => {
    const saved = getTheme(storageKey, defaultTheme);
    if (saved) {
      setThemeState(saved);
    }
  }, [storageKey, defaultTheme]);
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = useCallback(
    (theme: string | undefined) => {
      let resolved = theme;

      // If theme is system, resolve it before setting theme
      if (theme === "system" && enableSystem) {
        resolved = getSystemTheme();
      }

      if (!resolved) return;

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation(nonce) : null;

      const d = document.documentElement;

      const handleAttribute = (attr: Attribute) => {
        if (attr === "class") {
          d.classList.remove(...attrs);

          if (name) d.classList.add(name);
        } else if (attr.startsWith("data-")) {
          if (name) {
            d.setAttribute(attr, name);
          } else {
            d.removeAttribute(attr);
          }
        }
      };

      if (Array.isArray(attribute)) {
        attribute.forEach(handleAttribute);
      } else {
        handleAttribute(attribute);
      }

      if (enableColorScheme) {
        const fallback = colorSchemes.includes(defaultTheme)
          ? defaultTheme
          : "";

        const colorScheme = colorSchemes.includes(resolved)
          ? resolved
          : fallback;

        d.style.colorScheme = colorScheme;
      }

      enable?.();
    },
    [
      nonce,
      attribute,
      attrs,
      defaultTheme,
      disableTransitionOnChange,
      enableColorScheme,
      enableSystem,
      value,
    ],
  );

  const setTheme = useCallback(
    (value: React.SetStateAction<string>) => {
      if (typeof value === "function") {
        setThemeState((prevTheme) => {
          const newTheme = value(prevTheme);

          saveToLS(storageKey, newTheme);

          return newTheme;
        });
      } else {
        setThemeState(value);
        saveToLS(storageKey, value);
      }
    },
    [storageKey],
  );
  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);

      if (theme === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [theme, forcedTheme, applyTheme, enableSystem],
  );

  useEffect(() => {
    const media = window.matchMedia(MEDIA);

    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      if (!e.newValue) {
        setTheme(defaultTheme);
      } else {
        setThemeState(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setTheme, defaultTheme, storageKey]);

  // Whenever theme or forcedTheme changes, apply it
  useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [forcedTheme, theme, applyTheme]);

  const providerValue = useMemo(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === "system" ? resolvedTheme : theme,
      themes: enableSystem ? [...themes, "system"] : themes,
      systemTheme: (enableSystem ? resolvedTheme : undefined) as
        | "light"
        | "dark"
        | undefined,
    }),
    [theme, setTheme, forcedTheme, resolvedTheme, enableSystem, themes],
  );
  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScript
        {...{
          forcedTheme,
          storageKey,
          attribute,
          enableSystem,
          enableColorScheme,
          defaultTheme,
          value,
          themes,
          nonce,
          scriptProps,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeScript = memo(function ThemeScript({
  forcedTheme,
  storageKey,
  attribute,
  enableSystem,
  enableColorScheme,
  defaultTheme,
  value,
  themes,
  nonce,
  scriptProps,
}: Omit<ThemeProviderProps, "children"> & { defaultTheme: string }) {
  if (typeof window !== "undefined") return null;

  const scriptArgs = JSON.stringify([
    attribute,
    storageKey,
    defaultTheme,
    forcedTheme,
    themes,
    value,
    enableSystem,
    enableColorScheme,
  ]).slice(1, -1);

  return (
    <script
      {...scriptProps}
      suppressHydrationWarning
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `(${script.toString()})(${scriptArgs})`,
      }}
    />
  );
});

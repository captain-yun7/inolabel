"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider, createTheme, useMantineColorScheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import {
  SupabaseProvider,
  AuthProvider,
  DataProviderProvider,
  ThemeProvider,
  useTheme,
} from "@/lib/context";

// INNO LABEL Mantine Theme - Pink Brand
const mantineTheme = createTheme({
  primaryColor: "pink",
  colors: {
    pink: [
      "#fff0f7", // [0] - lightest
      "#ffe0ef",
      "#ffc2df",
      "#ff99c8",
      "#ff8ed0",
      "#fd68ba",
      "#e44fa0", // [6] - primary
      "#c93d87",
      "#a8306e",
      "#872456", // [9] - darkest
    ],
    gray: [
      "#fafafa", // [0] - lightest
      "#f4f4f5",
      "#e4e4e7",
      "#d4d4d8",
      "#a1a1aa",
      "#71717a",
      "#52525b", // [6]
      "#3f3f46",
      "#27272a",
      "#18181b", // [9] - darkest
    ],
    dark: [
      "#e0e0e0", // [0] - 더 밝은 텍스트 (라벨용)
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5c5f66",
      "#373A40",
      "#2C2E33",
      "#25262b",
      "#1A1B1E",
      "#141517",
    ],
  },
  fontFamily: '"Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif',
  headings: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  },
  defaultRadius: "md",
  cursorType: "pointer",
});

// Mantine colorScheme을 앱 테마와 동기화하는 컴포넌트
function MantineThemeSync({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  return <>{children}</>;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={mantineTheme} defaultColorScheme="light">
        <ModalsProvider>
          <Notifications position="top-right" />
          <SupabaseProvider>
            <AuthProvider>
              <DataProviderProvider>
                <ThemeProvider>
                  <MantineThemeSync>{children}</MantineThemeSync>
                </ThemeProvider>
              </DataProviderProvider>
            </AuthProvider>
          </SupabaseProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

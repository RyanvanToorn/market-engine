import { useAppSettings } from "@context/AppSettingsContext";
import { ThemeProvider } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { type AppPaletteMode, createAppTheme } from "@theme/theme";
import type { ThemeMode } from "@type/theme-mode";
import { useMemo } from "react";

function resolvePaletteMode(themeMode: ThemeMode, prefersDark: boolean): AppPaletteMode {
	if (themeMode === "system") {
		return prefersDark ? "dark" : "light";
	}

	return themeMode;
}

export interface AppThemeProviderProps {
	children: React.ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps): React.ReactElement {
	const { settings } = useAppSettings();
	const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

	const paletteMode = resolvePaletteMode(settings.themeMode, prefersDark);

	const theme = useMemo(() => createAppTheme(paletteMode), [paletteMode]);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

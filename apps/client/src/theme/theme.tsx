import { createTheme } from "@mui/material/styles";
import { brandColorsDark, brandColorsLight } from "./colours";

export type AppPaletteMode = "light" | "dark";

export function createAppTheme(mode: AppPaletteMode) {
	const brand = mode === "dark" ? brandColorsDark : brandColorsLight;

	return createTheme({
		shape: {
			borderRadius: 10,
		},
		typography: {
			fontFamily: "'Fjalla One', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
		},
		palette: {
			mode,

			primary: {
				main: brand.primary,
			},

			secondary: {
				main: brand.secondary,
			},

			success: {
				main: brand.success,
			},

			warning: {
				main: brand.warning,
			},

			error: {
				main: brand.danger,
			},

			background: {
				default: brand.backgroundDefault,
				paper: brand.backgroundPaper,
			},
		},
	});
}

export const theme = createAppTheme("dark");

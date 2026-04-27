import type { AppSettings } from "@interfaces/app-settings";
import { createContext, useContext } from "react";

interface AppSettingsContextValue {
	settings: AppSettings;
	updateSettings: (settings: Partial<AppSettings>) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

export const useAppSettings = () => {
	const context = useContext(AppSettingsContext);
	if (!context) {
		throw new Error("useAppSettings must be used within AppSettingsProvider");
	}
	return context;
};

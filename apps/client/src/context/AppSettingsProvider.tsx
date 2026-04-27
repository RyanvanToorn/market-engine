import type { AppSettings } from "@interfaces/app-settings";
import { settingsStorage } from "@utils/settings-storage";
import { useState } from "react";
import { AppSettingsContext } from "./AppSettingsContext";

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [settings, setSettings] = useState<AppSettings>(() => settingsStorage.load());

	const updateSettings = (partial: Partial<AppSettings>) => {
		setSettings((prev) => {
			const updated = { ...prev, ...partial };
			settingsStorage.save(updated);
			return updated;
		});
	};

	return <AppSettingsContext.Provider value={{ settings, updateSettings }}>{children}</AppSettingsContext.Provider>;
};

import type { AppSettings } from "@interfaces/app-settings";
import { safeGetItem, safeRemoveItem, safeSetItem } from "./local-storage";

const STORAGE_KEY = "marketscope.settings";

export const defaultSettings: AppSettings = {
	themeMode: "system",
	apiKeys: {},
};

export const settingsStorage = {
	load(): AppSettings {
		try {
			const raw = safeGetItem(STORAGE_KEY);
			if (!raw) return defaultSettings;

			const parsed = JSON.parse(raw);
			return { ...defaultSettings, ...parsed };
		} catch {
			return defaultSettings;
		}
	},

	save(settings: AppSettings): void {
		safeSetItem(STORAGE_KEY, JSON.stringify(settings));
	},

	clear(): void {
		safeRemoveItem(STORAGE_KEY);
	},
};

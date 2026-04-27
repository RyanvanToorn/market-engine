import type { WatchlistItem } from "@interfaces/watchlist-item";
import { safeGetItem, safeRemoveItem, safeSetItem } from "./local-storage";

const STORAGE_KEY = "marketscope.watchlist";

export const watchlistStorage = {
	load(): WatchlistItem[] {
		try {
			const raw = safeGetItem(STORAGE_KEY);
			if (!raw) return [];

			const parsed: unknown = JSON.parse(raw);
			return Array.isArray(parsed) ? (parsed as WatchlistItem[]) : [];
		} catch {
			return [];
		}
	},

	save(items: WatchlistItem[]): void {
		safeSetItem(STORAGE_KEY, JSON.stringify(items));
	},

	clear(): void {
		safeRemoveItem(STORAGE_KEY);
	},
};

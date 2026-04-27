export function safeGetItem(key: string): string {
	if (typeof window === "undefined" || !("localStorage" in window)) {
		return "";
	}

	try {
		const value = window.localStorage.getItem(key);
		return value ?? "";
	} catch {
		console.log("[LocalStorageHelper] failed to safely set item within local storage");
		return "";
	}
}

export function safeSetItem(key: string, value: string): void {
	if (typeof window === "undefined" || !("localStorage" in window)) {
		return;
	}

	try {
		window.localStorage.setItem(key, value);
	} catch {
		console.log("[LocalStorageHelper] failed to safely set item within local storage");
	}
}

export function safeRemoveItem(key: string): void {
	if (typeof window === "undefined" || !("localStorage" in window)) {
		return;
	}

	try {
		window.localStorage.removeItem(key);
	} catch {
		console.log("[LocalStorageHelper] failed to safely remove item from local storage");
	}
}

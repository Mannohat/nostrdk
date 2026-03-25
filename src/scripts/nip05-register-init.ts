import { initNip05RegisterForm, type Nip05FormIds } from "./nip05-register.client";

function parseIds(raw: string | null): Nip05FormIds | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as Nip05FormIds;
		if (!parsed || typeof parsed !== "object") return null;
		return parsed;
	} catch {
		return null;
	}
}

function initAll() {
	const roots = Array.from(
		document.querySelectorAll<HTMLElement>(".nip05-register-form-root"),
	);
	for (const root of roots) {
		const ids = parseIds(root.dataset.nip05Ids ?? null);
		const statusClass = (root.dataset.nip05StatusClass ?? "status") as
			| "status"
			| "nip05-status";
		if (!ids) continue;
		initNip05RegisterForm(ids, { statusClass });
	}
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initAll, { once: true });
} else {
	initAll();
}


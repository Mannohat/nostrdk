/**
 * Shared NIP-05 registration flow (navn-tjek → npub → BTCPay).
 * Bruges af forsiden (home) og dedikerede sider med forskellige element-id'er.
 */

export type Nip05StatusClass = "status" | "nip05-status";

export interface Nip05FormIds {
	nameInput: string;
	nameRow: string;
	nameStatus: string;
	proceedBtn: string;
	step1: string;
	step2: string;
	confirmedName: string;
	pubkeyInput: string;
	pubkeyStatus: string;
	payBtn: string;
	payStatus: string;
	backBtn: string;
}

/** Standard-id'er (getnip05, profiler, test-betaling) */
export const NIP05_IDS_PAGE: Nip05FormIds = {
	nameInput: "name",
	nameRow: "nameRow",
	nameStatus: "nameStatus",
	proceedBtn: "proceedBtn",
	step1: "step1",
	step2: "step2",
	confirmedName: "confirmedName",
	pubkeyInput: "pubkey",
	pubkeyStatus: "pubkeyStatus",
	payBtn: "payBtn",
	payStatus: "payStatus",
	backBtn: "backBtn",
};

/** Forsidens inline-form (undgår kollision med andre id'er) */
export const NIP05_IDS_HOME: Nip05FormIds = {
	nameInput: "nip05Name",
	nameRow: "nip05NameRow",
	nameStatus: "nip05Status",
	proceedBtn: "nip05ProceedBtn",
	step1: "nip05-step1",
	step2: "nip05-step2",
	confirmedName: "nip05Confirmed",
	pubkeyInput: "nip05Pubkey",
	pubkeyStatus: "nip05PubkeyStatus",
	payBtn: "nip05PayBtn",
	payStatus: "nip05PayStatus",
	backBtn: "nip05BackBtn",
};

function validatePubkey(val: string) {
	return /^npub1[a-z0-9]{58}$/.test(val) || /^[0-9a-f]{64}$/.test(val);
}

function el<T extends HTMLElement>(id: string): T | null {
	return document.getElementById(id) as T | null;
}

export function initNip05RegisterForm(
	ids: Nip05FormIds,
	options: { statusClass: Nip05StatusClass },
) {
	const { statusClass } = options;

	const nameInput0 = el<HTMLInputElement>(ids.nameInput);
	const nameRow0 = el(ids.nameRow);
	const nameStatus0 = el(ids.nameStatus);
	const proceedBtn0 = el<HTMLButtonElement>(ids.proceedBtn);
	const step10 = el(ids.step1);
	const step20 = el(ids.step2);
	const confirmedNameEl0 = el(ids.confirmedName);
	const backBtn0 = el(ids.backBtn);
	const pubkeyInput0 = el<HTMLInputElement>(ids.pubkeyInput);
	const pubkeyStatus0 = el(ids.pubkeyStatus);
	const payBtn0 = el<HTMLButtonElement>(ids.payBtn);
	const payStatus0 = el(ids.payStatus);

	if (
		!nameInput0 ||
		!nameRow0 ||
		!nameStatus0 ||
		!proceedBtn0 ||
		!step10 ||
		!step20 ||
		!confirmedNameEl0 ||
		!backBtn0 ||
		!pubkeyInput0 ||
		!pubkeyStatus0 ||
		!payBtn0 ||
		!payStatus0
	) {
		return;
	}

	// Narrow all elements to non-null for the rest of the function.
	const nameInput = nameInput0;
	const nameRow = nameRow0;
	const nameStatus = nameStatus0;
	const proceedBtn = proceedBtn0;
	const step1 = step10;
	const step2 = step20;
	const confirmedNameEl = confirmedNameEl0;
	const backBtn = backBtn0;
	const pubkeyInput = pubkeyInput0;
	const pubkeyStatus = pubkeyStatus0;
	const payBtn = payBtn0;
	const payStatus = payStatus0;

	let nameAvailable = false;
	let checkTimeout: ReturnType<typeof setTimeout>;
	let confirmedName = "";

	function setNameStatus(type: string, icon: string, text: string) {
		nameStatus.className = `${statusClass} ${type}`.trim();
		nameStatus.textContent = `${icon} ${text}`;
		nameRow.className =
			"nip05-name-row" +
			(type === "available" ? " valid" : type === "taken" ? " taken" : "");
	}

	function clearNameStatus() {
		nameStatus.className = statusClass;
		nameStatus.textContent = "";
		nameRow.className = "nip05-name-row";
		nameAvailable = false;
		proceedBtn.disabled = true;
	}

	async function checkAvailability(name: string) {
		if (!name) {
			clearNameStatus();
			return;
		}
		if (!/^[a-z0-9_-]+$/.test(name)) {
			setNameStatus("taken", "✗", "Kun små bogstaver, tal, _ og - er tilladt");
			nameAvailable = false;
			proceedBtn.disabled = true;
			return;
		}
		setNameStatus("checking", "…", "Tjekker tilgængelighed…");
		try {
			const res = await fetch(
				`/.netlify/functions/check-name?name=${encodeURIComponent(name)}`,
			);
			const data = await res.json();
			if (data.available) {
				setNameStatus("available", "✓", "Ledigt!");
				window.umami?.track("nip05-name-available");
				nameAvailable = true;
				proceedBtn.disabled = false;
			} else {
				setNameStatus("taken", "✗", "Navnet er allerede taget — prøv et andet");
				window.umami?.track("nip05-name-taken");
				nameAvailable = false;
				proceedBtn.disabled = true;
			}
		} catch {
			setNameStatus("error", "!", "Kunne ikke tjekke — prøv igen");
			nameAvailable = false;
			proceedBtn.disabled = true;
		}
	}

	nameInput.addEventListener("input", () => {
		const val = nameInput.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
		if (nameInput.value !== val) nameInput.value = val;
		clearTimeout(checkTimeout);
		if (!val) {
			clearNameStatus();
			return;
		}
		checkTimeout = setTimeout(() => checkAvailability(val), 500);
	});

	proceedBtn.addEventListener("click", () => {
		if (!nameAvailable) return;
		confirmedName = nameInput.value.trim();
		confirmedNameEl.textContent = `✓ ${confirmedName}@nostr.dk er ledigt`;
		step1.style.display = "none";
		step2.style.display = "block";
	});

	backBtn.addEventListener("click", () => {
		step2.style.display = "none";
		step1.style.display = "block";
	});

	pubkeyInput.addEventListener("input", function () {
		const val = this.value.trim();
		if (!val) {
			pubkeyStatus.className = statusClass;
			pubkeyStatus.textContent = "";
			pubkeyInput.style.borderColor = "rgba(255,255,255,0.1)";
			payBtn.disabled = true;
			return;
		}
		if (validatePubkey(val)) {
			pubkeyStatus.className = `${statusClass} available`;
			pubkeyStatus.textContent = "✓ Gyldig public key";
			pubkeyInput.style.borderColor = "#4caf50";
			payBtn.disabled = false;
		} else {
			pubkeyStatus.className = `${statusClass} taken`;
			pubkeyStatus.textContent = "✗ Skal være npub1… (63 tegn) eller hex (64 tegn)";
			pubkeyInput.style.borderColor = "#e05050";
			payBtn.disabled = true;
		}
	});

	payBtn.addEventListener("click", async () => {
		const pubkey = pubkeyInput.value.trim();
		if (!validatePubkey(pubkey)) return;

		payBtn.disabled = true;
		payBtn.textContent = "Opretter betaling…";
		payStatus.className = `${statusClass} checking`;
		payStatus.textContent = "… Forbinder til BTCPay…";

		try {
			const res = await fetch("/.netlify/functions/create-nip05-invoice", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: confirmedName, pubkey }),
			});
			const data = await res.json();
			if (data.checkoutLink) {
				window.umami?.track("nip05-invoice-created");
				window.location.href = data.checkoutLink;
			} else {
				throw new Error("Intet checkout link");
			}
		} catch {
			window.umami?.track("nip05-invoice-failed");
			payStatus.className = `${statusClass} error`;
			payStatus.textContent = "! Noget gik galt — prøv igen";
			payBtn.disabled = false;
			payBtn.textContent = "Gå til betaling ⚡";
		}
	});
}

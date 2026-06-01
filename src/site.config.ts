/**
 * Site-wide config (analytics ID, support strings). Prefer PUBLIC_* env in production if set.
 */
export const UMAMI_WEBSITE_ID =
	(typeof import.meta.env.PUBLIC_UMAMI_WEBSITE_ID === "string" &&
		import.meta.env.PUBLIC_UMAMI_WEBSITE_ID) ||
	"89c926b5-94d8-4071-b620-7dc78ce48292";

/** LNURL vist på forsiden (støtte / QR-kopi) */
export const SUPPORT_LNURL =
	"LNURL1DP68GURN8GHJ7MRWVF5HGUEWD9JX2CTNV9EX2MRFDDJKVMRPD4JHXTN0WFNJ7MRWW4EXCUP0FFKKXCJPV5DUXATV";

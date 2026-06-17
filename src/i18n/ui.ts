/**
 * UI strings for shared chrome (header, footer, layout, blog post).
 * Page-body prose is translated per page; this covers only the reusable shell.
 *
 * The Danish values MUST stay byte-for-byte identical to the original hardcoded
 * markup so existing Danish output never changes. English values are used only
 * when the active language (derived from the URL) is `en`.
 */

import type { Lang } from './routes';

export const ui = {
	da: {
		header: {
			logoAlt: 'Nostr Logo',
			toHome: 'Gå til forsiden',
			openMenu: 'Åbn menu',
			home: 'Hjem',
			clients: 'Klienter',
			resources: 'Ressourcer',
			nostrAddress: 'Nostr Adresse',
			apps: 'Apps & Tjenester',
			podcasts: 'Podcasts',
			about: 'Om',
			support: 'Support',
		},
		footer: {
			menuHeading: 'Menu',
			home: 'Hjem',
			clients: 'Nostr Klienter',
			nostrAddress: 'Nostr Adresse',
			resources: 'Ressourcer',
			about: 'Om Nostr.dk',
			support: 'Support',
			pagesHeading: 'Sider',
			blog: 'Blog',
			profiles: 'Profiler',
			nip05: 'NIP-05',
			podcasts: 'Podcasts',
			apps: 'Apps & Tjenester',
			contactHeading: 'Kontakt & Fællesskab',
			nostrTitle: 'Nostr.dk på Nostr',
			telegramTitle: 'Telegram gruppe',
			githubTitle: 'GitHub',
			bitcoinHeading: 'Bitcoin',
			blockHeight: 'Blokhøjde:',
			loading: 'Indlæser...',
			learnBitcoin: 'Lær om Bitcoin 🧡',
			tagline: 'Tag del i fremtidens decentraliserede internet | Open Source Alt',
			privacy: 'Privatlivspolitik',
			backToTop: 'Tilbage til toppen',
		},
		blog: {
			updated: 'Opdateret',
		},
		switcher: {
			toEnLabel: 'EN',
			toEnTitle: 'In English',
			toDaLabel: 'DA',
			toDaTitle: 'På dansk',
		},
		jsonLdDescription:
			'Dansk ressource om Nostr-protokollen – den censurresistente, decentraliserede protokol for sociale medier og meget mere.',
	},
	en: {
		header: {
			logoAlt: 'Nostr Logo',
			toHome: 'Go to the homepage',
			openMenu: 'Open menu',
			home: 'Home',
			clients: 'Clients',
			resources: 'Resources',
			nostrAddress: 'Nostr Address',
			apps: 'Apps & Services',
			podcasts: 'Podcasts',
			about: 'About',
			support: 'Support',
		},
		footer: {
			menuHeading: 'Menu',
			home: 'Home',
			clients: 'Nostr Clients',
			nostrAddress: 'Nostr Address',
			resources: 'Resources',
			about: 'About Nostr.dk',
			support: 'Support',
			pagesHeading: 'Pages',
			blog: 'Blog',
			profiles: 'Profiles',
			nip05: 'NIP-05',
			podcasts: 'Podcasts',
			apps: 'Apps & Services',
			contactHeading: 'Contact & Community',
			nostrTitle: 'Nostr.dk on Nostr',
			telegramTitle: 'Telegram group',
			githubTitle: 'GitHub',
			bitcoinHeading: 'Bitcoin',
			blockHeight: 'Block height:',
			loading: 'Loading...',
			learnBitcoin: 'Learn about Bitcoin 🧡',
			tagline: 'Join the decentralized internet of the future | Open Source Everything',
			privacy: 'Privacy Policy',
			backToTop: 'Back to top',
		},
		blog: {
			updated: 'Updated',
		},
		switcher: {
			toEnLabel: 'EN',
			toEnTitle: 'In English',
			toDaLabel: 'DA',
			toDaTitle: 'På dansk',
		},
		jsonLdDescription:
			'English resource about the Nostr protocol – the censorship-resistant, decentralized protocol for social media and much more.',
	},
} as const;

export function t(lang: Lang) {
	return ui[lang];
}

export {};

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
    nostr?: {
      getPublicKey?: () => Promise<string>;
      signEvent?: (event: Record<string, unknown>) => Promise<any>;
    };
  }
}


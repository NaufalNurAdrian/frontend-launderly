export {};

declare global {
  interface Window {
    google?: typeof google; // Jika menggunakan Google Maps API, bisa gunakan tipe ini
    snap: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: Record<string, unknown>) => void;
          onPending?: (result: Record<string, unknown>) => void;
          onError?: (error: Error) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

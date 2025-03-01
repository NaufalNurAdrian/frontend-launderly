export {};

declare global {
  interface Window {
    google: any;
    snap: {
      pay: (token: string, options?: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (error: any) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

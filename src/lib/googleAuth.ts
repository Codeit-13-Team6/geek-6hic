//내부에서 쓰는 타입은 별도 공용 타입과 분리
type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleTokenClient = {
  requestAccessToken: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void | Promise<void>;
          }) => GoogleTokenClient;
        };
      };
    };
  }
}

export async function requestGoogleAccessToken(
  clientId: string,
): Promise<string> {
  if (!window.google?.accounts?.oauth2) {
    throw new Error("google_sdk_not_ready");
  }

  return new Promise<string>((resolve, reject) => {
    const client = window.google?.accounts?.oauth2?.initTokenClient({
      client_id: clientId,
      scope: "email profile",
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error ?? "google_token_missing"));
          return;
        }

        resolve(response.access_token);
      },
    });

    if (!client) {
      reject(new Error("google_sdk_not_ready"));
      return;
    }

    client.requestAccessToken();
  });
}

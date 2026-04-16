import "axios";
import type { TokenPair } from "@/lib/auth/serverFetcher";

declare module "axios" {
  interface InternalAxiosRequestConfig<D = any> {
    _refreshedTokens?: TokenPair;
    _authSyncRequired?: boolean;
  }

  interface AxiosResponse<T = any, D = any> {
    _refreshedTokens?: TokenPair;
    _authSyncRequired?: boolean;
  }
}

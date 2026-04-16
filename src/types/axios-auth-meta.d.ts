import "axios";
import type { TokenPair } from "@/lib/auth/fetcher.server";

declare module "axios" {
  interface InternalAxiosRequestConfig<D = any> {
    _refreshedTokens?: TokenPair;
    _deferredCookieCommit?: boolean;
  }

  interface AxiosResponse<T = any, D = any> {
    _refreshedTokens?: TokenPair;
    _deferredCookieCommit?: boolean;
  }
}

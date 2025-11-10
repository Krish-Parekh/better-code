"use client";

interface IFetcherParams {
  url: string;
  init: RequestInit;
  error: string;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

function triggerLogout(): void {
  window.dispatchEvent(new CustomEvent("auth:logout"));
}

async function refreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_SERVER_URL as string;
      const response = await fetch(`${baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        triggerLogout();
        return false;
      }

      return true;
    } catch (error) {
      triggerLogout();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function fetcher({ url, init, error }: IFetcherParams) {
  try {
    const response = await fetch(url, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    let json;
    try {
      json = await response.json();
    } catch (error) {
      json = {};
    }

    if (response.status === 401) {
      const refreshed = await refreshToken();

      if (refreshed) {
        const retryResponse = await fetch(url, {
          ...init,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...init.headers,
          },
        });

        let retryJson;
        try {
          retryJson = await retryResponse.json();
        } catch (err) {
          retryJson = {};
        }

        if (retryResponse.ok) {
          return retryJson;
        }

        if (retryResponse.status === 401) {
          triggerLogout();
          throw new Error("Session expired. Please login again.");
        }
      } else {
        throw new Error("Session expired. Please login again.");
      }
    }

    if (response.ok) {
      return json;
    }

    throw new Error(
      (json as { error?: string; message?: string }).error ||
        (json as { message?: string }).message ||
        Object.values(json).join(", ") ||
        error,
    );
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error(error as string);
    }
  }
}

export function getFetcher(baseURL: string) {
  return (key: string) =>
    fetcher({
      url: baseURL + key,
      init: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      error: "An error occurred while getting the data.",
    });
}

export function postJsonFetcher(baseURL: string) {
  return <ExtraArgs>(key: string, options?: Readonly<{ arg: ExtraArgs }>) => {
    return fetcher({
      url: baseURL + key,
      init: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options?.arg) as BodyInit,
      },
      error: "An error occurred while posting the data",
    });
  };
}

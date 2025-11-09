"use client";

interface IFetcherParams {
  url: string;
  init: RequestInit;
  error: string;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Refresh the access token using the refresh token cookie
 */
async function refreshToken(): Promise<boolean> {
  // If already refreshing, return the existing promise
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
        credentials: "include", // Include cookies for refresh token
      });

      if (!response.ok) {
        // Refresh failed - trigger logout
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // Trigger logout on error
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
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
    // Ensure credentials are included to send cookies
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

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401) {
      const refreshed = await refreshToken();
      
      if (refreshed) {
        // Retry the original request after successful refresh
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

        // If still 401 after refresh, logout
        if (retryResponse.status === 401) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("auth:logout"));
          }
          throw new Error("Session expired. Please login again.");
        }

        throw new Error(
          (retryJson as { error?: string; message?: string }).error ||
            (retryJson as { message?: string }).message ||
            error,
        );
      } else {
        // Refresh failed - logout already triggered in refreshToken
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

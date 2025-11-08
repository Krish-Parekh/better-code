"use client";

interface IFetcherParams {
  url: string;
  init: RequestInit;
  error: string;
}

async function fetcher({ url, init, error }: IFetcherParams) {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...init.headers,
      },
    });

    let json;
    try {
      json = await response.json();
    } catch (error) {
      json = {};
    }

    if (response.ok) {
      return json;
    }

    throw new Error(json.error || Object.values(json).join(", "));
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error(error as string);
    }
  }
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

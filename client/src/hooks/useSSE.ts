"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { mutate } from "swr";

// EventSource readyState constants
const CONNECTING = 0;
const OPEN = 1;
const CLOSED = 2;

export interface SSEOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  enabled?: boolean;
  withCredentials?: boolean;
  // SWR integration: mutate related cache keys when SSE data arrives
  mutateKeys?: string[];
}

export interface SSEResponse<T = any> {
  data: T | null;
  error: Event | Error | null;
  isLoading: boolean;
  isConnecting: boolean;
  isOpen: boolean;
  isClosed: boolean;
  close: () => void;
}

/**
 * Hook to listen to Server-Sent Events (SSE) with SWR-like API
 * 
 * @param url - SSE endpoint URL (null to disable)
 * @param options - Configuration options
 * @returns SWR-like response object with data, error, loading states
 * 
 * @example
 * ```tsx
 * const { data, error, isLoading } = useSSE(`/submissions/${jobId}/status`, {
 *   mutateKeys: ['/submissions'], // Optional: update SWR cache
 *   onMessage: (data) => console.log('Received:', data),
 * });
 * ```
 */
export function useSSE<T = any>(
  url: string | null,
  options: SSEOptions = {},
): SSEResponse<T> {
  const {
    onMessage,
    onError,
    onOpen,
    enabled = true,
    withCredentials = true,
    mutateKeys = [],
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Event | Error | null>(null);
  const [readyState, setReadyState] = useState<number>(CONNECTING);

  const eventSourceRef = useRef<EventSource | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  
  // Store callbacks in refs to prevent reconnections
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onOpenRef = useRef(onOpen);
  const mutateKeysRef = useRef(mutateKeys);

  // Update refs when callbacks change (without triggering reconnection)
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onOpenRef.current = onOpen;
    mutateKeysRef.current = mutateKeys;
  }, [onMessage, onError, onOpen, mutateKeys]);

  useEffect(() => {
    // Check if EventSource is available (browser environment)
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    if (!url || !enabled) {
      // Close connection if URL becomes null or disabled
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        currentUrlRef.current = null;
        setReadyState(CLOSED);
      }
      return;
    }

    // Only reconnect if URL actually changed
    if (currentUrlRef.current === url && eventSourceRef.current) {
      return;
    }

    // Close existing connection if URL changed
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Create new EventSource connection
    const fullUrl = url.startsWith("http")
      ? url
      : `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`;

    const eventSource = new EventSource(fullUrl, {
      withCredentials,
    });

    eventSourceRef.current = eventSource;
    currentUrlRef.current = url;

    // Update ready state when connection opens
    eventSource.onopen = () => {
      setReadyState(OPEN);
      setError(null);
      onOpenRef.current?.();
    };

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data) as T;
        setData(parsedData);
        setError(null);

        // Call custom onMessage handler using ref
        onMessageRef.current?.(parsedData);

        // Mutate SWR cache keys if provided
        if (mutateKeysRef.current.length > 0) {
          mutateKeysRef.current.forEach((key) => {
            mutate(key, parsedData, false);
          });
        }
      } catch (err) {
        console.error("Failed to parse EventSource message:", err);
        const parseError = err instanceof Error ? err : new Error("Failed to parse SSE message");
        setError(parseError);
        onErrorRef.current?.(event);
      }
    };

    // Handle errors
    eventSource.onerror = (event) => {
      setReadyState(CLOSED);
      setError(event);
      onErrorRef.current?.(event);
    };

    // Cleanup on unmount or when url/enabled changes
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        currentUrlRef.current = null;
      }
    };
  }, [url, enabled, withCredentials]);

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setReadyState(CLOSED);
      setData(null);
      setError(null);
    }
  }, []);

  return {
    data,
    error,
    isLoading: readyState === CONNECTING,
    isConnecting: readyState === CONNECTING,
    isOpen: readyState === OPEN,
    isClosed: readyState === CLOSED,
    close,
  };
}


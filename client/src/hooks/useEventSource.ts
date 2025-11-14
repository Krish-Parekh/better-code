"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// EventSource readyState constants
const CONNECTING = 0;
const OPEN = 1;
const CLOSED = 2;

export interface EventSourceOptions {
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onOpen?: (event: Event) => void;
  enabled?: boolean;
  withCredentials?: boolean;
}

export interface EventSourceState {
  data: any | null;
  error: Event | null;
  readyState: number; // 0: CONNECTING, 1: OPEN, 2: CLOSED
}

export function useEventSource(
  url: string | null,
  options: EventSourceOptions = {}
) {
  const {
    onMessage,
    onError,
    onOpen,
    enabled = true,
    withCredentials = true,
  } = options;

  const [state, setState] = useState<EventSourceState>({
    data: null,
    error: null,
    readyState: CONNECTING,
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Check if EventSource is available (browser environment)
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    if (!url || !enabled) {
      return;
    }

    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Create new EventSource connection
    const eventSource = new EventSource(url, {
      withCredentials,
    });

    eventSourceRef.current = eventSource;

    // Update ready state when connection opens
    eventSource.onopen = (event) => {
      setState((prev) => ({
        ...prev,
        readyState: OPEN,
        error: null,
      }));
      onOpen?.(event);
    };

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState((prev) => ({
          ...prev,
          data,
          error: null,
        }));
        onMessage?.(event);
      } catch (error) {
        console.error("Failed to parse EventSource message:", error);
        setState((prev) => ({
          ...prev,
          error: event,
        }));
      }
    };

    // Handle errors
    eventSource.onerror = (event) => {
      setState((prev) => ({
        ...prev,
        readyState: CLOSED,
        error: event,
      }));
      onError?.(event);
    };

    // Cleanup on unmount or when url/enabled changes
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [url, enabled, withCredentials, onMessage, onError, onOpen]);

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setState({
        data: null,
        error: null,
        readyState: CLOSED,
      });
    }
  }, []);

  return {
    ...state,
    close,
    isConnecting: state.readyState === CONNECTING,
    isOpen: state.readyState === OPEN,
    isClosed: state.readyState === CLOSED,
  };
}


"use client";
import { useEffect } from "react";
import { useEventContext } from "./EventContext";

const useEventSubscription = (
  eventType: string,
  eventHandler: (eventId: string) => void
) => {
  const { subscribe, unsubscribe } = useEventContext();

  useEffect(() => {
    subscribe(eventType, eventHandler);

    return () => {
      unsubscribe(eventType, eventHandler);
    };
  }, [eventType, eventHandler, subscribe, unsubscribe]);
};

export { useEventSubscription };

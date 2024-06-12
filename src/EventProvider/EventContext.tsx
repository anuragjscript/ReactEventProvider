import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type EventLogItem = {
  eventId: string;
  type: string;
  consumed: boolean;
  data: any;
};

interface EventContextType {
  eventLog: EventLogItem[];
  logEvent: (eventId: string, type: string, data: any) => void;
  markEventConsumed: (eventId: string) => void;
  subscribe: (type: string, callback: (eventId: string) => void) => void;
  unsubscribe: (type: string, callback: (eventId: string) => void) => void;
  getEventData: (eventId: string) => EventLogItem | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
  maxSize?: number;
}

export const EventProvider = ({
  children,
  maxSize = 100,
}: EventProviderProps) => {
  const [eventLog, setEventLog] = useState<EventLogItem[]>([]);
  const [subscribers, setSubscribers] = useState<{
    [key: string]: ((eventId: string) => void)[];
  }>({});

  const logEvent = (eventId: string, type: string, data: any) => {
    const newEvent: EventLogItem = {
      eventId,
      type,
      data,
      consumed: type === "consume",
    };

    setEventLog((prevLog) => {
      const newLog = [...prevLog, newEvent];

      // Remove consumed events
      const filteredLog = newLog.filter((item) => !item.consumed);

      // Remove the oldest items if the log size exceeds the maxSize
      if (filteredLog.length > maxSize) {
        return filteredLog.slice(filteredLog.length - maxSize);
      }

      return filteredLog;
    });

    // Notify subscribers
    if (subscribers[type]) {
      subscribers[type].forEach((callback) => callback(newEvent.eventId));
    }
  };

  const markEventConsumed = useCallback((eventId: string) => {
    setEventLog((prevLog) => {
      const updatedLog = prevLog.filter((item) => item.eventId !== eventId);
      return updatedLog;
    });
  }, []);

  const getEventData = useCallback(
    (eventId: string): EventLogItem | undefined => {
      return eventLog.find((event) => event.eventId === eventId);
    },
    [eventLog]
  );

  const subscribe = useCallback(
    (type: string, callback: (eventId: string) => void) => {
      setSubscribers((prevSubscribers) => ({
        ...prevSubscribers,
        [type]: [...(prevSubscribers[type] || []), callback],
      }));
    },
    []
  );

  const unsubscribe = useCallback(
    (type: string, callback: (eventId: string) => void) => {
      setSubscribers((prevSubscribers) => ({
        ...prevSubscribers,
        [type]: (prevSubscribers[type] || []).filter((cb) => cb !== callback),
      }));
    },
    []
  );

  return (
    <EventContext.Provider
      value={{
        eventLog,
        logEvent,
        markEventConsumed,
        subscribe,
        unsubscribe,
        getEventData,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

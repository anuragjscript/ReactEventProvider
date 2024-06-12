import React, { useCallback } from "react";
import { useEventContext, useEventSubscription } from "./EventProvider";

function App() {
  const { logEvent, eventLog, getEventData, markEventConsumed } =
    useEventContext();

  const handleClick1 = () => {
    const data = {
      id: 11,
      title: "Project 11",
      content: "This is the content of project 11",
    };

    logEvent("project-11", "add", data);
  };

  const handleClick2 = () => {
    const data = {
      id: 12,
      title: "Project 12",
      content: "This is the content of project 12",
    };

    logEvent("project-12", "edit", data);
  };

  const handleClick3 = () => {
    const data = {
      id: 13,
      title: "Project 13",
      content: "This is the content of project 13",
    };

    logEvent("project-13", "delete", data);
  };

  const markConsumed = (eventId: string) => {
    const data = getEventData(eventId);
    console.log("Fetched Data:", data, " for eventId: ", eventId);
    logEvent(`rm-${eventId}`, "consume", null);
    markEventConsumed(eventId);
  };

  const consumedTask = useCallback((eventId: string) => {
    console.log("Handling event type Remove: ", eventId);
    // Perform the task for event type 1
    sendEmail("data consumed", "sqs@aws.com");
  }, []);

  const sendEmail = (data: any, to: string) => {
    console.log("Sending email to: ", to, " with data: ", data);
  };

  const handleEventAdd = useCallback((eventId: string) => {
    console.log("Add Event received: ", eventId);
  }, []);
  const handleEventEdit = useCallback((eventId: string) => {
    console.log("Edit Event received: ", eventId);
  }, []);
  const handleEventDelete = useCallback((eventId: string) => {
    console.log("Delete Event received: ", eventId);
  }, []);

  useEventSubscription("add", handleEventAdd);
  useEventSubscription("edit", handleEventEdit);
  useEventSubscription("delete", handleEventDelete);
  useEventSubscription("consume", consumedTask);

  return (
    <div className="App">
      <header className="App-header">Testing</header>
      <button
        onClick={handleClick1}
        className="px-4 py-2 bg-red-300 text-white rounded-md"
      >
        Click1
      </button>
      <button
        onClick={handleClick2}
        className="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Click2
      </button>
      <button
        onClick={handleClick3}
        className="px-4 py-2 bg-red-700 text-white rounded-md"
      >
        Click3
      </button>
      <button
        onClick={() => console.log(JSON.stringify(eventLog))}
        className="px-4 py-2 bg-yellow-500 text-white rounded-md"
      >
        Show Events Queue
      </button>
      <button
        onClick={() => markConsumed("project-11")}
        className="px-4 py-2 bg-cyan-500 text-white rounded-md"
      >
        Consume Event 11
      </button>
      <button
        onClick={() => markConsumed("project-12")}
        className="px-4 py-2 bg-cyan-700 text-white rounded-md"
      >
        Consume Event 12
      </button>
      <button
        onClick={() => markConsumed("project-13")}
        className="px-4 py-2 bg-cyan-900 text-white rounded-md"
      >
        Consume Event 13
      </button>
    </div>
  );
}

export default App;

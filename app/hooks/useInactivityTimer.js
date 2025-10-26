"use client";

import { useState, useEffect, useRef } from "react";

export function useInactivityTimer(timeoutDuration) {
  const [isInactive, setIsInactive] = useState(false);
  const timerRef = useRef(null);

  //A useEffect that sets up a redirect-on-click logic after a user becomes inactive
  useEffect(() => {
    //Only run is user has been marked as inactive
    if (!isInactive) return;

    //A function that runs on the next click, intercept it and redirect to login
    const handleInactiveClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "/login";
    };

    //Add a global click listener (in the capture phase) to intercept the click before it does anything else
    document.addEventListener("click", handleInactiveClick, true);

    //Cleanup to remove the event listener
    return () => {
      document.removeEventListener("click", handleInactiveClick, true);
    };
  }, [isInactive]);

  //A useEffect to manage the timer itself
  useEffect(() => {
    //Function to reset the timer
    const resetTimer = () => {
      //Clear the previous timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      //Set a new timer (Wait for timer to end and auto-logout)
      timerRef.current = setTimeout(async () => {
        //Timer fired
        try {
          //Call server's logout api to clear cookie from the browser
          const response = await fetch("/api/logout", {
            method: "POST",
          });
          if (response.ok) {
            setIsInactive(true);
          } else {
            //If logout fails - log it but user will still be logged in
            console.error("Failed to auto-logout on inactivity");
          }
        } catch (error) {
          console.error("Error during auto-logout:", error);
        }
      }, timeoutDuration);
    };

    //List of events that count as "activity"
    const events = ["mousemove", "keydown", "click", "scroll"];

    //Event Handler
    const handleActivity = () => {
      if (isInactive) return; //Do not reset timer if user is already marked as inactive
      resetTimer();
    };

    //set initial timer when hook mounts
    resetTimer();

    //Add the event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    //Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isInactive, timeoutDuration]); //Re run if isInactive changes
}

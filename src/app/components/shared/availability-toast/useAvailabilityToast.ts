// availability-toast/useAvailabilityToast.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { AVAILABILITY_MESSAGES, NAMES } from "./availabilityData";

function getRandomItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDelay() {
  // 3s – 5s
  return Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000;
}

export function useAvailabilityToast() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const showRef = useRef<NodeJS.Timeout | null>(null);
  const hideRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function schedule() {
      showRef.current = setTimeout(() => {
        if (document.visibilityState !== "visible") {
          schedule();
          return;
        }

        const randomName = getRandomItem(NAMES);
        const template = getRandomItem(AVAILABILITY_MESSAGES);

        setName(randomName);
        setMessage(template.replace("{name}", randomName));
        setVisible(true);

        hideRef.current = setTimeout(() => {
          setVisible(false);
          schedule();
        }, 5000);
      }, getRandomDelay());
    }

    schedule();

    return () => {
      if (showRef.current) clearTimeout(showRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, []);

  return { visible, name, message };
}

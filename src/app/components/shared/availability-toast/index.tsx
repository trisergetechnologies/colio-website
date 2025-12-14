"use client";

import AvailabilityToast from "./AvailabilityToast";
import { useAvailabilityToast } from "./useAvailabilityToast";

export default function AvailabilityToastContainer() {
  const { visible, name, message } = useAvailabilityToast();

  return <AvailabilityToast
  visible={visible}
  name={name}
  message={message}
/>;
}

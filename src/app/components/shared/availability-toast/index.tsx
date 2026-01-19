"use client";

import { useRouter } from "next/navigation";
import AvailabilityToast from "./AvailabilityToast";
import { useAvailabilityToast } from "./useAvailabilityToast";

export default function AvailabilityToastContainer() {
  const { visible, name, message } = useAvailabilityToast();
  const router = useRouter();

  return (
    <div onClick={()=> router.push('/experts')}>
      <AvailabilityToast visible={visible} name={name} message={message} />
    </div>
  )
}
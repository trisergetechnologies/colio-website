"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, []);
  return (
    <div>
      <h1>Redirecting . . .</h1>
    </div>
  );
};

export default page;

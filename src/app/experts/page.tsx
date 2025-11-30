import { Metadata } from "next";
import ExpertsPageClient from "./expert-client";


export const metadata: Metadata = {
  title: "Experts",
};

export default function Experts() {
  return <ExpertsPageClient/>;
}

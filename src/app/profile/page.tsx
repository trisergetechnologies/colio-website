import { Metadata } from "next";
import ProfilePageClient from "./page-client";


export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return <ProfilePageClient/>;
}

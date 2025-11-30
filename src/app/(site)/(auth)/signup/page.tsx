import Header from "@/app/components/layout/header";
import SignupPageClient from "./SignupPageClient";
import Footer from "@/app/components/layout/footer";

export const metadata = {
  title: "Sign Up | Colio",
};

export default function Page() {
  return (
    <div>
      <Header/>
      <SignupPageClient />
      <Footer/>
    </div>
  );
}
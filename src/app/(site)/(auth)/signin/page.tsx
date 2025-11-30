import Header from "@/app/components/layout/header";
import SigninPageClient from "./SigninPageClient";
import Footer from "@/app/components/layout/footer";

export const metadata = {
  title: "Sign In | Colio",
};

export default function Page() {
  return (
  <div>
    <Header/>
    <SigninPageClient />
    <Footer/>
  </div>
  );
}
import { Metadata } from "next";
import ComingSoonPage from "./ComingSoonPage";
import ContactForm from "./components/ContactForm";
import Faq from "./components/home/faq";
import Features from "./components/home/features";
import Banner from "./components/home/hero";
import AppDownloadSection from "./components/home/mobile-app";
import Simple from "./components/home/simple";
import Work from "./components/home/work";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import TopIndividuals from "./components/home/TopIndividuals";
import AvailabilityToast from "./components/shared/availability-toast";
import WelcomeModalClient from "./components/modals/WelcomeModalClient";
import BestMatchModalClient from "./components/modals/BestMatchModalClient";
import SignInModalClient from "./components/signinModel/SignInModalClient";
import HeroGrid from "./components/home/HeroGrid/HeroGrid";
import { getToken } from "@/lib/utils/tokenHelper";
import HeroGridPageClient from "./page-client";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Colio",
};

const comingSoon = false;



export default async function Home() {

  const getServerToken = async ()=> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value ?? null;
};

  const isAuthenticated = async()=>{
    const token = await getServerToken();
    console.log("token", token);
    if(token) return true
    return false
  }

  const checked = await isAuthenticated();
  console.log("isAuthenticated: ",checked);

  if(comingSoon){
  return(
    <ComingSoonPage/>
  )
}

  return (
    <main>
      <Header />
      {/* <HeroGridPageClient/> */}
      <AvailabilityToast />
      <Banner/>
      <TopIndividuals />
      {/* <Work /> */}
      {/* <Features /> */}
      <Simple />
      <Faq />
      {/* <AppDownloadSection/> */}
      <ContactForm />
      <Footer />
       {!checked && <WelcomeModalClient />}
       <BestMatchModalClient />
       <SignInModalClient/> 
    </main>
  );
}

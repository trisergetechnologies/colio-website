import { Metadata } from "next";
import Banner from "./components/home/hero";
import Work from "./components/home/work";
import Features from "./components/home/features";
import Simple from "./components/home/simple";
import Faq from "./components/home/faq";
import ContactForm from "./components/ContactForm";
import AppDownloadSection from "./components/home/mobile-app";
import ComingSoonPage from "./ComingSoonPage";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

export const metadata: Metadata = {
  title: "Colio",
};

const comingSoon = false;



export default function Home() {

  if(comingSoon){
  return(
    <ComingSoonPage/>
  )
}

  return (
    <main>
      {/* <MaintenancePage/> */}
      <Header />
      <Banner/>
      <Work />
      <Features />
      <Simple />
      <Faq />
      <AppDownloadSection/>
      <ContactForm />
      <Footer />
    </main>
  );
}

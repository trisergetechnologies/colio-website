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
      <Header />
      <Banner/>
      <TopIndividuals />
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

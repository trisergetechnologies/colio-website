import { Metadata } from "next";
import ComingSoonPage from "../ComingSoonPage";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import Banner from "./components/banner";
import ProfessionalList from "./components/ProfessionalList"



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
      <Banner />
      <ProfessionalList />
      <Footer />
    </main>
  );
}

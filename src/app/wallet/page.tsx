import { Metadata } from "next";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import WalletPageClient from "./wallet-client";


export const metadata: Metadata = {
  title: "Wallet",
};

export default function Wallet() {

  return (
    <WalletPageClient/>
  );
}

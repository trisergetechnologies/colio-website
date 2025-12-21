import { FaqType } from "@/app/types/faq";
import { FeatureType } from "@/app/types/features";
import { FooterType } from "@/app/types/footerlink";
import { HeaderItem } from "@/app/types/menu";
import { SocialType } from "@/app/types/sociallink";
import { WorkType } from "@/app/types/work";

export const Headerdata: HeaderItem[] = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/#howitworks-section" },
  { label: "Features", href: "/#features-section" },
  // { label: "FAQ", href: "/#faq-section" },
  // { label: "Contact Us", href: "/#contact" },
  // { label: "Pricing", href: "/#pricing-section" },
];

// const basePath = process.env.NODE_ENV === "production" ? "/crypto-nextjs" : "";
const basePath = "";

// ✅ Company Logos
export const Companiesdata: { imgSrc: string }[] = [
  { imgSrc: `${basePath}/images/companies/birdseye.svg` },
  { imgSrc: `${basePath}/images/companies/break.svg` },
  { imgSrc: `${basePath}/images/companies/keddar.svg` },
  { imgSrc: `${basePath}/images/companies/shield.svg` },
  { imgSrc: `${basePath}/images/companies/tandov.svg` },
  { imgSrc: `${basePath}/images/companies/tree.svg` },
];

// ✅ Work Steps
export const workdata: WorkType[] = [
  {
    imgSrc: `${basePath}/images/work/icon-one.svg`, // 🪪 Profile Icon
    heading: "Create Your Profile",
    subheading:
      "Sign up in seconds and tell us what you’re looking for. Whether it’s friendship, connection, or something deeper — Colio helps you find your people.",
  },
  {
    imgSrc: `${basePath}/images/work/icon-two.svg`, // 🔍 Browse Icon
    heading: "Browse & Match",
    subheading:
      "Explore genuine profiles with similar interests. Our smart matching brings you closer to people who truly align with your vibe.",
  },
  {
    imgSrc: `${basePath}/images/features/featureOne.svg`, // 🎥 Call Icon
    heading: "Connect & Talk",
    subheading:
      "Start real conversations via secure video or voice calls. Pay only for the moments that matter — authentic, meaningful, and in real time.",
  },
];

// ✅ App Features
export const Featuresdata: FeatureType[] = [
  {
    imgSrc: `${basePath}/images/features/featureOne.svg`, // 🔒 Lock Icon
    heading: "Secure & Private",
    subheading:
      "Your conversations are protected by end-to-end encryption. Every call is safe, private, and free from prying eyes — your peace of mind, guaranteed.",
  },
  {
    imgSrc: `${basePath}/images/features/featureTwo.svg`, // 💰 Wallet Icon
    heading: "Pay Per Minute",
    subheading:
      "No plans, no subscriptions — just freedom. Pay only for the time you spend talking, with full transparency and control over your wallet.",
  },
  {
    imgSrc: `${basePath}/images/features/featureThree.svg`, // ⚡ Live Icon
    heading: "Real-Time Connections",
    subheading:
      "See who’s online right now and start connecting instantly. No waiting, no scheduling — just authentic, spontaneous conversations.",
  },
];

// ✅ FAQs
export const Faqdata: FaqType[] = [
  {
    heading: "1. How does Colio work?",
    subheading:
      "Colio helps you connect with real people through secure video and voice calls. Create your profile, browse users, and start a chat instantly. You’re charged only for the minutes you talk — no hidden costs.",
  },
  {
    heading: "2. Is Colio safe and secure?",
    subheading:
      "Absolutely. All calls are end-to-end encrypted, and our moderation system ensures a safe, respectful space. You can block or report users instantly, and your payment data is fully protected.",
  },
  {
    heading: "3. How much does it cost to use Colio?",
    subheading:
      "Colio has no monthly fees. You simply add funds to your wallet and pay per minute during calls. Rates are visible upfront, so you always know exactly what you’ll spend.",
  },
];

// ✅ Social Media Links
export const Sociallinkdata: SocialType[] = [
  {
    imgsrc: `${basePath}/images/footer/insta.svg`,
    href: "https://instagram.com/",
  },
  {
    imgsrc: `${basePath}/images/footer/dribble.svg`,
    href: "https://dribbble.com/",
  },
  {
    imgsrc: `${basePath}/images/footer/twitter.svg`,
    href: "https://twitter.com/",
  },
  {
    imgsrc: `${basePath}/images/footer/youtube.svg`,
    href: "https://youtube.com/",
  },
];

// ✅ Footer Navigation Links
export const Footerlinkdata: FooterType[] = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/#howitworks-section" },
  { label: "Features", href: "/#features-section" },
  { label: "FAQ", href: "/#faq-section" },
  { label: "Contact Us", href: "/#contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

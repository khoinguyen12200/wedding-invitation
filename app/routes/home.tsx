import { useLocation } from "react-router";
import { Hero } from "../sections/Hero/Hero";
import { Countdown } from "../sections/Countdown/Countdown";
import { Moments } from "../sections/Moments/Moments";
import { Families } from "../sections/Families/Families";
import { Events } from "../sections/Events/Events";
import { ThankYou } from "../sections/ThankYou/ThankYou";
import { IntroOverlay } from "../sections/IntroOverlay/IntroOverlay";
import { SmoothScroll } from "../components/SmoothScroll";
import { resolveSide } from "../content/sides";

export function meta() {
  return [
    { title: "Gia Khôi & Huyền Trân — 02.08.2026" },
    {
      name: "description",
      content:
        "Trân trọng kính mời quý quan khách đến chung vui ngày trọng đại của Gia Khôi & Huyền Trân.",
    },
  ];
}

export default function Home() {
  const { pathname } = useLocation();
  const side = resolveSide(pathname);

  return (
    <>
      <SmoothScroll />
      <IntroOverlay />
      <main>
        <Hero side={side} />
        <Countdown side={side} />
        <Moments />
        <Families />
        <Events side={side} />
        <ThankYou />
      </main>
    </>
  );
}

import { useLocation } from "react-router";
import { Hero } from "../sections/Hero/Hero";
import { Countdown } from "../sections/Countdown/Countdown";
import { Moments } from "../sections/Moments/Moments";
import { Families } from "../sections/Families/Families";
import { Events } from "../sections/Events/Events";
import { ThankYou } from "../sections/ThankYou/ThankYou";
import { IntroOverlay } from "../sections/IntroOverlay/IntroOverlay";
import { SmoothScroll } from "../components/SmoothScroll";
import { CursorDot } from "../components/CursorDot";
import { Marquee } from "../components/Marquee";
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
      <CursorDot />
      <main>
        <Hero side={side} />
        <Countdown side={side} />
        <Moments />
        {/* Slate-mark divider — punctuates the cinema's exit before the
            Families block lands on paper. Script Prata at hero scale, scrolls
            on the dark surface left over from the cinema. */}
        <Marquee text="Gia Khôi  &  Huyền Trân" separator="✦" durationSec={42} script />
        <Families />
        <Events side={side} />
        <ThankYou />
      </main>
    </>
  );
}

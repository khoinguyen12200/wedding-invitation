import type { Transition, Variants } from "motion/react";

export const easeExpoOut: Transition["ease"] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: easeExpoOut } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: easeExpoOut } },
};

export const maskRevealDown: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 1.4, ease: easeExpoOut },
  },
};

export const splitChar: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i: number = 0) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: easeExpoOut, delay: i * 0.04 },
  }),
};

export const splitWord: Variants = {
  hidden: { y: "110%" },
  visible: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 1.1, ease: easeExpoOut, delay: i * 0.08 },
  }),
};

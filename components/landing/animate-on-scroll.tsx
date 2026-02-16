"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Shared easing curves                                               */
/* ------------------------------------------------------------------ */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/*  AnimateOnScroll - Enhanced with variant support                    */
/* ------------------------------------------------------------------ */

const variantMap = {
  "fade-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
};

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: keyof typeof variantMap;
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  variant = "fade-up",
}: AnimateOnScrollProps) {
  const v = variantMap[variant];
  return (
    <motion.div
      initial={v.hidden}
      whileInView={v.visible}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  StaggerContainer + StaggerItem                                    */
/* ------------------------------------------------------------------ */

export function StaggerContainer({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE_OUT_EXPO },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  ParallaxSection                                                   */
/* ------------------------------------------------------------------ */

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.3,
  className,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TextReveal - word-by-word or char-by-char                         */
/* ------------------------------------------------------------------ */

interface TextRevealProps {
  text: string;
  mode?: "word" | "char";
  className?: string;
  delay?: number;
}

export function TextReveal({
  text,
  mode = "word",
  className,
  delay = 0,
}: TextRevealProps) {
  const items = mode === "word" ? text.split(" ") : text.split("");

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: mode === "word" ? 0.06 : 0.025, delayChildren: delay },
        },
      }}
      className={className}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 8, filter: "blur(3px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.4, ease: EASE_OUT_EXPO },
            },
          }}
          className="inline-block"
        >
          {item}
          {mode === "word" && "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  CountUp - Numeric animation from 0 to target                     */
/* ------------------------------------------------------------------ */

interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({
  target,
  duration = 2,
  suffix = "",
  prefix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(target);
    }
  }, [isInView, target, springValue]);

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ScrollToTop - Forces page to start at top on mount                */
/* ------------------------------------------------------------------ */

export function ScrollToTop() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);
  return null;
}

/* ------------------------------------------------------------------ */
/*  ScrollProgress - Progress bar at top of page                      */
/* ------------------------------------------------------------------ */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left"
      style={{
        scaleX,
        background: "var(--theme-color, #c21d17)",
      }}
    />
  );
}

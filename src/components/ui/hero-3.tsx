"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Props interface for the component
export interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  images: string[];
  className?: string;
  children?: React.ReactNode;
}

// Reusable Action Buttons styled with smooth animations
const PrimaryButton = ({ children, href }: { children: React.ReactNode; href?: string }) => {
  const content = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-3.5 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/30 transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 text-base"
    >
      {children}
    </motion.button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

const SecondaryButton = ({ children, href }: { children: React.ReactNode; href?: string }) => {
  const content = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-3.5 rounded-full bg-card/80 text-foreground font-semibold border border-border shadow-sm backdrop-blur-sm transition-colors hover:bg-accent focus:outline-none text-base"
    >
      {children}
    </motion.button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

// The main hero component
export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  images,
  className,
  children,
}) => {
  // Animation variants for the text content
  const FADE_IN_ANIMATION_VARIANTS: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  // Duplicate images for a seamless loop
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <section
      className={cn(
        "relative w-full min-h-[90vh] lg:min-h-screen overflow-hidden bg-background flex flex-col items-center justify-between text-center px-4 pt-12 pb-24 md:pb-32",
        className
      )}
    >
      <div className="z-10 flex flex-col items-center max-w-4xl mx-auto mt-6 md:mt-12">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-sm shadow-sm"
        >
          {tagline}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground font-serif leading-[1.1]"
        >
          {typeof title === 'string' ? (
            title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={FADE_IN_ANIMATION_VARIANTS}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN_ANIMATION_VARIANTS}
          transition={{ delay: 0.4 }}
          className="mt-6 max-w-2xl text-base sm:text-xl text-muted-foreground font-sans leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Call to Action Buttons */}
        {(ctaText || secondaryCtaText || children) && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_IN_ANIMATION_VARIANTS}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {ctaText && <PrimaryButton href={ctaLink}>{ctaText}</PrimaryButton>}
            {secondaryCtaText && <SecondaryButton href={secondaryCtaLink}>{secondaryCtaText}</SecondaryButton>}
            {children}
          </motion.div>
        )}
      </div>

      {/* Animated Image Marquee at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 md:h-2/5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <motion.div
          className="flex gap-4 md:gap-6 pt-4"
          animate={{
            x: ["0%", "-50%"],
            transition: {
              ease: "linear",
              duration: 35,
              repeat: Infinity,
            },
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-44 sm:h-56 md:h-64 flex-shrink-0"
              style={{
                rotate: `${(index % 2 === 0 ? -3 : 4)}deg`,
              }}
            >
              <img
                src={src}
                alt={`Mural image ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl shadow-xl ring-1 ring-black/10 hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

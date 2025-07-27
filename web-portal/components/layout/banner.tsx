"use client"
import { BannerType } from "@/lib/types";
import { motion } from "framer-motion";

export default function ServiceBanner({title,description}:BannerType) {
  return (
    <>
      {/* Header Section */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-bold tracking-wide text-transparent bg-gradient-to-r from-overlay-2 to-primary-foreground bg-clip-text text-center"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-muted-foreground text-lg text-center max-w-2xl"
      >
        {description}
      </motion.p>
    </>
  );
}

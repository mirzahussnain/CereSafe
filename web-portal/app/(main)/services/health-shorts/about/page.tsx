"use client";
import ServiceBanner from "@/components/layout/banner";
import { motion } from "framer-motion";

const HealthShorts = () => {
  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-36 py-24 bg-background flex flex-col  items-center">
      <ServiceBanner
        title="Watch Health Shorts at CereSafe"
        description=" Your daily dose of health wisdom! Short videos, big impact—anytime, anywhere."
      />
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="my-auto text-3xl md:text-6xl font-semibold text-secondary/60  italic tracking-wider"
      >
        Coming Soon!
      </motion.h1>
    </div>
  );
};

export default HealthShorts;

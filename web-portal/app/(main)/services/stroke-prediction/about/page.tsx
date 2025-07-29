"use client";

import ServiceBanner from "@/components/layout/banner";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function PredictStroke() {
  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-36 py-24 bg-background flex flex-col justify-center items-center">
      <ServiceBanner
        title="Predict Stroke Risk with CereSafe"
        description=" Use our AI-powered prediction tool to estimate your risk of stroke based
        on health indicators. It’s fast, free, and secure."
      />

      {/* Two Column Layout */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 w-full border-t-2 py-10">
        {/* Left Column - Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center gap-6"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground">
            What does the prediction do?
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Our machine learning model analyzes your input data to estimate the
            likelihood of a stroke. This is not a medical diagnosis, but a smart
            estimate to help you understand your risk profile.
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm md:text-base">
            <li>
              Input your health metrics (age, hypertension, glucose levels,
              etc.)
            </li>
            <li>Instant AI-based stroke risk prediction</li>
            <li>
              Private, secure & anonymous – no data stored without consent
            </li>
          </ul>
          <Link
            href="/services/stroke-prediction/"
            className="hidden mt-6 w-fit md:inline-block bg-secondary text-foreground font-medium px-6 md:px-10 py-3 rounded-xl hover:bg-primary/90 transition"
          >
            Try It Now
          </Link>
        </motion.div>

        {/* Right Column - Image/Video */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col md:flex-row justify-center items-center gap-3"
        >
          {/* Use video OR image depending on your design */}
          <div className="relative w-full h-[300px] md:h-[600px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/stroke-service.webp" // Replace with your actual image path
              alt="Stroke Prediction Illustration"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-xl object-cover"
              placeholder="blur" // ← Adds a blur effect while loading
              blurDataURL="data:image/png;base64,..."
            />

            {/* If using video instead of image: */}
            {/* 
            <video autoPlay muted loop className="w-full h-full object-cover rounded-xl">
              <source src="/ai-prediction.mp4" type="video/mp4" />
            </video> 
            */}
          </div>
          <Link
            href="/services/stroke-prediction/"
            className="inline-block mt-12 w-[300px] max-w-3xl  md:hidden bg-secondary text-center text-foreground font-medium px-6 md:px-10 py-3 rounded-lg hover:bg-primary/90 transition"
          >
            Try It Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

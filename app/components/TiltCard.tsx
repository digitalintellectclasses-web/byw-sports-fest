"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function TiltCard({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`relative w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

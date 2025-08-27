import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export default function AnimatedCard({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl shadow p-4 border"
    >
      {children}
    </motion.div>
  );
} 
"use client";
import { motion } from "framer-motion";
import { useLoadingLine } from "@/context/LoadingLineContext";

const LoadingLine = () => {
  const { isLoading } = useLoadingLine();
  return (
    <>
      {isLoading && (
        <motion.div
          className="fixed top-0 right-0 left-0 z-9999 h-[3px] bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{
            scaleX: [0, 0.3, 0.6, 0.8, 0.95],
            transition: {
              duration: 2,
              times: [0, 0.3, 0.6, 0.8, 1],
              ease: "easeOut",
            },
          }}
          exit={{
            scaleX: 1,
            transition: { duration: 0.2 },
          }}
        >
          {/* Glowing effect */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </>
  );
};

export default LoadingLine;

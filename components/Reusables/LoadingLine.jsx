import { motion } from "framer-motion";

const LoadingLine = () => {
  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-50 h-[3px] bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
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
        className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
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
  );
};

export default LoadingLine;

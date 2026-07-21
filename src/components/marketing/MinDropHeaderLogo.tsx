import { motion } from "framer-motion";

interface MinDropHeaderLogoProps {
  className?: string;
  isDarkBg?: boolean;
}

export function MinDropHeaderLogo({ className = "", isDarkBg = false }: MinDropHeaderLogoProps) {
  const textColorClass = isDarkBg ? "text-white" : "text-ink";

  return (
    <motion.div 
      animate={{ y: [0, -1.5, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className={`flex items-center justify-center select-none font-black tracking-wider cursor-default font-sans ${className}`}
    >
      <motion.span 
        animate={{ 
          scale: [1, 1.14, 1],
          color: ["#FF671F", "#EC4899", "#F59E0B", "#FF671F"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="inline-block drop-shadow-sm"
      >
        M
      </motion.span>
      <span className={`${textColorClass} inline-block`}>in</span>
      <motion.span 
        animate={{ 
          scale: [1, 1.14, 1],
          color: ["#FF671F", "#F59E0B", "#EC4899", "#FF671F"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
        className="inline-block drop-shadow-sm"
      >
        D
      </motion.span>
      <span className={`${textColorClass} inline-block`}>rop</span>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

/**
 * Wrapper que aplica a animação de entrada padrão do app
 * (fade + slide-up com spring, escalonado pelo index).
 * Usa a mesma curva dos cards de advisors.
 */
type Props = HTMLMotionProps<"div"> & {
  index?: number;
  delayBase?: number;
  delayStep?: number;
};

export function AnimatedSection({
  index = 0,
  delayBase = 0.1,
  delayStep = 0.08,
  children,
  ...rest
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: delayBase + index * delayStep,
        type: "spring",
        stiffness: 300,
        damping: 28,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

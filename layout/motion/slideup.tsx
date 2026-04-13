"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
/* * SlideUp component for motion effects.
 * @returns JSX Element
 * @param children - React nodes to be rendered inside the component
 *
 * Usage: <SlideUp>Content goes here</SlideUp>
 */
interface Props {
  children?: React.ReactNode;
  isAnimating?: boolean;
  //session?: any;
}

const SlideUp: React.FC<Props> = ({ children, isAnimating }) => {
  console.log("SlideUp component", isAnimating ? "is animating" : "not animating");
  return (
    <AnimatePresence>
        {isAnimating && (
        <motion.div
            initial={{ opacity: 0, y: 60, color: "grey" }}
            animate={  {opacity: 1, y: 0, color: "transparent" }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              ease: "easeInOut",
            }}
            exit={{ opacity: 0, y: 60, color: "grey" }}
            className="w-full h-full background-grey-500"
            key="slide-up">
        {children}
      </motion.div>
        )};
    </AnimatePresence>
  );
};
export default SlideUp;

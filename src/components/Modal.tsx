import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({
    children,
    onClose,
    formSubmitted
}: {
    children: React.ReactNode;
    onClose: () => void;
    formSubmitted: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center modal-content justify-center p-4 bg-black/60 backdrop-blur-lg"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-4xl bg-black/60 border border-[#FFFBDB]/30  max-h-[80vh] overflow-y-auto  backdrop-blur-xl rounded-2xl p-6 overflow-hidden"

            >
                {!formSubmitted && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
                {children}
            </motion.div>
        </motion.div>
    );
}
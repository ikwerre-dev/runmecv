"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Bot, Cpu } from "lucide-react";
import Modal from "@/components/Modal";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

const headlines = [
  { top: "Create Your", bottom: "Dream Resume" },
  { top: "Design Your", bottom: "Future Career" },
  { top: "Build Your", bottom: "Professional Story" },
  { top: "Craft Your", bottom: "Perfect Resume" },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let scrollAccumulator = 0;
    const scrollThreshold = 100;

    const handleWheel = (e: WheelEvent) => {
      if (!(e.target as HTMLElement).closest('.modal-content')) {
        e.preventDefault();
        if (isScrolling) return;
        
        scrollAccumulator += e.deltaY;

        if (Math.abs(scrollAccumulator) >= scrollThreshold) {
          handleScroll(scrollAccumulator > 0);
          scrollAccumulator = 0;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleScroll(e.key === 'ArrowDown');
      }
    };

    const handleScroll = (scrollDown: boolean) => {
      setIsScrolling(true);
      
      if (scrollDown) {
        setCurrentIndex(prev => (prev + 1) % headlines.length);
      } else {
        setCurrentIndex(prev => (prev - 1 + headlines.length) % headlines.length);
      }

      if (scrollTimeout) clearTimeout(scrollTimeout);
      const timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 800);
      setScrollTimeout(timeout);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isScrolling, scrollTimeout]);

  const handleFormSubmit = (data: any) => {
    setFormSubmitted(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResumeData(data);
    }, 8000);
  };

  return (
    <main className="min-h-screen flex flex-col relative bg-[#0C1713] overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0C1713] via-[#0C1713] to-[#FF66B3]/20" />

      <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF66B3]/20 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#FFFBDB]/20 rounded-full blur-xl" />

      <div className="absolute inset-0 border border-[#FF66B3]/10" />

      <div className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center space-y-8">
          <motion.div
            className="inline-flex items-center gap-2 bg-[#FF66B3]/10 px-6 py-3 rounded-full border border-[#FF66B3]/20"
            whileHover={{ scale: 1.05 }}
          >
            <Bot className="h-5 w-5 text-[#FF66B3]" />
            <span className="text-sm text-[#FF66B3]">AI-Powered Resume Builder</span>
            <Cpu className="h-5 w-5 text-[#FF66B3]" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            key={currentIndex}
          >
            <motion.span
              className="text-[#FFFBDB] block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {headlines[currentIndex].top}
            </motion.span>
            <motion.span
              className="text-[#FF66B3] block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {headlines[currentIndex].bottom}
            </motion.span>
          </motion.h1>

          <p className="text-[#FFFBDB]/70 max-w-2xl mx-auto text-lg">
            Transform your career journey with our AI-powered resume builder.
            Create professional, tailored resumes in minutes.
          </p>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-[#FF66B3] rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-[#FF66B3] text-[#FFFBDB] text-lg px-8 py-4 rounded-full flex items-center justify-center gap-2 border border-[#FF66B3]/50">
              <Wand2 className="h-5 w-5" />
              Create Your Resume
              <Sparkles className="h-5 w-5" />
            </div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            onClose={() => {
              if (!formSubmitted) setIsModalOpen(false);
            }}
            formSubmitted={formSubmitted}
          >
            {!formSubmitted ? (
              <ResumeForm onSubmit={handleFormSubmit} />
            ) : (
              <ResumePreview
                data={resumeData}
                loading={loading}
                onReset={() => {
                  setFormSubmitted(false);
                  setResumeData(null);
                  setIsModalOpen(false);
                }}
              />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </main>
  );
}

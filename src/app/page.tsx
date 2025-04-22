"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Bot, Cpu } from "lucide-react";
import Modal from "@/components/Modal";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);

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

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#FF66B3] to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 relative"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[#FF66B3]/10 px-6 py-3 rounded-full border border-[#FF66B3]/20"
            whileHover={{ scale: 1.05 }}
          >
            <Bot className="h-5 w-5 text-[#FF66B3]" />
            <span className="text-sm text-[#FF66B3]">AI-Powered Resume Builder</span>
            <Cpu className="h-5 w-5 text-[#FF66B3]" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-[#FFFBDB]">Create Your</span>
            <br />
            <span className="text-[#FF66B3]">Dream Resume</span>
          </h1>

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
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF66B3] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0C1713] to-transparent" />
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

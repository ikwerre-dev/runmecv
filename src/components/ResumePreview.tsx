"use client";

import { motion } from "framer-motion";
import { Download, Share2, ChefHat, X, FileText, Briefcase, Mail } from "lucide-react";

const loadingMessages = [
  "Calm down, I'm cooking... 👨‍🍳",
  "Crafting your professional story... ✨",
  "Making you look good on paper... 📝",
  "Turning your experience into gold... 💫",
  "Almost there, adding final touches... 🎨"
];

export default function ResumePreview({ 
  data, 
  loading,
  onReset 
}: { 
  data: any;
  loading: boolean;
  onReset: () => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#FF66B3] rounded-full opacity-20 blur-2xl" />
          <ChefHat className="h-16 w-16 text-[#FF66B3] relative z-10" />
        </motion.div>

        <div className="mt-8 space-y-4">
          {loadingMessages.map((message, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.5 }}
              className="text-xl text-center text-[#FFFBDB]"
            >
              {message}
            </motion.p>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#FFFBDB]">Your Resume</h2>
        <button
          onClick={onReset}
          className="p-2 rounded-full hover:bg-[#FF66B3]/10 text-[#FF66B3] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-[#FF66B3]/5 rounded-2xl blur-lg" />
        <div className="relative bg-[#0C1713]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#FF66B3]/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="border-b border-[#FF66B3]/20 pb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-[#FF66B3]" />
                <h3 className="text-2xl font-bold text-[#FFFBDB]">{data.name}</h3>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[#FFFBDB]/70">
                <Mail className="h-4 w-4" />
                <p>{data.email}</p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-5 w-5 text-[#FF66B3]" />
                <h4 className="text-lg font-semibold text-[#FF66B3]">Experience</h4>
              </div>
              <p className="text-[#FFFBDB]/80 whitespace-pre-line">{data.experience}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-[#FF66B3] mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.split(',').map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className="bg-[#FF66B3]/10 border border-[#FF66B3]/20 text-[#FFFBDB] px-3 py-1 rounded-full text-sm"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-[#FFFBDB]/50 pt-4 border-t border-[#FF66B3]/20">
              <div>Format: {data.resumeFormat}</div>
              <div>Style: {data.portfolioFormat}</div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-[#FF66B3] rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-[#FF66B3] text-[#FFFBDB] px-6 py-3 rounded-xl flex items-center gap-2 border border-[#FF66B3]/50">
            <Download className="h-5 w-5" />
            Download PDF
          </div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-[#0C1713] rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-transparent text-[#FFFBDB] px-6 py-3 rounded-xl flex items-center gap-2 border border-[#FF66B3]/20">
            <Share2 className="h-5 w-5" />
            Share
          </div>
        </motion.button>
      </div>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { Download, ChefHat, X, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

import copy from 'clipboard-copy';
import { Copy, Check } from 'lucide-react';

const loadingMessages = [
  "Polishing your achievements... ✨",
  "Optimizing your career narrative... 📈",
  "Enhancing your professional brand... 🚀",
  "Finalizing your unique value proposition... 💎",
  "Adding that extra sparkle to your profile... ✨"
];

type ExpandedSections = {
  scrapedData: boolean;
  resumeContent: boolean;
};

export default function ResumePreview({
  data,
  loading,
  onReset
}: {
  data: any;
  loading: boolean;
  onReset: () => void;
}) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    scrapedData: false,
    resumeContent: false
  });
  const [copiedScraped, setCopiedScraped] = useState(false);
  const [copiedResume, setCopiedResume] = useState(false);

  const handleCopy = async (text: string, type: 'scraped' | 'resume') => {
    await copy(text);
    if (type === 'scraped') {
      setCopiedScraped(true);
      setTimeout(() => setCopiedScraped(false), 2000);
    } else {
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 2000);
    }
  };
  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

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
          <motion.p
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl text-center text-[#FFFBDB]"
          >
            {loadingMessages[currentMessageIndex]}
          </motion.p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#FF66B3]">Your Resume</h2>
        <button
          onClick={onReset}
          className="p-2 rounded-full hover:bg-[#FF66B3]/10 text-[#FF66B3] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Resume Content */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#FF66B3]/5 rounded-2xl blur-lg" />
        {data.portfolioAnalysis && (

          <div className="relative bg-[#0C1713]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#FF66B3]/20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {data.portfolioAnalysis && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-5 w-5 mr-5 text-[#FF66B3]" />
                    <h4 className="text-lg font-semibold text-[#FF66B3]">Portfolio Analysis</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2 mt-2 text-[#FF66B3]">Strengths:</h5>
                      <ul className="list-disc pl-5 text-[#FFFBDB]/80">
                        {data.portfolioAnalysis.strengths.map((strength: string, index: number) => (
                          <li key={index} className="pb-3" dangerouslySetInnerHTML={{ __html: strength.replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2 mt-2 text-[#FF66B3]">Weaknesses:</h5>
                      <ul className="list-disc pl-5 text-[#FFFBDB]/80">
                        {data.portfolioAnalysis.weaknesses.map((weakness: string, index: number) => (
                          <li key={index} className="pb-3" dangerouslySetInnerHTML={{ __html: weakness.replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2 mt-2 text-[#FF66B3]">Suggestions:</h5>
                      <ul className="list-disc pl-5 text-[#FFFBDB]/80">
                        {data.portfolioAnalysis.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="pb-3" dangerouslySetInnerHTML={{ __html: suggestion.replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2 mt-2 text-[#FF66B3]">Rating:</h5>
                      <p className="text-[#FFFBDB]/80 text-3xl">{data.portfolioAnalysis.rating}/100</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Collapsible Sections and PDF Download remain the same */}
      <div className="space-y-4">
        <motion.button
          onClick={() => toggleSection('scrapedData')}
          className="w-full text-[#FFFBDB] flex items-center justify-between p-4 rounded-xl border border-[#FF66B3]/20 bg-[#FF66B3]/5"
        >
          <span>Scraped JSON Data</span>
          {expandedSections.scrapedData ? <ChevronUp /> : <ChevronDown />}
        </motion.button>


        {expandedSections.scrapedData && (
          <div className="bg-[#0C1713]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#FF66B3]/20 relative">
            <button
              onClick={() => handleCopy(JSON.stringify(data.scrapedData, null, 2), 'scraped')}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#FF66B3]/10 text-[#FF66B3] transition-colors"
            >
              {copiedScraped ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
            <pre className="text-[#FFFBDB]/80 whitespace-pre-wrap">
              {JSON.stringify(data.scrapedData, null, 2)}
            </pre>
          </div>
        )}
        <motion.button
          onClick={() => toggleSection('resumeContent')}
          className="w-full text-[#FFFBDB] flex items-center justify-between p-4 rounded-xl border border-[#FF66B3]/20 bg-[#FF66B3]/5"
        >
          <span>Resume Data</span>
          {expandedSections.resumeContent ? <ChevronUp /> : <ChevronDown />}
        </motion.button>

        {expandedSections.resumeContent && (
          <div className="bg-[#0C1713]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#FF66B3]/20 relative">
            <button
              onClick={() => handleCopy(JSON.stringify(data.resumeContent, null, 2), 'resume')}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#FF66B3]/10 text-[#FF66B3] transition-colors"
            >
              {copiedResume ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
            <pre className="text-[#FFFBDB]/80 whitespace-pre-wrap">
              {JSON.stringify(data.resumeContent, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* PDF Download */}
      {data.pdf && (
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative group w-full"
          href={`data:application/pdf;base64,${data.pdf}`}
          download="resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="absolute inset-0 bg-[#FF66B3] rounded-xl blur-sm opacity=50 group-hover:opacity=75 transition-opacity" />
          <div className="relative bg-[#FF66B3] text-[#FFFBDB] px-6 py-3 rounded-xl flex items-center justify-center gap=2 border border-[#FF66B3]/50">
            <Download className="h-5 w-5" />
            Download PDF
          </div>
        </motion.a>
      )}
    </div>
  );
}
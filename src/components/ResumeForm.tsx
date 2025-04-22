"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, FileText, Briefcase, Link, ChevronRight, ChevronDown, Star, Target, Palette, Globe, Zap, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const portfolioFormats = ["Creative", "Formal", "Modern", "Minimalist", "Technical"];
const resumeFormats = ["Google", "Apple", "ATS-Friendly", "Academic", "Executive"];

interface FormErrors {
  name?: string;
  email?: string;
  portfolioUrl?: string;
  resumeFormat?: string;
  portfolioFormat?: string;
  submit?: string;  
}

export default function ResumeForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolioFormat: "",
    resumeFormat: "",
    portfolioUrl: "",
    needsReview: false,
    targetIndustry: "",
    colorScheme: "",
    internationalFormat: false,
    seoOptimization: false,
    accessibilityCheck: false,
    performanceAnalysis: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.portfolioUrl.trim()) {
      newErrors.portfolioUrl = "Portfolio URL is required";
    } else {
      try {
        new URL(formData.portfolioUrl);
      } catch {
        newErrors.portfolioUrl = "Invalid URL format";
      }
    }

    if (!formData.resumeFormat) {
      newErrors.resumeFormat = "Resume format is required";
    }

    if (!formData.portfolioFormat) {
      newErrors.portfolioFormat = "Portfolio format is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: "Failed to submit form. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 p-5 pr-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {errors.submit && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Input
            label="Full Name"
            icon={<User className="h-5 w-5" />}
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.name}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Input
            label="Email"
            icon={<Mail className="h-5 w-5" />}
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Resume Format"
          icon={<FileText className="h-5 w-5" />}
          name="resumeFormat"
          required
          value={formData.resumeFormat}
          onChange={handleChange}
          options={resumeFormats}
        />
        
        <Select
          label="Portfolio Style"
          icon={<Briefcase className="h-5 w-5" />}
          name="portfolioFormat"
          required
          value={formData.portfolioFormat}
          onChange={handleChange}
          options={portfolioFormats}
        />
      </div>
      
      <Input
        label="Portfolio URL"
        icon={<Link className="h-5 w-5" />}
        type="url"
        name="portfolioUrl"
        required
        value={formData.portfolioUrl}
        onChange={handleChange}
        placeholder="https://your-portfolio-url.com"
      />
      
      <div className="flex items-center gap-3 p-4 rounded-xl border border-[#FFFBDB]/30  bg-[#FF66B3]/5">
        <input
          type="checkbox"
          name="needsReview"
          id="needsReview"
          checked={formData.needsReview}
          onChange={handleChange}
          className="w-5 h-5 rounded-full accent-[#FF66B3] border-[#FF66B3] cursor-pointer"
        />
        <label htmlFor="needsReview" className="text-[#FFFBDB] flex text-lg  cursor-pointer items-center gap-2">
          Include Portfolio Review
        </label>
      </div>

      <motion.button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full text-[#FFFBDB] flex items-center justify-between p-4 rounded-xl border border-[#FF66B3]/20 bg-[#FF66B3]/5"
      >
        <span className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#FF66B3]" />
          Advanced Options
        </span>
        <ChevronDown className={`h-5 w-5 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <Select
              label="Target Industry"
              icon={<Target className="h-5 w-5" />}
              name="targetIndustry"
              value={formData.targetIndustry}
              onChange={handleChange}
              options={["Tech", "Finance", "Healthcare", "Education", "Creative"]}
            />

            <Select
              label="Color Scheme"
              icon={<Palette className="h-5 w-5" />}
              name="colorScheme"
              value={formData.colorScheme}
              onChange={handleChange}
              options={["Professional", "Creative", "Modern", "Classic", "Bold"]}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="relative group w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      >
        <div className="absolute inset-0 bg-[#FF66B3] rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative bg-[#FF66B3] text-[#FFFBDB] px-8 py-4 rounded-xl flex items-center justify-center gap-2 border border-[#FF66B3]/50 text-lg">
          {isSubmitting ? (
            <>
              <span className="animate-pulse">Generating...</span>
              <div className="h-5 w-5 border-2 border-[#FFFBDB] border-t-transparent rounded-full animate-spin" />
            </>
          ) : (
            <>
              Generate Resume
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </div>
      </motion.button>
    </motion.form>
  );
}
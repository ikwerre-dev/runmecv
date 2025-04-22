"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, FileText, Briefcase, Code, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

const portfolioFormats = ["Creative", "Formal", "Modern", "Minimalist", "Technical"];
const resumeFormats = ["Google", "Apple", "ATS-Friendly", "Academic", "Executive"];

export default function ResumeForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolioFormat: "",
    resumeFormat: "",
    experience: "",
    skills: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      
      <Textarea
        label="Professional Experience"
        icon={<Briefcase className="h-5 w-5" />}
        name="experience"
        required
        value={formData.experience}
        onChange={handleChange}
        placeholder="Describe your work experience..."
        rows={4}
      />
      
      <Textarea
        label="Skills"
        icon={<Code className="h-5 w-5" />}
        name="skills"
        required
        value={formData.skills}
        onChange={handleChange}
        placeholder="List your skills, separated by commas..."
        rows={3}
      />
      
      <motion.button
        type="submit"
        className="relative group w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-[#FF66B3] rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative bg-[#FF66B3] text-[#FFFBDB] px-8 py-4 rounded-xl flex items-center justify-center gap-2 border border-[#FF66B3]/50">
          Generate Resume
          <ChevronRight className="h-5 w-5" />
        </div>
      </motion.button>
    </motion.form>
  );
}
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  icon?: React.ReactNode;
}

export function Select({ label, options, icon, ...props }: SelectProps) {
  return (
    <div className="relative">
      <label className="block text-[#FFFBDB] mb-2 text-sm font-medium">{label}</label>
      <div className="relative group">
        <div className="absolute inset-0 bg-[#FF66B3]/5 rounded-xl blur-sm group-hover:bg-[#FF66B3]/10 transition-all" />
        <div className="relative flex items-center">
          {icon && <span className="absolute left-4 text-[#FF66B3]">{icon}</span>}
          <select
            {...props}
            className={`w-full appearance-none bg-[#0C1713] border border-[#FF66B3]/20 rounded-xl px-4 py-3 
            text-[#FFFBDB] focus:outline-none focus:border-[#FF66B3]/50 transition-all
            ${icon ? 'pl-12' : 'pl-4'}`}
          >
            <option value="" disabled>Select option</option>
            {options.map(option => (
              <option key={option} value={option} className="bg-[#0C1713]">{option}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 h-4 w-4 text-[#FF66B3]" />
        </div>
      </div>
    </div>
  );
}
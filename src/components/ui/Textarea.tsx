import { motion } from "framer-motion";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: React.ReactNode;
}

export function Textarea({ label, icon, ...props }: TextareaProps) {
  return (
    <div className="relative">
      <label className="block text-[#FFFBDB] mb-2 text-sm font-medium">{label}</label>
      <div className="relative group">
        <div className="absolute inset-0 bg-[#FF66B3]/5 rounded-xl blur-sm group-hover:bg-[#FF66B3]/10 transition-all" />
        <div className="relative flex items-start">
          {icon && <span className="absolute left-4 top-3 text-[#FF66B3]">{icon}</span>}
          <textarea
            {...props}
            className={`w-full bg-[#0C1713] border border-[#FF66B3]/20 rounded-xl px-4 py-3 text-[#FFFBDB] 
            placeholder:text-[#FFFBDB]/30 focus:outline-none focus:border-[#FF66B3]/50 transition-all resize-none
            ${icon ? 'pl-12' : 'pl-4'}`}
          />
        </div>
      </div>
    </div>
  );
}
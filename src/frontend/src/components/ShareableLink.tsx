import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareableLinkProps {
  label?: string;
  className?: string;
}

export default function ShareableLink({
  label,
  className = "",
}: ShareableLinkProps) {
  const [copied, setCopied] = useState(false);

  const siteUrl = window.location.origin;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      toast.success("लिंक कॉपी हो गया!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("कॉपी नहीं हो सका।");
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <p className="text-xs" style={{ color: "oklch(0.6 0.03 65)" }}>
          {label}
        </p>
      )}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{
          background: "oklch(0.14 0.02 55)",
          border: "1px solid oklch(0.35 0.06 60 / 0.4)",
        }}
      >
        <span
          className="text-xs truncate flex-1 select-all"
          style={{ color: "oklch(0.65 0.04 65)" }}
        >
          {siteUrl}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1 btn-gold px-2.5 py-1 rounded-lg text-xs font-bold"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "कॉपी!" : "कॉपी"}
        </button>
      </div>
    </div>
  );
}

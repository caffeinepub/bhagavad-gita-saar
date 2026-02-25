import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareableLinkProps {
  label?: string;
  className?: string;
}

export default function ShareableLink({ label, className = '' }: ShareableLinkProps) {
  const [copied, setCopied] = useState(false);

  const shortUrl = `${window.location.origin}/go`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success('लिंक कॉपी हो गया! अब शेयर करें 🙏');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('कॉपी नहीं हो सका। लिंक मैन्युअली कॉपी करें।');
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {label && (
        <p className="text-sm font-devanagari text-maroon/70 flex items-center gap-1">
          <Share2 size={14} />
          {label}
        </p>
      )}
      <div className="flex items-center gap-2 bg-white border-2 border-saffron/40 rounded-xl px-3 py-2 shadow-sm max-w-full">
        <span className="text-maroon font-sans text-sm font-semibold truncate max-w-[220px] sm:max-w-xs select-all">
          {shortUrl}
        </span>
        <button
          onClick={handleCopy}
          title="लिंक कॉपी करें"
          className="flex-shrink-0 flex items-center gap-1 bg-saffron text-maroon px-3 py-1.5 rounded-lg font-devanagari text-xs font-bold hover:bg-gold transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>कॉपी!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>कॉपी</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

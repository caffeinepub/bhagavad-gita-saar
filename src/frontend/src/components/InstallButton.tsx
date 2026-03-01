import { Download } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton({
  className = "",
}: { className?: string }) {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShowInstall(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
    }
    setInstallPrompt(null);
    setShowInstall(false);
  };

  if (installed) {
    return (
      <div
        className={`flex items-center gap-2 text-xs text-primary/70 ${className}`}
      >
        <span>✓</span>
        <span>ऐप इंस्टॉल हो गया</span>
      </div>
    );
  }

  if (!showInstall) return null;

  return (
    <button
      type="button"
      onClick={handleInstall}
      className={`flex items-center gap-2 btn-gold px-4 py-2 rounded-lg text-sm font-bold shadow-gold transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      <Download size={16} />
      <span>📱 ऐप इंस्टॉल करें</span>
    </button>
  );
}

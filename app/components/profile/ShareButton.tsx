import { useState, useCallback, useEffect, useRef } from 'react';
import { Share2, Check, Copy, MoreHorizontal, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '~/lib/analytics-client';

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for older browsers
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    resolve();
  });
}

interface ShareButtonProps {
  /** Session ID — when provided, generates a non-traceable share token for the URL. */
  sessionId?: string;
  /** URL to share. Defaults to share-token-based URL if sessionId provided, else current page URL. */
  url?: string;
  /** Title for the share. */
  title?: string;
  /** Text for the share message. */
  text?: string;
}

export function ShareButton({ sessionId, url, title = 'My Core-View Profile', text }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(url ?? null);
  const [loading, setLoading] = useState(false);
  const fetched = useRef(false);

  // When panel opens and we have a sessionId, fetch/create the share token
  useEffect(() => {
    if (!open || !sessionId || shareUrl || fetched.current) return;
    fetched.current = true;
    setLoading(true);
    fetch(`/api/session/${sessionId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.shareToken) {
          setShareUrl(`${window.location.origin}/p/${data.shareToken}`);
        }
      })
      .finally(() => setLoading(false));
  }, [open, sessionId, shareUrl]);

  const getUrl = useCallback(() => shareUrl ?? url ?? window.location.href, [shareUrl, url]);
  const shareText = text ?? `Check out my Core-View profile`;
  const disabled = loading || (!shareUrl && !!sessionId);

  const handleWhatsApp = useCallback(() => {
    const u = getUrl();
    const waText = encodeURIComponent(`${shareText}\n${u}`);
    window.open(`https://wa.me/?text=${waText}`, '_blank', 'noopener');
    trackEvent('profile_shared', { method: 'whatsapp' });
    setOpen(false);
  }, [getUrl, shareText]);

  const handleLinkedIn = useCallback(() => {
    const u = getUrl();
    const linkedInText = `${shareText}\n${u}`;
    window.open(
      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInText)}`,
      '_blank',
      'noopener,width=600,height=500',
    );
    trackEvent('profile_shared', { method: 'linkedin' });
    setOpen(false);
  }, [getUrl, shareText]);

  const handleCopy = useCallback(async () => {
    const u = getUrl();
    try {
      await copyToClipboard(u);
      setCopied(true);
      trackEvent('profile_shared', { method: 'clipboard' });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      trackEvent('profile_shared', { method: 'clipboard_fallback' });
    }
    setOpen(false);
  }, [getUrl]);

  const handleNativeShare = useCallback(async () => {
    const u = getUrl();
    try {
      await navigator.share({ title, text: shareText, url: u });
      trackEvent('profile_shared', { method: 'native_share' });
    } catch {
      // User cancelled
    }
    setOpen(false);
  }, [getUrl, title, shareText]);

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-paper border-t border-paper-dark z-40">
        <div className="max-w-[480px] mx-auto">
          <Button onClick={() => setOpen(true)} className="flex items-center justify-center gap-2">
            <Share2 size={20} />
            <span>Share your profile</span>
          </Button>
        </div>
      </div>

      {/* Share panel overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-50"
              onClick={() => setOpen(false)}
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-paper rounded-t-2xl shadow-xl"
            >
              <div className="max-w-[480px] mx-auto p-6">
                {/* Drag handle */}
                <div className="w-10 h-1 bg-primary/10 rounded-full mx-auto mb-5" />

                <h3 className="font-display text-lg text-ink mb-4">Share via</h3>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-ink-muted" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {/* WhatsApp */}
                    <button
                      onClick={handleWhatsApp}
                      disabled={disabled}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-colors disabled:opacity-40"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                        <WhatsAppIcon />
                      </div>
                      <span className="text-xs text-ink-soft">WhatsApp</span>
                    </button>

                    {/* LinkedIn */}
                    <button
                      onClick={handleLinkedIn}
                      disabled={disabled}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-colors disabled:opacity-40"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2]">
                        <LinkedInIcon />
                      </div>
                      <span className="text-xs text-ink-soft">LinkedIn</span>
                    </button>

                    {/* Copy link */}
                    <button
                      onClick={handleCopy}
                      disabled={disabled}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-colors disabled:opacity-40"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-ink-muted">
                        {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                      </div>
                      <span className="text-xs text-ink-soft">{copied ? 'Copied!' : 'Copy link'}</span>
                    </button>
                  </div>
                )}

                {/* Native share (more options) — only on supported devices */}
                {hasNativeShare && !loading && (
                  <button
                    onClick={handleNativeShare}
                    disabled={disabled}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/10 text-sm text-ink-soft hover:bg-primary/5 transition-colors disabled:opacity-40"
                  >
                    <MoreHorizontal size={16} />
                    More options
                  </button>
                )}

                {/* Cancel */}
                <button
                  onClick={() => setOpen(false)}
                  className="mt-3 w-full py-3 text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {copied && !open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg z-50"
          >
            <Check size={16} className="text-emerald-400" />
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

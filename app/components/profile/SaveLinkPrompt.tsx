import { useState, useCallback } from 'react';
import { Smartphone, Share, Copy, Check, Plus } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { useInstallPrompt } from '~/hooks/useInstallPrompt';
import { trackEvent } from '~/lib/analytics-client';

interface SaveLinkPromptProps {
  sessionUrl: string;
}

export function SaveLinkPrompt({ sessionUrl }: SaveLinkPromptProps) {
  const [copied, setCopied] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { isInstallable, isIOS, isStandalone, install } = useInstallPrompt();

  const handleCopy = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Core-View Session', url: sessionUrl });
        trackEvent('link_saved', { method: 'native_share' });
        return;
      } catch {
        /* fall through */
      }
    }

    await navigator.clipboard.writeText(sessionUrl);
    setCopied(true);
    trackEvent('link_saved', { method: 'clipboard' });
    setTimeout(() => setCopied(false), 2000);
  }, [sessionUrl]);

  const handleInstall = useCallback(async () => {
    const accepted = await install();
    trackEvent('link_saved', { method: accepted ? 'pwa_installed' : 'pwa_dismissed' });
  }, [install]);

  // Already running as an installed app — no prompt needed
  if (isStandalone) return null;

  return (
    <div className="p-5 rounded-xl bg-accent/5 border border-accent/20">
      <h3 className="text-lg font-medium text-primary mb-2">Save your profile</h3>

      {/* Add to Home Screen — Android (installable PWA) */}
      {isInstallable && (
        <>
          <p className="text-sm text-muted mb-4">
            Add Core-View to your home screen so you can always find your profile back — like an app.
          </p>
          <Button onClick={handleInstall}>
            <span className="inline-flex items-center justify-center gap-2">
              <Smartphone size={18} />
              Add to home screen
            </span>
          </Button>
          <div className="mt-4 pt-4 border-t border-accent/10">
            <CopyRow sessionUrl={sessionUrl} copied={copied} onCopy={handleCopy} />
          </div>
        </>
      )}

      {/* Add to Home Screen — iOS Safari (manual instructions) */}
      {!isInstallable && isIOS && (
        <>
          <p className="text-sm text-muted mb-4">
            Save your profile to your home screen so you can always find it back — like an app.
          </p>
          {showIOSGuide ? (
            <div className="mb-4 rounded-lg bg-white border border-primary/10 p-4">
              <ol className="flex flex-col gap-3 text-sm text-ink-soft">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>
                    Tap the <Share size={14} className="inline -mt-0.5 text-accent" /> <strong>share button</strong> at
                    the bottom of Safari
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>
                    Scroll down and tap{' '}
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Plus size={13} className="text-accent" /> Add to Home Screen
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> — done!
                  </span>
                </li>
              </ol>
            </div>
          ) : (
            <Button onClick={() => setShowIOSGuide(true)}>
              <span className="inline-flex items-center justify-center gap-2">
                <Smartphone size={18} />
                How to add to home screen
              </span>
            </Button>
          )}
          <div className="mt-4 pt-4 border-t border-accent/10">
            <CopyRow sessionUrl={sessionUrl} copied={copied} onCopy={handleCopy} />
          </div>
        </>
      )}

      {/* Default: desktop or non-Safari mobile — copy/share */}
      {!isInstallable && !isIOS && (
        <>
          <p className="text-sm text-muted mb-1">
            This link is your key to your profile. Bookmark it or send it to yourself.
          </p>
          <p className="text-xs text-muted/70 mb-4">
            If you lose this link, your profile is gone. We don't store emails or accounts.
          </p>
          <CopyRow sessionUrl={sessionUrl} copied={copied} onCopy={handleCopy} />
          <div className="mt-3">
            <Button onClick={handleCopy}>{copied ? 'Link copied!' : 'Copy link'}</Button>
          </div>
        </>
      )}
    </div>
  );
}

/** Compact read-only URL row with inline copy button */
function CopyRow({ sessionUrl, copied, onCopy }: { sessionUrl: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-primary/10">
      <input readOnly value={sessionUrl} className="flex-1 text-xs text-muted bg-transparent outline-none truncate" />
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 p-1.5 rounded-md hover:bg-primary/5 transition-colors text-ink-muted"
        aria-label="Copy link"
      >
        {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
      </button>
    </div>
  );
}

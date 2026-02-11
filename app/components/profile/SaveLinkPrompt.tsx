import { useState, useCallback } from 'react';
import { Button } from '~/components/ui/Button';
import { trackEvent } from '~/lib/analytics-client';

interface SaveLinkPromptProps {
  sessionUrl: string;
}

export function SaveLinkPrompt({ sessionUrl }: SaveLinkPromptProps) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="p-5 rounded-xl bg-accent/5 border border-accent/20">
      <h3 className="text-lg font-medium text-primary mb-2">Save your link</h3>
      <p className="text-sm text-muted mb-1">
        This link is your key to your profile. Bookmark it or send it to yourself.
      </p>
      <p className="text-xs text-muted/70 mb-4">
        If you lose this link, your profile is gone. We don't store emails or accounts.
      </p>
      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-primary/10 mb-3">
        <input readOnly value={sessionUrl} className="flex-1 text-xs text-muted bg-transparent outline-none truncate" />
      </div>
      <Button onClick={handleCopy}>{copied ? 'Link copied!' : 'Copy link'}</Button>
    </div>
  );
}

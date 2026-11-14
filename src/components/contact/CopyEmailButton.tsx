import { useEffect, useState } from 'react';
import Icon from '@/components/common/Icon';
import { getIcon } from '@/lib/icons';

interface CopyEmailButtonProps {
  email: string;
  className?: string;
}

export default function CopyEmailButton({ email, className }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeoutId = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={[
        'inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-none border-2 border-ink bg-bg-elevated px-5 py-3 font-heading text-base font-bold text-ink shadow-[4px_4px_0_0_var(--ink)] transition-[translate,box-shadow,background-color,color] duration-120 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon icon={copied ? getIcon('check') : getIcon('copy')} />
      {copied ? 'Email copied' : `Copy ${email}`}
    </button>
  );
}

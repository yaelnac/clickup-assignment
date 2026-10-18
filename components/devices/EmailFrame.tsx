import type { EmailSpec } from "@/content/slides";
import { cn } from "@/lib/cn";

/** A proposed email: sender and subject on top, one line of body, an optional task card, one button. */
export function EmailFrame({ email, tag, className }: { email: EmailSpec; tag?: string; className?: string }) {
  return (
    <figure
      aria-label={`Email: ${email.subject}`}
      className={cn("grid min-w-0 overflow-hidden rounded-xl border border-border bg-bg shadow-hairline", className)}
    >
      <div className="grid gap-[0.5cqw] border-b border-border px-[2cqw] py-[1.6cqw]">
        <p className="flex items-center justify-between gap-4 text-small text-fg-muted">
          <span>From: {email.from}</span>
          {tag ? <span className="truncate font-mono text-micro uppercase">{tag}</span> : null}
        </p>
        <p className="text-lead font-semibold leading-snug text-fg">{email.subject}</p>
      </div>
      <div className="grid content-start gap-[1cqw] px-[2cqw] py-[2cqw]">
        <p className="max-w-[56ch] text-body text-fg">{email.body}</p>
        {email.card ? (
          <div className="flex items-baseline justify-between gap-4 rounded-md bg-surface px-[1.2cqw] py-[1cqw]">
            <span className="text-body font-medium text-fg">{email.card.title}</span>
            <span className="text-small text-fg-muted">{email.card.meta}</span>
          </div>
        ) : null}
        <span className="inline-flex h-[2.8cqw] min-h-11 w-fit items-center rounded-md bg-accent px-[1.4cqw] text-body font-semibold text-accent-fg">
          {email.cta}
        </span>
      </div>
    </figure>
  );
}

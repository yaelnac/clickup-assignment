import { ClickUpMark } from "@/components/devices/ClickUpMark";
import { Marked } from "@/components/devices/Marked";
import type { CompareSide } from "@/content/slides";
import { cn } from "@/lib/cn";

/** One email as it sits in an inbox list: sender, subject, preview, time. */
export function InboxRow({ inbox }: { inbox: CompareSide["inbox"] }) {
  return (
    <div className="rounded-xl border border-border bg-bg p-[0.55cqw] shadow-hairline">
      <Marked n={inbox.mark} inset>
        <div className="flex items-center gap-[0.8cqw] px-[0.7cqw] py-[0.6cqw]">
          <span className="grid size-[2.4cqw] min-h-8 min-w-8 shrink-0 place-items-center rounded-full bg-surface">
            <ClickUpMark className="size-[62%]" />
          </span>
          <div className="grid min-w-0 flex-1 gap-[0.15cqw]">
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-micro font-semibold text-fg">{inbox.from}</span>
              {inbox.time ? (
                <span className="flex items-center gap-1.5 text-micro font-semibold text-accent">
                  {inbox.time}
                  {inbox.unread ? <span className="size-1.5 rounded-full bg-accent" aria-label="Unread" /> : null}
                </span>
              ) : null}
            </p>
            <p className={cn("truncate text-small font-semibold text-fg")}>{inbox.subject}</p>
            {inbox.preview ? <p className="truncate text-data text-fg-muted">{inbox.preview}</p> : null}
          </div>
        </div>
      </Marked>
    </div>
  );
}

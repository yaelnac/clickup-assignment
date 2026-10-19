import { ClickUpMark } from "@/components/devices/ClickUpMark";
import { Marked } from "@/components/devices/Marked";
import type { DigestCard, DigestEmail as DigestEmailSpec } from "@/content/slides";
import { cn } from "@/lib/cn";

/**
 * The body of a ClickUp digest email, drawn from data: logo and counts, then sections of task
 * cards, and an optional button. A clipped email is laid out out of flow, so it takes the
 * height of whatever sits beside it and is cut at the bottom.
 */
export function DigestEmail({ email }: { email: DigestEmailSpec }) {
  const body = (
    <div className="grid gap-[0.7cqh] px-[1.2cqw] pb-[1.6cqh] pt-[1.5cqh]">
      <div className="flex items-center justify-between gap-3">
        <span className="flex shrink-0 items-center gap-[0.4cqw] text-lead font-bold tracking-tight text-fg">
          <ClickUpMark className="size-[2cqw] min-h-6 min-w-6" />
          ClickUp
        </span>
        <span className="flex justify-end gap-x-[0.7cqw] whitespace-nowrap text-micro text-fg-muted">
          {email.stats.map((stat) => (
            <span key={stat.label}>
              <span aria-hidden="true">• </span>
              {stat.label}: <span className={cn("font-semibold", stat.alert ? "text-alert" : "text-fg")}>{stat.value}</span>
            </span>
          ))}
        </span>
      </div>
      {email.sections.map((section) => (
        <section key={section.title} className="grid gap-[0.7cqh]">
          <h3 className="pt-[0.3cqh] text-center text-body font-medium text-fg">{section.title}</h3>
          <Marked n={section.mark}>
            <div className="grid gap-[1cqh]">
              {section.cards.map((card, i) => (
                <Marked key={i} n={card.mark}>
                  <TaskCard card={card} />
                </Marked>
              ))}
              {section.cta ? (
                <div className="grid justify-items-center gap-[0.4cqh] pb-[0.2cqh] pt-[0.4cqh]">
                  <span className="rounded-md bg-accent px-[2.6cqw] py-[0.7cqw] text-small font-semibold text-accent-fg">{section.cta.label}</span>
                  {section.cta.secondary ? <span className="text-data text-fg-muted">{section.cta.secondary}</span> : null}
                </div>
              ) : null}
            </div>
          </Marked>
        </section>
      ))}
    </div>
  );

  return (
    <figure
      aria-label="Email body"
      className={cn("relative rounded-xl border border-border bg-surface shadow-hairline", email.clipped && "h-full min-h-[22rem] overflow-hidden")}
    >
      {email.clipped ? (
        <>
          <div className="absolute inset-x-0 top-0">{body}</div>
          {/* the email continues below the fold */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] bg-linear-to-b from-transparent to-surface" />
        </>
      ) : (
        body
      )}
    </figure>
  );
}

function TaskCard({ card }: { card: DigestCard }) {
  return (
    <div
      className={cn(
        "grid gap-[0.35cqh] rounded-sm border border-border bg-bg px-[0.9cqw] py-[0.75cqh]",
        card.highlight && "border-l-[3px] border-l-accent bg-accent/5",
        card.overdue && "border-l-[3px] border-l-alert",
      )}
    >
      <div className="flex items-center gap-[0.6cqw]">
        <span className="rounded-[3px] bg-fg-muted px-[0.4cqw] py-px text-micro font-semibold uppercase text-bg">{card.status}</span>
        <span className="min-w-0 flex-1 truncate text-micro text-fg-muted">
          {card.path.slice(0, -1).map((part) => `${part} > `)}
          <span className="font-semibold text-fg">{card.path[card.path.length - 1]}</span>
        </span>
        <span
          className={cn(
            "grid size-[1.5cqw] min-h-6 min-w-6 shrink-0 place-items-center rounded-full text-micro font-semibold",
            card.pending ? "border border-dashed border-fg-muted text-fg-muted" : "bg-fg/80 text-bg",
          )}
        >
          {card.assignee}
        </span>
      </div>
      {card.title ? <p className="text-small text-fg">{card.title}</p> : null}
      {card.note ? <p className="text-data font-semibold text-accent">{card.note}</p> : null}
    </div>
  );
}

import type { AppMockSpec } from "@/content/slides";
import { cn } from "@/lib/cn";

/**
 * A proposed in-app screen, drawn from data: a rail, a breadcrumb, and either one white card
 * ("card") or a heading with rows and an AI suggestion below ("page").
 */
export function AppMock({ spec }: { spec: AppMockSpec }) {
  const actions = spec.primary ? (
    <div className="flex flex-wrap items-center gap-x-[1.2cqw] gap-y-2 pt-[0.4cqw]">
      <span className="inline-flex h-[2.6cqw] min-h-10 items-center whitespace-nowrap rounded-md bg-accent px-[1.2cqw] text-small font-semibold text-accent-fg">
        {spec.primary}
      </span>
      {spec.secondary ? <span className="text-small text-fg-muted">{spec.secondary}</span> : null}
    </div>
  ) : null;

  const rows = spec.rows ? (
    <ul className="grid gap-[0.5cqw]">
      {spec.rows.map((row) => (
        <li
          key={row.label}
          className={cn(
            "flex items-baseline justify-between gap-4 rounded-md px-[1cqw] py-[0.8cqw] text-small",
            spec.variant === "card" ? "bg-surface" : "bg-bg",
          )}
        >
          <span className="font-medium text-fg">{row.label}</span>
          <span className="shrink-0 text-fg-muted">{row.meta}</span>
        </li>
      ))}
    </ul>
  ) : null;

  return (
    <div className="absolute inset-0 flex text-left">
      <div aria-hidden="true" className="flex w-[3.2cqw] min-w-10 shrink-0 flex-col items-center gap-[0.9cqw] bg-surface-2 py-[1.2cqw]">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("size-[1.2cqw] min-h-3.5 min-w-3.5 rounded-sm", i === 0 ? "bg-fg/70" : "bg-border-strong")} />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col bg-surface">
        <div className="shrink-0 px-[1.8cqw] pt-[1.4cqw] text-small text-fg-muted">{spec.space}</div>
        <div className="grid min-h-0 flex-1 content-center px-[1.8cqw] pb-[1.8cqw] pt-[1cqw]">
          {spec.variant === "card" ? (
            <div className="grid gap-[0.9cqw] rounded-lg border border-border bg-bg p-[1.6cqw] shadow-hairline">
              {spec.welcome ? <p className="text-small text-fg-muted">{spec.welcome}</p> : null}
              {spec.title ? <p className="text-statement leading-tight text-fg">{spec.title}</p> : null}
              {spec.input ? (
                <span className="flex h-[2.8cqw] min-h-10 items-center rounded-md border-2 border-accent px-[1cqw] text-body text-fg">{spec.input}</span>
              ) : null}
              {spec.stats ? (
                <dl className="grid grid-cols-3 gap-[0.7cqw]">
                  {spec.stats.map((stat) => (
                    <div key={stat.label} className="rounded-md bg-surface px-[1cqw] py-[0.9cqw]">
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="text-statement leading-none text-fg">{stat.value}</dd>
                      <dd className="mt-2 text-small text-fg-muted">{stat.label}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {rows}
              {spec.line ? <p className="text-body text-fg">{spec.line}</p> : null}
              {actions}
            </div>
          ) : (
            <div className="grid gap-[0.9cqw]">
              {spec.heading ? <p className="text-statement leading-tight text-fg">{spec.heading}</p> : null}
              {rows}
              {spec.ai ? (
                <div className="grid gap-[0.9cqw] rounded-lg border border-accent/30 bg-accent/8 p-[1.4cqw]">
                  <p className="max-w-[44ch] text-body text-fg">{spec.ai.text}</p>
                  <div className="flex flex-wrap items-center gap-x-[1.2cqw] gap-y-2">
                    <span className="inline-flex h-[2.6cqw] min-h-10 items-center whitespace-nowrap rounded-md bg-accent px-[1.2cqw] text-small font-semibold text-accent-fg">
                      {spec.ai.primary}
                    </span>
                    <span className="text-small text-fg-muted">{spec.ai.secondary}</span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

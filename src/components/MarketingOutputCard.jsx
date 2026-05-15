import Icon from "./Icon";
import FlyerPreviewCard from "./FlyerPreviewCard";

export default function MarketingOutputCard({
  type,
  title = "AI Output",
  output,
  service,
  provider,
  onCopy,
  onSave,
  onRegenerate,
  onOpenWhatsApp,
}) {
  if (!output) {
    return (
      <section className="rounded-[1.75rem] border border-white/10 bg-[#10131B] p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-300/10 text-amber-200">
          <Icon name="auto_awesome" />
        </div>
        <h3 className="mt-4 text-lg font-black text-white">Ready when you are</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Choose a module, confirm your service context, and generate a polished marketing asset.</p>
      </section>
    );
  }

  const copyPayload = serializeOutput(output);

  return (
    <section className="space-y-4 rounded-[1.75rem] border border-white/10 bg-[#10131B] p-4 shadow-xl shadow-black/20 sm:p-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Generated Asset</p>
          <h2 className="mt-1 text-xl font-black text-white">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {type === "flyer" ? (
            <button onClick={() => onCopy?.("Flyer preview export placeholder. Real image export will be connected when the production asset service is added.")} className="rounded-full border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10">
              Download Preview
            </button>
          ) : null}
          {type === "whatsapp_ad" ? (
            <button onClick={() => onOpenWhatsApp?.(copyPayload)} className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-100">
              Open WhatsApp
            </button>
          ) : null}
          <button onClick={() => onCopy?.(copyPayload)} className="rounded-full border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10">
            Copy
          </button>
          <button onClick={onSave} className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-amber-100">
            Save
          </button>
          <button onClick={onRegenerate} className="rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black hover:bg-amber-100">
            Regenerate
          </button>
        </div>
      </div>

      {type === "flyer" ? (
        <FlyerPreviewCard flyer={output} service={service} provider={provider} />
      ) : (
        <OutputRenderer output={output} />
      )}
    </section>
  );
}

function OutputRenderer({ output }) {
  if (Array.isArray(output)) {
    return (
      <div className="space-y-3">
        {output.map((item, index) => (
          <OutputRenderer key={item?.id || item?.title || index} output={item} />
        ))}
      </div>
    );
  }

  if (output && typeof output === "object") {
    if (Array.isArray(output.slides)) {
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {output.slides.map((slide) => (
              <div key={slide.slide} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">Slide {slide.slide}</p>
                <h3 className="mt-2 text-sm font-black text-white">{slide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{slide.text}</p>
              </div>
            ))}
          </div>
          <KeyValueList value={withoutKeys(output, ["slides"])} />
        </div>
      );
    }

    if (Array.isArray(output.competitors)) {
      return (
        <div className="space-y-4">
          <KeyValueList value={withoutKeys(output, ["competitors"])} />
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[1.15fr_0.85fr_0.8fr] gap-3 bg-white/[0.04] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Vendor</span>
              <span>Price Range</span>
              <span>Rating</span>
            </div>
            {output.competitors.map((item) => (
              <div key={item.id || item.name} className="grid grid-cols-[1.15fr_0.85fr_0.8fr] gap-3 border-t border-white/10 px-4 py-3 text-sm">
                <span className="font-bold text-white">{item.name}</span>
                <span className="text-amber-200">{item.priceRangeText}</span>
                <span className="text-slate-300">{item.rating}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <KeyValueList value={output} />;
  }

  return <p className="whitespace-pre-wrap rounded-2xl bg-black/25 p-4 text-sm leading-6 text-slate-200">{String(output || "")}</p>;
}

function KeyValueList({ value = {} }) {
  return (
    <div className="grid gap-3">
      {Object.entries(value).map(([key, item]) => (
        <div key={key} className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{formatKey(key)}</p>
          <div className="mt-2 text-sm leading-6 text-slate-200">
            {Array.isArray(item) ? (
              <div className="flex flex-wrap gap-2">
                {item.map((entry, index) => (
                  <span key={`${entry}-${index}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-200">
                    {typeof entry === "object" ? serializeOutput(entry) : String(entry)}
                  </span>
                ))}
              </div>
            ) : typeof item === "object" && item !== null ? (
              <pre className="whitespace-pre-wrap break-words text-xs text-slate-300">{serializeOutput(item)}</pre>
            ) : (
              <p className="whitespace-pre-wrap">{String(item ?? "")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function withoutKeys(value, keys = []) {
  return Object.fromEntries(Object.entries(value || {}).filter(([key]) => !keys.includes(key)));
}

function formatKey(key) {
  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function serializeOutput(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(serializeOutput).join("\n\n");
  if (!value || typeof value !== "object") return String(value ?? "");
  return Object.entries(value)
    .map(([key, item]) => `${formatKey(key)}: ${Array.isArray(item) ? item.map(serializeOutput).join("; ") : typeof item === "object" && item !== null ? serializeOutput(item) : item}`)
    .join("\n");
}

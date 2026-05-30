import Link from "next/link";

function readingTime(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function BlogCard({ title, author, date, content, image, tag, href = "#" }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#eef1ee] bg-white shadow-[0_4px_20px_rgba(17,24,39,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#63c37a40] hover:shadow-[0_22px_48px_rgba(20,83,45,0.16)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#e7f6ec] to-[#d4eedd]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {tag ? (
          <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wide text-[#2f7d46] uppercase shadow-sm backdrop-blur">
            {tag}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-center gap-2 text-xs font-medium text-[#8a93a3]">
          {date ? <span>{date}</span> : null}
          {date ? <span className="h-1 w-1 rounded-full bg-[#cdd3da]" /> : null}
          <span>{readingTime(content)} min read</span>
        </div>

        <h3 className="mt-3 font-serif text-xl leading-snug font-bold text-[#1d2238] transition-colors group-hover:text-[#2f7d46] line-clamp-2 md:text-2xl">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-[#5f6879] line-clamp-3">
          {content}
        </p>

        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#63c37a] to-[#2f7d46] text-xs font-bold text-white">
              {(author || "S").charAt(0).toUpperCase()}
            </span>
            <span className="text-xs font-semibold text-[#3b4356]">
              {author || "SDEAS"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#63c37a] transition-transform duration-300 group-hover:translate-x-1">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}

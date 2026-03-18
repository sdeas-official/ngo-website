export function BlogCard({ title, author, date, content, image }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#63c37a1f] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.08)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#63c37a]">
          {date}
        </span>
      </div>

      <div className="p-6 md:p-7">
        <h3 className="font-serif text-2xl leading-tight font-bold text-[#1d2238]">
          {title}
        </h3>
        <p className="mt-3 text-sm font-semibold text-[#63c37a]">By {author}</p>
        <p className="mt-1 text-xs text-[#5f6879]">Posted on {date}</p>
        <span className="mt-4 block h-0.5 w-9 bg-[#63c37a]" />
        <p className="mt-4 text-sm leading-relaxed text-[#5f6879] md:text-base">
          {content}
        </p>
      </div>
    </article>
  );
}

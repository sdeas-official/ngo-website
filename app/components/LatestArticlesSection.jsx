const latestArticles = [
  {
    author: "SDEAS Foundation",
    date: "March 2026",
    title: "Youth Skill Development Workshop Successfully Conducted",
    excerpt:
      "Hands-on sessions helped students gain practical knowledge for career readiness and employment opportunities.",
    image:
      "https://images.unsplash.com/photo-1517739277509-06f1c761b6a9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    author: "SDEAS Foundation",
    date: "February 2026",
    title: "CSR Partnership Discussion with Industry Leaders",
    excerpt:
      "Corporate and industry partners joined us to design high-impact CSR projects for youth empowerment.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    highlighted: true,
  },
  {
    author: "SDEAS Foundation",
    date: "January 2026",
    title: "Community Development and Education Awareness Event",
    excerpt:
      "Our volunteers and trainers organized awareness activities to support education and social welfare in local communities.",
    image:
      "https://images.unsplash.com/photo-1605106702734-205df224ecce?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function LatestArticlesSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto w-full max-w-350 px-4 md:px-8 lg:px-10">
        <h2 className="text-center font-serif text-5xl font-bold text-[#1d2238] md:text-6xl">
          Events & Updates
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <article
              key={article.title}
              className="overflow-hidden border border-[#d9d9d9] bg-white"
            >
              <img
                src={article.image}
                alt={article.title}
                className="h-84 w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              <div className="px-9 py-8">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 leading-none text-[#667085]">
                  <p className="inline-flex items-center gap-2 text-sm leading-none md:text-base">
                    <span aria-hidden="true">👤</span>
                    <span>{article.author}</span>
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm leading-none md:text-base">
                    <span aria-hidden="true">📅</span>
                    <span>{article.date}</span>
                  </p>
                </div>

                <h3
                  className={`mt-6 font-serif text-3xl leading-tight font-bold ${
                    article.highlighted ? "text-[#63c37a]" : "text-[#1d2238]"
                  }`}
                >
                  {article.title}
                </h3>

                <span className="mt-5 block h-0.5 w-9 bg-[#63c37a]" />

                <p className="mt-5 text-base leading-8 text-[#646e80] md:text-lg md:leading-8">
                  {article.excerpt}
                </p>

                <a
                  href="#"
                  className="mt-5 inline-flex text-base font-semibold text-[#63c37a] transition-colors hover:text-[#4fb267] md:text-lg"
                >
                  Read Update →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

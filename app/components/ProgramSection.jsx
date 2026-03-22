import { Check } from "lucide-react";
import { Button } from "./Button";

export default function ProgramSection({
  title,
  description,
  image,
  imageAlt,
  points,
  cta,
  Icon,
  reverse = false,
  sectionClassName = "",
}) {
  return (
    <section className={`${sectionClassName} py-14 md:py-20 xl:py-24`}>
      <div className="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-8 px-4 md:px-8 lg:grid-cols-2 lg:gap-12 xl:gap-14 lg:px-10">
        <div className="order-1 lg:hidden">
          {Icon && (
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#63c37a1f] text-[#63c37a]">
              <Icon size={24} />
            </div>
          )}
          <h2 className="font-serif text-3xl font-bold text-[#1d2238] sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className={`order-2 ${reverse ? "lg:order-2" : "lg:order-1"}`}>
          <img
            src={image}
            alt={imageAlt}
            className="h-64 w-full rounded-3xl object-cover shadow-[0_12px_40px_rgba(15,23,42,0.18)] sm:h-80 lg:h-90 xl:h-100"
          />
        </div>

        <div className={`order-3 ${reverse ? "lg:order-1" : "lg:order-2"}`}>
          {Icon && (
            <div className="mb-6 hidden lg:inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#63c37a1f] text-[#63c37a]">
              <Icon size={30} />
            </div>
          )}

          <h2 className="hidden lg:block font-serif text-4xl font-bold text-[#1d2238] md:text-5xl">
            {title}
          </h2>

          <p className="mt-6 text-base leading-relaxed text-[#5f6879] md:text-lg">
            {description}
          </p>

          <div className="mt-6 rounded-3xl bg-[#f0fdf4] p-6 md:p-7">
            <h4 className="font-serif text-2xl font-bold text-[#1d2238]">
              Important Points
            </h4>
            <ul className="mt-5 space-y-3 text-[#4b5563]">
              {(points || []).map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 text-[#63c37a]" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {cta?.label && cta?.to && (
            <div className="mt-8 flex justify-center lg:justify-start">
              <Button to={cta.to}>{cta.label}</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

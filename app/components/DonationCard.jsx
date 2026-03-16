import { Check } from "lucide-react";
import { Button } from "./Button";

export function DonationCard({
  amount,
  title,
  description,
  features,
  highlighted = false,
}) {
  return (
    <article
      className={`rounded-3xl border p-6 shadow-[0_8px_24px_rgba(17,24,39,0.08)] transition-transform duration-300 hover:-translate-y-1 md:p-7 ${
        highlighted
          ? "border-[#63c37a] bg-[#f0fdf4]"
          : "border-[#63c37a1f] bg-white"
      }`}
    >
      <p className="text-sm font-semibold tracking-[0.18em] text-[#63c37a] uppercase">
        Donation
      </p>
      <p className="mt-2 font-serif text-4xl font-extrabold text-[#1d2238]">
        ₹{amount}
      </p>
      <h3 className="mt-3 font-serif text-2xl font-bold text-[#1d2238]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[#5f6879]">{description}</p>

      <ul className="mt-5 space-y-2.5 text-sm text-[#4b5563]">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check size={16} className="mt-0.5 text-[#63c37a]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button to="/contact" className="mt-6 w-full">
        Donate Now
      </Button>
    </article>
  );
}

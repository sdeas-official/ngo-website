export function TeamCard({ name, role, designation, image }) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(15,23,42,0.14)]">
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0f172a66] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-7">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#63c37a] uppercase">
          {role}
        </span>
        <h3 className="mt-2 font-serif text-2xl font-bold text-[#1d2238]">
          {name}
        </h3>
        <p className="mt-1.5 text-sm text-[#5f6879]">{designation}</p>
        <span className="mt-5 block h-0.5 w-8 bg-[#63c37a]" />
      </div>
    </div>
  );
}

import Link from "next/link";

const baseClass =
  "inline-flex items-center justify-center rounded-full font-bold transition-colors duration-300";

const sizeMap = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-8 text-base",
  lg: "h-14 px-10 text-lg",
};

const variantMap = {
  primary: "bg-[#63c37a] text-white hover:bg-[#459557]",
  secondary: "bg-white text-[#1d2238] hover:bg-[#eaf8ee]",
  outline:
    "border border-[#63c37a] text-[#63c37a] bg-transparent hover:bg-[#63c37a] hover:text-white",
};

export function Button({
  to = "#",
  children,
  variant = "primary",
  size = "md",
  className = "",
}) {
  const classes =
    `${baseClass} ${sizeMap[size] ?? sizeMap.md} ${variantMap[variant] ?? variantMap.primary} ${className}`.trim();

  return (
    <Link href={to} className={classes}>
      {children}
    </Link>
  );
}

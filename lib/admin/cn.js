// Tiny classnames joiner. Filters out falsy values so conditional classes read
// cleanly: cn("base", isActive && "active", disabled && "opacity-50").
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

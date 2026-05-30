import { AdminProviders } from "@/components/admin/shell/AdminProviders";

export const metadata = {
  title: "SDEAS Admin",
  robots: { index: false, follow: false },
};

// Wraps the entire /admin route tree in the shell (sidebar + topbar + auth guard)
// and the admin-wide context providers.
export default function AdminLayout({ children }) {
  return <AdminProviders>{children}</AdminProviders>;
}

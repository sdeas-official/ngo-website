// Sidebar information architecture. Three domains by mental model:
// Pages (singletons), Content (collections), Inbox (read-only submissions).
// `badge` names a runtime counter the Sidebar resolves (e.g. pending registrations).
export const navGroups = [
  {
    items: [{ key: "dashboard", label: "Dashboard", href: "/admin", icon: "home" }],
  },
  {
    title: "Pages",
    items: [
      { key: "home", label: "Home Page", href: "/admin/pages/home", icon: "file" },
      { key: "about", label: "About Us", href: "/admin/pages/about", icon: "file" },
      { key: "team", label: "Team Members", href: "/admin/collections/team", icon: "users", badge: "team" },
      { key: "gallery", label: "Gallery", href: "/admin/pages/gallery", icon: "image" },
    ],
  },
  {
    title: "Content",
    items: [
      { key: "blog", label: "Blog Posts", href: "/admin/collections/blog", icon: "edit", badge: "blog" },
      { key: "programs", label: "Programs", href: "/admin/collections/programs", icon: "target", badge: "programs" },
      { key: "testimonials", label: "Testimonials", href: "/admin/collections/testimonials", icon: "chat", badge: "testimonials" },
      { key: "donations", label: "Donation Tiers", href: "/admin/collections/donations", icon: "heart", badge: "donations" },
    ],
  },
  {
    title: "Inbox",
    items: [
      { key: "registrations", label: "Registrations", href: "/admin/inbox/registrations", icon: "inbox", badge: "registrationsPending", badgeTone: "alert" },
      { key: "contact", label: "Contact", href: "/admin/inbox/contact", icon: "mail", badge: "contact" },
      { key: "partner", label: "Partner Requests", href: "/admin/inbox/partner", icon: "handshake" },
    ],
  },
  {
    title: "Site",
    items: [
      { key: "ongoing", label: "Ongoing Projects", href: "/admin/collections/ongoing", icon: "target", badge: "ongoing" },
      { key: "siteSettings", label: "Site Settings", href: "/admin/site-settings", icon: "settings" },
    ],
  },
];

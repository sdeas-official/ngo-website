export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin-login", "/api/"],
      },
    ],
    sitemap: "https://sdeasfoundation.org/sitemap.xml",
    host: "https://sdeasfoundation.org",
  };
}

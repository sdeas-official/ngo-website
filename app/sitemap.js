export default function sitemap() {
  const baseUrl = "https://sdeasfoundation.org";
  const lastModified = new Date();

  const routes = [
    { url: baseUrl, priority: 1.0, changeFrequency: "weekly" },
    { url: `${baseUrl}/about`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/programs`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${baseUrl}/gallery`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/contact`, priority: 0.8, changeFrequency: "yearly" },
    { url: `${baseUrl}/register-now`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/partner-with-us`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/members`, priority: 0.6, changeFrequency: "monthly" },
  ];

  return routes.map((route) => ({
    url: route.url,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

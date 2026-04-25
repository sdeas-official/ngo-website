export default function manifest() {
  return {
    name: "SDEAS Foundation",
    short_name: "SDEAS",
    description:
      "SDEAS Foundation - NGO empowering youth through skill development, education, and community programs in India.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a56db",
    icons: [
      {
        src: "/NGO%20LOGO.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/NGO%20LOGO.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

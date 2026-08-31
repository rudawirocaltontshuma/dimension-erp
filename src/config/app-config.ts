import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Dimension ERP",
  subtitle: "Enterprise Resource Planning Platform",
  version: packageJson.version,
  copyright: `© ${currentYear}, Dimension ERP demonstration.`,
  meta: {
    title: "Dimension ERP — Enterprise Resource Planning Platform",
    description:
      "Dimension ERP is a frontend-only enterprise resource planning platform demonstration built with Next.js, TypeScript, Tailwind CSS and shadcn/ui. It uses fictional mock data for demonstration purposes.",
  },
};

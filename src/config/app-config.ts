import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Enterprise ERP",
  subtitle: "Enterprise Resource Planning Platform",
  version: packageJson.version,
  copyright: `© ${currentYear}, Enterprise ERP demonstration.`,
  meta: {
    title: "Enterprise ERP — Enterprise Resource Planning Platform",
    description:
      "Enterprise ERP is a frontend-only enterprise resource planning platform demonstration built with Next.js, TypeScript, Tailwind CSS and shadcn/ui. It uses fictional mock data for portfolio purposes.",
  },
};

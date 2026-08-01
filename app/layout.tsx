import type { Metadata } from "next";
import "./globals.css";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "scholarcraft-academic-english";
const basePath = isGitHubPages && !repositoryName.endsWith(".github.io") ? `/${repositoryName}` : "";

export const metadata: Metadata = {
  title: "Scholarcraft — 学术英文刻意练习",
  description: "通过短写、即时诊断与重写，系统提高学术英文写作与表达能力。",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}

import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { PortfolioSection } from "@/components/site/PortfolioSection";
import { Services } from "@/components/site/Services";
import { Timeline } from "@/components/site/Timeline";

import { Contact } from "@/components/site/Contact";
import { SiteFooter } from "@/components/site/SiteFooter";
import { listPublicPortfolio } from "@/lib/portfolio.functions";

const portfolioQuery = queryOptions({
  queryKey: ["portfolio", "public"],
  queryFn: () => listPublicPortfolio(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Live For Studio — Video Editing for Creators" },
      {
        name: "description",
        content:
          "Retention-driven video editing for creators: gameplay, talking head, documentary and shorts. Motion, sound design and color grading included.",
      },
      { property: "og:title", content: "Live For Studio — Video Editing for Creators" },
      {
        property: "og:description",
        content:
          "Retention-driven video editing for creators: gameplay, talking head, documentary and shorts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(portfolioQuery);
  },
  component: Index,
});

function Index() {
  const { data: items } = useSuspenseQuery(portfolioQuery);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main>
        <Hero />
        <PortfolioSection items={items} />
        <Services />
        <Timeline />

        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

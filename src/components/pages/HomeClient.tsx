"use client";

import type { ReactNode } from "react";
import AdSlot from "@/components/ads/AdSlot";
import MovieCard from "@/components/common/MovieCard";
import { SectionSkeleton } from "@/components/common/Skeleton";
import HeroBanner from "@/components/home/HeroBanner";
import Section from "@/components/layout/Section";

type SectionKey = "kDrama" | "shortTv" | "anime" | "westernTv" | "indoDub";

type SectionState = {
  title: string;
  data: any[];
  loading: boolean;
  link: string;
};

type SectionsState = Record<SectionKey, SectionState>;

type HomeClientProps = {
  trending: any[];
  sections: SectionsState;
  hasData: boolean;
};

const HomeClient = ({ trending, sections, hasData }: HomeClientProps) => {
  if (!hasData) {
    return (
      <div>
        <SectionSkeleton />
      </div>
    );
  }

  return (
    <div>
      {trending.length > 0 && <HeroBanner items={trending.slice(0, 5)} />}

      {(() => {
        let infeedInserted = false;

        return Object.entries(sections).map(([key, section]) => {
          if (section.loading) {
            return <SectionSkeleton key={key} />;
          }

          if (section.data.length === 0) return null;

          const items = section.data.slice(0, 10);
          const cards: ReactNode[] = items.map((item: any) => (
            <MovieCard key={item.id} movie={item} />
          ));

          if (!infeedInserted && items.length >= 6) {
            cards.splice(
              6,
              0,
              <AdSlot key={`infeed-banner-${key}`} slot="INFEED_BANNER" className="ad-infeed grid-ad" />
            );
            infeedInserted = true;
          }

          return (
            <Section key={key} title={section.title} linkTo={section.link}>
              {cards}
            </Section>
          );
        });
      })()}
    </div>
  );
};

export default HomeClient;

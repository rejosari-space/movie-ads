"use client";

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

      <div className="container" style={{ marginTop: "10px" }}>
        <AdSlot slot="INFEED_NATIVE" className="ad-infeed" />
      </div>

      {Object.entries(sections).map(([key, section]) =>
        section.loading ? (
          <SectionSkeleton key={key} />
        ) : (
          section.data.length > 0 && (
            <Section key={key} title={section.title} linkTo={section.link}>
              {section.data.slice(0, 10).map((item: any) => (
                <MovieCard key={item.id} movie={item} />
              ))}
            </Section>
          )
        )
      )}
    </div>
  );
};

export default HomeClient;

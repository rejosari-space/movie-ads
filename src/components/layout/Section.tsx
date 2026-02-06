import Link from "next/link";
import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  linkTo?: string;
  children: ReactNode;
};

const Section = ({ title, linkTo, children }: SectionProps) => {
  return (
    <section className="section">
      <div className="container">
        <div className="sectionHeader">
          <h2 className="sectionTitle">{title}</h2>
          {linkTo && (
            <Link href={linkTo} className="viewAll">
              View All
            </Link>
          )}
        </div>
        <div className="grid">{children}</div>
      </div>
    </section>
  );
};

export default Section;

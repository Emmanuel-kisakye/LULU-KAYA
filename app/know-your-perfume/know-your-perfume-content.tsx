"use client";

import { useMemo, useState } from "react";
import {
  SignatureScentCard,
  type SignatureScentPerfume,
} from "../signature-scent-carousel";

const perfumeLayers = [
  {
    step: "1 · First impression",
    name: "Top notes",
    description: "The first thing you smell when you open the bottle or put it on. Light, bright and fresh.",
    thinkOf: ["Lemon", "Bergamot", "Orange", "Mint", "Fresh fruit"],
    tip: "This is what you notice first on a tester strip.",
  },
  {
    step: "2 · The character",
    name: "Heart notes",
    description: "The body of the perfume: what it really smells like once it settles on your skin.",
    thinkOf: ["Rose", "Jasmine", "Spices", "Lavender", "Ripe fruit"],
    tip: "Put a little on your wrist and give it a moment before you decide.",
  },
  {
    step: "3 · The lasting memory",
    name: "Base notes",
    description: "The deep, rich notes that stay on your skin and clothes.",
    thinkOf: ["Vanilla", "Musk", "Woods", "Amber", "Oud"],
    tip: "This is what people remember when you walk past.",
  },
] as const;

export type ScentFamilyDescription = {
  name: string;
  description: string;
};

type KnowYourPerfumeContentProps = {
  perfumes: readonly SignatureScentPerfume[];
  families: readonly ScentFamilyDescription[];
};

const KNOW_FIRST = 9;

export default function KnowYourPerfumeContent({
  perfumes,
  families,
}: KnowYourPerfumeContentProps) {
  const [family, setFamily] = useState("All");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();

  const matchingPerfumes = useMemo(
    () =>
      perfumes.filter((perfume) => {
        if (family !== "All" && perfume.family !== family) {
          return false;
        }

        const searchableText = [
          perfume.name,
          perfume.family,
          ...perfume.topNotes,
          ...perfume.heartNotes,
          ...perfume.baseNotes,
          perfume.description,
        ].join(" ").toLowerCase();

        return !normalizedQuery || searchableText.includes(normalizedQuery);
      }),
    [family, normalizedQuery, perfumes],
  );

  const visiblePerfumes =
    showAll || normalizedQuery
      ? matchingPerfumes
      : matchingPerfumes.slice(0, KNOW_FIRST);
  const activeFamily = families.find(({ name }) => name === family);
  const showMoreButton =
    !normalizedQuery && (showAll || matchingPerfumes.length > visiblePerfumes.length);

  return (
    <section className="know-page" aria-labelledby="know-title">
      <div className="know-wrap">
        <header className="know-heading">
          <span className="know-eyebrow">Know your perfume</span>
          <h1 id="know-title">What is in the bottle, and how it smells.</h1>
          <p>
            Every perfume is built in three layers called notes. You smell them
            one after another as the oil warms on your skin.
          </p>
        </header>

        <div className="know-layers">
          {perfumeLayers.map((layer, index) => (
            <article className={`know-layer know-layer-${index + 1}`} key={layer.name}>
              <span className="know-layer-step">{layer.step}</span>
              <h2>{layer.name}</h2>
              <p>{layer.description}</p>
              <span className="know-layer-label">Think of</span>
              <ul>
                {layer.thinkOf.map((note) => <li key={note}>{note}</li>)}
              </ul>
              <p className="know-layer-tip"><strong>Tip:</strong> {layer.tip}</p>
            </article>
          ))}
        </div>

        <section className="know-families" aria-labelledby="know-families-title">
          <h2 id="know-families-title">Find your scent family</h2>
          <div className="know-family-chips" role="group" aria-label="Filter by scent family">
            {families.map(({ name }) => (
              <button
                type="button"
                className="know-family-chip"
                key={name}
                aria-pressed={family === name}
                onClick={() => setFamily(name)}
              >
                {name}
              </button>
            ))}
          </div>
          {activeFamily && <p className="know-family-description">{activeFamily.description}</p>}
        </section>

        <section className="know-profiles" aria-labelledby="know-profiles-title">
          <div className="know-profiles-heading">
            <div>
              <h2 id="know-profiles-title">Perfume notes and profiles</h2>
              <p>Browse by scent family or search by perfume and note.</p>
            </div>
            <label className="know-search" htmlFor="know-perfume-search">
              <span>Search by perfume or by note</span>
              <input
                id="know-perfume-search"
                type="search"
                placeholder="Try vanilla, rose or oud"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <p className="know-count" role="status" aria-live="polite">
            {matchingPerfumes.length
              ? `Showing ${visiblePerfumes.length} of ${matchingPerfumes.length} profiles.`
              : "No profile matches. Try another word or family."}
          </p>

          {visiblePerfumes.length > 0 && (
            <div className="know-card-grid">
              {visiblePerfumes.map((perfume) => (
                <SignatureScentCard key={perfume.id} perfume={perfume} />
              ))}
            </div>
          )}

          {showMoreButton && (
            <button
              className="know-show-more"
              type="button"
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? "Show fewer" : "Show all"}
            </button>
          )}

          <p className="know-disclaimer">
            Notes shown are those of the fragrance each oil is styled after.
            Lulu Kaya is not affiliated with the brands named.
          </p>
        </section>

        <div className="know-tips">
          <section className="know-tip" aria-labelledby="know-mix-title">
            <h2 id="know-mix-title">How to mix</h2>
            <ul>
              <li>Start with two scents. Add a third only when you know the first two work.</li>
              <li>Pair something fresh or fruity with something sweet, such as citrus with vanilla.</li>
              <li>Musk softens almost anything. Add it to a floral to make it smoother.</li>
              <li>Oud and amber are strong. Balance them with rose or vanilla.</li>
            </ul>
          </section>
          <section className="know-tip" aria-labelledby="know-wear-title">
            <h2 id="know-wear-title">How to wear perfume oil</h2>
            <ul>
              <li>Dab on warm spots: wrists, neck and behind the ears.</li>
              <li>Use a little. Oil is concentrated, so one or two dabs are enough.</li>
              <li>Let it settle for a few minutes before judging the scent. The heart and base take time to show.</li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}

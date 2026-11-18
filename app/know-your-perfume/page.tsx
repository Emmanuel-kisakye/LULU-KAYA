import type { SignatureScentPerfume } from "../signature-scent-carousel";
import siteData from "../site-data.json";
import KnowYourPerfumeContent, {
  type ScentFamilyDescription,
} from "./know-your-perfume-content";

const notesFrom = (notes: string) =>
  notes.split(",").map((note) => note.trim()).filter(Boolean);

const hasScentProfile = (
  name: string,
): name is keyof typeof siteData.scentProfiles =>
  Object.prototype.hasOwnProperty.call(siteData.scentProfiles, name);

const perfumes: SignatureScentPerfume[] = siteData.scents.flatMap((name) => {
  if (!hasScentProfile(name)) {
    return [];
  }

  const profile = siteData.scentProfiles[name];

  if (profile.length !== 5) {
    throw new Error(`The scent profile for "${name}" must contain five fields.`);
  }

  const [family, topNotes, heartNotes, baseNotes, description] = profile;

  return [{
    id: name,
    name,
    family,
    topNotes: notesFrom(topNotes),
    heartNotes: notesFrom(heartNotes),
    baseNotes: notesFrom(baseNotes),
    description,
  }];
});

const families: ScentFamilyDescription[] = Object.entries(siteData.scentFamilies).map(
  ([name, description]) => ({ name, description }),
);

export default function KnowYourPerfumePage() {
  return (
    <main className="landing site-page">
      <KnowYourPerfumeContent perfumes={perfumes} families={families} />
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import ClientReviewsSection, { type ClientReview } from "./client-reviews";
import HeroSection from "./hero-section";
import ImageOverlayCard from "./image-overlay-card";
import ProductSizeVisualizer, { type VisualizedProduct } from "./product-size-visualizer";
import SignatureScentCarousel, { type SignatureScentPerfume } from "./signature-scent-carousel";
import siteData from "./site-data.json";

const team = [
  ["Sydney Ogada", "Director and Founder", "sydney.webp"],
  ["Laurynas Vaiciulis", "Director and Founder", "laurynas.webp"],
  ["Pretty Aline", "Marketing", "Pretty.webp"],
  ["Nixon Kironga", "Sales and Operations", "nixon.webp"],
  ["Davin Nuwagaba", "Customer Experience", "Davin.webp"],
] as const;

const retailPriceFor = (volumeMl: number) => {
  const size = siteData.sizes.find(({ ml }) => ml === volumeMl);

  if (!size) {
    throw new Error(`Missing retail price for the ${volumeMl} ml bottle.`);
  }

  return size.retail;
};

const perfumeOil: VisualizedProduct = {
  name: "Explore Offered Sizes",
  sizes: [
    {
      id: "30ml",
      volumeMl: 30,
      image: "/reference/img/30ml.png",
      price: retailPriceFor(30),
      imageScale: 0.68,
    },
    {
      id: "50ml",
      volumeMl: 50,
      image: "/reference/img/50ml.png",
      price: retailPriceFor(50),
      imageScale: 0.82,
    },
    {
      id: "100ml",
      volumeMl: 100,
      image: "/reference/img/100ml.png",
      price: retailPriceFor(100),
      imageScale: 1,
    },
  ],
};

const clientReviews: readonly ClientReview[] = [
    {
    id: "ssemakula-david",
    name: "David",
    rating: 5,
    text: "Smooth checkout process and fast delivery to Ntinda. My cologne lasts through the entire workday.",
  },
    {
    id: "mugisha-brian",
    name: "Mugisha Brian",
    rating: 5,
    text: "Best perfume plug in town. Good prices, proper packaging, and zero watered-down nonsense. Will definitely be restocking here.",
  },
  {
    id: "namukasa-sarah",
    name: "Sarah",
    rating: 5,
    text: "Ordered my signature scent from Lulukaya and it arrived in Kampala the very next day. 100% authentic and the longevity is unmatched!",
  },
  {
    id: "eazigeniou",
    name: "eazigeniou",
    source: "Instagram",
    text: "Wowwowwow its so nice.",
  },
  {
    id: "achieng-esther",
    name: "Achieng Esther",
    rating: 5,
    text: "I was hesitant to buy perfume online without smelling it first, but their scent descriptions on lulukaya.com were spot on. I love my new bottle!",
  },
    {
    id: "myragimz",
    name: "myragimz",
    source: "Instagram",
    text: "woooow, Thankyou Lulu Kaya",
  },

];

const signatureScents: readonly SignatureScentPerfume[] = [
  {
    id: "blooming-bouquet",
    name: "Blooming Bouquet",
    family: "Floral",
    topNotes: ["Sicilian mandarin"],
    heartNotes: ["Peony", "Damask rose"],
    baseNotes: ["White musk"],
    description: "Light, fresh peony and rose.",
  },
  {
    id: "because-its-you",
    name: "Because It's You",
    family: "Sweet",
    topNotes: ["Raspberry", "Neroli", "Lemon"],
    heartNotes: ["Rose"],
    baseNotes: ["Vanilla", "Musk", "Amber wood"],
    description: "Raspberry and rose wrapped in soft vanilla.",
  },
  {
    id: "beyonce-heat-rush",
    name: "Beyonce Heat Rush",
    family: "Fruity",
    topNotes: ["Passion fruit", "Blood orange", "Cherry"],
    heartNotes: ["Mango blossom", "Orchid", "Hibiscus"],
    baseNotes: ["Amber", "Musk", "Teak wood"],
    description: "Tropical fruit punch with a warm, sunny dry-down.",
  },
  {
    id: "black-opium",
    name: "Black Opium",
    family: "Sweet",
    topNotes: ["Pear", "Pink pepper", "Orange blossom"],
    heartNotes: ["Coffee", "Jasmine", "Bitter almond"],
    baseNotes: ["Vanilla", "Patchouli", "Cedar"],
    description: "Sweet coffee and vanilla with white flowers.",
  },
  {
    id: "burberry-weekend",
    name: "Burberry Weekend",
    family: "Floral",
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    description: "Easygoing citrus and flowers.",
  },
  {
    id: "burberry-body",
    name: "Burberry Body",
    family: "Floral",
    topNotes: ["Peach", "Freesia"],
    heartNotes: ["Rose", "Iris", "Sandalwood"],
    baseNotes: ["Cashmere wood", "Musk", "Vanilla", "Amber"],
    description: "Soft peach and rose on creamy woods.",
  },
  {
    id: "bombshell",
    name: "Bombshell",
    family: "Fruity",
    topNotes: ["Passion fruit", "Grapefruit", "Pineapple"],
    heartNotes: ["Peony", "Vanilla orchid", "Lily of the valley"],
    baseNotes: ["Musk", "Woods"],
    description: "Bright tropical fruit over fresh flowers.",
  },
  {
    id: "beach-walk",
    name: "Beach Walk",
    family: "Fresh",
    topNotes: ["Bergamot", "Pink pepper", "Lemon"],
    heartNotes: ["Ylang-ylang", "Coconut milk", "Heliotrope"],
    baseNotes: ["Musk", "Cedar", "Benzoin"],
    description: "Sun, salt and coconut, like a day at the beach.",
  },
  {
    id: "coco-noir-chanel",
    name: "Coco Noir Chanel",
    family: "Floral",
    topNotes: ["Grapefruit", "Bergamot"],
    heartNotes: ["Rose", "Narcissus", "Geranium", "Jasmine"],
    baseNotes: ["Patchouli", "Tonka bean", "Sandalwood", "Vanilla", "Musk"],
    description: "Dark, elegant rose and patchouli.",
  },
  {
    id: "cool-water-woman",
    name: "Cool Water Woman",
    family: "Fresh",
    topNotes: ["Citrus", "Pineapple", "Melon", "Blackcurrant"],
    heartNotes: ["Lotus", "Water lily", "Jasmine", "Rose"],
    baseNotes: ["Musk", "Sandalwood", "Vetiver", "Peach"],
    description: "Watery flowers and melon. Light and clean.",
  },
  {
    id: "coco-mademoiselle",
    name: "Coco Mademoiselle",
    family: "Floral",
    topNotes: ["Orange", "Bergamot", "Mandarin"],
    heartNotes: ["Rose", "Jasmine"],
    baseNotes: ["Patchouli", "Vanilla", "Vetiver", "White musk"],
    description: "Fresh orange with elegant rose and patchouli.",
  },
  {
    id: "chance-chanel",
    name: "Chance Chanel",
    family: "Floral",
    topNotes: ["Pink pepper", "Lemon", "Pineapple"],
    heartNotes: ["Hyacinth", "Jasmine", "Iris"],
    baseNotes: ["Amber", "Patchouli", "Vetiver", "White musk"],
    description: "Lively, slightly spicy flowers.",
  },
  {
    id: "euphoria-woman",
    name: "Euphoria Woman",
    family: "Floral",
    topNotes: ["Pomegranate", "Persimmon", "Green notes"],
    heartNotes: ["Black orchid", "Lotus"],
    baseNotes: ["Amber", "Mahogany", "Violet", "Musk"],
    description: "Rich pomegranate and orchid. Deep and sensual.",
  },
  {
    id: "escada-cherry-in-the-air",
    name: "Escada Cherry In The Air",
    family: "Fruity",
    topNotes: ["Sour cherry", "Raspberry"],
    heartNotes: ["Marshmallow", "Orchid"],
    baseNotes: ["Sandalwood", "Musk"],
    description: "Sweet cherry and marshmallow.",
  },
  {
    id: "ed-hardy-femme",
    name: "Ed Hardy Femme",
    family: "Fruity",
    topNotes: ["Mango", "Strawberry", "Apple", "Grapefruit"],
    heartNotes: ["Freesia", "Lily of the valley", "Linden blossom"],
    baseNotes: ["Amber", "Tonka bean", "Musk"],
    description: "Sweet tropical fruit with a soft floral heart.",
  },
  {
    id: "eternity-woman",
    name: "Eternity Woman",
    family: "Floral",
    topNotes: ["Freesia", "Mandarin", "Sage"],
    heartNotes: ["Lily", "Lily of the valley", "Narcissus", "Rose"],
    baseNotes: ["Sandalwood", "Amber", "Musk", "Patchouli"],
    description: "Clean, classic white flowers.",
  },
  {
    id: "escada-sorbetto-rosso",
    name: "Escada Sorbetto Rosso",
    family: "Fruity",
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    description: "Juicy watermelon and summer fruit.",
  },
  {
    id: "delina-la-rosee",
    name: "Delina La Rosee",
    family: "Floral",
    topNotes: ["Pear", "Lychee", "Bergamot"],
    heartNotes: ["Turkish rose", "Peony"],
    baseNotes: ["White musk", "Vetiver"],
    description: "Dewy rose with juicy lychee.",
  },
  {
    id: "escada-sexy-graffiti",
    name: "Escada Sexy Graffiti",
    family: "Fruity",
    topNotes: ["Red berries", "Strawberry", "Grapefruit"],
    heartNotes: ["Lily of the valley", "Peony", "Violet"],
    baseNotes: ["Vanilla", "Musk"],
    description: "Playful red berries with a sweet, soft finish.",
  },
  {
    id: "escada-pacific-paradise",
    name: "Escada Pacific Paradise",
    family: "Fruity",
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    description: "Tropical and fruity, made for hot days.",
  },
  {
    id: "escada-taj-sunset",
    name: "Escada Taj Sunset",
    family: "Fruity",
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    description: "Juicy mango and tropical fruit.",
  },
  {
    id: "escada-moon-sparkle",
    name: "Escada Moon Sparkle",
    family: "Fruity",
    topNotes: ["Strawberry", "Blackcurrant", "Red apple", "Citrus"],
    heartNotes: ["Freesia", "Jasmine", "Sweet pea"],
    baseNotes: ["Raspberry", "Sandalwood", "Amber", "Musk"],
    description: "Sweet berries and light flowers.",
  },
  {
    id: "givenchy-linterdit",
    name: "Givenchy L'Interdit",
    family: "Floral",
    topNotes: ["Pear", "Bergamot"],
    heartNotes: ["Tuberose", "Orange blossom", "Jasmine"],
    baseNotes: ["Patchouli", "Vetiver", "Vanilla"],
    description: "White flowers over a dark, woody base.",
  },
];

export default function Home() {
  return (
    <main className="landing">
      <HeroSection />

       <section className="meaning-section" id="meaning" aria-labelledby="meaning-title">
        <Image
          className="meaning-logo"
          src="/reference/img/lulukaya-logo.png"
          alt="Lulu Kaya, Where Beauty Finds Refuge"
          width={720}
          height={675}
          sizes="(max-width: 760px) 240px, 360px"
        />
        <div className="meaning-copy">
          <h2 id="meaning-title">What Lulu Kaya means</h2>
          <p>“Lulu Kaya” is a blend of beautiful language influences.</p>
          <p>
            <em>Lulu</em> comes from Arabic and Swahili, meaning a <em>pearl</em>:
            something precious, rare and beautiful. <em>Kaya</em> means <em>home</em>{" "}
            across Africa: from the Mijikenda of the Kenyan coast to South Africa,
            where <em>ikhaya</em> is home. A place of belonging and refuge.
          </p>
          <p>
            Bring the two together and{" "}
            <strong>Lulu Kaya means “where beauty finds its home.”</strong>
          </p>
          <p>
            That is exactly what our fragrances are about: helping you carry your
            confidence, your identity and your presence every day.
          </p>
          <p className="meaning-closing">
            It’s not just perfume. It’s your <em>identity</em>.
          </p>
        </div>
      </section>

      <section className="signature-scent" aria-labelledby="signature-scent-title">
        <div className="signature-scent-image">
          <Image
            src="/reference/img/signature-scent.webp"
            alt="Lulu Kaya perfume bottles surrounded by flowers and greenery"
            width={1456}
            height={1088}
            sizes="(max-width: 760px) 120vw, 64vw"
          />
        </div>
        <div className="signature-scent-copy">
          <h2 id="signature-scent-title">Some signature scents</h2>
          <SignatureScentCarousel perfumes={signatureScents} />
          <Link className="signature-scent-cta" href="/know-your-perfume">
            Explore Scents
          </Link>
        </div>
      </section>

      <ProductSizeVisualizer id="homePrices" product={perfumeOil} />

      <ClientReviewsSection
        emptyMessage={siteData.reviewEmpty.customer}
        reviews={clientReviews}
        whatsappNumber={siteData.contact.whatsapp}
      />

      <section className="homeloc" id="homeloc" aria-labelledby="home-location-title">
        <div className="homeloc-content">
          <span className="label">Our location</span>
          <h2 id="home-location-title">Visit us in Bukoto.</h2>
          <dl className="locrows">
            <dt>Address</dt>
            <dd>Royal Form Building, 1st floor<br />Plot 1871, Block 213<br />Bukoto-Kisasi Road, Kampala</dd>
            <dt>Hours</dt>
            <dd>Monday to Saturday, 9:00 am to 7:00 pm<br />Sunday closed</dd>
            <dt>Post</dt>
            <dd>P.O. Box 209156, Kampala GPO</dd>
          </dl>
        </div>
        <div className="homeloc-map">
          <iframe
            src="https://maps.google.com/maps?q=0.350288%2C32.5981208&z=16&output=embed"
            title="Lulu Kaya Perfumes on Google Maps"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      <section className="hometeam" id="hometeam" aria-labelledby="home-team-title">
        <div className="sec-head">
          <span className="label">Our team</span>
          <h2 id="home-team-title">The people behind Lulu Kaya.</h2>
        </div>
        <div className="team-card-track" aria-label="Lulu Kaya team members">
          {team.map(([name, role, image]) => (
            <ImageOverlayCard
              className="team-member-card"
              imageAlt={`${name}, ${role}`}
              imageSrc={`/reference/team/${image}`}
              key={name}
              sizes="(max-width: 760px) 260px, 280px"
            >
              <div className="team-member-copy">
                <h3>{name}</h3>
                <p>{role}</p>
              </div>
            </ImageOverlayCard>
          ))}
        </div>
      </section>

    </main>
  );
}

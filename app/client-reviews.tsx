import Link from "next/link";

export type ClientReview = {
  id: string;
  name: string;
  date?: string;
  source?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  text: string;
};

type ClientReviewCardProps = {
  review: ClientReview | null;
  emptyMessage: string;
  whatsappHref: string;
};

type ClientReviewsSectionProps = {
  reviews: readonly ClientReview[];
  emptyMessage: string;
  whatsappNumber: string;
};

function ClientReviewCard({
  review,
  emptyMessage,
  whatsappHref,
}: ClientReviewCardProps) {
  if (!review) {
    return (
      <article className="client-review-card client-review-empty">
        <div aria-hidden="true" className="client-review-avatar">LK</div>
        <div className="client-review-body">
          <h3>Client feedback</h3>
          <p>{emptyMessage}</p>
          <a className="client-review-cta" href={whatsappHref}>
            Share your experience
          </a>
        </div>
      </article>
    );
  }

  const initials = review.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  const metadata = [review.date, review.source].filter(Boolean).join(" · ");
  const isLongReview = review.text.length > 180;
  const rating = review.rating;

  return (
    <article
      className="client-review-card"
      id={`client-review-${review.id}`}
      aria-label={`Review by ${review.name}`}
    >
      <div aria-hidden="true" className="client-review-avatar">{initials}</div>
      <div className="client-review-body">
        <h3>{review.name}</h3>
        {metadata && <p className="client-review-meta">{metadata}</p>}
        {rating !== undefined && (
          <div
            aria-label={`${rating} out of 5 stars`}
            className="client-review-rating"
            role="img"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <span aria-hidden="true" key={index}>
                {index < rating ? "★" : "☆"}
              </span>
            ))}
          </div>
        )}
        <blockquote className="client-review-quote">
          {isLongReview ? (
            <details className="client-review-expand">
              <summary>
                <span className="client-review-excerpt">
                  {review.text.slice(0, 180).trimEnd()}…
                </span>
                <span className="client-review-more">Read more</span>
                <span className="client-review-less">Read less</span>
              </summary>
              <p>{review.text}</p>
            </details>
          ) : (
            review.text
          )}
        </blockquote>
      </div>
    </article>
  );
}

export default function ClientReviewsSection({
  reviews,
  emptyMessage,
  whatsappNumber,
}: ClientReviewsSectionProps) {
  const whatsappHref =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Lulu Kaya, I would like to share a customer review.")}`;

  return (
    <section className="home-reviews" aria-labelledby="home-reviews-title">
      <div className="home-reviews-inner">
        <header className="home-reviews-heading">
          <span className="label">Client feedback</span>
          <h2 id="home-reviews-title">What our customers say</h2>
        </header>
        <ul
          className={`home-review-track${reviews.length > 3 ? " home-review-track-scrollable" : ""}`}
          data-review-count={reviews.length}
          aria-label="Customer reviews"
        >
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <li className="home-review-item" key={review.id}>
                <ClientReviewCard
                  emptyMessage={emptyMessage}
                  review={review}
                  whatsappHref={whatsappHref}
                />
              </li>
            ))
          ) : (
            <li className="home-review-item">
              <ClientReviewCard
                emptyMessage={emptyMessage}
                review={null}
                whatsappHref={whatsappHref}
              />
            </li>
          )}
        </ul>
        {reviews.length > 3 && (
          <nav aria-label="Choose a customer review" className="home-review-dots">
            {reviews.map((review, index) => (
              <Link
                aria-label={`Go to review ${index + 1} by ${review.name}`}
                href={`#client-review-${review.id}`}
                key={review.id}
              />
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}

let hasVisitedNonHomePage = false;

export const markVisitedNonHomePage = () => {
  hasVisitedNonHomePage = true;
};

export const shouldUseStaticHero = () => hasVisitedNonHomePage;

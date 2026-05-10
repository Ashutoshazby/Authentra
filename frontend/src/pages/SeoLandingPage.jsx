import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import MarketingTool from "../components/MarketingTool";
import SeoHead from "../components/SeoHead";
import { internalLinks } from "../data/seoPages";

function SeoLandingPage({ page }) {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Authentra",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `https://www.authentra.com${page.slug}`,
    description: page.seoDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <SeoHead
        title={page.seoTitle}
        description={page.seoDescription}
        keywords={page.keywords}
        path={page.slug}
        softwareSchema={softwareSchema}
        faqSchema={faqSchema}
      />

      <main className="page-shell flex min-h-screen flex-col px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="page-orb" />
        <div className="page-orb-secondary" />
        <div className="mx-auto w-full max-w-7xl flex-1">
          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="reveal-up pt-6">
              <div className="brand-badge text-[11px] text-aqua">
                {page.heroEyebrow}
              </div>
              <h1 className="editorial-heading mt-6 max-w-4xl text-5xl font-bold leading-tight text-white md:text-6xl">
                {page.heroTitle}
              </h1>
              <p className="copy-soft mt-6 max-w-3xl text-lg leading-8">
                {page.heroDescription}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="primary-btn rounded-full px-6 py-3 text-sm text-white"
                >
                  Start Free
                </Link>
                <Link
                  to="/login"
                  className="secondary-btn px-5 py-3 text-sm font-semibold text-slate-200"
                >
                  Login
                </Link>
              </div>
            </div>

            <MarketingTool
              title={page.toolTitle}
              description={page.toolDescription}
              placeholder={page.placeholder}
            />
          </section>

          <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="glass reveal-up reveal-delay-1 rounded-[2rem] border border-slate-800 p-6 sm:p-8">
              <p className="eyebrow">About the tool</p>
              <h2 className="editorial-heading mt-3 text-3xl font-semibold text-white">{page.contentTitle}</h2>
              <div className="copy-soft mt-5 space-y-4 text-base leading-8">
                {page.contentParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="glass reveal-up reveal-delay-2 rounded-[2rem] border border-slate-800 p-6 sm:p-8">
              <p className="eyebrow">Explore more</p>
              <div className="mt-5 grid gap-3">
                {internalLinks
                  .filter((link) => link.href !== page.slug)
                  .map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-4 text-sm font-semibold text-slate-200 transition hover:border-aqua hover:text-aqua"
                    >
                      Explore {link.label}
                    </Link>
                  ))}
              </div>
            </div>
          </section>

          <section className="mt-14 glass reveal-up reveal-delay-3 rounded-[2rem] border border-slate-800 p-6 sm:p-8">
            <p className="eyebrow">Questions people ask</p>
            <div className="mt-6 grid gap-4">
              {page.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-3xl border border-slate-800 bg-slate-950/45 p-5"
                >
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <p className="copy-soft mt-2 text-sm leading-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="mx-auto w-full max-w-7xl">
          <Footer />
        </div>
      </main>
    </>
  );
}

export default SeoLandingPage;

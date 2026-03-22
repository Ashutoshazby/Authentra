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

      <main className="flex min-h-screen flex-col px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-7xl flex-1">
          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="pt-6">
              <div className="inline-flex rounded-full border border-aqua/30 bg-aqua/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-aqua">
                {page.heroEyebrow}
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight text-white md:text-6xl">
                {page.heroTitle}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                {page.heroDescription}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
                >
                  Start Free
                </Link>
                <Link
                  to="/login"
                  className="rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-aqua hover:text-aqua"
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
            <div className="glass rounded-[2rem] border border-slate-800 p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-gold">SEO Content</p>
              <h2 className="mt-3 text-3xl font-black text-white">{page.contentTitle}</h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-slate-300">
                {page.contentParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="glass rounded-[2rem] border border-slate-800 p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-aqua">Internal Links</p>
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

          <section className="mt-14 glass rounded-[2rem] border border-slate-800 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">FAQ</p>
            <div className="mt-6 grid gap-4">
              {page.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-3xl border border-slate-800 bg-slate-950/45 p-5"
                >
                  <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{faq.answer}</p>
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

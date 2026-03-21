import { useEffect } from "react";

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function SeoHead({ title, description, keywords, path, softwareSchema, faqSchema }) {
  useEffect(() => {
    const baseUrl = "https://www.authentra.com";
    const canonicalUrl = `${baseUrl}${path}`;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", keywords.join(", "));
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", canonicalUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const scriptsToRemove = [];
    [softwareSchema, faqSchema].forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      scriptsToRemove.push(script);
    });

    return () => {
      scriptsToRemove.forEach((script) => script.remove());
    };
  }, [description, faqSchema, keywords, path, softwareSchema, title]);

  return null;
}

export default SeoHead;

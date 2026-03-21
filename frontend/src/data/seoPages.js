export const seoPages = {
  "/ai-detector": {
    slug: "/ai-detector",
    heroEyebrow: "AI Detector",
    heroTitle: "Free AI Detector for essays, reports, and business writing",
    heroDescription:
      "Use Authentra's AI detector to review suspicious passages, estimate AI-writing probability, and route difficult submissions into a deeper editorial workflow.",
    toolTitle: "Try the AI detector",
    toolDescription:
      "Paste text into the Authentra AI detector to estimate whether a passage appears machine-generated. The scan runs inside the same Authentra pipeline used by our authenticated dashboard.",
    placeholder: "Paste text to check for AI-generated writing...",
    seoTitle: "AI Detector Tool | Authentra",
    seoDescription:
      "Run a fast AI detector on essays, articles, and reports with Authentra. Check suspicious writing, review AI scores, and compare originality signals.",
    keywords: ["ai detector", "free ai detector", "content ai checker", "authentra ai detector"],
    contentTitle: "How Authentra's AI detector works",
    contentParagraphs: [
      "Authentra combines transformer-based AI detection with document analysis so reviewers can evaluate whether a submission looks human-written or machine-assisted.",
      "The page is optimized for teams that need a quick first-pass signal before escalating to a full academic integrity or editorial review."
    ],
    faqs: [
      {
        question: "What does the AI detector check?",
        answer:
          "It evaluates the pasted text with Authentra's AI-detection pipeline and returns an AI score alongside plagiarism analysis in the product flow."
      },
      {
        question: "Can I scan long-form writing?",
        answer:
          "Yes. Authentra is designed for essays, reports, and research-style documents, though very short passages produce weaker evidence."
      }
    ]
  },
  "/plagiarism-checker": {
    slug: "/plagiarism-checker",
    heroEyebrow: "Plagiarism Checker",
    heroTitle: "Plagiarism checker for essays, blogs, and academic submissions",
    heroDescription:
      "Check copied passages with Authentra's hybrid plagiarism engine, which compares sentence patterns, n-grams, TF-IDF similarity, and web-source signals.",
    toolTitle: "Use the plagiarism checker",
    toolDescription:
      "Paste a passage to start a plagiarism scan. Authentra surfaces suspicious sentences, likely source matches, and an overall plagiarism score.",
    placeholder: "Paste text to check for plagiarism...",
    seoTitle: "Plagiarism Checker | Authentra",
    seoDescription:
      "Detect copied content with Authentra's plagiarism checker. Compare documents against sentence-level similarity signals and matched sources.",
    keywords: ["plagiarism checker", "free plagiarism detector", "essay plagiarism checker", "authentra"],
    contentTitle: "Hybrid plagiarism detection for real-world writing",
    contentParagraphs: [
      "Authentra goes beyond one similarity formula. It combines n-gram overlap, TF-IDF cosine scoring, fingerprinting, and sentence-level web matching to produce more stable results.",
      "That makes it useful for editorial teams, SaaS moderation workflows, teachers, and researchers who need better context than a simple percent match."
    ],
    faqs: [
      {
        question: "Does Authentra return matched sources?",
        answer:
          "Yes. When matching evidence is available, Authentra returns matched sentences and source references to support review."
      },
      {
        question: "Is this useful for student essays?",
        answer:
          "Yes. The checker is designed for essays, research papers, articles, and similar long-form submissions."
      }
    ]
  },
  "/chatgpt-detector": {
    slug: "/chatgpt-detector",
    heroEyebrow: "ChatGPT Detector",
    heroTitle: "ChatGPT detector built for policy, classroom, and editorial reviews",
    heroDescription:
      "Screen text that may have been generated with ChatGPT or similar assistants using Authentra's AI detection workflow and document scoring tools.",
    toolTitle: "Test the ChatGPT detector",
    toolDescription:
      "Paste the writing sample you want to review. If you're signed in, Authentra will run the same ChatGPT detection workflow used in the product dashboard.",
    placeholder: "Paste content to check for ChatGPT-style writing...",
    seoTitle: "ChatGPT Detector | Authentra",
    seoDescription:
      "Use Authentra's ChatGPT detector to review AI-writing likelihood and analyze suspicious passages across essays, articles, and reports.",
    keywords: ["chatgpt detector", "detect chatgpt writing", "ai writing checker", "authentra chatgpt detector"],
    contentTitle: "A practical ChatGPT detector for operational teams",
    contentParagraphs: [
      "Authentra helps reviewers check whether a submission may have been produced with ChatGPT-style generation patterns, while still preserving access to plagiarism evidence in the same product.",
      "That means one workflow can support internal policy reviews, classroom submissions, or external content moderation."
    ],
    faqs: [
      {
        question: "Is the ChatGPT detector different from the AI detector page?",
        answer:
          "It uses the same underlying product workflow, but the page is tailored to people specifically searching for ChatGPT detection."
      },
      {
        question: "Can I use this before logging in?",
        answer:
          "You can paste text immediately, and Authentra will prompt you to log in before completing the live scan."
      }
    ]
  },
  "/research-paper-plagiarism-checker": {
    slug: "/research-paper-plagiarism-checker",
    heroEyebrow: "Research Paper Checker",
    heroTitle: "Research paper plagiarism checker for journals and universities",
    heroDescription:
      "Review originality risks in research papers, thesis chapters, and academic manuscripts with sentence-level matching and flagged sources.",
    toolTitle: "Check a research paper excerpt",
    toolDescription:
      "Paste part of a research paper or manuscript to preview how Authentra handles academic-style plagiarism detection and suspicious overlap.",
    placeholder: "Paste a research paper abstract, section, or excerpt...",
    seoTitle: "Research Paper Plagiarism Checker | Authentra",
    seoDescription:
      "Detect plagiarism in research papers with Authentra. Review academic overlap, suspicious sources, and sentence-level originality signals.",
    keywords: ["research paper plagiarism checker", "academic plagiarism checker", "journal originality checker", "authentra"],
    contentTitle: "Built for research-heavy documents",
    contentParagraphs: [
      "Research papers require better noise filtering than generic web content. Authentra strips low-value academic boilerplate and focuses on sentences more likely to represent substantive overlap.",
      "That helps reviewers concentrate on high-signal matches instead of citations, references, and repeated structural phrases."
    ],
    faqs: [
      {
        question: "Does Authentra ignore references and citations?",
        answer:
          "The plagiarism engine is designed to reduce noise from references sections and common academic phrasing so the score focuses on more meaningful overlap."
      },
      {
        question: "Can I use it for thesis chapters or abstracts?",
        answer:
          "Yes. Authentra is suitable for research papers, essays, abstracts, and article-style long-form text."
      }
    ]
  }
};

export const internalLinks = [
  { href: "/ai-detector", label: "AI Detector" },
  { href: "/plagiarism-checker", label: "Plagiarism Checker" },
  { href: "/chatgpt-detector", label: "ChatGPT Detector" },
  { href: "/research-paper-plagiarism-checker", label: "Research Paper Plagiarism Checker" }
];

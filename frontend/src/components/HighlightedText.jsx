function HighlightedText({ text, matches }) {
  if (!text) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-400">
        No document text available.
      </div>
    );
  }

  const normalizedMatches = matches
    .filter((item) => item.sentence?.length > 10)
    .sort((a, b) => b.sentence.length - a.sentence.length);

  const lowerText = text.toLowerCase();
  const ranges = [];

  normalizedMatches.forEach((item) => {
    const phrase = item.sentence.toLowerCase();
    const start = lowerText.indexOf(phrase);

    if (start === -1) {
      return;
    }

    const end = start + phrase.length;
    const overlaps = ranges.some((range) => start < range.end && end > range.start);

    if (!overlaps) {
      ranges.push({ start, end });
    }
  });

  ranges.sort((a, b) => a.start - b.start);

  const segments = [];
  let cursor = 0;

  ranges.forEach((range) => {
    if (cursor < range.start) {
      segments.push({ text: text.slice(cursor, range.start), highlighted: false });
    }

    segments.push({
      text: text.slice(range.start, range.end),
      highlighted: true
    });
    cursor = range.end;
  });

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlighted: false });
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5 text-sm leading-7 text-slate-200">
      {segments.map((segment, index) =>
        segment.highlighted ? (
          <mark
            key={`${segment.text}-${index}`}
            className="highlight-chip rounded-md px-1 py-0.5 text-white"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        )
      )}
    </div>
  );
}

export default HighlightedText;

'use client';


interface SEOHeadProps {
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export default function SEOHead({ jsonLd }: SEOHeadProps) {
  if (!jsonLd) return null;

  const scripts = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  return (
    <>
      {scripts.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}

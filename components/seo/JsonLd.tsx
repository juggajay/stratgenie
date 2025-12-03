/**
 * JSON-LD Component for Structured Data
 * Injects schema.org markup into pages for rich search results
 */

interface JsonLdProps {
  /** Single schema object or array of schemas */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders JSON-LD structured data script tags
 * Use this component to add schema.org markup to any page
 *
 * @example
 * // Single schema
 * <JsonLd data={generateOrganizationSchema()} />
 *
 * @example
 * // Multiple schemas
 * <JsonLd data={[
 *   generateOrganizationSchema(),
 *   generateSoftwareApplicationSchema(),
 *   generateFAQSchema(faqs)
 * ]} />
 */
export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}

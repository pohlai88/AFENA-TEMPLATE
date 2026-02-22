import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation — afenda ERP',
  description: 'Interactive REST API documentation',
};

/**
 * Swagger UI page — loads from CDN, points at /api/docs for the spec.
 * No 'use client' needed — this is a static server component.
 */
export default function SwaggerPage() {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css"
        />
      </head>
      <body>
        <div id="swagger-ui" />
        <script
          src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"
          defer
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                SwaggerUIBundle({
                  url: '/api/docs',
                  dom_id: '#swagger-ui',
                  deepLinking: true,
                  presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset,
                  ],
                  layout: 'BaseLayout',
                });
              });
            `,
          }}
        />
      </body>
    </html>
  );
}

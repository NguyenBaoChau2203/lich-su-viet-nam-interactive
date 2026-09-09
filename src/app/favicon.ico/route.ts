const icon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#f2eee3"/>
  <rect x="6" y="6" width="52" height="52" fill="none" stroke="#9f382b" stroke-width="3"/>
  <text x="32" y="42" fill="#71251e" font-family="Georgia, serif" font-size="28" font-weight="700" text-anchor="middle">S</text>
</svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}

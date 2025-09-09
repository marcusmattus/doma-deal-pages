import { NextResponse } from 'next/server';
import { getAvailableDomains } from '@/lib/domaClient';

export async function GET() {
  try {
    // Fetch available domains from Doma API
    const domains = await getAvailableDomains();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const now = new Date().toISOString();
    
    // Generate URLs for all available domains
    const domainUrls = domains.map(domain => ({
      loc: `/${domain.tld}/${domain.label}`,
      lastmod: now,
      changefreq: 'hourly', // Domains update frequently with new offers
      priority: '0.8'
    }));
    
    // Add static pages
    const staticUrls = [
      { loc: '/', lastmod: now, changefreq: 'daily', priority: '1.0' },
      { loc: '/chat', lastmod: now, changefreq: 'monthly', priority: '0.3' }
    ];
    
    const allUrls = [...staticUrls, ...domainUrls];
    
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `<url>
<loc>${baseUrl}${url.loc}</loc>
<lastmod>${url.lastmod}</lastmod>
<changefreq>${url.changefreq || 'weekly'}</changefreq>
<priority>${url.priority || '0.5'}</priority>
</url>`).join('\n')}
</urlset>`;

    return new NextResponse(body, { 
      headers: { 
        'content-type': 'application/xml',
        'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      } 
    });
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    
    // Fallback to static sitemap if API fails
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const now = new Date().toISOString();
    
    const fallbackUrls = [
      { loc: '/', lastmod: now },
      { loc: '/ape/laser', lastmod: now },
      { loc: '/core/alpha', lastmod: now },
      { loc: '/io/blockchain', lastmod: now },
      { loc: '/crypto/defi', lastmod: now },
      { loc: '/chat', lastmod: now }
    ];
    
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fallbackUrls.map(url => `<url><loc>${baseUrl}${url.loc}</loc><lastmod>${url.lastmod}</lastmod></url>`).join('\n')}
</urlset>`;

    return new NextResponse(body, { 
      headers: { 'content-type': 'application/xml' } 
    });
  }
}
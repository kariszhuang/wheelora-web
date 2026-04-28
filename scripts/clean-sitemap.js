import fs from 'fs';
import path from 'path';

const sitemapPath = path.resolve('dist/sitemap-0.xml');

if (fs.existsSync(sitemapPath)) {
  let content = fs.readFileSync(sitemapPath, 'utf8');
  // Replace <lastmod>YYYY-MM-DDTHH:mm:ss.sssZ</lastmod> with <lastmod>YYYY-MM-DD</lastmod>
  content = content.replace(/<lastmod>(\d{4}-\d{2}-\d{2})T[0-9:.]*Z<\/lastmod>/g, '<lastmod>$1</lastmod>');
  fs.writeFileSync(sitemapPath, content);
  console.log('Sitemap cleaned successfully.');
} else {
  console.error('Sitemap not found at', sitemapPath);
  process.exit(1);
}

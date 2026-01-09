import type { NextApiRequest, NextApiResponse } from 'next'

const BASE_URL = 'http://localhost:3000'
// 🔁 change to https://originfresh.in in production

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 🔹 STATIC ROUTES
        const staticUrls = [
            '/',
            '/shop',
            '/about',
        ]

        const staticXml = staticUrls
            .map(
                (path) => `
    <url>
      <loc>${BASE_URL}${path}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    `
            )
            .join('')

        // 🔹 EXAMPLE DYNAMIC ROUTES (SAFE – no fetch yet)
        const productXml = `
      <url>
        <loc>${BASE_URL}/raspberry-imported/283</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
    `

        const categoryXml = `
      <url>
        <loc>${BASE_URL}/shop/blends/2/exotic-fruits/5</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticXml}
  ${productXml}
  ${categoryXml}
</urlset>`

        res.setHeader('Content-Type', 'text/xml')
        res.status(200).send(sitemap)
    } catch (error) {
        console.error('SITEMAP ERROR:', error)
        res.status(500).json({ error: 'Sitemap generation failed' })
    }
}

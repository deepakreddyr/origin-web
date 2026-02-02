import { GetServerSideProps } from 'next';

const EXTERNAL_DATA_URL = 'https://originfresh.in';

function generateSiteMap(originApiData: any) {
    const { categories, blogs, recipes } = originApiData;
    const baseUrl = 'https://originfresh.in';

    // Static pages
    const staticPages = [
        '',
        '/shop',
        '/about',
        '/privacy-policy',
        '/refund-policy',
        '/terms-and-conditions',
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static URLs -->
     ${staticPages
            .map((path) => {
                return `
       <url>
           <loc>${baseUrl}${path}</loc>
           <changefreq>daily</changefreq>
           <priority>${path === '' ? '1.0' : '0.8'}</priority>
       </url>
     `;
            })
            .join('')}
   </urlset>
 `;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
        const request = await fetch(`${EXTERNAL_DATA_URL}/api/originApi`);
        const originApiData = await request.json();

        // Generate the XML sitemap with the data
        const sitemap = generateSiteMap(originApiData);

        res.setHeader('Content-Type', 'text/xml');
        // we send the XML to the browser
        res.write(sitemap);
        res.end();

        return {
            props: {},
        };
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.statusCode = 500;
        res.end();
        return {
            props: {},
        };
    }
};

export default SiteMap;

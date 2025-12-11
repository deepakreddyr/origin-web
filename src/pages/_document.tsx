import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon and Apple Touch Icons */}
        <link rel="shortcut icon" href="/cfavicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/capple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/cfavicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/cfavicon-16x16.png" />

        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '637574582695341');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=637574582695341&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel */}
      </Head>
      <body style={{ backgroundColor: '#FFF9E5' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
export default () => (
  <>
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    {/*<meta httpEquiv="Content-Security-Policy" content="default-src 'self' https://*.ridi.io; script-src 'self' 'unsafe-inline'; style-src 'self'; img-src 'self' data: https://*.ridibooks.com;"/>*/}
    <meta charSet="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0"
    />
    <meta name="theme-color" content="#339CF2" />
    <meta
      name="msapplication-TileImage"
      content={`${publicRuntimeConfig.STATIC_CDN_URL}/static/favicon/favicon_win8.png`}
    />
    <meta name="msapplication-TileColor" content="#1f8ee6" />
  </>
);

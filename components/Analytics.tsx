let Analytics: () => JSX.Element | null = () => {
  return null;
};

if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
  Analytics = function Analytics() {
    return (
      <>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS});`,
          }}
        />
      </>
    );
  };
}

export { Analytics };

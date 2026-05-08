import Script from "next/script";

/**
 * GA4 z Consent Mode default-deny — zgodne z GDPR bez cookie banera.
 * Tracking jest "consent mode signal" (anonimowe agregaty), bez cookies
 * trackingowych. Jeśli kiedyś dodamy banner, można zaktualizować consent
 * przez gtag('consent', 'update', { analytics_storage: 'granted' }).
 */
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  );
}

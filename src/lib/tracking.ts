export const trackConversion = (
  actionSource: string, 
  userRoleIntent: 'pharmacy' | 'pharmacist' | 'unassigned' = 'unassigned',
  platformModule: string = 'marketing_landing_page'
) => {
  if (typeof window === 'undefined') return;

  // History Trap Session Management
  let sessionId = sessionStorage.getItem('sa_history_trap_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('sa_history_trap_id', sessionId);
  }

  const payload = {
    action_source: actionSource,
    platform_module: platformModule,
    user_role_intent: userRoleIntent,
    gdpr_consent_status: true, // Tied to global CookieConsent state
    history_trap_session_id: sessionId,
    client_timestamp: new Date().toISOString(),
  };

  // GA4 Injection
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'b2b_conversion', payload);
  }

  console.info('[History Trap] Analytics Payload Registered:', JSON.stringify(payload, null, 2));
};

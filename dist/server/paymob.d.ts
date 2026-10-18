/**
 * Resolve Paymob configuration from private env vars.
 * @returns {{ baseUrl: string, secretKey: string, publicKey: string, integrationIds: number[], hmacSecret: string }}
 */
export function paymobConfig(): {
    baseUrl: string;
    secretKey: string;
    publicKey: string;
    integrationIds: number[];
    hmacSecret: string;
};
/**
 * Supabase client using the service role key. Server-side only (webhook writes,
 * session verification). Bypasses RLS, so never expose it to the browser.
 * @returns {any}
 */
export function getAdminClient(): any;
/**
 * Create a Paymob payment intention (Intention API) and build the
 * Unified Checkout redirect URL from the returned client_secret.
 *
 * @param {{ amountCents: number, currency: string, orderId: string, items: Array<{ name: string, amount: number, quantity: number }>, billingData: object, notificationUrl: string, redirectionUrl: string }} params
 * @returns {Promise<{ intentionId: string, clientSecret: string, checkoutUrl: string }>}
 */
export function createPaymobIntention({ amountCents, currency, orderId, items, billingData, notificationUrl, redirectionUrl }: {
    amountCents: number;
    currency: string;
    orderId: string;
    items: Array<{
        name: string;
        amount: number;
        quantity: number;
    }>;
    billingData: object;
    notificationUrl: string;
    redirectionUrl: string;
}): Promise<{
    intentionId: string;
    clientSecret: string;
    checkoutUrl: string;
}>;
/**
 * Verify a Paymob webhook callback HMAC (SHA-512, lowercase hex).
 *
 * @param {{ obj: any, hmac: string }} params
 * @returns {boolean}
 */
export function verifyPaymobHmac({ obj, hmac }: {
    obj: any;
    hmac: string;
}): boolean;
/** @returns {string} */
export function newOrderId(): string;

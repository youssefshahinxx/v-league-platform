import { createClient } from '@supabase/supabase-js';
import { createHmac, randomUUID } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

const SUPABASE_URL = PUBLIC_SUPABASE_URL.replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');

/**
 * Resolve Paymob configuration from private env vars.
 * @returns {{ baseUrl: string, secretKey: string, publicKey: string, integrationIds: number[], hmacSecret: string }}
 */
export function paymobConfig() {
    const required = ['PAYMOB_SECRET_KEY', 'PAYMOB_PUBLIC_KEY', 'PAYMOB_INTEGRATION_ID', 'PAYMOB_HMAC_SECRET'];
    const missing = required.filter((key) => !env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing Paymob configuration: ${missing.join(', ')}`);
    }

    return {
        baseUrl: (env.PAYMOB_BASE_URL || 'https://accept.paymob.com').replace(/\/+$/, ''),
        secretKey: env.PAYMOB_SECRET_KEY,
        publicKey: env.PAYMOB_PUBLIC_KEY,
        integrationIds: env.PAYMOB_INTEGRATION_ID.split(',').map((value) => value.trim()).filter(Boolean).map(Number),
        hmacSecret: env.PAYMOB_HMAC_SECRET
    };
}

/** @type {any} */
let adminClient = null;

/**
 * Supabase client using the service role key. Server-side only (webhook writes,
 * session verification). Bypasses RLS, so never expose it to the browser.
 * @returns {any}
 */
export function getAdminClient() {
    if (adminClient) return adminClient;

    if (!env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in server environment');
    }

    adminClient = createClient(SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });

    return adminClient;
}

/**
 * Create a Paymob payment intention (Intention API) and build the
 * Unified Checkout redirect URL from the returned client_secret.
 *
 * @param {{ amountCents: number, currency: string, orderId: string, items: Array<{ name: string, amount: number, quantity: number }>, billingData: object, notificationUrl: string, redirectionUrl: string }} params
 * @returns {Promise<{ intentionId: string, clientSecret: string, checkoutUrl: string }>}
 */
export async function createPaymobIntention({ amountCents, currency, orderId, items, billingData, notificationUrl, redirectionUrl }) {
    const config = paymobConfig();

    const response = await fetch(`${config.baseUrl}/v1/intention/`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${config.secretKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amountCents,
            currency,
            payment_methods: config.integrationIds,
            items,
            billing_data: billingData,
            special_reference: orderId,
            notification_url: notificationUrl,
            redirection_url: redirectionUrl,
            extras: { order_id: orderId }
        })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const detail = typeof data?.detail === 'string' ? data.detail : JSON.stringify(data);
        throw new Error(`Paymob intention failed (${response.status}): ${detail}`);
    }

    if (!data.client_secret) {
        throw new Error('Paymob intention returned no client_secret');
    }

    return {
        intentionId: data.id,
        clientSecret: data.client_secret,
        checkoutUrl: `${config.baseUrl}/unifiedcheckout/?publicKey=${encodeURIComponent(config.publicKey)}&clientSecret=${encodeURIComponent(data.client_secret)}`
    };
}

/**
 * Field concatenation order for the Transaction Processed callback,
 * documented by Paymob (not alphabetical).
 */
const HMAC_FIELDS = [
    'amount_cents',
    'created_at',
    'currency',
    'error_occured',
    'has_parent_transaction',
    'id',
    'integration_id',
    'is_3d_secure',
    'is_auth',
    'is_capture',
    'is_refunded',
    'is_standalone_payment',
    'is_voided',
    'order.id',
    'owner',
    'pending',
    'source_data.pan',
    'source_data.sub_type',
    'source_data.type',
    'success'
];

/**
 * Verify a Paymob webhook callback HMAC (SHA-512, lowercase hex).
 *
 * @param {{ obj: any, hmac: string }} params
 * @returns {boolean}
 */
export function verifyPaymobHmac({ obj, hmac }) {
    let config;
    try {
        config = paymobConfig();
    } catch {
        return false;
    }

    const concatenated = HMAC_FIELDS.map((path) => {
        const [parent, child] = path.split('.');
        const value = child ? obj?.[parent]?.[child] : obj?.[parent];
        return value === null || value === undefined ? '' : String(value);
    }).join('');

    const digest = createHmac('sha512', config.hmacSecret).update(concatenated).digest('hex');
    return digest === hmac;
}

/** @returns {string} */
export function newOrderId() {
    return randomUUID();
}
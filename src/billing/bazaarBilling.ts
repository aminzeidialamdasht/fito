/**
 * اتصال به پلاگین کافه‌بازار (Poolakey)
 * @salarizadi/capacitor-cafebazaar-poolakey
 */

import { CafebazaarPoolakey } from '@salarizadi/capacitor-cafebazaar-poolakey';
import { BILLING_CONFIG } from './billingConfig';
import type { Product, Purchase } from './types';

const RSA_KEY = BILLING_CONFIG.bazaar.rsaKey;

/**
 * مقداردهی اولیه
 */
export async function initializeBazaarBilling(): Promise<void> {
  try {
    if (!RSA_KEY) {
      console.warn('⚠️  Bazaar RSA key not set — billing disabled');
      return;
    }
    await CafebazaarPoolakey.initialize({ rsaPublicKey: RSA_KEY });
    console.log('✅ Bazaar billing initialized');
  } catch (e) {
    console.error('❌ Bazaar billing init failed:', e);
    throw e;
  }
}

/**
 * دریافت محصولات
 */
export async function getBazaarProducts(skus: string[]): Promise<Product[]> {
  try {
    const result = await CafebazaarPoolakey.getProducts({ skus });
    const products = result.products || [];
    return products.map((p) => ({
      sku: p.sku,
      title: p.title,
      price: p.price,
      description: p.description,
      type: 'inapp',
    }));
  } catch (e) {
    console.error('❌ Failed to fetch Bazaar products:', e);
    throw e;
  }
}

/**
 * خرید محصول
 */
export async function purchaseBazaarProduct(sku: string): Promise<Purchase> {
  try {
    const result = await CafebazaarPoolakey.purchaseProduct({
      productId: sku,
      payload: `fito_${sku}_${Date.now()}`,
    });

    if (result.state !== 'PURCHASED' || !result.purchase) {
      throw new Error(`Purchase failed: ${result.state}`);
    }

    return {
      purchaseToken: result.purchase.purchaseToken,
      sku: result.purchase.productId,
      purchaseTime: result.purchase.purchaseTime,
      payload: result.purchase.payload,
      // PurchaseInfo فیلد signature ندارد؛ در Poolakey امضا در payload است
    };
  } catch (e) {
    console.error('❌ Bazaar purchase failed:', e);
    throw e;
  }
}

/**
 * چک خریدهای قبلی
 */
export async function checkBazaarPurchases(): Promise<Purchase[]> {
  try {
    const result = await CafebazaarPoolakey.getPurchaseInfo();
    return (result.purchases || []).map((p) => ({
      purchaseToken: p.purchaseToken,
      sku: p.productId,
      purchaseTime: p.purchaseTime,
      payload: p.payload,
    }));
  } catch (e) {
    console.warn('⚠️  Bazaar getPurchaseInfo failed (offline?):', e);
    return [];
  }
}

/**
 * مصرف خرید
 */
export async function consumeBazaarPurchase(purchaseToken: string): Promise<void> {
  try {
    await CafebazaarPoolakey.consumeProduct({ token: purchaseToken });
  } catch (e) {
    console.error('❌ Bazaar consume failed:', e);
    throw e;
  }
}

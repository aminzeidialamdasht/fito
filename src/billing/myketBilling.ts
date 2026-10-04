/**
 * اتصال به پلاگین مایکت
 * @salarizadi/capacitor-myket
 */

import { Myket } from '@salarizadi/capacitor-myket';
import { BILLING_CONFIG } from './billingConfig';
import type { Product, Purchase } from './types';

const RSA_KEY = BILLING_CONFIG.myket.rsaKey;

/**
 * مقداردهی اولیه
 */
export async function initializeMyketBilling(): Promise<void> {
  try {
    await Myket.initialize({ rsaKey: RSA_KEY });
    console.log('✅ Myket billing initialized');
  } catch (e) {
    console.error('❌ Myket billing init failed:', e);
    throw e;
  }
}

/**
 * دریافت اطلاعات محصولات
 */
export async function getMyketProducts(skus: string[]): Promise<Product[]> {
  try {
    const { products } = await Myket.getProducts({ skus });
    return products.map((p) => ({
      sku: p.sku,
      title: p.title,
      price: p.price,
      description: p.description,
      type: p.type,
    }));
  } catch (e) {
    console.error('❌ Failed to fetch Myket products:', e);
    throw e;
  }
}

/**
 * خرید محصول
 * توجه: purchaseProduct مستقیماً MyketPurchase برمی‌گرداند
 */
export async function purchaseMyketProduct(sku: string): Promise<Purchase> {
  try {
    const result = await Myket.purchaseProduct({
      productId: sku,
      type: 'inapp', // چون در پنل مایکت as inapp ثبت شده
      payload: `fito_${sku}_${Date.now()}`,
    });

    return {
      purchaseToken: result.purchaseToken,
      sku: result.productId,
      purchaseTime: result.purchaseTime,
      payload: result.developerPayload,
      signature: result.signature,
    };
  } catch (e) {
    console.error('❌ Myket purchase failed:', e);
    throw e;
  }
}

/**
 * چک کردن خریدهای قبلی
 * متد صحیح: getPurchaseInfo()
 */
export async function checkMyketPurchases(): Promise<Purchase[]> {
  try {
    const { purchases } = await Myket.getPurchaseInfo();
    return purchases.map((p) => ({
      purchaseToken: p.purchaseToken,
      sku: p.productId,
      purchaseTime: p.purchaseTime,
      payload: p.developerPayload,
      signature: p.signature,
    }));
  } catch (e) {
    console.warn('⚠️  Myket getPurchaseInfo failed (offline?):', e);
    return [];
  }
}

/**
 * مصرف خرید (برای consumable)
 */
export async function consumeMyketPurchase(purchaseToken: string): Promise<void> {
  try {
    await Myket.consumeProduct({ token: purchaseToken });
  } catch (e) {
    console.error('❌ Myket consume failed:', e);
    throw e;
  }
}

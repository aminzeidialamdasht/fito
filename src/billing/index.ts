/**
 * API واحد Billing — انتخاب provider بر اساس flavor
 */

import { APP_FLAVOR, IS_PERSONAL, currentBilling } from './billingConfig';
import * as Myket from './myketBilling';
import * as Bazaar from './bazaarBilling';
import type { Product, Purchase } from './types';

export * from './types';
export * from './subscription';
export * from './billingConfig';

/**
 * مقداردهی اولیه billing
 */
export async function initializeBilling(): Promise<void> {
  if (IS_PERSONAL) {
    console.log('ℹ️  Personal flavor — billing bypassed');
    return;
  }

  if (APP_FLAVOR === 'myket') {
    await Myket.initializeMyketBilling();
  } else if (APP_FLAVOR === 'bazaar') {
    await Bazaar.initializeBazaarBilling();
  }
}

/**
 * دریافت محصولات
 */
export async function fetchProducts(skus: string[]): Promise<Product[]> {
  if (IS_PERSONAL) return [];
  if (APP_FLAVOR === 'myket') return Myket.getMyketProducts(skus);
  if (APP_FLAVOR === 'bazaar') return Bazaar.getBazaarProducts(skus);
  return [];
}

/**
 * خرید
 */
export async function purchase(sku: string): Promise<Purchase> {
  if (IS_PERSONAL) {
    // نسخه شخصی — بدون خرید، مستقیم فعال
    return {
      purchaseToken: 'personal_bypass',
      sku,
      purchaseTime: Date.now(),
    };
  }
  if (APP_FLAVOR === 'myket') return Myket.purchaseMyketProduct(sku);
  if (APP_FLAVOR === 'bazaar') return Bazaar.purchaseBazaarProduct(sku);
  throw new Error('Unknown billing provider');
}

/**
 * چک کردن خریدهای قبلی (در هر بار باز شدن اپ)
 */
export async function checkExistingPurchases(): Promise<Purchase[]> {
  if (IS_PERSONAL) return [];
  if (APP_FLAVOR === 'myket') return Myket.checkMyketPurchases();
  if (APP_FLAVOR === 'bazaar') return Bazaar.checkBazaarPurchases();
  return [];
}

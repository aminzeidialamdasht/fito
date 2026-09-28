package com.aifitness.coach

import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import ir.cafebazaar.poolakey.Connection
import ir.cafebazaar.poolakey.Payment
import ir.cafebazaar.poolakey.config.PaymentConfiguration
import ir.cafebazaar.poolakey.config.SecurityCheck
import ir.cafebazaar.poolakey.callback.ConnectionCallback
import ir.cafebazaar.poolakey.request.PurchaseRequest

/**
 * پل بین وب‌اپ (React) و کتابخانه Poolakey کافه بازار.
 * متدها: isAvailable / getActiveSubscriptions / subscribe
 */
@CapacitorPlugin(name = "CafeBazaarBilling")
class CafeBazaarBillingPlugin : Plugin() {

    private var payment: Payment? = null
    private var connection: Connection? = null

    private fun rsaKey(): String {
        val id = context.resources.getIdentifier("bazaar_rsa_key", "string", context.packageName)
        return if (id != 0) context.getString(id).trim() else ""
    }

    private fun ensurePayment(): Payment {
        payment?.let { return it }
        val key = rsaKey()
        val security = if (key.isNotEmpty()) SecurityCheck.Enable(key) else SecurityCheck.Disable
        val p = Payment(context, PaymentConfiguration(localSecurityCheck = security))
        payment = p
        return p
    }

    /** اتصال تازه برقرار می‌کند و سپس block را اجرا می‌کند. */
    private fun withConnection(call: PluginCall, block: (Payment) -> Unit) {
        val p = ensurePayment()
        connection?.disconnect()
        connection = p.connect {
            connectionSucceed { block(p) }
            connectionFailed { call.reject("BAZAAR_CONNECTION_FAILED") }
            disconnected { }
        }
    }

    @PluginMethod
    fun isAvailable(call: PluginCall) {
        val installed = try {
            context.packageManager.getPackageInfo("com.farsitel.bazaar", 0)
            true
        } catch (e: Exception) {
            false
        }
        call.resolve(JSObject().put("available", installed))
    }

    @PluginMethod
    fun getActiveSubscriptions(call: PluginCall) {
        withConnection(call) { p ->
            p.getSubscribedProducts {
                querySucceed { list ->
                    val arr = JSArray()
                    list.forEach { purchase -> arr.put(purchase.productId) }
                    call.resolve(JSObject().put("skus", arr))
                    connection?.disconnect()
                }
                queryFailed { call.reject("BAZAAR_QUERY_FAILED") }
            }
        }
    }

    @PluginMethod
    fun subscribe(call: PluginCall) {
        val sku = call.getString("sku") ?: return call.reject("SKU_REQUIRED")
        val activity = activity ?: return call.reject("NO_ACTIVITY")
        withConnection(call) { p ->
            p.subscribeProduct(
                activity.activityResultRegistry,
                PurchaseRequest(productId = sku, payload = "")
            ) {
                purchaseSucceed { purchase ->
                    call.resolve(
                        JSObject().put("sku", purchase.productId).put("purchaseToken", purchase.purchaseToken)
                    )
                }
                purchaseCanceled { call.reject("USER_CANCELED") }
                purchaseFailed { call.reject("PURCHASE_FAILED") }
                failedToBeginFlow { call.reject("FLOW_FAILED") }
            }
        }
    }
}

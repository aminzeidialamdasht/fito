package com.coachino.myket

import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/**
 * پل بین وب‌اپ (React) و کتابخانه پرداخت مایکت.
 *
 * ⚠️ توجه: پیاده‌سازی کامل نیازمند SDK رسمی مایکت است.
 * این فایل فعلاً به‌عنوان placeholder ساخته شده و باید بعداً
 * با SDK واقعی مایکت تکمیل شود.
 *
 * کلید RSA از string resource به نام myket_rsa_key خوانده می‌شود
 * که در زمان build توسط اسکریپت patch-android-billing-myket.py
 * از secret به اپ تزریق می‌شود.
 */
@CapacitorPlugin(name = "MyketBilling")
class MyketBillingPlugin : Plugin() {

    private fun rsaKey(): String {
        val id = context.resources.getIdentifier("myket_rsa_key", "string", context.packageName)
        return if (id != 0) context.getString(id).trim() else ""
    }

    @PluginMethod
    fun isAvailable(call: PluginCall) {
        val installed = try {
            context.packageManager.getPackageInfo("ir.mservices.market", 0)
            true
        } catch (e: Exception) {
            false
        }
        call.resolve(JSObject().put("available", installed))
    }

    @PluginMethod
    fun getActiveSubscriptions(call: PluginCall) {
        val arr = JSArray()
        call.resolve(JSObject().put("skus", arr))
    }

    @PluginMethod
    fun subscribe(call: PluginCall) {
        val sku = call.getString("sku") ?: return call.reject("SKU_REQUIRED")
        call.reject("MYKET_NOT_IMPLEMENTED_YET")
    }
}

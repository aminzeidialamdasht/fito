#!/usr/bin/env python3
"""
بعد از `npx cap add android` اجرا شود.
پلاگین پرداخت کافه بازار (Poolakey) را به پروژه اندروید تولیدشده اضافه می‌کند:
  - jitpack + Poolakey + Kotlin در gradle
  - کپی پلاگین Kotlin و ثبت آن در MainActivity
  - مجوز و <queries> بازار در AndroidManifest
  - کلید RSA بازار (از متغیر محیطی BAZAAR_RSA_KEY) به‌صورت string resource
"""
import os, re, pathlib, shutil

root = pathlib.Path(__file__).resolve().parent.parent
android = root / "android"
pkg_dir = android / "app/src/main/java/com/aifitness/coach"

# 1) root build.gradle: kotlin plugin + jitpack
p = android / "build.gradle"
s = p.read_text()
if "kotlin-gradle-plugin" not in s:
    s = s.replace("dependencies {", "dependencies {\n        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.0'", 1)
if "jitpack.io" not in s:
    s = s.replace("mavenCentral()", "mavenCentral()\n        maven { url 'https://jitpack.io' }")
p.write_text(s)

# 2) app/build.gradle: kotlin + poolakey
p = android / "app/build.gradle"
s = p.read_text()
if "kotlin-android" not in s:
    s = s.replace("apply plugin: 'com.android.application'",
                  "apply plugin: 'com.android.application'\napply plugin: 'kotlin-android'", 1)
if "Poolakey" not in s:
    s = s.replace("dependencies {",
                  "dependencies {\n    implementation 'com.github.cafebazaar.Poolakey:poolakey:2.2.0'", 1)
# versionCode / versionName (کافه بازار هر آپلود جدید را با versionCode بزرگ‌تر می‌خواهد)
vc = os.environ.get("VERSION_CODE", "").strip()
vn = os.environ.get("VERSION_NAME", "").strip()
if vc.isdigit():
    s = re.sub(r"versionCode\s+\d+", "versionCode " + vc, s)
if vn:
    s = re.sub(r'versionName\s+"[^"]*"', 'versionName "' + vn + '"', s)

# امضای release با keystore (مقادیر از متغیر محیطی موقع بیلد خوانده می‌شود، نه ذخیره در فایل)
if "signingConfigs" not in s:
    s += """

android {
    signingConfigs {
        release {
            if (System.getenv("KEYSTORE_PATH")) {
                storeFile file(System.getenv("KEYSTORE_PATH"))
                storePassword System.getenv("KEYSTORE_PASSWORD")
                keyAlias System.getenv("KEY_ALIAS")
                keyPassword System.getenv("KEY_PASSWORD")
            }
        }
    }
    buildTypes {
        release {
            if (System.getenv("KEYSTORE_PATH")) {
                signingConfig signingConfigs.release
            }
        }
    }
}
"""
p.write_text(s)

# 3) plugin + MainActivity registration
shutil.copy(root / "android-billing/CafeBazaarBillingPlugin.kt", pkg_dir / "CafeBazaarBillingPlugin.kt")
(pkg_dir / "MainActivity.java").write_text("""package com.aifitness.coach;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CafeBazaarBillingPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
""")

# 4) manifest
p = android / "app/src/main/AndroidManifest.xml"
s = p.read_text()
if "PAY_THROUGH_BAZAAR" not in s:
    s = s.replace("<application", '<queries>\n        <package android:name="com.farsitel.bazaar" />\n    </queries>\n\n    <application', 1)
    s = s.replace("</manifest>", '    <uses-permission android:name="com.farsitel.bazaar.permission.PAY_THROUGH_BAZAAR" />\n</manifest>')
p.write_text(s)

# 5) RSA key resource
key = os.environ.get("BAZAAR_RSA_KEY", "").strip()
vals = android / "app/src/main/res/values"
vals.mkdir(parents=True, exist_ok=True)
(vals / "bazaar.xml").write_text(
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <string name="bazaar_rsa_key" translatable="false">%s</string>\n</resources>\n' % key
)
print("✅ Cafe Bazaar billing patched into android project" + ("" if key else " (WARNING: BAZAAR_RSA_KEY is empty)"))

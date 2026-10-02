#!/usr/bin/env python3
"""
بعد از `npx cap add android` اجرا شود.
پلاگین پرداخت مایکت را به پروژه اندروید تولیدشده اضافه می‌کند:
  - Kotlin plugin در gradle
  - کپی پلاگین Kotlin و ثبت آن در MainActivity
  - مجوز و <queries> مایکت در AndroidManifest
  - کلید RSA مایکت (از متغیر محیطی MYKET_RSA_KEY) به‌صورت string resource
"""
import os, re, pathlib, shutil

root = pathlib.Path(__file__).resolve().parent.parent
android = root / "android"

# ⚠️ appId مایکت: com.coachino.myket
PKG_PATH = "com/coachino/myket"
pkg_dir = android / "app/src/main/java" / PKG_PATH

# اطمینان از وجود پوشه پکیج (حیاتی!)
pkg_dir.mkdir(parents=True, exist_ok=True)

# 1) root build.gradle: kotlin plugin
p = android / "build.gradle"
s = p.read_text()
if "kotlin-gradle-plugin" not in s:
    s = s.replace("dependencies {", "dependencies {\n        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.0'", 1)
p.write_text(s)

# 2) app/build.gradle: kotlin
p = android / "app/build.gradle"
s = p.read_text()
if "kotlin-android" not in s:
    s = s.replace("apply plugin: 'com.android.application'",
                  "apply plugin: 'com.android.application'\napply plugin: 'kotlin-android'", 1)
# versionCode / versionName
vc = os.environ.get("VERSION_CODE", "").strip()
vn = os.environ.get("VERSION_NAME", "").strip()
if vc.isdigit():
    s = re.sub(r"versionCode\s+\d+", "versionCode " + vc, s)
if vn:
    s = re.sub(r'versionName\s+"[^"]*"', 'versionName "' + vn + '"', s)

# امضای release با keystore
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
shutil.copy(root / "android-billing/MyketBillingPlugin.kt", pkg_dir / "MyketBillingPlugin.kt")
(pkg_dir / "MainActivity.java").write_text("""package com.coachino.myket;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(MyketBillingPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
""")

# 4) manifest — مایکت
p = android / "app/src/main/AndroidManifest.xml"
s = p.read_text()
if "ir.mservices.market" not in s:
    s = s.replace("<application", '<queries>\n        <package android:name="ir.mservices.market" />\n    </queries>\n\n    <application', 1)
    s = s.replace("</manifest>", '    <uses-permission android:name="ir.mservices.market.permission.PAY_THROUGH_MARKET" />\n</manifest>')
p.write_text(s)

# 5) RSA key resource
key = os.environ.get("MYKET_RSA_KEY", "").strip()
vals = android / "app/src/main/res/values"
vals.mkdir(parents=True, exist_ok=True)
(vals / "myket.xml").write_text(
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <string name="myket_rsa_key" translatable="false">%s</string>\n</resources>\n' % key
)
print("✅ Myket billing patched into android project" + ("" if key else " (WARNING: MYKET_RSA_KEY is empty)"))

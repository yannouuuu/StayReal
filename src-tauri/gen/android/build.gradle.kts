buildscript {
  repositories {
    google()
    mavenCentral()
  }
  dependencies {
    classpath("com.android.tools.build:gradle:8.7.2")
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.25")
    // TODO: Implement alternative push notification using Firebase FCM
    // classpath("com.google.gms:google-services:4.4.1")
  }
}

allprojects {
  repositories {
    google()
    mavenCentral()
  }
}

tasks.register("clean").configure {
  delete("build")
}

import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Animated,
  Easing,
  Image,
  I18nManager,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";

const APP_NAME = "PayPop";
const APP_VERSION = "1.0.0";

const POINTS_PER_USD = 100000;
const MIN_WITHDRAW_POINTS = 1000000;

const STORAGE = {
  USER: "@paypop_user",
  USERS: "@paypop_users",
  LANGUAGE: "@paypop_language",
  DARK_MODE: "@paypop_dark_mode",
  CURRENCY: "@paypop_currency",
  FIRST_LAUNCH: "@paypop_first_launch",
};

const SUPPORT_WHATSAPP = "213667814377";
const SUPPORT_URL = "https://wa.me/213667814377";

const DAILY_REWARDS = [
  50,
  75,
  100,
  125,
  150,
  200,
  250,
];

// PayPop sound system — local assets, safe fallback if audio fails
const PAYPOP_SOUNDS = {
  click: require("./paypop_click.wav"),
  reward: require("./paypop_reward.wav"),
  spin: require("./paypop_spin.wav"),
  win: require("./paypop_win.wav"),
};

const payPopSoundPool = {};

async function loadPayPopSounds() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    for (const [name, source] of Object.entries(PAYPOP_SOUNDS)) {
      if (!payPopSoundPool[name]) {
        const result = await Audio.Sound.createAsync(source, {
          volume: 0.75,
          shouldPlay: false,
        });
        payPopSoundPool[name] = result.sound;
      }
    }
  } catch (error) {
    console.log("PayPop sound load skipped:", error?.message || error);
  }
}

async function playPayPopSound(name) {
  try {
    const sound = payPopSoundPool[name];
    if (!sound) return;
    await sound.replayAsync();
  } catch (error) {}
}

async function unloadPayPopSounds() {
  for (const name of Object.keys(payPopSoundPool)) {
    try {
      await payPopSoundPool[name]?.unloadAsync();
    } catch (error) {}
    delete payPopSoundPool[name];
  }
}

const REFERRAL_REWARDS = [
  250,
  450,
  500,
  600,
  700,
  800,
  900,
  800,
  750,
  700,
];

const CURRENCIES = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    usdRate: 1,
  },
  DZD: {
    code: "DZD",
    symbol: "دج",
    name: "Algerian Dinar",
    usdRate: 135,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    usdRate: 0.92,
  },
};

const WITHDRAW_METHODS = [
  {
    id: "paypal",
    name: "PayPal",
    field: "email",
    placeholder: "PayPal Email",
    brand: "paypal",
  },
  {
    id: "binance",
    name: "Binance",
    field: "uid",
    placeholder: "Binance UID",
    brand: "binance",
  },
  {
    id: "redotpay",
    name: "RedotPay",
    field: "uid",
    placeholder: "RedotPay UID",
    brand: "redotpay",
  },
  {
    id: "baridimob",
    name: "BaridiMob",
    field: "rip",
    placeholder: "RIP / CCP",
    brand: "baridimob",
  },
  {
    id: "freefire",
    name: "Free Fire",
    field: "id",
    placeholder: "Free Fire ID",
    brand: "freefire",
  },
  {
    id: "pubg",
    name: "PUBG",
    field: "id",
    placeholder: "PUBG ID",
    brand: "pubg",
  },
];

const TRANSLATIONS = {
  ar: {
    appName: "PayPop",

    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    logout: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    continue: "متابعة",
    createAccount: "إنشاء حساب جديد",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    noAccount: "ليس لديك حساب؟",

    home: "الرئيسية",
    earn: "إربح",
    wallet: "المحفظة",
    profile: "حسابي",

    welcome: "مرحبا بك في",
    welcomeSubtitle: "اربح النقاط واستبدلها بمكافآت حقيقية",
    totalBalance: "الرصيد الإجمالي",
    availableBalance: "الرصيد المتاح",
    points: "نقطة",
    usd: "دولار",

    earnNow: "إربح الآن",
    dailyReward: "المكافأة اليومية",
    wheel: "عجلة الحظ",
    watchVideo: "شاهد الفيديو",
    games: "الألعاب",
    inviteFriends: "دعوة الأصدقاء",
    specialReward: "مكافأة خاصة",

    claim: "استلام",
    claimed: "تم الاستلام",
    spin: "دور الآن",
    freeSpin: "دورة مجانية",
    nextSpin: "الدورة القادمة",
    watch: "مشاهدة",
    invite: "دعوة",

    walletTitle: "المحفظة",
    withdraw: "سحب الأرباح",
    withdrawalHistory: "سجل السحوبات",
    minimumWithdraw: "الحد الأدنى للسحب",
    selectMethod: "اختر طريقة السحب",
    enterDetails: "أدخل بيانات السحب",
    amount: "المبلغ",
    submitWithdrawal: "طلب السحب",
    pending: "قيد المراجعة",
    completed: "مكتمل",
    rejected: "مرفوض",

    profileTitle: "حسابي",
    personalInfo: "المعلومات الشخصية",
    referral: "الإحالة",
    referralCode: "كود الإحالة",
    referralLink: "رابط الدعوة",
    copyCode: "نسخ الكود",
    share: "مشاركة",
    referrals: "الأصدقاء المدعوون",
    referralEarnings: "أرباح الإحالة",

    language: "اللغة",
    currency: "العملة",
    darkMode: "الوضع الداكن",
    support: "الدعم",
    helpCenter: "مركز المساعدة",
    about: "عن PayPop",

    arabic: "العربية",
    french: "Français",
    english: "English",

    usdCurrency: "الدولار الأمريكي",
    dzdCurrency: "الدينار الجزائري",
    eurCurrency: "اليورو",

    changePhoto: "تغيير الصورة",
    choosePhoto: "اختيار صورة",
    cancel: "إلغاء",
    confirm: "تأكيد",
    save: "حفظ",
    close: "إغلاق",
    back: "رجوع",

    success: "تمت العملية",
    error: "حدث خطأ",
    warning: "تنبيه",

    invalidEmail: "أدخل بريداً إلكترونياً صحيحاً",
    passwordShort: "كلمة المرور قصيرة جداً",
    passwordsNotMatch: "كلمتا المرور غير متطابقتين",
    invalidLogin: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    emailExists: "هذا البريد مسجل مسبقاً",
    accountCreated: "تم إنشاء الحساب بنجاح",
    loginSuccess: "تم تسجيل الدخول بنجاح",

    insufficientBalance: "رصيدك غير كافٍ",
    minimumIs: "الحد الأدنى للسحب هو",
    withdrawalSent: "تم إرسال طلب السحب بنجاح",

    referralInvalid: "كود الإحالة غير صحيح",
    referralSuccess: "تم تطبيق كود الإحالة",

    dailyAlreadyClaimed: "لقد استلمت مكافأة اليوم",
    dailyAvailableTomorrow: "المكافأة القادمة متاحة بعد 24 ساعة",

    supportText: "إذا واجهتك أي مشكلة، تواصل معنا عبر WhatsApp.",

    welcomeToPayPop: "أهلاً بك في PayPop",
    earnMore: "اربح المزيد",
    secureRewards: "مكافآت بسيطة وآمنة",

    google: "المتابعة باستخدام Google",
    facebook: "المتابعة باستخدام Facebook",

    pointsPerDollar: "100,000 نقطة = $1",
    minWithdrawText: "الحد الأدنى للسحب 1,000,000 نقطة",

    noWithdrawals: "لا توجد عمليات سحب حتى الآن",
    noReferrals: "لا توجد إحالات حتى الآن",

    version: "الإصدار",
    paypopCoin: "PayPop Coin",
  },

  fr: {
    appName: "PayPop",

    login: "Connexion",
    signup: "Créer un compte",
    logout: "Déconnexion",
    email: "E-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    continue: "Continuer",
    createAccount: "Créer un nouveau compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    noAccount: "Vous n'avez pas de compte ?",

    home: "Accueil",
    earn: "Gagner",
    wallet: "Portefeuille",
    profile: "Profil",

    welcome: "Bienvenue sur",
    welcomeSubtitle: "Gagnez des points et échangez-les contre des récompenses",
    totalBalance: "Solde total",
    availableBalance: "Solde disponible",
    points: "points",
    usd: "dollar",

    earnNow: "Gagner maintenant",
    dailyReward: "Récompense quotidienne",
    wheel: "Roue de la chance",
    watchVideo: "Regarder une vidéo",
    games: "Jeux",
    inviteFriends: "Inviter des amis",
    specialReward: "Récompense spéciale",

    claim: "Réclamer",
    claimed: "Réclamée",
    spin: "Tourner",
    freeSpin: "Tour gratuit",
    nextSpin: "Prochain tour",
    watch: "Regarder",
    invite: "Inviter",

    walletTitle: "Portefeuille",
    withdraw: "Retirer les gains",
    withdrawalHistory: "Historique des retraits",
    minimumWithdraw: "Retrait minimum",
    selectMethod: "Choisir le moyen de retrait",
    enterDetails: "Entrer les informations",
    amount: "Montant",
    submitWithdrawal: "Demander le retrait",
    pending: "En attente",
    completed: "Terminé",
    rejected: "Refusé",

    profileTitle: "Mon profil",
    personalInfo: "Informations personnelles",
    referral: "Parrainage",
    referralCode: "Code de parrainage",
    referralLink: "Lien d'invitation",
    copyCode: "Copier le code",
    share: "Partager",
    referrals: "Amis invités",
    referralEarnings: "Gains de parrainage",

    language: "Langue",
    currency: "Devise",
    darkMode: "Mode sombre",
    support: "Support",
    helpCenter: "Centre d'aide",
    about: "À propos de PayPop",

    arabic: "العربية",
    french: "Français",
    english: "English",

    usdCurrency: "Dollar américain",
    dzdCurrency: "Dinar algérien",
    eurCurrency: "Euro",

    changePhoto: "Changer la photo",
    choosePhoto: "Choisir une photo",
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Enregistrer",
    close: "Fermer",
    back: "Retour",

    success: "Succès",
    error: "Erreur",
    warning: "Attention",

    invalidEmail: "Entrez un e-mail valide",
    passwordShort: "Le mot de passe est trop court",
    passwordsNotMatch: "Les mots de passe ne correspondent pas",
    invalidLogin: "E-mail ou mot de passe incorrect",
    emailExists: "Cet e-mail est déjà enregistré",
    accountCreated: "Compte créé avec succès",
    loginSuccess: "Connexion réussie",

    insufficientBalance: "Solde insuffisant",
    minimumIs: "Le retrait minimum est",
    withdrawalSent: "Demande de retrait envoyée",

    referralInvalid: "Code de parrainage invalide",
    referralSuccess: "Code de parrainage appliqué",

    dailyAlreadyClaimed: "Vous avez déjà reçu la récompense aujourd'hui",
    dailyAvailableTomorrow: "La prochaine récompense sera disponible dans 24 heures",

    supportText: "Si vous rencontrez un problème, contactez-nous via WhatsApp.",

    welcomeToPayPop: "Bienvenue sur PayPop",
    earnMore: "Gagnez plus",
    secureRewards: "Des récompenses simples et sécurisées",

    google: "Continuer avec Google",
    facebook: "Continuer avec Facebook",

    pointsPerDollar: "100 000 points = 1 $",
    minWithdrawText: "Retrait minimum : 1 000 000 points",

    noWithdrawals: "Aucun retrait pour le moment",
    noReferrals: "Aucun parrainage pour le moment",

    version: "Version",
    paypopCoin: "PayPop Coin",
  },

  en: {
    appName: "PayPop",

    login: "Login",
    signup: "Create account",
    logout: "Logout",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    forgotPassword: "Forgot password?",
    continue: "Continue",
    createAccount: "Create a new account",
    alreadyHaveAccount: "Already have an account?",
    noAccount: "Don't have an account?",

    home: "Home",
    earn: "Earn",
    wallet: "Wallet",
    profile: "Profile",

    welcome: "Welcome to",
    welcomeSubtitle: "Earn points and exchange them for real rewards",
    totalBalance: "Total balance",
    availableBalance: "Available balance",
    points: "points",
    usd: "dollar",

    earnNow: "Earn now",
    dailyReward: "Daily reward",
    wheel: "Lucky wheel",
    watchVideo: "Watch video",
    games: "Games",
    inviteFriends: "Invite friends",
    specialReward: "Special reward",

    claim: "Claim",
    claimed: "Claimed",
    spin: "Spin",
    freeSpin: "Free spin",
    nextSpin: "Next spin",
    watch: "Watch",
    invite: "Invite",

    walletTitle: "Wallet",
    withdraw: "Withdraw earnings",
    withdrawalHistory: "Withdrawal history",
    minimumWithdraw: "Minimum withdrawal",
    selectMethod: "Select withdrawal method",
    enterDetails: "Enter withdrawal details",
    amount: "Amount",
    submitWithdrawal: "Submit withdrawal",
    pending: "Pending",
    completed: "Completed",
    rejected: "Rejected",

    profileTitle: "My profile",
    personalInfo: "Personal information",
    referral: "Referral",
    referralCode: "Referral code",
    referralLink: "Invite link",
    copyCode: "Copy code",
    share: "Share",
    referrals: "Invited friends",
    referralEarnings: "Referral earnings",

    language: "Language",
    currency: "Currency",
    darkMode: "Dark mode",
    support: "Support",
    helpCenter: "Help center",
    about: "About PayPop",

    arabic: "العربية",
    french: "Français",
    english: "English",

    usdCurrency: "US Dollar",
    dzdCurrency: "Algerian Dinar",
    eurCurrency: "Euro",

    changePhoto: "Change photo",
    choosePhoto: "Choose photo",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    close: "Close",
    back: "Back",

    success: "Success",
    error: "Error",
    warning: "Warning",

    invalidEmail: "Enter a valid email address",
    passwordShort: "Password is too short",
    passwordsNotMatch: "Passwords do not match",
    invalidLogin: "Incorrect email or password",
    emailExists: "This email is already registered",
    accountCreated: "Account created successfully",
    loginSuccess: "Login successful",

    insufficientBalance: "Insufficient balance",
    minimumIs: "Minimum withdrawal is",
    withdrawalSent: "Withdrawal request submitted",

    referralInvalid: "Invalid referral code",
    referralSuccess: "Referral code applied",

    dailyAlreadyClaimed: "You already claimed today's reward",
    dailyAvailableTomorrow: "The next reward will be available in 24 hours",

    supportText: "If you have any problem, contact us through WhatsApp.",

    welcomeToPayPop: "Welcome to PayPop",
    earnMore: "Earn more",
    secureRewards: "Simple and secure rewards",

    google: "Continue with Google",
    facebook: "Continue with Facebook",

    pointsPerDollar: "100,000 points = $1",
    minWithdrawText: "Minimum withdrawal: 1,000,000 points",

    noWithdrawals: "No withdrawals yet",
    noReferrals: "No referrals yet",

    version: "Version",
    paypopCoin: "PayPop Coin",
  },
};

const LIGHT_THEME = {
  background: "#F6F4FC",
  card: "#FFFFFF",
  cardSoft: "#F0EDFA",
  text: "#171525",
  textSoft: "#727083",
  border: "#E7E2F2",
  primary: "#6D5DFB",
  primaryDark: "#5142D8",
  secondary: "#9A6CFF",
  gold: "#F6C453",
  goldDark: "#D89D25",
  success: "#23B26D",
  danger: "#E95568",
  warning: "#F0A53A",
  input: "#F7F5FC",
  nav: "#FFFFFF",
  shadow: "#241B50",
};

const DARK_THEME = {
  background: "#090B14",
  card: "#121624",
  cardSoft: "#181D2D",
  text: "#FFFFFF",
  textSoft: "#9299AC",
  border: "#252B3D",
  primary: "#7C6CFF",
  primaryDark: "#5B4BE0",
  secondary: "#A66BFF",
  gold: "#FFD76A",
  goldDark: "#D6A92E",
  success: "#35D58A",
  danger: "#FF6678",
  warning: "#FFB44D",
  input: "#171C2B",
  nav: "#101522",
  shadow: "#000000",
};

function getTheme(darkMode) {
  return darkMode ? DARK_THEME : LIGHT_THEME;
}

function getText(language, key) {
  return TRANSLATIONS[language]?.[key] || TRANSLATIONS.ar[key] || key;
}

function formatPoints(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("en-US");
}

function pointsToUSD(points) {
  return (Number(points) || 0) / POINTS_PER_USD;
}

function convertUSD(usdAmount, currencyCode) {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  return (Number(usdAmount) || 0) * currency.usdRate;
}

function formatMoney(amount, currencyCode) {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const value = Number(amount) || 0;

  if (currencyCode === "DZD") {
    return `${Math.round(value).toLocaleString("en-US")} ${currency.symbol}`;
  }

  return `${currency.symbol}${value.toFixed(2)}`;
}

function generateReferralCode(email = "") {
  const base = String(email)
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 5);

  const random = Math.floor(1000 + Math.random() * 9000);

  return `PP${base || "USER"}${random}`;
}

function generateUserId() {
  return `user_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function getFieldLabel(method, language) {
  if (!method) return "";

  if (method.field === "email") {
    return language === "ar"
      ? "بريد PayPal الإلكتروني"
      : language === "fr"
      ? "E-mail PayPal"
      : "PayPal Email";
  }

  if (method.field === "uid") {
    return language === "ar"
      ? "UID"
      : language === "fr"
      ? "UID"
      : "UID";
  }

  if (method.field === "rip") {
    return language === "ar"
      ? "RIP / CCP"
      : language === "fr"
      ? "RIP / CCP"
      : "RIP / CCP";
  }

  return language === "ar"
    ? "المعرف"
    : language === "fr"
    ? "Identifiant"
    : "ID";
}

function getStatusLabel(status, language) {
  if (status === "completed") {
    return getText(language, "completed");
  }

  if (status === "rejected") {
    return getText(language, "rejected");
  }

  return getText(language, "pending");
}

function getTodayKey() {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function hoursSince(timestamp) {
  if (!timestamp) return Infinity;

  return (Date.now() - Number(timestamp)) / (1000 * 60 * 60);
}

function canClaimAfter24Hours(timestamp) {
  return hoursSince(timestamp) >= 24;
}

function getInitials(name = "") {
  const value = String(name).trim();

  if (!value) return "P";

  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function openWhatsApp() {
  Linking.openURL(SUPPORT_URL).catch(() => {
    Alert.alert(APP_NAME, "WhatsApp could not be opened.");
  });
}

function LogoImage({ uri, brand, size = 46 }) {
  const [failed, setFailed] = useState(false);

  const badge = {
    paypal: ["#1877F2", "PP"],
    binance: ["#F3BA2F", "◆"],
    redotpay: ["#151823", "R"],
    baridimob: ["#0C9B62", "B"],
    freefire: ["#FF7A18", "FF"],
    pubg: ["#C79A32", "PUBG"],
  }[brand] || ["#7356F7", "P"];

  if (uri && !failed) {
    return (
      <View style={{ width: size, height: size, borderRadius: 15, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image source={{ uri }} onError={() => setFailed(true)} resizeMode="contain" style={{ width: size * 0.72, height: size * 0.72 }} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[badge[0], "#111426"]}
      style={{ width: size, height: size, borderRadius: 15, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)" }}
    >
      <Text style={{ color: "#FFFFFF", fontSize: brand === "pubg" ? size * 0.22 : size * 0.34, fontWeight: "1000" }}>{badge[1]}</Text>
    </LinearGradient>
  );
}

// ======================================================
// PART 1 انتهى
// ======================================================

// ======================================================
// PART 2/6 — مكونات الواجهة الأساسية
// ======================================================

function GradientButton({
  title,
  onPress,
  theme,
  disabled = false,
  icon = null,
  small = false,
}) {
  return (
    <Pressable
      onPress={() => {
        playPayPopSound("click");
        onPress?.();
      }}
      disabled={disabled}
      style={({ pressed }) => [
        {
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          borderRadius: small ? 14 : 18,
          overflow: "hidden",
        },
      ]}
    >
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          minHeight: small ? 44 : 54,
          paddingHorizontal: small ? 18 : 22,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
        }}
      >
        {icon ? <Text style={{ fontSize: 18 }}>{icon}</Text> : null}

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: small ? 14 : 16,
            fontWeight: "900",
          }}
        >
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

function GlassCard({ children, theme, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: theme.border,
          padding: 16,
          shadowColor: theme.shadow,
          shadowOpacity: 0.08,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function SectionTitle({ title, subtitle, theme }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          color: theme.text,
          fontSize: 20,
          fontWeight: "900",
          textAlign: "left",
        }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          style={{
            color: theme.textSoft,
            fontSize: 13,
            marginTop: 4,
            lineHeight: 19,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function PayPopCoin({ size = 52, compact = false }) {
  const coin = compact ? size * 0.86 : size;
  return (
    <View
      style={{
        width: coin,
        height: coin,
        borderRadius: coin / 2,
        padding: 3,
        shadowColor: "#FFD45A",
        shadowOpacity: 0.45,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 7,
      }}
    >
      <LinearGradient
        colors={["#FFF4A8", "#FFD34F", "#E79B19"]}
        style={{
          flex: 1,
          borderRadius: coin / 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: coin - 10,
            height: coin - 10,
            borderRadius: (coin - 10) / 2,
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.75)",
            backgroundColor: "#7356F7",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: coin * 0.32,
              fontWeight: "1000",
            }}
          >
            P
          </Text>
          {!compact ? (
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: Math.max(6, coin * 0.105),
                fontWeight: "900",
                marginTop: -2,
              }}
            >
              PayPop
            </Text>
          ) : null}
        </View>
      </LinearGradient>
    </View>
  );
}

function AppLogo({ theme, size = 74 }) {
  return <PayPopCoin size={size} />;
}

function BalanceCard({
  user,
  theme,
  language,
  currency,
}) {
  const t = (key) => getText(language, key);

  const points = Number(user?.points) || 0;
  const usd = pointsToUSD(points);
  const converted = convertUSD(usd, currency);

  return (
    <LinearGradient
      colors={[theme.primaryDark, theme.primary, theme.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 26,
        padding: 20,
        marginBottom: 20,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          right: -25,
          top: -35,
          width: 130,
          height: 130,
          borderRadius: 65,
          backgroundColor: "rgba(255,255,255,0.08)",
        }}
      />

      <Text
        style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: 13,
          fontWeight: "700",
        }}
      >
        {t("availableBalance")}
      </Text>

      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 34,
          fontWeight: "1000",
          marginTop: 5,
        }}
      >
        {formatMoney(converted, currency)}
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: "rgba(255,255,255,0.18)",
          marginVertical: 14,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <PayPopCoin size={52} compact />
          <View>
            <Text
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              PayPop Coin
            </Text>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "1000",
                marginTop: 2,
              }}
            >
              {formatPoints(points)} {t("points")}
            </Text>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.13)",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: "800",
            }}
          >
            {t("pointsPerDollar")}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

function EarnCard({
  icon,
  title,
  subtitle,
  reward,
  buttonText,
  onPress,
  theme,
  disabled = false,
}) {
  return (
    <GlassCard
      theme={theme}
      style={{
        marginBottom: 12,
        padding: 14,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 17,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.cardSoft,
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 25 }}>{icon}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: theme.text,
              fontSize: 16,
              fontWeight: "900",
            }}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text
              style={{
                color: theme.textSoft,
                fontSize: 12,
                marginTop: 3,
              }}
            >
              {subtitle}
            </Text>
          ) : null}

          {reward ? (
            <Text
              style={{
                color: theme.goldDark,
                fontSize: 12,
                fontWeight: "900",
                marginTop: 5,
              }}
            >
              +{reward} PayPop
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => ({
            backgroundColor: disabled
              ? theme.cardSoft
              : theme.primary,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 13,
            opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
          })}
        >
          <Text
            style={{
              color: disabled ? theme.textSoft : "#FFFFFF",
              fontSize: 12,
              fontWeight: "900",
            }}
          >
            {buttonText}
          </Text>
        </Pressable>
      </View>
    </GlassCard>
  );
}

function InputField({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  theme,
  autoCapitalize = "none",
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.textSoft}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      style={{
        height: 54,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.input,
        color: theme.text,
        paddingHorizontal: 16,
        fontSize: 15,
        marginBottom: 12,
      }}
    />
  );
}

function EmptyState({
  icon = "📭",
  title,
  text,
  theme,
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 35,
      }}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 24,
          backgroundColor: theme.cardSoft,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Text style={{ fontSize: 30 }}>{icon}</Text>
      </View>

      <Text
        style={{
          color: theme.text,
          fontSize: 16,
          fontWeight: "900",
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      {text ? (
        <Text
          style={{
            color: theme.textSoft,
            fontSize: 13,
            textAlign: "center",
            marginTop: 6,
            maxWidth: 300,
            lineHeight: 19,
          }}
        >
          {text}
        </Text>
      ) : null}
    </View>
  );
}

function BottomNavigation({
  active,
  onNavigate,
  theme,
  language,
}) {
  const t = (key) => getText(language, key);

  const items = [
    { id: "home", icon: "⌂", label: t("home") },
    { id: "earn", icon: "⚡", label: t("earn") },
    { id: "wallet", icon: "$", label: t("wallet") },
    { id: "profile", icon: "P", label: t("profile") },
  ];

  return (
    <View
      style={{
        backgroundColor: theme.nav,
        borderTopWidth: 1,
        borderTopColor: "rgba(120,110,190,0.22)",
        paddingHorizontal: 10,
        paddingTop: 9,
        paddingBottom: 9,
        flexDirection: "row",
        justifyContent: "space-around",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: -6 },
        elevation: 16,
      }}
    >
      {items.map((item) => {
        const selected = active === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => {
              playPayPopSound("click");
              onNavigate(item.id);
            }}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                width: 62,
                height: 46,
                borderRadius: 17,
                backgroundColor: selected ? theme.primary : "transparent",
                borderWidth: selected ? 1 : 0,
                borderColor: selected ? "rgba(255,255,255,0.22)" : "transparent",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: selected ? theme.primary : "transparent",
                shadowOpacity: selected ? 0.45 : 0,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 5 },
                elevation: selected ? 7 : 0,
              }}
            >
              {item.id === "profile" ? (
                <PayPopCoin size={25} compact />
              ) : (
                <Text
                  style={{
                    fontSize: selected ? 22 : 20,
                    color: selected ? "#FFFFFF" : theme.textSoft,
                    fontWeight: "1000",
                  }}
                >
                  {item.icon}
                </Text>
              )}
            </View>
            <Text
              style={{
                color: selected ? theme.primary : theme.textSoft,
                fontSize: 10,
                fontWeight: selected ? "1000" : "700",
                marginTop: 4,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ======================================================
// PART 2 انتهى
// ======================================================
// ======================================================
// PART 3/6 — AUTH + WELCOME
// ======================================================

function AuthScreen({
  onLogin,
  onSignup,
  language,
  theme,
}) {
  const t = (key) => getText(language, key);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      Alert.alert(t("error"), t("invalidEmail"));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t("error"), t("passwordShort"));
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      Alert.alert(t("error"), t("passwordsNotMatch"));
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await onLogin(cleanEmail, password);
      } else {
        await onSignup(
          cleanEmail,
          password,
          referralCode.trim().toUpperCase()
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <StatusBar
        barStyle={
          theme === DARK_THEME
            ? "light-content"
            : "dark-content"
        }
        backgroundColor={theme.background}
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 22,
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <AppLogo theme={theme} size={82} />

          <Text
            style={{
              color: theme.text,
              fontSize: 30,
              fontWeight: "1000",
              marginTop: 15,
            }}
          >
            PayPop
          </Text>

          <Text
            style={{
              color: theme.textSoft,
              fontSize: 13,
              marginTop: 6,
              textAlign: "center",
            }}
          >
            {t("welcomeSubtitle")}
          </Text>
        </View>

        <GlassCard theme={theme}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: theme.cardSoft,
              borderRadius: 14,
              padding: 4,
              marginBottom: 20,
            }}
          >
            <Pressable
              onPress={() => setMode("login")}
              style={{
                flex: 1,
                paddingVertical: 11,
                borderRadius: 11,
                alignItems: "center",
                backgroundColor:
                  mode === "login"
                    ? theme.card
                    : "transparent",
              }}
            >
              <Text
                style={{
                  color:
                    mode === "login"
                      ? theme.primary
                      : theme.textSoft,
                  fontWeight: "900",
                }}
              >
                {t("login")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMode("signup")}
              style={{
                flex: 1,
                paddingVertical: 11,
                borderRadius: 11,
                alignItems: "center",
                backgroundColor:
                  mode === "signup"
                    ? theme.card
                    : "transparent",
              }}
            >
              <Text
                style={{
                  color:
                    mode === "signup"
                      ? theme.primary
                      : theme.textSoft,
                  fontWeight: "900",
                }}
              >
                {t("signup")}
              </Text>
            </Pressable>
          </View>

          <InputField
            value={email}
            onChangeText={setEmail}
            placeholder={t("email")}
            keyboardType="email-address"
            theme={theme}
          />

          <InputField
            value={password}
            onChangeText={setPassword}
            placeholder={t("password")}
            secureTextEntry
            theme={theme}
          />

          {mode === "signup" ? (
            <>
              <InputField
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t("confirmPassword")}
                secureTextEntry
                theme={theme}
              />

              <InputField
                value={referralCode}
                onChangeText={setReferralCode}
                placeholder={`${t("referralCode")} (${t(
                  "optional"
                ) || "Optional"})`}
                autoCapitalize="characters"
                theme={theme}
              />
            </>
          ) : null}

          {mode === "login" ? (
            <Pressable
              onPress={() =>
                Alert.alert(
                  t("forgotPassword"),
                  language === "ar"
                    ? "سيتم تفعيل استرجاع كلمة المرور عبر Firebase لاحقاً."
                    : language === "fr"
                    ? "La récupération du mot de passe via Firebase sera activée plus tard."
                    : "Password recovery via Firebase will be enabled later."
                )
              }
              style={{
                alignSelf: "flex-end",
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: theme.primary,
                  fontSize: 12,
                  fontWeight: "800",
                }}
              >
                {t("forgotPassword")}
              </Text>
            </Pressable>
          ) : null}

          <GradientButton
            title={
              loading
                ? "..."
                : mode === "login"
                ? t("login")
                : t("createAccount")
            }
            onPress={submit}
            theme={theme}
            disabled={loading}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 18,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: theme.border,
              }}
            />

            <Text
              style={{
                color: theme.textSoft,
                fontSize: 11,
                marginHorizontal: 10,
              }}
            >
              OR
            </Text>

            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: theme.border,
              }}
            />
          </View>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Google",
                language === "ar"
                  ? "سيتم ربط Google Firebase لاحقاً."
                  : "Google Firebase authentication will be connected later."
              )
            }
            style={{
              height: 50,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.input,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontWeight: "900",
              }}
            >
              G  {t("google")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Facebook",
                language === "ar"
                  ? "سيتم ربط Facebook Firebase لاحقاً."
                  : "Facebook Firebase authentication will be connected later."
              )
            }
            style={{
              height: 50,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.input,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontWeight: "900",
              }}
            >
              f  {t("facebook")}
            </Text>
          </Pressable>
        </GlassCard>

        <Text
          style={{
            color: theme.textSoft,
            textAlign: "center",
            fontSize: 11,
            marginTop: 18,
          }}
        >
          PayPop Coin • {APP_VERSION}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function WelcomeScreen({
  onContinue,
  language,
  theme,
}) {
  const t = (key) => getText(language, key);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.primaryDark}
      />

      <LinearGradient
        colors={[
          theme.primaryDark,
          theme.primary,
          theme.secondary,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          padding: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: "rgba(255,255,255,0.06)",
            top: -80,
            right: -80,
          }}
        />

        <View
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: "rgba(255,255,255,0.05)",
            bottom: -70,
            left: -60,
          }}
        />

        <AppLogo
          theme={{
            ...theme,
            primary: "#FFFFFF",
            secondary: "#D9CFFF",
            gold: "#FFD86A",
          }}
          size={110}
        />

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 42,
            fontWeight: "1000",
            marginTop: 25,
            letterSpacing: 1,
          }}
        >
          PayPop
        </Text>

        <Text
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 18,
            fontWeight: "800",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {t("welcomeToPayPop")}
        </Text>

        <Text
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 14,
            lineHeight: 22,
            textAlign: "center",
            marginTop: 12,
            maxWidth: 320,
          }}
        >
          {t("welcomeSubtitle")}
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginTop: 28,
            gap: 10,
          }}
        >
          {[
            ["💰", t("earnMore")],
            ["🎁", t("secureRewards")],
            ["⚡", "PayPop Coin"],
          ].map(([icon, label]) => (
            <View
              key={label}
              style={{
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ fontSize: 25 }}>{icon}</Text>

              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: "800",
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={onContinue}
          style={({ pressed }) => ({
            marginTop: 42,
            width: "100%",
            maxWidth: 330,
            height: 56,
            borderRadius: 18,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text
            style={{
              color: theme.primaryDark,
              fontSize: 16,
              fontWeight: "1000",
            }}
          >
            {t("continue")} →
          </Text>
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ======================================================
// PART 3 انتهى
// ======================================================
// ======================================================
// PART 4/6 — HOME + EARN
// ======================================================

function DailyRewardChest({
  reward,
  claimed,
  onClaim,
  theme,
  language,
}) {
  const [opening, setOpening] = useState(false);
  const lidY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const title =
    language === "ar"
      ? "صندوق المكافأة اليومية"
      : language === "fr"
      ? "Coffre de récompense quotidienne"
      : "Daily Reward Chest";

  const subtitle = claimed
    ? language === "ar"
      ? "تم الاستلام — المكافأة القادمة بعد 24 ساعة"
      : language === "fr"
      ? "Déjà reçu — prochaine récompense dans 24 h"
      : "Claimed — next reward in 24 hours"
    : language === "ar"
    ? "افتح الصندوق واحصل على مكافأتك"
    : language === "fr"
    ? "Ouvrez le coffre et récupérez votre récompense"
    : "Open the chest and collect your reward";

  const handlePress = () => {
    if (claimed || opening) return;
    playPayPopSound("click");
    setOpening(true);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1.035, useNativeDriver: true }),
      Animated.timing(lidY, {
        toValue: -18,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      playPayPopSound("reward");
      onClaim?.();
      setTimeout(() => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
        setOpening(false);
      }, 450);
    });
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={handlePress} disabled={claimed || opening}>
        <LinearGradient
          colors={["#171A2D", "#24213F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 26,
            borderWidth: 1,
            borderColor: claimed ? "#3C405B" : "#6E5AF7",
            padding: 16,
            marginBottom: 18,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 160,
              height: 160,
              borderRadius: 80,
              right: -70,
              top: -70,
              backgroundColor: "rgba(132,92,255,0.14)",
            }}
          />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 104,
                height: 104,
                alignItems: "center",
                justifyContent: "flex-end",
                marginRight: 15,
              }}
            >
              <Animated.View
                style={{
                  position: "absolute",
                  top: 9,
                  width: 78,
                  height: 30,
                  borderRadius: 9,
                  backgroundColor: "#FFD34F",
                  borderWidth: 2,
                  borderColor: "#FFF0A0",
                  transform: [{ translateY: lidY }],
                  zIndex: 3,
                }}
              />
              <View
                style={{
                  width: 84,
                  height: 66,
                  borderRadius: 12,
                  backgroundColor: "#C88418",
                  borderWidth: 2,
                  borderColor: "#FFD95A",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 34,
                    top: 0,
                    width: 15,
                    height: "100%",
                    backgroundColor: "#F7C735",
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    left: 29,
                    top: 26,
                    width: 25,
                    height: 17,
                    borderRadius: 5,
                    backgroundColor: "#FFF0A0",
                    borderWidth: 2,
                    borderColor: "#DCA42A",
                  }}
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "1000" }}>
                {title}
              </Text>
              <Text style={{ color: "#AEB3CC", fontSize: 12, lineHeight: 18, marginTop: 5 }}>
                {subtitle}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <PayPopCoin size={30} compact />
                <Text style={{ color: "#FFD34F", fontSize: 19, fontWeight: "1000", marginLeft: 8 }}>
                  +{reward} PayPop
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: 14,
              borderRadius: 15,
              backgroundColor: claimed ? "#25283B" : theme.primary,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "1000", fontSize: 14 }}>
              {claimed
                ? language === "ar" ? "تم الاستلام" : language === "fr" ? "Déjà reçu" : "Claimed"
                : language === "ar" ? "افتح الصندوق الآن" : language === "fr" ? "Ouvrir maintenant" : "Open now"}
            </Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

function HomeScreen({
  user,
  language,
  currency,
  theme,
  onNavigate,
  onClaimDaily,
  onWheel,
  onWatchVideo,
  onShare,
}) {
  const t = (key) => getText(language, key);

  const dailyClaimed =
    user?.dailyReward?.lastClaim &&
    !canClaimAfter24Hours(user.dailyReward.lastClaim);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 25,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <View>
            <Text
              style={{
                color: theme.textSoft,
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              {t("welcome")}
            </Text>

            <Text
              style={{
                color: theme.text,
                fontSize: 24,
                fontWeight: "1000",
                marginTop: 2,
              }}
            >
              PayPop 👋
            </Text>
          </View>

          <Pressable
            onPress={() => onNavigate("profile")}
            style={{
              width: 45,
              height: 45,
              borderRadius: 15,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>👤</Text>
          </Pressable>
        </View>

        <BalanceCard
          user={user}
          theme={theme}
          language={language}
          currency={currency}
        />

        <SectionTitle
          title={t("dailyReward")}
          subtitle={t("pointsPerDollar")}
          theme={theme}
        />

        <DailyRewardChest
          reward={DAILY_REWARDS[
            Math.min(
              Number(user?.dailyReward?.day) || 0,
              DAILY_REWARDS.length - 1
            )
          ]}
          claimed={dailyClaimed}
          onClaim={onClaimDaily}
          theme={theme}
          language={language}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function EarnScreen({
  user,
  language,
  currency,
  theme,
  onClaimDaily,
  onWheel,
  onWatchVideo,
  onShare,
}) {
  const t = (key) => getText(language, key);

  const dailyClaimed =
    user?.dailyReward?.lastClaim &&
    !canClaimAfter24Hours(user.dailyReward.lastClaim);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 25,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 27,
            fontWeight: "1000",
            marginBottom: 5,
          }}
        >
          {t("earn")}
        </Text>

        <Text
          style={{
            color: theme.textSoft,
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          {t("welcomeSubtitle")}
        </Text>

        <BalanceCard
          user={user}
          theme={theme}
          language={language}
          currency={currency}
        />

heme.cardSoft,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: active
                          ? "#FFFFFF"
                          : theme.textSoft,
                        fontSize: 10,
                        fontWeight: "900",
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: active
                        ? theme.text
                        : theme.textSoft,
                      fontSize: 8,
                      fontWeight: "800",
                      marginTop: 4,
                    }}
                  >
                    {reward}
                  </Text>
                </View>
              );
            })}
          </View>

          <GradientButton
            title={
              dailyClaimed
                ? t("claimed")
                : t("claim")
            }
            onPress={onClaimDaily}
            disabled={dailyClaimed}
            theme={theme}
          />
        </GlassCard>

        <SectionTitle
          title={t("earnNow")}
          theme={theme}
        />

        <EarnCard
          icon="◉"
          title={t("wheel")}
          subtitle={
            language === "ar"
              ? "دورة مجانية كل 24 ساعة"
              : language === "fr"
              ? "Un tour gratuit toutes les 24 heures"
              : "One free spin every 24 hours"
          }
          reward="10–250"
          buttonText={t("spin")}
          onPress={onWheel}
          theme={theme}
        />

        <EarnCard
          icon="▶"
          title={t("watchVideo")}
          subtitle={
            language === "ar"
              ? "شاهد فيديو قصير"
              : language === "fr"
              ? "Regardez une courte vidéo"
              : "Watch a short video"
          }
          reward="100"
          buttonText={t("watch")}
          onPress={onWatchVideo}
          theme={theme}
        />

        <EarnCard
          icon="↗"
          title={t("inviteFriends")}
          subtitle={
            language === "ar"
              ? "شارك رابطك مع أصدقائك"
              : language === "fr"
              ? "Partagez votre lien avec vos amis"
              : "Share your link with friends"
          }
          reward="250+"
          buttonText={t("share")}
          onPress={onShare}
          theme={theme}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// PART 4 انتهى
// ======================================================
                      // ======================================================
// PART 5/6 — WALLET + WITHDRAWAL
// ======================================================

function WalletScreen({
  user,
  language,
  currency,
  theme,
  onWithdraw,
}) {
  const t = (key) => getText(language, key);

  const [selectedMethod, setSelectedMethod] = useState(
    WITHDRAW_METHODS[0].id
  );
  const [details, setDetails] = useState("");
  const [amountUSD, setAmountUSD] = useState("");

  const points = Number(user?.points) || 0;
  const usdBalance = pointsToUSD(points);

  const selected =
    WITHDRAW_METHODS.find(
      (method) => method.id === selectedMethod
    ) || WITHDRAW_METHODS[0];

  const amountNumber = Number(amountUSD) || 0;
  const amountPoints = Math.round(
    amountNumber * POINTS_PER_USD
  );

  const convertedAmount = convertUSD(
    amountNumber,
    currency
  );

  const submit = () => {
    if (amountNumber <= 0) {
      Alert.alert(
        t("warning"),
        language === "ar"
          ? "أدخل مبلغ السحب."
          : language === "fr"
          ? "Entrez un montant."
          : "Enter a withdrawal amount."
      );
      return;
    }

    if (amountPoints < MIN_WITHDRAW_POINTS) {
      Alert.alert(
        t("warning"),
        `${t("minimumIs")} ${formatMoney(
          pointsToUSD(MIN_WITHDRAW_POINTS),
          "USD"
        )}`
      );
      return;
    }

    if (amountPoints > points) {
      Alert.alert(
        t("warning"),
        t("insufficientBalance")
      );
      return;
    }

    if (!details.trim()) {
      Alert.alert(
        t("warning"),
        language === "ar"
          ? "أدخل معلومات الحساب."
          : language === "fr"
          ? "Entrez les informations du compte."
          : "Enter account details."
      );
      return;
    }

    onWithdraw({
      method: selected,
      details: details.trim(),
      amountUSD: amountNumber,
      points: amountPoints,
    });

    setDetails("");
    setAmountUSD("");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 30,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 27,
            fontWeight: "1000",
            marginBottom: 5,
          }}
        >
          {t("walletTitle")}
        </Text>

        <Text
          style={{
            color: theme.textSoft,
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          {t("minWithdrawText")}
        </Text>

        <BalanceCard
          user={user}
          theme={theme}
          language={language}
          currency={currency}
        />

        <GlassCard
          theme={theme}
          style={{ marginBottom: 15 }}
        >
          <SectionTitle
            title={t("selectMethod")}
            theme={theme}
          />

          <View style={{ gap: 10 }}>
            {WITHDRAW_METHODS.map((method) => {
              const active =
                selectedMethod === method.id;

              return (
                <Pressable
                  key={method.id}
                  onPress={() =>
                    setSelectedMethod(method.id)
                  }
                  style={{
                    minHeight: 65,
                    borderRadius: 17,
                    borderWidth: active ? 2 : 1,
                    borderColor: active
                      ? theme.primary
                      : theme.border,
                    backgroundColor: active
                      ? theme.cardSoft
                      : theme.input,
                    paddingHorizontal: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <LogoImage
                    uri={method.logo}
                    size={42}
                  />

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={{
                        color: theme.text,
                        fontSize: 15,
                        fontWeight: "900",
                      }}
                    >
                      {method.name}
                    </Text>

                    <Text
                      style={{
                        color: theme.textSoft,
                        fontSize: 11,
                        marginTop: 3,
                      }}
                    >
                      {getFieldLabel(
                        method,
                        language
                      )}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 21,
                      height: 21,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: active
                        ? theme.primary
                        : theme.border,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {active ? (
                      <View
                        style={{
                          width: 11,
                          height: 11,
                          borderRadius: 6,
                          backgroundColor:
                            theme.primary,
                        }}
                      />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        <GlassCard
          theme={theme}
          style={{ marginBottom: 15 }}
        >
          <SectionTitle
            title={t("enterDetails")}
            theme={theme}
          />

          <Text
            style={{
              color: theme.textSoft,
              fontSize: 12,
              marginBottom: 7,
            }}
          >
            {getFieldLabel(selected, language)}
          </Text>

          <InputField
            value={details}
            onChangeText={setDetails}
            placeholder={selected.placeholder}
            keyboardType={
              selected.field === "email"
                ? "email-address"
                : "default"
            }
            autoCapitalize={
              selected.field === "email"
                ? "none"
                : "characters"
            }
            theme={theme}
          />

          <Text
            style={{
              color: theme.textSoft,
              fontSize: 12,
              marginBottom: 7,
            }}
          >
            {t("amount")} (USD)
          </Text>

          <InputField
            value={amountUSD}
            onChangeText={setAmountUSD}
            placeholder="10"
            keyboardType="decimal-pad"
            theme={theme}
          />

          <View
            style={{
              backgroundColor: theme.cardSoft,
              borderRadius: 15,
              padding: 13,
              marginBottom: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 7,
              }}
            >
              <Text
                style={{
                  color: theme.textSoft,
                  fontSize: 12,
                }}
              >
                {t("amount")}
              </Text>

              <Text
                style={{
                  color: theme.text,
                  fontWeight: "900",
                }}
              >
                {formatMoney(
                  amountNumber,
                  "USD"
                )}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: theme.textSoft,
                  fontSize: 12,
                }}
              >
                {t("currency")}
              </Text>

              <Text
                style={{
                  color: theme.primary,
                  fontWeight: "900",
                }}
              >
                {formatMoney(
                  convertedAmount,
                  currency
                )}
              </Text>
            </View>
          </View>

          <GradientButton
            title={t("submitWithdrawal")}
            onPress={submit}
            theme={theme}
            icon="💸"
          />
        </GlassCard>

        <SectionTitle
          title={t("withdrawalHistory")}
          theme={theme}
        />

        {user?.withdrawals?.length ? (
          [...user.withdrawals]
            .reverse()
            .map((item) => (
              <GlassCard
                key={item.id}
                theme={theme}
                style={{
                  marginBottom: 10,
                  padding: 14,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <LogoImage
                    uri={item.logo}
                    size={42}
                  />

                  <View
                    style={{
                      flex: 1,
                      marginLeft: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.text,
                        fontSize: 14,
                        fontWeight: "900",
                      }}
                    >
                      {item.method}
                    </Text>

                    <Text
                      style={{
                        color: theme.textSoft,
                        fontSize: 11,
                        marginTop: 3,
                      }}
                    >
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </Text>
                  </View>

                  <View
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        color: theme.text,
                        fontWeight: "900",
                      }}
                    >
                      -{formatPoints(item.points)}
                    </Text>

                    <Text
                      style={{
                        color: theme.warning,
                        fontSize: 10,
                        fontWeight: "800",
                        marginTop: 4,
                      }}
                    >
                      {getStatusLabel(
                        item.status,
                        language
                      )}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            ))
        ) : (
          <GlassCard theme={theme}>
            <EmptyState
              icon="💸"
              title={t("noWithdrawals")}
              theme={theme}
            />
          </GlassCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// PART 5 انتهى
// ======================================================

                   // ======================================================
// PART 6/6 — PROFILE + REFERRAL + HELP + APP
// ======================================================

function ProfileScreen({
  user,
  language,
  currency,
  darkMode,
  theme,
  onLanguageChange,
  onCurrencyChange,
  onDarkModeChange,
  onLogout,
  onUpdateUser,
}) {
  const t = (key) => getText(language, key);

  const [photoLoading, setPhotoLoading] = useState(false);

  const pickPhoto = async () => {
    try {
      setPhotoLoading(true);

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          t("warning"),
          language === "ar"
            ? "يجب السماح للتطبيق بالوصول إلى الصور."
            : language === "fr"
            ? "L'accès aux photos est nécessaire."
            : "Photo library permission is required."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await onUpdateUser({
          photo: result.assets[0].uri,
        });
      }
    } catch (error) {
      Alert.alert(t("error"), String(error?.message || error));
    } finally {
      setPhotoLoading(false);
    }
  };

  const shareReferral = async () => {
    try {
      await Share.share({
        message:
          language === "ar"
            ? `انضم إلى PayPop واربح نقاطاً! استخدم كود الإحالة الخاص بي: ${user?.referralCode || ""}`
            : language === "fr"
            ? `Rejoignez PayPop et gagnez des points ! Utilisez mon code : ${user?.referralCode || ""}`
            : `Join PayPop and earn points! Use my referral code: ${user?.referralCode || ""}`,
      });
    } catch (error) {
      // Ignore share cancellation.
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 30,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 27,
            fontWeight: "1000",
            marginBottom: 18,
          }}
        >
          {t("profileTitle")}
        </Text>

        <GlassCard
          theme={theme}
          style={{
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Pressable
            onPress={pickPhoto}
            disabled={photoLoading}
          >
            {user?.photo ? (
              <Image
                source={{ uri: user.photo }}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 32,
                }}
              />
            ) : (
              <View
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 32,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={[
                    theme.primary,
                    theme.secondary,
                    theme.gold,
                  ]}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 32,
                      fontWeight: "1000",
                    }}
                  >
                    {getInitials(user?.email)}
                  </Text>
                </LinearGradient>
              </View>
            )}
          </Pressable>

          <Text
            style={{
              color: theme.text,
              fontSize: 18,
              fontWeight: "1000",
              marginTop: 12,
            }}
          >
            {user?.name || user?.email || "PayPop User"}
          </Text>

          <Text
            style={{
              color: theme.textSoft,
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {user?.email}
          </Text>

          <Pressable
            onPress={pickPhoto}
            style={{
              marginTop: 12,
              paddingHorizontal: 15,
              paddingVertical: 9,
              borderRadius: 13,
              backgroundColor: theme.cardSoft,
            }}
          >
            <Text
              style={{
                color: theme.primary,
                fontSize: 12,
                fontWeight: "900",
              }}
            >
              {t("changePhoto")}
            </Text>
          </Pressable>
        </GlassCard>

        <GlassCard
          theme={theme}
          style={{ marginBottom: 15 }}
        >
          <SectionTitle
            title={t("referral")}
            theme={theme}
          />

          <Text
            style={{
              color: theme.textSoft,
              fontSize: 12,
              marginBottom: 7,
            }}
          >
            {t("referralCode")}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 50,
                borderRadius: 15,
                backgroundColor: theme.cardSoft,
                justifyContent: "center",
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{
                  color: theme.text,
                  fontSize: 17,
                  fontWeight: "1000",
                  letterSpacing: 1,
                }}
              >
                {user?.referralCode || "PPUSER"}
              </Text>
            </View>

            <Pressable
              onPress={shareReferral}
              style={{
                width: 50,
                height: 50,
                borderRadius: 15,
                backgroundColor: theme.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>↗</Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 14,
              gap: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: theme.cardSoft,
                borderRadius: 15,
                padding: 13,
              }}
            >
              <Text
                style={{
                  color: theme.textSoft,
                  fontSize: 11,
                }}
              >
                {t("referrals")}
              </Text>

              <Text
                style={{
                  color: theme.text,
                  fontSize: 21,
                  fontWeight: "1000",
                  marginTop: 4,
                }}
              >
                {Number(user?.referralsCount) || 0}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: theme.cardSoft,
                borderRadius: 15,
                padding: 13,
              }}
            >
              <Text
                style={{
                  color: theme.textSoft,
                  fontSize: 11,
                }}
              >
                {t("referralEarnings")}
              </Text>

              <Text
                style={{
                  color: theme.goldDark,
                  fontSize: 17,
                  fontWeight: "1000",
                  marginTop: 4,
                }}
              >
                {formatPoints(
                  Number(user?.referralEarnings) || 0
                )}
              </Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard
          theme={theme}
          style={{ marginBottom: 15 }}
        >
          <SectionTitle
            title={t("language")}
            theme={theme}
          />

          {[
            ["ar", t("arabic")],
            ["fr", t("french")],
            ["en", t("english")],
          ].map(([code, label]) => {
            const active = language === code;

            return (
              <Pressable
                key={code}
                onPress={() => onLanguageChange(code)}
                style={{
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: active
                    ? theme.cardSoft
                    : "transparent",
                  paddingHorizontal: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    color: active
                      ? theme.primary
                      : theme.text,
                    fontSize: 14,
                    fontWeight: active ? "900" : "700",
                  }}
                >
                  {label}
                </Text>

                {active ? (
                  <Text
                    style={{
                      color: theme.primary,
                      fontWeight: "1000",
                    }}
                  >
                    ✓
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </GlassCard>

        <GlassCard
          theme={theme}
          style={{ marginBottom: 15 }}
        >
          <SectionTitle
            title={t("currency")}
            theme={theme}
          />

          {Object.values(CURRENCIES).map((item) => {
            const active = currency === item.code;

            return (
              <Pressable
                key={item.code}
                onPress={() =>
                  onCurrencyChange(item.code)
                }
                style={{
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: active
                    ? theme.cardSoft
                    : "transparent",
                  paddingHorizontal: 13,
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Text
                  style={{
                    width: 40,
                    color: theme.primary,
                    fontSize: 16,
                    fontWeight: "1000",
                  }}
                >
                  {item.symbol}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    color: theme.text,
                    fontSize: 14,
                    fontWeight: "800",
                  }}
                >
                  {language === "ar"
                    ? item.code === "USD"
                      ? t("usdCurrency")
                      : item.code === "DZD"
                      ? t("dzdCurrency")
                      : t("eurCurrency")
                    : item.name}
                </Text>

                {active ? (
                  <Text
                    style={{
                      color: theme.primary,
                      fontWeight: "1000",
                    }}
                  >
                    ✓
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </GlassCard>

        <GlassCard
          theme={theme}
          style={{ marginBottom: 15 }}
        >
          <Pressable
            onPress={() => onDarkModeChange(!darkMode)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              minHeight: 52,
            }}
          >
            <Text style={{ fontSize: 22 }}>
              {darkMode ? "🌙" : "☀️"}
            </Text>

            <Text
              style={{
                flex: 1,
                color: theme.text,
                fontSize: 14,
                fontWeight: "900",
                marginLeft: 12,
              }}
            >
              {t("darkMode")}
            </Text>

            <View
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                backgroundColor: darkMode
                  ? theme.primary
                  : theme.cardSoft,
                padding: 3,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#FFFFFF",
                  alignSelf: darkMode
                    ? "flex-end"
                    : "flex-start",
                }}
              />
            </View>
          </Pressable>
        </GlassCard>

        <GlassCard
          theme={theme}
          style={{ marginBottom: 15 }}
        >
          <Pressable
            onPress={openWhatsApp}
            style={{
              minHeight: 58,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 43,
                height: 43,
                borderRadius: 14,
                backgroundColor: "#25D366",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 21 }}>✆</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: "900",
                }}
              >
                {t("support")}
              </Text>

              <Text
                style={{
                  color: theme.textSoft,
                  fontSize: 11,
                  marginTop: 3,
                }}
              >
                {t("supportText")}
              </Text>
            </View>

            <Text
              style={{
                color: theme.primary,
                fontSize: 20,
                fontWeight: "900",
              }}
            >
              ›
            </Text>
          </Pressable>
        </GlassCard>

        <GlassCard
          theme={theme}
          style={{ marginBottom: 15 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              minHeight: 50,
            }}
          >
            <Text style={{ fontSize: 22 }}>ℹ️</Text>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: "900",
                }}
              >
                {t("about")}
              </Text>

              <Text
                style={{
                  color: theme.textSoft,
                  fontSize: 11,
                  marginTop: 3,
                }}
              >
                {t("paypopCoin")} • {t("version")}{" "}
                {APP_VERSION}
              </Text>
            </View>
          </View>
        </GlassCard>

        <Pressable
          onPress={onLogout}
          style={{
            minHeight: 54,
            borderRadius: 17,
            borderWidth: 1,
            borderColor: theme.danger,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <Text
            style={{
              color: theme.danger,
              fontSize: 15,
              fontWeight: "900",
            }}
          >
            {t("logout")}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function HelpCenterScreen({
  language,
  theme,
  onBack,
}) {
  const t = (key) => getText(language, key);

  const items =
    language === "ar"
      ? [
          [
            "كيف أربح النقاط؟",
            "يمكنك الربح من المكافأة اليومية وعجلة الحظ ومشاهدة الفيديو ودعوة الأصدقاء.",
          ],
          [
            "ما قيمة النقاط؟",
            "كل 100,000 نقطة من PayPop Coin تساوي 1 دولار أمريكي.",
          ],
          [
            "ما الحد الأدنى للسحب؟",
            "الحد الأدنى للسحب هو 1,000,000 نقطة، أي 10 دولارات.",
          ],
          [
            "متى تصل عملية السحب؟",
            "طلبات السحب تكون قيد المراجعة قبل إتمامها.",
          ],
        ]
      : language === "fr"
      ? [
          [
            "Comment gagner des points ?",
            "Gagnez avec la récompense quotidienne, la roue, les vidéos et les invitations.",
          ],
          [
            "Quelle est la valeur des points ?",
            "100 000 points PayPop Coin valent 1 dollar américain.",
          ],
          [
            "Quel est le retrait minimum ?",
            "Le minimum est de 1 000 000 points, soit 10 dollars.",
          ],
          [
            "Quand le retrait arrive-t-il ?",
            "Les demandes sont vérifiées avant leur traitement.",
          ],
        ]
      : [
          [
            "How do I earn points?",
            "Earn through daily rewards, the lucky wheel, videos and referrals.",
          ],
          [
            "What are the points worth?",
            "100,000 PayPop Coin points equal 1 US dollar.",
          ],
          [
            "What is the minimum withdrawal?",
            "The minimum is 1,000,000 points, equal to $10.",
          ],
          [
            "When will my withdrawal arrive?",
            "Withdrawal requests are reviewed before processing.",
          ],
        ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 30,
        }}
      >
        <Pressable
          onPress={onBack}
          style={{
            alignSelf: "flex-start",
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: theme.primary,
              fontWeight: "900",
            }}
          >
            ← {t("back")}
          </Text>
        </Pressable>

        <Text
          style={{
            color: theme.text,
            fontSize: 27,
            fontWeight: "1000",
            marginBottom: 18,
          }}
        >
          {t("helpCenter")}
        </Text>

        {items.map(([question, answer], index) => (
          <GlassCard
            key={index}
            theme={theme}
            style={{ marginBottom: 12 }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 15,
                fontWeight: "900",
                lineHeight: 22,
              }}
            >
              {question}
            </Text>

            <Text
              style={{
                color: theme.textSoft,
                fontSize: 13,
                lineHeight: 21,
                marginTop: 8,
              }}
            >
              {answer}
            </Text>
          </GlassCard>
        ))}

        <GlassCard theme={theme}>
          <Text
            style={{
              color: theme.text,
              fontSize: 15,
              fontWeight: "900",
            }}
          >
            {t("support")}
          </Text>

          <Text
            style={{
              color: theme.textSoft,
              fontSize: 13,
              lineHeight: 21,
              marginTop: 7,
            }}
          >
            {t("supportText")}
          </Text>

          <View style={{ marginTop: 14 }}>
            <GradientButton
              title="WhatsApp"
              onPress={openWhatsApp}
              theme={theme}
              icon="✆"
            />
          </View>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function PayPopInfoScreen({
  language,
  theme,
  onBack,
}) {
  const t = (key) => getText(language, key);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 30,
        }}
      >
        <Pressable
          onPress={onBack}
          style={{
            alignSelf: "flex-start",
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: theme.primary,
              fontWeight: "900",
            }}
          >
            ← {t("back")}
          </Text>
        </Pressable>

        <GlassCard
          theme={theme}
          style={{
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <AppLogo theme={theme} size={85} />

          <Text
            style={{
              color: theme.text,
              fontSize: 29,
              fontWeight: "1000",
              marginTop: 15,
            }}
          >
            PayPop
          </Text>

          <Text
            style={{
              color: theme.primary,
              fontSize: 13,
              fontWeight: "900",
              marginTop: 4,
            }}
          >
            PayPop Coin
          </Text>
        </GlassCard>

        <GlassCard
          theme={theme}
          style={{ marginBottom: 12 }}
        >
          <Text
            style={{
              color: theme.text,
              fontSize: 18,
              fontWeight: "1000",
            }}
          >
            {language === "ar"
              ? "ما هو PayPop؟"
              : language === "fr"
              ? "Qu'est-ce que PayPop ?"
              : "What is PayPop?"}
          </Text>

          <Text
            style={{
              color: theme.textSoft,
              fontSize: 13,
              lineHeight: 22,
              marginTop: 9,
            }}
          >
            {language === "ar"
              ? "PayPop هو تطبيق مكافآت يتيح للمستخدم جمع PayPop Coin من خلال مجموعة من الأنشطة داخل التطبيق."
              : language === "fr"
              ? "PayPop est une application de récompenses permettant de gagner des PayPop Coin grâce à différentes activités."
              : "PayPop is a rewards app where users can earn PayPop Coin through different activities."}
          </Text>
        </GlassCard>

        <GlassCard theme={theme}>
          <Text
            style={{
              color: theme.text,
              fontSize: 18,
              fontWeight: "1000",
            }}
          >
            {t("pointsPerDollar")}
          </Text>

          <Text
            style={{
              color: theme.textSoft,
              fontSize: 13,
              lineHeight: 22,
              marginTop: 9,
            }}
          >
            {t("minWithdrawText")}
          </Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// MAIN APP
// ======================================================

export default function App() {
  const [ready, setReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState({});

  const [language, setLanguage] = useState("ar");
  const [currency, setCurrency] = useState("USD");
  const [darkMode, setDarkMode] = useState(false);

  const [activeScreen, setActiveScreen] = useState("home");

  const theme = useMemo(
    () => getTheme(darkMode),
    [darkMode]
  );

  const t = (key) => getText(language, key);

  useEffect(() => {
    loadPayPopSounds();
    loadApp();
    return () => {
      unloadPayPopSounds();
    };
  }, []);

  useEffect(() => {
    if (language === "ar") {
      try {
        if (!I18nManager.isRTL) {
          I18nManager.allowRTL(true);
        }
      } catch (error) {}
    }
  }, [language]);

  const loadApp = async () => {
    try {
      const [
        storedUser,
        storedUsers,
        storedLanguage,
        storedCurrency,
        storedDarkMode,
        firstLaunch,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE.USER),
        AsyncStorage.getItem(STORAGE.USERS),
        AsyncStorage.getItem(STORAGE.LANGUAGE),
        AsyncStorage.getItem(STORAGE.CURRENCY),
        AsyncStorage.getItem(STORAGE.DARK_MODE),
        AsyncStorage.getItem(STORAGE.FIRST_LAUNCH),
      ]);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }

      if (storedLanguage) {
        setLanguage(storedLanguage);
      }

      if (storedCurrency) {
        setCurrency(storedCurrency);
      }

      if (storedDarkMode !== null) {
        setDarkMode(storedDarkMode === "true");
      }

      if (!firstLaunch) {
        setShowWelcome(true);
      }

      setReady(true);
    } catch (error) {
      console.log("PayPop load error:", error);
      setReady(true);
    }
  };

  const saveUsers = async (nextUsers) => {
    setUsers(nextUsers);

    await AsyncStorage.setItem(
      STORAGE.USERS,
      JSON.stringify(nextUsers)
    );
  };

  const saveUser = async (nextUser) => {
    setUser(nextUser);

    await AsyncStorage.setItem(
      STORAGE.USER,
      JSON.stringify(nextUser)
    );
  };

  const finishWelcome = async () => {
    setShowWelcome(false);

    await AsyncStorage.setItem(
      STORAGE.FIRST_LAUNCH,
      "true"
    );
  };

  const handleSignup = async (
    email,
    password,
    enteredReferral
  ) => {
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUsers = {
      ...users,
    };

    if (existingUsers[normalizedEmail]) {
      Alert.alert(
        t("error"),
        t("emailExists")
      );
      return;
    }

    let inviterEmail = null;

    if (enteredReferral) {
      const found = Object.values(existingUsers).find(
        (item) =>
          String(item.referralCode || "").toUpperCase() ===
          String(enteredReferral).toUpperCase()
      );

      if (!found) {
        Alert.alert(
          t("error"),
          t("referralInvalid")
        );
        return;
      }

      inviterEmail = found.email;
    }

    const newUser = {
      id: generateUserId(),
      email: normalizedEmail,
      password,
      name: normalizedEmail.split("@")[0],
      points: inviterEmail ? 250 : 0,
      referralCode: generateReferralCode(
        normalizedEmail
      ),
      referredBy: inviterEmail,
      referralsCount: 0,
      referralEarnings: 0,
      referrals: [],
      withdrawals: [],
      photo: null,
      dailyReward: {
        day: 0,
        lastClaim: null,
      },
      wheel: {
        lastSpin: null,
      },
      createdAt: Date.now(),
    };

    if (inviterEmail) {
      const inviter = {
        ...existingUsers[inviterEmail],
      };

      const reward =
        REFERRAL_REWARDS[
          Math.min(
            Number(inviter.referralsCount) || 0,
            REFERRAL_REWARDS.length - 1
          )
        ];

      inviter.points =
        (Number(inviter.points) || 0) + reward;

      inviter.referralsCount =
        (Number(inviter.referralsCount) || 0) + 1;

      inviter.referralEarnings =
        (Number(inviter.referralEarnings) || 0) +
        reward;

      inviter.referrals = [
        ...(inviter.referrals || []),
        {
          email: normalizedEmail,
          reward,
          createdAt: Date.now(),
        },
      ];

      existingUsers[inviterEmail] = inviter;
    }

    existingUsers[normalizedEmail] = newUser;

    await saveUsers(existingUsers);
    await saveUser(newUser);

    if (inviterEmail) {
      Alert.alert(
        t("success"),
        t("referralSuccess")
      );
    } else {
      Alert.alert(
        t("success"),
        t("accountCreated")
      );
    }

    setActiveScreen("home");
  };

  const handleLogin = async (
    email,
    password
  ) => {
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const found = users[normalizedEmail];

    if (!found || found.password !== password) {
      Alert.alert(
        t("error"),
        t("invalidLogin")
      );
      return;
    }

    await saveUser(found);

    Alert.alert(
      t("success"),
      t("loginSuccess")
    );

    setActiveScreen("home");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem(STORAGE.USER);

    setUser(null);
    setActiveScreen("home");
  };

  const handleUpdateUser = async (updates) => {
    if (!user) return;

    const nextUser = {
      ...user,
      ...updates,
    };

    const nextUsers = {
      ...users,
      [user.email]: nextUser,
    };

    await saveUsers(nextUsers);
    await saveUser(nextUser);
  };

  const handleLanguageChange = async (nextLanguage) => {
    if (nextLanguage === language) return;

    const names = {
      ar: "العربية",
      fr: "Français",
      en: "English",
    };

    Alert.alert(
      language === "ar" ? "تأكيد تغيير اللغة" : language === "fr" ? "Confirmer la langue" : "Confirm language",
      language === "ar"
        ? `هل تريد تغيير اللغة إلى ${names[nextLanguage]}؟`
        : language === "fr"
        ? `Voulez-vous passer à ${names[nextLanguage]} ?`
        : `Change the language to ${names[nextLanguage]}?`,
      [
        { text: language === "ar" ? "إلغاء" : language === "fr" ? "Annuler" : "Cancel", style: "cancel" },
        {
          text: language === "ar" ? "نعم، تغيير" : language === "fr" ? "Oui, changer" : "Yes, change",
          onPress: async () => {
            playPayPopSound("click");
            setLanguage(nextLanguage);
            await AsyncStorage.setItem(STORAGE.LANGUAGE, nextLanguage);
          },
        },
      ]
    );
  };

  const handleCurrencyChange = async (nextCurrency) => {
    if (nextCurrency === currency) return;
    const from = CURRENCIES[currency];
    const to = CURRENCIES[nextCurrency];

    Alert.alert(
      language === "ar" ? "تأكيد تغيير العملة" : language === "fr" ? "Confirmer la devise" : "Confirm currency",
      language === "ar"
        ? `هل تريد تغيير العملة من ${from.code} إلى ${to.code}؟`
        : language === "fr"
        ? `Voulez-vous changer la devise de ${from.code} à ${to.code} ?`
        : `Change the currency from ${from.code} to ${to.code}?`,
      [
        { text: language === "ar" ? "إلغاء" : language === "fr" ? "Annuler" : "Cancel", style: "cancel" },
        {
          text: language === "ar" ? "نعم، تغيير" : language === "fr" ? "Oui, changer" : "Yes, change",
          onPress: async () => {
            playPayPopSound("click");
            setCurrency(nextCurrency);
            await AsyncStorage.setItem(STORAGE.CURRENCY, nextCurrency);
          },
        },
      ]
    );
  };

  const handleDarkModeChange = async (enabled) => {
    setDarkMode(enabled);

    await AsyncStorage.setItem(
      STORAGE.DARK_MODE,
      String(enabled)
    );
  };

  const handleClaimDaily = async () => {
    if (!user) return;

    const lastClaim =
      user.dailyReward?.lastClaim;

    if (
      lastClaim &&
      !canClaimAfter24Hours(lastClaim)
    ) {
      Alert.alert(
        t("warning"),
        t("dailyAlreadyClaimed")
      );
      return;
    }

    const currentDay =
      Number(user.dailyReward?.day) || 0;

    const reward =
      DAILY_REWARDS[
        Math.min(
          currentDay,
          DAILY_REWARDS.length - 1
        )
      ];

    const nextDay =
      (currentDay + 1) % DAILY_REWARDS.length;

    const nextUser = {
      ...user,
      points:
        (Number(user.points) || 0) + reward,
      dailyReward: {
        day: nextDay,
        lastClaim: Date.now(),
      },
    };

    await handleUpdateUser(nextUser);

    Alert.alert(
      t("success"),
      `+${reward} PayPop`
    );
  };

  const handleWatchVideo = async () => {
    if (!user) return;

    const reward = 100;

    const nextUser = {
      ...user,
      points:
        (Number(user.points) || 0) + reward,
    };

    await handleUpdateUser(nextUser);

    Alert.alert(
      t("success"),
      `+${reward} PayPop`
    );
  };

  const handleShare = async () => {
    if (!user) return;

    try {
      await Share.share({
        message:
          language === "ar"
            ? `انضم إلى PayPop واربح نقاطاً! كود الدعوة: ${user.referralCode}`
            : language === "fr"
            ? `Rejoignez PayPop et gagnez des points ! Code : ${user.referralCode}`
            : `Join PayPop and earn points! Referral code: ${user.referralCode}`,
      });
    } catch (error) {}
  };

  const handleWheelReward = async (reward) => {
    if (!user) return;

    const pointsReward = Number(reward) || 0;

    if (pointsReward <= 0) return;

    const lastSpin =
      user.wheel?.lastSpin || null;

    if (
      lastSpin &&
      !canClaimAfter24Hours(lastSpin)
    ) {
      Alert.alert(
        t("warning"),
        language === "ar"
          ? "لقد استعملت دورة اليوم. حاول بعد 24 ساعة."
          : language === "fr"
          ? "Vous avez utilisé votre tour. Réessayez dans 24 heures."
          : "You already used today's spin. Try again in 24 hours."
      );
      return;
    }

    const nextUser = {
      ...user,
      points:
        (Number(user.points) || 0) +
        pointsReward,
      wheel: {
        ...(user.wheel || {}),
        lastSpin: Date.now(),
      },
    };

    await handleUpdateUser(nextUser);

    await playPayPopSound("win");
    setActiveScreen("earn");
  };

  const handleWithdraw = async ({
    method,
    details,
    amountUSD,
    points,
  }) => {
    if (!user) return;

    const currentPoints =
      Number(user.points) || 0;

    if (points > currentPoints) {
      Alert.alert(
        t("warning"),
        t("insufficientBalance")
      );
      return;
    }

    const withdrawal = {
      id: `wd_${Date.now()}_${Math.floor(
        Math.random() * 100000
      )}`,
      method: method.name,
      methodId: method.id,
      details,
      amountUSD,
      points,
      logo: method.logo,
      status: "pending",
      createdAt: Date.now(),
    };

    const nextUser = {
      ...user,
      points: currentPoints - points,
      withdrawals: [
        ...(user.withdrawals || []),
        withdrawal,
      ],
    };

    await handleUpdateUser(nextUser);

    Alert.alert(
      t("success"),
      t("withdrawalSent")
    );
  };

  if (!ready) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppLogo theme={theme} size={78} />

        <Text
          style={{
            color: theme.text,
            fontSize: 25,
            fontWeight: "1000",
            marginTop: 15,
          }}
        >
          PayPop
        </Text>

        <Text
          style={{
            color: theme.textSoft,
            marginTop: 6,
            fontSize: 12,
          }}
        >
          PayPop Coin
        </Text>
      </SafeAreaView>
    );
  }

  if (showWelcome) {
    return (
      <WelcomeScreen
        onContinue={finishWelcome}
        language={language}
        theme={theme}
      />
    );
  }

  if (!user) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onSignup={handleSignup}
        language={language}
        theme={theme}
      />
    );
  }

  const navigate = (screen) => {
    setActiveScreen(screen);
  };

  let content = null;

  if (activeScreen === "home") {
    content = (
      <HomeScreen
        user={user}
        language={language}
        currency={currency}
        theme={theme}
        onNavigate={navigate}
        onClaimDaily={handleClaimDaily}
        onWheel={() => navigate("wheel")}
        onWatchVideo={handleWatchVideo}
        onShare={handleShare}
      />
    );
  } else if (activeScreen === "earn") {
    content = (
      <EarnScreen
        user={user}
        language={language}
        currency={currency}
        theme={theme}
        onClaimDaily={handleClaimDaily}
        onWheel={() => navigate("wheel")}
        onWatchVideo={handleWatchVideo}
        onShare={handleShare}
      />
    );
  } else if (activeScreen === "wallet") {
    content = (
      <WalletScreen
        user={user}
        language={language}
        currency={currency}
        theme={theme}
        onWithdraw={handleWithdraw}
      />
    );
  } else if (activeScreen === "profile") {
    content = (
      <ProfileScreen
        user={user}
        language={language}
        currency={currency}
        darkMode={darkMode}
        theme={theme}
        onLanguageChange={handleLanguageChange}
        onCurrencyChange={handleCurrencyChange}
        onDarkModeChange={handleDarkModeChange}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
      />
    );
  } else if (activeScreen === "help") {
    content = (
      <HelpCenterScreen
        language={language}
        theme={theme}
        onBack={() => navigate("profile")}
      />
    );
  } else if (activeScreen === "info") {
    content = (
      <PayPopInfoScreen
        language={language}
        theme={theme}
        onBack={() => navigate("profile")}
      />
    );
  } else if (activeScreen === "wheel") {
    const Wheel = require("./Wheel").default;

    content = (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >
        <Pressable
          onPress={() => navigate("earn")}
          style={{
            paddingHorizontal: 18,
            paddingTop: 12,
            paddingBottom: 4,
          }}
        >
          <Text
            style={{
              color: theme.primary,
              fontWeight: "900",
            }}
          >
            ← {t("back")}
          </Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Wheel
            onReward={handleWheelReward}
            onSpinStart={() => playPayPopSound("spin")}
            onWin={() => playPayPopSound("win")}
            language={language}
            disabled={Boolean(
              user?.wheel?.lastSpin &&
              !canClaimAfter24Hours(user.wheel.lastSpin)
            )}
          />
        </View>
      </SafeAreaView>
    );
  }

  const showBottomNav = [
    "home",
    "earn",
    "wallet",
    "profile",
  ].includes(activeScreen);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <StatusBar
        barStyle={
          darkMode
            ? "light-content"
            : "dark-content"
        }
        backgroundColor={theme.background}
      />

      <View style={{ flex: 1 }}>
        {content}
      </View>

      {showBottomNav ? (
        <BottomNavigation
          active={activeScreen}
          onNavigate={navigate}
          theme={theme}
          language={language}
        />
      ) : null}
    </SafeAreaView>
  );
}

// ======================================================
// APP.JS انتهى — PART 6/6
// ======================================================

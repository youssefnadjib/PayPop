import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
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
    logo: "https://cdn.simpleicons.org/paypal",
  },
  {
    id: "binance",
    name: "Binance",
    field: "uid",
    placeholder: "Binance UID",
    logo: "https://cdn.simpleicons.org/binance",
  },
  {
    id: "redotpay",
    name: "RedotPay",
    field: "uid",
    placeholder: "RedotPay UID",
    logo: "https://cdn.simpleicons.org/redotpay",
  },
  {
    id: "baridimob",
    name: "BaridiMob",
    field: "rip",
    placeholder: "RIP / CCP",
    logo: null,
  },
  {
    id: "freefire",
    name: "Free Fire",
    field: "id",
    placeholder: "Free Fire ID",
    logo: null,
  },
  {
    id: "pubg",
    name: "PUBG",
    field: "id",
    placeholder: "PUBG ID",
    logo: null,
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

function LogoImage({ uri, size = 42 }) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 4,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EEF0F7",
        }}
      >
        <Text
          style={{
            fontSize: size * 0.38,
            fontWeight: "900",
            color: "#596078",
          }}
        >
          P
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Image
        source={{ uri }}
        onError={() => setFailed(true)}
        resizeMode="contain"
        style={{
          width: size * 0.72,
          height: size * 0.72,
        }}
      />
    </View>
  );
}

// ======================================================
// PART 1 انتهى
// ======================================================

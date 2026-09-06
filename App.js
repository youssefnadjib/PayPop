import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  I18nManager,
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

const STORAGE = {
  USER: "@paypop_user",
  USERS: "@paypop_users",
  LANGUAGE: "@paypop_language",
  THEME: "@paypop_theme",
  CURRENCY: "@paypop_currency",
  FIRST_LAUNCH: "@paypop_first_launch",
};

const POINTS_PER_USD = 100000;
const MIN_WITHDRAW_POINTS = 1000000;

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

const LIGHT_THEME = {
  background: "#F7F5FF",
  surface: "#FFFFFF",
  surfaceSoft: "#F0EDFF",
  primary: "#6C4DFF",
  primaryDark: "#5032D8",
  secondary: "#A05CFF",
  accent: "#FFD45C",
  accentSoft: "#FFF3C4",
  text: "#19152B",
  textSoft: "#77718C",
  border: "#E7E1FA",
  success: "#24B47E",
  danger: "#E94B73",
  shadow: "#24145F",
};

const DARK_THEME = {
  background: "#100D1D",
  surface: "#1A1629",
  surfaceSoft: "#241E39",
  primary: "#8A6CFF",
  primaryDark: "#684BEA",
  secondary: "#A06CFF",
  accent: "#FFD866",
  accentSoft: "#3A321E",
  text: "#FFFFFF",
  textSoft: "#AAA4BC",
  border: "#302A46",
  success: "#32D39A",
  danger: "#FF5D86",
  shadow: "#000000",
};

const TRANSLATIONS = {
  ar: {
    home: "الرئيسية",
    earn: "إربح",
    wallet: "المحفظة",
    profile: "الملف الشخصي",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    referralCode: "كود الإحالة",
    optional: "اختياري",
    continue: "متابعة",
    createAccount: "إنشاء الحساب",
    welcome: "مرحباً بك في PayPop",
    balance: "رصيدك",
    points: "نقطة",
    earnNow: "ابدأ الربح",
    dailyReward: "المكافأة اليومية",
    referral: "دعوة الأصدقاء",
    wheel: "عجلة الحظ",
    watchVideo: "شاهد فيديو",
    games: "الألعاب",
    withdraw: "سحب الأرباح",
    settings: "الإعدادات",
    language: "اللغة",
    currency: "العملة",
    darkMode: "الوضع الداكن",
    support: "مركز الدعم والمساعدة",
    logout: "تسجيل الخروج",
    claim: "استلام",
    invite: "دعوة صديق",
    share: "مشاركة",
    copy: "نسخ",
    copied: "تم النسخ",
    available: "متاح",
    unavailable: "غير متاح",
    minimum: "الحد الأدنى",
    amount: "المبلغ",
    method: "طريقة السحب",
    account: "الحساب",
    submit: "إرسال الطلب",
    success: "تم بنجاح",
    error: "حدث خطأ",
    cancel: "إلغاء",
    save: "حفظ",
    back: "رجوع",
    google: "المتابعة باستخدام Google",
    facebook: "المتابعة باستخدام Facebook",
    newUser: "مستخدم جديد؟",
    haveAccount: "لديك حساب بالفعل؟",
    today: "اليوم",
    streak: "السلسلة",
    reward: "المكافأة",
    changePhoto: "تغيير الصورة",
  },

  fr: {
    home: "Accueil",
    earn: "Gagner",
    wallet: "Portefeuille",
    profile: "Profil",
    login: "Connexion",
    signup: "Créer un compte",
    email: "Adresse e-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    referralCode: "Code de parrainage",
    optional: "Optionnel",
    continue: "Continuer",
    createAccount: "Créer le compte",
    welcome: "Bienvenue sur PayPop",
    balance: "Votre solde",
    points: "points",
    earnNow: "Commencer à gagner",
    dailyReward: "Récompense quotidienne",
    referral: "Inviter des amis",
    wheel: "Roue de la chance",
    watchVideo: "Regarder une vidéo",
    games: "Jeux",
    withdraw: "Retirer les gains",
    settings: "Paramètres",
    language: "Langue",
    currency: "Devise",
    darkMode: "Mode sombre",
    support: "Centre d'aide",
    logout: "Déconnexion",
    claim: "Réclamer",
    invite: "Inviter un ami",
    share: "Partager",
    copy: "Copier",
    copied: "Copié",
    available: "Disponible",
    unavailable: "Indisponible",
    minimum: "Minimum",
    amount: "Montant",
    method: "Méthode de retrait",
    account: "Compte",
    submit: "Envoyer la demande",
    success: "Terminé",
    error: "Une erreur est survenue",
    cancel: "Annuler",
    save: "Enregistrer",
    back: "Retour",
    google: "Continuer avec Google",
    facebook: "Continuer avec Facebook",
    newUser: "Nouvel utilisateur ?",
    haveAccount: "Vous avez déjà un compte ?",
    today: "Aujourd'hui",
    streak: "Série",
    reward: "Récompense",
    changePhoto: "Changer la photo",
  },

  en: {
    home: "Home",
    earn: "Earn",
    wallet: "Wallet",
    profile: "Profile",
    login: "Login",
    signup: "Create Account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot password?",
    referralCode: "Referral code",
    optional: "Optional",
    continue: "Continue",
    createAccount: "Create account",
    welcome: "Welcome to PayPop",
    balance: "Your balance",
    points: "points",
    earnNow: "Start earning",
    dailyReward: "Daily reward",
    referral: "Invite friends",
    wheel: "Lucky Wheel",
    watchVideo: "Watch video",
    games: "Games",
    withdraw: "Withdraw earnings",
    settings: "Settings",
    language: "Language",
    currency: "Currency",
    darkMode: "Dark mode",
    support: "Support Center",
    logout: "Log out",
    claim: "Claim",
    invite: "Invite a friend",
    share: "Share",
    copy: "Copy",
    copied: "Copied",
    available: "Available",
    unavailable: "Unavailable",
    minimum: "Minimum",
    amount: "Amount",
    method: "Withdrawal method",
    account: "Account",
    submit: "Submit request",
    success: "Success",
    error: "Something went wrong",
    cancel: "Cancel",
    save: "Save",
    back: "Back",
    google: "Continue with Google",
    facebook: "Continue with Facebook",
    newUser: "New user?",
    haveAccount: "Already have an account?",
    today: "Today",
    streak: "Streak",
    reward: "Reward",
    changePhoto: "Change photo",
  },
};

const LANGUAGES = [
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

const WITHDRAW_METHODS = [
  { id: "paypal", name: "PayPal", field: "email" },
  { id: "binance", name: "Binance", field: "uid" },
  { id: "redotpay", name: "RedotPay", field: "uid" },
  { id: "baridimob", name: "BaridiMob", field: "rip" },
  { id: "freefire", name: "Free Fire", field: "id" },
  { id: "pubg", name: "PUBG", field: "id" },
];

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const createReferralCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "PP-";

  for (let i = 0; i < 7; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

const createUserId = () => {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  ).toUpperCase();
};

const pointsToUSD = (points) => {
  return Number(points || 0) / POINTS_PER_USD;
};

const convertUSD = (usd, currencyCode) => {
  const currency =
    CURRENCIES[currencyCode] || CURRENCIES.USD;

  return Number(usd || 0) * currency.usdRate;
};

const formatNumber = (number) => {
  return Number(number || 0).toLocaleString("en-US");
};

const formatMoney = (amount, currencyCode) => {
  const currency =
    CURRENCIES[currencyCode] || CURRENCIES.USD;

  return `${currency.symbol}${Number(amount || 0).toFixed(2)}`;
};

const getDefaultUser = () => ({
  id: createUserId(),
  name: "PayPop User",
  email: "",
  password: "",
  points: 0,
  referralCode: createReferralCode(),
  referredBy: "",
  referralCount: 0,
  dailyStreak: 0,
  lastDailyClaim: 0,
  lastWheelSpin: 0,
  adSpinDate: 0,
  profileImage: null,
  createdAt: Date.now(),
});

const getDailyReward = (streak) => {
  const index = Math.min(
    Math.max(Number(streak || 0), 0),
    DAILY_REWARDS.length - 1
  );

  return DAILY_REWARDS[index];
};

const getReferralReward = (count) => {
  const index = Math.min(
    Math.max(Number(count || 0), 0),
    REFERRAL_REWARDS.length - 1
  );

  return REFERRAL_REWARDS[index];
};

const isRTL = (language) => language === "ar";

// الجزء 1 انتهى
// =====================================================
// PAYPOP — PART 2
// Premium UI components
// =====================================================

const PayPopCoin = ({
  size = 58,
  showName = true,
}) => {
  return (
    <View style={{ alignItems: "center" }}>
      <LinearGradient
        colors={["#FFE98A", "#FFC83D", "#E89A16"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.coin,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <View
          style={[
            styles.coinInner,
            {
              width: size * 0.78,
              height: size * 0.78,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.coinP,
              { fontSize: size * 0.34 },
            ]}
          >
            P
          </Text>
        </View>
      </LinearGradient>

      {showName && (
        <Text style={styles.coinName}>
          PayPop
        </Text>
      )}
    </View>
  );
};

const GradientButton = ({
  title,
  onPress,
  icon,
  disabled = false,
  small = false,
  colors,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonWrapper,
        small && styles.buttonWrapperSmall,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <LinearGradient
        colors={
          colors || ["#7C5CFF", "#A35CFF"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradientButton,
          small && styles.gradientButtonSmall,
        ]}
      >
        {icon ? (
          <Text style={styles.buttonIcon}>
            {icon}
          </Text>
        ) : null}

        <Text
          style={[
            styles.buttonText,
            small && styles.buttonTextSmall,
          ]}
        >
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const GlassCard = ({
  children,
  style,
}) => {
  return (
    <View
      style={[
        styles.glassCard,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const SectionTitle = ({
  title,
  subtitle,
}) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {subtitle ? (
        <Text style={styles.sectionSubtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

const StatPill = ({
  label,
  value,
  icon,
}) => {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statIcon}>
        {icon}
      </Text>

      <View>
        <Text style={styles.statLabel}>
          {label}
        </Text>

        <Text style={styles.statValue}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const EarnCard = ({
  title,
  description,
  reward,
  icon,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.earnCard,
        pressed && styles.cardPressed,
      ]}
    >
      <LinearGradient
        colors={[
          "rgba(124,92,255,0.16)",
          "rgba(163,92,255,0.06)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.earnCardGradient}
      >
        <View style={styles.earnIconBox}>
          <Text style={styles.earnIcon}>
            {icon}
          </Text>
        </View>

        <View style={styles.earnContent}>
          <Text style={styles.earnTitle}>
            {title}
          </Text>

          <Text style={styles.earnDescription}>
            {description}
          </Text>

          <View style={styles.rewardRow}>
            <PayPopCoin
              size={24}
              showName={false}
            />

            <Text style={styles.rewardText}>
              +{formatNumber(reward)}
            </Text>
          </View>
        </View>

        <Text style={styles.arrow}>
          ›
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

// =====================================================
// PART 2 — Styles
// =====================================================

const styles = StyleSheet.create({
  coin: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  coinInner: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  coinP: {
    fontWeight: "900",
    color: "#FFFFFF",
  },

  coinName: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "800",
    color: "#F0B72F",
  },

  buttonWrapper: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },

  buttonWrapperSmall: {
    width: "auto",
  },

  gradientButton: {
    minHeight: 54,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },

  gradientButtonSmall: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  buttonTextSmall: {
    fontSize: 14,
  },

  buttonIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    marginRight: 8,
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  buttonPressed: {
    transform: [
      { scale: 0.98 },
    ],
  },

  glassCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E1FA",
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#19152B",
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#77718C",
  },

  statPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#F0EDFF",
  },

  statIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  statLabel: {
    fontSize: 10,
    color: "#77718C",
    fontWeight: "600",
  },

  statValue: {
    marginTop: 2,
    fontSize: 13,
    color: "#19152B",
    fontWeight: "900",
  },

  earnCard: {
    marginBottom: 12,
    borderRadius: 22,
    overflow: "hidden",
  },

  earnCardGradient: {
    minHeight: 94,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7E1FA",
  },

  earnIconBox: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEE9FF",
  },

  earnIcon: {
    fontSize: 27,
  },

  earnContent: {
    flex: 1,
    marginLeft: 12,
  },

  earnTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#19152B",
  },

  earnDescription: {
    marginTop: 3,
    fontSize: 11,
    color: "#77718C",
  },

  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  rewardText: {
    marginLeft: 6,
    color: "#6C4DFF",
    fontSize: 13,
    fontWeight: "900",
  },

  arrow: {
    fontSize: 30,
    color: "#8A7AB7",
    marginLeft: 8,
  },

  cardPressed: {
    transform: [
      { scale: 0.985 },
    ],
  },
});

// =====================================================
// الجزء 2 انتهى
// =====================================================
const LoginInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9992AA"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
};

const SocialButton = ({
  title,
  icon,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.socialButton,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.socialIcon}>
        <Text style={styles.socialIconText}>
          {icon}
        </Text>
      </View>

      <Text style={styles.socialButtonText}>
        {title}
      </Text>
    </Pressable>
  );
};

const PayPopLogo = ({ large = false }) => {
  const size = large ? 92 : 58;

  return (
    <View style={styles.logoContainer}>
      <LinearGradient
        colors={[
          "#6C4DFF",
          "#A05CFF",
          "#D65CFF",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.logoCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <View
          style={[
            styles.logoInner,
            {
              width: size * 0.72,
              height: size * 0.72,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.logoLetter,
              {
                fontSize: large ? 42 : 27,
              },
            ]}
          >
            P
          </Text>
        </View>
      </LinearGradient>

      <Text
        style={[
          styles.logoText,
          large && styles.logoTextLarge,
        ]}
      >
        PayPop
      </Text>
    </View>
  );
};

const AuthHeader = ({
  title,
  subtitle,
}) => {
  return (
    <View style={styles.authHeader}>
      <PayPopLogo large />

      <Text style={styles.authTitle}>
        {title}
      </Text>

      <Text style={styles.authSubtitle}>
        {subtitle}
      </Text>
    </View>
  );
};

// =====================================================
// Authentication helpers
// =====================================================

const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    normalizeEmail(email)
  );
};

const loadUsers = async () => {
  try {
    const raw = await AsyncStorage.getItem(
      STORAGE.USERS
    );

    if (!raw) {
      return {};
    }

    const users = JSON.parse(raw);

    if (!users || typeof users !== "object") {
      return {};
    }

    return users;
  } catch (error) {
    return {};
  }
};

const saveUsers = async (users) => {
  await AsyncStorage.setItem(
    STORAGE.USERS,
    JSON.stringify(users)
  );
};

const findUserByEmail = async (email) => {
  const users = await loadUsers();
  const normalized = normalizeEmail(email);

  const userIds = Object.keys(users);

  for (let i = 0; i < userIds.length; i += 1) {
    const user = users[userIds[i]];

    if (
      normalizeEmail(user.email) === normalized
    ) {
      return user;
    }
  }

  return null;
};

const registerLocalUser = async ({
  name,
  email,
  password,
  referralCode,
}) => {
  const normalizedEmail = normalizeEmail(email);

  if (!name.trim()) {
    return {
      success: false,
      message: "NAME_REQUIRED",
    };
  }

  if (!validateEmail(normalizedEmail)) {
    return {
      success: false,
      message: "INVALID_EMAIL",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "PASSWORD_SHORT",
    };
  }

  const existingUser =
    await findUserByEmail(normalizedEmail);

  if (existingUser) {
    return {
      success: false,
      message: "EMAIL_EXISTS",
    };
  }

  const users = await loadUsers();

  const user = getDefaultUser();

  user.name = name.trim();
  user.email = normalizedEmail;
  user.password = password;

  if (referralCode.trim()) {
    user.referredBy =
      referralCode.trim().toUpperCase();
  }

  users[user.id] = user;

  await saveUsers(users);
  await AsyncStorage.setItem(
    STORAGE.USER,
    JSON.stringify(user)
  );

  return {
    success: true,
    user,
  };
};

const loginLocalUser = async ({
  email,
  password,
}) => {
  const user =
    await findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: "LOGIN_FAILED",
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      message: "LOGIN_FAILED",
    };
  }

  await AsyncStorage.setItem(
    STORAGE.USER,
    JSON.stringify(user)
  );

  return {
    success: true,
    user,
  };
};

// =====================================================
// Auth screen
// =====================================================

const AuthScreen = ({
  language,
  onLogin,
}) => {
  const t = TRANSLATIONS[language];

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [referralCode, setReferralCode] =
    useState("");

  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const showError = (message) => {
    let text = message;

    if (message === "NAME_REQUIRED") {
      text =
        language === "ar"
          ? "اكتب اسمك أولاً."
          : language === "fr"
          ? "Veuillez saisir votre nom."
          : "Please enter your name.";
    }

    if (message === "INVALID_EMAIL") {
      text =
        language === "ar"
          ? "البريد الإلكتروني غير صحيح."
          : language === "fr"
          ? "Adresse e-mail invalide."
          : "Invalid email address.";
    }

    if (message === "PASSWORD_SHORT") {
      text =
        language === "ar"
          ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل."
          : language === "fr"
          ? "Le mot de passe doit contenir au moins 6 caractères."
          : "Password must contain at least 6 characters.";
    }

    if (message === "EMAIL_EXISTS") {
      text =
        language === "ar"
          ? "هذا البريد مسجل من قبل."
          : language === "fr"
          ? "Cet e-mail est déjà utilisé."
          : "This email is already registered.";
    }

    if (message === "LOGIN_FAILED") {
      text =
        language === "ar"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : language === "fr"
          ? "E-mail ou mot de passe incorrect."
          : "Incorrect email or password.";
    }

    Alert.alert(
      t.error,
      text
    );
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          Alert.alert(
            t.error,
            language === "ar"
              ? "كلمتا المرور غير متطابقتين."
              : language === "fr"
              ? "Les mots de passe ne correspondent pas."
              : "Passwords do not match."
          );

          setLoading(false);
          return;
        }

        const result =
          await registerLocalUser({
            name,
            email,
            password,
            referralCode,
          });

        if (!result.success) {
          showError(result.message);
          setLoading(false);
          return;
        }

        onLogin(result.user);
      } else {
        const result =
          await loginLocalUser({
            email,
            password,
          });

        if (!result.success) {
          showError(result.message);
          setLoading(false);
          return;
        }

        onLogin(result.user);
      }
    } catch (error) {
      Alert.alert(
        t.error,
        language === "ar"
          ? "تعذر إتمام العملية."
          : language === "fr"
          ? "Impossible de terminer l'opération."
          : "Unable to complete the operation."
      );
    }

    setLoading(false);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      t.forgotPassword,
      language === "ar"
        ? "استرجاع كلمة المرور الحقيقي سيتم تفعيله مع Firebase."
        : language === "fr"
        ? "La récupération réelle sera activée avec Firebase."
        : "Real password recovery will be enabled with Firebase."
    );
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(
      provider,
      language === "ar"
        ? "تسجيل الدخول الحقيقي بواسطة هذا الحساب سيتم تفعيله مع Firebase."
        : language === "fr"
        ? "La connexion réelle sera activée avec Firebase."
        : "Real social login will be enabled with Firebase."
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F5FF"
      />

      <ScrollView
        contentContainerStyle={
          styles.authScroll
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title={
            isSignup
              ? t.signup
              : t.welcome
          }
          subtitle={
            isSignup
              ? t.createAccount
              : t.earnNow
          }
        />

        {isSignup && (
          <LoginInput
            label={
              language === "ar"
                ? "الاسم"
                : language === "fr"
                ? "Nom"
                : "Name"
            }
            value={name}
            onChangeText={setName}
            placeholder={
              language === "ar"
                ? "اكتب اسمك"
                : language === "fr"
                ? "Votre nom"
                : "Your name"
            }
          />
        )}

        <LoginInput
          label={t.email}
          value={email}
          onChangeText={setEmail}
          placeholder="example@email.com"
          keyboardType="email-address"
        />

        <LoginInput
          label={t.password}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        {isSignup && (
          <>
            <LoginInput
              label={t.confirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <LoginInput
              label={`${t.referralCode} (${t.optional})`}
              value={referralCode}
              onChangeText={setReferralCode}
              placeholder="PP-XXXXXXX"
            />
          </>
        )}

        {!isSignup && (
          <Pressable
            onPress={handleForgotPassword}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>
              {t.forgotPassword}
            </Text>
          </Pressable>
        )}

        <GradientButton
          title={
            loading
              ? "..."
              : isSignup
              ? t.createAccount
              : t.login
          }
          onPress={handleSubmit}
          disabled={loading}
        />

        {!isSignup && (
          <View style={styles.socialArea}>
            <View style={styles.orRow}>
              <View style={styles.orLine} />

              <Text style={styles.orText}>
                OR
              </Text>

              <View style={styles.orLine} />
            </View>

            <SocialButton
              title={t.google}
              icon="G"
              onPress={() =>
                handleSocialLogin("Google")
              }
            />

            <SocialButton
              title={t.facebook}
              icon="f"
              onPress={() =>
                handleSocialLogin("Facebook")
              }
            />
          </View>
        )}

        <View style={styles.switchAuthRow}>
          <Text style={styles.switchAuthText}>
            {isSignup
              ? t.haveAccount
              : t.newUser}
          </Text>

          <Pressable
            onPress={() =>
              setMode(
                isSignup
                  ? "login"
                  : "signup"
              )
            }
          >
            <Text style={styles.switchAuthLink}>
              {isSignup
                ? t.login
                : t.signup}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// =====================================================
// PART 3 — Auth styles
// =====================================================

Object.assign(styles, {
  inputGroup: {
    marginBottom: 14,
  },

  inputLabel: {
    marginBottom: 7,
    fontSize: 13,
    fontWeight: "800",
    color: "#3D3653",
  },

  input: {
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3DDF3",
    backgroundColor: "#FFFFFF",
    color: "#19152B",
    fontSize: 15,
  },

  socialArea: {
    marginTop: 18,
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD6EE",
  },

  orText: {
    marginHorizontal: 12,
    color: "#9992AA",
    fontSize: 11,
    fontWeight: "800",
  },

  socialButton: {
    minHeight: 52,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3DDF3",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  socialIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  socialIconText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#19152B",
  },

  socialButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#29233B",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 14,
  },

  forgotText: {
    color: "#6C4DFF",
    fontSize: 13,
    fontWeight: "800",
  },

  authScroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 35,
  },

  authHeader: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoCircle: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  logoInner: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },

  logoLetter: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  logoText: {
    marginTop: 5,
    color: "#6C4DFF",
    fontSize: 17,
    fontWeight: "900",
  },

  logoTextLarge: {
    fontSize: 24,
    marginTop: 7,
  },

  authTitle: {
    marginTop: 18,
    color: "#19152B",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  authSubtitle: {
    marginTop: 6,
    color: "#77718C",
    fontSize: 13,
    textAlign: "center",
  },

  switchAuthRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  switchAuthText: {
    color: "#77718C",
    fontSize: 13,
  },

  switchAuthLink: {
    marginLeft: 5,
    color: "#6C4DFF",
    fontSize: 13,
    fontWeight: "900",
  },
});

// =====================================================
// الجزء 3 انتهى
// =====================================================
const SplashScreen = ({
  onFinish,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={[
        "#4F35D8",
        "#704DFF",
        "#A05CFF",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.splash}
    >
      <View style={styles.splashGlowOne} />
      <View style={styles.splashGlowTwo} />

      <PayPopLogo large />

      <View style={styles.splashCoin}>
        <PayPopCoin
          size={82}
          showName={false}
        />
      </View>

      <Text style={styles.splashTitle}>
        PayPop
      </Text>

      <Text style={styles.splashSubtitle}>
        Earn • Play • Enjoy
      </Text>

      <View style={styles.loadingDots}>
        <View style={styles.loadingDot} />
        <View style={styles.loadingDot} />
        <View style={styles.loadingDot} />
      </View>
    </LinearGradient>
  );
};

// =====================================================
// Main balance card
// =====================================================

const BalanceCard = ({
  user,
  currency,
}) => {
  const usd = pointsToUSD(user.points);
  const converted = convertUSD(
    usd,
    currency
  );

  return (
    <LinearGradient
      colors={[
        "#5A3CE7",
        "#7A55FF",
        "#A15CFF",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.balanceCard}
    >
      <View style={styles.balanceGlow} />

      <View style={styles.balanceTop}>
        <View>
          <Text style={styles.balanceLabel}>
            {TRANSLATIONS.ar.balance}
          </Text>

          <View style={styles.balanceAmountRow}>
            <PayPopCoin
              size={38}
              showName={false}
            />

            <Text style={styles.balancePoints}>
              {formatNumber(user.points)}
            </Text>
          </View>

          <Text style={styles.balancePointsLabel}>
            PayPop Points
          </Text>
        </View>

        <View style={styles.usdBox}>
          <Text style={styles.usdLabel}>
            USD
          </Text>

          <Text style={styles.usdAmount}>
            ${usd.toFixed(4)}
          </Text>
        </View>
      </View>

      <View style={styles.balanceDivider} />

      <View style={styles.balanceBottom}>
        <Text style={styles.balanceConvertedLabel}>
          ≈ {formatMoney(
            converted,
            currency
          )}
        </Text>

        <Text style={styles.balanceRate}>
          100,000 = $1
        </Text>
      </View>
    </LinearGradient>
  );
};

// =====================================================
// Quick actions
// =====================================================

const QuickAction = ({
  icon,
  title,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.quickActionIcon}>
        <Text style={styles.quickActionEmoji}>
          {icon}
        </Text>
      </View>

      <Text style={styles.quickActionText}>
        {title}
      </Text>
    </Pressable>
  );
};

const QuickActions = ({
  onEarn,
  onWheel,
  onDaily,
  onReferral,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <View style={styles.quickActions}>
      <QuickAction
        icon="🎁"
        title={t.dailyReward}
        onPress={onDaily}
      />

      <QuickAction
        icon="🎡"
        title={t.wheel}
        onPress={onWheel}
      />

      <QuickAction
        icon="🎮"
        title={t.games}
        onPress={onEarn}
      />

      <QuickAction
        icon="👥"
        title={t.referral}
        onPress={onReferral}
      />
    </View>
  );
};

// =====================================================
// Home screen
// =====================================================

const HomeScreen = ({
  user,
  currency,
  language,
  onEarn,
  onWheel,
  onDaily,
  onReferral,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.smallGreeting}>
            {t.welcome}
          </Text>

          <Text style={styles.userGreeting}>
            {user.name}
          </Text>
        </View>

        <View style={styles.headerCoin}>
          <PayPopCoin
            size={45}
            showName={false}
          />
        </View>
      </View>

      <BalanceCard
        user={user}
        currency={currency}
      />

      <QuickActions
        onEarn={onEarn}
        onWheel={onWheel}
        onDaily={onDaily}
        onReferral={onReferral}
        language={language}
      />

      <SectionTitle
        title={t.earnNow}
        subtitle={
          language === "ar"
            ? "اختار طريقة وابدأ تجمع PayPop"
            : language === "fr"
            ? "Choisissez une activité et gagnez des points"
            : "Choose an activity and earn points"
        }
      />

      <EarnCard
        icon="🎁"
        title={t.dailyReward}
        description={
          language === "ar"
            ? "مكافأة يومية مع سلسلة متواصلة"
            : language === "fr"
            ? "Récompense quotidienne avec série"
            : "Daily reward with a streak"
        }
        reward={getDailyReward(
          user.dailyStreak
        )}
        onPress={onDaily}
      />

      <EarnCard
        icon="🎡"
        title={t.wheel}
        description={
          language === "ar"
            ? "جرّب حظك كل يوم"
            : language === "fr"
            ? "Tentez votre chance chaque jour"
            : "Try your luck every day"
        }
        reward="10–250"
        onPress={onWheel}
      />

      <EarnCard
        icon="👥"
        title={t.referral}
        description={
          language === "ar"
            ? "ادعُ أصدقاءك واربح مكافآت"
            : language === "fr"
            ? "Invitez vos amis et gagnez"
            : "Invite friends and earn rewards"
        }
        reward={getReferralReward(
          user.referralCount
        )}
        onPress={onReferral}
      />

      <EarnCard
        icon="🎮"
        title={t.games}
        description={
          language === "ar"
            ? "العب واربح نقاط PayPop"
            : language === "fr"
            ? "Jouez et gagnez des points"
            : "Play and earn PayPop points"
        }
        reward={100}
        onPress={onEarn}
      />

      <View style={styles.infoCard}>
        <PayPopCoin
          size={34}
          showName={false}
        />

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            PayPop
          </Text>

          <Text style={styles.infoText}>
            {language === "ar"
              ? "كل 100,000 نقطة تساوي 1 دولار."
              : language === "fr"
              ? "100 000 points valent 1 dollar."
              : "100,000 points equal $1."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// =====================================================
// Earn screen
// =====================================================

const EarnScreen = ({
  user,
  language,
  onDaily,
  onWheel,
  onVideo,
  onGames,
  onReferral,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>
          {t.earn}
        </Text>

        <Text style={styles.pageSubtitle}>
          {language === "ar"
            ? "طرق مختلفة لزيادة رصيدك"
            : language === "fr"
            ? "Plusieurs façons d'augmenter votre solde"
            : "Different ways to increase your balance"}
        </Text>
      </View>

      <BalanceCard
        user={user}
        currency="USD"
      />

      <SectionTitle
        title={t.dailyReward}
        subtitle={
          language === "ar"
            ? "ارجع كل يوم لتحصل على مكافأتك"
            : language === "fr"
            ? "Revenez chaque jour pour votre récompense"
            : "Come back every day for your reward"
        }
      />

      <EarnCard
        icon="🎁"
        title={t.dailyReward}
        description={
          language === "ar"
            ? "افتح مكافأتك اليومية"
            : language === "fr"
            ? "Ouvrez votre récompense quotidienne"
            : "Open your daily reward"
        }
        reward={getDailyReward(
          user.dailyStreak
        )}
        onPress={onDaily}
      />

      <EarnCard
        icon="🎡"
        title={t.wheel}
        description={
          language === "ar"
            ? "لفة مجانية يوميًا + لفات إضافية لاحقًا"
            : language === "fr"
            ? "Une rotation gratuite par jour"
            : "One free spin every day"
        }
        reward="10–250"
        onPress={onWheel}
      />

      <EarnCard
        icon="📺"
        title={t.watchVideo}
        description={
          language === "ar"
            ? "شاهد فيديو واحصل على نقاط"
            : language === "fr"
            ? "Regardez une vidéo et gagnez des points"
            : "Watch a video and earn points"
        }
        reward={100}
        onPress={onVideo}
      />

      <EarnCard
        icon="🎮"
        title={t.games}
        description={
          language === "ar"
            ? "ألعاب ومهام ممتعة"
            : language === "fr"
            ? "Jeux et missions amusants"
            : "Fun games and missions"
        }
        reward={150}
        onPress={onGames}
      />

      <EarnCard
        icon="👥"
        title={t.referral}
        description={
          language === "ar"
            ? "اربح أكثر مع كل صديق جديد"
            : language === "fr"
            ? "Gagnez plus avec chaque nouvel ami"
            : "Earn more with every new friend"
        }
        reward={getReferralReward(
          user.referralCount
        )}
        onPress={onReferral}
      />
    </ScrollView>
  );
};

// =====================================================
// الجزء 4 انتهى
// =====================================================
// ======================================================
// الجزء 5 — المكافأة اليومية + الإحالات
// ======================================================

const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

const canClaimDaily = (lastClaim) => {
  return Date.now() - Number(lastClaim || 0) >= DAILY_COOLDOWN;
};

const getRemainingDailyTime = (lastClaim) => {
  const remaining = DAILY_COOLDOWN - (Date.now() - Number(lastClaim || 0));

  if (remaining <= 0) {
    return "00:00:00";
  }

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor(
    (remaining % (60 * 60 * 1000)) / (60 * 1000)
  );
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

const DailyRewardScreen = ({
  user,
  language = "ar",
  onClaim,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;

  const [remaining, setRemaining] = useState(
    getRemainingDailyTime(user?.lastDailyClaim)
  );
  const [opening, setOpening] = useState(false);

  const reward = getDailyReward(user?.dailyStreak || 0);
  const available = canClaimDaily(user?.lastDailyClaim);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(getRemainingDailyTime(user?.lastDailyClaim));
    }, 1000);

    return () => clearInterval(timer);
  }, [user?.lastDailyClaim]);

  const handleClaim = async () => {
    if (!available || opening) return;

    setOpening(true);

    await wait(700);

    if (onClaim) {
      await onClaim(reward);
    }

    setOpening(false);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.dailyContainer}
    >
      <SectionTitle
        title={
          language === "ar"
            ? "المكافأة اليومية"
            : language === "fr"
            ? "Récompense quotidienne"
            : "Daily Reward"
        }
        subtitle={
          language === "ar"
            ? "ادخل كل يوم واربح المزيد"
            : language === "fr"
            ? "Reviens chaque jour pour gagner plus"
            : "Come back every day and earn more"
        }
      />

      <GlassCard style={styles.dailyMainCard}>
        <View style={styles.dailyChest}>
          <LinearGradient
            colors={["#FFD76A", "#F6A623", "#D98216"]}
            style={styles.chestOuter}
          >
            <View style={styles.chestTop}>
              <Text style={styles.chestLock}>✦</Text>
            </View>

            <View style={styles.chestBody}>
              <Text style={styles.chestP}>P</Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.dailyTitle}>
          {opening
            ? language === "ar"
              ? "جاري فتح الصندوق..."
              : language === "fr"
              ? "Ouverture..."
              : "Opening..."
            : language === "ar"
            ? "صندوقك اليومي"
            : language === "fr"
            ? "Ton coffre quotidien"
            : "Your Daily Chest"}
        </Text>

        <Text style={styles.dailyRewardText}>
          +{formatNumber(reward)} PayPop
        </Text>

        <Text style={styles.dailyStreakText}>
          {language === "ar"
            ? `اليوم ${Math.min((user?.dailyStreak || 0) + 1, 7)} من 7`
            : language === "fr"
            ? `Jour ${Math.min((user?.dailyStreak || 0) + 1, 7)} sur 7`
            : `Day ${Math.min((user?.dailyStreak || 0) + 1, 7)} of 7`}
        </Text>

        <GradientButton
          title={
            available
              ? language === "ar"
                ? "افتح الصندوق"
                : language === "fr"
                ? "Ouvrir le coffre"
                : "Open Chest"
              : `${language === "ar" ? "متاح بعد" : "Available in"} ${remaining}`
          }
          onPress={handleClaim}
          disabled={!available || opening}
        />
      </GlassCard>

      <Text style={styles.rewardSeriesTitle}>
        {language === "ar"
          ? "سلسلة المكافآت"
          : language === "fr"
          ? "Série de récompenses"
          : "Reward Series"}
      </Text>

      <View style={styles.rewardSeries}>
        {DAILY_REWARDS.map((amount, index) => {
          const active = index === (user?.dailyStreak || 0) % 7;

          return (
            <View
              key={`daily-${index}`}
              style={[
                styles.rewardDay,
                active && styles.rewardDayActive,
              ]}
            >
              <Text style={styles.rewardDayNumber}>
                {index + 1}
              </Text>

              <View style={styles.rewardMiniCoin}>
                <Text style={styles.rewardMiniP}>P</Text>
              </View>

              <Text style={styles.rewardAmount}>
                {amount}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const ReferralScreen = ({
  user,
  language = "ar",
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;

  const referralCode = user?.referralCode || "PAYPOP";
  const count = Number(user?.referralCount || 0);

  const currentReward = getReferralReward(count);
  const nextReward = getReferralReward(count + 1);

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          language === "ar"
            ? `انضم إلى PayPop واربح النقاط معي! 🎁\nكود الدعوة الخاص بي: ${referralCode}\nhttps://paypop.app/invite/${referralCode}`
            : language === "fr"
            ? `Rejoins PayPop et gagne des points avec moi ! 🎁\nMon code d'invitation : ${referralCode}\nhttps://paypop.app/invite/${referralCode}`
            : `Join PayPop and earn points with me! 🎁\nMy referral code: ${referralCode}\nhttps://paypop.app/invite/${referralCode}`,
      });
    } catch (error) {
      Alert.alert("PayPop", "Unable to open sharing.");
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.referralContainer}
    >
      <SectionTitle
        title={
          language === "ar"
            ? "ادعُ أصدقاءك"
            : language === "fr"
            ? "Invite tes amis"
            : "Invite Friends"
        }
        subtitle={
          language === "ar"
            ? "اربح نقاطًا إضافية مع كل دعوة مؤهلة"
            : language === "fr"
            ? "Gagne des points avec chaque invitation"
            : "Earn extra points with every eligible invite"
        }
      />

      <LinearGradient
        colors={["#6D5DFB", "#8B5CF6", "#C026D3"]}
        style={styles.referralHero}
      >
        <View style={styles.referralIconCircle}>
          <Text style={styles.referralIcon}>👥</Text>
        </View>

        <Text style={styles.referralHeroTitle}>
          {language === "ar"
            ? "شارك واربح"
            : language === "fr"
            ? "Partage et gagne"
            : "Share & Earn"}
        </Text>

        <Text style={styles.referralHeroText}>
          {language === "ar"
            ? "شارك كودك مع أصدقائك وابدأ في بناء مكافآتك"
            : language === "fr"
            ? "Partage ton code et construis tes récompenses"
            : "Share your code and build your rewards"}
        </Text>
      </LinearGradient>

      <GlassCard style={styles.codeCard}>
        <Text style={styles.codeLabel}>
          {language === "ar"
            ? "كود الدعوة الخاص بك"
            : language === "fr"
            ? "Ton code d'invitation"
            : "Your Referral Code"}
        </Text>

        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{referralCode}</Text>
        </View>

        <GradientButton
          title={
            language === "ar"
              ? "مشاركة كود الدعوة"
              : language === "fr"
              ? "Partager le code"
              : "Share Referral Code"
          }
          onPress={handleShare}
        />
      </GlassCard>

      <View style={styles.referralStatsRow}>
        <StatPill
          value={formatNumber(count)}
          label={
            language === "ar"
              ? "الأصدقاء"
              : language === "fr"
              ? "Amis"
              : "Friends"
          }
        />

        <StatPill
          value={`+${formatNumber(currentReward)}`}
          label={
            language === "ar"
              ? "المكافأة"
              : language === "fr"
              ? "Récompense"
              : "Reward"
          }
        />
      </View>

      <GlassCard style={styles.nextReferralCard}>
        <Text style={styles.nextReferralTitle}>
          {language === "ar"
            ? "المكافأة القادمة"
            : language === "fr"
            ? "Prochaine récompense"
            : "Next Reward"}
        </Text>

        <View style={styles.nextReferralRow}>
          <View>
            <Text style={styles.nextReferralCount}>
              {count + 1}
            </Text>

            <Text style={styles.nextReferralSmall}>
              {language === "ar"
                ? "دعوة مؤهلة"
                : language === "fr"
                ? "Invitation"
                : "Eligible invite"}
            </Text>
          </View>

          <View style={styles.nextReferralReward}>
            <PayPopCoin size={42} showName={false} />

            <Text style={styles.nextReferralAmount}>
              +{formatNumber(nextReward)}
            </Text>
          </View>
        </View>
      </GlassCard>

      <Text style={styles.progressTitle}>
        {language === "ar"
          ? "تقدم الإحالات"
          : language === "fr"
          ? "Progression"
          : "Referral Progress"}
      </Text>

      <View style={styles.referralProgress}>
        {[
          250,
          450,
          500,
          600,
          700,
          800,
          900,
        ].map((amount, index) => {
          const completed = count > index;

          return (
            <View
              key={`ref-${index}`}
              style={[
                styles.referralStep,
                completed && styles.referralStepCompleted,
              ]}
            >
              <View style={styles.referralStepCircle}>
                <Text style={styles.referralStepNumber}>
                  {completed ? "✓" : index + 1}
                </Text>
              </View>

              <Text style={styles.referralStepAmount}>
                +{amount}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

Object.assign(styles, {
  dailyContainer: {
    padding: 18,
    paddingBottom: 110,
  },

  dailyMainCard: {
    alignItems: "center",
    paddingVertical: 28,
    marginBottom: 20,
  },

  dailyChest: {
    marginBottom: 18,
  },

  chestOuter: {
    width: 130,
    height: 112,
    borderRadius: 24,
    padding: 8,
    justifyContent: "flex-end",
  },

  chestTop: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  chestLock: {
    fontSize: 22,
    color: "#6B3F00",
    fontWeight: "900",
  },

  chestBody: {
    height: 66,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  chestP: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFF",
  },

  dailyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 7,
  },

  dailyRewardText: {
    fontSize: 19,
    fontWeight: "900",
    color: "#FFD76A",
    marginBottom: 5,
  },

  dailyStreakText: {
    fontSize: 13,
    color: "#BFC5D8",
    marginBottom: 20,
  },

  rewardSeriesTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 12,
  },

  rewardSeries: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 7,
  },

  rewardDay: {
    flex: 1,
    minHeight: 100,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  rewardDayActive: {
    borderColor: "#F6C453",
    backgroundColor: "rgba(246,196,83,0.12)",
  },

  rewardDayNumber: {
    fontSize: 11,
    color: "#AEB5C8",
    marginBottom: 5,
  },

  rewardMiniCoin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F6C453",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  rewardMiniP: {
    color: "#6B4200",
    fontWeight: "900",
  },

  rewardAmount: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFF",
  },

  referralContainer: {
    padding: 18,
    paddingBottom: 110,
  },

  referralHero: {
    borderRadius: 26,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },

  referralIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  referralIcon: {
    fontSize: 28,
  },

  referralHeroTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 7,
  },

  referralHeroText: {
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
  },

  codeCard: {
    marginBottom: 14,
  },

  codeLabel: {
    color: "#AEB5C8",
    fontSize: 12,
    marginBottom: 9,
  },

  codeBox: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(246,196,83,0.4)",
    backgroundColor: "rgba(246,196,83,0.08)",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 13,
  },

  codeText: {
    color: "#FFD76A",
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 3,
  },

  referralStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  nextReferralCard: {
    marginBottom: 20,
  },

  nextReferralTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 16,
  },

  nextReferralRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nextReferralCount: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "900",
  },

  nextReferralSmall: {
    color: "#9299AD",
    fontSize: 12,
  },

  nextReferralReward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  nextReferralAmount: {
    color: "#FFD76A",
    fontSize: 20,
    fontWeight: "900",
  },

  progressTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  referralProgress: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  referralStep: {
    width: "30%",
    minHeight: 92,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  referralStepCompleted: {
    backgroundColor: "rgba(246,196,83,0.1)",
    borderColor: "rgba(246,196,83,0.35)",
  },

  referralStepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(109,93,251,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  referralStepNumber: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 12,
  },

  referralStepAmount: {
    color: "#FFD76A",
    fontSize: 12,
    fontWeight: "900",
  },
});

// الجزء 5 انتهى
// ======================================================
// الجزء 6 — المحفظة والسحب
// ======================================================

const getWithdrawField = (method) => {
  switch (method) {
    case "PayPal":
      return {
        label: "PayPal Email",
        placeholder: "example@email.com",
        keyboardType: "email-address",
      };

    case "Binance":
      return {
        label: "Binance Pay ID / UID",
        placeholder: "Enter your Binance ID",
        keyboardType: "default",
      };

    case "RedotPay":
      return {
        label: "RedotPay ID / UID",
        placeholder: "Enter your RedotPay ID",
        keyboardType: "default",
      };

    case "BaridiMob":
      return {
        label: "RIP BaridiMob",
        placeholder: "Enter your RIP",
        keyboardType: "numeric",
      };

    case "Free Fire":
      return {
        label: "Free Fire ID",
        placeholder: "Enter your Free Fire ID",
        keyboardType: "numeric",
      };

    case "PUBG":
      return {
        label: "PUBG ID",
        placeholder: "Enter your PUBG ID",
        keyboardType: "numeric",
      };

    default:
      return {
        label: "Account",
        placeholder: "Enter your account",
        keyboardType: "default",
      };
  }
};

const WalletScreen = ({
  user,
  language = "ar",
  currency = "USD",
  onWithdraw,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;

  const [selectedMethod, setSelectedMethod] = useState("PayPal");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");

  const points = Number(user?.points || 0);
  const usdBalance = pointsToUSD(points);

  const currencyRate = CURRENCIES[currency] || 1;
  const displayedBalance = convertUSD(usdBalance, currencyRate);

  const field = getWithdrawField(selectedMethod);

  const amountNumber = Number(amount || 0);
  const requestedPoints = Math.round(amountNumber * 100000);

  const validAmount =
    amountNumber > 0 &&
    requestedPoints >= MIN_WITHDRAW_POINTS &&
    requestedPoints <= points;

  const handleWithdraw = () => {
    if (!account.trim()) {
      Alert.alert(
        "PayPop",
        language === "ar"
          ? "أدخل معلومات الحساب أولاً."
          : language === "fr"
          ? "Entrez d'abord les informations du compte."
          : "Enter your account information first."
      );
      return;
    }

    if (!validAmount) {
      Alert.alert(
        "PayPop",
        language === "ar"
          ? `الحد الأدنى للسحب هو ${formatNumber(
              MIN_WITHDRAW_POINTS
            )} نقطة.`
          : language === "fr"
          ? `Le minimum de retrait est ${formatNumber(
              MIN_WITHDRAW_POINTS
            )} points.`
          : `Minimum withdrawal is ${formatNumber(
              MIN_WITHDRAW_POINTS
            )} points.`
      );
      return;
    }

    if (onWithdraw) {
      onWithdraw({
        method: selectedMethod,
        account: account.trim(),
        amountUSD: amountNumber,
        points: requestedPoints,
      });
    }

    setAccount("");
    setAmount("");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.walletContainer}
    >
      <SectionTitle
        title={
          language === "ar"
            ? "المحفظة"
            : language === "fr"
            ? "Portefeuille"
            : "Wallet"
        }
        subtitle={
          language === "ar"
            ? "إدارة رصيدك وطلبات السحب"
            : language === "fr"
            ? "Gère ton solde et tes retraits"
            : "Manage your balance and withdrawals"
        }
      />

      <LinearGradient
        colors={["#171B3A", "#4C35A8", "#7C3AED"]}
        style={styles.walletBalanceCard}
      >
        <View style={styles.walletCoinWrap}>
          <PayPopCoin size={54} showName={false} />
        </View>

        <Text style={styles.walletBalanceLabel}>
          {language === "ar"
            ? "رصيدك الحالي"
            : language === "fr"
            ? "Solde actuel"
            : "Current Balance"}
        </Text>

        <Text style={styles.walletBalanceValue}>
          {formatMoney(displayedBalance, currency)}
        </Text>

        <Text style={styles.walletPointsValue}>
          {formatNumber(points)} PayPop
        </Text>

        <View style={styles.walletRate}>
          <Text style={styles.walletRateText}>
            100,000 PayPop = $1 USD
          </Text>
        </View>
      </LinearGradient>

      <Text style={styles.walletSectionTitle}>
        {language === "ar"
          ? "اختر طريقة السحب"
          : language === "fr"
          ? "Choisir le retrait"
          : "Choose Withdrawal Method"}
      </Text>

      <View style={styles.methodsGrid}>
        {WITHDRAW_METHODS.map((method) => {
          const active = selectedMethod === method;

          return (
            <Pressable
              key={method}
              onPress={() => {
                setSelectedMethod(method);
                setAccount("");
              }}
              style={[
                styles.withdrawMethod,
                active && styles.withdrawMethodActive,
              ]}
            >
              <View
                style={[
                  styles.methodLogo,
                  method === "PayPal" && styles.paypalLogo,
                  method === "Binance" && styles.binanceLogo,
                  method === "RedotPay" && styles.redotLogo,
                  method === "BaridiMob" && styles.baridiLogo,
                ]}
              >
                <Text style={styles.methodLogoText}>
                  {method === "PayPal"
                    ? "P"
                    : method === "Binance"
                    ? "B"
                    : method === "RedotPay"
                    ? "R"
                    : method === "BaridiMob"
                    ? "BM"
                    : method === "Free Fire"
                    ? "FF"
                    : "PUBG"}
                </Text>
              </View>

              <Text
                style={[
                  styles.methodName,
                  active && styles.methodNameActive,
                ]}
              >
                {method}
              </Text>

              {active && (
                <View style={styles.methodCheck}>
                  <Text style={styles.methodCheckText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <GlassCard style={styles.withdrawCard}>
        <Text style={styles.withdrawCardTitle}>
          {language === "ar"
            ? "تفاصيل السحب"
            : language === "fr"
            ? "Détails du retrait"
            : "Withdrawal Details"}
        </Text>

        <Text style={styles.withdrawLabel}>
          {field.label}
        </Text>

        <TextInput
          value={account}
          onChangeText={setAccount}
          placeholder={field.placeholder}
          placeholderTextColor="#777F96"
          keyboardType={field.keyboardType}
          autoCapitalize="none"
          style={styles.withdrawInput}
        />

        <Text style={styles.withdrawLabel}>
          {language === "ar"
            ? "المبلغ بالدولار"
            : language === "fr"
            ? "Montant en USD"
            : "Amount in USD"}
        </Text>

        <View style={styles.amountInputRow}>
          <Text style={styles.dollarSign}>$</Text>

          <TextInput
            value={amount}
            onChangeText={(text) =>
              setAmount(text.replace(/[^0-9.]/g, ""))
            }
            placeholder="10"
            placeholderTextColor="#777F96"
            keyboardType="decimal-pad"
            style={styles.amountInput}
          />
        </View>

        <View style={styles.withdrawInfo}>
          <Text style={styles.withdrawInfoText}>
            {language === "ar"
              ? `الحد الأدنى: ${formatNumber(
                  MIN_WITHDRAW_POINTS
                )} نقطة`
              : language === "fr"
              ? `Minimum : ${formatNumber(
                  MIN_WITHDRAW_POINTS
                )} points`
              : `Minimum: ${formatNumber(
                  MIN_WITHDRAW_POINTS
                )} points`}
          </Text>

          <Text style={styles.withdrawInfoText}>
            {language === "ar"
              ? `سيتم خصم ${formatNumber(
                  requestedPoints
                )} نقطة`
              : language === "fr"
              ? `${formatNumber(
                  requestedPoints
                )} points seront déduits`
              : `${formatNumber(
                  requestedPoints
                )} points will be deducted`}
          </Text>
        </View>

        <GradientButton
          title={
            language === "ar"
              ? "طلب السحب"
              : language === "fr"
              ? "Demander le retrait"
              : "Request Withdrawal"
          }
          onPress={handleWithdraw}
          disabled={!validAmount || !account.trim()}
        />
      </GlassCard>

      <GlassCard style={styles.walletNotice}>
        <Text style={styles.noticeIcon}>ⓘ</Text>

        <Text style={styles.noticeText}>
          {language === "ar"
            ? "طلبات السحب الحقيقية تحتاج إلى معالجة من الخادم. في النسخة الحالية سيتم تسجيل الطلب فقط."
            : language === "fr"
            ? "Les retraits réels nécessitent un traitement serveur. Cette version enregistre seulement la demande."
            : "Real withdrawals require server-side processing. This version only registers the request."}
        </Text>
      </GlassCard>
    </ScrollView>
  );
};

Object.assign(styles, {
  walletContainer: {
    padding: 18,
    paddingBottom: 110,
  },

  walletBalanceCard: {
    borderRadius: 26,
    padding: 22,
    marginBottom: 22,
    overflow: "hidden",
  },

  walletCoinWrap: {
    alignItems: "center",
    marginBottom: 12,
  },

  walletBalanceLabel: {
    color: "#C7CCE0",
    textAlign: "center",
    fontSize: 13,
  },

  walletBalanceValue: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 5,
  },

  walletPointsValue: {
    color: "#FFD76A",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 5,
  },

  walletRate: {
    alignSelf: "center",
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  walletRateText: {
    color: "#E5E7F0",
    fontSize: 11,
    fontWeight: "700",
  },

  walletSectionTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  methodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  withdrawMethod: {
    width: "47.5%",
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  withdrawMethodActive: {
    borderColor: "#F6C453",
    backgroundColor: "rgba(246,196,83,0.09)",
  },

  methodLogo: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#24283A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  paypalLogo: {
    backgroundColor: "#153B8F",
  },

  binanceLogo: {
    backgroundColor: "#F0B90B",
  },

  redotLogo: {
    backgroundColor: "#D92727",
  },

  baridiLogo: {
    backgroundColor: "#1264A3",
  },

  methodLogoText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "900",
  },

  methodName: {
    color: "#B8BED0",
    fontSize: 12,
    fontWeight: "800",
  },

  methodNameActive: {
    color: "#FFD76A",
  },

  methodCheck: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#F6C453",
    alignItems: "center",
    justifyContent: "center",
  },

  methodCheckText: {
    color: "#513600",
    fontSize: 11,
    fontWeight: "900",
  },

  withdrawCard: {
    marginBottom: 14,
  },

  withdrawCardTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 17,
  },

  withdrawLabel: {
    color: "#AEB5C8",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  withdrawInput: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    color: "#FFF",
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 14,
  },

  amountInputRow: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 14,
  },

  dollarSign: {
    color: "#FFD76A",
    fontSize: 20,
    fontWeight: "900",
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },

  withdrawInfo: {
    borderRadius: 14,
    backgroundColor: "rgba(109,93,251,0.09)",
    padding: 12,
    marginBottom: 15,
    gap: 5,
  },

  withdrawInfoText: {
    color: "#AEB5C8",
    fontSize: 11,
  },

  walletNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  noticeIcon: {
    color: "#FFD76A",
    fontSize: 20,
    fontWeight: "900",
  },

  noticeText: {
    flex: 1,
    color: "#9EA5B8",
    fontSize: 11,
    lineHeight: 17,
  },
});

// الجزء 6 انتهى
// ======================================================
// الجزء 7 — الملف الشخصي + الصورة + الإعدادات
// ======================================================

const ProfileAvatar = ({ user, size = 82 }) => {
  if (user?.profileImage) {
    return (
      <Image
        source={{ uri: user.profileImage }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  }

  return (
    <LinearGradient
      colors={["#FFD76A", "#F59E0B", "#7C3AED"]}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.defaultAvatarInner}>
        <Text style={styles.defaultAvatarP}>P</Text>
      </View>
    </LinearGradient>
  );
};

const ProfileScreen = ({
  user,
  language = "ar",
  darkMode = true,
  onUpdateUser,
  onLanguageChange,
  onDarkModeChange,
  onLogout,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;

  const [changingPhoto, setChangingPhoto] = useState(false);

  const pickProfilePhoto = async () => {
    try {
      setChangingPhoto(true);

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "PayPop",
          language === "ar"
            ? "اسمح للتطبيق بالوصول إلى الصور أولاً."
            : language === "fr"
            ? "Autorise l'accès aux photos."
            : "Please allow photo access first."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const uri = result.assets[0].uri;

        if (onUpdateUser) {
          await onUpdateUser({
            profileImage: uri,
          });
        }
      }
    } catch (error) {
      Alert.alert(
        "PayPop",
        language === "ar"
          ? "حدث خطأ أثناء اختيار الصورة."
          : language === "fr"
          ? "Une erreur est survenue."
          : "Something went wrong."
      );
    } finally {
      setChangingPhoto(false);
    }
  };

  const languageName =
    language === "ar"
      ? "العربية"
      : language === "fr"
      ? "Français"
      : "English";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.profileContainer}
    >
      <SectionTitle
        title={
          language === "ar"
            ? "الملف الشخصي"
            : language === "fr"
            ? "Profil"
            : "Profile"
        }
        subtitle={
          language === "ar"
            ? "إدارة حسابك وإعدادات PayPop"
            : language === "fr"
            ? "Gère ton compte et tes paramètres"
            : "Manage your account and PayPop settings"
        }
      />

      <GlassCard style={styles.profileHero}>
        <Pressable
          onPress={pickProfilePhoto}
          disabled={changingPhoto}
          style={styles.profilePhotoButton}
        >
          <ProfileAvatar user={user} size={92} />

          <View style={styles.cameraBadge}>
            <Text style={styles.cameraBadgeText}>+</Text>
          </View>
        </Pressable>

        <Text style={styles.profileName}>
          {user?.name || "PayPop User"}
        </Text>

        <Text style={styles.profileEmail}>
          {user?.email || "PayPop account"}
        </Text>

        <Pressable
          onPress={pickProfilePhoto}
          style={styles.changePhotoButton}
        >
          <Text style={styles.changePhotoText}>
            {changingPhoto
              ? language === "ar"
                ? "جاري التحميل..."
                : language === "fr"
                ? "Chargement..."
                : "Loading..."
              : language === "ar"
              ? "تغيير صورة الحساب"
              : language === "fr"
              ? "Changer la photo"
              : "Change Profile Photo"}
          </Text>
        </Pressable>
      </GlassCard>

      <View style={styles.profileStatsGrid}>
        <GlassCard style={styles.profileStatCard}>
          <Text style={styles.profileStatValue}>
            {formatNumber(user?.points || 0)}
          </Text>
          <Text style={styles.profileStatLabel}>
            {language === "ar"
              ? "PayPop"
              : "Points"}
          </Text>
        </GlassCard>

        <GlassCard style={styles.profileStatCard}>
          <Text style={styles.profileStatValue}>
            {formatNumber(user?.referralCount || 0)}
          </Text>
          <Text style={styles.profileStatLabel}>
            {language === "ar"
              ? "الإحالات"
              : language === "fr"
              ? "Invitations"
              : "Referrals"}
          </Text>
        </GlassCard>
      </View>

      <Text style={styles.settingsTitle}>
        {language === "ar"
          ? "الإعدادات"
          : language === "fr"
          ? "Paramètres"
          : "Settings"}
      </Text>

      <GlassCard style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingIconBox}>
            <Text style={styles.settingIcon}>A</Text>
          </View>

          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>
              {language === "ar"
                ? "اللغة"
                : language === "fr"
                ? "Langue"
                : "Language"}
            </Text>

            <Text style={styles.settingValue}>
              {languageName}
            </Text>
          </View>

          <View style={styles.languageButtons}>
            {LANGUAGES.map((item) => {
              const active = item.code === language;

              return (
                <Pressable
                  key={item.code}
                  onPress={() =>
                    onLanguageChange &&
                    onLanguageChange(item.code)
                  }
                  style={[
                    styles.languageButton,
                    active && styles.languageButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      active &&
                        styles.languageButtonTextActive,
                    ]}
                  >
                    {item.short}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.settingDivider} />

        <View style={styles.settingRow}>
          <View style={styles.settingIconBox}>
            <Text style={styles.settingIcon}>☾</Text>
          </View>

          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>
              {language === "ar"
                ? "الوضع الليلي"
                : language === "fr"
                ? "Mode sombre"
                : "Dark Mode"}
            </Text>

            <Text style={styles.settingValue}>
              {darkMode
                ? language === "ar"
                  ? "مفعّل"
                  : language === "fr"
                  ? "Activé"
                  : "Enabled"
                : language === "ar"
                ? "متوقف"
                : language === "fr"
                ? "Désactivé"
                : "Disabled"}
            </Text>
          </View>

          <Pressable
            onPress={() =>
              onDarkModeChange &&
              onDarkModeChange(!darkMode)
            }
            style={[
              styles.switchTrack,
              darkMode && styles.switchTrackActive,
            ]}
          >
            <View
              style={[
                styles.switchThumb,
                darkMode && styles.switchThumbActive,
              ]}
            />
          </Pressable>
        </View>
      </GlassCard>

      <GlassCard style={styles.referralCodeProfile}>
        <Text style={styles.settingName}>
          {language === "ar"
            ? "كود الدعوة الخاص بك"
            : language === "fr"
            ? "Ton code d'invitation"
            : "Your Referral Code"}
        </Text>

        <View style={styles.profileCodeBox}>
          <Text style={styles.profileCodeText}>
            {user?.referralCode || "PAYPOP"}
          </Text>
        </View>

        <Text style={styles.profileCodeHint}>
          {language === "ar"
            ? "شارك هذا الكود مع أصدقائك لربح المزيد من PayPop."
            : language === "fr"
            ? "Partage ce code avec tes amis pour gagner plus."
            : "Share this code with friends to earn more."}
        </Text>
      </GlassCard>

      <Pressable
        onPress={() =>
          Alert.alert(
            "PayPop",
            language === "ar"
              ? "سيتم فتح دعم PayPop على WhatsApp."
              : language === "fr"
              ? "Le support PayPop va s'ouvrir sur WhatsApp."
              : "PayPop support will open on WhatsApp."
          )
        }
        style={styles.supportButton}
      >
        <Text style={styles.supportButtonText}>
          {language === "ar"
            ? "الدعم والمساعدة"
            : language === "fr"
            ? "Support et aide"
            : "Support & Help"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          if (onLogout) {
            onLogout();
          }
        }}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutButtonText}>
          {language === "ar"
            ? "تسجيل الخروج"
            : language === "fr"
            ? "Déconnexion"
            : "Log Out"}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

Object.assign(styles, {
  profileContainer: {
    padding: 18,
    paddingBottom: 120,
  },

  profileHero: {
    alignItems: "center",
    paddingVertical: 25,
    marginBottom: 14,
  },

  profilePhotoButton: {
    position: "relative",
    marginBottom: 13,
  },

  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 2,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#F6C453",
    borderWidth: 3,
    borderColor: "#16182A",
    alignItems: "center",
    justifyContent: "center",
  },

  cameraBadgeText: {
    color: "#573900",
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 20,
  },

  defaultAvatarInner: {
    width: "82%",
    height: "82%",
    borderRadius: 100,
    backgroundColor: "#191B31",
    alignItems: "center",
    justifyContent: "center",
  },

  defaultAvatarP: {
    color: "#FFD76A",
    fontSize: 38,
    fontWeight: "900",
  },

  profileName: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
  },

  profileEmail: {
    color: "#9299AD",
    fontSize: 12,
    marginTop: 4,
  },

  changePhotoButton: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "rgba(246,196,83,0.1)",
    borderWidth: 1,
    borderColor: "rgba(246,196,83,0.25)",
  },

  changePhotoText: {
    color: "#FFD76A",
    fontSize: 12,
    fontWeight: "800",
  },

  profileStatsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  profileStatCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 17,
  },

  profileStatValue: {
    color: "#FFF",
    fontSize: 19,
    fontWeight: "900",
  },

  profileStatLabel: {
    color: "#9299AD",
    fontSize: 11,
    marginTop: 4,
  },

  settingsTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 11,
  },

  settingsCard: {
    marginBottom: 14,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
  },

  settingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(109,93,251,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  settingIcon: {
    color: "#B9AFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  settingInfo: {
    flex: 1,
  },

  settingName: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },

  settingValue: {
    color: "#858CA1",
    fontSize: 11,
    marginTop: 3,
  },

  languageButtons: {
    flexDirection: "row",
    gap: 5,
  },

  languageButton: {
    minWidth: 34,
    height: 30,
    paddingHorizontal: 7,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  languageButtonActive: {
    backgroundColor: "#6D5DFB",
  },

  languageButtonText: {
    color: "#8E95A8",
    fontSize: 10,
    fontWeight: "900",
  },

  languageButtonTextActive: {
    color: "#FFF",
  },

  settingDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginVertical: 8,
  },

  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 15,
    backgroundColor: "#2B3042",
    padding: 3,
    justifyContent: "center",
  },

  switchTrackActive: {
    backgroundColor: "#6D5DFB",
  },

  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#8C93A6",
  },

  switchThumbActive: {
    alignSelf: "flex-end",
    backgroundColor: "#FFF",
  },

  referralCodeProfile: {
    marginBottom: 14,
  },

  profileCodeBox: {
    marginTop: 12,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "rgba(246,196,83,0.08)",
    borderWidth: 1,
    borderColor: "rgba(246,196,83,0.22)",
    alignItems: "center",
  },

  profileCodeText: {
    color: "#FFD76A",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 3,
  },

  profileCodeHint: {
    color: "#858CA1",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 9,
  },

  supportButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(37,211,102,0.12)",
    borderWidth: 1,
    borderColor: "rgba(37,211,102,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  supportButtonText: {
    color: "#7EE2A5",
    fontSize: 14,
    fontWeight: "900",
  },

  logoutButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,80,100,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,80,100,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButtonText: {
    color: "#FF8B9A",
    fontSize: 14,
    fontWeight: "900",
  },
});

// الجزء 7 انتهى
// ======================================================
// الجزء 8 — ربط التطبيق + التنقل + الحفظ المحلي
// ======================================================

// Image كان ناقصًا من الاستيراد في الجزء الأول.
// نعرّفه هنا بدون الحاجة لتعديل الأسطر القديمة.
const { Image } = require("react-native");

const NAV_ITEMS = [
  { key: "home", icon: "⌂" },
  { key: "earn", icon: "✦" },
  { key: "wallet", icon: "◈" },
  { key: "profile", icon: "●" },
];

const getNavLabel = (key, language) => {
  if (language === "ar") {
    if (key === "home") return "الرئيسية";
    if (key === "earn") return "إربح";
    if (key === "wallet") return "المحفظة";
    if (key === "profile") return "حسابي";
  }

  if (language === "fr") {
    if (key === "home") return "Accueil";
    if (key === "earn") return "Gagner";
    if (key === "wallet") return "Portefeuille";
    if (key === "profile") return "Profil";
  }

  if (key === "home") return "Home";
  if (key === "earn") return "Earn";
  if (key === "wallet") return "Wallet";
  return "Profile";
};

const MainNavigation = ({
  user,
  language,
  currency,
  darkMode,
  activeScreen,
  onNavigate,
  onAddPoints,
  onUpdateUser,
  onWithdraw,
  onLanguageChange,
  onDarkModeChange,
  onLogout,
}) => {
  const renderScreen = () => {
    if (activeScreen === "earn") {
      return (
        <EarnScreen
          user={user}
          language={language}
          currency={currency}
          onAddPoints={onAddPoints}
          onNavigate={onNavigate}
        />
      );
    }

    if (activeScreen === "wallet") {
      return (
        <WalletScreen
          user={user}
          language={language}
          currency={currency}
          onWithdraw={onWithdraw}
        />
      );
    }

    if (activeScreen === "profile") {
      return (
        <ProfileScreen
          user={user}
          language={language}
          darkMode={darkMode}
          onUpdateUser={onUpdateUser}
          onLanguageChange={onLanguageChange}
          onDarkModeChange={onDarkModeChange}
          onLogout={onLogout}
        />
      );
    }

    return (
      <HomeScreen
        user={user}
        language={language}
        currency={currency}
        onNavigate={onNavigate}
        onAddPoints={onAddPoints}
      />
    );
  };

  return (
    <View style={styles.appMain}>
      <View style={styles.screenArea}>
        {renderScreen()}
      </View>

      <View style={styles.bottomNavigation}>
        {NAV_ITEMS.map((item) => {
          const active = activeScreen === item.key;

          return (
            <Pressable
              key={item.key}
              onPress={() => onNavigate(item.key)}
              style={[
                styles.navItem,
                active && styles.navItemActive,
              ]}
            >
              <View
                style={[
                  styles.navIconBox,
                  active && styles.navIconBoxActive,
                ]}
              >
                <Text
                  style={[
                    styles.navIcon,
                    active && styles.navIconActive,
                  ]}
                >
                  {item.icon}
                </Text>
              </View>

              <Text
                style={[
                  styles.navLabel,
                  active && styles.navLabelActive,
                ]}
              >
                {getNavLabel(item.key, language)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("ar");
  const [currency, setCurrency] = useState("USD");
  const [darkMode, setDarkMode] = useState(true);
  const [activeScreen, setActiveScreen] = useState("home");

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const [
        savedUser,
        savedLanguage,
        savedCurrency,
        savedDarkMode,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE.USER),
        AsyncStorage.getItem(STORAGE.LANGUAGE),
        AsyncStorage.getItem(STORAGE.CURRENCY),
        AsyncStorage.getItem(STORAGE.DARK_MODE),
      ]);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedLanguage) {
        setLanguage(savedLanguage);
      }

      if (savedCurrency) {
        setCurrency(savedCurrency);
      }

      if (savedDarkMode !== null) {
        setDarkMode(savedDarkMode === "true");
      }
    } catch (error) {
      console.log("PayPop initialization error:", error);
    } finally {
      await wait(500);
      setLoading(false);
    }
  };

  const persistUser = async (nextUser) => {
    setUser(nextUser);

    try {
      await AsyncStorage.setItem(
        STORAGE.USER,
        JSON.stringify(nextUser)
      );
    } catch (error) {
      console.log("User save error:", error);
    }
  };

  const updateUser = async (changes) => {
    if (!user) return;

    const nextUser = {
      ...user,
      ...changes,
    };

    await persistUser(nextUser);
  };

  const addPoints = async (amount) => {
    const reward = Math.max(0, Number(amount || 0));

    if (!user || reward <= 0) return;

    const nextUser = {
      ...user,
      points: Number(user.points || 0) + reward,
    };

    await persistUser(nextUser);

    return reward;
  };

  const claimDailyReward = async (reward) => {
    if (!user) return;

    if (!canClaimDaily(user.lastDailyClaim)) {
      Alert.alert(
        "PayPop",
        language === "ar"
          ? "لقد أخذت مكافأتك اليومية بالفعل."
          : language === "fr"
          ? "Tu as déjà pris ta récompense quotidienne."
          : "You already claimed today's reward."
      );
      return;
    }

    const nextUser = {
      ...user,
      points: Number(user.points || 0) + Number(reward || 0),
      dailyStreak: Number(user.dailyStreak || 0) + 1,
      lastDailyClaim: Date.now(),
    };

    await persistUser(nextUser);

    Alert.alert(
      "🎁 PayPop",
      language === "ar"
        ? `مبروك! حصلت على +${formatNumber(reward)} PayPop.`
        : language === "fr"
        ? `Bravo ! Tu as gagné +${formatNumber(reward)} PayPop.`
        : `Congratulations! You earned +${formatNumber(reward)} PayPop.`
    );
  };

  const requestWithdrawal = async (request) => {
    if (!user) return;

    const requestedPoints = Number(request?.points || 0);

    if (requestedPoints <= 0) return;

    if (requestedPoints > Number(user.points || 0)) {
      Alert.alert(
        "PayPop",
        language === "ar"
          ? "رصيدك غير كافٍ."
          : language === "fr"
          ? "Solde insuffisant."
          : "Insufficient balance."
      );
      return;
    }

    const withdrawal = {
      id: `WD-${Date.now()}`,
      method: request.method,
      account: request.account,
      amountUSD: request.amountUSD,
      points: requestedPoints,
      status: "pending",
      createdAt: Date.now(),
    };

    const previousHistory = Array.isArray(user.withdrawals)
      ? user.withdrawals
      : [];

    const nextUser = {
      ...user,
      points: Number(user.points || 0) - requestedPoints,
      withdrawals: [withdrawal, ...previousHistory],
    };

    await persistUser(nextUser);

    Alert.alert(
      "PayPop",
      language === "ar"
        ? "تم تسجيل طلب السحب بنجاح."
        : language === "fr"
        ? "La demande de retrait a été enregistrée."
        : "Your withdrawal request has been registered."
    );
  };

  const changeLanguage = async (nextLanguage) => {
    setLanguage(nextLanguage);

    try {
      await AsyncStorage.setItem(
        STORAGE.LANGUAGE,
        nextLanguage
      );
    } catch (error) {
      console.log("Language save error:", error);
    }
  };

  const changeCurrency = async (nextCurrency) => {
    setCurrency(nextCurrency);

    try {
      await AsyncStorage.setItem(
        STORAGE.CURRENCY,
        nextCurrency
      );
    } catch (error) {
      console.log("Currency save error:", error);
    }
  };

  const changeDarkMode = async (enabled) => {
    setDarkMode(enabled);

    try {
      await AsyncStorage.setItem(
        STORAGE.DARK_MODE,
        String(enabled)
      );
    } catch (error) {
      console.log("Theme save error:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE.USER);
    } catch (error) {
      console.log("Logout error:", error);
    }

    setUser(null);
    setActiveScreen("home");
  };

  const handleLoginSuccess = async (loggedUser) => {
    await persistUser(loggedUser);
    setActiveScreen("home");
  };

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return (
      <AuthScreen
        language={language}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <SafeAreaView
      style={[
        styles.appRoot,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar
        barStyle={
          darkMode
            ? "light-content"
            : "dark-content"
        }
        backgroundColor={theme.background}
      />

      <MainNavigation
        user={user}
        language={language}
        currency={currency}
        darkMode={darkMode}
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        onAddPoints={addPoints}
        onUpdateUser={updateUser}
        onWithdraw={requestWithdrawal}
        onLanguageChange={changeLanguage}
        onDarkModeChange={changeDarkMode}
        onLogout={logout}
      />
    </SafeAreaView>
  );
};

Object.assign(styles, {
  appRoot: {
    flex: 1,
  },

  appMain: {
    flex: 1,
  },

  screenArea: {
    flex: 1,
  },

  bottomNavigation: {
    height: 76,
    backgroundColor: "#111426",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingBottom: 5,
  },

  navItem: {
    flex: 1,
    height: 66,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
  },

  navItemActive: {
    backgroundColor: "rgba(109,93,251,0.11)",
  },

  navIconBox: {
    width: 35,
    height: 30,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  navIconBoxActive: {
    backgroundColor: "rgba(109,93,251,0.18)",
  },

  navIcon: {
    color: "#777F96",
    fontSize: 20,
    fontWeight: "900",
  },

  navIconActive: {
    color: "#FFD76A",
  },

  navLabel: {
    color: "#777F96",
    fontSize: 10,
    fontWeight: "800",
  },

  navLabelActive: {
    color: "#FFD76A",
  },
});

// الجزء 8 انتهى
// ======================================================
// الجزء 9 — مركز المكافآت + التنقل للمكافآت
// ======================================================

const RewardCenter = ({
  user,
  language = "ar",
  onOpenDaily,
  onOpenReferral,
  onAddPoints,
}) => {
  const dailyReward = getDailyReward(user?.dailyStreak || 0);
  const referralCount = Number(user?.referralCount || 0);
  const referralReward = getReferralReward(referralCount);

  const handleSpecialReward = async () => {
    if (onAddPoints) {
      await onAddPoints(25);
    }

    Alert.alert(
      "🎁 PayPop",
      language === "ar"
        ? "مبروك! حصلت على 25 PayPop."
        : language === "fr"
        ? "Bravo ! Tu as gagné 25 PayPop."
        : "Congratulations! You earned 25 PayPop."
    );
  };

  return (
    <View style={styles.rewardCenter}>
      <Text style={styles.rewardCenterTitle}>
        {language === "ar"
          ? "مكافآتك"
          : language === "fr"
          ? "Tes récompenses"
          : "Your Rewards"}
      </Text>

      <View style={styles.rewardCenterGrid}>
        <Pressable
          onPress={onOpenDaily}
          style={styles.rewardCenterCard}
        >
          <LinearGradient
            colors={["#6D5DFB", "#8B5CF6"]}
            style={styles.rewardCenterGradient}
          >
            <Text style={styles.rewardCenterIcon}>🎁</Text>

            <Text style={styles.rewardCenterCardTitle}>
              {language === "ar"
                ? "المكافأة اليومية"
                : language === "fr"
                ? "Récompense quotidienne"
                : "Daily Reward"}
            </Text>

            <Text style={styles.rewardCenterAmount}>
              +{dailyReward}
            </Text>

            <Text style={styles.rewardCenterHint}>
              {language === "ar"
                ? "كل 24 ساعة"
                : language === "fr"
                ? "Toutes les 24h"
                : "Every 24 hours"}
            </Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={onOpenReferral}
          style={styles.rewardCenterCard}
        >
          <LinearGradient
            colors={["#A855F7", "#C026D3"]}
            style={styles.rewardCenterGradient}
          >
            <Text style={styles.rewardCenterIcon}>👥</Text>

            <Text style={styles.rewardCenterCardTitle}>
              {language === "ar"
                ? "دعوة الأصدقاء"
                : language === "fr"
                ? "Inviter des amis"
                : "Invite Friends"}
            </Text>

            <Text style={styles.rewardCenterAmount}>
              +{referralReward}
            </Text>

            <Text style={styles.rewardCenterHint}>
              {language === "ar"
                ? `${referralCount} دعوة`
                : language === "fr"
                ? `${referralCount} invitation(s)`
                : `${referralCount} invite(s)`}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>

      <Pressable
        onPress={handleSpecialReward}
        style={styles.specialRewardButton}
      >
        <View style={styles.specialRewardIcon}>
          <Text style={styles.specialRewardIconText}>★</Text>
        </View>

        <View style={styles.specialRewardInfo}>
          <Text style={styles.specialRewardTitle}>
            {language === "ar"
              ? "مكافأة خاصة"
              : language === "fr"
              ? "Récompense spéciale"
              : "Special Reward"}
          </Text>

          <Text style={styles.specialRewardText}>
            {language === "ar"
              ? "احصل على مكافأة إضافية"
              : language === "fr"
              ? "Obtiens une récompense bonus"
              : "Get an extra bonus"}
          </Text>
        </View>

        <Text style={styles.specialRewardAmount}>
          +25
        </Text>
      </Pressable>
    </View>
  );
};

const CurrencySelector = ({
  currency = "USD",
  language = "ar",
  onChange,
}) => {
  return (
    <GlassCard style={styles.currencyCard}>
      <Text style={styles.currencyTitle}>
        {language === "ar"
          ? "العملة"
          : language === "fr"
          ? "Devise"
          : "Currency"}
      </Text>

      <Text style={styles.currencySubtitle}>
        {language === "ar"
          ? "اختر العملة التي تريد عرض الرصيد بها"
          : language === "fr"
          ? "Choisis la devise d'affichage"
          : "Choose your display currency"}
      </Text>

      <View style={styles.currencyOptions}>
        {Object.keys(CURRENCIES).map((item) => {
          const active = currency === item;

          return (
            <Pressable
              key={item}
              onPress={() =>
                onChange && onChange(item)
              }
              style={[
                styles.currencyOption,
                active && styles.currencyOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.currencyOptionText,
                  active &&
                    styles.currencyOptionTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </GlassCard>
  );
};

const WithdrawalHistory = ({
  user,
  language = "ar",
}) => {
  const history = Array.isArray(user?.withdrawals)
    ? user.withdrawals
    : [];

  if (history.length === 0) {
    return (
      <GlassCard style={styles.historyEmpty}>
        <Text style={styles.historyEmptyIcon}>◷</Text>

        <Text style={styles.historyEmptyTitle}>
          {language === "ar"
            ? "لا توجد طلبات سحب"
            : language === "fr"
            ? "Aucun retrait"
            : "No withdrawals"}
        </Text>

        <Text style={styles.historyEmptyText}>
          {language === "ar"
            ? "ستظهر طلبات السحب هنا."
            : language === "fr"
            ? "Tes demandes apparaîtront ici."
            : "Your withdrawal requests will appear here."}
        </Text>
      </GlassCard>
    );
  }

  return (
    <View style={styles.historyList}>
      {history.slice(0, 10).map((item) => (
        <GlassCard
          key={item.id}
          style={styles.historyItem}
        >
          <View style={styles.historyMethod}>
            <View style={styles.historyLogo}>
              <Text style={styles.historyLogoText}>
                {item.method === "PayPal"
                  ? "P"
                  : item.method === "Binance"
                  ? "B"
                  : item.method === "RedotPay"
                  ? "R"
                  : item.method === "BaridiMob"
                  ? "BM"
                  : "ID"}
              </Text>
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.historyMethodName}>
                {item.method}
              </Text>

              <Text style={styles.historyAccount}>
                {item.account}
              </Text>
            </View>
          </View>

          <View style={styles.historyRight}>
            <Text style={styles.historyAmount}>
              ${Number(item.amountUSD || 0).toFixed(2)}
            </Text>

            <Text style={styles.historyStatus}>
              {language === "ar"
                ? "قيد المعالجة"
                : language === "fr"
                ? "En attente"
                : "Pending"}
            </Text>
          </View>
        </GlassCard>
      ))}
    </View>
  );
};

Object.assign(styles, {
  rewardCenter: {
    marginTop: 8,
    marginBottom: 18,
  },

  rewardCenterTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },

  rewardCenterGrid: {
    flexDirection: "row",
    gap: 10,
  },

  rewardCenterCard: {
    flex: 1,
    borderRadius: 21,
    overflow: "hidden",
  },

  rewardCenterGradient: {
    minHeight: 150,
    padding: 16,
    justifyContent: "center",
  },

  rewardCenterIcon: {
    fontSize: 25,
    marginBottom: 8,
  },

  rewardCenterCardTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "900",
  },

  rewardCenterAmount: {
    color: "#FFD76A",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 6,
  },

  rewardCenterHint: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    marginTop: 3,
  },

  specialRewardButton: {
    marginTop: 11,
    minHeight: 70,
    borderRadius: 18,
    backgroundColor: "rgba(246,196,83,0.08)",
    borderWidth: 1,
    borderColor: "rgba(246,196,83,0.2)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  specialRewardIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(246,196,83,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  specialRewardIconText: {
    color: "#FFD76A",
    fontSize: 21,
    fontWeight: "900",
  },

  specialRewardInfo: {
    flex: 1,
  },

  specialRewardTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "900",
  },

  specialRewardText: {
    color: "#858CA1",
    fontSize: 10,
    marginTop: 3,
  },

  specialRewardAmount: {
    color: "#FFD76A",
    fontSize: 17,
    fontWeight: "900",
  },

  currencyCard: {
    marginTop: 12,
    marginBottom: 14,
  },

  currencyTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
  },

  currencySubtitle: {
    color: "#858CA1",
    fontSize: 11,
    marginTop: 4,
    marginBottom: 12,
  },

  currencyOptions: {
    flexDirection: "row",
    gap: 8,
  },

  currencyOption: {
    flex: 1,
    height: 42,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  currencyOptionActive: {
    backgroundColor: "rgba(109,93,251,0.22)",
    borderColor: "#6D5DFB",
  },

  currencyOptionText: {
    color: "#858CA1",
    fontSize: 12,
    fontWeight: "900",
  },

  currencyOptionTextActive: {
    color: "#FFF",
  },

  historyList: {
    marginTop: 12,
    gap: 9,
  },

  historyItem: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  historyMethod: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  historyLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(109,93,251,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  historyLogoText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
  },

  historyInfo: {
    flex: 1,
  },

  historyMethodName: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "900",
  },

  historyAccount: {
    color: "#777F96",
    fontSize: 10,
    marginTop: 3,
  },

  historyRight: {
    alignItems: "flex-end",
  },

  historyAmount: {
    color: "#FFD76A",
    fontSize: 14,
    fontWeight: "900",
  },

  historyStatus: {
    color: "#7EE2A5",
    fontSize: 9,
    marginTop: 3,
  },

  historyEmpty: {
    alignItems: "center",
    paddingVertical: 28,
    marginTop: 12,
  },

  historyEmptyIcon: {
    color: "#FFD76A",
    fontSize: 28,
    marginBottom: 8,
  },

  historyEmptyTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "900",
  },

  historyEmptyText: {
    color: "#858CA1",
    fontSize: 11,
    marginTop: 4,
  },
});

// الجزء 9 انتهى
// ======================================================
// الجزء 10 — ربط مركز المكافآت + واتساب الدعم
// ======================================================

const SupportButton = ({ language = "ar" }) => {
  const openWhatsApp = async () => {
    const message =
      language === "ar"
        ? "السلام عليكم، أحتاج مساعدة في تطبيق PayPop."
        : language === "fr"
        ? "Bonjour, j'ai besoin d'aide avec l'application PayPop."
        : "Hello, I need help with the PayPop app.";

    const url =
      "https://wa.me/213667814377?text=" +
      encodeURIComponent(message);

    try {
      const { Linking } = require("react-native");
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "PayPop",
        language === "ar"
          ? "تعذر فتح واتساب."
          : language === "fr"
          ? "Impossible d'ouvrir WhatsApp."
          : "Unable to open WhatsApp."
      );
    }
  };

  return (
    <Pressable
      onPress={openWhatsApp}
      style={styles.supportButton}
    >
      <LinearGradient
        colors={["#20C66B", "#16A85A"]}
        style={styles.supportGradient}
      >
        <View style={styles.supportIcon}>
          <Text style={styles.supportIconText}>WA</Text>
        </View>

        <View style={styles.supportInfo}>
          <Text style={styles.supportTitle}>
            {language === "ar"
              ? "تواصل مع الدعم"
              : language === "fr"
              ? "Contacter le support"
              : "Contact Support"}
          </Text>

          <Text style={styles.supportSubtitle}>
            {language === "ar"
              ? "الدعم عبر WhatsApp"
              : language === "fr"
              ? "Support via WhatsApp"
              : "Support via WhatsApp"}
          </Text>
        </View>

        <Text style={styles.supportArrow}>›</Text>
      </LinearGradient>
    </Pressable>
  );
};

const RewardCenterSection = ({
  user,
  language = "ar",
  onDaily,
  onReferral,
  onAddPoints,
}) => {
  return (
    <View>
      <RewardCenter
        user={user}
        language={language}
        onOpenDaily={onDaily}
        onOpenReferral={onReferral}
        onAddPoints={onAddPoints}
      />

      <SupportButton language={language} />
    </View>
  );
};

const QuickRewardModal = ({
  visible,
  title,
  text,
  points,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.quickRewardOverlay}>
      <View style={styles.quickRewardBox}>
        <LinearGradient
          colors={["#6D5DFB", "#A855F7"]}
          style={styles.quickRewardTop}
        >
          <PayPopCoin size={70} />

          <Text style={styles.quickRewardTitle}>
            {title}
          </Text>

          <Text style={styles.quickRewardPoints}>
            +{formatNumber(points)}
          </Text>
        </LinearGradient>

        <Text style={styles.quickRewardText}>
          {text}
        </Text>

        <GradientButton
          title="OK"
          onPress={onClose}
        />
      </View>
    </View>
  );
};

Object.assign(styles, {
  supportButton: {
    marginTop: 12,
    borderRadius: 19,
    overflow: "hidden",
  },

  supportGradient: {
    minHeight: 68,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  supportIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  supportIconText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "900",
  },

  supportInfo: {
    flex: 1,
  },

  supportTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "900",
  },

  supportSubtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    marginTop: 3,
  },

  supportArrow: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "300",
  },

  quickRewardOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(5,7,16,0.82)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  quickRewardBox: {
    width: "84%",
    borderRadius: 27,
    backgroundColor: "#151827",
    overflow: "hidden",
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  quickRewardTop: {
    minHeight: 205,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  quickRewardTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 10,
  },

  quickRewardPoints: {
    color: "#FFD76A",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 5,
  },

  quickRewardText: {
    color: "#A7ADBD",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 19,
    paddingHorizontal: 25,
    paddingVertical: 17,
  },
});

// ======================================================
// مساعد تغيير اللغة
// ======================================================

const getLanguageText = (language, ar, fr, en) => {
  if (language === "fr") return fr;
  if (language === "en") return en;
  return ar;
};

// ======================================================
// حساب معلومات الرصيد
// ======================================================

const getBalanceInfo = (points, currency) => {
  const usd = pointsToUSD(points);
  const value = convertUSD(usd, currency);

  return {
    points: Number(points || 0),
    usd,
    value,
    currency,
  };
};

// ======================================================
// بطاقة معلومات الرصيد المصغرة
// ======================================================

const MiniBalanceCard = ({
  points = 0,
  currency = "USD",
}) => {
  const info = getBalanceInfo(points, currency);

  return (
    <View style={styles.miniBalanceCard}>
      <PayPopCoin size={43} />

      <View style={styles.miniBalanceInfo}>
        <Text style={styles.miniBalanceLabel}>
          PayPop
        </Text>

        <Text style={styles.miniBalancePoints}>
          {formatNumber(info.points)}
        </Text>
      </View>

      <View style={styles.miniBalanceValue}>
        <Text style={styles.miniBalanceUSD}>
          ${info.usd.toFixed(2)}
        </Text>

        <Text style={styles.miniBalanceCurrency}>
          {formatMoney(info.value, currency)}
        </Text>
      </View>
    </View>
  );
};

Object.assign(styles, {
  miniBalanceCard: {
    marginTop: 10,
    minHeight: 68,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  miniBalanceInfo: {
    flex: 1,
    marginLeft: 10,
  },

  miniBalanceLabel: {
    color: "#858CA1",
    fontSize: 9,
    fontWeight: "700",
  },

  miniBalancePoints: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 2,
  },

  miniBalanceValue: {
    alignItems: "flex-end",
  },

  miniBalanceUSD: {
    color: "#FFD76A",
    fontSize: 14,
    fontWeight: "900",
  },

  miniBalanceCurrency: {
    color: "#777F96",
    fontSize: 9,
    marginTop: 3,
  },
});

// ======================================================
// الجزء 10 انتهى
// ======================================================
// ======================================================
// الجزء 11 — مركز المساعدة والدعم PayPop
// ======================================================

const HelpCenterScreen = ({
  language = "ar",
}) => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: getLanguageText(
        language,
        "كيف أربح نقاط PayPop؟",
        "Comment gagner des points PayPop ?",
        "How do I earn PayPop points?"
      ),
      answer: getLanguageText(
        language,
        "يمكنك الربح من المكافأة اليومية، العجلة، المهام، مشاهدة الفيديوهات، الألعاب ودعوة الأصدقاء.",
        "Tu peux gagner avec la récompense quotidienne, la roue, les tâches, les vidéos, les jeux et les invitations.",
        "You can earn from daily rewards, the wheel, tasks, videos, games and referrals."
      ),
    },
    {
      id: 2,
      question: getLanguageText(
        language,
        "كم تساوي نقاط PayPop؟",
        "Combien valent les points PayPop ?",
        "How much are PayPop points worth?"
      ),
      answer: getLanguageText(
        language,
        "100,000 نقطة PayPop = 1 دولار أمريكي.",
        "100 000 points PayPop = 1 dollar américain.",
        "100,000 PayPop points = 1 US dollar."
      ),
    },
    {
      id: 3,
      question: getLanguageText(
        language,
        "متى أستطيع السحب؟",
        "Quand puis-je retirer ?",
        "When can I withdraw?"
      ),
      answer: getLanguageText(
        language,
        "الحد الأدنى للسحب هو 1,000,000 نقطة، أي ما يعادل 10 دولارات.",
        "Le minimum de retrait est de 1 000 000 points, soit 10 dollars.",
        "The minimum withdrawal is 1,000,000 points, equal to 10 dollars."
      ),
    },
    {
      id: 4,
      question: getLanguageText(
        language,
        "كم تستغرق معالجة طلب السحب؟",
        "Combien de temps prend un retrait ?",
        "How long does a withdrawal take?"
      ),
      answer: getLanguageText(
        language,
        "مدة المعالجة قد تختلف حسب طريقة السحب والتحقق من الطلب.",
        "Le délai peut varier selon le moyen de paiement et la vérification.",
        "Processing time may vary depending on the payment method and verification."
      ),
    },
    {
      id: 5,
      question: getLanguageText(
        language,
        "هل يمكنني تغيير طريقة السحب؟",
        "Puis-je changer mon moyen de retrait ?",
        "Can I change my withdrawal method?"
      ),
      answer: getLanguageText(
        language,
        "نعم، يمكنك اختيار طريقة السحب المناسبة لك عند إنشاء طلب جديد.",
        "Oui, tu peux choisir un autre moyen lors d'une nouvelle demande.",
        "Yes, you can choose another method when creating a new request."
      ),
    },
    {
      id: 6,
      question: getLanguageText(
        language,
        "كيف أتواصل مع الدعم؟",
        "Comment contacter le support ?",
        "How can I contact support?"
      ),
      answer: getLanguageText(
        language,
        "يمكنك التواصل معنا مباشرة عبر WhatsApp.",
        "Tu peux nous contacter directement via WhatsApp.",
        "You can contact us directly through WhatsApp."
      ),
    },
  ];

  const openWhatsAppSupport = async () => {
    const message = getLanguageText(
      language,
      "السلام عليكم، أحتاج مساعدة بخصوص PayPop.",
      "Bonjour, j'ai besoin d'aide concernant PayPop.",
      "Hello, I need help with PayPop."
    );

    const encoded = encodeURIComponent(message);
    const appURL =
      "whatsapp://send?phone=213667814377&text=" + encoded;
    const webURL =
      "https://wa.me/213667814377?text=" + encoded;

    const { Linking } = require("react-native");

    try {
      const supported = await Linking.canOpenURL(appURL);

      if (supported) {
        await Linking.openURL(appURL);
      } else {
        await Linking.openURL(webURL);
      }
    } catch (error) {
      try {
        await Linking.openURL(webURL);
      } catch (fallbackError) {
        Alert.alert(
          "PayPop",
          "+213 667 814 377"
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.helpScreen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.helpContent}
      >
        <LinearGradient
          colors={["#6D5DFB", "#A855F7", "#C026D3"]}
          style={styles.helpHeader}
        >
          <View style={styles.helpLogoCircle}>
            <Text style={styles.helpLogoLetter}>P</Text>
          </View>

          <Text style={styles.helpHeaderTitle}>
            {getLanguageText(
              language,
              "مركز المساعدة",
              "Centre d'aide",
              "Help Center"
            )}
          </Text>

          <Text style={styles.helpHeaderText}>
            {getLanguageText(
              language,
              "نحن هنا لمساعدتك",
              "Nous sommes là pour t'aider",
              "We're here to help"
            )}
          </Text>
        </LinearGradient>

        <View style={styles.helpSectionTitle}>
          <Text style={styles.helpSectionTitleText}>
            {getLanguageText(
              language,
              "الأسئلة الشائعة",
              "Questions fréquentes",
              "Frequently Asked Questions"
            )}
          </Text>
        </View>

        <View style={styles.faqList}>
          {faqs.map((faq) => {
            const opened = openFAQ === faq.id;

            return (
              <Pressable
                key={faq.id}
                onPress={() =>
                  setOpenFAQ(opened ? null : faq.id)
                }
                style={styles.faqItem}
              >
                <View style={styles.faqQuestionRow}>
                  <View style={styles.faqNumber}>
                    <Text style={styles.faqNumberText}>
                      {faq.id}
                    </Text>
                  </View>

                  <Text style={styles.faqQuestion}>
                    {faq.question}
                  </Text>

                  <Text style={styles.faqArrow}>
                    {opened ? "−" : "+"}
                  </Text>
                </View>

                {opened && (
                  <View style={styles.faqAnswerBox}>
                    <Text style={styles.faqAnswer}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <Text style={styles.contactIconText}>
              WA
            </Text>
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>
              {getLanguageText(
                language,
                "تحتاج مساعدة؟",
                "Besoin d'aide ?",
                "Need help?"
              )}
            </Text>

            <Text style={styles.contactText}>
              +213 667 814 377
            </Text>
          </View>

          <Pressable
            onPress={openWhatsAppSupport}
            style={styles.contactButton}
          >
            <Text style={styles.contactButtonText}>
              {getLanguageText(
                language,
                "تواصل",
                "Contacter",
                "Contact"
              )}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.helpFooter}>
          PayPop • Help & Support
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

Object.assign(styles, {
  helpScreen: {
    flex: 1,
    backgroundColor: "#090B14",
  },

  helpContent: {
    padding: 16,
    paddingBottom: 35,
  },

  helpHeader: {
    borderRadius: 25,
    minHeight: 185,
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  helpLogoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  helpLogoLetter: {
    color: "#FFD76A",
    fontSize: 31,
    fontWeight: "900",
  },

  helpHeaderTitle: {
    color: "#FFF",
    fontSize: 23,
    fontWeight: "900",
  },

  helpHeaderText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 6,
  },

  helpSectionTitle: {
    marginBottom: 11,
  },

  helpSectionTitleText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "900",
  },

  faqList: {
    gap: 9,
  },

  faqItem: {
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 17,
    padding: 13,
  },

  faqQuestionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  faqNumber: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: "rgba(109,93,251,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  faqNumberText: {
    color: "#A99BFF",
    fontSize: 11,
    fontWeight: "900",
  },

  faqQuestion: {
    flex: 1,
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },

  faqArrow: {
    color: "#FFD76A",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 8,
  },

  faqAnswerBox: {
    marginTop: 11,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },

  faqAnswer: {
    color: "#9299AC",
    fontSize: 11,
    lineHeight: 19,
  },

  contactCard: {
    marginTop: 18,
    padding: 13,
    minHeight: 74,
    borderRadius: 19,
    backgroundColor: "rgba(32,198,107,0.08)",
    borderWidth: 1,
    borderColor: "rgba(32,198,107,0.18)",
    flexDirection: "row",
    alignItems: "center",
  },

  contactIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "rgba(32,198,107,0.17)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  contactIconText: {
    color: "#5EE49A",
    fontSize: 10,
    fontWeight: "900",
  },

  contactInfo: {
    flex: 1,
  },

  contactTitle: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
  },

  contactText: {
    color: "#7EE2A5",
    fontSize: 10,
    marginTop: 4,
  },

  contactButton: {
    backgroundColor: "#20C66B",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  contactButtonText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
  },

  helpFooter: {
    color: "#555C70",
    fontSize: 10,
    textAlign: "center",
    marginTop: 22,
  },
});

// ======================================================
// الجزء 11 انتهى
// ======================================================
// ======================================================
// الجزء 12 — سياسة PayPop + معلومات التطبيق
// ======================================================

const PayPopInfoScreen = ({ language = "ar" }) => {
  const [section, setSection] = useState(null);

  const info = [
    {
      id: "about",
      title: getLanguageText(
        language,
        "عن PayPop",
        "À propos de PayPop",
        "About PayPop"
      ),
      text: getLanguageText(
        language,
        "PayPop هو تطبيق مكافآت يتيح للمستخدم جمع نقاط من خلال الأنشطة والمكافآت المتاحة داخل التطبيق.",
        "PayPop est une application de récompenses permettant de gagner des points grâce aux activités disponibles.",
        "PayPop is a rewards app where users can collect points through available activities."
      ),
    },
    {
      id: "points",
      title: getLanguageText(
        language,
        "نظام النقاط",
        "Système de points",
        "Points System"
      ),
      text: getLanguageText(
        language,
        "قيمة التحويل الأساسية هي 100,000 نقطة PayPop مقابل 1 دولار أمريكي.",
        "Le taux de conversion de base est de 100 000 points PayPop pour 1 dollar américain.",
        "The base conversion rate is 100,000 PayPop points for 1 US dollar."
      ),
    },
    {
      id: "withdraw",
      title: getLanguageText(
        language,
        "السحب",
        "Retrait",
        "Withdrawals"
      ),
      text: getLanguageText(
        language,
        "الحد الأدنى الحالي للسحب هو 1,000,000 نقطة، وقد تخضع الطلبات للتحقق والمراجعة قبل المعالجة.",
        "Le minimum actuel est de 1 000 000 points. Les demandes peuvent être vérifiées avant traitement.",
        "The current minimum is 1,000,000 points. Requests may be reviewed before processing."
      ),
    },
    {
      id: "fair",
      title: getLanguageText(
        language,
        "الاستخدام العادل",
        "Utilisation équitable",
        "Fair Use"
      ),
      text: getLanguageText(
        language,
        "يُمنع استخدام الحسابات الوهمية أو التلاعب بالمكافآت أو الإحالات أو أي محاولة لاستغلال النظام.",
        "Les faux comptes, la manipulation des récompenses et les abus du système sont interdits.",
        "Fake accounts, reward manipulation, referral abuse and system exploitation are prohibited."
      ),
    },
    {
      id: "privacy",
      title: getLanguageText(
        language,
        "الخصوصية",
        "Confidentialité",
        "Privacy"
      ),
      text: getLanguageText(
        language,
        "نحترم خصوصية المستخدمين. سيتم استخدام بيانات الحساب فقط لتشغيل وتحسين خدمات PayPop وفق إعدادات وسياسة الخصوصية المعتمدة.",
        "Nous respectons la vie privée des utilisateurs. Les données du compte sont utilisées pour fournir et améliorer les services PayPop.",
        "We respect user privacy. Account data is used to provide and improve PayPop services."
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.infoScreen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.infoContent}
      >
        <LinearGradient
          colors={["#6D5DFB", "#8B5CF6", "#C026D3"]}
          style={styles.infoHero}
        >
          <View style={styles.infoCoin}>
            <Text style={styles.infoCoinLetter}>P</Text>
          </View>

          <Text style={styles.infoHeroTitle}>
            PayPop
          </Text>

          <Text style={styles.infoHeroSubtitle}>
            {getLanguageText(
              language,
              "معلومات التطبيق",
              "Informations de l'application",
              "App Information"
            )}
          </Text>
        </LinearGradient>

        <View style={styles.infoList}>
          {info.map((item) => {
            const opened = section === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() =>
                  setSection(opened ? null : item.id)
                }
                style={styles.infoItem}
              >
                <View style={styles.infoItemHeader}>
                  <Text style={styles.infoItemTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.infoItemArrow}>
                    {opened ? "−" : "+"}
                  </Text>
                </View>

                {opened && (
                  <Text style={styles.infoItemText}>
                    {item.text}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoVersionCard}>
          <Text style={styles.infoVersionLabel}>
            PayPop
          </Text>

          <Text style={styles.infoVersion}>
            Version 1.0.0
          </Text>
        </View>

        <Text style={styles.infoFooter}>
          © 2026 PayPop
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

Object.assign(styles, {
  infoScreen: {
    flex: 1,
    backgroundColor: "#090B14",
  },

  infoContent: {
    padding: 16,
    paddingBottom: 35,
  },

  infoHero: {
    minHeight: 190,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  infoCoin: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#F6C453",
    borderWidth: 3,
    borderColor: "#FFE49A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  infoCoinLetter: {
    color: "#5B3B00",
    fontSize: 31,
    fontWeight: "900",
  },

  infoHeroTitle: {
    color: "#FFF",
    fontSize: 25,
    fontWeight: "900",
  },

  infoHeroSubtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
    marginTop: 5,
  },

  infoList: {
    gap: 9,
  },

  infoItem: {
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderRadius: 17,
    padding: 15,
  },

  infoItemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoItemTitle: {
    flex: 1,
    color: "#FFF",
    fontSize: 13,
    fontWeight: "900",
  },

  infoItemArrow: {
    color: "#FFD76A",
    fontSize: 22,
    fontWeight: "700",
  },

  infoItemText: {
    color: "#9299AC",
    fontSize: 11,
    lineHeight: 19,
    marginTop: 12,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },

  infoVersionCard: {
    marginTop: 18,
    borderRadius: 17,
    padding: 16,
    backgroundColor: "rgba(109,93,251,0.08)",
    borderWidth: 1,
    borderColor: "rgba(109,93,251,0.16)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoVersionLabel: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "900",
  },

  infoVersion: {
    color: "#858CA1",
    fontSize: 10,
  },

  infoFooter: {
    color: "#555C70",
    fontSize: 10,
    textAlign: "center",
    marginTop: 20,
  },
});

// ======================================================
// الجزء 12 انتهى
// ======================================================

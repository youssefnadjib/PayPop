import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Image,
  Linking
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wheel, { WheelLogo } from './Wheel';

const WHEEL_COOLDOWN = 24 * 60 * 60 * 1000;

const translations = {
  ar: {
    appName: 'PayPop',
    splashDesc: 'طريقتك الأذكى لجمع الأرباح، شدات الألعاب، وسحب العملات الرقمية بكل سهولة.',
    startNow: 'ابدأ التعدين الآن',
    emailPlaceholder: 'البريد الإلكتروني',
    passPlaceholder: 'كلمة السر',
    forgotPass: 'نسيت كلمة السر؟',
    login: 'تسجيل الدخول',
    signUp: 'إنشاء الحساب',
    hasAccount: 'لديك حساب بالفعل؟ تسجيل الدخول',
    noAccount: 'ليس لديك حساب؟ إنشاء حساب جديد',
    dashboard: 'محفظة توكنات PayPop',
    points: 'رصيد PPT',
    usdValue: 'القيمة السوقية التقديرية',
    todayEarned: 'ما تم تعدينه اليوم',
    invitedFriends: 'المعدنون المدعوون',
    dailyChallenge: 'التعدين اليومي للتوكنات',
    dailyDesc: 'سجل حضورك اليومي واحصل على مكافأة فورية (+50 PPT)',
    claimDaily: 'استلام مكافأة التوكن',
    earnTitle: '⚡ مركز تعدين وجمع توكنات PPT',
    earnSubtitle: 'اختر طريقة التعدين واحصل على توكنات فريدة ومميزة',
    walletTitle: '💳 سحب وصرف التوكنات',
    walletSubtitle: 'اختر طريقة التحويل أو السحب المفضلة لديك',
    profileSettings: 'إعدادات الحساب والتوكن',
    darkMode: 'الوضع الداكن',
    myCountry: 'البلد الخاص بي',
    currency: 'تغيير العملة',
    language: 'اللغة',
    supportCenter: 'مركز الدعم والمساعدة',
    logout: 'تسجيل الخروج',
    homeNav: 'الرئيسية',
    earnNav: 'التعدين',
    walletNav: 'المحفظة',
    profileNav: 'حسابي',
    selectLangTitle: 'اختر لغة التطبيق',
    selectCurrencyTitle: 'اختر العملة المفضلة',
    cancel: 'إلغاء'
  },

  fr: {
    appName: 'PayPop',
    splashDesc: 'Votre moyen le plus intelligent de gagner des profits et des tokens.',
    startNow: 'Commencer le minage',
    emailPlaceholder: 'E-mail',
    passPlaceholder: 'Mot de passe',
    forgotPass: 'Mot de passe oublié ?',
    login: 'Se connecter',
    signUp: 'Créer un compte',
    hasAccount: 'Vous avez déjà un compte ? Connexion',
    noAccount: 'Pas de compte ? Créer un compte',
    dashboard: 'Portefeuille Token PayPop',
    points: 'Tokens PPT',
    usdValue: 'Valeur estimée',
    todayEarned: "Miné aujourd'hui",
    invitedFriends: 'Amis mineurs',
    dailyChallenge: 'Minage Quotidien',
    dailyDesc: 'Réclamez votre récompense quotidienne (+50 PPT)',
    claimDaily: 'Réclamer les tokens',
    earnTitle: '⚡ Centre de Minage PPT',
    earnSubtitle: 'Choisissez une méthode et gagnez des tokens',
    walletTitle: '💳 Retrait des Tokens PPT',
    walletSubtitle: 'Choisissez votre méthode de retrait',
    profileSettings: 'Paramètres du compte',
    darkMode: 'Mode Sombre',
    myCountry: 'Mon Pays',
    currency: 'Changer la devise',
    language: 'Langue',
    supportCenter: 'Centre assistance',
    logout: 'Se déconnecter',
    homeNav: 'Accueil',
    earnNav: 'Miner',
    walletNav: 'Portefeuille',
    profileNav: 'Profil',
    selectLangTitle: "Choisir la langue de l'application",
    selectCurrencyTitle: 'Choisir la devise',
    cancel: 'Annuler'
  },

  en: {
    appName: 'PayPop',
    splashDesc: 'Your smartest way to collect profits and unique ecosystem tokens.',
    startNow: 'Start Mining',
    emailPlaceholder: 'Email',
    passPlaceholder: 'Password',
    forgotPass: 'Forgot Password?',
    login: 'Log In',
    signUp: 'Sign Up',
    hasAccount: 'Already have an account? Log In',
    noAccount: "Don't have an account? Sign Up",
    dashboard: 'PayPop Token Wallet',
    points: 'PPT Balance',
    usdValue: 'Market Value',
    todayEarned: 'Mined Today',
    invitedMiners: 'Invited Miners',
    dailyChallenge: 'Daily Token Mining',
    dailyDesc: 'Claim your daily token reward (+50 PPT)',
    claimDaily: 'Claim Token Reward',
    earnTitle: '⚡ PPT Token Mining Center',
    earnSubtitle: 'Choose a method and earn exclusive PayPop tokens',
    walletTitle: '💳 Token Payout',
    walletSubtitle: 'Choose your payout method',
    profileSettings: 'Account Settings',
    darkMode: 'Dark Mode',
    myCountry: 'My Country',
    currency: 'Change Currency',
    language: 'Language',
    supportCenter: 'Support Center',
    logout: 'Log Out',
    homeNav: 'Home',
    earnNav: 'Mine',
    walletNav: 'Wallet',
    profileNav: 'Profile',
    selectLangTitle: 'Select App Language',
    selectCurrencyTitle: 'Select Currency',
    cancel: 'Cancel'
  }
};

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('splash');
  const [isSignUp, setIsSignUp] = useState(false);

  const [points, setPoints] = useState(1405);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  const [currentLang, setCurrentLang] = useState('ar');
  const [langModalVisible, setLangModalVisible] = useState(false);

  const [userAvatar, setUserAvatar] = useState('👤');
  const [isCustomImage, setIsCustomImage] = useState(false);

  const [referralModalVisible, setReferralModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [withdrawInput, setWithdrawInput] = useState('');

  // عجلة توكنات الحظ
  const [spinCount, setSpinCount] = useState(0);
  const [wheelModalVisible, setWheelModalVisible] = useState(false);
  const [wheelRewardText, setWheelRewardText] = useState(
    'اضغط على «أدر العجلة» وجرّب حظك 🎡'
  );

  const [wheelCooldown, setWheelCooldown] = useState(0);
  const [adSpins, setAdSpins] = useState(0);
  const [adCooldown, setAdCooldown] = useState(0);

  const referralCode = 'PAYPOP-8849';

  const emojisList = ['😎', '🦊', '⚡', '🎮', '🦁'];

  const t = translations[currentLang];

  const lastDailyKey = 'paypop_wheel_last_daily';
  const adSpinsKey = 'paypop_wheel_ad_spins';
  const lastAdGrantKey = 'paypop_wheel_last_ad_grant';
  const spinCountKey = 'paypop_wheel_spin_count';

  const dailyAvailable = wheelCooldown <= 0;
  const wheelCanSpin = dailyAvailable || adSpins > 0;
    const formatWheelTime = (milliseconds) => {
    if (milliseconds <= 0) return 'متاح الآن';

    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}س ${minutes}د ${seconds}ث`;
  };

  useEffect(() => {
    const loadWheelData = async () => {
      try {
        const values = await AsyncStorage.multiGet([
          lastDailyKey,
          adSpinsKey,
          lastAdGrantKey,
          spinCountKey
        ]);

        const data = Object.fromEntries(values);

        const lastDaily = Number(data[lastDailyKey] || 0);
        const savedAdSpins = Number(data[adSpinsKey] || 0);
        const lastAdGrant = Number(data[lastAdGrantKey] || 0);
        const savedSpinCount = Number(data[spinCountKey] || 0);

        const now = Date.now();

        setWheelCooldown(
          lastDaily > 0
            ? Math.max(0, WHEEL_COOLDOWN - (now - lastDaily))
            : 0
        );

        setAdCooldown(
          lastAdGrant > 0
            ? Math.max(0, WHEEL_COOLDOWN - (now - lastAdGrant))
            : 0
        );

        setAdSpins(savedAdSpins);
        setSpinCount(savedSpinCount);
      } catch (error) {
        console.log('Wheel data error:', error);
      }
    };

    loadWheelData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setWheelCooldown(prev => Math.max(0, prev - 1000));
      setAdCooldown(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
    const claimDailyReward = () => {
    setPoints(prev => prev + 50);

    Alert.alert(
      '🎉 مبروك!',
      'حصلت على +50 PPT من التعدين اليومي.'
    );
  };

  const handleWheelReward = async (reward) => {
    const type = wheelCooldown <= 0 ? 'daily' : 'ad';

    setPoints(prev => prev + reward);

    const nextSpinCount = spinCount + 1;
    setSpinCount(nextSpinCount);

    try {
      await AsyncStorage.setItem(
        spinCountKey,
        String(nextSpinCount)
      );
    } catch (error) {
      console.log('Spin count error:', error);
    }

    setWheelRewardText(
      `كفو! ربحت ${reward} توكن PPT جديد 🎉`
    );

    if (type === 'daily') {
      const now = Date.now();

      try {
        await AsyncStorage.setItem(
          lastDailyKey,
          String(now)
        );
      } catch (error) {
        console.log('Daily wheel error:', error);
      }

      setWheelCooldown(WHEEL_COOLDOWN);
    } else {
      const nextAdSpins = Math.max(0, adSpins - 1);

      try {
        await AsyncStorage.setItem(
          adSpinsKey,
          String(nextAdSpins)
        );
      } catch (error) {
        console.log('Ad spin error:', error);
      }

      setAdSpins(nextAdSpins);
    }

    Alert.alert(
      '🎡 PayPop',
      `ربحت ${reward} PPT!`
    );
  };

  const watchAdForSpins = () => {
    if (adCooldown > 0) {
      Alert.alert(
        '⏳ انتظر قليلاً',
        `يمكنك مشاهدة إعلان جديد بعد:\n${formatWheelTime(adCooldown)}`
      );
      return;
    }

    Alert.alert(
      '📺 إعلان تجريبي',
      'في النسخة الحالية سيتم محاكاة مشاهدة الإعلان للحصول على 3 دورات مجانية.',
      [
        {
          text: 'إلغاء',
          style: 'cancel'
        },
        {
          text: 'متابعة',
          onPress: async () => {
            const now = Date.now();
            const next = Math.min(3, adSpins + 3);

            setAdSpins(next);
            setAdCooldown(WHEEL_COOLDOWN);

            try {
              await AsyncStorage.multiSet([
                [adSpinsKey, String(next)],
                [lastAdGrantKey, String(now)]
              ]);
            } catch (error) {
              console.log('Ad reward error:', error);
            }

            Alert.alert(
              '🎉 تمت الإضافة',
              'حصلت على 3 دورات مجانية للعجلة!'
            );
          }
        }
      ]
    );
  };
    const pickAvatar = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'الصلاحية مطلوبة',
          'اسمح للتطبيق بالوصول إلى الصور لاختيار صورة الحساب.'
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8
        });

      if (!result.canceled && result.assets?.length) {
        setUserAvatar(result.assets[0].uri);
        setIsCustomImage(true);
      }
    } catch (error) {
      Alert.alert('خطأ', 'تعذر اختيار الصورة.');
    }
  };

  const selectEmojiAvatar = (emoji) => {
    setUserAvatar(emoji);
    setIsCustomImage(false);
  };

  const openWheel = () => {
    setWheelRewardText(
      'اضغط على «أدر العجلة» وجرّب حظك 🎡'
    );
    setWheelModalVisible(true);
  };

  const handleWithdrawMethod = (method) => {
    setSelectedMethod(method);
    setWithdrawInput('');
  };

  const submitWithdraw = () => {
    if (!withdrawInput.trim()) {
      Alert.alert(
        'تنبيه',
        'أدخل معلومات السحب أولاً.'
      );
      return;
    }

    Alert.alert(
      'طلب السحب',
      `تم تسجيل طلب السحب عبر ${selectedMethod?.name || 'الطريقة المختارة'}.`
    );

    setSelectedMethod(null);
    setWithdrawInput('');
  };
    const earnMethods = [
    {
      id: 'daily',
      title: 'التعدين اليومي',
      description: '+50 PPT كل 24 ساعة',
      icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      reward: 50
    },
    {
      id: 'wheel',
      title: 'عجلة توكنات الحظ',
      description: 'دورة مجانية كل 24 ساعة 🎡',
      reward: '10 - 25 PPT'
    },
    {
      id: 'video',
      title: 'شاهد فيديو',
      description: 'احصل على PPT مقابل مشاهدة الفيديو',
      icon: 'https://cdn-icons-png.flaticon.com/512/1179/1179069.png',
      reward: 15
    },
    {
      id: 'game',
      title: 'ألعب واربح',
      description: 'العب الألعاب واحصل على مكافآت',
      icon: 'https://cdn-icons-png.flaticon.com/512/808/808439.png',
      reward: 20
    },
    {
      id: 'invite',
      title: 'ادعُ أصدقاءك',
      description: 'اربح PPT عن كل صديق',
      icon: 'https://cdn-icons-png.flaticon.com/512/1256/1256650.png',
      reward: 100
    },
    {
      id: 'bonus',
      title: 'مكافأة خاصة',
      description: 'مكافآت إضافية من PayPop',
      icon: 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png',
      reward: 25
    }
  ];

  const withdrawMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'https://cdn-icons-png.flaticon.com/512/174/174861.png'
    },
    {
      id: 'binance',
      name: 'Binance',
      icon: 'https://cdn-icons-png.flaticon.com/512/12114/12114219.png'
    },
    {
      id: 'redotpay',
      name: 'RedotPay',
      icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968268.png'
    },
    {
      id: 'baridimob',
      name: 'BaridiMob',
      icon: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png'
    }
  ];

  const currencySymbols = {
    USD: '$',
    DZD: 'دج',
    EUR: '€'
  };

  const getUsdValue = () => {
    return (points * 0.001).toFixed(2);
  };

  const getCurrencyValue = () => {
    const usd = Number(getUsdValue());

    if (currentCurrency === 'DZD') {
      return `${(usd * 130).toFixed(0)} دج`;
    }

    if (currentCurrency === 'EUR') {
      return `${(usd * 0.86).toFixed(2)} €`;
    }

    return `$${usd.toFixed(2)}`;
  };
    const renderAvatar = () => {
    if (isCustomImage) {
      return (
        <Image
          source={{ uri: userAvatar }}
          style={styles.avatarImage}
        />
      );
    }

    return (
      <Text style={styles.avatarEmoji}>
        {userAvatar}
      </Text>
    );
  };

  const renderEarnIcon = (method) => {
    if (method.id === 'wheel') {
      return <WheelLogo size={42} />;
    }

    return (
      <Image
        source={{ uri: method.icon }}
        style={styles.gridItemImage}
      />
    );
  };

  const renderBottomNav = () => (
    <View style={[
      styles.bottomNav,
      isDarkMode && styles.bottomNavDark
    ]}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={styles.navIcon}>🏠</Text>
        <Text style={[
          styles.navText,
          currentScreen === 'home' && styles.navTextActive
        ]}>
          {t.homeNav}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setCurrentScreen('earn')}
      >
        <Text style={styles.navIcon}>⚡</Text>
        <Text style={[
          styles.navText,
          currentScreen === 'earn' && styles.navTextActive
        ]}>
          {t.earnNav}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setCurrentScreen('wallet')}
      >
        <Text style={styles.navIcon}>💳</Text>
        <Text style={[
          styles.navText,
          currentScreen === 'wallet' && styles.navTextActive
        ]}>
          {t.walletNav}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setCurrentScreen('profile')}
      >
        <Text style={styles.navIcon}>👤</Text>
        <Text style={[
          styles.navText,
          currentScreen === 'profile' && styles.navTextActive
        ]}>
          {t.profileNav}
        </Text>
      </TouchableOpacity>
    </View>
  );
  const renderHeader = (title) => (
    <View style={[
      styles.header,
      isDarkMode && styles.headerDark
    ]}>
      <View style={styles.headerLogo}>
        <WheelLogo size={42} />
      </View>

      <View style={styles.headerTitleBox}>
        <Text style={[
          styles.headerTitle,
          isDarkMode && styles.textLight
        ]}>
          {title}
        </Text>
        <Text style={styles.headerPoints}>
          {points.toLocaleString()} PPT
        </Text>
      </View>

      <TouchableOpacity
        style={styles.headerAvatar}
        onPress={() => setCurrentScreen('profile')}
      >
        {renderAvatar()}
      </TouchableOpacity>
    </View>
  );

  const renderSplash = () => (
    <View style={[
      styles.splash,
      isDarkMode && styles.splashDark
    ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <WheelLogo size={100} />

      <Text style={styles.splashTitle}>
        PayPop
      </Text>

      <Text style={[
        styles.splashDesc,
        isDarkMode && styles.textLight
      ]}>
        {t.splashDesc}
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setCurrentScreen('login')}
      >
        <Text style={styles.primaryButtonText}>
          {t.startNow}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLogin = () => (
    <ScrollView
      contentContainerStyle={[
        styles.authContainer,
        isDarkMode && styles.screenDark
      ]}
    >
      <WheelLogo size={75} />

      <Text style={[
        styles.authTitle,
        isDarkMode && styles.textLight
      ]}>
        {isSignUp ? t.signUp : t.login}
      </Text>

      <TextInput
        style={[
          styles.input,
          isDarkMode && styles.inputDark
        ]}
        placeholder={t.emailPlaceholder}
        placeholderTextColor={isDarkMode ? '#94A3B8' : '#64748B'}
        keyboardType="email-address"
        autoCapitalize="none"
        value={userEmail}
        onChangeText={setUserEmail}
      />

      <TextInput
        style={[
          styles.input,
          isDarkMode && styles.inputDark
        ]}
        placeholder={t.passPlaceholder}
        placeholderTextColor={isDarkMode ? '#94A3B8' : '#64748B'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {!isSignUp && (
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'استرجاع كلمة السر',
              'سيتم إضافة استرجاع كلمة السر في النسخة القادمة.'
            )
          }
        >
          <Text style={styles.linkText}>
            {t.forgotPass}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          if (!userEmail.trim() || !password.trim()) {
            Alert.alert(
              'تنبيه',
              'أدخل البريد الإلكتروني وكلمة السر أولاً.'
            );
            return;
          }

          setCurrentScreen('home');
        }}
      >
        <Text style={styles.primaryButtonText}>
          {isSignUp ? t.signUp : t.login}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={styles.switchAuthText}>
          {isSignUp ? t.hasAccount : t.noAccount}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
  const renderHome = () => (
    <SafeAreaView style={[
      styles.container,
      isDarkMode && styles.screenDark
    ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {renderHeader(t.dashboard)}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.balanceCard,
          isDarkMode && styles.balanceCardDark
        ]}>
          <Text style={styles.balanceLabel}>
            {t.points}
          </Text>

          <Text style={styles.balanceValue}>
            {points.toLocaleString()} PPT
          </Text>

          <Text style={styles.usdValue}>
            ≈ {getCurrencyValue()}
          </Text>

          <View style={styles.balanceStats}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                +50
              </Text>
              <Text style={styles.statLabel}>
                {t.todayEarned}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {spinCount}
              </Text>
              <Text style={styles.statLabel}>
                دورات العجلة
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                0
              </Text>
              <Text style={styles.statLabel}>
                {t.invitedFriends}
              </Text>
            </View>
          </View>
        </View>

        <View style={[
          styles.dailyCard,
          isDarkMode && styles.cardDark
        ]}>
          <Text style={[
            styles.cardTitle,
            isDarkMode && styles.textLight
          ]}>
            🎁 {t.dailyChallenge}
          </Text>

          <Text style={[
            styles.cardDescription,
            isDarkMode && styles.textMuted
          ]}>
            {t.dailyDesc}
          </Text>

          <TouchableOpacity
            style={styles.rewardButton}
            onPress={claimDailyReward}
          >
            <Text style={styles.rewardButtonText}>
              {t.claimDaily}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[
          styles.quickCard,
          isDarkMode && styles.cardDark
        ]}>
          <Text style={[
            styles.cardTitle,
            isDarkMode && styles.textLight
          ]}>
            🎡 عجلة توكنات الحظ
          </Text>

          <Text style={[
            styles.cardDescription,
            isDarkMode && styles.textMuted
          ]}>
            اربح من 10 إلى 25 PPT في كل دورة
          </Text>

          <TouchableOpacity
            style={styles.wheelQuickButton}
            onPress={openWheel}
          >
            <WheelLogo size={42} />

            <View style={styles.quickTextBox}>
              <Text style={styles.quickButtonTitle}>
                افتح العجلة
              </Text>

              <Text style={styles.quickButtonSubtitle}>
                {dailyAvailable
                  ? '🎁 الدورة اليومية متاحة'
                  : adSpins > 0
                    ? `🎟️ لديك ${adSpins} دورات مجانية`
                    : `⏳ ${formatWheelTime(wheelCooldown)}`
                }
              </Text>
            </View>

            <Text style={styles.arrow}>
              ‹
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.withdrawHomeButton}
          onPress={() => setCurrentScreen('wallet')}
        >
          <Text style={styles.withdrawHomeButtonText}>
            💳 سحب أرباحي
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {renderBottomNav()}
    </SafeAreaView>
  );
  const renderEarn = () => (
    <SafeAreaView style={[
      styles.container,
      isDarkMode && styles.screenDark
    ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {renderHeader(t.earnTitle)}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[
          styles.sectionSubtitle,
          isDarkMode && styles.textMuted
        ]}>
          {t.earnSubtitle}
        </Text>

        <View style={styles.earnGrid}>
          {earnMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.earnCard,
                isDarkMode && styles.cardDark
              ]}
              onPress={() => {
                if (method.id === 'wheel') {
                  openWheel();
                  return;
                }

                if (method.id === 'daily') {
                  claimDailyReward();
                  return;
                }

                if (method.id === 'invite') {
                  setReferralModalVisible(true);
                  return;
                }

                Alert.alert(
                  method.title,
                  `المكافأة: ${method.reward} PPT`
                );
              }}
            >
              <View style={styles.earnIconBox}>
                {renderEarnIcon(method)}
              </View>

              <Text style={[
                styles.earnCardTitle,
                isDarkMode && styles.textLight
              ]}>
                {method.title}
              </Text>

              <Text style={[
                styles.earnCardDescription,
                isDarkMode && styles.textMuted
              ]}>
                {method.description}
              </Text>

              <View style={styles.rewardBadge}>
                <Text style={styles.rewardBadgeText}>
                  +{method.reward} PPT
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {renderBottomNav()}
    </SafeAreaView>
  );
  const renderWallet = () => (
    <SafeAreaView style={[
      styles.container,
      isDarkMode && styles.screenDark
    ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {renderHeader(t.walletTitle)}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.walletBalanceCard,
          isDarkMode && styles.cardDark
        ]}>
          <Text style={styles.walletBalanceLabel}>
            رصيدك الحالي
          </Text>

          <Text style={styles.walletBalanceValue}>
            {points.toLocaleString()} PPT
          </Text>

          <Text style={styles.walletUsdValue}>
            ≈ {getCurrencyValue()}
          </Text>
        </View>

        <Text style={[
          styles.sectionSubtitle,
          isDarkMode && styles.textMuted
        ]}>
          {t.walletSubtitle}
        </Text>

        {withdrawMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.withdrawCard,
              isDarkMode && styles.cardDark
            ]}
            onPress={() => handleWithdrawMethod(method)}
          >
            <Image
              source={{ uri: method.icon }}
              style={styles.withdrawIcon}
            />

            <View style={styles.withdrawInfo}>
              <Text style={[
                styles.withdrawName,
                isDarkMode && styles.textLight
              ]}>
                {method.name}
              </Text>

              <Text style={[
                styles.withdrawHint,
                isDarkMode && styles.textMuted
              ]}>
                اضغط لاختيار طريقة السحب
              </Text>
            </View>

            <Text style={styles.arrow}>
              ‹
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={[
          styles.withdrawNote,
          isDarkMode && styles.textMuted
        ]}>
          ⚠️ السحب الحقيقي سيتم تفعيله عند ربط نظام الدفع في النسخة النهائية.
        </Text>
      </ScrollView>

      {renderBottomNav()}
    </SafeAreaView>
  );

  const renderProfile = () => (
    <SafeAreaView style={[
      styles.container,
      isDarkMode && styles.screenDark
    ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {renderHeader(t.profileSettings)}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.profileCard,
          isDarkMode && styles.cardDark
        ]}>
          <TouchableOpacity
            style={styles.profileAvatar}
            onPress={pickAvatar}
          >
            {renderAvatar()}
          </TouchableOpacity>

          <Text style={[
            styles.profileEmail,
            isDarkMode && styles.textLight
          ]}>
            {userEmail || 'مستخدم PayPop'}
          </Text>

          <Text style={styles.profilePoints}>
            {points.toLocaleString()} PPT
          </Text>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={pickAvatar}
          >
            <Text style={styles.avatarButtonText}>
              📷 تغيير صورة الحساب
            </Text>
          </TouchableOpacity>

          <View style={styles.emojiRow}>
            {emojisList.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.emojiButton}
                onPress={() => selectEmojiAvatar(emoji)}
              >
                <Text style={styles.emojiText}>
                  {emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={[
          styles.settingsSection,
          isDarkMode && styles.cardDark
        ]}>
          <Text style={[
            styles.settingsTitle,
            isDarkMode && styles.textLight
          ]}>
            {t.appSettings}
          </Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setIsDarkMode(!isDarkMode)}
          >
            <Text style={styles.settingIcon}>🌙</Text>

            <Text style={[
              styles.settingText,
              isDarkMode && styles.textLight
            ]}>
              {t.darkMode}
            </Text>

            <Text style={styles.settingValue}>
              {isDarkMode ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setCurrencyModalVisible(true)}
          >
            <Text style={styles.settingIcon}>💰</Text>

            <Text style={[
              styles.settingText,
              isDarkMode && styles.textLight
            ]}>
              {t.currency}
            </Text>

            <Text style={styles.settingValue}>
              {currentCurrency}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setLangModalVisible(true)}
          >
            <Text style={styles.settingIcon}>🌐</Text>

            <Text style={[
              styles.settingText,
              isDarkMode && styles.textLight
            ]}>
              {t.language}
            </Text>

            <Text style={styles.settingValue}>
              {currentLang.toUpperCase()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert(
                t.supportCenter,
                'تواصل معنا عبر مركز الدعم في النسخة النهائية.'
              )
            }
          >
            <Text style={styles.settingIcon}>🆘</Text>

            <Text style={[
              styles.settingText,
              isDarkMode && styles.textLight
            ]}>
              {t.supportCenter}
            </Text>

            <Text style={styles.arrow}>
              ‹
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.referralButton}
          onPress={() => setReferralModalVisible(true)}
        >
          <Text style={styles.referralButtonText}>
            👥 دعوة الأصدقاء وربح PPT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            setCurrentScreen('login');
            setUserEmail('');
            setPassword('');
          }}
        >
          <Text style={styles.logoutButtonText}>
            🚪 {t.logout}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {renderBottomNav()}
    </SafeAreaView>
  );
  const renderWheelModal = () => (
    <Modal
      visible={wheelModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setWheelModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.wheelModal,
          isDarkMode && styles.cardDark
        ]}>
          <View style={styles.modalHeader}>
            <Text style={[
              styles.modalTitle,
              isDarkMode && styles.textLight
            ]}>
              🎡 عجلة توكنات الحظ
            </Text>

            <TouchableOpacity
              onPress={() => setWheelModalVisible(false)}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.wheelScroll}
          >
            <Text style={[
              styles.wheelStatus,
              isDarkMode && styles.textMuted
            ]}>
              {dailyAvailable
                ? '🎁 الدورة اليومية مجانية ومتاحة الآن'
                : adSpins > 0
                  ? `🎟️ لديك ${adSpins} دورات مجانية من الإعلان`
                  : `⏳ الدورة اليومية بعد ${formatWheelTime(wheelCooldown)}`
              }
            </Text>

            <View style={styles.wheelBox}>
              <Wheel
                onReward={handleWheelReward}
                disabled={!wheelCanSpin}
              />
            </View>

            <Text style={styles.wheelRewardText}>
              {wheelRewardText}
            </Text>

            {!dailyAvailable && (
              <Text style={[
                styles.adSpinInfo,
                isDarkMode && styles.textMuted
              ]}>
                الدورات المجانية المتبقية: {adSpins}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.adButton,
                adCooldown > 0 && styles.disabledButton
              ]}
              onPress={watchAdForSpins}
              disabled={adCooldown > 0}
            >
              <Text style={styles.adButtonText}>
                {adCooldown > 0
                  ? `📺 إعلان جديد بعد ${formatWheelTime(adCooldown)}`
                  : '📺 شاهد إعلان واحصل على 3 دورات'
                }
              </Text>
            </TouchableOpacity>

            <Text style={[
              styles.wheelNote,
              isDarkMode && styles.textMuted
            ]}>
              الجوائز المتاحة: 10 PPT • 15 PPT • 25 PPT
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderCurrencyModal = () => (
    <Modal
      visible={currencyModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setCurrencyModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.smallModal,
          isDarkMode && styles.cardDark
        ]}>
          <Text style={[
            styles.modalTitle,
            isDarkMode && styles.textLight
          ]}>
            {t.selectCurrencyTitle}
          </Text>

          {['USD', 'DZD', 'EUR'].map(currency => (
            <TouchableOpacity
              key={currency}
              style={styles.modalOption}
              onPress={() => {
                setCurrentCurrency(currency);
                setCurrencyModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>
                {currencySymbols[currency]} {currency}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => setCurrencyModalVisible(false)}
          >
            <Text style={styles.cancelText}>
              {t.cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const renderLanguageModal = () => (
    <Modal
      visible={langModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setLangModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.smallModal,
          isDarkMode && styles.cardDark
        ]}>
          <Text style={[
            styles.modalTitle,
            isDarkMode && styles.textLight
          ]}>
            {t.selectLangTitle}
          </Text>

          {[
            { id: 'ar', name: 'العربية 🇩🇿' },
            { id: 'fr', name: 'Français 🇫🇷' },
            { id: 'en', name: 'English 🇬🇧' }
          ].map(language => (
            <TouchableOpacity
              key={language.id}
              style={styles.modalOption}
              onPress={() => {
                setCurrentLang(language.id);
                setLangModalVisible(false);
              }}
            >
              <Text style={styles.modalOptionText}>
                {language.name}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => setLangModalVisible(false)}
          >
            <Text style={styles.cancelText}>
              {t.cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderWithdrawModal = () => (
    <Modal
      visible={!!selectedMethod}
      transparent
      animationType="fade"
      onRequestClose={() => setSelectedMethod(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.smallModal,
          isDarkMode && styles.cardDark
        ]}>
          <Text style={[
            styles.modalTitle,
            isDarkMode && styles.textLight
          ]}>
            💳 سحب عبر {selectedMethod?.name}
          </Text>

          <Text style={[
            styles.modalDescription,
            isDarkMode && styles.textMuted
          ]}>
            أدخل معلومات حسابك لاستقبال الأرباح.
          </Text>

          <TextInput
            style={[
              styles.input,
              isDarkMode && styles.inputDark
            ]}
            placeholder="البريد أو رقم الحساب"
            placeholderTextColor={
              isDarkMode ? '#94A3B8' : '#64748B'
            }
            value={withdrawInput}
            onChangeText={setWithdrawInput}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={submitWithdraw}
          >
            <Text style={styles.primaryButtonText}>
              إرسال طلب السحب
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedMethod(null)}
          >
            <Text style={styles.cancelText}>
              {t.cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderReferralModal = () => (
    <Modal
      visible={referralModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setReferralModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.smallModal,
          isDarkMode && styles.cardDark
        ]}>
          <Text style={[
            styles.modalTitle,
            isDarkMode && styles.textLight
          ]}>
            👥 دعوة الأصدقاء
          </Text>

          <Text style={[
            styles.modalDescription,
            isDarkMode && styles.textMuted
          ]}>
            شارك كود الدعوة واربح 100 PPT عند انضمام صديقك.
          </Text>

          <View style={styles.referralCodeBox}>
            <Text style={styles.referralCode}>
              {referralCode}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              Alert.alert(
                '📋 كود الدعوة',
                `كودك هو: ${referralCode}`
              );
            }}
          >
            <Text style={styles.primaryButtonText}>
              نسخ كود الدعوة
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setReferralModalVisible(false)}
          >
            <Text style={styles.cancelText}>
              {t.cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const renderAppContent = () => {
    if (currentScreen === 'splash') {
      return renderSplash();
    }

    if (currentScreen === 'login') {
      return renderLogin();
    }

    if (currentScreen === 'home') {
      return renderHome();
    }

    if (currentScreen === 'earn') {
      return renderEarn();
    }

    if (currentScreen === 'wallet') {
      return renderWallet();
    }

    if (currentScreen === 'profile') {
      return renderProfile();
    }

    return renderHome();
  };

  return (
    <>
      {renderAppContent()}

      {renderWheelModal()}
      {renderCurrencyModal()}
      {renderLanguageModal()}
      {renderWithdrawModal()}
      {renderReferralModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },

  screenDark: {
    backgroundColor: '#0F172A'
  },

  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#F8FAFC'
  },

  splashDark: {
    backgroundColor: '#0F172A'
  },

  splashTitle: {
    marginTop: 15,
    fontSize: 42,
    fontWeight: '900',
    color: '#7C3AED'
  },

  splashDesc: {
    marginTop: 12,
    maxWidth: 330,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 25,
    color: '#475569'
  },

  primaryButton: {
    width: '100%',
    marginTop: 22,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    elevation: 3
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },

  authContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#F8FAFC'
  },

  authTitle: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 28,
    fontWeight: '900',
    color: '#1E293B'
  },

  input: {
    width: '100%',
    minHeight: 52,
    marginTop: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    fontSize: 15
  },

  inputDark: {
    backgroundColor: '#1E293B',
    borderColor: '#475569',
    color: '#FFFFFF'
  },

  linkText: {
    marginTop: 14,
    color: '#7C3AED',
    fontWeight: '800'
  },

  switchAuthText: {
    marginTop: 20,
    color: '#2563EB',
    fontWeight: '800',
    textAlign: 'center'
  },

  header: {
    minHeight: 72,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },

  headerDark: {
    backgroundColor: '#111827',
    borderBottomColor: '#334155'
  },

  headerLogo: {
    marginRight: 10
  },

  headerTitleBox: {
    flex: 1
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1E293B'
  },

  headerPoints: {
    marginTop: 3,
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '800'
  },

  headerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
    overflow: 'hidden'
  },

  avatarEmoji: {
    fontSize: 27
  },

  avatarImage: {
    width: 46,
    height: 46
  },

  textLight: {
    color: '#F8FAFC'
  },

  textMuted: {
    color: '#94A3B8'
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 100
  },

  balanceCard: {
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#7C3AED',
    elevation: 5
  },

  balanceCardDark: {
    backgroundColor: '#5B21B6'
  },

  balanceLabel: {
    color: '#EDE9FE',
    fontSize: 14,
    fontWeight: '700'
  },

  balanceValue: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900'
  },

  usdValue: {
    marginTop: 4,
    color: '#FDE68A',
    fontSize: 16,
    fontWeight: '800'
  },

  balanceStats: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  statBox: {
    flex: 1,
    alignItems: 'center'
  },

  statNumber: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900'
  },

  statLabel: {
    marginTop: 4,
    color: '#DDD6FE',
    fontSize: 10,
    textAlign: 'center'
  },
  
    dailyCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },

  quickCard: {
    marginTop: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },

  cardDark: {
    backgroundColor: '#1E293B'
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B'
  },

  cardDescription: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21
  },

  rewardButton: {
    marginTop: 15,
    paddingVertical: 13,
    borderRadius: 13,
    alignItems: 'center',
    backgroundColor: '#10B981'
  },

  rewardButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },

  quickButtonTitle: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '900'
  },

  quickButtonSubtitle: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700'
  },

  wheelQuickButton: {
    marginTop: 15,
    padding: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF'
  },

  quickTextBox: {
    flex: 1,
    marginLeft: 12
  },

  arrow: {
    color: '#7C3AED',
    fontSize: 30,
    fontWeight: '700'
  },

  withdrawHomeButton: {
    marginTop: 16,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#2563EB'
  },

  withdrawHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },

  sectionSubtitle: {
    marginBottom: 15,
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21
  },

  earnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  earnCard: {
    width: '48%',
    minHeight: 205,
    marginBottom: 14,
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 2
  },

  earnIconBox: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },

  gridItemImage: {
    width: 42,
    height: 42
  },

  earnCardTitle: {
    marginTop: 10,
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center'
  },

  earnCardDescription: {
    marginTop: 6,
    minHeight: 42,
    color: '#64748B',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center'
  },

  rewardBadge: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F3E8FF'
  },

  rewardBadgeText: {
    color: '#7C3AED',
    fontSize: 11,
    fontWeight: '900'
  },

  walletBalanceCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    elevation: 2
  },

  walletBalanceLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700'
  },

  walletBalanceValue: {
    marginTop: 6,
    color: '#7C3AED',
    fontSize: 28,
    fontWeight: '900'
  },

  walletUsdValue: {
    marginTop: 4,
    color: '#10B981',
    fontSize: 15,
    fontWeight: '800'
  },

  withdrawCard: {
    minHeight: 75,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 2
  },

  withdrawIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain'
  },

  withdrawInfo: {
    flex: 1,
    marginLeft: 12
  },

  withdrawName: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '900'
  },

  withdrawHint: {
    marginTop: 3,
    color: '#64748B',
    fontSize: 11
  },

  withdrawNote: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center'
  },

  profileCard: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 2
  },

  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
    overflow: 'hidden'
  },

  profileEmail: {
    marginTop: 12,
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '800'
  },

  profilePoints: {
    marginTop: 5,
    color: '#7C3AED',
    fontSize: 20,
    fontWeight: '900'
  },

  avatarButton: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F3E8FF'
  },

  avatarButtonText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '800'
  },

  emojiRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8
  },

  emojiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9'
  },

  emojiText: {
    fontSize: 21
  },

  settingsSection: {
    marginTop: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },

  settingsTitle: {
    marginBottom: 8,
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '900'
  },

  settingRow: {
    minHeight: 55,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center'
  },

  settingIcon: {
    width: 35,
    fontSize: 20
  },

  settingText: {
    flex: 1,
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700'
  },

  settingValue: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '900'
  },

  referralButton: {
    marginTop: 16,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#10B981'
  },

  referralButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },

  logoutButton: {
    marginTop: 12,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: '#EF4444'
  },

  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },

  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },

  bottomNavDark: {
    backgroundColor: '#111827',
    borderTopColor: '#334155'
  },

  navItem: {
    flex: 1,
    alignItems: 'center'
  },

  navIcon: {
    fontSize: 20
  },

  navText: {
    marginTop: 3,
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700'
  },

  navTextActive: {
    color: '#7C3AED',
    fontWeight: '900'
  },

  modalOverlay: {
    flex: 1,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)'
  },

  wheelModal: {
    width: '100%',
    maxHeight: '92%',
    padding: 14,
    borderRadius: 24,
    backgroundColor: '#FFFFFF'
  },

  smallModal: {
    width: '100%',
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#FFFFFF'
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },

  modalTitle: {
    flex: 1,
    color: '#1E293B',
    fontSize: 19,
    fontWeight: '900'
  },

  closeButton: {
    padding: 5,
    color: '#64748B',
    fontSize: 22,
    fontWeight: '900'
  },

  wheelScroll: {
    alignItems: 'center',
    paddingBottom: 10
  },

  wheelStatus: {
    marginBottom: 8,
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center'
  },

  wheelBox: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4
  },

  wheelRewardText: {
    marginTop: 5,
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center'
  },

  adSpinInfo: {
    marginTop: 5,
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800'
  },

  adButton: {
    width: '100%',
    marginTop: 12,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#2563EB'
  },

  disabledButton: {
    backgroundColor: '#94A3B8'
  },

  adButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center'
  },

  wheelNote: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center'
  },

  modalDescription: {
    marginTop: 8,
    marginBottom: 8,
    color: '#64748B',
    fontSize: 13,
    lineHeight: 20
  },

  modalOption: {
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F3E8FF'
  },

  modalOptionText: {
    color: '#7C3AED',
    fontSize: 15,
    fontWeight: '900'
  },

  cancelText: {
    marginTop: 15,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center'
  },

  referralCodeBox: {
    marginTop: 15,
    padding: 15,
    borderRadius: 13,
    alignItems: 'center',
    backgroundColor: '#F3E8FF'
  },

  referralCode: {
    color: '#7C3AED',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 1
  }
});

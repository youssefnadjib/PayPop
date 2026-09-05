import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, SafeAreaView, StatusBar, TextInput, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const translations = {
  ar: {
    appName: "PayPop",
    splashDesc: "طريقتك الأذكية لجمع الأرباح، شدات الألعاب، وسحب الأموال بكل سهولة.",
    startNow: "ابدأ الآن",
    emailPlaceholder: "البريد الإلكتروني",
    passPlaceholder: "كلمة السر",
    forgotPass: "نسيت كلمة السر؟",
    login: "تسجيل الدخول",
    signUp: "إنشاء الحساب",
    hasAccount: "لديك حساب بالفعل؟ تسجيل الدخول",
    noAccount: "ليس لديك حساب؟ إنشاء حساب جديد",
    dashboard: "لوحة التحكم (Dashboard)",
    points: "نقطة",
    usdValue: "تساوي",
    todayEarned: "ما جمعت اليوم",
    invitedFriends: "الأصدقاء المدعوون",
    dailyChallenge: "التحدي اليومي",
    dailyDesc: "ادخل كل يوم وأقسح هدية التسجيل اليومي (+50 نقطة)",
    claimDaily: "استلام الهدية اليومية",
    earnTitle: "⚡ طرق جمع النقاط والأرباح",
    earnSubtitle: "اختر الطريقة المناسبة وابدأ في ربح النقاط فوراً",
    walletTitle: "💳 طلب سحب الأرباح والجوائز",
    walletSubtitle: "اختر وسيلة السحب المناسبة بالضغط على المربع",
    profileSettings: "إعدادات التطبيق والحساب",
    appSettings: "إعدادات التطبيق",
    darkMode: "الوضع الداكن",
    myCountry: "البلد الخاص بي",
    currency: "تغيير العملة",
    language: "اللغة (Language)",
    supportCenter: "مركز الدعم والمساعدة",
    logout: "تسجيل الخروج",
    homeNav: "الرئيسية",
    earnNav: "اربح",
    walletNav: "المحفظة",
    profileNav: "حسابي",
    selectLangTitle: "اختر لغة التطبيق",
    selectCurrencyTitle: "اختر العملة المفضلة",
    cancel: "إلغاء"
  },
  fr: {
    appName: "PayPop",
    splashDesc: "Votre moyen le plus intelligent de gagner des profits, des UC/Gemmes et de retirer de l'argent facilement.",
    startNow: "Commencer",
    emailPlaceholder: "E-mail",
    passPlaceholder: "Mot de passe",
    forgotPass: "Mot de passe oublié ?",
    login: "Se connecter",
    signUp: "Créer un compte",
    hasAccount: "Vous avez déjà un compte ? Connexion",
    noAccount: "Pas de compte ? Créer un compte",
    dashboard: "Tableau de bord",
    points: "points",
    usdValue: "Équivaut à",
    todayEarned: "Gagné aujourd'hui",
    invitedFriends: "Amis invités",
    dailyChallenge: "Défi quotidien",
    dailyDesc: "Rejoignez chaque jour et réclamez le cadeau (+50 points)",
    claimDaily: "Réclamer le cadeau",
    earnTitle: "⚡ Méthodes de gain",
    earnSubtitle: "Choisissez la méthode et gagnez des points instantanément",
    walletTitle: "💳 Demande de retrait",
    walletSubtitle: "Choisissez votre méthode de retrait en cliquant dessus",
    profileSettings: "Paramètres du compte",
    appSettings: "Paramètres de l'application",
    darkMode: "Mode Sombre",
    myCountry: "Mon Pays",
    currency: "Changer la devise",
    language: "Langue (Language)",
    supportCenter: "Centre d'assistance",
    logout: "Se déconnecter",
    homeNav: "Accueil",
    earnNav: "Gagner",
    walletNav: "Portefeuille",
    profileNav: "Profil",
    selectLangTitle: "Choisir la langue de l'application",
    selectCurrencyTitle: "Choisir la devise",
    cancel: "Annuler"
  },
  en: {
    appName: "PayPop",
    splashDesc: "Your smartest way to collect profits, game UC, and withdraw cash easily.",
    startNow: "Get Started",
    emailPlaceholder: "Email",
    passPlaceholder: "Password",
    forgotPass: "Forgot Password?",
    login: "Log In",
    signUp: "Sign Up",
    hasAccount: "Already have an account? Log In",
    noAccount: "Don't have an account? Sign Up",
    dashboard: "Dashboard",
    points: "points",
    usdValue: "Equals",
    todayEarned: "Earned Today",
    invitedFriends: "Invited Friends",
    dailyChallenge: "Daily Challenge",
    dailyDesc: "Log in daily and claim your daily reward (+50 points)",
    claimDaily: "Claim Daily Reward",
    earnTitle: "⚡ Ways to Earn Points",
    earnSubtitle: "Choose the right method and start earning instantly",
    walletTitle: "💳 Request Payout",
    walletSubtitle: "Choose your payout method by tapping the box",
    profileSettings: "App & Account Settings",
    appSettings: "App Settings",
    darkMode: "Dark Mode",
    myCountry: "My Country",
    currency: "Change Currency",
    language: "Language",
    supportCenter: "Support Center",
    logout: "Log Out",
    homeNav: "Home",
    earnNav: "Earn",
    walletNav: "Wallet",
    profileNav: "Profile",
    selectLangTitle: "Select App Language",
    selectCurrencyTitle: "Select Currency",
    cancel: "Cancel"
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isSignUp, setIsSignUp] = useState(false);
  const [points, setPoints] = useState(1405);
  const [userEmail, setUserEmail] = useState('');
  
  // حالات الإعدادات الجديدة (الوضع الداكن، البلد، العملة)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('USD'); // USD, EUR, DZD, EGP
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  // حالة اللغة
  const [currentLang, setCurrentLang] = useState('ar');
  const [langModalVisible, setLangModalVisible] = useState(false);

  const t = translations[currentLang];

  // إعدادات عجلة الحظ
  const [spinCount, setSpinCount] = useState(0);
  const [userAvatar, setUserAvatar] = useState('👤');
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [referralModalVisible, setReferralModalVisible] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [withdrawInput, setWithdrawInput] = useState('');

  const [wheelModalVisible, setWheelModalVisible] = useState(false);
  const [wheelRewardText, setWheelRewardText] = useState('اضغط لتدوير العجلة واكتشاف نصيبك!');
  const [isSpinning, setIsSpinning] = useState(false);
  
  const referralCode = "PAYPOP-8849";
  const emojisList = ['😎', '🦊', '⚡', '🎮', '🦁'];

  // حساب قيمة النقاط بناءً على العملة المختارة
  const getConvertedValue = () => {
    const usdVal = points / 1000;
    switch (currentCurrency) {
      case 'EUR': return `€${(usdVal * 0.92).toFixed(2)}`;
      case 'DZD': return `${(usdVal * 134).toFixed(0)} د.ج`;
      case 'EGP': return `${(usdVal * 48).toFixed(0)} ج.م`;
      default: return `$${usdVal.toFixed(2)} USD`;
    }
  };

  const addPoints = (amount, source) => {
    setPoints(prev => prev + amount);
    Alert.alert("تهانينا!", `حصلت على ${amount} نقطة من ${source}`);
  };

  const spinWheelAction = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelRewardText('جاري تدوير العجلة...');

    setTimeout(() => {
      let reward = 10;
      if (spinCount === 0) reward = 25;
      else reward = Math.random() < 0.5 ? 10 : 15;

      setPoints(prev => prev + reward);
      setSpinCount(prev => prev + 1);
      setWheelRewardText(`مبروك! ربحت ${reward} نقطة في هذه التدويرة 🎉`);
      setIsSpinning(false);
    }, 1500);
  };

  const executeWithdraw = () => {
    if (!selectedMethod) return;
    if (points < selectedMethod.minPoints) {
      Alert.alert("الرصيد غير كافٍ", `الحد الأدنى للسحب عبر ${selectedMethod.name} هو ${selectedMethod.minPoints} نقطة.`);
      return;
    }
    if (!withdrawInput.trim()) {
      Alert.alert("خطأ", `يرجى إدخال ${selectedMethod.inputPlaceholder} بشكل صحيح.`);
      return;
    }
    Alert.alert("تم إرسال الطلب بنجاح", `سيتم تحويل الأرباح عبر (${selectedMethod.name}) إلى:\n\n${withdrawInput}\n\nخلال 24 ساعة.`);
    setWithdrawInput('');
    setSelectedMethod(null);
  };

  const handleCameraAction = () => {
    Alert.alert(
      "تغيير صورة الحساب",
      "اختر طريقة تغيير الصورة:",
      [
        { 
          text: "التقاط بالكاميرا", 
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert("إذن مرفوض", "يجب السماح بالتطبيق باستخدام الكاميرا.");
              return;
            }
            const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
            if (!result.canceled) { setUserAvatar(result.assets[0].uri); setIsCustomImage(true); }
          } 
        },
        { 
          text: "اختيار من المعرض", 
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert("إذن مرفوض", "يجب السماح بالتطبيق بالوصول إلى معرض الصور.");
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
            if (!result.canceled) { setUserAvatar(result.assets[0].uri); setIsCustomImage(true); }
          } 
        },
        { text: "إلغاء", style: "cancel" }
      ]
    );
  };

  const withdrawalMethods = [
    { id: 'baridimob', name: 'بريدي موب', icon: 'https://img.icons8.com/color/96/card-security.png', minPoints: 5000, inputPlaceholder: 'رقم RIP أو الحساب البريدي', keyboardType: 'numeric' },
    { id: 'redotpay', name: 'RedotPay', icon: 'https://img.icons8.com/color/96/bank-card-back-side.png', minPoints: 5000, inputPlaceholder: 'البريد الإلكتروني أو ID', keyboardType: 'default' },
    { id: 'paypal', name: 'بايبال PayPal', icon: 'https://img.icons8.com/color/96/paypal.png', minPoints: 3000, inputPlaceholder: 'البريد الإلكتروني (Email)', keyboardType: 'email-address' },
    { id: 'binance', name: 'بايننس Binance', icon: 'https://img.icons8.com/color/96/binance.png', minPoints: 2000, inputPlaceholder: 'Binance ID أو USDT (BEP20)', keyboardType: 'default' },
    { id: 'freefire', name: 'فري فاير Free Fire', icon: 'https://img.icons8.com/color/96/sword.png', minPoints: 1500, inputPlaceholder: 'معرف اللاعب (Player ID)', keyboardType: 'numeric' },
    { id: 'pubg', name: 'ببجي موبايل PUBG', icon: 'https://img.icons8.com/color/96/pubg.png', minPoints: 1500, inputPlaceholder: 'معرف اللاعب (PUBG ID)', keyboardType: 'numeric' }
  ];

  const earnMethods = [
    { id: 'wheel', name: 'عجلة الحظ اليومية', icon: 'https://img.icons8.com/color/96/luck.png', desc: 'أدر العجلة واربح نقاط متجددة', onPress: () => setWheelModalVisible(true) },
    { id: 'ads', name: 'مشاهدة الإعلانات', icon: 'https://img.icons8.com/color/96/video.png', desc: 'شاهد إعلاناً قصيراً (+30 نقطة)', onPress: () => addPoints(30, "مشاهدة إعلان ترويجي") },
    { id: 'survey', name: 'استطلاعات الرأي', icon: 'https://img.icons8.com/color/96/faq.png', desc: 'أجب عن أسئلة خفيفة (+20 نقطة)', onPress: () => addPoints(20, "استطلاع الرأي الثقافي") },
    { id: 'games', name: 'إلعب وأحصل على نقاط', icon: 'https://img.icons8.com/color/96/controller.png', desc: 'استمتع بالألعاب واجمع الأرباح', onPress: () => Alert.alert("قسم الألعاب", "قريباً!") }
  ];

  const isRtl = currentLang === 'ar';
  const textDirectionStyle = { textAlign: isRtl ? 'right' : 'left' };
  const rowDirectionStyle = { flexDirection: isRtl ? 'row-reverse' : 'row' };

  // ثيم الألوان حسب الوضع الداكن أو الفاتح
  const themeStyles = {
    container: { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
    card: { backgroundColor: isDarkMode ? '#1E293B' : 'white' },
    textColor: { color: isDarkMode ? '#F1F5F9' : '#1E293B' },
    subTextColor: { color: isDarkMode ? '#94A3B8' : '#64748B' },
    inputBg: { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', color: isDarkMode ? 'white' : 'black', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
    navBg: { backgroundColor: isDarkMode ? '#1E293B' : 'white', borderTopColor: isDarkMode ? '#334155' : '#E2E8F0' },
    modalBg: { backgroundColor: isDarkMode ? '#1E293B' : 'white' }
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <StatusBar backgroundColor="#5849E2" barStyle="light-content" />
      
      {currentScreen !== 'splash' && currentScreen !== 'login' && (
        <View style={[styles.header, rowDirectionStyle]}>
          <Text style={styles.logo}>{t.appName}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{points} {t.points} ({getConvertedValue()})</Text>
          </View>
        </View>
      )}

      {currentScreen === 'splash' && (
        <View style={styles.splashContainer}>
          <View style={[styles.splashCard, themeStyles.card]}>
            <Text style={styles.splashTitle}>{t.appName}</Text>
            <Text style={[styles.splashDesc, themeStyles.subTextColor]}>{t.splashDesc}</Text>
            <TouchableOpacity style={styles.splashBtn} onPress={() => setCurrentScreen('login')}>
              <Text style={styles.splashBtnText}>{t.startNow}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentScreen === 'login' && (
        <ScrollView contentContainerStyle={styles.authContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.appTitle}>{t.appName}</Text>
          </View>
          <Text style={[styles.subTitle, themeStyles.subTextColor]}>{isSignUp ? t.signUp : t.login}</Text>

          <TextInput 
            style={[styles.input, themeStyles.inputBg, textDirectionStyle]} 
            placeholder={t.emailPlaceholder} 
            placeholderTextColor="#888"
            onChangeText={setUserEmail}
          />
          <TextInput 
            style={[styles.input, themeStyles.inputBg, textDirectionStyle]} 
            placeholder={t.passPlaceholder} 
            secureTextEntry 
            placeholderTextColor="#888"
          />

          {!isSignUp && (
            <TouchableOpacity style={[styles.forgotBtn, {alignSelf: isRtl ? 'flex-start' : 'flex-end'}]} onPress={() => Alert.alert("استعادة", "تم إرسال رابط الاستعادة.")}>
              <Text style={styles.forgotText}>{t.forgotPass}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.primaryBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={styles.btnText}>{isSignUp ? t.signUp : t.login}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchAuthBtn} onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchAuthText}>{isSignUp ? t.hasAccount : t.noAccount}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {currentScreen === 'home' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, themeStyles.card]}>
            <Text style={[styles.cardTitle, themeStyles.textColor, textDirectionStyle]}>{t.dashboard}</Text>
            <Text style={styles.pointsText}>{points} {t.points}</Text>
            <Text style={styles.subPoints}>{t.usdValue} {getConvertedValue()}</Text>
          </View>

          <View style={[styles.statsRow, rowDirectionStyle]}>
            <View style={[styles.statBox, themeStyles.card]}>
              <Text style={styles.statNumber}>150</Text>
              <Text style={[styles.statLabel, themeStyles.subTextColor]}>{t.todayEarned}</Text>
            </View>
            <View style={[styles.statBox, themeStyles.card]}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={[styles.statLabel, themeStyles.subTextColor]}>{t.invitedFriends}</Text>
            </View>
          </View>

          <View style={[styles.card, themeStyles.card]}>
            <Text style={[styles.cardTitle, themeStyles.textColor, textDirectionStyle]}>{t.dailyChallenge}</Text>
            <Text style={[styles.cardDesc, themeStyles.subTextColor, textDirectionStyle]}>{t.dailyDesc}</Text>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#F59E0B'}]} onPress={() => addPoints(50, "هدية التحدي اليومي")}>
              <Text style={styles.btnText}>{t.claimDaily}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'earn' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.mainCardContainer, themeStyles.card]}>
            <Text style={[styles.walletMainTitle, themeStyles.textColor]}>{t.earnTitle}</Text>
            <Text style={[styles.walletSubtitle, themeStyles.subTextColor]}>{t.earnSubtitle}</Text>

            <View style={[styles.gridContainer, rowDirectionStyle]}>
              {earnMethods.map((method) => (
                <TouchableOpacity key={method.id} style={[styles.gridItemBox, isDarkMode && {backgroundColor: '#0F172A', borderColor: '#334155'}]} onPress={method.onPress}>
                  <Image source={{ uri: method.icon }} style={styles.gridItemImage} />
                  <Text style={[styles.gridItemName, themeStyles.textColor]}>{method.name}</Text>
                  <Text style={[styles.gridItemMin, themeStyles.subTextColor]}>{method.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'wallet' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.mainCardContainer, themeStyles.card]}>
            <Text style={[styles.walletMainTitle, themeStyles.textColor]}>{t.walletTitle}</Text>
            <Text style={[styles.walletSubtitle, themeStyles.subTextColor]}>{t.walletSubtitle}</Text>

            <View style={[styles.gridContainer, rowDirectionStyle]}>
              {withdrawalMethods.map((method) => (
                <TouchableOpacity 
                  key={method.id}
                  style={[styles.gridItemBox, isDarkMode && {backgroundColor: '#0F172A', borderColor: '#334155'}]}
                  onPress={() => { setSelectedMethod(method); setWithdrawInput(''); }}
                >
                  <Image source={{ uri: method.icon }} style={styles.gridItemImage} />
                  <Text style={[styles.gridItemName, themeStyles.textColor]}>{method.name}</Text>
                  <Text style={[styles.gridItemMin, themeStyles.subTextColor]}>Min: {method.minPoints}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'profile' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.profileHeaderCard, themeStyles.card]}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                {isCustomImage ? (
                  <Image source={{ uri: userAvatar }} style={styles.avatarImageStyle} />
                ) : (
                  <Text style={styles.avatarText}>{userAvatar}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.cameraIconBtn} onPress={handleCameraAction}>
                <Text style={styles.cameraIconText}>📷</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.profileName, themeStyles.textColor]}>{userEmail ? userEmail.split('@')[0] : "Youssef Gamer"}</Text>
            <Text style={[styles.profileEmail, themeStyles.subTextColor]}>{userEmail || "user@paypop.com"}</Text>

            <View style={[styles.emojisRow, rowDirectionStyle]}>
              {emojisList.map((emo, index) => (
                <TouchableOpacity key={index} style={[styles.emojiOption, isDarkMode && {backgroundColor: '#0F172A', borderColor: '#334155'}]} onPress={() => { setUserAvatar(emo); setIsCustomImage(false); }}>
                  <Text style={styles.emojiItem}>{emo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.card, themeStyles.card]}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setReferralModalVisible(true)}>
              <Text style={styles.btnText}>Referral System</Text>
            </TouchableOpacity>
          </View>

          {/* قسم إعدادات التطبيق المحدثة */}
          <View style={[styles.card, themeStyles.card]}>
            <Text style={[styles.cardTitle, themeStyles.textColor, textDirectionStyle]}>{t.profileSettings}</Text>
            
            {/* زر تغيير الوضع لداكن */}
            <TouchableOpacity style={[styles.menuItem, rowDirectionStyle]} onPress={() => setIsDarkMode(!isDarkMode)}>
              <Text style={styles.menuArrow}>{isRtl ? '←' : '→'}</Text>
              <Text style={[styles.menuText, themeStyles.textColor]}>{t.darkMode} ({isDarkMode ? 'ON 🌙' : 'OFF ☀️'})</Text>
            </TouchableOpacity>

            {/* زر معرفة البلد */}
            <TouchableOpacity style={[styles.menuItem, rowDirectionStyle]} onPress={() => Alert.alert(t.myCountry, "الجزائر (Algeria) 🇩🇿 - الموقع الحالي مضبوط بنجاح.")}>
              <Text style={styles.menuArrow}>{isRtl ? '←' : '→'}</Text>
              <Text style={[styles.menuText, themeStyles.textColor]}>{t.myCountry}: الجزائر 🇩🇿</Text>
            </TouchableOpacity>

            {/* زر تغيير العملة */}
            <TouchableOpacity style={[styles.menuItem, rowDirectionStyle]} onPress={() => setCurrencyModalVisible(true)}>
              <Text style={styles.menuArrow}>{isRtl ? '←' : '→'}</Text>
              <Text style={[styles.menuText, themeStyles.textColor]}>{t.currency} ({currentCurrency})</Text>
            </TouchableOpacity>

            {/* زر تغيير اللغة */}
            <TouchableOpacity style={[styles.menuItem, rowDirectionStyle]} onPress={() => setLangModalVisible(true)}>
              <Text style={styles.menuArrow}>{isRtl ? '←' : '→'}</Text>
              <Text style={[styles.menuText, themeStyles.textColor]}>{t.language} ({currentLang.toUpperCase()})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, rowDirectionStyle]} onPress={() => Alert.alert("Support", "Contact us.")}>
              <Text style={styles.menuArrow}>{isRtl ? '←' : '→'}</Text>
              <Text style={[styles.menuText, themeStyles.textColor]}>{t.supportCenter}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => setCurrentScreen('login')}>
            <Text style={styles.logoutBtnText}>{t.logout}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* نافذة اختيار العملة */}
      <Modal animationType="slide" transparent={true} visible={currencyModalVisible} onRequestClose={() => setCurrencyModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, themeStyles.modalBg]}>
            <Text style={[styles.modalTitle, themeStyles.textColor]}>{t.selectCurrencyTitle}</Text>
            
            {['USD', 'EUR', 'DZD', 'EGP'].map((curr) => (
              <TouchableOpacity 
                key={curr} 
                style={[styles.primaryBtn, {backgroundColor: currentCurrency === curr ? '#10B981' : '#5849E2', marginTop: 10}]} 
                onPress={() => { setCurrentCurrency(curr); setCurrencyModalVisible(false); }}
              >
                <Text style={styles.btnText}>{curr === 'USD' ? 'دولار أمريكي (USD $)' : curr === 'EUR' ? 'أورو (EUR €)' : curr === 'DZD' ? 'دينار جزائري (DZD د.ج)' : 'جنيه مصري (EGP ج.م)'}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#94A3B8', marginTop: 15}]} onPress={() => setCurrencyModalVisible(false)}>
              <Text style={styles.btnText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* نافذة اختيار اللغة */}
      <Modal animationType="slide" transparent={true} visible={langModalVisible} onRequestClose={() => setLangModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, themeStyles.modalBg]}>
            <Text style={[styles.modalTitle, themeStyles.textColor]}>{t.selectLangTitle}</Text>
            
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: currentLang === 'ar' ? '#10B981' : '#5849E2', marginTop: 10}]} onPress={() => { setCurrentLang('ar'); setLangModalVisible(false); }}>
              <Text style={styles.btnText}>العربية (Arabic)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: currentLang === 'fr' ? '#10B981' : '#5849E2', marginTop: 10}]} onPress={() => { setCurrentLang('fr'); setLangModalVisible(false); }}>
              <Text style={styles.btnText}>Français (French)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: currentLang === 'en' ? '#10B981' : '#5849E2', marginTop: 10}]} onPress={() => { setCurrentLang('en'); setLangModalVisible(false); }}>
              <Text style={styles.btnText}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#94A3B8', marginTop: 15}]} onPress={() => setLangModalVisible(false)}>
              <Text style={styles.btnText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* نافذة عجلة الحظ */}
      <Modal animationType="slide" transparent={true} visible={wheelModalVisible} onRequestClose={() => setWheelModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, themeStyles.modalBg]}>
            <Text style={[styles.modalTitle, themeStyles.textColor]}>🎡 عجلة الحظ اليومية</Text>
            <View style={[styles.wheelBox, isDarkMode && {backgroundColor: '#0F172A', borderColor: '#334155'}]}>
              <Image source={{ uri: 'https://img.icons8.com/color/96/luck.png' }} style={{ width: 60, height: 60, marginBottom: 10 }} />
              <Text style={styles.wheelResultText}>{wheelRewardText}</Text>
            </View>
            <TouchableOpacity style={[styles.primaryBtn, isSpinning && {backgroundColor: '#94A3B8'}]} onPress={spinWheelAction} disabled={isSpinning}>
              <Text style={styles.btnText}>{isSpinning ? "جاري الدوران..." : "أدر العجلة الآن"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#94A3B8', marginTop: 10}]} onPress={() => setWheelModalVisible(false)}>
              <Text style={styles.btnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* نافذة السحب */}
      <Modal animationType="slide" transparent={true} visible={selectedMethod !== null} onRequestClose={() => setSelectedMethod(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, themeStyles.modalBg]}>
            {selectedMethod && (
              <>
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <Image source={{ uri: selectedMethod.icon }} style={{ width: 50, height: 50, marginBottom: 5 }} />
                  <Text style={[styles.modalTitle, themeStyles.textColor]}>{selectedMethod.name}</Text>
                </View>
                <TextInput style={[styles.modalInput, themeStyles.inputBg, textDirectionStyle]} placeholder={selectedMethod.inputPlaceholder} placeholderTextColor="#888" keyboardType={selectedMethod.keyboardType} value={withdrawInput} onChangeText={setWithdrawInput} />
                <TouchableOpacity style={styles.primaryBtn} onPress={executeWithdraw}><Text style={styles.btnText}>تأكيد طلب السحب</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#94A3B8', marginTop: 10}]} onPress={() => setSelectedMethod(null)}><Text style={styles.btnText}>إلغاء</Text></TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* نافذة الإحالة */}
      <Modal animationType="slide" transparent={true} visible={referralModalVisible} onRequestClose={() => setReferralModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, themeStyles.modalBg]}>
            <Text style={[styles.cardTitle, themeStyles.textColor]}>دعوة الأصدقاء</Text>
            <Text style={styles.refCode}>{referralCode}</Text>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#10B981', marginTop: 15}]} onPress={() => { Alert.alert("تم", "تم النسخ!"); setReferralModalVisible(false); }}><Text style={styles.btnText}>نسخ الكود</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#EF4444', marginTop: 10}]} onPress={() => setReferralModalVisible(false)}><Text style={styles.btnText}>إغلاق</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {currentScreen !== 'splash' && currentScreen !== 'login' && (
        <View style={[styles.bottomNav, themeStyles.navBg, rowDirectionStyle]}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={[styles.navText, themeStyles.subTextColor, currentScreen === 'home' && styles.activeNav]}>{t.homeNav}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('earn')}>
            <Text style={[styles.navText, themeStyles.subTextColor, currentScreen === 'earn' && styles.activeNav]}>{t.earnNav}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('wallet')}>
            <Text style={[styles.navText, themeStyles.subTextColor, currentScreen === 'wallet' && styles.activeNav]}>{t.walletNav}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('profile')}>
            <Text style={[styles.navText, themeStyles.subTextColor, currentScreen === 'profile' && styles.activeNav]}>{t.profileNav}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#5849E2', padding: 15, justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  badge: { backgroundColor: '#4738C4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  
  splashContainer: { flex: 1, backgroundColor: '#5849E2', justifyContent: 'center', alignItems: 'center', padding: 20 },
  splashCard: { width: '100%', backgroundColor: 'white', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 10 },
  splashTitle: { fontSize: 36, fontWeight: 'bold', color: '#5849E2', marginBottom: 10 },
  splashDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  splashBtn: { backgroundColor: '#5849E2', width: '100%', padding: 14, borderRadius: 10, alignItems: 'center' },
  splashBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  authContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  logoBox: { alignItems: 'center', marginBottom: 15 },
  appTitle: { fontSize: 36, fontWeight: 'bold', color: '#5849E2', textAlign: 'center' },
  subTitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  scrollContent: { padding: 15, paddingBottom: 80 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  cardDesc: { color: '#64748B', fontSize: 13, marginBottom: 10 },
  pointsText: { fontSize: 32, fontWeight: 'bold', color: '#5849E2', textAlign: 'center', marginVertical: 8 },
  subPoints: { textAlign: 'center', color: '#94A3B8', fontSize: 12 },
  statsRow: { gap: 10, marginBottom: 15 },
  statBox: { flex: 1, backgroundColor: 'white', padding: 15, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#5849E2', marginBottom: 5 },
  statLabel: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  primaryBtn: { backgroundColor: '#5849E2', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  
  mainCardContainer: { backgroundColor: 'white', padding: 15, borderRadius: 12, elevation: 2, alignItems: 'center' },
  walletMainTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 5, textAlign: 'center' },
  walletSubtitle: { fontSize: 12, color: '#64748B', marginBottom: 15, textAlign: 'center' },
  gridContainer: { flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  gridItemBox: { width: '48%', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 15, alignItems: 'center', marginBottom: 12, elevation: 1 },
  gridItemImage: { width: 38, height: 38, resizeMode: 'contain', marginBottom: 10 },
  gridItemName: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  gridItemMin: { fontSize: 11, color: '#64748B', textAlign: 'center' },

  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  forgotBtn: { marginBottom: 15 },
  forgotText: { color: '#5849E2', fontSize: 13 },
  switchAuthBtn: { alignItems: 'center', marginTop: 15 },
  switchAuthText: { color: '#5849E2', fontSize: 14, fontWeight: 'bold' },

  refCode: { fontSize: 18, fontWeight: 'bold', color: '#5849E2', textAlign: 'center', backgroundColor: '#F1F5F9', padding: 10, borderRadius: 8, letterSpacing: 2 },
  profileHeaderCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', elevation: 2 },
  avatarContainer: { position: 'relative', marginBottom: 10 },
  avatarCircle: { width: 75, height: 75, borderRadius: 37.5, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#5849E2', overflow: 'hidden' },
  avatarText: { fontSize: 34 },
  avatarImageStyle: { width: '100%', height: '100%', resizeMode: 'cover' },
  cameraIconBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#5849E2', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'white' },
  cameraIconText: { fontSize: 12 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  profileEmail: { fontSize: 13, color: '#64748B', marginTop: 2, marginBottom: 15 },
  emojisRow: { justifyContent: 'center', gap: 8 },
  emojiOption: { backgroundColor: '#F1F5F9', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  emojiItem: { fontSize: 18 },
  menuItem: { justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', alignItems: 'center' },
  menuText: { fontSize: 15, color: '#334155', fontWeight: 'bold' },
  menuArrow: { color: '#94A3B8', fontSize: 16 },
  logoutBtn: { backgroundColor: '#DC2626', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  logoutBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', width: '100%', padding: 20, borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', marginBottom: 15 },
  modalInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  
  wheelBox: { alignItems: 'center', backgroundColor: '#F8FAFC', padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  wheelResultText: { fontSize: 14, fontWeight: 'bold', color: '#5849E2', textAlign: 'center' },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E2E8F0', height: 60, elevation: 10, zIndex: 100 },
  navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { fontSize: 13, color: '#64748B', fontWeight: 'bold' },
  activeNav: { color: '#5849E2' }
});


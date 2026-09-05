import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, SafeAreaView, StatusBar, TextInput, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // استيراد مكتبة اختيار الصور والكاميرا

// القاموس اللغوي لدعم العربية، الفرنسية، والإنجليزية
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
    language: "اللغة (Language)",
    supportCenter: "مركز الدعم والمساعدة",
    logout: "تسجيل الخروج",
    homeNav: "الرئيسية",
    earnNav: "اربح",
    walletNav: "المحفظة",
    profileNav: "حسابي",
    selectLangTitle: "اختر لغة التطبيق",
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
    language: "Langue (Language)",
    supportCenter: "Centre d'assistance",
    logout: "Se déconnecter",
    homeNav: "Accueil",
    earnNav: "Gagner",
    walletNav: "Portefeuille",
    profileNav: "Profil",
    selectLangTitle: "Choisir la langue de l'application",
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
    language: "Language",
    supportCenter: "Support Center",
    logout: "Log Out",
    homeNav: "Home",
    earnNav: "Earn",
    walletNav: "Wallet",
    profileNav: "Profile",
    selectLangTitle: "Select App Language",
    cancel: "Cancel"
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isSignUp, setIsSignUp] = useState(false);
  const [points, setPoints] = useState(1405);
  const [userEmail, setUserEmail] = useState('');
  
  // حالة اللغة (افتراضياً العربية 'ar')
  const [currentLang, setCurrentLang] = useState('ar');
  const [langModalVisible, setLangModalVisible] = useState(false);

  const t = translations[currentLang]; // كائن النصوص حسب اللغة الحالية

  // إعدادات عجلة الحظ
  const [spinCount, setSpinCount] = useState(0);
  const [userAvatar, setUserAvatar] = useState('👤'); // تخزين الأيموجي أو مسار الصورة المحددة
  const [isCustomImage, setIsCustomImage] = useState(false); // للتحقق هل الصورة مرفوعة أم أيموجي
  const [referralModalVisible, setReferralModalVisible] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [withdrawInput, setWithdrawInput] = useState('');

  const [wheelModalVisible, setWheelModalVisible] = useState(false);
  const [wheelRewardText, setWheelRewardText] = useState('اضغط لتدوير العجلة واكتشاف نصيبك!');
  const [isSpinning, setIsSpinning] = useState(false);
  
  const referralCode = "PAYPOP-8849";
  const emojisList = ['😎', '🦊', '⚡', '🎮', '🦁'];

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
      if (spinCount === 0) {
        reward = 25; 
      } else {
        reward = Math.random() < 0.5 ? 10 : 15;
      }

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

  // دالة طلب الإذن وفتح الكاميرا أو المعرض في الحقيقة
  const handleCameraAction = () => {
    Alert.alert(
      "تغيير صورة الحساب",
      "اختر طريقة تغيير الصورة:",
      [
        { 
          text: "التقاط بالكاميرا", 
          onPress: async () => {
            // طلب إذن الكاميرا
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert("إذن مرفوض", "يجب السماح بالتطبيق باستخدام الكاميرا لتغيير الصورة.");
              return;
            }

            // فتح الكاميرا للتصوير
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled) {
              setUserAvatar(result.assets[0].uri);
              setIsCustomImage(true);
            }
          } 
        },
        { 
          text: "اختيار من المعرض", 
          onPress: async () => {
            // طلب إذن المعرض
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert("إذن مرفوض", "يجب السماح بالتطبيق بالوصول إلى معرض الصور.");
              return;
            }

            // فتح معرض الصور
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled) {
              setUserAvatar(result.assets[0].uri);
              setIsCustomImage(true);
            }
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

  // اتجاه الكتابة حسب اللغة (RTL للعربية، LTR للفرنسية والإنجليزية)
  const isRtl = currentLang === 'ar';
  const textDirectionStyle = { textAlign: isRtl ? 'right' : 'left' };
  const rowDirectionStyle = { flexDirection: isRtl ? 'row-reverse' : 'row' };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#5849E2" barStyle="light-content" />
      
      {currentScreen !== 'splash' && currentScreen !== 'login' && (
        <View style={[styles.header, rowDirectionStyle]}>
          <Text style={styles.logo}>{t.appName}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{points} {t.points} (${(points/1000).toFixed(2)})</Text>
          </View>
        </View>
      )}

      {currentScreen === 'splash' && (
        <View style={styles.splashContainer}>
          <View style={styles.splashCard}>
            <Text style={styles.splashTitle}>{t.appName}</Text>
            <Text style={styles.splashDesc}>{t.splashDesc}</Text>
            
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
          <Text style={styles.subTitle}>
            {isSignUp ? t.signUp : t.login}
          </Text>

          <TextInput 
            style={[styles.input, textDirectionStyle]} 
            placeholder={t.emailPlaceholder} 
            placeholderTextColor="#888"
            onChangeText={setUserEmail}
          />
          <TextInput 
            style={[styles.input, textDirectionStyle]} 
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
            <Text style={styles.switchAuthText}>
              {isSignUp ? t.hasAccount : t.noAccount}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {currentScreen === 'home' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={[styles.cardTitle, textDirectionStyle]}>{t.dashboard}</Text>
            <Text style={styles.pointsText}>{points} {t.points}</Text>
            <Text style={styles.subPoints}>{t.usdValue} ${(points/1000).toFixed(2)} USD</Text>
          </View>

          <View style={[styles.statsRow, rowDirectionStyle]}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>150</Text>
              <Text style={styles.statLabel}>{t.todayEarned}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>{t.invitedFriends}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, textDirectionStyle]}>{t.dailyChallenge}</Text>
            <Text style={[styles.cardDesc, textDirectionStyle]}>{t.dailyDesc}</Text>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#F59E0B'}]} onPress={() => addPoints(50, "هدية التحدي اليومي")}>
              <Text style={styles.btnText}>{t.claimDaily}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'earn' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainCardContainer}>
            <Text style={styles.walletMainTitle}>{t.earnTitle}</Text>
            <Text style={styles.walletSubtitle}>{t.earnSubtitle}</Text>

            <View style={[styles.gridContainer, rowDirectionStyle]}>
              {earnMethods.map((method) => (
                <TouchableOpacity key={method.id} style={styles.gridItemBox} onPress={method.onPress}>
                  <Image source={{ uri: method.icon }} style={styles.gridItemImage} />
                  <Text style={styles.gridItemName}>{method.name}</Text>
                  <Text style={styles.gridItemMin}>{method.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'wallet' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainCardContainer}>
            <Text style={styles.walletMainTitle}>{t.walletTitle}</Text>
            <Text style={styles.walletSubtitle}>{t.walletSubtitle}</Text>

            <View style={[styles.gridContainer, rowDirectionStyle]}>
              {withdrawalMethods.map((method) => (
                <TouchableOpacity 
                  key={method.id}
                  style={styles.gridItemBox}
                  onPress={() => { setSelectedMethod(method); setWithdrawInput(''); }}
                >
                  <Image source={{ uri: method.icon }} style={styles.gridItemImage} />
                  <Text style={styles.gridItemName}>{method.name}</Text>
                  <Text style={styles.gridItemMin}>Min: {method.minPoints}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {currentScreen === 'profile' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileHeaderCard}>
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

            <Text style={styles.profileName}>{userEmail ? userEmail.split('@')[0] : "Youssef Gamer"}</Text>
            <Text style={styles.profileEmail}>{userEmail || "user@paypop.com"}</Text>

            <View style={[styles.emojisRow, rowDirectionStyle]}>
              {emojisList.map((emo, index) => (
                <TouchableOpacity key={index} style={styles.emojiOption} onPress={() => { setUserAvatar(emo); setIsCustomImage(false); }}>
                  <Text style={styles.emojiItem}>{emo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setReferralModalVisible(true)}>
              <Text style={styles.btnText}>Referral System</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, textDirectionStyle]}>{t.profileSettings}</Text>
            
            <TouchableOpacity style={[styles.menuItem, rowDirectionStyle]} onPress={() => Alert.alert("Info", "Coming soon")}>
              <Text style={styles.menuArrow}>{isRtl ? '←' : '→'}</Text>
              <Text style={styles.menuText}>{t.appSettings}</Text>
            </TouchableOpacity>

            {/* زر فتح قائمة اختيار اللغة */}
            <TouchableOpacity style={[styles.menuItem, rowDirectionStyle]} onPress={() => setLangModalVisible(true)}>
              <Text style={styles.menuArrow}>{isRtl ? '←' : '→'}</Text>
              <Text style={styles.menuText}>{t.language} ({currentLang.toUpperCase()})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, rowDirectionStyle]} onPress={() => Alert.alert("Support", "Contact us.")}>
              <Text style={styles.menuArrow}>{isRtl ? '←' : '→'}</Text>
              <Text style={styles.menuText}>{t.supportCenter}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => setCurrentScreen('login')}>
            <Text style={styles.logoutBtnText}>{t.logout}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* نافذة اختيار اللغة */}
      <Modal animationType="slide" transparent={true} visible={langModalVisible} onRequestClose={() => setLangModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.selectLangTitle}</Text>
            
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎡 عجلة الحظ اليومية</Text>
            <View style={styles.wheelBox}>
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
          <View style={styles.modalContent}>
            {selectedMethod && (
              <>
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <Image source={{ uri: selectedMethod.icon }} style={{ width: 50, height: 50, marginBottom: 5 }} />
                  <Text style={styles.modalTitle}>{selectedMethod.name}</Text>
                </View>
                <TextInput style={[styles.modalInput, textDirectionStyle]} placeholder={selectedMethod.inputPlaceholder} placeholderTextColor="#888" keyboardType={selectedMethod.keyboardType} value={withdrawInput} onChangeText={setWithdrawInput} />
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
          <View style={styles.modalContent}>
            <Text style={styles.cardTitle}>دعوة الأصدقاء</Text>
            <Text style={styles.refCode}>{referralCode}</Text>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#10B981', marginTop: 15}]} onPress={() => { Alert.alert("تم", "تم النسخ!"); setReferralModalVisible(false); }}><Text style={styles.btnText}>نسخ الكود</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: '#EF4444', marginTop: 10}]} onPress={() => setReferralModalVisible(false)}><Text style={styles.btnText}>إغلاق</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {currentScreen !== 'splash' && currentScreen !== 'login' && (
        <View style={[styles.bottomNav, rowDirectionStyle]}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('home')}>
            <Text style={[styles.navText, currentScreen === 'home' && styles.activeNav]}>{t.homeNav}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('earn')}>
            <Text style={[styles.navText, currentScreen === 'earn' && styles.activeNav]}>{t.earnNav}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('wallet')}>
            <Text style={[styles.navText, currentScreen === 'wallet' && styles.activeNav]}>{t.walletNav}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('profile')}>
            <Text style={[styles.navText, currentScreen === 'profile' && styles.activeNav]}>{t.profileNav}</Text>
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


import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Defs, G, LinearGradient as SvgGradient, Polygon, Stop, Text as SvgText } from "react-native-svg";

const PRIZES = [10, 15, 25, 50, 100, 150, 200, 250];
const SEGMENT_ANGLE = 360 / PRIZES.length;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIZE = Math.min(350, Math.max(285, SCREEN_WIDTH - 28));
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 22;

const SEGMENT_COLORS = [
  ["#6A4CFF", "#9C55FF"],
  ["#8B38E8", "#D34FFF"],
  ["#3E56F7", "#665CFF"],
  ["#0C8DFF", "#35C6FF"],
  ["#008E83", "#22D5BE"],
  ["#F08B22", "#FFC84A"],
  ["#E24A71", "#FF6D98"],
  ["#5630C7", "#8B4DFF"],
];

function PayPopCoin({ size = 64 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, padding: 3, shadowColor: "#FFD44F", shadowOpacity: 0.55, shadowRadius: 12, elevation: 8 }}>
      <View style={{ flex: 1, borderRadius: size / 2, backgroundColor: "#FFD44F", padding: 3 }}>
        <View style={{ flex: 1, borderRadius: size / 2, backgroundColor: "#6B4CF5", borderWidth: 2, borderColor: "#FFF0A0", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#FFFFFF", fontSize: size * 0.36, fontWeight: "1000", lineHeight: size * 0.38 }}>P</Text>
          <Text style={{ color: "#FFFFFF", fontSize: Math.max(6, size * 0.10), fontWeight: "900", marginTop: -2 }}>PayPop</Text>
        </View>
      </View>
    </View>
  );
}

const Wheel = ({ onReward, onSpinStart, onWin, disabled = false, language = "ar" }) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const labels = language === "ar"
    ? { title: "عجلة الحظ", subtitle: "لف العجلة واربح PayPop", spin: "ابدأ الدوران", wait: "متاحة غداً", win: "مبروك! ربحت", again: "يمكنك الدوران مرة كل 24 ساعة" }
    : language === "fr"
    ? { title: "Roue de la chance", subtitle: "Tournez et gagnez des PayPop", spin: "Lancer la roue", wait: "Disponible demain", win: "Félicitations !", again: "Un tour toutes les 24 heures" }
    : { title: "Lucky Wheel", subtitle: "Spin and win PayPop", spin: "Spin now", wait: "Available tomorrow", win: "Congratulations!", again: "One spin every 24 hours" };

  const spin = () => {
    if (spinning || disabled) return;
    setSpinning(true);
    setResult(null);
    onSpinStart?.();

    const targetIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[targetIndex];
    const targetAngle = targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const extraRounds = 6 + Math.floor(Math.random() * 2);
    const finalRotation = extraRounds * 360 + (360 - targetAngle + 270) % 360;

    Animated.timing(rotation, {
      toValue: finalRotation,
      duration: 5200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setResult(prize);
      setSpinning(false);
      onWin?.();
      onReward?.(prize);
    });
  };

  const points = (index) => {
    const start = (index * SEGMENT_ANGLE - 90) * Math.PI / 180;
    const end = ((index + 1) * SEGMENT_ANGLE - 90) * Math.PI / 180;
    const x1 = CENTER + RADIUS * Math.cos(start);
    const y1 = CENTER + RADIUS * Math.sin(start);
    const x2 = CENTER + RADIUS * Math.cos(end);
    const y2 = CENTER + RADIUS * Math.sin(end);
    return `${CENTER},${CENTER} ${x1},${y1} ${x2},${y2}`;
  };

  const textRadius = RADIUS * 0.67;

  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{labels.title}</Text>
        <Text style={styles.subtitle}>{labels.subtitle}</Text>
      </View>

      <View style={{ width: SIZE + 34, height: SIZE + 34, alignItems: "center", justifyContent: "center" }}>
        <View style={styles.outerGlow} />
        <View style={styles.pointer}>
          <View style={styles.pointerTop} />
          <View style={styles.pointerCore} />
        </View>

        <Animated.View style={{ transform: [{ rotate: rotation.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "360deg"] }) }] }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <Defs>
              {SEGMENT_COLORS.map((c, i) => (
                <SvgGradient key={i} id={`g${i}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={c[0]} />
                  <Stop offset="1" stopColor={c[1]} />
                </SvgGradient>
              ))}
            </Defs>

            <Circle cx={CENTER} cy={CENTER} r={RADIUS + 12} fill="#111426" stroke="#F6C84A" strokeWidth="7" />
            <Circle cx={CENTER} cy={CENTER} r={RADIUS + 6} fill="none" stroke="#FFFFFF" strokeOpacity="0.28" strokeWidth="2" />

            <G>
              {PRIZES.map((prize, index) => {
                const angle = (index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2 - 90) * Math.PI / 180;
                const x = CENTER + textRadius * Math.cos(angle);
                const y = CENTER + textRadius * Math.sin(angle) + 5;
                return (
                  <G key={prize + index}>
                    <Polygon points={points(index)} fill={`url(#g${index})`} stroke="#FFFFFF" strokeOpacity="0.23" strokeWidth="1.5" />
                    <SvgText x={x} y={y} fill="#FFFFFF" fontSize={prize >= 100 ? "18" : "20"} fontWeight="900" textAnchor="middle">{String(prize)}</SvgText>
                  </G>
                );
              })}
            </G>

            <Circle cx={CENTER} cy={CENTER} r={SIZE * 0.155} fill="#F5C94A" />
            <Circle cx={CENTER} cy={CENTER} r={SIZE * 0.135} fill="#684CF2" stroke="#FFF2A1" strokeWidth="2" />
          </Svg>
        </Animated.View>

        <View style={{ position: "absolute", alignItems: "center" }}>
          <PayPopCoin size={SIZE * 0.19} />
        </View>

        <View style={styles.lightRing}>
          {Array.from({ length: 16 }).map((_, i) => (
            <View key={i} style={[styles.lightDot, { transform: [{ rotate: `${i * 22.5}deg` }, { translateY: -(SIZE / 2 - 5) }] }]} />
          ))}
        </View>
      </View>

      {result !== null ? (
        <View style={styles.winCard}>
          <View style={styles.winCoin}><PayPopCoin size={46} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.winTitle}>{labels.win}</Text>
            <Text style={styles.winAmount}>+{result} PayPop</Text>
          </View>
        </View>
      ) : null}

      <Pressable onPress={spin} disabled={spinning || disabled} style={({ pressed }) => [styles.spinButton, { opacity: spinning || disabled ? 0.55 : pressed ? 0.86 : 1 }]}>
        <View style={styles.spinIcon}><Text style={styles.spinIconText}>↻</Text></View>
        <Text style={styles.spinText}>{spinning ? "..." : disabled ? labels.wait : labels.spin}</Text>
      </Pressable>

      <View style={styles.infoPill}>
        <Text style={styles.infoText}>{labels.again}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 8, paddingBottom: 20, backgroundColor: "#070914" },
  titleBlock: { alignItems: "center", marginBottom: 8 },
  title: { color: "#FFFFFF", fontSize: 29, fontWeight: "1000" },
  subtitle: { color: "#9EA5C4", fontSize: 13, marginTop: 4 },
  outerGlow: { position: "absolute", width: SIZE + 8, height: SIZE + 8, borderRadius: (SIZE + 8) / 2, backgroundColor: "rgba(112,80,255,0.10)", shadowColor: "#8C5CFF", shadowOpacity: 0.55, shadowRadius: 30, elevation: 20 },
  pointer: { position: "absolute", top: 0, zIndex: 20, alignItems: "center" },
  pointerTop: { width: 0, height: 0, borderLeftWidth: 15, borderRightWidth: 15, borderTopWidth: 0, borderBottomWidth: 29, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#FFD45B" },
  pointerCore: { width: 16, height: 9, marginTop: -3, borderRadius: 6, backgroundColor: "#FFF0A0" },
  lightRing: { position: "absolute", width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center", pointerEvents: "none" },
  lightDot: { position: "absolute", width: 7, height: 7, borderRadius: 4, backgroundColor: "#FFF3A3", shadowColor: "#FFD34F", shadowOpacity: 0.9, shadowRadius: 7, elevation: 6 },
  winCard: { width: Math.min(340, SCREEN_WIDTH - 42), flexDirection: "row", alignItems: "center", backgroundColor: "#171A2D", borderRadius: 20, borderWidth: 1, borderColor: "#5B4BD6", padding: 12, marginTop: 3, marginBottom: 10 },
  winCoin: { marginRight: 10 },
  winTitle: { color: "#AEB3CC", fontSize: 12, fontWeight: "800" },
  winAmount: { color: "#FFD34F", fontSize: 21, fontWeight: "1000", marginTop: 2 },
  spinButton: { width: Math.min(340, SCREEN_WIDTH - 42), minHeight: 58, borderRadius: 19, backgroundColor: "#6E55F7", flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", shadowColor: "#765BFF", shadowOpacity: 0.4, shadowRadius: 16, elevation: 9, marginTop: 6 },
  spinIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", marginRight: 10 },
  spinIconText: { color: "#FFFFFF", fontSize: 25, fontWeight: "900" },
  spinText: { color: "#FFFFFF", fontSize: 17, fontWeight: "1000" },
  infoPill: { marginTop: 10, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 15, backgroundColor: "#111426", borderWidth: 1, borderColor: "rgba(130,120,200,0.18)" },
  infoText: { color: "#8F96B5", fontSize: 11, fontWeight: "700" },
});

export default Wheel;

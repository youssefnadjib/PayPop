import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';

import Svg, {
  G,
  Path,
  Circle,
  Polygon,
  Text as SvgText,
} from 'react-native-svg';

const AnimatedView = Animated.createAnimatedComponent(View);

const SEGMENTS = [
  { value: 10, color: '#7C3AED' },
  { value: 15, color: '#2563EB' },
  { value: 10, color: '#06B6D4' },
  { value: 25, color: '#F59E0B' },
  { value: 15, color: '#7C3AED' },
  { value: 10, color: '#14B8A6' },
  { value: 25, color: '#EF4444' },
  { value: 15, color: '#3B82F6' },
];

const SIZE = 270;
const CENTER = SIZE / 2;
const RADIUS = 125;

function polarToCartesian(cx, cy, r, angle) {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function describeArc(startAngle, endAngle) {
  const start = polarToCartesian(
    CENTER,
    CENTER,
    RADIUS,
    endAngle
  );

  const end = polarToCartesian(
    CENTER,
    CENTER,
    RADIUS,
    startAngle
  );

  const largeArcFlag =
    endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

export function WheelLogo({ size = 38 }) {
  const logoRadius = size / 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={logoRadius}
          cy={logoRadius}
          r={logoRadius - 2}
          fill="#6D28D9"
          stroke="#FBBF24"
          strokeWidth="2"
        />

        <Circle
          cx={logoRadius}
          cy={logoRadius}
          r={logoRadius * 0.55}
          fill="#2563EB"
        />

        <Circle
          cx={logoRadius}
          cy={logoRadius}
          r={logoRadius * 0.22}
          fill="#FBBF24"
        />

        <Circle
          cx={logoRadius}
          cy={logoRadius}
          r={logoRadius * 0.1}
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
}

export default function Wheel({
  onReward,
  disabled = false,
}) {
  const rotation = useRef(
    new Animated.Value(0)
  ).current;

  const animationRef = useRef(null);
  const currentRotation = useRef(0);

  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState(
    'اضغط على «أدر العجلة» وجرّب حظك 🎡'
  );

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  const getReward = () => {
    const index =
      Math.floor(Math.random() * SEGMENTS.length);

    return SEGMENTS[index].value;
  };

  const finishSpin = () => {
    const reward = getReward();

    setSpinning(false);
    setMessage(`🎉 ربحت ${reward} PPT!`);

    if (onReward) {
      onReward(reward);
    }
  };

  const spin = () => {
    if (spinning || disabled) {
      return;
    }

    setSpinning(true);
    setMessage('العجلة تدور... 🎡');

    const extraRotation =
      360 * 8 +
      Math.floor(Math.random() * 360);

    const nextRotation =
      currentRotation.current + extraRotation;

    currentRotation.current = nextRotation;

    animationRef.current = Animated.timing(
      rotation,
      {
        toValue: nextRotation,
        duration: 5000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }
    );

    animationRef.current.start(({ finished }) => {
      if (finished) {
        finishSpin();
      }
    });
  };

  const stop = () => {
    if (!spinning) {
      return;
    }

    if (animationRef.current) {
      animationRef.current.stop();
    }

    finishSpin();
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  const buttonDisabled =
    spinning === false && disabled;

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🎡 عجلة توكنات الحظ
      </Text>

      <Text style={styles.subtitle}>
        أدر العجلة واكتشف نصيبك من توكنات PayPop
      </Text>

      <View style={styles.wheelArea}>

        {/* السهم الذهبي */}
        <View style={styles.pointerContainer}>
          <Svg width={45} height={55}>
            <Polygon
              points="22,52 5,12 22,20 40,12"
              fill="#FBBF24"
              stroke="#92400E"
              strokeWidth="2"
            />
          </Svg>
        </View>

        {/* العجلة */}
        <AnimatedView
          style={[
            styles.wheel,
            {
              transform: [{ rotate }],
            },
          ]}
        >
          <Svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
          >

            {/* الحافة الذهبية */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 8}
              fill="#FBBF24"
              stroke="#92400E"
              strokeWidth="3"
            />

            {/* الحافة الداخلية */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 3}
              fill="#FDE68A"
            />

            {/* القطع */}
            <G>
              {SEGMENTS.map((segment, index) => {
                const startAngle = index * 45;
                const endAngle = startAngle + 45;

                return (
                  <Path
                    key={index}
                    d={describeArc(
                      startAngle,
                      endAngle
                    )}
                    fill={segment.color}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                );
              })}
            </G>

            {/* أرقام الجوائز */}
            {SEGMENTS.map((segment, index) => {
              const angle =
                index * 45 + 22.5;

              const pos =
                polarToCartesian(
                  CENTER,
                  CENTER,
                  88,
                  angle
                );

              return (
                <G key={`reward-${index}`}>
                  <SvgText
                    x={pos.x}
                    y={pos.y - 3}
                    fill="#FFFFFF"
                    fontSize="21"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {segment.value}
                  </SvgText>

                  <SvgText
                    x={pos.x}
                    y={pos.y + 13}
                    fill="#FDE68A"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    PPT
                  </SvgText>
                </G>
              );
            })}

            {/* نقاط حول الحافة */}
            {[...Array(16)].map((_, index) => {
              const angle = index * 22.5;

              const pos =
                polarToCartesian(
                  CENTER,
                  CENTER,
                  RADIUS + 3,
                  angle
                );

              return (
                <Circle
                  key={`dot-${index}`}
                  cx={pos.x}
                  cy={pos.y}
                  r="3"
                  fill="#FFF7ED"
                />
              );
            })}

            {/* مركز PayPop */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r="40"
              fill="#4C1D95"
              stroke="#FBBF24"
              strokeWidth="5"
            />

            <SvgText
              x={CENTER}
              y={CENTER - 2}
              fill="#FFFFFF"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              PayPop
            </SvgText>

            <SvgText
              x={CENTER}
              y={CENTER + 16}
              fill="#FBBF24"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              PPT
            </SvgText>

          </Svg>
        </AnimatedView>
      </View>

      {/* زر العجلة */}
      <TouchableOpacity
        style={[
          styles.spinButton,
          spinning && styles.stopButton,
          buttonDisabled && styles.disabledButton,
        ]}
        onPress={spinning ? stop : spin}
        disabled={buttonDisabled}
      >
        <Text style={styles.buttonText}>
          {spinning
            ? '⏹ إيقاف العجلة'
            : '🎡 أدر العجلة واكسب PPT'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        {message}
      </Text>

      <Text style={styles.prizes}>
        الجوائز: 10 / 15 / 25 PPT
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B21B6',
    textAlign: 'center',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 15,
  },

  wheelArea: {
    width: SIZE,
    height: SIZE + 45,
    alignItems: 'center',
    justifyContent: 'center',
  },

  wheel: {
    width: SIZE,
    height: SIZE,
  },

  pointerContainer: {
    position: 'absolute',
    top: -2,
    zIndex: 20,
    elevation: 20,
  },

  spinButton: {
    backgroundColor: '#6D28D9',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 14,
    minWidth: '85%',
    alignItems: 'center',
    elevation: 4,
  },

  stopButton: {
    backgroundColor: '#EF4444',
  },

  disabledButton: {
    backgroundColor: '#94A3B8',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  info: {
    marginTop: 10,
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  prizes: {
    marginTop: 5,
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
});

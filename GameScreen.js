// UPDATED VERSION OF GameScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback, Image, PanResponder, Animated } from 'react-native';
import { ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import Bubble from './components/Bubble';
import backgroundImg from './assets/sky.png';
import popSoundFile from './assets/oneSecondBubblePopSound.wav';
import laserSoundFile from './assets/laserGun.wav';
import rainbowGun from './assets/rainbowGun.png';
import Svg, { Line, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
const LASER_LENGTH = screenHeight * 1.5;
const LASER_THICKNESS = 4; //treat laser line as rectangle

export default function GameScreen() {
  const gunWidth = 75;//was 390
  const gunHeight = 300;
  const tipOffset = 149;

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [bubbles, setBubbles] = useState([]);
  const [poppingBubbles, setPoppingBubbles] = useState([]);
  const [laserData, setLaserData] = useState(null);
  const [greenLinePoints, setGreenLinePoints] = useState(null);
  const [scorePopups, setScorePopups] = useState([]);
  const [gunPosition, setGunPosition] = useState({
    x: screenWidth / 2 - gunWidth / 2,
    y: screenHeight - 200,
  });
  const [gunAngle, setGunAngle] = useState(-Math.PI / 2);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        setGunPosition({
          x: gestureState.moveX - gunWidth / 2,
          y: gestureState.moveY - gunHeight / 2,
        });
      },
    })
  ).current;

  const bubbleIdRef = useRef(1);
  const timerRef = useRef(null);
  const bubbleTimerRef = useRef(null);
  const laserTimeoutRef = useRef(null);
  const canFireRef = useRef(true);// to avoid some taps being ignored.

  const handleTap = (event) => {
    if (!gameStarted || gameOver) return;

    const { locationX, locationY } = event.nativeEvent;
    const gunCenterX = gunPosition.x + gunWidth / 2;
    const gunCenterY = gunPosition.y + gunHeight / 2;

    const dx = locationX - gunCenterX;
    const dy = locationY - gunCenterY;

    const angle = Math.atan2(dy, dx);
    const correctedAngle = angle + Math.PI / 2;


    setGunAngle(correctedAngle);

    const tipX = gunCenterX + tipOffset * Math.cos(angle);
    const tipY = gunCenterY + tipOffset * Math.sin(angle);
    fireLaser(tipX, tipY, angle);
    const dirX = tipX -gunCenterX;
    const dirY = tipY - gunCenterY;
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    const unitX = dirX / length;
    const unitY = dirY / length;

    const extendedX = gunCenterX + unitX * (screenHeight * 1.5);
    const extendedY = gunCenterY + unitY * (screenHeight * 1.5);
    setGreenLinePoints({
        x1: gunCenterX,
        y1: gunCenterY,
        x2: extendedX,
        y2: extendedY
    });
    setTimeout(() => setGreenLinePoints(null), 300);


  };

    const fireLaser = (x, y, angle) => {
        if (!canFireRef.current) return;
        canFireRef.current = false;

        if (laserTimeoutRef.current) clearTimeout(laserTimeoutRef.current);

    setLaserData({ x, y, angle });
    playLaserSound();
    checkHits(x, y, angle);

    laserTimeoutRef.current = setTimeout(() => {
        canFireRef.current = true; //re-enable firing.
        }, 300);
  };

const checkHits = (laserX, laserY, laserAngle) => {
  const laserDirX = Math.cos(laserAngle);
  const laserDirY = Math.sin(laserAngle);
  const laserEndX = laserX + laserDirX * LASER_LENGTH;
  const laserEndY = laserY + laserDirY * LASER_LENGTH;

  setBubbles(prevBubbles => {
    const hitBubbleIds = [];
    let hitCount = 0;

    prevBubbles.forEach(bubble => {
      const bubbleCenterX = bubble.x + bubble.radius;
      const bubbleCenterY = bubble.y + bubble.radius;

      // Vector from laser start to bubble center
      const dx = bubbleCenterX - laserX;
      const dy = bubbleCenterY - laserY;

      const beamDX = laserEndX - laserX;
      const beamDY = laserEndY - laserY;
      const beamLenSq = beamDX * beamDX + beamDY * beamDY;

      // Project point onto the beam
      let t = ((dx * beamDX) + (dy * beamDY)) / beamLenSq;
      t = Math.max(0, Math.min(1, t)); // Clamp to segment

      const closestX = laserX + t * beamDX;
      const closestY = laserY + t * beamDY;

      const distX = bubbleCenterX - closestX;
      const distY = bubbleCenterY - closestY;
      const distSq = distX * distX + distY * distY;

      const threshold = (bubble.radius + LASER_THICKNESS / 2 + 2) ** 2;

      if (distSq <= threshold) {
        hitBubbleIds.push(bubble.id);
        hitCount++;
      }
    });

    if (hitCount > 0) {
      playPopSound();
      setScore(prev => prev + hitCount);
      const newPopups = prevBubbles.filter(b => hitBubbleIds.includes(b.id)).map(b => ({ id: b.id, x: b.x, y: b.y }));
      setScorePopups(prev => [...prev, ...newPopups]);
      setTimeout(() => {
        setScorePopups(prev => prev.filter(p => !hitBubbleIds.includes(p.id)));
      }, 500);
    }

    setPoppingBubbles(prev => [...prev, ...hitBubbleIds]);
    return prevBubbles;
  });
};


  const playPopSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(popSoundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) { console.warn('Pop sound failed.'); }
  };

  const playLaserSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(laserSoundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) { console.warn('Laser sound failed.'); }
  };

  const spawnBubble = () => {
    const radius = 30;
    const maxX = screenWidth - (radius * 2);
    const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    const newBubble = {
      id: bubbleIdRef.current++,
      x: Math.random() * maxX,
      y: screenHeight - 100,
      radius,
      color
    };
    setBubbles(prev => [...prev, newBubble]);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
    setGunAngle(0);
    bubbleIdRef.current = 1;
    bubbleTimerRef.current = setInterval(spawnBubble, 500);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(bubbleTimerRef.current);
          setGameOver(true);
          setBubbles([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setGunPosition({
      x: screenWidth / 2 - gunWidth / 2,
      y: screenHeight - 200,
    });
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const moveInterval = setInterval(() => {
      setBubbles(prev => prev.map(b => ({ ...b, y: b.y - 2 })).filter(b => b.y > -60));
    }, 16);
    return () => clearInterval(moveInterval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (bubbleTimerRef.current) clearInterval(bubbleTimerRef.current);
      if (laserTimeoutRef.current) clearTimeout(laserTimeoutRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleTap} disabled={!gameStarted || gameOver}>
        <ImageBackground source={backgroundImg} style={styles.gameArea} resizeMode='cover'>
          <View style={{ flex: 1 }}>
            {bubbles.map(b => (
                <Bubble
                    key={`bubble-${b.id}`}
                    x={b.x}
                    y={b.y}
                    radius={b.radius}
                    color={b.color}
                    isPopping={poppingBubbles.includes(b.id)}
                    onPopComplete={() => {
                        setBubbles(prev => prev.filter(p => p.id !== b.id));
                        setPoppingBubbles(prev => prev.filter(id => id !== b.id));
                    }}
                />
            ))}
            {scorePopups.map(p => (<Text key={`popup-${p.id}-${Math.random()}`} style={{ position: 'absolute', left: p.x + 10, top: p.y - 20, color: 'white', fontSize: 22, fontWeight: 'bold' }}>+1</Text>))}


            {greenLinePoints && (
                <Svg
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: screenWidth,
                        height: screenHeight,
                    }}
                >
                    {/* Define gradient in line */}
                    <Defs>
                        <LinearGradient id ="rainbowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor="#FF0000" />
                            <Stop offset="16%" stopColor="#FF7F00" />
                            <Stop offset="33%" stopColor="#FFFF00" />
                            <Stop offset="50%" stopColor="#00FF00" />
                            <Stop offset="66%" stopColor="#0000FF" />
                            <Stop offset="83%" stopColor="#4B0082" />
                            <Stop offset="100%" stopColor="#8B00FF" />
                        </LinearGradient>
                    </Defs>

                    <Line
                        x1={greenLinePoints.x1}
                        y1={greenLinePoints.y1}
                        x2={greenLinePoints.x2}
                        y2={greenLinePoints.y2}
                        stroke="url(#rainbowGradient)"
                        strokeWidth={4}
                    />
                </Svg>
            )}


            <Animated.Image
              {...panResponder.panHandlers}
              source={rainbowGun}
              style={[styles.gunImage, {
                left: gunPosition.x,
                top: gunPosition.y,
                transform: [{ rotate: `${gunAngle}rad` }],
              }]} />
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>

      <View style={styles.hudContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.scoreText}>Time: {timeLeft}s</Text>
      </View>

      {!gameStarted && !gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.title}>Bubble Popper</Text>
          <Image source={require('./assets/rainbowCloudScreen.png')} style={styles.rainbow} resizeMode="contain" />
          <TouchableWithoutFeedback onPress={startGame}>
            <View style={styles.button}><Text style={styles.buttonText}>Start Game</Text></View>
          </TouchableWithoutFeedback>
        </View>
      )}

      {gameOver && (
        <View style={styles.overlay}>
          <Image source={require('./assets/rainbowCloudScreen.png')} style={styles.rainbow} resizeMode="contain" />
          <Text style={styles.title}>Game Over</Text>
          <Text style={[styles.scoreText, { marginBottom: 17 }]}>Final Score: {score}</Text>
          <TouchableWithoutFeedback onPress={startGame}>
            <View style={styles.button}><Text style={styles.buttonText}>Play Again</Text></View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000033' },
  gameArea: { flex: 1, width: '100%', height: '100%' },
  hudContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  scoreText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 280, zIndex: 100
  },
  title: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  rainbow: { width: 120, height: 120, marginVertical: 20 },
  button: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  gunImage: { position: 'absolute', bottom: 0, width: 75, height: 300, resizeMode: 'contain', zIndex: 50 }
});

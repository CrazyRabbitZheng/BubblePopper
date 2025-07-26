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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const rainbowColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
const LASER_LENGTH = screenHeight * 1.5;

export default function GameScreen() {
  const gunWidth = 75;//was 390
  const gunHeight = 300;
  const tipOffset = 149;

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bubbles, setBubbles] = useState([]);
  const [laserVisible, setLaserVisible] = useState(false);
  const [laserData, setLaserData] = useState(null);
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
    fireLaser(tipX, tipY, correctedAngle);
  };

  const fireLaser = (x, y, angle) => {
    if (!canFireRef.current) return;
    canFireRef.current = false;

    if (laserTimeoutRef.current) clearTimeout(laserTimeoutRef.current);

    setLaserData({ x, y, angle });
    setLaserVisible(true);
    playLaserSound();
    checkHits(x, y, angle);

    laserTimeoutRef.current = setTimeout(() => {
        setLaserVisible(false);
        canFireRef.current = true; //re-enable firing.
        }, 300);
  };

  const checkHits = (laserX, laserY, laserAngle) => {
    const laserDirX = Math.cos(laserAngle);
    const laserDirY = Math.sin(laserAngle);
    setBubbles(prevBubbles => {
      const hitBubbleIds = [];
      let hitCount = 0;
      prevBubbles.forEach(bubble => {
        const bubbleCenterX = bubble.x + bubble.radius;
        const bubbleCenterY = bubble.y + bubble.radius;
        const dx = bubbleCenterX - laserX;
        const dy = bubbleCenterY - laserY;
        const dot = dx * laserDirX + dy * laserDirY;
        const closestX = laserX + laserDirX * dot;
        const closestY = laserY + laserDirY * dot;
        const distSquared = (bubbleCenterX - closestX) ** 2 + (bubbleCenterY - closestY) ** 2;
        if (distSquared <= bubble.radius ** 2) {
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
      return prevBubbles.filter(b => !hitBubbleIds.includes(b.id));
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
    setTimeLeft(30);
    setBubbles([]);
    setLaserVisible(false);
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
            {bubbles.map(b => (<Bubble key={`bubble-${b.id}`} x={b.x} y={b.y} radius={b.radius} color={b.color} />))}
            {scorePopups.map(p => (<Text key={`popup-${p.id}`} style={{ position: 'absolute', left: p.x + 10, top: p.y - 20, color: 'white', fontSize: 22, fontWeight: 'bold' }}>+1</Text>))}

            {laserVisible && laserData && (
              <View style={{
                position: 'absolute',
                width: 4,
                height: LASER_LENGTH,
                backgroundColor: 'red',
                left: laserData.x - 2,
                top: laserData.y - LASER_LENGTH,
                transform: [
                  { translateY: LASER_LENGTH / 2 },
                  { rotate: `${laserData.angle}rad` },
                  { translateY: -LASER_LENGTH / 2 }
                ],
                zIndex: 99
              }}/>
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

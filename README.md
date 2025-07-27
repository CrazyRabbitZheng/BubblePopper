# Zheng's modification
1. Added customized background image.
2. Changed bubble colors to rainbow
3. Cleared all bubbles when Game Over.
4. Refined the game -- when game was over, it displayed 'GAME OVER' and a button labels 'Play Again',
   However, when I clicked the 'Play Again', it displayed 'Start Game'. 
   What I expected is  when click 'Play Again', it immediately restarts the game. I don't double clicking to re-play. 
   Fixed this.
5. Added sound effects. Installed expo-av API to add sound effects.
   Added .wav file to assets for single bubble pop. 
   Added .wav file to assets for laser gun shot.
6. Added text '+1' when hit a bubble. Added scorePopups state in GameScreen.js
7. Changed login icon.
8. Added theme image -- rainbow, to the start screen and game over screen.
9. Added gun image.
10. Made the gun draggable to any position.
11. Made the gun rotating to aim the tap point and fire laser in that direction.
    The gun auto-aim at the position you tap. 
12. Added canFireRef to avoid multiple taps being ignored.
    Resized the gun image so that you can only drag the gun when you actually touch it.
    The image was too wide that when you tap the left empty space of the gun, it mistakenly dragged the gun.-- Fixed.
13. Added bubble popping animation. when bubble gets hit, it scale up, and then scale down, and gone.
14. Improved Collision Detection
    Fixed the logic so that bubbles only pop if the laser beam truly intersects them.
    - Updated checkHits() function
    - Laser is treated as a line segment with thickness
    - For each bubble:
        - Calculate perpendicular projection onto the laser beam.
        - Clamp the projection to laser segment.
        - Measure the shortest distance from bubble center to the beam.
        - If within (radius + beam half-width), pops the bubble.
15. To make gun beam displays the way it should be, not render red laser beam.
    Instead, added a Svg Line component.
16. import Svg, { Line, Defs, LinearGradient, Stop} from 'react-native-svg'
    Made the gun beam displays 7 colors totally when you drag the gun to shot from different angle.
17. Changed timer from 120s to 60s for easy outcome.
18. Changed TouchableWithoutFeedback to Pressable. 
    This ensures gun fires immediately when tapping. 
    Removed laser cool down to smooth the game experience.
19. Issue with angle interpolation and rotation discontinuity 
    — especially when working with angles in radians, 
    where: 0 radians and 2π radians (≈ 6.28) represent the same angle (0° and 360°),
    But React Native’s transform rotate system doesn’t handle that wrapping smoothly 
    — so when the angle crosses from just below π to just above -π, the gun appears to "flip" suddenly.

    More clearly speaking, when tapping around the gun in a circular pattern.
    The gun rotates incrementally as expected.
    But once near the 360° mark (or crossing the ±π boundary), it flips due to how the angle is handled.
    
    SOLUTION*******
    Align the gun along the line from gun center to tap, 
    and place the gun so that its tip lies somewhere between the center and tap point 
    — not on the extended line beyond.
    This is a geometry-based approach that avoids angle math entirely.
    Let’s say: Point A = gun center, Point B = tap point. 
    The gun aligned A → B, with the tip landing inside AB.
    GUN CENTER ----> GUN TIP ----> TAP POINT
    When tapping, the gun center is fixed.
    Fixed tapping miss bug.
    There was a segment rendering issue. I thought it was math, actually it was render sequence. and check null issue.
20. 









# Bubble Popper Game

A React Native mobile game built with Expo CLI for CP4282 Programming for Mobile Devices.

## Game Description

Bubble Popper is a simple one-screen mobile game where:
- Bubbles rise from the bottom of the screen every 0.5 seconds
- Players tap anywhere to shoot a rainbow colored laser
- Lasers pop bubbles for points (+1 point per bubble)
- Game lasts for 60 seconds
- Final score is displayed with a "Play Again" option

## ✅ Features Implemented

1. **Bubble Spawner**: Spawns a bubble every 0.5s at the bottom with a random horizontal position and rainbow color.
2. **Bubble Motion**: Each bubble moves straight upward until it exits the screen or gets popped.
3. **Laser Shot**: On tap, fires a rainbow laser beam from the gun tip in the direction of the tap for 0.3s.
4. **Hit Detection**: If the laser intersects a bubble, the bubble animates a pop and +1 point is awarded.
5. **Score Display**: Shows `Score: N` in the top-left corner with animated +1 score popups.
6. **Countdown Timer**: Starts at 60s. When it reaches 0, the game ends, and the final score with a **Play Again** button is shown.
7. **Gun Control**: Gun is fully draggable and rotates to face the tap location before firing.
8. **Sound Effects**: Bubble pop and laser firing play sound effects.

## ✅ Tech Stack

- **Runtime**: Expo CLI
- **Language**: JavaScript (ES6+, `.js` files)
- **Framework**: React Native
- **Animation**: React Native Animated API (`Animated.View`)
- **Input Handling**: `TouchableWithoutFeedback`, `PanResponder`
- **Rendering**: `Svg`, `LinearGradient`, `Defs`, `Line` (from `react-native-svg`)
- **Audio**: `expo-av` for laser and pop sound effects
- **Image Rendering**: `Image`, `ImageBackground`, and `Animated.Image`

## File Structure

```
BubblePopper/
├── App.js                 # Main app component that registers GameScreen
├── GameScreen.js          # Game logic & hooks
├── components/
│   └──  Bubble.js         # Circle view component
│
├── package.json
└── README.md
```

##  ✅ How to Play

1. Tap **"Start Game"** to begin.
2. Use your finger to **drag and position the rainbow gun** anywhere on the screen.
3. Tap anywhere to **aim and shoot a rainbow laser** toward that direction.
4. Bubbles will **spawn from the bottom** and float upward every 0.5 seconds.
5. **Hit bubbles** with your laser to pop them and **earn +1 point** each.
6. The game runs for **60 seconds** — try to score as high as possible! (The highest score players hit was 💕 80.)
7. When time runs out, your **final score** is shown with a **"Play Again"** button.


## Game Controls

- **Drag the gun**: Move the gun freely around the screen
- **Tap anywhere**: Auto-aim and fire a rainbow laser in the tap direction
- **Start Game button**: Begin new game
- **Play Again button**: Restart after game over

## Scoring

- Each bubble popped = +1 point
- Game duration = 60 seconds
- Goal: Get the highest score possible!

## 🛠 Development Notes

- Uses React hooks (`useState`, `useEffect`, `useRef`) for state, timers, and animation control.
- Implements game loops with `setInterval` for bubble spawning and countdown timer.
- Uses `PanResponder` for drag-based input and `TouchableWithoutFeedback` for tap-to-fire.
- Collision detection uses **vector projection** from the laser line to each bubble's center.
- Bubble popping is animated with `Animated.View` (scale and fade).
- Responsive layout adapts to different screen sizes using `Dimensions.get('window')`.
- Laser beam uses `react-native-svg` with a **rainbow gradient line**.
- Audio effects are implemented using the `expo-av` package.


## Project Requirements Met

✅ Individual project using React Native  
✅ Pure JavaScript implementation (no TypeScript)  
✅ All 6 required features implemented  
✅ Runs on Android Emulator without crashes  
✅ Clean, readable code structure  
✅ Follows suggested file organization  

## Developer

Zheng Wang  - CNA Software Development Student

Created for CP4282 Programming for Mobile Devices - Spring 2025
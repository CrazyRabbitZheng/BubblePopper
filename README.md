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
12. Added canFireRef to avoid multiple taps being ignored.
    Resized the gun image so that you can only drag the gun when you actually touch it. 
    The image was too wide that when you tap the left empty space of the gun, it mistakenly dragged the gun. Fixed.
13. Added bubble popping animation. when bubble gets hit, it scale up, and then scale down, and gone.
14. Fix the collision -- only pop a bubble if the laser beam actually intersects the bubble.
    I changed logic to checkhits -- treat laser beam as a line with thickness. 
    Check if each bubble intersects the line rectangle.
15. To make gun beam displays the way it should be, not render red laser beam.
    Instead, added a Svg Line component.
16. import Svg, { Line, Defs, LinearGradient, Stop} from 'react-native-svg'
    Made the gun beam displays 7 colors totally when you drag the gun to shot from different angle.

changed timer from 120s to 30s for easy outcome.
changed useState(120), in startGame(), both changed setTimeLeft(120) to 30s.








# Bubble Popper Game

A React Native mobile game built with Expo CLI for CP4282 Programming for Mobile Devices.

## Game Description

Bubble Popper is a simple one-screen mobile game where:
- Bubbles rise from the bottom of the screen every 0.5 seconds
- Players tap anywhere to shoot a vertical red laser
- Lasers pop bubbles for points (+1 point per bubble)
- Game lasts for 120 seconds
- Final score is displayed with a "Play Again" option

## Features Implemented

1. **Bubble Spawner**: Creates a circle every 0.5s at bottom with random x position
2. **Bubble Motion**: Moves each bubble straight upward until it leaves the top
3. **Laser Shot**: On any tap, draws a vertical red line from bottom that lasts 0.3s
4. **Hit Test**: If laser crosses a bubble, removes bubble and adds +1 point
5. **Score Label**: Shows "Score: N" in the top-left corner
6. **Countdown Timer**: Starts at 120s, when it hits 0, freezes play and shows Game Over with final score and Play Again button

## Tech Stack

- **Runtime**: Expo CLI
- **Language**: Pure JavaScript (.js files)
- **Framework**: React Native
- **Animation**: Built-in Animated API
- **Input**: Built-in Pressable component

## File Structure

```
BubblePopper/
├── App.js                 # Main app component that registers GameScreen
├── GameScreen.js          # Game logic & hooks
├── components/
│   ├── Bubble.js         # Circle view component
│   └── Laser.js          # Temporary vertical line component
├── package.json
└── README.md
```

## Installation & Setup

1. Make sure you have Node.js installed
2. Install Expo CLI globally (if not already installed):
   ```bash
   npm install -g @expo/cli
   ```
3. Navigate to the project directory:
   ```bash
   cd BubblePopper
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

## Running the Game

### On Android Emulator/Device
```bash
npm run android
```

### On iOS Simulator/Device (macOS only)
```bash
npm run ios
```

### On Web Browser
```bash
npm run web
```

### General Start (shows QR code for Expo Go app)
```bash
npm start
```

## How to Play

1. Tap "Start Game" to begin
2. Bubbles will start spawning from the bottom and floating upward
3. Tap anywhere on the screen to shoot a red laser vertically
4. Try to hit as many bubbles as possible within 120 seconds
5. Each bubble hit gives you +1 point
6. When time runs out, your final score is displayed
7. Tap "Play Again" to restart

## Game Controls

- **Tap anywhere**: Shoot laser
- **Start Game button**: Begin new game
- **Play Again button**: Restart after game over

## Scoring

- Each bubble popped = +1 point
- Game duration = 120 seconds
- Goal: Get the highest score possible!

## Development Notes

- Uses React hooks (useState, useEffect, useRef) for state management
- Implements game loops using setInterval for bubble spawning and animation
- Uses Pressable component for touch input handling
- Collision detection between laser and bubbles using distance calculation
- Responsive design that adapts to different screen sizes

## Project Requirements Met

✅ Individual project using React Native  
✅ Pure JavaScript implementation (no TypeScript)  
✅ All 6 required features implemented  
✅ Runs on Android Emulator without crashes  
✅ Clean, readable code structure  
✅ Follows suggested file organization  

## Author

Created for CP4282 Programming for Mobile Devices - Spring 2025

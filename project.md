# Bubble Popper Game 

## Overview

This project builds on a basic implementation of the Bubble Popper game built with React Native and Expo.

## Code Architecture

``` 
                       +------------------------------+
                       |        GameScreen.js         |
                       |     (Main Game Component)    |
                       +--------------+---------------+
                                      |
            +-------------------------+---------------------------+
            |                         |                           |
         States                    Functions                   Rendering
    +----------------+      +------------------------+    +-------------------------+
    | gameStarted    |      | handleTap()            |    | - Game Area             |
    | gameOver       |      | fireLaser()            |    | - <Bubble /> instances  |
    | score          |      | checkHits()            |    | - Laser Beam (SVG)      |
    | timeLeft       |      | playLaserSound()       |    | - Gun (Animated.Image)  |
    | bubbles        |      | playPopSound()         |    | - Score Popups (+1)     |
    | poppingBubbles |      | spawnBubble()          |    | - HUD (Score/Timer)     |
    | laserData      |      | startGame()            |    | - Start / End Screens   |
    | greenLinePoints|      | resetGame() (optional) |    +-------------------------+
    | scorePopups    |      +------------------------+
    | gunPosition    |
    | gunAngle       |
    +----------------+

                     | 
                     | renders
                     V
            +--------------------------+
            |        Bubble.js         |
            |   (Bubble Component)     |
            +--------------------------+
            | - Props: x, y, radius    |
            |          color, isPopping|
            |          onPopComplete   |
            | - Animated pop effect    |
            | - Shadow & scale effects |
            +--------------------------+


```

#### Task 1: Implement Movable Gun State ✅
- Add state variables to track the gun's position (both X and Y coordinates)
- Ensure the gun stays within the screen boundaries

#### Task 2: Implement Gun Movement Control ✅
- Create functions to handle touch or drag events for moving the gun
- Update the gun position based on user input
- Add visual feedback to show the gun is being controlled

#### Task 3: Enhance Laser Firing Mechanism ✅
- Modify the laser to fire from the current gun position instead of a fixed point
- Consider implementing directional firing (angles)
- Add visual or sound effects to make firing more engaging

#### Task 4: Improve Collision Detection ✅
- Update the collision detection logic to consider both X and Y coordinates
- Account for the gun position and potential firing angle
- Consider implementing smarter targeting or auto-aim features

#### Task 5: Enhance Laser Rendering ✅ (Add Svg Line instead, applied lineColorGradient)
- Update the laser visual to properly align with the gun position and angle
- Improve laser visuals with effects like color gradients or particle effects
- No cool down for firing. ✨

#### Task 6: Enhance Gun Rendering ✅
- Update the gun rendering to reflect its current position
- Add visual indication of the gun's firing direction
- Implement controls or touch areas for intuitive gun movement

#### Task 7: Improve Game Styling ✅
- Enhance laser effects and animations
- Add visual elements (popping animation) for controls or power-ups

## Data Flow

```
User Input → Gun Position  →  Laser Firing   →   Collision Detection    →   Score Update
                   ↓                ↓                     ↓                      ↓
             Gun Rendering    Laser Rendering    Bubble Popping Animation    HUD Update
```

## Component Interaction

```
+----------------+    renders    +----------------+
|                |-------------->|                |
|   GameScreen   |               |     Bubble     |
|                |<--------------|                |
+----------------+   position    +----------------+
      |      ^        updates
      |      |
      v      |
+----------------+
|                |
|  User Input    |
|  & Game State  |
|                |
+----------------+
```

## Assessment Criteria

This implementation will be assessed based on:

1. **Functionality**: Does the gun move correctly and respond to user input? ✅
2. **Code Quality**: Is your code well-structured, commented, and efficient? ✅
3. **User Experience**: Is the game intuitive to play and visually appealing?✅
4. **Creativity**: Have you added unique features or enhancements beyond the basic requirements?✅(See README.md -- 17 changes applied.)
5. **Performance**: Does the game run smoothly without performance issues?   ✅


## Submission

Submit your completed project by:
1. Pushing your code to your Git repository      ✅
2. Recording a 5-minute video explaining your implementation ✅
3. Be prepared to demonstrate your game in class ✅

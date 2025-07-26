/**
 * Bubble Component
 * 
 * Renders a circular bubble for the Bubble Popper game.
 * Each bubble has a position (x, y) and size (radius). radius = 30
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

/**
 * Bubble component for the Bubble Popper game
 * 
 * @param {Object} props - Component properties
 * @param {number} props.x - X coordinate of the bubble
 * @param {number} props.y - Y coordinate of the bubble
 * @param {number} props.radius - Radius of the bubble
 * @returns {React.Component} Rendered bubble
 */
 //I added a color prop so that each bubble has a different color, like the rainbow!
export default function Bubble({ x, y, radius, color, isPopping, onPopComplete }) {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isPopping) {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1.5,
                        duration: 200,//scale up
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                requestAnimationFrame(() => {
                    onPopComplete?.();
                })
            });
        }
    }, [isPopping]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          left: x,
          top: y,
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          backgroundColor: color,
          opacity: opacity,
          transform: [{ scale: scale}],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

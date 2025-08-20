# 🎯 Spot It! 

A fun, interactive web-based version of the classic Spot It! matching card game.

## 🃏 Game Logic

The game uses the mathematical principles of Spot It! where:
- Each card contains 8 symbols
- Any two cards share exactly one symbol (and no more!)
- The game generates 57 unique cards using combinatorial mathematics

## 🎮 Play

1. **Start the Game**: Click the "Start Game" button to begin
2. **Click Matching Symbols**: Click on matching symbols between the two cards (there will always be one)
3. **Strategic Timing**: The faster you find matches, the more points you earn 
4. **Avoid Wrong Clicks**: Clicking on empty areas or wrong symbols will cost you points
5. **Beat the Clock**: You have 60 seconds to find as many matches as possible!

## 🏆 Score Points

- **Correct Match**: Earn 5 × (time remaining) points
  - Example: If you have 45 seconds left, you get 5*45 = 225 points!
- **Wrong Click**: Lose 150 points
- **Strategy**: The sooner you find the match, the more points you win!

## ✨ Game Features

- **Clickable Symbols**: Each individual symbol on the cards is clickable
- **Visual Feedback**: Clicked symbols are highlighted with colors
- **Smart Matching**: Only matching symbols between both cards count
- **Beautiful Design**: Colorful, kid-friendly interface with smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Score Tracking**: Real-time score display with point messages
- **Timer**: 60-second countdown timer
- **Game Over Screen**: Shows final score with option to play again

## 🚀 Run the App

1. **Open the Game**: Simply open `index.html` in any modern web browser
2. **No Installation Required**: This is a pure HTML/CSS/JavaScript application
3. **Works Offline**: Once downloaded, the game works without an internet connection

## 💡 Gameplay Tips

- **Look for Patterns**: Scan both cards quickly for matching colors or shapes
- **Click Strategically**: Only click symbols you're confident match
- **Speed Matters**: Earlier matches earn more points
- **Avoid Random Clicks**: Wrong clicks cost significant points - high risk, high reward!
- **Practice Regularly**: Improve your pattern recognition skills by playing often

## 🎨 Customization

You can easily customize the game by:
- Changing symbols in the `symbolList` array in `script.js`
- Modifying colors and styling in `styles.css`
- Adjusting game duration by changing the `timeLeft` value
- Adding new game modes or features

Enjoy playing Spot It, a game that you get better at the more you play! 🎯✨
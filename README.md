# Toxic Ex Avoider

A retro-style Flappy Bird inspired game where you avoid responding to toxic ex messages. Navigate through the barrage of manipulative texts without giving in to the temptation to reply!

## Game Concept

In this game, you control a character (represented as a yellow square) that must avoid colliding with toxic text messages from an ex-partner. The gameplay is similar to Flappy Bird - you tap or press spacebar to make your character "jump" and navigate through gaps between the messages.

## How to Play

1. Click the **START GAME** button or press **SPACE** to begin
2. Press **SPACE** or **click/tap** to make your character jump
3. Navigate through the gaps between toxic messages
4. Each message you successfully avoid increases your score
5. If you collide with a message, the game ends
6. Press **R** or click **RESTART** to play again

## Features

- Retro pixelated graphics with CRT monitor effect
- Toxic ex messages that try to manipulate you into responding
- High score tracking using localStorage
- Responsive design that works on both desktop and mobile devices
- Simple one-button controls (spacebar/click/tap)

## Technical Details

This is a simple JavaScript game that runs directly in the browser. It uses HTML5 Canvas for rendering and has no external dependencies beyond the base libraries included in the package.json file.

### File Structure

- `index.html` - Main HTML file with game UI and styling
- `game.js` - Core game logic and mechanics
- `netlify.toml` - Configuration for Netlify deployment
- `my data.xlsx` - Data file (possibly for game analytics or content)

### Game Mechanics

- Gravity pulls your character down continuously
- Jumping provides upward momentum to navigate through gaps
- Toxic messages move from right to left at a constant speed
- Score increases for each message successfully avoided
- Collision with any message ends the game
- High scores are saved in browser localStorage

## Development

To run the game locally:

1. Simply open `index.html` in your browser
2. Or use a local server like the `live-server` dependency:
   ```bash
   npx live-server
   ```

No build process is required as this is a pure client-side JavaScript application.

## Message Examples

The game includes various toxic messages such as:
- "We need to talk"
- "Where have you been?"
- "Why won't you answer my texts?"
- "I know you're online"
- "You owe me an explanation"
- "Everyone says you've changed"
- "Are you seeing someone else?"

These messages are designed to represent common manipulative tactics used by toxic ex-partners.

## Contributing

Feel free to fork this repository and submit pull requests. Possible improvements include:
- Adding more toxic message examples
- Implementing different difficulty levels
- Adding sound effects
- Improving the visual design
- Adding more game mechanics


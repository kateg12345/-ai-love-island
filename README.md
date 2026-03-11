# 30 Days on Love Island - Interactive Prototype

## 🎮 Game Overview

A social strategy game where you have 30 days to find love in a dynamic city filled with autonomous NPCs who pursue their own romantic goals.

### Core Innovation
Victory isn't about finding the "most attractive partner" - it's about achieving the **biggest romantic upset** (Partner Value - Your Value).

## 🕹️ How to Play

### Time System
- **5 minutes = 1 day** (real-time)
- Game runs for 30 days total (2.5 hours real-time)
- Time flows automatically - no turns

### Actions
- **Meet NPC**: Click on any NPC to select them
- **Invite Date**: Ask an NPC out (can be rejected based on social value gap)
- **Maintain Relationship**: Build your relationship progress (need 70+ to become a couple)

### NPC Behavior
- NPCs autonomously pursue relationships with each other
- They will date, reject, breakup, and couple up
- You're competing against other NPCs for attention

### Victory Condition
```
Final Score = Partner's Social Value - Your Social Value
```

**Examples:**
- You (70) + Partner (90) = **+20 points** (good upset!)
- You (70) + Partner (50) = **-20 points** (dated down)
- You (70) + Partner (110) = **+40 points** (amazing upset!)

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm run export
```

The static site will be in the `out/` directory.

## 🎨 Design Features

### Pixel Art Style
- Press Start 2P font (retro gaming aesthetic)
- Vibrant gradient background
- Clean, minimal UI
- Clear visual feedback for NPC status

### Visual Indicators
- 💔 Single
- 💕 Dating
- 💍 Coupled
- Yellow border = Selected NPC
- Pink border = Coupled NPC
- Orange border = Dating NPC

## 📊 Game Mechanics

### Social Value (Hidden)
Each NPC has a hidden social value (40-110) based on their profession:
- **High Value (90-110)**: CEO, Artist, Engineer
- **Mid Value (60-85)**: Lawyer, Photographer, Doctor
- **Low Value (40-55)**: Barista, Retail Worker, Poet

Players start with a value of 70.

### Compatibility Algorithm
```javascript
acceptance_probability = exp(-value_gap / 15)
```

- Small gap (10-20): ~50% chance
- Medium gap (30-40): ~15% chance
- Large gap (50+): <5% chance

### Relationship Progress
- Start: 20% (when dating begins)
- Coupled: 70%+ (become official couple)
- Each "Maintain Relationship" action: +10%

## 🎯 MVP Features

✅ **Implemented:**
- Real-time clock (5 min = 1 day)
- 12 autonomous NPCs
- Player actions (meet, invite, maintain)
- NPC autonomous behavior (invite, accept/reject, breakup)
- Relationship status visualization
- Event log
- Day 30 results screen
- Hidden value reveal
- Leaderboard scoring

## 🔮 Future Enhancements

**Phase 2:**
- Gossip system (learn about relationships at parties)
- Triangle visualizations
- Multiple "eras" (changing social preferences)
- Save/load game

**Phase 3:**
- Multiplayer mode
- Custom NPC creation
- Streaming tools
- Mobile native version

## 📝 Technical Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS (pixel art theme)
- **Deployment**: GitHub Pages

## 🎨 Vibe Coding Principles

This prototype was built using **vibe coding** techniques:
- Iterative development (build → test → refine)
- Functional prototype in <2 hours
- Focus on core gameplay loop
- Pixel art for fast visual iteration

## 📚 Design Principles

### From `design-systems` skill:
- **Consistent pixel aesthetic** (Press Start 2P font everywhere)
- **Clear visual hierarchy** (status bar → game area → events)
- **Self-teaching UI** (obvious what each button does)

### From `behavioral-product-design` skill:
- **Loss aversion**: Investing time in a relationship makes switching feel costly
- **Hidden information**: Players must infer social values through observation
- **Risk/reward tension**: Safe partner vs. prestigious partner

## 🐛 Known Issues

- [ ] No pause button (time always flows)
- [ ] No save/load
- [ ] NPC dating logic could be more sophisticated
- [ ] Mobile responsiveness could be improved

## 📄 License

This is a prototype for demonstration purposes.

---

**Built with ❤️ using AI-assisted vibe coding**

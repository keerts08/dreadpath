# Dreadpath

A short, atmospheric 2D horror game built for the browser. You wake up on the floor on a Manor called Ravenshade with no memory of how you got there. Something else lives here too and it hunts you by the sound you make.

Built with Next.js, Typescript and the Web Audio API

[Play it](https://dreadpath.netlify.app)

### what it actually does:
- top-down 2d house, ten rooms, real collision so furniture actually blocks you.
- darkness - you can only see sm radius around you, rest of the room is black
- an entity that reacts to sound and light, not a fixed patrol path. 
- hiding spots, but the entity can still find you if you push you luck.

### controls:
- `WASD`/arrows to move
- hold `shift` to run (makes more sound tho)
- `E` to interact/hide
- `Esc` to pause

### running it
to clone the repo and run it on ur local device run the following commands:
```bash
git clone https://github.com/keerts08/dreadpath
npm i
npm run dev
```
then go to localhost:3000

### layout

`app/` - the menu, the actual game page
`components/` - the canvas, hud, inventory, dialogs, jumpscare, ending-screen etc.
`game/` - store, entity logic, room data, map data, physics, audio

### note
- globals.css the colors were given by ai
- components/bg.tsx copied from another repo..
- components/home-layout: imgs copied from another repo.
- narrative.ts ai made better lines
- body in ending screen ai gen
- svg for jumpscare ai gen
- used ai to make half to the house
- used ai to make the test page (deleted)
- used ai to draw entity, hotspots (partially) and player
- used ai for full furniture art 
- used ai to add sm comp in /play
- used ai for the audio generating
- used ai for final bug finding

made by keerthi
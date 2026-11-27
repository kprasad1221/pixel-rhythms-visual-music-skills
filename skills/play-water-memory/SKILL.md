---
name: play-water-memory
description: Recreate the first Pixel Rhythms Memory Basin interaction in Three.js and Web Audio. Use when a surface tap should sound a pitched pluck, send a traveling ridge through an inlay, and leave a slowly drifting wet trace.
---

# Play water memory

Tap once and let the basin settle. The bright ridge leaves the contact point while a softer stain holds its location. The note has a similar shape in time. Its high partials die away first, leaving a quieter fundamental while the water continues to move.

## Give one tap to both systems

Copy [the reference module](scripts/water-tap.mjs) into your sketch. It contains the original water solver, fixed clock, water shaders and tap synthesis from Memory Basin v1 (source revision `f9433f59b3b4ccbdd29417f946c9e9dd72d28e68`). Supply your own inlay image and geometry.

Raycast the pointer onto the water. Express local X and Z in units of the water radius, with the center at zero. Create the audio context and master gain on the first user gesture, connect the master to the destination once, and start with gain 0.73. Reuse both across taps.

```js
import { WaterField, FixedClock, pluck } from './scripts/water-tap.mjs';

const field = new WaterField();
const clock = new FixedClock();

async function tap(ctx, master, x, z, strength = 0.84) {
  if (Math.hypot(x, z) > 1) return;
  if (ctx.state === 'suspended') await ctx.resume();
  pluck(ctx, master, x, z, strength);
  field.deposit(x, z, strength, strength > 0.65 ? 0.075 : 0.045);
}

const texture = new THREE.DataTexture(field.bytes, field.size, field.size,
  THREE.RGBAFormat, THREE.UnsignedByteType);
texture.minFilter = texture.magFilter = THREE.LinearFilter;
texture.needsUpdate = true;

function updateWater(elapsedSecondsSinceLastFrame) {
  clock.update(elapsedSecondsSinceLastFrame, () => field.advance());
  field.encode();
  texture.needsUpdate = true;
}
```

## Let the inlay carry the motion

The 112 × 112 field advances at 60 fixed steps per second. Red stores the signed wave height around byte 128. Green stores the fresh wet front. Blue holds residue that moves with a gentle tangential flow, diffuses, and fades with a 2.8-second half-life. Each passing front can deposit more residue. This particular interaction takes a gesture as input.

Sample the texture at `localXZ / waterRadius * 0.5 + 0.5`. The supplied vertex shader expects an XZ disk of radius 0.956 with interior vertices. For use with an existing material, borrow the fragment shader’s central differences and refracted inlay lookup first. Set `uTexel` to `1 / field.size` and `uMemory` to 1. Slope bends the image and catches the side light. Residue colors the underlying image as the crest passes. For the full shaders also supply the inlay, accent and gold colors, shape parameters, four light vectors (zero intensity while inactive), and cursor uniforms. Keep the field texture in linear data space.

## Listen across the disk

Seven scale positions run left to right, from D3 to A4. The far side (z below −0.43) sounds one octave higher. A tap pans toward its horizontal location. Four sine partials at frequency ratios 1, 2.012, 3.82 and 5.43 rise in 9 ms. Their decays shorten from 850 ms at the fundamental to 190 ms at the highest partial. Strength controls both the loudness and the pressure deposit.

## Check the transfer

1. With the music paused, tap the center once. Listen for one pluck and watch a ridge travel through the detail in the image. After the bright crest passes, the older trace should still be visible.
2. Tap left, then right, at equal depth. Listen for the pitch and stereo position to move with the point of contact.
3. Replay the same tap with `uMemory` at 0 and then 1. Keep the image, camera, and sound fixed. Compare the surface after two seconds. The older film should account for the difference.

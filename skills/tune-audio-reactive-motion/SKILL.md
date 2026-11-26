---
name: tune-audio-reactive-motion
description: Map sustained audio levels and detected attacks to light, color, and physical motion with different response times. Use when an audio-reactive world flickers, barely changes, or makes every object pulse together.
---

# Tune audio-reactive motion

Choose one object and say what it is made of. A jellyfish bell can take time to compress and recover. A highlight on the same bell can move quickly. Give each visible effect its own response.

1. **Measure the passage.** Monitor the raw band in dB, then the normalized value, then the final visual drive. Check a quiet section, an attack, and a sustained section. If a meter moves while the picture sits still, inject a known level at the visual input and follow it through material, light, and exposure.
2. **Choose the useful range.** For a decoded recording, measure the active range of each band once. Exclude silence and give narrow ranges a minimum span so the noise floor stays quiet. For a live source, use a floor and peak that can adapt over time. Describe voices by frequency band unless you actually have stems or verified instrument labels.
3. **Map each measurement to a behavior.** Use a sustained level for continuous emission or displacement. Use a detected onset for a discrete traveling ripple. Pick which objects stay still. Keep independent idle movement separately switchable so a silent passage can be evaluated.
4. **Filter at the destination.** In Jellyfish Palace, light reaches 90% of a brighter target in 0.26 s and a dimmer one in 0.53 s. Bell motion takes 0.80 s and 1.00 s. Use those as audition points. If a small, fast attack should light the bell without throwing its whole body upward, shorten the light rise or lengthen the movement rise while leaving the detector fixed.
5. **Run the same audio through both mappings.** Toggle fast and fluid versions in place. Check a sustained note, pause tails, silence, and the seam of a loop. Watch once at normal speed before looking at meters. If the result changes with render rate, advance your filter with elapsed time. Save the clip offset, the destination that improved, and any accent that became too soft.

**Try it.** Enter [Jellyfish Palace](https://pixel-rhythms-jellyfish-palace.shudoof.chatgpt.site). From **Sound**, alternate **Original · compare** and **Fluid** on the supplied loop. Watch a crown, then a jellyfish bell, then a floor wave. Disable **Living currents** in **Light** to isolate the audio-driven changes. The palace uses detected attacks for gesture timing. The authored beat grid in the call-and-response study is a separate approach.

**Source.** Read [the level-to-motion filter](https://github.com/kprasad1221/jellyfish-palace-3js/blob/cc8f8e7442d497677bbb440dbcc9136f5112f3d3/dist/src/response-filter.js) for the exact units and [the audio adapter](https://github.com/kprasad1221/jellyfish-palace-3js/blob/cc8f8e7442d497677bbb440dbcc9136f5112f3d3/dist/src/audio.js) for how playhead, measured levels, and detected attacks enter the world.

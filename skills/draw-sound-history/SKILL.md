---
name: draw-sound-history
description: Turn recent audio measurements into spatial structure using a fixed-rate history buffer or feedback field. Use for musical terrain, delayed particle rings, trails, or multiple visual studies of the same signal.
---

# Draw sound history

Decide what distance means. On the Audio Geology terrain, the front row holds fresh sound and depth shows age. On the Living Particles floor, distance from an origin delays the same event, making a ring travel outwards.

1. **Choose what survives.** For terrain, keep a row of spectrum values. For ripples, keep an envelope and onset per band. Declare a time window and update rate. At 60 steps/s, 256 rows span about 4.27 s at one row per step. Slowing the deposit or translation changes that relationship.
2. **Keep history on its own clock.** Accumulate elapsed time and advance in fixed steps. Define what a long stall should do. Audio Geology caps work at four steps per frame and drops excess steps. That bounds work at the cost of history during overload. If exact file playback matters, reconstruct from timestamped source data.
3. **Choose the memory mechanism.** Use a ring buffer for clean delayed measurements. Use two alternating textures when each update should blur, erode, or otherwise transform the previous field. For a radial wave, read the signal at age `distance / speed`, interpolate adjacent samples, and clamp to the available window. Keep the age-to-distance scale visible while tuning.
4. **Change how the field is drawn.** Try a contour surface, slope-following ribbons, and grains reading the same field. Switch views during a recognizable transient. Carry the audio position, camera, and history through the switch. That makes it possible to compare what each material reveals.
5. **Test with a single impulse.** At a known age, locate its row or radius. Double the render refresh rate and repeat. Then try two unevenly spaced hits. If the spacing looks equal, inspect deposits, sample indices, and visual smoothing. Save the test settings beside a passage of actual music.

**Try it.** Open [Audio Geology](https://audio-geology.shudoof.chatgpt.site), play a track, and switch between Strata, Currents, and Sediment. Find one deposit you can recognize in two views. For a new world, try wrapping age around a column. Decide where the newest row lands and what happens at the seam.

**Source.** Compare Audio Geology’s [feedback field](https://github.com/kprasad1221/audio-geology-3js/blob/299344d0280ceaf665dc98fa11e67f24786225d1/src/field.js) and [fixed-step clock](https://github.com/kprasad1221/audio-geology-3js/blob/299344d0280ceaf665dc98fa11e67f24786225d1/src/clock.js) with the [radial history in the original Living Particles study](https://github.com/kprasad1221/Living-Particles-3js/blob/main/src/bands.js).

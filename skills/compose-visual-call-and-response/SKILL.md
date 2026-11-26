---
name: compose-visual-call-and-response
description: Compose a traveling call, delayed answer, and local rests in a visual music scene. Use when building or critiquing audiovisual phrases in Three.js, TouchDesigner, Unity, or a similar real-time system.
---

# Compose visual call-and-response

Pick a short passage and two visible forms. Describe what the eye should be able to follow with the audio muted. In Currents, a silver crest travels toward older rows of terrain. One beat later, a gold crest travels back on a second bed of ribbons. Look for the instant when both are moving in different directions. [Fixed-passage comparison](https://github.com/kprasad1221/audio-geology-3js/blob/299344d0280ceaf665dc98fa11e67f24786225d1/README.md#currents-comparison)

1. **Choose the clock.** For a metered phrase, set tempo and origin from the piece or an explicit authored grid. For a gesture triggered by a measured attack, use the attack’s timestamp. A loudness reading can weight an entrance. Give each entrance one timing source.
2. **Draw each route.** Give each performer an identifiable body, direction, depth, and extent. Choose a difference you can read in grayscale. One voice can travel across the middle ground while another climbs away from the viewer. Keep part of the frame quiet.
3. **Give each place on the route its own rest.** For a point at fraction `u` along a path, sample `envelope(t - start - u * travel, rise, crest, release)`. Use seconds throughout. Once the front passes, that point can settle while the next point is still rising.
4. **Attach the answer to the call.** Store the parent call’s ID, scheduled onset, and strength. Start the answer from that onset plus the chosen delay. Sample its strength from the parent so a delayed answer keeps its phrasing when the mix changes. Decide whether the two tails overlap.
5. **Compare on one passage.** Keep source, offset, camera, palette, and playback speed fixed. Switch the reply off and on. Inspect a frame with both voices active, then play through the first rest. If the phrasing feels too regular, withhold one reply and listen through its return. Treat the omission as a new authored variation.
6. **Hand off the score.** Identify the forms, input, clock, routes, envelope times, and what resets on seek. Include a reproducible A/B cue. Describe only the results you actually observed.

**For an emissive particle reply.** Give a small group of particles one parent attack, a short route and local rests. Reuse their envelope for a patch of light on the surface beneath them. In Memory Basin, the water travels outward while a reply starts 0.46 seconds after its parent and moves around part of the lip. Hide both the particles and their local light during a passage. Keep advancing the parent clock so restoring the reply reveals its current phase. After the sound stops, check that scheduled replies finish and fresh particles stop entering.

Run the [three-note basin trace](examples/basin-trace.py) with Python 3 for a small timing exercise. Two uneven note intervals leave differently spaced rings. Withhold the middle lamp reply and compare the water at the same instant. This example evaluates an authored score numerically. The playable basin uses measured audio and a separate water simulation.

## Try it in code

Use [score.mjs](scripts/score.mjs) for the clock, parent/child gestures, and envelopes. Copy this entire skill folder to preserve the example’s relative import of the score module. Run a local server from the skill folder and open `/examples/reed-duet/`. To change tempo, edit `bpm` in the scene adapter. The visual score, backing notes, and playhead share that value. The [scene adapter](examples/reed-duet/duet.mjs) maps the score into bend and lift. For continuous input, sample the same clock as the audio. On a seek or source change, reset the score. If gestures also trigger sound or spawn particles, avoid replaying one-shot events when reconstructing visible tails.

In Reed Duet, scrub to **0.80 s** for the overlap. At **2.80 s**, switch between *Every reply* and *Leave a rest*. At **4.80 s**, the reply is present in both. Play through that transition to judge how the omission changes the return.

The included score comes from [Living Particles](https://github.com/kprasad1221/Living-Particles-3js/blob/c654ae403c5bece4822dd38024228c1fc468acd4/src/shared/score.js). The [original hex-field routes](https://github.com/kprasad1221/Living-Particles-3js/blob/c654ae403c5bece4822dd38024228c1fc468acd4/src/world/gestures.js) and [Currents adapter](https://github.com/kprasad1221/audio-geology-3js/blob/299344d0280ceaf665dc98fa11e67f24786225d1/src/world/current-score.js) show two ways to connect the same events to geometry.

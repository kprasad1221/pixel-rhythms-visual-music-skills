# Pixel Rhythms · Visual Music Skills

How do you make one part of a world answer another in time with music? These are free, forkable studies from **Keshav Prasad / Pixel Rhythms Labs**, drawn from experiments in Unity, TouchDesigner, and Three.js. Each skill opens with a musical or design problem, shows how a finished study handled it, and gives you something to try in your own scene.

[![Three renders of Audio Geology at 5.75 seconds showing the original material, a palette change, and two traveling crests](https://raw.githubusercontent.com/kprasad1221/audio-geology-3js/299344d0280ceaf665dc98fa11e67f24786225d1/docs/currents-counterpoint/bell-vault-5.75s.jpg)](https://github.com/kprasad1221/audio-geology-3js/blob/299344d0280ceaf665dc98fa11e67f24786225d1/docs/currents-counterpoint/bell-vault-5.75s.jpg)

*Audio Geology, Currents. Same track, playhead, and camera in all three panels. On the right, a silver crest travels into older terrain while a gold reply travels back toward the present.* [See the study and its A/B notes.](https://github.com/kprasad1221/audio-geology-3js/blob/299344d0280ceaf665dc98fa11e67f24786225d1/README.md#currents-comparison)

## Start with a piece

[**Play Audio Geology**](https://audio-geology.shudoof.chatgpt.site) · [**Enter Jellyfish Palace**](https://pixel-rhythms-jellyfish-palace.shudoof.chatgpt.site) · [**Explore Living Particles and its motion studies**](https://github.com/kprasad1221/Living-Particles-3js/blob/c654ae403c5bece4822dd38024228c1fc468acd4/README.md#what-v03-changes)

| If you’re trying to… | Start here |
| --- | --- |
| Give a gesture a recognizable answer, overlap, and rest | [Compose visual call-and-response](skills/compose-visual-call-and-response/SKILL.md) |
| Make quick sound feel like light, weight, or drifting water | [Tune audio-reactive motion](skills/tune-audio-reactive-motion/SKILL.md) |
| Show where sound has been through terrain, ripples, or trails | [Draw sound history](skills/draw-sound-history/SKILL.md) |
| Make a complex visual instrument inviting to play | [Design visual instrument controls](skills/design-visual-instrument-controls/SKILL.md) |

## Try the eight-second duet

Download or clone this repository. From its root, run:

```sh
python -m http.server 8000
```

Open [Reed Duet on localhost](http://localhost:8000/skills/compose-visual-call-and-response/examples/reed-duet/). Press **Play**. A bank of reeds bends from left to right. Gold seeds lift in the opposite direction one beat later. Switch between **Every reply** and **Leave a rest** during bar two. The soundtrack keeps playing so you can judge what the missing visual answer does to the next entrance. Drag the playhead to compare a single instant. The demo synthesizes its own music and runs locally with no downloads after cloning.

## Bring a skill into your project

**Working by hand?** Read any skill as a short workshop. Follow its listening or viewing exercise in your own tool. Each links back to the exact source revision behind it.

**Working with a coding agent?** Copy the entire folder of the skill you want into your project and point the agent at its `SKILL.md`. For example: *“Read the call-and-response skill. In my existing scene, let a bank of windows answer a passing train. Keep the camera and soundtrack fixed, and give me a way to compare the answer on and off.”* The first skill includes the score module used in both Living Particles and Currents.

## Share a variation

If you take a study somewhere new, [open an issue](https://github.com/kprasad1221/pixel-rhythms-visual-music-skills/issues) with a clip or playable link. What did you keep, what did you change, and where in the passage can someone see or hear the difference? A pull request with a reusable technique and a small example is welcome.

## Credits and reuse

Living Particles grew from a Unity study using SineVFX’s Living Particles pack and an interest in *Tetris Effect*. Audio Geology began as a TouchDesigner terrain system. Jellyfish Palace translates a Krea / H3 film and Daydream soundtrack into a playable Three.js hall. The public studies linked above credit their source material.

The guides and code in this collection are free to use and adapt under the [MIT license](LICENSE). The score module preserves its [upstream notice](skills/compose-visual-call-and-response/scripts/LICENSE). Linked music, films, artwork, and third-party assets retain their respective owners’ terms.

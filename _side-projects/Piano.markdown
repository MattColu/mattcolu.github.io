---
layout: page
title: "MIDI Player Piano"
thumbnail: /assets/media/piano/piano.png
start: March 2021
end: March 2021
languages:
    - C#
tags:
    - 3D Modeling
    - Unity
    - Blender
carousels:
    - images:
        - image: /assets/media/piano/piano.png
        - image: /assets/media/piano/piano1.png
        - image: /assets/media/piano/piano2.png
---
After dabbling with Blender for a bit, I decided to try my hand at modeling a piano.

{% include carousel.html height="56.25" unit="%" %}

While modeling was straightforward enough, a piano is but a large piece of furniture if it is not being played.  
So, armed with my (at the time) *very* limited Unity experience, I delved into what would become a couple of weeks of MIDI Madness.

## Playing

I somehow could not find any Unity MIDI libraries, so I cloned [a C# library](https://github.com/stephentoub/MidiSharp) and added it to my project.  
What I didn't know at the time, is that the MIDI standard is **MASSIVE**, and that the library I used is a very thorough implementation of it.

After a few days of just figuring out how to discern notes being played, I got my project to play a simple MIDI file.  
I hooked each Note On and Off signal, along with its velocity, to a vertical [Lerp](https://en.wikipedia.org/wiki/Linear_interpolation)ing of the corresponding key's vertical position, and to an audio sample that I isolated for each note ([from this (now discontinued) free SoundFont](https://sso.mattiaswestlund.net/)).

The result is a bit rough around the edges: there are many caveats to the kinds of MIDI files that can be processed, the code is hideous and the keys are just translating up and down, but I think overall it's not half bad for how little I knew at the time.

<video style="width:100%" controls>
    <source type="video/mp4" src="/assets/media/piano/play.mp4">
</video>
---
layout: page
title: "Tetris"
categories: project game C
---
This project was proposed as an alternative to taking the Computer Architectures exam. The position was open for multiple people, and was cooperative for its first half and individual for the second half.

Although I ended up spending on this project multiple times the amount of time I would have spent simply studying for the exam itself, I received a chance to work on a personal project from start to end (which is very valuable, given the challengingly tight exam schedule) and gained new insights and (most importantly) a newfound appreciation for the C language in its most basic form.

## The project
The main objective was to develop a library for communicating using the [CAN protocol](https://en.wikipedia.org/wiki/CAN_bus), a signal protocol widely used in the automotive field, and secondly to create or replicate a multiplayer game that would take advantage of it.

## The board
The board that we were given is the same that was used during lab practice for the course, where it is employed as a contact point between [high-level software](https://en.wikipedia.org/wiki/High-level_programming_language) and bare electronics.

It features a 32-bit processor, a touch display and a decent array of input peripherals and communication interfaces: great for didactical purposes, but not particularly useful outside of that (also given the convenience of other more powerful and flexible general purpose SoCs like the Raspberry Pi).

## The protocol
The [CAN protocol](https://en.wikipedia.org/wiki/CAN_bus) is a communication protocol designed for the automotive industry that allows high resistance to signal interference and high flexibility in number of participants to a network.

The first step of the project was to create a library to ease the operation of the CAN bus via code, which usually requires direct manipulation of hardware registries and buffers.

This phase was collaborative, and I built upon a low-level library written by a colleague of mine to create an IP-like protocol.

## The game
For the second phase we were given full discretionary power regarding what, how and how much to implement.

Considering that everything had to be recreated from scratch, we were suggested not to be overly ambitious and try to stick to simple arcade games.

I opted for Tetris, given the all in all simple game mechanics at its core, and the multiplayer capabilities that were part of the game from as early as 1989.

### Connectivity

The CAN library that I wrote allows up to 8 addressable devices and "unlimited" spectators, however, one important aspect to consider is that every board needs two be powered, connected with 4 wires and arranged in a loop, **heavily** limiting the physically viable size of multiplayer matches (and respective testing extents).

The first device to open the lobby menu is assigned the role of master, from that moment it will be in charge of address negotiation. Address negotiation is the only task that distinguishes the master from all other devices, making it a hybrid master-slave/peer-to-peer architecture.

As for usual gameplay data, packets can be addressed to a specific device or broadcasted to all of them. In any case, each board forwards all the data along the loop until it reaches the device that sent it first, which eliminates it.

This allows every player to see all of the other players' playfields, and choose the target of their attacks accordingly.

### Graphics

I was originally planning on building a NES emulator, given the similar specs and CPU architecture, but after spending some time skimming trhrough manuals and technical references, I came to terms with the fact that it was too big of a task for a single (inexperienced) programmer.

Nonetheless, I was able to "recycle" some principles of old 8-bit systems, such as tiles and color palettes.

> *Due to hardware limitations, old consoles couldn't address single pixels individually, having to rely on tiles: indivisible square blocks of pixels.*
*Moreover, every tile could only display a very limited amount of colors out of the (already limited) system palette.*

> *These limitations combined, however, save great amounts of storage space (once a crucial aspect of game developement), as it's only necessary to store one copy of the graphics data, which can be "tinted" at will simply by changing the palette the tile is being rendered with.*

Tetris's block-based nature easily allows for a tile-based grid, and the recurring shapes (for both blocks and backgrounds) benefit from palette-based coloring.

Since the board doesn't come with any co-processors whatsoever, all screen updating routines are executed by the processor itself, rendering it unusable during the (very lengthy) LCD instructions.
The normal approach of a full screen refresh every frame would have brought the framerate to less than 10 FPS, and the limited amount of RAM (64K) wouldn't even allow for a [framebuffer](https://en.wikipedia.org/wiki/Framebuffer) to check for pixel changes.

However, the inherently static nature of Tetris's playfield and its grid-based implementation, allow specific patching of the falling blocks, thus minimizing screen writes as much as possible.

### Audio

Another aspect that I wanted to carry over from my NES research, also being a personal interest of mine, was sound generation.

> *As previously mentioned, up until the rise of CD-based consoles (PS1, 1996), storage space was an extremely sought-after commodity. This rendered impossible the use of [streamed music](https://en.wikipedia.org/wiki/Streaming_audio_in_video_games) (like MP3 files), and as a result marked the golden days of instruction-based music.*

> *Instruction (or sequence)-based music, not unlike [MIDI](https://en.wikipedia.org/wiki/MIDI), works by sending instructions to a console's sound co-processor or [PSG](https://en.wikipedia.org/wiki/Programmable_sound_generator), which synthetizes the audio output in real time.*

As with graphics, all sound generation and mixing has to be performed in-software, by the processor.
However, compared to graphics, it is a much less intensive workload, although executed much more frequently.

Producing a note is as simple as sending a series of volume levels to the speaker's [DAC](https://en.wikipedia.org/wiki/Digital-to-analog_converter), while mixing just involves summing all volumes together and eventually rescaling the result.

In order to ensure smooth signals being sent to the speaker, the easier and most straightforward solution involves reserving one hardware timer for each simultaneous note (voice). Having only two left from the game and network logic meant I was limited to only two voices, but given that having sound at all was a plus, it was more than enough.

After devising a suitable data structure to save notes, volumes, waveforms and effects, for convenience's sake, I decided to structure the song file in a form that's reminiscent of [tracker software](https://en.wikipedia.org/wiki/Music_tracker).

## The Result

I ended up working unofficially on this project during the summer to bring it on par with my initial expectations, and I am very pleased with the final result, as it is almost a fully-fledged Tetris port with little to no compromises despite the challenging platform we had to work with.
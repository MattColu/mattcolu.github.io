---
layout: page
title: My Room
thumbnail: /assets/media/room/room_5.jpg
start: March 2021
tags:
    - 3D Modeling
    - Blender
carousels:
    - images:
        - image: /assets/media/room/room_0.jpg
        - image: /assets/media/room/room_1.jpg
    - images:
        - image: /assets/media/room/computer_0.jpg
        - image: /assets/media/room/computer_1.jpg
    - images:
        - image: /assets/media/room/room_2.jpg
        - image: /assets/media/room/room_3.jpg
        - image: /assets/media/room/room_4.jpg
        - image: /assets/media/room/room_5.jpg
---
Having picked up Blender during online classes, I was naturally lead to the idea of modeling the place where I spent all of my days for several months: my room.

Having already spent a significant portion of my life inside that room, and easily having access to accurate measurements of all of its objects allowed me to model everything with a high degree of accuracy.  
Moreover, the simple shapes and materials of the furniture made it an excellent choice for a beginner: the first renders were extremely motivating.

{% include carousel.html height="56.25" unit="%" number="1" %}

A few objects were added over the last few years, especially computer peripherals.  
However, a significant difference to the real counterpart is the lack of doohickeys all over the shelves and desk: modeling those will probably never happen, at least not in detail.  
<small>At least my room can enjoy some semblance of order, somewhere.</small>

## My Computer

The first computer I have ever built. It has been serving me well since 2016, so I decided to honor it by spending an unreasonable amount of time replicating it to the smallest detail.

All textures for flat objects were projected from high-resolution images found online, but most of it is actually modeled, notably heatsinks, fans and cables.

{% include carousel.html height="56.25" unit="%" number="2" %}

## Procedural Orchids

I happen to share my room with a (sizeable) population of orchids (it was not my choice, but they do thrive in my room), so, in order to get some practice on the (then) [newly released](https://www.blender.org/download/releases/2-92/) Geometry Nodes, I decided to make a procedural orchid setup.

Unfortunately, a few months after I completed my implementation, Geometry Nodes got completely reworked, rendering a good chunk of my work unusable.  
(I rewrote the affected sections a few months later)

{% include figure.html w="100%" src="/assets/media/room/invalid.png" alt="Invalid nodes due to version differences" caption="The unfortunate side effect of progress (red nodes are invalid)" %}

Almost every aspect of the plant is configurable: the stalk (for lack of a better term for the lowermost part) can be tuned in length and orientation, leaves are chosen randomly from a set and the stem can be tuned in height, waviness and deviation towards a light source (however, flowers were added manually).  
Moreover, all of these elements get a random size and orientation offset for each of the instances they create, for an extra procedural bonus.

{% include figure.html w="60%" src="/assets/media/room/orchids.jpg" alt="Orchids" caption="The pet orchids in question" %}

{% include carousel.html height="56.25" unit="%" number="3" %}
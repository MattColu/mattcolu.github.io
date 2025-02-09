---
layout: page
title: This Website
thumbnail: /assets/media/website/website.png
start: April 2024
languages:
    - HTML
    - JavaScript
    - CSS
tags:
    - Web Development
    - 3D Modeling
    - ThreeJS
---
I thought that work for this website would deserve a dedicated page (source for the entire site can be found in the [site's repo](https://github.com/MattColu/mattcolu.github.io)).

## Miniatures

I wanted to try making some stylized animations of my projects with the constraint of being able to run them in an interactive web canvas. However, I ended up rendering them in Blender and including them as videos, as it was just so much more convenient that way (and for the marginal role I gave them, they wouldn't have received much interaction anyways).

So, at last, redemption! These are fully interactive 3D canvases!

<div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 100%; margin-bottom: 1em">
    <div style="width:50%;">
        {% include 3js.html title="Hopper" import=true %}
    </div>
    <div style="width:50%;">
        <div id="3js-canvas-radray" style="position: relative">
            <script type="module" src="/assets/js/radray.js"></script>
        </div>
    </div>
    <div style="width:50%;">
        {% include 3js.html title="Tetris" %}
    </div>
    <div style="width:50%;">
        {% include 3js.html title="Thesis" %}
    </div>
</div>

The miniature for [Radray](/projects/Radray) required a dedicated approach.  
As far as I'm aware, Blender's GLTF exporter does not support the animation of material properties, so the simple workflow of creating a scene in Blender, saving it as a GLTF file and loading it with Three.js was not available.

I still saved the motion of the ray as an animation, but all spheres were created in-engine with Three.js: this came with the benefit of allowing me to add a few editable parameters to the scene.  
Since I was at it, I used this occasion to practice GLSL and wrote a simple shader to interpolate the color of each sphere based on its distance from the ray.  
___

I also made a miniature of my head, which is used in the [About](/about) page.

I wanted to have it following the mouse cursor, like in Minecraft's inventory screen.  
As for the appearance, I tried making it in the style of *The Legend of Zelda: Wind Waker*'s NPCs (it ended up looking a bit *Animal Crossing*-like though).

A variant of this model was also used for the site's icon.  
It's a bit too small to see, so here's a bigger version: <img src="/assets/media/website/icon.png" style="width: 64px; height: 64px"/>

<div style="margin:auto; text-align: center">
    <figure>
        <script type="module" src="/assets/js/head.js"></script>
        <div id="3js-canvas-head" style="width: 50%; margin: auto"></div>
    </figure>
    <caption>
        (Excuse him, scrolling pages kind of throw him off vertically)
    </caption>
<div>

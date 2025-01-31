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
I thought that work for this website would deserve a dedicated page.

## Miniatures

I wanted to try making some stylized animations of my projects with the constraint of being able to run them in an interactive web canvas. However, I ended up rendering them in Blender and including them as videos, as it was just so much more convenient that way (and for the marginal role I gave them, they wouldn't have received much interaction anyways).

So at last, redemption. These are fully interactive 3D canvases!

<div style="display: flex; flex-direction: row; flex-wrap: wrap; width: 100%">
    <div style="width:50%;">
        {% include 3js.html title="Hopper" first=true %}
    </div>
    <div style="width:50%;">
        {% include 3js.html title="Tetris" %}
    </div>
    <div style="width:50%;">
        {% include 3js.html title="Thesis" %}
    </div>
</div>

___

I also made a miniature of my head, which is used in the [About](/about) page.

I wanted to have it following the mouse cursor, like in Minecraft's inventory screen.  
As for the appearance, I tried making it in the style of *The Legend of Zelda: Wind Waker*'s NPCs (it ended up looking a bit *Animal Crossing*-like though).

A variant of this model was also used for the site's icon.  
It's a bit too small to see, so here's a bigger version: <img src="/assets/media/website/icon.png" style="width: 64px; height: 64px"/>

<div style="margin:auto; text-align: center">
    <figure>
        <script type="module" src="/assets/js/head.js"></script>
        <div id="head-canvas" style="width: 50%; margin: auto"></div>
    </figure>
    <caption>
        (Excuse him, scrolling pages kind of throw him off vertically)
    </caption>
<div>

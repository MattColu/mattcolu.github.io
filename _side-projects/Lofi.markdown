---
layout: page
title: Lofi Girl's Room
thumbnail: /assets/media/lofi/lofi.jpg
start: May 2021
tags:
    - 3D Modeling
    - Blender
carousels:
    - images:
        - image: /assets/media/lofi/selected.jpg
          caption: The scene contains 300 objects in total
        - image: /assets/media/lofi/blobcat.png
          caption: The cat on the windowsill might have a proper name, but it will always be Blobcat to me ❤️ 
---
This is a fan recreation of LoFi Girl's room from the [eponymous YouTube channel](https://www.youtube.com/c/LofiGirl).

{% include figure.html src="/assets/media/lofi/lofi_ref.jpg" alt="Lofi reference" %}
{% include figure.html src="/assets/media/lofi/lofi.jpg" alt="Lofi result" caption="Original and 3D version compared" %}

When this project took form, the channel was already famous, but it wasn't quite the sensation that it is today, with a fully-fledged studio working on it, several simultaneous music streams and a dedicated website.  
The only high quality reference I could find online was the YouTube stream itself, so everything was based off of a screenshot with the music track's names patched out.

## Interior

Being the reference a painting and not a photo, perspective had to be faked. I tried creating a coherent scene overall, but my priority was fidelity to the final 2D image rather than spatial consistency.

At the time I didn't know that there existed [other official POVs](https://www.reddit.com/r/LofiGirl/comments/qcy4rw) of the room, so I could fill the gaps with more accuracy. However, in retrospect, being unaware of that limited the scope of this side project to a manageable level. I might have never finished this only camera angle if that wasn't the case.

{% include figure.html w="50%" src="/assets/media/lofi/perspective.jpg" alt="Fixed perspective tricks" caption="As many things in Computer Graphics, (in this case) perspective is a lie" %}

## Materials

Some textured object had their texture recreated, whereas most books had their covers simply projected from the reference image (thanks to the identical camera angle).

Almost all flat-colored materials make use of the *Shader to RGB* + *Color Ramp* node combo, as it is a very simple and effective solution for anime-like shading: it allows retaining realistic lighting information from the original shader, but also enables 100% color accuracy via color-picking from the reference image.

{% include figure.html w="75%" src="/assets/media/lofi/nodes.png" alt="Shader to RGB + Color Ramp" caption="Thank you EEVEE" %}

Moreover, custom normals grant granular control over the shading and allow achieving otherwise impossible shading effects, such as sharp lighting changes on co-planar faces, or consistent light levels along differently oriented surfaces.

## Cityscape

Given the many obstructions to the view outside of the window, I looked into recreating the original view from scratch.  
Luckily, as LoFi Girl's [Wikipedia article](https://en.wikipedia.org/wiki/Lofi_Girl) helpfully states, the artist wanted to capture Lyon's [La Croix-Russe](https://en.wikipedia.org/wiki/La_Croix-Rousse) neighborhood, so with any luck it could actually be a view of a real place.

After a bit of *Geoguessing®* I identified the image to be taken from someplace around [here](https://earth.google.com/web/@45.77051629,4.82974508,216.82409853a,301.24755646d,35y,-1.45962946h,89.91442929t,0r), so I took a screenshot from Google Earth and applied some effects to it.

{% include figure.html src="/assets/media/lofi/buildings.png" alt="Skyline comparison" caption="A comparison of the raw Google Earth screenshot and the reference.  
The remaining bottom halves are not very similar, as the artist probably took some liberties (most likely also due to the presence of a big and ugly building)" %}

{% include carousel.html height="400" unit="px" %}
---
layout: page
title: Radray
start: November 2022
end: March 2023
languages:
    - CUDA
    - C
    - Python
tags:
    - Group Project
miniature: title
summary: Re-writing someone else's messy Python code into a blazing fast parallel CUDA program is a cathartic experience.   
---
This project comprised the entire final exam of the GPU Programming course. It was a three-person group project, for which we mostly took turns working in pairs, due to our separate (but equally challenging) exam schedules.

We were initially given total freedom in deciding what to create, as long as it would leverage parallelism, but were ultimately tasked by the Professor with creating a more efficient, parallel version of an already existing piece of software.

## The Project

[RadRay](https://www.researchgate.net/publication/342684789_A_3D_Simulation-based_Approach_to_Analyze_Heavy_Ions-induced_SET_on_Digital_Circuits) is a simulation and visualization tool that was developed at Politecnico di Torino to aid in the design of radiation-resistant hardware (mainly for aerospace applications).

This Python utility takes a 3D description of an integrated circuit (in the form of a [GDS](https://en.wikipedia.org/wiki/GDSII) file) and calculates the energy that gets transferred to the different layers and components as a result of an [ion strike](https://en.wikipedia.org/wiki/Single-event_upset).

{% include gif-like.html src="/assets/media/radray/example.mp4" caption="A visualization of the distance-based calculations that Radray performs" %}

Our starting point was a single, mostly uncommented, multi-thousand-line Python file: as one would expect, a significant portion of our development time was taken by in-depth analysis and reverse engineering of the existing code.

## The Problem

Both the original and our version work as follows:

- Read the IC definition file
- Define a ray
- Generate a set amount of points inside the components of the IC
- Calculate the energy imparted to each point by the ray
- Write to a log file / visualize

Out of these steps, I/O on files is inherently sequential, whereas generating and calculating the energies of the points is a task that can benefit from parallel execution.

{% capture embarrass %}

This problem is actually an example of an *"embarrassingly parallel"* task: since the calculations at every point are completely independent from each other (energy only depends from the point-ray distance, which is fixed for each point), parallelization leads to a speedup that scales linearly with the number of parallel processing units.

{% endcapture %}
{% include blockquote.html type="info" content=embarrass style="margin-bottom: 0px" %}

{% capture amdahl %}

However, a generic application can benefit from parallelization only to some extent, as most involve some sort of sequential operations, be it reading from a file or performing calculations that depend on one another. This is known as [Amdahl's Law](https://en.wikipedia.org/wiki/Amdahl%27s_law).

{% endcapture %}
{% include blockquote.html type="warning" content=amdahl style="margin-top: 5px" %}

## The Approach

For our convenience we kept the initial steps (reading the GDS file and generating the boundaries of the 3D boxes) as python scripts, and focused mostly on rewriting the most expensive functions (point generation and energy evaluation).

After creating a sequential C version to serve as a baseline, we tried and iterated with some variations on the original algorithm.

{% include gif-like.html src="/assets/media/radray/sequential.mp4" caption="In the sequential implementation, all points at a certain timestep are calculated one after another (here figuratively moving to the CPU and back)" %}

### Subdivision into simpler blocks

Upon implementing a parallel version of the point generation function, we noticed significantly worse performance than our sequential baseline.

This is ultimately due to the shape of the components: following the initial approximation that all the points inside a component's [bounding box](https://en.wikipedia.org/wiki/Minimum_bounding_box) are valid, in a sequential program it's easy to add a check for each point:

{% highlight python %}
    for point in component.bounding_box.points:
        if point in component.mesh:
            generate_point_info()
{% endhighlight %}

However, with a parallel program, every [thread](https://en.wikipedia.org/wiki/Thread_(computing)) executes the same program, so without knowing beforehand which point will actually be valid, every thread has to start, check, and only eventually go on with the calculations and produce a valid value.

{% capture divergence %}

Modern GPU architectures shine when all threads can execute the exact same instructions. If some take a path of a branch while other don't, some of the performance increase gained thanks to parallelism is lost: this is known as **branch divergence**.

{% endcapture %}

{% include blockquote.html type="note" title="Branch Divergence" content=divergence %}

Depending on the *bounding-box-volume/actual-volume* ratio of the components, this can produce a sparse array (i.e. an array for which most of its elements are empty), which is highly inefficient, considering that memory transfers between system RAM and GPU RAM (and vice versa) are one of the most common and impactful bottlenecks in parallel computations.

{% include figure.html src="/assets/media/radray/bounding_box.png" w="50%" alt="A sub-optimal component shape" caption="A sub-optimal component: its volume is a fraction of its bounding box's volume"%}

We solved this issue by adding an extra one-time pre-computation step, which reduces all complex shapes to simple boxes, guaranteeing that all the points are valid and thus minimizing branch divergence and yielding the smallest possible array.

{% include figure.html src="/assets/media/radray/decomposition.png" w="75%" alt="Polygon decomposition algorithm" caption="An example of the polygon decomposition algorithm"%}

### Almost-parallel computation

Nearing the end of our project, we had all reached the consensus on the fact that *more parallel ⇒ more speed*, and while it *is* a valid rule of thumb, it's always important to weigh pros and cons of each approach.

We compared two slightly different implementations: one in which points are evaluated in parallel for every position, but sequentially through time, and another in which all points at all timesteps are evaluated in parallel.

While the second approach is faster by itself (if thread count is not a constraint), we were limited by the fact that we ultimately needed the total accumulated energy of each point, which necessitates an extra (sequential) sum over all the timesteps. Thus the time gained by doing everything in parallel was more than compensated by the sum that needed to be performed on the host and the larger memory transfer that it required.

{% include gif-like.html src="/assets/media/radray/parallel.mp4" caption="Despite parallel threads still having to be dispatched by and retrieved from the CPU, overall computation is much faster than the sequential implementation" %}

### Visualization

One feature that I focused my efforts upon, but had to eventually scrap due to a lack of time, is a simple visualization app built on OpenGL.

After the parallel sections of the program, all the computed data gets collected from the GPU and saved to a file, which in turn gets read by a Python script which uses basic 3D plotting for visualization.

An OpenGL visualization would have granted a massive speedup in both visualization framerate (now bordering non-realtime) and memory transfer, since all the data would have already been on the GPU.

{% include figure.html src="/assets/media/radray/fully_parallel.png" w="75%" alt="Fully parallel workflow" caption="A schematic view of the benefits of a fully parallel workflow" %}

## The Result

Our final implementation clocked in at a respectable 25× speedup relative to our sequential version.

While it's nowhere near the amount of threads that were used (i.e., the theoretical speedup), it's important to keep in mind that no matter the speedup in the parallel sections, it's ultimately the sequential sections that matter the most for the overall execution time.

Moreover, despite it not being our first choice as a project (any choice to be fair), we were ultimately successful in tackling such a cryptic task on an obscure and complicated topic, and turning it into a success and (perhaps more importantly) a learning experience in parallel computing.

___

I would like to thank [Francesco](https://github.com/Francesco-Carlucci) and [Alessio](https://github.com/alessiocaviglia) once again for their invaluable effort to this common cause.

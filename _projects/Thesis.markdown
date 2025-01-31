---
layout: page
title: Thesis
start: October 2023
end: July 2024
languages:
    - C#
tags:
    - Master's Thesis
    - Solo Project
    - AI
    - Imitation Learning
    - Reinforcement Learning
    - Level Design
    - Unity
miniature: title
summary: How do **YOU** ![YOU](/assets/media/thesis/you.png) drive? No matter your skill level, I set up an AI training workflow that mimics **YOUR** ![YOU](/assets/media/thesis/you.png) driving.
levels:
    - Square
    - 8
    - Monza
    - Spa
    - Twisty
carousels:
    - images:
        - image: /assets/media/thesis/freeroam_top.png
        - image: /assets/media/thesis/freeroam.png
---
This is my thesis work for my Master's Degree in Computer Engineering.  
Along the studies for the Artificial Intelligence branch of the degree, I realized that AI research was not the field that I wanted my thesis to be about, nor what I wanted to work on after graduation.  
So, ultimately, this project served not only as a foray into videogame development, but also as a union between the two fields.

## The Project
The goal of the thesis was to develop a latency mitigation system that could be customizable to each player's driving style in a kart racing videogame.  
More generally, to create an AI-integrated server architecture that, as defined by the [MPAI-SPG specification](https://mpai.community/standards/mpai-spg/), is able to control a character on behalf of a player, behaving as closely as possible as said player.

This is obtained through a three-phase setup:

1. Gather user demonstrations: i.e., any data that could be representative of the user's driving style;
2. Train an AI model on the demonstrations;
3. Deploy the trained model on the server.

The thesis only contains the first two steps: implementing the third one and all of the backend that it entails would have required significantly more time (the thesis still ended up taking 9 months of almost-full-time work).

{% capture authoritative %}

The MPAI-SPG specification requires an *Authoritative Server Architecture*, i.e. a client-server configuration in which the server has the final say over any action performed by the clients.

{% include figure.html w="35%" src="/assets/media/thesis/authoritative.png" alt="Authoritative server" %}

It is a popular architecture among top-tier competitive games thanks to its guarantee of a fair and consistent state for all clients, as the server is the only source of truth (it is also the reason for which SPG doubles as an anti-cheat measure).

Of course, latency still plays a crucial role in the final experience, especially for competitive games. Predictive mitigation is only one of the [many techniques](https://en.wikipedia.org/wiki/Lag_(video_games)#Solutions_and_lag_compensation) that were devised over the course of decades, each trying to tackle this fundamental issue that, alas, is physically impossible to solve.

{% endcapture %}

{% include blockquote.html type="warning" title="Authoritative Servers" content=authoritative %}

## Data Gathering
As mentioned, the use case for my thesis was a kart racing videogame.  
I did not decide this aspect, as it was carried over from work done on this project before I stepped in, however I gladly accepted these terms as:  
1. I am personally a fan of racing games, and of the karting genre in particular, as it holds a special place in my heart,  
2. Unity graciously provides [an example project](https://assetstore.unity.com/packages/templates/unity-learn-karting-microgame-urp-150956) that implements all the necessary physics and driving mechanics out-of-the box, as well as being already configured for an official, Unity-developed [Machine Learning library](https://github.com/Unity-Technologies/ml-agents).

The Karting Microgame (as it is called) also provides many racing-themed 3D models, materials, a skybox, various looping music tracks and many SFX: all things which are not required for an experiment such as this, but whose absence is definitely noticeable.

### Tracks

Tracks were built thanks to the [*Racetrack Addon*](https://assetstore.unity.com/microgame-add-ons/karting) (unfortunately discontinued), which provides a set of tiles to easily build modular tracks with.

{% include figure.html w="100%" src="/assets/media/thesis/track_pieces.png" alt="Modular track pieces" caption="There are only pieces for 90° bends, but some interesting layouts can still be created" %}

The track pieces are very wide and the track layouts are quite lenient. This leaves ample room for error, but at the same time lets driving style shine through (for instance, an experienced driver would keep an optimal racing line to maximize speed, whereas a less experience driver would focus on staying in the middle of the track).

Unfortunately, all tracks are devoid of any additional fun factor whatsoever, as *driving style* is a very fickle concept in and of itself: adding jumps or collectibles would have biased the results or introduced extra variability to an already difficult modeling task.

### Tutorial Level

The first level is a free roam area. It is not timed, and the only objective is to reach the center of the map (the layout is basically a guided loop towards the center).

One of the fundamental assumptions of the thesis is that the user is expected to keep a consistent driving style throughout the experiment, so that it can be modeled.  
For this reason, this level serves as a buffer for the player to get acquainted with the controls and physics. All the track pieces are introduced here, so there is no unwanted surprise other than in the layout of the tracks.

{% include carousel.html height="70" unit="%" number="1" %}

{% include figure.html w="50%" src="/assets/media/thesis/easter_egg.png" alt="Easter egg" caption="I even left an easter egg, I wonder if anyone ever found it..." %}

### Recorded Levels

There are five recorded levels in the game, with difficulties ranging from mind-numbingly easy to quite challenging to take flat-out.

<div style="width: 100%; display: flex; justify-content: space-between">
{% for level in page.levels %}
{% assign srcc="/assets/media/thesis/track" | append: forloop.index0 | append: ".mp4" %}
{% include gif-like.html w="19.5%" src=srcc caption=level %}
{% endfor %}
</div>

Each circuit is five laps long. At the end of each lap, two files containing respectively all *Rigidbody* data and user inputs are sent to the Firebase server: this is the data that will be used to train the model for each user.

## Data Analysis

Despite having had quite a lot of fun designing levels and implementing gameplay features, most of the thesis actually involved finding a balance on how much data to gather from the users, and how to make the most of it during training.

Thankfully, the [ML-Agents library](https://github.com/Unity-Technologies/ml-agents) already has an implementation of GAIL ([Generative Adversarial Imitation Learning](https://arxiv.org/abs/1606.03476)): a neural network architecture that is tailored for imitating user behaviors.

{% capture GANs %}
[Generative Adversarial Networks](https://en.wikipedia.org/wiki/Generative_adversarial_network) (GANs for short) are a class of [neural networks](https://en.wikipedia.org/wiki/Neural_network) that can have drastically different architectures, but that all share the presence of two separate sub-networks, directly competing against each other (hence the *"Adversarial"* in the name).

Given a certain set of data (e.g. images of puppies, Shakespeare poems):
- The **Generator** is tasked with producing content that adheres as closely as possible to the reference data; 
- The **Discriminator** is presented with a random piece, either extracted from the reference or produced by the Generator, and is tasked with discerning if it is genuine or fake.

{% include figure.html w="75%" src="/assets/media/thesis/gan_cats.png" %}

Their respective performances drive their opponent's improvement, ensuring that none of them leaps ahead or lags behind the other.

In reality, only the Discriminator has access to the reference data, so it is fair to say that the Generator only knows how to fool the Discriminator.  
However, the wanted side effect of this is that the Generator indirectly learns how to generate convincing, reference-like data, and thus can be detached from the adversarial architecture and used by itself to generate new data.

In this thesis the reference data is a set of recordings of a certain user's driving and the wanted output is a series of actions that adhere to that user's driving style.

{% include figure.html w="75%" src="/assets/media/thesis/gan_driving.png" %}

{% endcapture %}

{% include blockquote.html type="note" title="Generative Adversarial Networks" content=GANs %}

### Training

As mentioned, the library already implements all the necessary components for training and deploying a neural network inside Unity. What required the most work was finding an optimal training configuration, also considering that some of the training data had to be used as an evaluation set.

### Evaluation

While in real life one might have a more or less well-defined idea about the driving style of a person <small>(we all have that friend whose car we would rather not get in)</small>, when applied to videogames it tends to get quite nebulous, especially in a stylized environment.  
However, one key definition that can be postulated regarding driving style similarity, is that **equal stimuli** should produce **equal actions**.

Putting aside the fact that a player's driving style might evolve over the course of the playing session (especially if they have little experience playing this type of games), a perfect AI model would perform the same actions as their reference player when subjected to the same environment.

To obtain fair evaluations in accordance to this principle, trajectories recorded from the user's kart were subdivided into smaller chunks and compared to trajectories generated by an identical kart controlled by the AI model.

{% capture evalcaption %}

1. The <b style="color: #0a0">original trajectory</b> gets split into <b style="color: blue">sub-trajectories</b>
2. The <b>agent</b> gets instantiated at the start of every <b style="color: blue">sub-trajectory</b>
3. Each <b style="color: red">generated sub-trajectory</b> is evaluated against its relative <b style="color: blue">reference sub-trajectory</b>

{% endcapture %}

<div style="margin:auto; text-align: center; width: 60%">
    <figure>
        <video muted controls style="width: 100%; height: 100%;">>
            <source src="/assets/media/thesis/measurement.mp4"/>
        </video>
        <figcaption>{{evalcaption | markdownify}}</figcaption>
    </figure>
</div>

Since the agent is instantiated for the same number of timesteps as the user's sub-trajectory, there is a one-to-one correspondence between the two sub-trajectories. This means that it is possible to use the simple euclidean distance between each pair of points as a metric for accuracy (the actual metric is averaged and normalized but this is the working principle).

### Automation

This was the most crucial aspect of the entire thesis: between all the tries with my own driving, and the official deployment with 20 participants, the number of times the training and evaluation processes were instanced easily reached the thousands.

Of course I did start by running the training script manually every time, however, the more the project grew, the more time consuming the setup process for each run became: developing an editor script to aid in training and evaluation became a priority pretty early on.

{% capture trainingsessioncaption %}

Multiple months of work condensed into a single screenshot!  
Extensive defaults and error checking, preset saving and loading, mostly customizable!  
This bad boy can keep your computer running for days on end!*  
<small>(*if not for a memory leak in the ML-Agents library that luckily got patched during the thesis)</small>

{% endcapture %}

{% include figure.html w="50%" src="/assets/media/thesis/training_editor.png" alt="Training session editor" caption=trainingsessioncaption %}

{% include figure.html w="50%" src="/assets/media/thesis/training_editor_fsm.png" alt="Training session editor finite state machine" caption="A flow chart for the last script: I am aware that this is not very exciting, but I am really proud of the final logic.  
Multiple [FSM](https://en.wikipedia.org/wiki/Finite-state_machine)s working in tandem to keep track of scripts running through an external shell (training runs in Python) and entering and exiting play mode multiple times with different scenes" %}

## Results

After almost 9 months of work, the results were, in all honesty, not so great.

{% include figure.html w="55%" src="/assets/media/thesis/results.png" alt="Results" caption="An accuracy of 55% is not a great look for an AI model..." %}

I would have loved to see amazing accuracy across the board, but that's just not how research works. There is always some aspect that can be improved: in this case, probably the default [hyperparameters](https://en.wikipedia.org/wiki/Hyperparameter_(machine_learning)) are what held back the network.

I hope one day someone inherits my thesis and carries on from where I left, at least now there is a (hopefully) solid background for a more thorough analysis on the aspects that matter the most for overall performance.

For what concerns me, I finally had a chance to get some real hands-on experience on Unity, the C# language has definitely reached the top spot in my favorite languages rankings, and I met some truly wonderful people along the way.

___

[Github Repo](https://github.com/MattColu/Tesi)  
[Read My Thesis](http://webthesis.biblio.polito.it/id/eprint/31925)  
[Play My Game!](https://play.unity.com/en/games/a3a8144d-4125-4184-b532-56d1286fb004/kart-data-collection)  

I have also included it here for ease of access, but this embed might break at any time (!) 
<div style="margin: auto; text-align: center" markdown="1">
<iframe src="https://play.unity.com/api/v1/games/game/a3a8144d-4125-4184-b532-56d1286fb004/build/latest/frame" style="width: 640px; height: 360px; border: none; outline: none"></iframe>
Note: *There is a known audio bug with engine noises. Unfortunately it is related to the Unity Play WebGL player, as it does not happen in local builds.*  
*I have already spent many days troubleshooting and successfully fixing it in multiple occasions, but it keeps reappearing without my intervention* 😒
</div>
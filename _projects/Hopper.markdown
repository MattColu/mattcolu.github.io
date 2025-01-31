---
layout: page
title: Hopper
start: November 2022
end: September 2023
languages:
    - Python
tags:
    - Group Project
    - AI
    - Reinforcement Learning
    - PyTorch
    - Blender 
miniature: title
summary: Three students try to teach a simulated leg 🦿 how to jump thanks to Deep Reinforcement Learning, Domain Randomization and Pose Recognition.
---

This project was part of the Advanced Machine Learning exam.  
It came to be the lengthiest out of all the projects of the entire degree due to an unfortunate placement with other project-based exams and to the extent of the project itself.  
It was a three-people group project, each of us working on a specific section of it.

## The Project

The aim of this project was to teach a simulated leg how to hop in 2D.

{% include gif-like.html w="45%" src="/assets/media/hopper/struggling.mp4" caption="It doesn't know how to hop yet. Everyone has to start somewhere, right?"%}
In order do this we employed a special kind of machine learning algorithm called [Reinforcement Learning](https://en.wikipedia.org/wiki/Reinforcement_learning), more specifically its *deep* variant because of its use in conjunction with a neural network.

{% capture RL %}

The term *"Reinforcement Learning"*, be it of the *deep* kind or not, generally refers to a family of machine learning algorithms that build behaviors primarily by means of rewards and punishments.

- The **agent** - the entity that learns - may know some details about itself, but knows nothing about the world around it except for the consequences of its actions.
- The **environment** provides **observations** to the agent to base its decisions upon, and dispenses **rewards**  after the choices have been made.
- The **objective** of the agent is to maximize rewards, so naturally it will try and repeat the actions that yielded positive results.  
However, it is up to the programmer to decide if the agent should prioritize short-term rewards, or value actions that lead to higher rewards in the long run. According to [Bellman's Equation](https://en.wikipedia.org/wiki/Bellman_equation) this is known as *discount factor*.

Reinforcement Learning does not produce behaviors that outperform handcrafted algorithms, since as a trial-and-error method it is an inherently imperfect process. However, it is often the only way to obtain a suitable policy, especially for very complex tasks, or tasks for which an optimal formula or algorithm do not exist.  
The task of the programmer becomes a matter of fine-tuning rewards and goals, thus leaving the bulk of the "figuring out" effort to the agent, which can take a long time to converge to a satisfying result.

{% endcapture %}
{% include blockquote.html type="note" title="Reinforcement Learning" content=RL %}

## The Leg

Our hopping hero is an example environment from the [Gym Library (now *Gymnasium*)](https://gymnasium.farama.org/) by OpenAI. It's a collection of self-contained scenes to test and experiment with Reinforcement Learning.  
These scenes are physically simulated by [MuJoCo](https://mujoco.org/), a lightweight physics engine built for simulating joints and contacts, which also takes care of rendering via OpenGL.

The greater aim of this project was actually to showcase the effectiveness of Domain Randomization for robotic control tasks.

{% capture DR %}

Domain Randomization refers to a technique similar to [Domain Adaptation](https://en.wikipedia.org/wiki/Domain_adaptation) (i.e. a procedure that follows regular training in case the training domain does not coincide with the actual use case).  
Domain Randomization extends the agent's experience of the environment by randomizing key aspects of the latter. While it isn't as simple or as easy to implement as image [Data Augmentation](https://en.wikipedia.org/wiki/Data_augmentation#Data_augmentation_for_image_classification) (e.g. rotating, mirroring, cropping images to help image-based networks), the procedure is somewhat similar: it consists in randomizing features of the training simulation in order to (hopefully) real-world-proof the model that was trained on it.

{% include figure.html src="/assets/media/hopper/da_vs_dr.png" alt="Domain Adaptation vs Domain Randomization" caption="The objective of Domain Randomization is not to switch the training domain (like Domain Adaptation), but rather to extend it in order for it to eventually encompass the target domain (in our case, the real world)" %}

This approach is often used for robotic control tasks, where real-world imperfections are hard to model accurately, or in case a very high variability is to be expected.

{% include figure.html src="/assets/media/hopper/openai_dr.png" w="66%" alt="Visual Domain Randomization" caption="Domain Randomization applied to visual observations in [OpenAI's paper](https://arxiv.org/abs/1703.06907).
The agent is prepared to the real world through a myriad of randomized simulated worlds" %}

{% endcapture %}
{% include blockquote.html type="note" title="Domain Randomization" content=DR %}

## The Implementation

<a name="domaingap"></a>

The discrepancies between the (simulated) training world and the (real) target world are collectively called **Domain Gap**.  
In our case, both the training and testing environments are simulated, so the Domain Gap is too: it just consists of a weight difference between the two environments for one of the Hopper's body parts. The agent has to show good adaptability by compensating the different weight with the remaining body parts.

The project was structured with two fixed requirements and one open to each group's implementation, each building on the same dual simulation environment.

<a name="stdin"></a>

### Standard Input

Every timestep, the agent receives 11 measurements relative to its body parts (namely rotation and angular velocity of each joint, horizontal and vertical speed of the torso).  
In addition to the numerical inputs, when the agent moves forward it receives a reward, when it falls to the ground it receives a punishment (a negative reward).  
The agent can control its body parts like a robot would: that is, by applying a *finite* amount of torque to its hinges.

This data is fed as input to a Neural Network, specifically a [Multi-Layer Perceptron](https://en.wikipedia.org/wiki/Multilayer_perceptron) (MLP), which essentially operates as a very articulate state machine, mapping inputs and actions to the respective rewards.

Finding an optimal behavior then consists in figuring out, at every moment, given the 11 input measurements, the action (in the form of four motor torques) that maximizes the reward.

This is the setup that yielded (by far) the best results, for the most part thanks to its reliance on exact measurements. This is a key aspect that will be missing from the next implementations.

### Raw Image Input

In real-world applications, direct sensor data isn't always available. Often, a cheap and easily available replacement is image data, obviously to the detriment of overall accuracy.

We tried sending raw video frames from the simulation sandbox directly to a [Convolutional Neural Network](https://en.wikipedia.org/wiki/Convolutional_neural_network) (CNN), a type of Neural Network that extensively uses matrix operations such as [2D Convolution](https://en.wikipedia.org/wiki/Convolution#Discrete_convolution) in order to extract and condense information from recurring elements of images and videos.

For this, we used the standard architecture provided within the library, [NatureCNN](https://www.nature.com/articles/nature14236), which was already successful in [playing various Atari 2600 games](https://arxiv.org/abs/1312.5602) with visual observations alone.

Performances were noticeably worse, but still surprisingly high, considering the fact that the agent now has absolutely no clue about its state but single images (224×224×3 integer matrices) from an arbitrary (albeit fixed) perspective.

<small>
(Note that the agent doesn't know what its outputs do either, as it's just a series of numbers. They gain meaning only after the agent is assigned a reward for their values)
</small>

### Pipelined Network

This is the part of the project I dedicated most of my time on. It is a more complex implementation of an image-based network, as a concatenation of two separate stages.

#### Pose Estimation

The purpose of the first stage is to extract as many of the original measurements as possible from a single image.  
To do this, I employed a Pose Estimation library, called [MMPose](https://github.com/open-mmlab/mmpose), to try and reconstruct the angle of each body part.

The pose estimation library, in turn uses another neural network ([SCNet](https://openaccess.thecvf.com/content_CVPR_2020/html/Liu_Improving_Convolutional_Networks_With_Self-Calibrated_Convolutions_CVPR_2020_paper.html)), that was trained on a dataset built from a [synthetic dataset](https://en.wikipedia.org/wiki/Synthetic_data#Machine_learning):

1. MuJoCo's environment was first reconstructed as faithfully as possible in Blender;

2. Domain Randomization was applied to the hopper's appearance, randomizing its position, joint angles and colors; (This is Domain Randomization for Domain Randomization!)

3. 10,000 samples were generated from this randomized environment.

After training the network on the dataset (actually, only [fine-tuning](https://en.wikipedia.org/wiki/Fine-tuning_(deep_learning)) it), the trained model is used to infer the position of the keypoints (top of the torso, waist, knee, ankle, tip of the foot) for each image frame.

{% include figure.html src="/assets/media/hopper/hopper_keypoints.png" alt="Keypoints on the hopper" caption="Inferred positions of the 5 keypoints"%}

This and the previous frame's positions are then used to estimate all angles and velocities (The almost orthogonal camera angle allows a 1:1 a mapping between image and world coordinates).

{% include figure.html src="/assets/media/hopper/pipeline.png" alt="Pose Estimation pipeline" caption="A diagram of the final Pose Estimation pipeline" %}

#### MLP

The second stage is a Multi-Layer Perceptron akin to the one that was used in the [Standard Input](#stdin) section.  
The network is actually identical to the previous one, as the data that is provided by the previous stage is created to reflect the original values as closely as possible.  
The fact that this data was obtained with a fundamentally different method does not matter to the network itself, which just cares for the input and output formats.

Unfortunately, the final result were quite underwhelming.

Due in part to the dataset being created as an approximation in Blender instead of using the actual physics engine, the Pose Estimation network didn't perform as well as I had hoped.  
This lead to low accuracy in keypoint estimation, which in turn caused an increased learning difficulty to the agent.

{% capture trainingresults %}

A summary of original (🟧) and reconstructed (🟦) values over the length of an episode.  
Some measurements (namely absolute x and z velocity) could not be inferred due to the camera being anchored to the agent

{% endcapture %}

{% include figure.html src="/assets/media/hopper/reconstructed.png" alt="Reconstructed measurements" caption=trainingresults %}

## The Results

In conclusion, Domain Randomization worsens absolute performance (since the task *is* more difficult after all), but helps in reducing the effect of the [Domain Gap](#domaingap).

{% include figure.html src="/assets/media/hopper/results.png" alt="Final results" caption="Final Results: the lighter bars refer to results from tests on the same environment as the training (no weight shift), whereas the darker bars refer to tests on the actual testing environment (with the weight shift)" %}

In the runs where Domain Randomization is applied, the difference between the two bars is lower, thus signifying that the Domain Gap has been mitigated successfully.

{% include gif-like.html w="45%" src="/assets/media/hopper/proficient.mp4" caption="Look at him go!" %}
___

Many thanks again to [Francesco](https://github.com/Francesco-Carlucci) and [Pietro](https://github.com/PietroNoto) for sticking together through this lengthy and strenuous endeavor.

<small><small>
Domain Randomization diagram adapted from <https://lilianweng.github.io/posts/2019-05-05-domain-randomization/>  
Visual Domain Randomization scheme taken from <https://arxiv.org/pdf/1703.06907>
</small></small>

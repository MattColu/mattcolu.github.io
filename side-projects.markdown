---
layout: page
title: Side Projects
list:
    - Room
    - Lofi
    - Website
    - Piano
    - Blender
---
These are some personal projects that I worked on over the years. Most of them do not have a defined objective or timeframe like [Projects](/projects), but nonetheless I thought they were worth sharing.

<div class="side-projects-holder">
{% for sideproject_name in page.list %}
{% include side-project-summary.html title=sideproject_name %}
{% endfor %}
</div>
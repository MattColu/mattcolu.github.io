---
layout: page
title: Side Projects
---
These are some personal projects that I worked on over the years. Most of them do not have a defined objective or timeframe like [Projects](/projects), but nonetheless I thought they were worth sharing.

<div class="side-projects-holder">
{% for sideproject in site.side-projects %}
{% include side-project-summary.html page=sideproject %}
{% endfor %}
</div>
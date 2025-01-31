---
layout: page
title: Projects
---
These are the most important projects I have worked on. These are mostly well-defined tasks with a clear start and end.

{% for project in site.projects %}
{% include list-summary.html page=project miniature-w="150px" miniature-h="150px" %}
{% endfor %}
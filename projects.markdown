---
layout: page
title: Projects
list:
    - Thesis
    - Tetris
    - Hopper
    - Radray
---
These are the most important projects I have worked on. These are mostly well-defined tasks with a clear start and end.

{% for project_name in page.list %}
    {% include list-summary.html title=project_name miniature-w="150px" miniature-h="150px" %}
{% endfor %}
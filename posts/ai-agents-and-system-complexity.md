---
title: AI agents and battling system complexity
date: '2026-01-28'
---

The biggest limiting factor to developing large software systems is the complexity of the system, as noted by John Ousterhout in A Philosophy of Software Design.
This means that as developers, we must constantly be designing and architecting to reduce complexity if we want to keep expanding the system.
Complexity will come either way when adding new features, but we can reduce its growth.

This problem is more pronounced than ever due to the introduction of AI agents into our codebases.
The agents churn out features faster than ever and with it comes added complexity to the system.
With them, we can quickly end up with a system that is so complex for both agents and humans that agents can't figure out how to add new features without breaking existing ones; and humans can neither specify or verify any solutions, since they don't understand the system themselves.
The history of software shows that even human-built systems can suffer from this issue, but now we have a thousand new employees that are good at coding, but sometimes miss the mark, which exacerbates the problem.

Our role is shifting from writing code, to steering the agents toward simpler designs and architecting systems with lower complexity.
This also means we should try to formulate and document everything we know about writing good software into agent rules files.
It will be an interesting ride and I am excited to see what can be achieved.

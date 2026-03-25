---
title: Moving to a mono repo
date: '2026-03-26'
tags:
  - software-engineering
  - ai
---

We are moving to a mono repo at work. One git repository with our full codebase instead of 30+ separate ones.
Why? Because of AI. And because we should have done it even before AI turned everything upside down in software.

## People are lazy (including me)

We are all a bit lazy.
If I'm working on a feature in repo A and need a helper function that really fits into repo B, I'm forced to make two pull requests and get them both through review.
That is much more work than simply adding the helper function inside repo A, knowing that people might do the same in repo C. Code duplication grows. Technical debt piles up.

## Verifying end-to-end changes is hard

You break the API for an internal service in one repo, then make four other pull requests for the consuming services in their respective repositories.
Were there really five consuming services?
Do the changes match up exactly?
You jump back and forth between the pull request with the breaking changes and the pull requests of the consumers. Taxing and error-prone. AI reviewers suffer from the same split context problem. They can't see the breaking change when reviewing the consumer.

## Shared knowledge

With a mono repo, we keep all the relevant information and reusable components in one place with very little overhead.
Reusable Bicep files for our infrastructure, AI skills and rules, architectural decision records.
All of this context adds up and aids both humans and agents.

## The tradeoffs

With ten engineers and their agents, we will have a lot of pull requests landing in the same repository. That can be hard to keep track of.
There will be more merge conflicts.
And if someone breaks a central flow or file without our CI checks catching it, it can affect our ability to deploy not just one service, but all of them.

Still worth it.

## How we are doing it

We want to keep our git history, so we use [ToMono](https://tomono.0brg.net/) to merge in the repositories.

Then we set up [nx](https://nx.dev/) to ensure that we only compile and run tests for the relevant projects in the CI.
A tiny change in frontend should not run all of our thousands of unit and integration tests in the backend services.
Nx builds a dependency graph between your projects and uses it to infer what to build and test.
Change project A, which project B depends on but project C does not? CI runs jobs for A and B. Nothing else.

We are also setting up GitHub [CodeOwners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) and pull request rules so only the owners of a service are requested to review changes in it.

I'll write an update once the transition is complete and we know more of the ins and outs.

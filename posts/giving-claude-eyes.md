---
title: "Giving Claude Eyes"
subtitle: "Why end-to-end tests are the unlock for agentic coding"
date: '2026-05-27'
tags: ["AI", "software-engineering", "testing"]
---

Claude kept saying "all done" on broken code.
Screenshots from end-to-end tests fixed it.

I'm building [Skaffa](https://skaffa.bargsteen.com/), a grocery-list app, mostly hands-off with Claude Code.
It's a side project, so Claude has to get far without my supervision.

I started with [Dioxus](https://dioxus.com/) and a [hexagonal architecture](https://www.howtocodeit.com/guides/master-hexagonal-architecture-in-rust).
Hexagonal is overkill for a todo list.
I wanted to learn it, and the strict layering gives Claude guardrails: the ports are traits, and a missing match arm on a domain event is a compile error before it's a runtime bug.
Rust's type system already does more of that work than TypeScript or JavaScript would.
The project had unit tests and integration tests against a real Postgres.
I thought it was solid.
Claude kept declaring victory on features that didn't work, or had broken something else.

The problem: **Claude couldn't verify its work end-to-end**.
As developers, we don't just write code, run the tests, and ship.
We poke at the app, see if it works, and iterate.
Claude couldn't, and I didn't want to be its QA.

I tried `--chrome`, but it was slow, buggy at the time, and burned through tokens.
It didn't guard against regressions either.
I didn't trust Claude to remember to re-test every pre-existing flow.

## End-to-end tests with playwright-rs

I added [Playwright](https://playwright.dev/) tests that exercise every flow and *take screenshots of each view*, so Claude could see.
The false "all done"s stopped.
The UI got better too, because Claude could iterate on what it saw.

I started in Python, but every data-model change meant updating mirrored Python types, and Claude kept forgetting.
No guardrails.
Someone was building [playwright-rs](https://crates.io/crates/playwright-rs) fast: new releases every few days, feature parity one version out.
It drives the real Playwright server through a Rust client.
I migrated, and tests now look like this:

```rust
#[tokio::test]
async fn test_owner_sees_and_cancels_pending_invite() {
    let env = helpers::new_env().await;
    let seed = env.fresh_seed().await;
    let invitee = env.disposable_email("pending-cancel");

    let page = env.user1_page().await;
    page_objects::navigate_to_list(&page, &seed.groceries().id).await;
    page_objects::open_share_modal(&page).await;

    browser::fill(&page, "invite-email-input", &invitee).await;
    browser::click(&page, "invite-button").await;
    browser::wait_for(&page, "[data-testid='badge-pending']", DEFAULT_TIMEOUT).await;
    browser::screenshot(&page, "owner_sees_invite").await;

    browser::click(&page, "cancel-invite-button").await;
    browser::wait_for_text_gone(&page, &invitee, DEFAULT_TIMEOUT).await;
    browser::screenshot(&page, "owner_cancelled").await;
}
```

It exercises one slice of sharing: a pending invite shown to the owner, then cancelled.

The interesting part is the test environment.
I wanted to run end-to-end tests concurrently from multiple branches without conflicts.

I use worktrees (or *workspaces*, in [Jujutsu](https://docs.jj-vcs.dev/latest/) terms) one per branch, e.g. `skaffa/.jj-workspaces/pending-invites`.
Each workspace gets its own dev server on its own port and its own Postgres database.
A small `workspace_env` module hashes the workspace path into the port and DB name (`skaffa_test_<slug>`).
Each `TestEnv` carries a browser, a device profile (e.g. iPhone 14), and a seed scope derived from the workspace folder path.
Postgres runs as a shared singleton on the host; isolation comes from those per-workspace scopes, not from spinning up containers per branch.

It took a few iterations to land.
Now it's the single biggest productivity multiplier in the project.

## Mailpit

One gap remained: anything touching email, like magic-link auth or the share-a-list invite, kept breaking under Claude.
[Mailpit](https://mailpit.axllent.org/) fixed it.
It's a fake SMTP server that runs in Docker, catches every outbound email, and exposes an HTTP API for reading them back.
Tests fetch the invite from the inbox, pull the magic link out of the body, and click through, all from Playwright.

Zero false "all done"s on email flows.

## Where the eyes stop working

You feel the leverage most where it's missing.

Making Skaffa installable as a PWA looked easy: manifest, service worker, Add to Home Screen.
Claude wrote it.
Playwright confirmed the manifest was served, the service worker registered, and the install criteria were met.
"All done."

Then I installed it on my iPhone and the app was unusable.
The notch clipped the navbar's back button.
The home indicator sat on top of the add-item button.
`100vh` overran iOS Safari as the toolbar grew and shrank (the fix is `100dvh`, but Claude couldn't tell that from the headless screenshots).

The eyes only see what they can render.
Headless Chromium can't reproduce iOS standalone mode.
The entire failure surface was invisible, and Claude declared victory anyway.

There's no real fix here.
Claude still can't see iOS standalone.
What I did was tighten the *human* loop: I added a `--tunnel` flag to the dev command that exposes the local server over the network and prints a QR code in the terminal.
I point my phone at it, reload after each change, and tell Claude what's wrong.
It doesn't replace the missing eyes, but it shortens the iteration enough to make PWA work bearable.

## Takeaway

If you want more out of your agents, and you're tired of half-baked "all done"s, give them a way to verify their work.
The system has to be runnable by the agent, so it can poke at it like you would.

Agents do 95% of the work.
They just can't tell if it's right.

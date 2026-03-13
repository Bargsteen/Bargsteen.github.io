---
title: Stop looking at the code?
date: '2026-03-13'
---

"Code doesn't matter anymore. Just ship."
I keep hearing this from tech leads and CTOs.
I think they are wrong in most cases. Here are several arguments you can use, especially if it is your boss telling you to look away!

**High quality code is cheaper than ever!**

Code that works is ideal context for an agent to come up with a better and cleaner design.
Why is your production code not as elegant and clean as you would like?
My guess is that you didn't have the time to refactor it once it worked.
But now you do!
If you know what high quality code looks like, or can ask your agent about it, you can get the agent to refactor it.
So spend the extra couple of dollars on tokens and get the code of your dreams!

**High code quality means testability**

And that clean code pays for itself. High quality code isn't just about style.
It's very much about structure.
If the structure is good, you can easily test your code.
With more and better tests you go faster as a company because things don't break under your feet.
For example, put your own interfaces in front of external dependencies.
That gives you full control and lets you mock them.
You can then turn most of your slow integration tests into fast unit tests, at least for your business code.

**Good code is easy to understand and change**

Testability is just the start. Sloppy code is hard to understand and change.
For both agents and humans.
Imagine this: it's 3 AM, your phone buzzes, and a critical system is down.
You open your laptop, fire up your agent, and start digging through the code.
But nothing makes sense. Functions do five things at once. Names are meaningless. There are no tests to guide you.
Your agent hallucinates a fix that makes it worse.
You don't want to be in that situation.

**Agents follow established patterns in the codebase**

Here's what makes this even more important in the age of AI. Unless you are very explicit about it, agents will often try to follow the structural patterns already established in the codebase.
They will do that much faster than your human interns or junior engineers could in the past.
It is therefore crucial that you establish good patterns from the start.
Then you can really fly fast with agents.

**Business requirements should live in code**

Beyond structure, there's another reason to care about code. Business requirements can be complex and they have to be precise.
English is rarely precise enough.
It has built-in ambiguity.
Code on the other hand, is designed to represent even the most complex domains.
If you use languages with a low degree of syntactical noise, such as F#, your domain experts can even read the code.
At Aleta, we were building a benchmark system for our clients' assets.
We defined records, discriminated unions, and function signatures for all the core business logic.
Then we had our colleague with a finance background review and correct it directly in the code.
That would not have been possible if we had stopped caring about code quality.

**Code is sometimes the only way to verify correctness**

If you vibe-code an app with a GUI it is often quite easy to verify that clicking the button does what you expect.
But how does a change to the core business logic affect your financial software system with 50+ microservices that unfortunately aren't cleanly separated and all communicate with a mix of HTTP and message queues?
In those situations, the code is often the best place to look when verifying the correctness.
Of course you can try to add more integration tests or add more interfaces to improve testability, but even so, you will likely want to look at the code.

**But not all code is equal**

Now, to be fair. Notice the "sometimes" in the reason above.
It indicates that *sometimes* there *are* other ways to verify the correctness.
Most companies have a mixture of domain-heavy services but also lighter frontends that use these services.
They also have boilerplate code dealing with database queries, HTTP calls etc.
So not all code must be of equal quality.
Code that lives in a leaf, i.e. where no other code depends on it, can often be of lower quality.
But establishing good patterns in those areas still pays off, I believe.
Once the patterns are in place, though, perhaps it is sufficient to have other agents review it.

**Not all pull requests are equal**

A direct consequence of the above is that not all PRs are equal.
If you make changes to code that is not at the core of your business and you have a good structure, tests, and observability in place, then perhaps you don't need another person to review it.
Just get it into production and verify it yourself.
Can you set up specific rules about what code needs human eyes and how thorough a review it must be?

Do you agree or disagree?
Next time someone tells you to stop reading the code, send them this post.

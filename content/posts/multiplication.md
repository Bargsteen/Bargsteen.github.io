---
title: "Multiplication"
date: 2019-06-01T08:51:47+02:00
draft: true
categories: [math]
tags: [elementary-math]
---

<!-- 

Overview:
Intro
Show multiplication example
What we need to know:
  - Some definitions and laws that build upon each other
  - Addition definition:
      - Counting principle
      - First law: commutative
      - *** + ** = ** + *** => a + b = b + a
  - Multiplication definition
      - Based on addition, and thereby counting
      - a groups of b
      - ***  
        *** = 3 groups of 2, or 2 groups of 3. Commutative law again!
  - Distributive law
      - Multiplication can be done in parts, and then combined
        *****   =   *** + **
        *****   =   *** + **
        2 x (3 + 2) = 2 x 3 + 2 x 2
      - This is the distributive law, and the second last piece of the puzzle!
      - Works for any split:
        ****** = ***** + * = **** + ** = *** + ***
        ****** = ***** + * = **** + ** = *** + ***
      - and from the commutative law, we know that **** + ** = ** + ****
  - Positional number system
      - Last piece: understanding our number system.
      - Roman numerals: 
          - XXV, all X's = 10, All V's = 5.
          - Subtraction rule: write IV instead of IIII. 
            - Still, each letter always represents the same amount.
            - How to write 11 thousand in Roman? MMMMMMMMMMM. Not very efficient.
          - Positional number system: 33, these 3's are not equal!
          - Means: 3 x 10 ^ 1 + 3 x 10 ^ 0. (for any number x, x^0 = 1)
  - Putting it all together:
      - 12 * 3 = ************  = ** + **********
                 ************  = ** + **********
                 ************  = ** + **********
      - We can split this! 3 x (2 + 10) = 3 x 2 + 3 x 10
 -->

# Why the Multiplication Algorithm Works

Why does the standard multiplication algorithm work? You know the one, it goes like this:
```
12 * 3
------
     6
    30
------
    36
```
I mean, I've used it innumerable times throughout my school years, but I never really understood it. That is, until now.
My interest in math, or maths if it pleases you, have varied over the years. In school and high school I received high grades because I could use the algorithms and I even enjoyed some of the subjects, but my understanding of the subjects were poor. At university, where I study Software Engineering, I was introduced to the subjects Linear Algebra and Discrete Mathematics. I understood some of the content, but once again, I mostly relied on my ability to memorize and use the algorithms. Math is often described as a *tall* subject because it builds upon many layers of understanding. This, I think, is one of the reasons why so many people do not enjoy math. If you miss a class, or simply do not have the time to really get a particular subject, it might affect you for the rest of your time in school. Even a tiny hole in your understanding of the basics can leave gaping crators further up the chain.
The first time I really and thoroughly enjoyed myself in math was during a course on Automata Theory, a branch of Computer Science, because, as opposed to previous subjects, it started from scratch with an introduction to its basic building blocks. It was a fresh start, a chance for me to learn without carrying along my baggage of gaping holes and crators.
Subsequently, I was intrigued by the idea of relearning the basics of mathematics with a focus on *understanding*, such that I could enjoy a larger part of the field. As I typically do, I set out to find the perfect work book, and, luckily, I stumbled upon the book ![Math Overboard]() by ___.
The premise of the book is to teach understanding above, or on equal terms, with the algorithms, starting from 0th grade math curriculum and going through high school and even early parts of university.
Through the book, I learned how and *why* the multiplication algorithm works. This goal of this post is thus to share this knowledge and further my own understanding of the idea. Let's get on with it!

## What we need to know
Something that dawned on me while reading the book, is how important *definitions* and *laws* are in math. The understanding and proofs often rely on a few key definitions and laws. For our purposes, this regards the definition of addition and multiplication along with the a couple of related laws. But do not worry, I will explain all of what you need to know!

### Addition
As you might know, multiplication can be seen as repeated addition, but how is addition itself defined?
Addition builds on the *counting principle*, which simply is, well, counting!
`3 + 4` means to count a group of `3` objects, followed by a group of `4` objects, without resetting the count to 0 in between. `1, 2, 3, 4, 5, 6, 7`, so `3 + 4 = 7`. Easy, right? In general `a + b`, where `a` and `b` are two arbitrary numbers, the result is what you get from counting each object in the group of size `a` followed by each object in the group of size `b`---again without resetting the count to 0 in between.
This brings us to our first law. The *commutative law*, which states that for any two arbitrary numbers, `a` and `b`, it does not matter which group you count first: `a + b = b + a`. 
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
```go
12 x 3
------
     6
    30
------
    36
```
I mean, I've used it innumerable times throughout my school years, but I never really understood it. That is, until now.

## Motivation
My interest in math, or maths if it pleases you, have varied over the years. In school and high school I received high grades because I could use the algorithms and I even enjoyed some of the subjects, but my understanding was, in general, poor. At university, where I study Software Engineering, I was introduced to the subjects Linear Algebra and Discrete Mathematics. I understood some of the content, but once again, I mostly relied on my ability to memorize and use the algorithms. Math is often described as a *tall* subject because it builds upon many layers of understanding. This, I think, is one of the reasons why so many people do not enjoy math. If you miss a class, or simply do not have the time to really get a particular subject, it might affect you for the rest of your time in school. Even a tiny hole in your understanding of the basics can leave gaping crater further up the chain.
The first time I really and thoroughly enjoyed myself in math was during a course on Automata Theory, a branch of Computer Science, because, as opposed to previous subjects, it started from scratch with an introduction to its basic building blocks. It was a fresh start, a chance for me to learn without carrying along my baggage of gaping holes and craters.
Subsequently, I was intrigued by the idea of relearning the basics of mathematics with a focus on *understanding*, such that I could enjoy a larger part of the field. As I typically do, I set out to find the perfect work book, and, luckily, I stumbled upon the book [Math Overboard by Colin W. Clark](https://www.amazon.com/Math-Overboard-Basic-Adults-Part-ebook/dp/B00GUTGWWU).
The premise of the book is to teach understanding above, or on equal terms, with the algorithms, starting from 0th grade math curriculum and going through high school and even early parts of the university curriculum.
Through the book, I learned how and *why* the multiplication algorithm works. The goal of this post is thus to share this knowledge and further my own understanding of the idea. Let's get on with it!

## What we need to know
Something that dawned on me while reading the book, is how important *definitions* and *laws* are in math. The understanding and proofs often rely on a few key definitions and laws. For our purposes, this regards the definition of addition and multiplication along with the a couple of related laws. But do not worry, I will explain all of what you need to know!

### Addition Definition and the Commutative Law
As you might know, multiplication can be seen as repeated addition, but how is addition itself defined?
Addition builds on the *counting principle*, which simply is, well, counting!
`3 + 4` means to count a group of `3` objects, followed by a group of `4` objects, without resetting the count to `0` in between. `1, 2, 3, |  4, 5, 6, 7`, so `3 + 4 = 7`. Easy, right? In general, for `a + b`, where `a` and `b` are two arbitrary numbers, the result is what you get from counting each object in the group of size `a` followed by each object in the group of size `b`---again without resetting the count to `0` in between.
This brings us to our first law. The *commutative law*, which states that for any two arbitrary numbers, `a` and `b`, it does not matter which group you count first: `a + b = b + a`. The result, will always be the same - neat!

### Multiplication Definition and the Commutative Law
Multiplication is, as stated above, *repeated* addition and it therefore also relies on the counting principle! `3 x 4` means to count the objects in `3` groups of size `4` without resetting in between. `1, 2, 3, 4, | 5, 6, 7, 8, |  9, 10, 11, 12`, so `3 * 4 = 12`. In general, for `a x b`, where `a` and `b` are two arbitrary numbers, the result is what you get from counting the objects in `a` groups of size `b`.
As it turns out, the commutative law also holds for multiplication: `a x b = b x a`. We can see the problem as counting `a` groups of size `b` OR `b` groups of size `a`. Let's see an example, to get this idea straight.
Here we have `6` items. 
```go
***
***
```
It can be seen as `2` groups of `3`, if you look at them as rows. Or it can be `3` groups of size `2` if you look at the columns!

### The Distributive Law
It turns out that the process of multiplication, can be split up into smaller subtasks, which makes sense, because you can always count for a bit, take a breath, and then go on counting! This law seems a bit more complicated at first, because it uses both addition and multiplication at once, but stay with me! First, a numerical example: `2 x (3 + 2) = 2 x 3 + 2 x 2`. Hm, what is going on here? Let's see it graphically!
```go
*****     *** **
       =
*****     *** **
```
On the left side, we see `2` groups of size `5`, where as on the right, we see `2` groups of size `3` and `2` groups of size `2`. There is also an equal sign in the middle, because the two sides are of the same size if you count them. As I said, we can split up the process of counting into smaller parts that are easier to handle. Which is a key ingredient to the multiplication algorithm! In general, the law states that `a x (b + c) = a x b + a x c`, where `a`, `b`, `c` are arbitrary numbers. From right to left, we can see it as merging the `b` and `c` groups before counting `a` of them. From left to right, it can be seen as splitting the `b + c` group in to `b` and `c`groups and counting `a` groups of each. In other words, `a` is *distributed* among `b` and `c` - which is why it's called the *distributive law*!
In the previous example, I decided to split `5` in to `3` and `2`, but any split is equally valid!
```go
*****   **** *   *** **
      =        =     
*****   **** *   *** **
```
And from the commutative law, we know that `*** + ** = ** + ***`, so the reversed splits are also valid.

### The Postional Number System
The last piece of the puzzle, is the positional number system. To better understand its function, let's start by looking the *Roman numerals*.
As you might know, the Romans used letters such as `X`, `V`, and `I`---corresponding to values `10`, `5`, and `1` respectively--to respresent their numbers. The largest number representable by a single letter is `1.000`, which is represented by the letter `M`. A number such as `11.000` is thus written as `MMMMMMMMMMM`, which is already quite long---imagine the Earth's age or the number of stars in the universe using Roman numerals! The problem is that each letter *always* has the same value no matter its position. There is an additional rule to the Roman numbersystem, which is the subtraction rule, where i.e. the value `4` is written as `IV` instead of `IIII`. When smaller valued letters precede a large one, it subtracts. But the *value* of each letter is still the same, no matter its position!
As you might have guessed by the section title and my talk of positions, our number system works differently: the position changes the value of the numbers! Take `333` as an example. There three `3`s are *not* the same. From the left, they mean `300`, `30`, and `3`, respectively. This makes writing large numbers much easier! (For those interested, the general pattern uses the position, starting from `0` and going left, as the power for a base of `10`---therefore the name *base-ten positional number system*---the name, e.g. `3 x 10^2 + 3 x 10^1 + 3 x 10^0` where `x^0 = 1` for any `x`).

## Putting it all together
Now for the big final. Let's put the pieces together via the original example `12 x 3`. The `1` is really a `10`, due to the positional number system, and graphically we can see it as the following.
```go
***********

***********

***********
```
So `3` groups, or rows, of size `12`. It seems like an awful lot of counting.. Let's use the distributive law to at least split the task in to more manageable parts.

```go
***********   ** *********

*********** = ** *********

***********   ** *********
```
Ok, so `3` groups of size `2` equaling `6` plus `3` groups of size `10` equaling `30`. Hold up, this sounds familiar!
This is exactly, what the multiplication algorithm does! Here it is, once again.
```go
12 x 3
------
     6
    30
------
    36
```
Split the task into reasonable chunks, and then add them all together, distributive law-style! We could have split each of the `3` groups in to `2` of size `6`, and nothing stops you for doing that. It is, however, common to split it up by ones, tens, hundreths, etc. when multiplying. Let us look at one final example. It should be something big, right? How about `123 x 12`? Here, we have several options. We could start with just the ones, i.e. `2 x 3` or go with the ones from the left, and all `12` from the right. The result does not change, as long as you remember the actual value of each number as per the positional number system, you can split the task any way you would like!

```go
123 x 12         123 x 12
--------         --------
      36                6
     240    OR         40   OR  ??
    1200              200
--------               30
    1476              200
                     1000
                 --------
                     1476
```  

I hope you enjoyed this little insight. I know that I have, and it's been lovely to try and teach you something. If you are interested in more of these examples, let me know in the comments, and the if you are really keen, the [Math Overboard](https://www.amazon.com/Math-Overboard-Basic-Adults-Part-ebook/dp/B00GUTGWWU)-book is highly recommended!

Keep learning
 - Kasper
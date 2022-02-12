---
title: "Track release: Sporadic Contemplation"
date: '2021-02-12'
---

I released a new track called Sporadic Contemplation!
And you can listen to right here:

<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/track=3842209562/size=large/bgcol=ffffff/linkcol=7137dc/tracklist=false/artwork=small/transparent=true/" seamless><a href="https://kadiba.bandcamp.com/track/sporadic-contemplation">Sporadic Contemplation by Kadiba</a></iframe>

As something new, I experimented with using randomness for generating part of
the song.
In particular, I generated the chord sequences for the synth that you hear
throughout the track.
If you're interested in how that works, continue reading!

What I wanted was to generate random chords in the key of the song, F major.
The first thing I added was the **arpeggiator** plugin, which I configured so it
creates a single random MIDI node at a set interval.
This note is then sent through the **chord** plugin, which adds additional MIDI
notes in *fixed* intervals. That is, for any note it receives, it adds notes four,
seven, and 14 semitones above it. This corresponds to adding a major third, fifth,
and ninth notes on top.
With these two plugins configured, I got random major-add9 chords in *any* key.

Next, I added some variation in the *types* of chords, because I did not just
want major-add9 chords every time.
I used the **random** plugin to transform each of the four notes from the
chord plugin into a random note (with a 50% chance of keeping the original note).
And finally, I used the **scale** plugin to force all four notes into the F
major scale (by moving them to adjacent notes that fit the key).

And voila! I had a random sequence of interesting chords in F major.

The figure below shows the generative part of the plugin chain along with
settings for each plugin.

{% figure "/img/sporadic-contemplation/ableton_live_plugins.png" "Generating random chords in the key of F major" %}

With this setup, I then recorded a long sequence of random chords, listened
through them and found a good section.
I edited the section slightly, which was easy to do, as it was MIDI.
Then I looped the section and I had the basis of my track!

Next up, I added a drum loop, found some choir vocals on
[freesound.org](https://www.freesound.org), recorded a guitar solo, and then called it a day!

And that's it. Let me know what you think of the tune.

Until next time,
- Kasper

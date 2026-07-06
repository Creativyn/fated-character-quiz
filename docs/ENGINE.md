# Fated VN Engine

Version 1.0

---

# Vision

The Fated VN Engine exists to tell stories through emotion rather than complexity.

Its purpose is not to imitate large visual novel engines, but to provide a lightweight, modular framework for cinematic quizzes and interactive experiences set within the world of Fated.

The engine values:

- simplicity
- readability
- modularity
- maintainability
- accessibility
- emotion

Above all else:

> Content belongs in data.
> Behavior belongs in the engine.

---

# Design Philosophy

The engine should require very little code to create a new experience.

Ideally, adding a new personality, quiz, or story should involve editing data rather than changing engine logic.

Good engine code should rarely need to change.

---

# Core Principles

## 1. Data-Driven Design

Characters are data.

Scenes are data.

Questions are data.

Themes are data.

Sound is data.

The engine simply interprets those data structures.

---

## 2. Modular Systems

Every major responsibility belongs to a single module.

Examples:

SceneRunner

plays scenes

CinematicController

controls the reveal

AudioController

handles all sound

PreferenceManager

stores user preferences

Theme System

controls colors and appearance

Effects

small reusable animations

No module should perform another module's responsibility.

---

## 3. Progressive Enhancement

The engine should always function even when optional assets are unavailable.

Examples

No portrait

→ placeholder

No music

→ silent reveal

Reduced motion

→ simplified animation

Missing background

→ default theme

The experience should degrade gracefully.

---

## 4. Accessibility First

Animations respect

prefers-reduced-motion

Audio can be disabled.

Preferences persist.

The interface remains usable without cinematic effects.

Accessibility is a feature.

Not an afterthought.

---

## 5. Content Over Effects

Effects should support emotion.

They should never become the focus.

If an animation distracts from the character reveal,
it should be simplified or removed.

Restraint creates elegance.

---

# Project Structure

```
config/
```

Character definitions

Themes

Audio themes

```
data/
```

Questions

Scene data

```
vn/
```

Engine

SceneRunner

Effects

Controllers

```
ui/
```

Rendering

Share cards

Results

```
utils/
```

Reusable helpers

Preferences

Audio

Device utilities

```
assets/
```

Portraits

Backgrounds

Music

Sound effects

Interface graphics

```
docs/
```

Engine documentation

Soundtrack

Future design notes

---

# Scene Philosophy

Scenes are arrays.

The engine reads them sequentially.

Example

```
text

wait

render

reveal

bars

hideOverlay
```

The controller interprets each step.

The scene itself contains no business logic.

---

# Personality Philosophy

Every personality should define only its identity.

Example

```
id

name

heading

quote

description

portrait

color

accent
```

Everything else should be handled automatically.

Adding a personality should never require editing engine code.

---

# Audio Philosophy

Music should reinforce emotion.

Ambient establishes atmosphere.

Reveal celebrates identity.

Tick provides rhythm.

Final creates emotional closure.

Silence is preferable to excessive sound.

---

# Visual Philosophy

Color should communicate personality.

Animations should feel natural.

Movement should be slow, deliberate, and readable.

The reveal should feel magical rather than flashy.

---

# Future Expansion

The engine is intentionally generic.

Possible future projects include:

- Character Quiz
- Relationship Quiz
- Kingdom Alignment Quiz
- Companion Quiz
- Interactive Story
- Visual Novel
- Lore Explorer

These experiences should all be able to reuse the same engine.

---

# Versioning

Major versions indicate architectural changes.

Minor versions add features.

Patch versions fix bugs.

The goal is long-term stability.

---

# Guiding Principle

Every new feature should answer one question:

**Does this make it easier to create meaningful experiences without making the engine harder to understand?**

If the answer is no, the feature probably does not belong.

---

# Closing Thought

The Fated VN Engine was built with the belief that software can support storytelling without overshadowing it.

The player should remember the characters.

The engine should quietly disappear behind the experience.

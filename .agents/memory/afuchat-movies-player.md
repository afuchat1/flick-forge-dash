---
name: AfuChat Movies player content constraint
description: Why the in-app "Play" experience shows a trailer, not the full film, and how the player is built.
---

The app only has TMDB metadata + YouTube trailer keys — there is no licensed video source for full movies/episodes. "Fully functional player" was interpreted as: real custom playback controls (seek, volume, fullscreen, keyboard shortcuts) wrapping the trailer video, not a fake film stream.

**Why:** Building a player that pretends to stream full films without actual rights/content would be deceptive. The honest approach keeps the UI clear that it's playing "Official Trailer" while making the player itself fully real (YouTube IFrame API driven, not just an embedded iframe with default controls).

**How to apply:** Any future "watch" feature in this app should route through `/watch/:type/:id` → `WatchPage` → `VideoPlayer`, and continue labeling content honestly (e.g. "Play show trailer") rather than implying per-episode/full-movie playback that doesn't exist.

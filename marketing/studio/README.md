# Al-Ostath studio

Al-Ostath Foundation's marketing videos, built in code with [Remotion](https://www.remotion.dev) 4.0.541. Each video is a
composition in `src/` and reads its lines and roles from `../videos/<id>/script.json`. The pipeline (timeline, prep,
render, stills) is the one built for Semo and Seeat Al-Masaken, re-dressed in Al-Ostath's identity.

```sh
npm install
npm run prep -- 01-question-first             # the site's logos and pattern, the typefaces, and the video's audio → public/
npm run dev                                   # Remotion Studio: preview (with sound once the voices exist)
npm run stills -- 01-question-first           # one still per scene, once its last line has played → out/stills/01-question-first/
npm run stills -- QuestionFirst 45 900        # chosen frames → out/stills/QuestionFirst-45.png … (SCALE=1 for full size)
npm run render -- 01-question-first --draft   # a silent cut → ~/Movies/Al-Ostath Marketing/<id>/draft-silent.mp4 and
                                              #   «01 السؤال قبل الاسم - مسودة بدون صوت.mp4» on the Desktop
npm run render -- 01-question-first           # the finished video → ~/Desktop/فيديوهات الأستاذ/«01 السؤال قبل الاسم.mp4»
```

`render` masters the sound to −14 LUFS (the social platforms' level) and files the video under a clear name in
«فيديوهات الأستاذ» on the Desktop; the previous cut of the same name moves to «نسخ سابقة» with its date. It refuses a
video with no voice lines yet: use `--draft` for those.

- Everything in `public/` is prepared by `prep` and gitignored: rerun it after syncing the site.
  - `public/site/assets/`: the site's `public/assets/alostath-*` (logos, inverse logos, the gold pattern), as they are.
  - `public/fonts/`: IBM Plex Sans Arabic and IBM Plex Mono, downloaded once from a pinned commit of Google Fonts'
    repository (OFL). `prep` warns if `src/styles/tokens/fonts.css` stops naming them.
  - `public/media/<id>/`: the voice lines from `~/Movies/Al-Ostath Marketing/<id>/lines/` (`<nn>-<role>.mp3` or a
    plain `<nn>.mp3`), each set to −23 LUFS so lines from different takes match, with their word timings
    (`<nn>.words.json`) when they exist.
- The timing follows the voice lines (`public/media/<id>/manifest.json`): with no audio yet, each line gets an estimate
  from its length, so a video can be built and reviewed silent. Dropping the lines in and rerunning `prep` re-times it;
  scene beats are keyed on words (`wordFrame`), so they move with the real read.
- Never edit the site from here: everything the studio needs is copied by `prep`.

## The house rules for drawn videos

- **Hand-drawn, on brand.** Line work goes through roughjs (`components/Sketch.tsx`): ink `#23271A` on the ivory paper
  `#F4F6EE`, redrawn every 5 frames from three seeds (a gentle boil). Boxes are CSS borders wobbled by an SVG filter, so
  their text stays crisp.
- **Colour by role** (`brand.ts`): olive for structure and the teacher's words, gold for light and celebration, sage for
  the student and a tick, rust (the site's error colour) only for alarm and a shemagh's checks. Nothing else.
- **Type** is IBM Plex Sans Arabic; figures switch to IBM Plex Mono (`rich()` in `components/Words.tsx`); Western digits.
- **The logo** is the full `alostath-logo.png`, framed by its visible lockup (`logoWidth`): the header file is cropped
  so tight that it clips the «ذ». It shows in the first second and on the end card.
- **Saudi, specifically**: thobes and kufis, the teacher's shemagh and iqal, the grandfather's ghutra and gold-trimmed
  bisht, the dallah, a Sadu rug and back cushions, and the Saudi week (school Sunday to Thursday, Friday with family).
- **Platform-safe**: drawings, tags and captions stay above y ≈ 1480; the bottom of the frame is left to the platforms'
  captions and buttons.

## Shared code

- `src/lib/timeline.ts`: `buildTimeline(script, plan, manifest, transition)`, `wordFrames`, `wordFrame`, `loadManifest`.
- `src/lib/motion.ts`: `progress`, `fade`, `rise` and the easing curves.
- `src/components/Sketch.tsx`: `Sk` (roughjs shapes), `Box` (a hand-drawn box around HTML), `Canvas`, `WobbleDefs`.
- `src/components/People.tsx`: `Kid` (a student behind a desk), `StandingKid`, `Teacher`, `Sitting` (grandfather,
  teacher, boy, girl).
- `src/components/Things.tsx`: `Bulb`, `Plank`, `Window`, `Ring`, `Tick`, `Timer`, `Spider`, `Dallah`, `Finjan`,
  `Gift`, `Trap`, `Lamp`.
- `src/components/Words.tsx`: `Tag`, `Label`, `Bubble`, `Captions` (the spoken words, a few at a time, karaoke style).
- `src/components/StrategyCard.tsx`: the end card every strategy video closes on (name stamp, English name, steps on
  their words, logo, site, source). `Page.tsx` (a scene on the paper) and `SceneAlone.tsx` (per-scene compositions).
- `People.tsx` also has `SeatedKid` (a student at a desk, front view: chatting, tapping, head down, writing, turning to
  a partner) and `ManHead` (a head in shemagh and iqal, for crowds).

## 01-question-first «السؤال قبل الاسم»

`src/question-first/`, composition `QuestionFirst` (and `QuestionFirst-<n>-<Scene>` for each scene alone): the classroom
of thirty bulbs (`Classroom.tsx`), the class scenes (`ClassScenes.tsx`), Friday at the family house and the night before
(`HomeScenes.tsx`), the end card (`End.tsx`), and the scene plan with every beat on a word (`timeline.ts`). The story,
the decisions and the lines to voice are in `../videos/01-question-first/README.md`.

## 02-fix-it-small «أخفّ تدخّل»

`src/fix-it-small/`, composition `FixItSmall`: the side-view classroom with the board, the pizza and the lesson's player
badge (`Room.tsx`), the cinema and the intervention ladder (`Cinema.tsx`), the scenes (`Scenes.tsx`) and the plan
(`timeline.ts`). The story and the lines to voice are in `../videos/02-fix-it-small/README.md`.

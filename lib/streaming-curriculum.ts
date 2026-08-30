/**
 * CrossBridge Church (CBC) — Live Streaming Team Training Curriculum
 * ------------------------------------------------------------------
 * ⚠️ ROUGH DRAFT. This track was written from screenshots of the booth Mac
 * mini — the Ecamm Live window (scene list, overlays, camera switcher, camera
 * effects, sound levels) and the 15-key Stream Deck profile — plus the wiring
 * documented in the SQ-6 Sound Manual. Scene names and button positions match
 * what is on the machine today. Anything marked "confirm in the booth" is an
 * inference from the screenshots and should be verified with the tech lead
 * before this is treated as authoritative.
 *
 * It reuses the Module / LessonSection / QuizQuestion / TrainingPhase types
 * from the Sound Tech curriculum so it renders through the same ModuleRunner.
 * Section visuals whose key starts with "stream-" are drawn by
 * components/StreamingVisual.tsx (annotated recreations of the two booth
 * screenshots and the signal path) — LessonVisual delegates those keys to it.
 *
 * To edit a lesson: change its `sections`. To add a module: append to
 * `streamingCurriculum` and list its slug in a phase below.
 */

import type { Module, TrainingPhase, ResolvedPhase } from "./curriculum";
import { streamingShots } from "./streaming-shots";

const streamingCurriculumBase: Module[] = [
  // ── Chapter 1 · Get Oriented ─────────────────────────────────────────────
  {
    slug: "stream-overview",
    order: 1,
    title: "How the CrossBridge Stream Works",
    subtitle: "The four pieces of the booth rig, how they connect, and the words we use.",
    icon: "🎥",
    estMinutes: 10,
    objectives: [
      "Name the four pieces of the streaming rig and what each one does",
      "Sign in to the booth Mac mini and start the rig in the right order",
      "Use the words scene, source, overlay, preview, and live correctly",
    ],
    sections: [
      {
        heading: "Why we stream",
        body: "Every Sunday there are people who cannot be in the room — the sick, the traveling, the homebound, the person checking out CrossBridge before they ever walk through the door. The stream is how the gathering reaches them.\n\nA good stream is like good sound: invisible. Nobody should be thinking about the camera work. They should be able to see who is talking, read the slides, hear the words clearly, and forget there is a computer in the middle of it.\n\nThat is the whole job — and it is a job you run with two tools: Ecamm Live on the booth Mac mini, and the Stream Deck sitting next to it.",
      },
      {
        heading: "The four pieces",
        body: "Everything in the booth falls into one of four groups:\n\n- THE COMPUTER: a Mac mini running Ecamm Live. Ecamm is the switcher — it takes the cameras, the slides, and the audio, arranges them into looks we call SCENES, and sends the result to YouTube and Facebook.\n- THE STREAM DECK: a 15-key Elgato keypad. Each key is a shortcut into Ecamm — mostly one key per scene, plus Preview Mode, Dashboard, and Go Live. It is the control surface you will actually use during a service.\n- THE VIDEO SOURCES: two cameras and the slides computer. Each camera reaches the Mac through an Elgato Cam Link 4K HDMI capture stick, which is why Ecamm lists them as 'Cam Link 4K' and 'Cam Link 4K 2'. The slides arrive from the Proclaim computer and show up in the Camera Switcher as 'NATHANS-MAC … Proclaim - CBCR2'.\n- THE AUDIO: the stream mix from the SQ-6 in the sound booth, arriving over a Focusrite Scarlett 2i2 USB interface. You do not build that mix — the sound tech does. You just make sure it is present and at a sane level.",
        visual: "stream-signal-map",
        tip: "Nothing in the video path fixes a bad audio mix, and nothing in Ecamm fixes a camera that is switched off. Know which of the four pieces a problem lives in before you start clicking.",
      },
      {
        heading: "Signing in to the booth Mac",
        body: "The login for the booth computer is printed on the Mac mini itself. Look at the machine — you do not need to ask anyone, and you do not need it written anywhere else.\n\nA few rules that go with that:\n\n- Do not photograph the label, post it in a group chat, or copy it into a document. It stays on the machine, in the booth.\n- Do not change the password. Half the team needs this login on a Sunday morning.\n- Do not sign in to personal accounts on the booth Mac, and do not install anything. This computer has one job.\n\nIf the label is missing or the login does not work, stop and get the tech lead rather than trying passwords.",
      },
      {
        heading: "Start-up order",
        body: "Order matters. Ecamm looks for its video sources when it launches and when a source reconnects — if the cameras are dark when Ecamm opens, its scenes come up showing the black 'No Signal' card.\n\n1. Turn the cameras on first, both of them. Give them a few seconds to wake up and output HDMI.\n2. Make sure the slides computer is on, on the network, and running Proclaim.\n3. Wake the Mac mini and sign in (the login is on the machine).\n4. Open Ecamm Live. The Stream Deck keys light up with scene thumbnails once Ecamm is running.\n5. Open the Camera Switcher and confirm all three sources are showing a picture — not the black 'No Signal' card.\n6. Check the Sound Levels window: the Scarlett 2i2 should be unmuted with the service audio moving its meter.\n7. Load the OPENING LOOP scene and leave it up until it is time to go live.",
        visual: "stream-startup",
        tip: "Cameras on, slides up, then Ecamm. Doing it in that order avoids most of the 'No Signal' problems you would otherwise spend the pre-service half hour chasing.",
      },
      {
        heading: "The words we use",
        body: "The rest of this track leans on six words. Learn them now and the software stops feeling mysterious:\n\n- SOURCE: one input — a camera, the slides computer, an audio device. Sources are the raw ingredients.\n- SCENE: a saved arrangement of sources — 'wide shot on the left, slides on the right'. Our scenes are already built. You pick them; you do not build them on a Sunday.\n- OVERLAY: something laid on top of the scene — a title card, a lower third, a picture-in-picture. Some of ours show in every scene, some only in the current one.\n- PROGRAM: what is going out to YouTube and Facebook right now. In Ecamm this is the big picture in the middle of the main window.\n- PREVIEW: a staging area. With Preview Mode on, you can set up the next look and check it before it reaches the stream.\n- LIVE: the stream is actually running and people are watching. Ecamm's Stream & Record button and the Stream Deck's Go Live key control this — and only this.",
      },
    ],
    quiz: [
      {
        question: "Where do you find the login for the booth Mac mini?",
        options: [
          "It is printed on the Mac mini itself",
          "It is posted in the volunteer group chat",
          "Ask any greeter before the service",
          "There is no login — the machine is always unlocked",
        ],
        answer: 0,
        explanation:
          "The login is printed on the Mac mini in the booth. It stays on the machine — do not photograph it, share it, or change it.",
      },
      {
        question: "What is a SCENE in Ecamm Live?",
        options: [
          "One camera input",
          "A saved arrangement of sources — the look that goes to the stream",
          "The audio mix coming from the SQ-6",
          "The recording saved to the Mac",
        ],
        answer: 1,
        explanation:
          "A source is one input; a scene is a saved arrangement of sources, like 'wide shot plus slides'. On Sunday you pick scenes — you do not build them.",
      },
      {
        question: "Why do we turn the cameras on before opening Ecamm Live?",
        options: [
          "Ecamm cannot start without a camera connected",
          "So the cameras have HDMI running when Ecamm looks for them — otherwise scenes come up on the black 'No Signal' card",
          "It makes the stream higher quality",
          "It does not matter what order you use",
        ],
        answer: 1,
        explanation:
          "The Cam Link sticks pass through whatever HDMI they see. Dark cameras mean 'No Signal' cards in the scenes, so cameras and slides come up first, then Ecamm.",
      },
      {
        question: "Where does the audio on the stream come from?",
        options: [
          "A microphone on the Mac mini",
          "The cameras' built-in microphones",
          "The stream mix from the SQ-6, arriving on the Scarlett 2i2 USB interface",
          "It is added later, after the service",
        ],
        answer: 2,
        explanation:
          "The sound tech builds the stream mix on the SQ-6 and it reaches the Mac over the Scarlett 2i2. Your job is to confirm it is present and at a sane level — not to remix it.",
      },
    ],
  },

  // ── Chapter 1 · Get Oriented ─────────────────────────────────────────────
  {
    slug: "stream-ecamm-tour",
    order: 2,
    title: "Ecamm Live, Window by Window",
    subtitle: "A guided tour of the main window and every panel open on the booth Mac.",
    icon: "🖥️",
    estMinutes: 14,
    objectives: [
      "Locate any control in Ecamm Live from the main window or its panels",
      "Explain what the Scenes, Overlays, Camera Switcher, and Camera Effects panels do",
      "Know which controls are safe to touch during a service and which are not",
    ],
    sections: [
      {
        heading: "The main window",
        body: "The big window is Ecamm's cockpit. Working around it:\n\n- TOP LEFT — the scene selector. It always names the scene that is currently on the stream ('WS + SLIDES' in the booth screenshot). Click it for a drop-down of every scene.\n- TOP CENTER — 'Stream & Record'. This is the button that puts you on air and starts the local recording. Next to it are the source buttons for adding a camera or a screen share, and the 'Pro' button for remote guests. On a normal Sunday you will not touch these — the Stream Deck's Go Live key does the same job.\n- TOP RIGHT / RIGHT EDGE — the tool rail: layouts, images and overlays, audio, effects, music, comments, guests, zoom, and the settings gear. Every panel described below is opened from this rail.\n- THE MIDDLE — the program picture. This is what the stream is showing right now. Watch this, not the Stream Deck, when you make a change.\n- BOTTOM LEFT — the 'Preview Mode' toggle.\n- BOTTOM RIGHT — 'New', which creates a scene. Never on a Sunday.",
        visual: "stream-ecamm-window",
        tip: "The scene name in the top-left corner is your single source of truth for what is going out. If it does not match what you meant to send, fix that before anything else.",
      },
      {
        heading: "The Scenes panel",
        body: "Titled 'Scenes (CrossBridge)' — the saved looks for our services, eleven of them, in the order the team uses them. The two buttons at the top switch between a list view and a thumbnail grid; thumbnails are easier to learn from, the list is faster to scan once you know the names.\n\nAlong the bottom of the panel is a row of buttons: add a scene, duplicate a scene, group into a folder, snapshot, share, and delete (the trash can). Every one of those is an editing tool.\n\nThe rule: on a Sunday you SELECT scenes and nothing else. Do not rename them, do not reorder them, and do not delete them. The Stream Deck keys point at these scenes — rename one and the key that used to call it may stop working mid-service.",
      },
      {
        heading: "The Overlays panel",
        body: "Overlays are the things laid on top of a scene. Ours are grouped three ways, and the grouping is the whole point:\n\n- SHOW IN ALL SCENES: overlays that ride on top of whichever scene is selected — the 'Sorry we're experiencing technical difficulties' titles live here.\n- SHOW IN CURRENT SCENE: overlays attached to just the scene you are on — the booth machine has a '2 shot overlay' here, which composites the second camera into the current look.\n- SHOW IN BACKGROUND: layers that sit behind the sources.\n\nEach row has three controls: a gear (its settings), an eye (show or hide it), and a keyboard-shortcut chip. The eye is the one you would ever use live — click it to bring a title up or take it down.",
        tip: "An overlay in 'Show in all scenes' follows you everywhere. If a title card is stuck on the stream no matter which scene you pick, that is where to look first.",
      },
      {
        heading: "The Camera Switcher panel",
        body: "The bottom-right panel lists the video sources with a live thumbnail of each. Two tabs across the top:\n\n- ALL SOURCES — every source Ecamm can see.\n- A/B — the two-camera view, where one source is assigned as Camera A and another as Camera B.\n\nOn the booth machine: Camera A is 'Cam Link 4K 2', Camera B is 'Cam Link 4K', and the third source is the slides computer ('NATHANS-MAC … Proclaim - CBCR2'). Each tile has small controls in its corners for muting, framing, and its own settings menu.\n\nThis panel is your health check. Before the service, look here: three tiles, three live pictures, no black 'No Signal' card.",
      },
      {
        heading: "The Camera Effects panel",
        body: "The panel on the right edge holds the settings for ONE source at a time — whichever is named in the drop-down at the top ('Cam Link 4K' in the screenshot). Under it:\n\n- RESOLUTION readout — 2160p30 (4K) for our Cam Link inputs.\n- GREEN SCREEN — off, and it stays off.\n- DIGITAL ZOOM & PAN — a slider and a little preview rectangle that lets you crop into the camera's picture without touching the camera.\n- PICTURE SETTINGS — brightness, temperature, tint, saturation, gamma, with a Reset button, plus 'Select LUT'.\n- CAMERA OPTIONS — mirror, black and white, sepia, blur, deinterlace, rotate.\n- APPLY TO ALL SCENES and SET DEFAULT CAMERA at the bottom.\n\nThe trap: these settings are attached to the source AS USED IN THE CURRENT SCENE. Brighten the wide shot in 'WS ONLY' and it can still be dim in 'WS + SLIDES' until you press Apply To All Scenes.",
        tip: "Reset is your undo. If you have nudged four sliders and the picture looks worse than when you started, press Reset and begin again with one change at a time.",
      },
      {
        heading: "Sound Levels and Sound Effects",
        body: "The Sound Levels window holds three faders:\n\n- SCARLETT 2I2 USB — the service audio from the SQ-6. This is the important one.\n- MOVIE — audio from video files, which is what the opening and ending loops play through.\n- SOUND EFFECTS — the buttons in the Sound Effects window.\n\nEach has a MUTE button, and there is a 'Use Echo Cancellation' checkbox at the bottom that stays OFF — it is meant for interview calls and it will mangle music.\n\nThe Sound Effects window is a list of stingers and beds (applause, air horn, glockenspiel, triangle, and some music tracks). They are there for other kinds of productions. Do not fire one during a service unless a lead asks you to.",
      },
      {
        heading: "Bandwidth Statistics",
        body: "The Bandwidth Statistics window is Ecamm telling you whether the internet is keeping up with what you are asking it to send. It tracks the required bandwidth against the throughput actually achieved, plus a target data rate.\n\nYou do not need to read it like an engineer. You need one habit: glance at it a couple of times during the service. When the throughput lines sit at or above what is required, the stream is healthy. When required climbs above what is getting through, viewers are seeing stutter and blockiness — that is your cue to work the troubleshooting module.",
      },
      {
        heading: "What not to touch on a Sunday",
        body: "Everything above is worth understanding; only some of it is worth clicking mid-service. The do-not list:\n\n- Do not create, rename, reorder, or delete scenes.\n- Do not press 'New' or the trash can in the Scenes panel.\n- Do not change stream destinations or settings under the gear.\n- Do not turn on green screen, mirror, sepia, or blur.\n- Do not check 'Use Echo Cancellation'.\n- Do not install updates or restart the machine while the stream is running.\n\nWhat you SHOULD be doing: choosing scenes, showing and hiding the odd overlay, nudging digital zoom and pan when framing needs it, and keeping an eye on levels and bandwidth.",
      },
    ],
    quiz: [
      {
        question: "Which part of the Ecamm window tells you what is going out to the stream right now?",
        options: [
          "The Bandwidth Statistics window",
          "The scene name in the top-left corner and the big program picture in the middle",
          "The Camera Effects panel",
          "The Sound Effects list",
        ],
        answer: 1,
        explanation:
          "The top-left scene selector names the live scene and the middle of the window shows it. Watch those — not the Stream Deck — when you make a change.",
      },
      {
        question: "A title card is stuck on the stream no matter which scene you select. Where do you look?",
        options: [
          "Camera Effects — the LUT is wrong",
          "The Overlays panel, under 'Show in all scenes'",
          "The Scenes panel — the scene is corrupted",
          "Sound Levels",
        ],
        answer: 1,
        explanation:
          "Overlays under 'Show in all scenes' ride on top of every scene. Click the eye icon on that row to hide it.",
      },
      {
        question: "You brighten the wide shot in the 'WS ONLY' scene, but it is still dim in 'WS + SLIDES'. Why?",
        options: [
          "The two scenes use different cameras",
          "Camera Effects apply to the source as used in the current scene until you press 'Apply To All Scenes'",
          "The change did not save",
          "'WS + SLIDES' has a LUT applied",
        ],
        answer: 1,
        explanation:
          "Camera Effects are per-scene by default. 'Apply To All Scenes' pushes the same settings everywhere that source is used.",
      },
      {
        question: "Which of these is safe to do during a live service?",
        options: [
          "Renaming a scene so it is easier to find",
          "Deleting the scenes you never use",
          "Selecting a different scene and nudging digital zoom and pan",
          "Turning on 'Use Echo Cancellation' to clean up the audio",
        ],
        answer: 2,
        explanation:
          "Selecting scenes and light reframing are normal live work. Renaming or deleting scenes breaks the Stream Deck keys, and echo cancellation wrecks music.",
      },
      {
        question: "What is the 'Use Echo Cancellation' checkbox for, and what should it be set to here?",
        options: [
          "It removes room reverb — leave it on",
          "It is for interview and call setups — leave it off",
          "It syncs audio to video — leave it on",
          "It boosts quiet speakers — leave it on",
        ],
        answer: 1,
        explanation:
          "Echo cancellation exists for two-way calls. On a music-carrying service stream it does audible damage, so it stays off.",
      },
    ],
  },

  // ── Chapter 2 · The Controls ─────────────────────────────────────────────
  {
    slug: "stream-scenes",
    order: 3,
    title: "The Scene List",
    subtitle: "All eleven CrossBridge scenes — what each one shows and when to call it.",
    icon: "🎬",
    estMinutes: 13,
    objectives: [
      "Read any scene name and know what will appear on the stream",
      "Choose the right scene for each part of a service",
      "Use the two tech-difficulty scenes correctly, including the muted one",
    ],
    sections: [
      {
        heading: "Reading a scene name",
        body: "Our scene names are built from three words. Learn the words and you never have to memorize the list:\n\n- MAIN — the main camera, the closer shot pointed at the platform and the person speaking.\n- WS — the wide shot, the camera that holds the whole platform.\n- SLIDES — the picture coming from the Proclaim computer: lyrics, scripture, sermon points, announcements.\n\nSo 'MAIN + SLIDES' is the main camera beside the slides. 'WS ONLY' is the wide shot filling the screen. 'SLIDES ONLY' is slides full-frame with no camera at all.\n\nOne pair is worth care because the names are so close: 'WS + SLIDES' and 'WS w/SLIDES'. They are two different arrangements of the same two sources — a side-by-side split versus the slides carried inside the wide shot. Look at each once in Preview Mode before a service so you know which is which on the machine you are running.",
        visual: "stream-scene-matrix",
        tip: "Names describe sources, not moments. 'The one for the sermon' is a habit; 'main camera plus slides' is what the name actually promises.",
      },
      {
        heading: "Before the service — OPENING LOOP",
        body: "OPENING LOOP is the pre-service scene: the looping announcement slides with the countdown, playing with their own audio through the Movie fader.\n\nIt does two jobs. It gives people arriving early something to watch instead of a black screen, and it gives you a safe, self-running picture to be live on while you finish setting up. Put it up as soon as Ecamm is running, and go live on it a few minutes before the service starts.",
      },
      {
        heading: "The slide-driven scenes",
        body: "Most of a service is spent in a scene that includes the slides, because most of a service has something on the screen worth reading:\n\n- SLIDES ONLY — slides full-frame. Best when what matters is entirely on the screen: an announcement video, a full lyric slide, a scripture reading nobody is on camera for.\n- SPEAKER + SLIDES — the speaker with the slides. The default look for teaching that leans on the slides.\n- MAIN + SLIDES — the main camera beside the slides. Your everyday sermon scene.\n- WS + SLIDES — the wide shot beside the slides. Right for worship, where the whole platform is doing something.\n- WS w/SLIDES — the wide shot carrying the slides inside it. A softer look when the room matters more than the text.\n\nWhen in doubt during singing, WS + SLIDES is almost never wrong: viewers at home can see the band and sing the words.",
      },
      {
        heading: "The camera-only scenes",
        body: "- MAIN ONLY — the main camera, full-frame. Use it when the slides have gone blank or irrelevant and the speaker is the whole story: a prayer, a testimony, a baptism, an announcement made from the platform with nothing on the screen.\n- WS ONLY — the wide shot, full-frame. Use it for movement: people coming forward, the band changing over, communion being served, a moment where the room is the point.\n\nThese two are also your fallbacks. If the slides source drops out mid-service, a camera-only scene keeps the stream looking intentional instead of showing an error where the slides should be.",
      },
      {
        heading: "The safety net — TECH DIFF audio and TECH DIFF MUTE",
        body: "Two scenes exist for when something has gone wrong: a technical-difficulties card the viewer sees instead of the room.\n\n- TECH DIFF (audio) — the card with the service audio still going out. Use it when the PICTURE is the problem: a camera has dropped, the slides computer has crashed, something is on screen that should not be. People at home keep hearing the service while you fix the video.\n- TECH DIFF MUTE — the card with the audio muted as well. Use it when the SOUND is the problem, or when what is being said should not go out: a medical situation, a private conversation on a hot mic, anything pastoral that was never meant for the internet.\n\nChoosing between them is one question: does the audio still belong on the stream? Yes, use the audio version. No, or you are not sure, use MUTE. Nobody has ever regretted muting for thirty seconds.",
        tip: "Going to a tech-difficulty card is not an admission of failure — it is the professional move. A clean card beats thirty seconds of the congregation watching you troubleshoot.",
      },
      {
        heading: "After the service — ENDING LOOP",
        body: "ENDING LOOP closes the stream the way OPENING LOOP started it: a looping card, with its own audio, that plays while the room empties.\n\nGo to it as soon as the service is done and the last thing worth streaming has happened. Leave it up for a minute or two — people are still finishing the video — and then stop the stream. Never end a stream by cutting from a live camera; go to the loop first.",
      },
      {
        heading: "Choosing a scene, in one rule",
        body: "The stream should show what a person in the room would be looking at.\n\nSinging, everyone on their feet — the wide shot and the words. Sermon — the speaker and the point on the screen. A video rolling — the video, full-frame. Someone being baptized — the room.\n\nTwo habits keep that from getting messy:\n\n- CHANGE ON PURPOSE, NOT ON A TIMER. A scene held through a whole song is better than four changes that had no reason.\n- CHANGE ON A BOUNDARY. Cut between things, not through them — at the end of a song, on the walk to the pulpit, as a video starts. A cut in the middle of a sentence is felt by everyone watching.",
      },
    ],
    quiz: [
      {
        question: "What does 'WS' mean in our scene names?",
        options: ["Worship Set", "Wide Shot", "Web Stream", "Wireless Source"],
        answer: 1,
        explanation:
          "WS is the wide shot — the camera holding the whole platform. MAIN is the closer camera, and SLIDES is the picture from the Proclaim computer.",
      },
      {
        question: "The congregation is singing and the lyrics are on the screen. Which scene fits best?",
        options: ["MAIN ONLY", "SLIDES ONLY", "WS + SLIDES", "TECH DIFF MUTE"],
        answer: 2,
        explanation:
          "Worship needs both the platform and the words, so the wide shot beside the slides lets viewers at home see the band and sing along.",
      },
      {
        question: "A hot mic is picking up a private conversation after a medical incident. Which scene do you go to?",
        options: [
          "TECH DIFF MUTE",
          "TECH DIFF (audio)",
          "WS ONLY",
          "ENDING LOOP",
        ],
        answer: 0,
        explanation:
          "When the audio should not go out, use the muted tech-difficulty card. The audio version is for picture problems, where the sound is still fine to stream.",
      },
      {
        question: "The slides computer crashes in the middle of the sermon. What is the quickest good-looking fix?",
        options: [
          "Stop the stream and restart it",
          "Switch to MAIN ONLY so the stream shows the speaker full-frame",
          "Leave the scene up with the missing slides showing",
          "Turn on green screen",
        ],
        answer: 1,
        explanation:
          "A camera-only scene keeps the stream looking intentional while you sort the slides out. TECH DIFF is there if you need more than a moment.",
      },
    ],
  },

  // ── Chapter 2 · The Controls ─────────────────────────────────────────────
  {
    slug: "stream-streamdeck",
    order: 4,
    title: "The Stream Deck",
    subtitle: "The 15 keys in front of you — what each one does and how to press them well.",
    icon: "🎛️",
    estMinutes: 12,
    objectives: [
      "Find any scene on the 15-key Stream Deck layout without looking it up",
      "Use Preview Mode to stage a look before it reaches the stream",
      "Treat Go Live with the care it deserves and know the mouse is always the backup",
    ],
    sections: [
      {
        heading: "What the Stream Deck actually is",
        body: "The Stream Deck is a keypad of 15 little screens. Each key is a shortcut that tells Ecamm to do something — almost always 'switch to this scene'. The picture on the key is a live thumbnail of that scene, which is why the deck looks like a tiny version of the scene list.\n\nIt is a remote control, not a second switcher. Everything a key does can also be done by clicking in Ecamm. That matters on the morning the deck goes dark: you have not lost the ability to run the service, only the fast way to do it.",
      },
      {
        heading: "The layout, row by row",
        body: "Three rows of five, laid out so the service runs roughly left to right, top to bottom:\n\nTOP ROW — OPENING LOOP, SLIDES ONLY, SPEAKER + SLIDES, MAIN + SLIDES, WS + SLIDES. The pre-service loop plus the four scenes that include the slides. This row carries most of a normal Sunday.\n\nMIDDLE ROW — MAIN ONLY, WS ONLY, WS w/SLIDES, Preview Mode, and an arrow key. The camera-only scenes, the wide-shot-with-slides variant, the preview toggle, and the arrow that moves to the next page of keys.\n\nBOTTOM ROW — TECH DIFF audio, TECH DIFF MUTE, ENDING LOOP, Dashboard, Go Live. The safety net, the closing loop, and the two action keys.\n\nNotice the shape of it: scenes on the left and middle, actions on the right. Your hand lives on the left two-thirds of the deck during a service.",
        visual: "stream-deck-grid",
      },
      {
        heading: "Reading the key outlines",
        body: "The keys tell you where you are. On the booth deck, one key carries a green outline and one carries a blue outline.\n\nRead it this way: GREEN is the scene that is on the stream right now, and BLUE is the key you have selected or staged. In the booth screenshot, WS + SLIDES is outlined green (it is live — and the main window agrees, showing 'WS + SLIDES' in its top-left corner) while OPENING LOOP is outlined blue.\n\nConfirm the exact colors in the booth on a quiet weekday — profiles can be re-styled — but the principle holds everywhere: the deck marks what is live differently from what is merely selected. Learn which is which BEFORE a Sunday, not during one.",
        tip: "Whatever the outlines say, the truth is the scene name in Ecamm's top-left corner. When the deck and the main window disagree, believe the main window.",
      },
      {
        heading: "Preview Mode",
        body: "Preview Mode is the difference between a confident operator and a lucky one.\n\nWith it OFF, pressing a scene key sends that scene straight to the stream. What you press is what several hundred people see, immediately.\n\nWith it ON, pressing a scene key loads the scene into the preview first. You get to look at it — is the camera framed, has the slide advanced, is anyone walking through the shot — and then take it live.\n\nUse Preview Mode when you have time to think: setting up before the service, staging the next look during a long song, checking a scene you rarely use. Its key sits in the middle row of the deck, and the Ecamm main window has the same toggle at its bottom-left.\n\nPractice the take-to-live step in the booth before you rely on it, so the second press is muscle memory rather than a guess. If you are ever unsure whether you are in preview or live, look at the main window: the program picture only changes when a scene has actually gone out.",
      },
      {
        heading: "Go Live",
        body: "The bottom-right key. It starts the stream — and pressing it again stops the stream.\n\nTreat it as the most consequential key on the deck:\n\n- Press it once, deliberately, when you are ready to be on air — with OPENING LOOP up and audio confirmed.\n- Then keep your hand away from it for the rest of the service. The most common serious mistake in a booth is an accidental second press on the go-live key.\n- Do not use it to fix problems. A stream restart makes viewers reload and loses everyone who does not. Whatever is broken, the tech-difficulty scenes buy you time more cheaply.\n\nAnd going live in Ecamm is not the same as being live to the congregation at home: confirm the stream actually appears on YouTube or Facebook before you relax.",
      },
      {
        heading: "Dashboard and the arrow key",
        body: "Two utility keys:\n\n- DASHBOARD opens Ecamm's dashboard view — stream status, viewers, and controls collected in one place. It is useful for a quick health check between segments; it does not change what is going out.\n- The ARROW key moves the deck to another page of buttons. If you press it and every key suddenly looks unfamiliar, you have not broken anything — press it again (or the back arrow on the page you land on) to return to the service layout.\n\nIf a key is ever unlabeled or you cannot remember what it does, do not experiment mid-service. Ask afterward and test it on a weekday.",
      },
      {
        heading: "Habits that keep a service clean",
        body: "- ONE PRESS PER CHANGE. The deck responds instantly; a double press either does nothing or does something you did not want.\n- WATCH THE PROGRAM, NOT THE DECK. Press, then look up at the main window to confirm what actually went out.\n- KEEP THE DECK WHERE IT LIVES. Do not rearrange keys, move profiles, or 'tidy' the layout — the next volunteer learned the layout you are looking at.\n- KNOW THE BACKUP. If the deck goes dark, click scenes in the Scenes panel with the mouse. The service does not stop for a USB problem.\n- HANDS OFF DURING QUIET MOMENTS. Prayer, communion, a long reading — the temptation to keep switching is strongest exactly when the stream needs stillness.",
      },
    ],
    quiz: [
      {
        question: "Which key is at the bottom-right of the service layout, and what does it do?",
        options: [
          "Dashboard — it opens Ecamm's stats view",
          "Go Live — it starts (and stops) the stream",
          "Preview Mode — it stages the next scene",
          "ENDING LOOP — it plays the closing card",
        ],
        answer: 1,
        explanation:
          "Go Live sits bottom-right. It starts the stream, and a second press stops it — which is why you press it once and then keep your hand away.",
      },
      {
        question: "What does Preview Mode change about pressing a scene key?",
        options: [
          "Nothing — it only changes the key colors",
          "The scene loads into the preview first so you can check it before it goes live",
          "It mutes the audio while you switch",
          "It records the scene to the Mac",
        ],
        answer: 1,
        explanation:
          "With Preview Mode on, a scene key stages the look instead of sending it out, so you can check framing and slides before taking it live.",
      },
      {
        question: "The Stream Deck goes dark in the middle of the service. What do you do?",
        options: [
          "Stop the stream and restart everything",
          "Keep running the service by clicking scenes in Ecamm's Scenes panel with the mouse",
          "Switch to ENDING LOOP and finish early",
          "Unplug the Mac mini and restart it",
        ],
        answer: 1,
        explanation:
          "The deck is only a remote control. Ecamm still switches with the mouse, so the service continues while you reseat the USB afterward.",
      },
      {
        question: "The deck's outlines and Ecamm's main window disagree about what is live. Which do you believe?",
        options: [
          "The Stream Deck — it talks to Ecamm directly",
          "Ecamm's main window — the scene name in the top-left and the program picture",
          "Neither; restart the stream",
          "Whichever updated most recently",
        ],
        answer: 1,
        explanation:
          "The main window is the source of truth for what is going out. A stale key thumbnail is cosmetic; the program picture is the stream.",
      },
    ],
  },

  // ── Chapter 3 · The Sources ──────────────────────────────────────────────
  {
    slug: "stream-cameras",
    order: 5,
    title: "Two Cameras and the Slides",
    subtitle: "Camera A, Camera B, the slides source — framing, effects, and the 'No Signal' card.",
    icon: "📷",
    estMinutes: 13,
    objectives: [
      "Identify our three video sources and how each one reaches the Mac",
      "Reframe a shot with Digital Zoom & Pan and match the two cameras to each other",
      "Diagnose the black 'No Signal' card in the right order",
    ],
    sections: [
      {
        heading: "Our three video sources",
        body: "Ecamm's Camera Switcher lists three tiles, and every scene is built from them:\n\n- CAMERA A — 'Cam Link 4K 2'. The main camera, the closer shot on the platform and the person speaking. This is the 'MAIN' in the scene names.\n- CAMERA B — 'Cam Link 4K'. The wide shot that holds the whole platform. This is the 'WS' in the scene names.\n- THE SLIDES — listed by the slides computer's own name, 'NATHANS-MAC … Proclaim - CBCR2'. This is the 'SLIDES' in the scene names.\n\nBoth cameras plug into the Mac through an Elgato Cam Link 4K — a small stick that turns an HDMI output into something the computer treats as a webcam. That is why Ecamm calls them 'Cam Link 4K' and 'Cam Link 4K 2' rather than by the camera model, and why the black card with the Elgato logo appears when a camera stops sending HDMI.\n\nWhich physical camera is A and which is B is worth confirming in the booth on a weekday — the labels are about capture sticks, not positions, and swapping an HDMI cable swaps the names.",
        visual: "stream-camera-switcher",
      },
      {
        heading: "All Sources and A/B",
        body: "Two tabs sit at the top of the Camera Switcher panel.\n\n- ALL SOURCES lists everything Ecamm can see — both cameras, the slides computer, and anything else that has been added.\n- A/B is the two-camera view, where one source is assigned to Camera A and another to Camera B. It is the fast way to work when a service is really just cutting between two angles.\n\nEach tile carries small controls in its corners — a mute, a framing control, and a menu of that source's own settings. Your everyday use of this panel is simpler than any of that: look at it before the service and confirm you can see three live pictures.",
      },
      {
        heading: "Framing the shots",
        body: "Camera work for a service is mostly restraint.\n\n- THE MAIN CAMERA holds the speaker: head and shoulders with a little room above the head, eyes roughly a third of the way down the frame, and enough space on the side they are facing that they are not walking into the edge of the picture.\n- THE WIDE SHOT holds the platform: everyone who is part of what is happening, with the screen visible if that helps the viewer at home.\n- DON'T CHASE. A speaker who moves is easier to watch in a slightly loose shot than in a tight shot that keeps hunting for them.\n- MOVE SLOWLY OR NOT AT ALL. Every adjustment is visible on the stream. If you would not notice the change from the back row, it is probably not worth making.",
      },
      {
        heading: "Digital Zoom & Pan",
        body: "In the Camera Effects panel, Digital Zoom & Pan lets you reframe a source without touching the camera — a slider for how far in, and a small preview rectangle you drag to choose which part of the picture to keep.\n\nWhat it is good for: tightening the main camera when the speaker is standing further back than usual, or trimming an empty edge out of the wide shot.\n\nWhat it costs: it is a crop of the 4K image, so the further in you go, the softer the result. A modest crop is invisible; a heavy one looks like a phone video.\n\nTwo rules. Reframe between segments, not mid-sentence — a digital zoom moving live is far more noticeable than a static crop. And reset the zoom when the reason for it is over, so the next person does not inherit a mystery crop.",
      },
      {
        heading: "Picture Settings — matching the cameras",
        body: "Brightness, temperature, tint, saturation, and gamma live under Picture Settings, with a Reset button beside them and 'Select LUT' underneath.\n\nThe goal is not a beautiful picture in isolation. It is TWO CAMERAS THAT MATCH, so cutting from the wide shot to the main camera does not look like cutting to a different building. Work in this order:\n\n1. Get the wide shot looking right first — it is the shot you cut to most.\n2. Put the two side by side in the Camera Switcher and look at skin tones and the color of the platform lights.\n3. Adjust the second camera toward the first, one slider at a time, in small moves.\n4. If it gets worse, press Reset and start again.\n\nAnd remember the per-scene trap from the Ecamm tour: unless you press 'Apply To All Scenes', your correction only applies to the source as used in the scene you were on.",
        tip: "Change one slider at a time and look at the result before touching the next. Four simultaneous adjustments leave you with no idea which one hurt.",
      },
      {
        heading: "The black 'No Signal' card",
        body: "A black frame with the Elgato logo and the words 'No Signal' means one specific thing: the Cam Link is connected to the Mac, but it is not receiving HDMI from the camera. Ecamm is fine. The capture stick is fine. Something upstream stopped sending a picture.\n\nWork the list in order — it goes from most to least likely:\n\n1. IS THE CAMERA ON? Look at the camera, not the screen. Power switch, standby light, battery, power adapter.\n2. HAS IT GONE TO SLEEP? Many cameras stop outputting HDMI after an idle timeout. Wake it and check whether an auto-power-off setting needs turning off.\n3. IS THE HDMI SEATED — AT BOTH ENDS? The camera end and the Cam Link end. HDMI plugs back out of a camera very easily.\n4. IS THE CAM LINK SEATED in the Mac's USB port? Reseat it, and give Ecamm a few seconds to notice.\n5. DID THE SOURCE GET RESELECTED? In the Camera Switcher, confirm the tile is still pointed at the right device.\n\nIf all five come back clean, get the tech lead — and in the meantime run the service on the other camera. One good camera is a service; a black rectangle is not.",
        visual: "stream-no-signal",
      },
      {
        heading: "The floating camera windows",
        body: "The small 'Camera A', 'Camera B', 'Camera C' windows on the desktop are monitors — a live look at each source, independent of whichever scene is live.\n\nThey are genuinely useful: they let you see that the speaker has walked out of frame on a camera that is not currently on the stream, so you can fix it before you cut to it.\n\nClosing one does not turn a source off, and neither does moving it. If you accidentally close them all, the Camera Switcher panel still shows the same thumbnails.",
      },
    ],
    quiz: [
      {
        question: "What is a Cam Link 4K?",
        options: [
          "The camera itself",
          "An HDMI capture stick that makes a camera look like a webcam to the Mac",
          "A lighting controller",
          "The slides computer",
        ],
        answer: 1,
        explanation:
          "Each camera's HDMI runs into an Elgato Cam Link 4K, which is why Ecamm names the sources 'Cam Link 4K' and 'Cam Link 4K 2'.",
      },
      {
        question: "A camera tile shows the black 'No Signal' card. What does that tell you?",
        options: [
          "Ecamm has crashed",
          "The internet connection dropped",
          "The Cam Link is connected but is not receiving HDMI from the camera",
          "The scene was deleted",
        ],
        answer: 2,
        explanation:
          "'No Signal' is the capture stick reporting no incoming HDMI. Check the camera's power, sleep timer, and both ends of the HDMI cable before anything else.",
      },
      {
        question: "What is the main cost of using Digital Zoom & Pan?",
        options: [
          "It uses extra bandwidth",
          "It crops into the image, so a heavy zoom looks soft",
          "It mutes that camera's audio",
          "It applies to every scene at once",
        ],
        answer: 1,
        explanation:
          "Digital zoom is a crop of the 4K picture. A modest crop is invisible; a heavy one degrades the image, so reset it when the reason for it has passed.",
      },
      {
        question: "Why does matching the two cameras' picture settings matter?",
        options: [
          "It reduces the file size of the recording",
          "So cutting between them does not look like cutting to a different room",
          "It is required by YouTube",
          "It prevents the No Signal card",
        ],
        answer: 1,
        explanation:
          "Cuts between mismatched cameras jump in brightness and color. Match the second camera to the wide shot, one slider at a time.",
      },
    ],
  },

  // ── Chapter 3 · The Sources ──────────────────────────────────────────────
  {
    slug: "stream-audio",
    order: 6,
    title: "Audio on the Stream",
    subtitle: "Where the stream's sound comes from, the three faders, and the silent-stream drill.",
    icon: "🔊",
    estMinutes: 10,
    objectives: [
      "Trace the stream's audio from the SQ-6 to Ecamm",
      "Set and check levels in the Sound Levels window",
      "Work the 'room sounds fine, stream is silent' problem in the right order",
    ],
    sections: [
      {
        heading: "Where the sound comes from",
        body: "The stream's audio is not picked up in the booth. It is a mix built by the sound tech on the Allen and Heath SQ-6 and sent to you.\n\nIn the sound curriculum that mix is AUX 1 — 'Stream' — and it leaves the console on local outputs 11 and 12. It arrives at the streaming Mac through a Focusrite Scarlett 2i2 USB audio interface, which is the device you see named in Ecamm's Sound Levels window.\n\nThat division of labor matters: the CONTENT of the mix (who is up, how loud the band is against the pastor) belongs to the sound tech. The PRESENCE and LEVEL of that mix in Ecamm belongs to you. If the balance is wrong, talk to the sound booth. If the stream is silent while the room is fine, start on your side.\n\nThe exact console outputs are documented in the house Sound Manual — worth confirming in the booth so you can describe a problem precisely when you hand it over.",
      },
      {
        heading: "The three faders",
        body: "Sound Levels has one row per audio source, each with a mute button and a slider:\n\n- SCARLETT 2I2 USB — the service audio from the SQ-6. This is the one that matters. It should be unmuted, with its meter moving whenever anything is happening in the room.\n- MOVIE — audio that belongs to video files playing inside Ecamm. The opening and ending loops come out here.\n- SOUND EFFECTS — the stingers in the Sound Effects window.\n\nAt the bottom is 'Use Echo Cancellation'. It stays off. It is designed for two-way calls and it will pump and warble anything musical.",
      },
      {
        heading: "Setting level before the service",
        body: "Do this during sound check, not at 10:29.\n\n1. Ask the sound tech to run something representative — a full band verse, not a lone voice.\n2. Watch the Scarlett meter in Sound Levels. You want it moving healthily through the middle of its range, with the loudest moments still short of the top.\n3. If it is far too quiet or pinned at the top, tell the sound tech what you are seeing before you fix it with the Ecamm fader — the level should arrive right, not be rescued at the last step.\n4. Listen on headphones at the booth Mac, and if you can, look at the stream itself on a phone once you are live. The phone is the only place you hear exactly what the congregation at home hears.\n\nThen leave the fader alone. Riding the stream fader during a service fights the sound tech's mix.",
        tip: "You are checking that a good mix is arriving intact — not remixing it. Almost every audio problem worth fixing in Ecamm is a mute, a missing device, or an unplugged cable, not a fader position.",
      },
      {
        heading: "The sound effects list",
        body: "The Sound Effects window holds applause, a bicycle horn, a DJ air horn, a glockenspiel, party noise, a triangle, and a few music tracks.\n\nThey exist for other kinds of productions the church may run through this rig. They are not part of a Sunday gathering. Do not fire one during a service unless a lead has specifically asked for it — and if you are curious what one sounds like, find that out on a weekday with the stream off.",
      },
      {
        heading: "The silent-stream drill",
        body: "The room sounds fine, but the stream has no audio. Work it in this order — it goes from your side outward:\n\n1. IS IT MUTED IN ECAMM? Check the Scarlett 2i2 mute button in Sound Levels, and its fader position.\n2. IS THE METER MOVING? If the meter is dead, no audio is reaching the Mac — the problem is the interface or the console, not Ecamm's mixer.\n3. IS THE INTERFACE CONNECTED AND SELECTED? Confirm the Scarlett is plugged in, powered, and still chosen as the source in the drop-down. USB interfaces occasionally drop off and come back under a slightly different name.\n4. HAND IT TO THE SOUND BOOTH. If the meter is dead and the interface is fine, the stream mix is not leaving the console — AUX 1 or local outputs 11 and 12 on the SQ-6. That is the sound tech's fix, and they will find it faster than you will.\n\nWhile you are working through it, put up a tech-difficulty card if the silence has lasted more than a few seconds. And remember the sound curriculum's version of this rule: if the room is fine, the problem is downstream of the main mix — so nobody should be touching input channels looking for it.",
        visual: "stream-audio-path",
      },
    ],
    quiz: [
      {
        question: "Who builds the mix that goes out on the stream?",
        options: [
          "The streaming operator, using the Ecamm faders",
          "The sound tech, on the SQ-6 — it arrives at the Mac over the Scarlett 2i2",
          "Ecamm generates it automatically from the cameras",
          "YouTube mixes it on their end",
        ],
        answer: 1,
        explanation:
          "The stream mix is built on the console and delivered to the streaming Mac. Your job is to confirm it is present and at a sane level, not to remix it.",
      },
      {
        question: "The stream is silent but the room sounds fine. What do you check FIRST?",
        options: [
          "The camera settings",
          "The Scarlett 2i2 mute button and fader in Ecamm's Sound Levels",
          "The internet connection",
          "The SQ-6 input channels",
        ],
        answer: 1,
        explanation:
          "Start on your side: mute and fader, then whether the meter is moving, then the interface, then hand it to the sound booth.",
      },
      {
        question: "The Scarlett's meter in Sound Levels is completely still during the sermon. What does that mean?",
        options: [
          "Ecamm's fader is down",
          "No audio is reaching the Mac at all — look at the interface and the console, not Ecamm's mixer",
          "The stream is not live yet",
          "The camera is muted",
        ],
        answer: 1,
        explanation:
          "A dead meter means nothing is arriving. The fault is upstream of Ecamm's mixer — the USB interface or the console's stream output.",
      },
      {
        question: "What should 'Use Echo Cancellation' be set to?",
        options: [
          "On, to reduce room reverb",
          "On, but only during the sermon",
          "Off — it is for two-way calls and damages music",
          "It does not matter",
        ],
        answer: 2,
        explanation:
          "Echo cancellation is built for interview calls. On a service stream carrying music it pumps and warbles, so it stays off.",
      },
    ],
  },

  // ── Chapter 4 · Running a Sunday ─────────────────────────────────────────
  {
    slug: "stream-run-a-service",
    order: 7,
    title: "Running a Sunday on the Stream",
    subtitle: "Pre-service checks, going live, the scene plan, and closing the stream down cleanly.",
    icon: "📡",
    estMinutes: 14,
    objectives: [
      "Work a pre-service checklist that catches problems while they are still cheap",
      "Go live at the right moment and confirm the stream is actually reaching viewers",
      "Run a scene plan through the service and close the stream down in the right order",
    ],
    sections: [
      {
        heading: "Thirty minutes before — the checklist",
        body: "Everything that goes badly on a Sunday morning was findable half an hour earlier. Work down the list:\n\n1. Cameras on, both of them, and pointed where they belong.\n2. Slides computer on, on the network, Proclaim running with the service loaded.\n3. Mac mini awake and signed in (the login is on the machine).\n4. Ecamm Live open, showing the CrossBridge scene collection.\n5. Camera Switcher shows THREE live pictures — no black 'No Signal' cards.\n6. Sound Levels: Scarlett 2i2 unmuted, meter moving during sound check.\n7. Stream Deck lit, keys showing scene thumbnails.\n8. Step through the scenes you plan to use, in Preview Mode, and look at each one. This is when you discover a camera is framed wrong or a scene is showing the wrong source.\n9. OPENING LOOP up on the program.\n10. Bandwidth Statistics window visible where you can glance at it.\n\nIf something on this list is broken, you now have thirty minutes and a tech lead's phone number. At 10:29 you have neither.",
      },
      {
        heading: "Going live",
        body: "Go live a few minutes before the service starts, with OPENING LOOP on the program. People arrive early on the internet too, and a running countdown tells them they are in the right place.\n\nThe sequence:\n\n1. Confirm the program picture is OPENING LOOP.\n2. Confirm audio is present (the loop's own audio on the Movie fader; the Scarlett meter alive if the room is already miked).\n3. Press Go Live once.\n4. THEN GO AND LOOK. Open the stream on YouTube or Facebook — on a phone, not on the booth Mac — and confirm it is actually there, with picture and sound. Ecamm saying it is streaming is not the same as viewers receiving it.\n\nThat last step is the one people skip, and it is the only one that proves the whole chain works.",
        tip: "There is a delay of several seconds between the booth and the viewer. Check the phone for picture and sound; do not check it for sync with the room, and keep it muted in the booth or you will feed the room back into itself.",
      },
      {
        heading: "The service run",
        body: "A typical CrossBridge Sunday, in scenes:\n\n- BEFORE — OPENING LOOP.\n- WELCOME AND ANNOUNCEMENTS — MAIN + SLIDES if there is something on the screen, MAIN ONLY if there is not.\n- WORSHIP — WS + SLIDES so viewers see the platform and the words. Hold it. A song is not an excuse to cut every eight bars.\n- SCRIPTURE READING OR PRAYER — MAIN ONLY, or SLIDES ONLY if the text is on the screen and nobody is on camera.\n- SERMON — MAIN + SLIDES, or SPEAKER + SLIDES when the teaching leans on what is on the screen. If the slides go blank for a long stretch, MAIN ONLY looks better than a dead half-screen.\n- VIDEO — SLIDES ONLY, full-frame, so the video is not squeezed into a corner.\n- COMMUNION, BAPTISM, PEOPLE MOVING — WS ONLY. The room is the story.\n- CLOSING SONG — WS + SLIDES again.\n- AFTER THE BENEDICTION — ENDING LOOP.\n\nCut on boundaries: between songs, on the walk to the pulpit, as a video starts. Never mid-sentence.",
        visual: "stream-service-timeline",
      },
      {
        heading: "Watching the stream while you run it",
        body: "Three things deserve a glance every few minutes:\n\n- THE PROGRAM PICTURE. Is what is going out what you intended? Is anyone half out of frame?\n- BANDWIDTH STATISTICS. Is throughput keeping up with what is required? A sustained gap means viewers are seeing stutter.\n- THE SOURCES YOU ARE NOT ON. The floating camera windows show you the shot you are about to cut to. Fix it before you cut, not after.\n\nWhat does not deserve your attention: the live chat, your phone, and the temptation to keep switching because nothing has changed in a while. Stillness is a legitimate choice.",
      },
      {
        heading: "Closing the stream down",
        body: "Order matters here as much as at start-up:\n\n1. Go to ENDING LOOP once the last thing worth streaming has happened. Never end from a live camera — you do not want the last frame to be someone walking off the platform mid-conversation.\n2. Leave the loop up for a minute or two. People are still finishing.\n3. Stop the stream (Go Live again, or Stream & Record in Ecamm).\n4. Confirm on the platform that the stream has actually ended.\n5. Let the recording finish writing before you quit Ecamm. A recording interrupted mid-write can be unusable.\n6. Quit Ecamm, then turn the cameras off. Leave the Mac mini as the team expects to find it — confirm in the booth whether it is left signed in or shut down.\n7. Put the Stream Deck, mouse, and cables back where they live.",
      },
      {
        heading: "After the service",
        body: "Two minutes of follow-through saves the next volunteer an hour.\n\n- CHECK THE RECORDING EXISTS and looks right — the first minute and the last minute are enough to prove it.\n- WRITE DOWN ANYTHING ODD. A camera that dropped, an audio dip, a scene that came up wrong. Details fade fast; a note in the team's channel keeps a small recurring problem from becoming folklore.\n- SAY WHAT YOU CHANGED. If you adjusted picture settings or a digital zoom and did not reset it, tell someone, so the next person is not debugging your improvement.\n- RESET WHAT SHOULD BE RESET: digital zoom back to normal, any overlay you enabled hidden again, sound effects untouched.",
      },
    ],
    quiz: [
      {
        question: "You press Go Live with OPENING LOOP up. What is the next thing you should do?",
        options: [
          "Switch to a camera scene so there is something to watch",
          "Open the stream on a phone and confirm picture and sound are actually reaching viewers",
          "Start the recording separately",
          "Nothing — Ecamm shows it is streaming, so it is streaming",
        ],
        answer: 1,
        explanation:
          "Ecamm reporting that it is streaming only proves the first link. Checking the platform on a phone proves the whole chain — and it is the step people skip.",
      },
      {
        question: "A video is about to play on the screens. Which scene fits?",
        options: ["WS ONLY", "SLIDES ONLY, full-frame", "MAIN + SLIDES", "TECH DIFF audio"],
        answer: 1,
        explanation:
          "A video deserves the whole frame. Squeezing it beside a camera shot makes it unreadable for viewers at home.",
      },
      {
        question: "What is the correct order for closing down?",
        options: [
          "Stop the stream, then go to ENDING LOOP",
          "Go to ENDING LOOP, leave it up a minute or two, then stop the stream and let the recording finish writing",
          "Quit Ecamm, then stop the stream",
          "Turn the cameras off first, then stop the stream",
        ],
        answer: 1,
        explanation:
          "End on the loop, not on a live camera, and give the recording time to finish writing before quitting Ecamm or powering anything down.",
      },
      {
        question: "During a long worship set, nothing has changed on the platform for several minutes. What should you do?",
        options: [
          "Cut between scenes every few bars to keep it interesting",
          "Hold the scene — stillness is a legitimate choice — and glance at bandwidth and the off-air cameras",
          "Switch to SLIDES ONLY until something happens",
          "Fire a sound effect",
        ],
        answer: 1,
        explanation:
          "Cuts should have reasons. Holding a good shot and using the quiet moment to check bandwidth and your other camera is better production than restless switching.",
      },
    ],
  },

  // ── Chapter 4 · Running a Sunday ─────────────────────────────────────────
  {
    slug: "stream-troubleshooting",
    order: 8,
    title: "When the Stream Goes Wrong",
    subtitle: "Calm fixes for black cameras, silent audio, stutter, and a dark Stream Deck.",
    icon: "🛠️",
    estMinutes: 12,
    objectives: [
      "Buy yourself time with the tech-difficulty scenes before you start fixing",
      "Diagnose the common failures — no signal, no slides, no audio, dropped frames",
      "Know what you never do mid-service, and when to hand the problem to a lead",
    ],
    sections: [
      {
        heading: "First rule — buy time, then fix",
        body: "When something breaks, the instinct is to fix it immediately while it is still on the stream. Resist that.\n\nThe order is: PROTECT THE STREAM, then diagnose.\n\n- If the problem is visible and will take more than a few seconds, go to a tech-difficulty scene or a camera-only scene that still looks intentional.\n- If what is being said should not go out, go to TECH DIFF MUTE. Immediately. You can always come back.\n- Then work the problem, with a card up, at the speed of thinking rather than the speed of panic.\n\nAnd the thing you almost never do: restart the stream. It drops every viewer, many of whom will not come back, and it fixes far less than people expect.",
        tip: "Nobody at home minds thirty seconds of a holding card. Everybody notices a minute of watching you troubleshoot on camera.",
      },
      {
        heading: "A camera has gone black",
        body: "The Elgato 'No Signal' card means the Cam Link is not receiving HDMI. Full drill in the Cameras module; the short version:\n\n1. Camera powered and awake? (Look at the camera itself.)\n2. Asleep on an idle timer?\n3. HDMI seated at both ends?\n4. Cam Link seated in the Mac's USB port?\n5. Correct device still selected in the Camera Switcher?\n\nWhile you work it: run the service on the OTHER camera. MAIN ONLY or WS ONLY, or one of the slide scenes that uses the working camera. A single good angle is a perfectly respectable stream.",
        visual: "stream-no-signal",
      },
      {
        heading: "The slides have disappeared",
        body: "If the slides source goes blank or drops out of the Camera Switcher, it is almost always the slides computer rather than Ecamm:\n\n- Is the slides Mac awake, on the network, and running Proclaim?\n- Is Proclaim still in show mode, or has someone dropped it back into edit?\n- Is the source still selected in Ecamm's Camera Switcher?\n\nYour immediate move is a camera-only scene — MAIN ONLY or WS ONLY — so the stream stops showing a hole where the slides used to be. Then get whoever runs slides; that machine is their responsibility and they are one seat away.",
      },
      {
        heading: "The stream has no audio",
        body: "Short version of the drill from the Audio module:\n\n1. Scarlett 2i2 muted or faded down in Ecamm?\n2. Is its meter moving? A dead meter means nothing is arriving at the Mac.\n3. Interface plugged in, powered, still selected?\n4. Otherwise it is the console's stream output — the sound tech's fix.\n\nIf silence lasts more than a few seconds, put up TECH DIFF (audio is what is broken, so the card's own audio state matters — use the muted card if there is nothing to send). Fix, then come back.",
      },
      {
        heading: "Stuttering, blockiness, dropped frames",
        body: "Viewers report the stream is choppy, or Bandwidth Statistics shows required bandwidth running above what is actually getting through.\n\nWhat to do, in order:\n\n1. Check whether anything else is hammering the network — a large download or backup on the booth Mac, someone streaming elsewhere in the building.\n2. Close anything you do not need on the Mac. Ecamm wants the machine's attention.\n3. Prefer lower-motion scenes for a while. Slides and a static wide shot compress far more kindly than fast movement.\n4. Do not start changing stream quality settings mid-service. That is a lead's call, made with the whole picture.\n\nNote what you saw — the time, what the statistics showed, what else was running. A pattern across two or three Sundays is what actually gets a network problem solved.",
      },
      {
        heading: "The Stream Deck stops responding",
        body: "Keys dark, or pressing them does nothing.\n\n- KEEP RUNNING THE SERVICE WITH THE MOUSE. Click scenes directly in Ecamm's Scenes panel. Nothing about the stream depends on the deck.\n- Reseat its USB cable when you have a quiet moment — not mid-cut.\n- If the keys are lit but nothing happens, the link between the deck and Ecamm has dropped rather than the deck itself. Note it and hand it to the tech lead after the service.\n\nDo not start reassigning keys or re-creating a profile during a service. That is a weekday job with the stream off.",
      },
      {
        heading: "Ecamm quits, or the Mac freezes",
        body: "The worst case, and it is survivable.\n\n1. Reopen Ecamm. It comes back with the same scene collection.\n2. Check the Camera Switcher for all three sources before you go anywhere near Go Live.\n3. Bring up OPENING LOOP or a tech-difficulty card, then restart the stream.\n4. Expect a gap on the platform — viewers will need to reload. That is unavoidable at this point and is not your fault.\n5. Tell a lead as soon as the service allows, and write down what you were doing when it happened.\n\nIf the Mac itself is frozen, restart it. You will lose the stream and the recording of the moment; you will not lose the scenes.",
      },
      {
        heading: "When to get help, and what to write down",
        body: "GET A LEAD when: two of your fixes have not worked; the problem is repeating; you are about to change a setting you do not understand; or the failure is in the console's audio, the network, or the Mac itself.\n\nWRITE DOWN, for every problem worth mentioning:\n\n- WHAT you saw — the exact card, the exact message, which source.\n- WHEN — roughly what point in the service.\n- WHAT YOU DID and what changed as a result.\n- WHETHER IT CAME BACK on its own.\n\nA one-line note like 'wide shot went to No Signal at 10:42, reseated HDMI at the camera end, came straight back' is worth more to whoever fixes it than an hour of guessing. Protecting the service matters more than solving it solo.",
      },
    ],
    quiz: [
      {
        question: "Something has broken visibly on the stream and it will take a minute to fix. What comes first?",
        options: [
          "Restart the stream",
          "Go to a tech-difficulty or camera-only scene, then diagnose with a card up",
          "Fix it live so viewers see the recovery",
          "Stop the recording",
        ],
        answer: 1,
        explanation:
          "Protect the stream first, then diagnose. A holding card costs nothing; troubleshooting on camera costs the viewer's attention.",
      },
      {
        question: "Why is restarting the stream almost never the right fix?",
        options: [
          "It takes too long to type the stream key",
          "It drops every viewer, many of whom will not come back, and it rarely fixes the actual problem",
          "It deletes the recording",
          "It resets all the scenes",
        ],
        answer: 1,
        explanation:
          "A restart forces every viewer to reload and fixes far less than people expect. The tech-difficulty scenes buy the same time far more cheaply.",
      },
      {
        question: "The slides have vanished from the stream. What is the most likely cause?",
        options: [
          "Ecamm needs reinstalling",
          "The slides computer — asleep, off the network, or out of show mode",
          "The Cam Link failed",
          "The Scarlett interface dropped",
        ],
        answer: 1,
        explanation:
          "The slides source is another computer. Go to a camera-only scene so the stream looks intentional, then get whoever is running slides.",
      },
      {
        question: "Bandwidth Statistics shows required bandwidth sitting above the throughput you are achieving. What do viewers see, and what do you do?",
        options: [
          "Nothing is wrong; the numbers always look like that",
          "Stutter and blockiness — check what else is using the network, close unneeded apps, and favor lower-motion scenes",
          "The stream has stopped; restart it",
          "The audio will drift out of sync; restart Ecamm",
        ],
        answer: 1,
        explanation:
          "A sustained gap means the network cannot carry what you are sending. Reduce load and motion, note what you saw, and leave quality settings to a lead.",
      },
    ],
  },
];

/**
 * All streaming modules, in curriculum order, with any booth screenshots from
 * lib/streaming-shots.ts attached (keyed by slug). Modules without screenshots
 * are unchanged — they teach from the diagrams in StreamingVisual.tsx.
 */
export const streamingCurriculum: Module[] = streamingCurriculumBase.map((m) => {
  const slides = streamingShots[m.slug];
  return slides && slides.length ? { ...m, slides } : m;
});

export const STREAMING_TOTAL_MODULES = streamingCurriculum.length;

/** Look up one streaming module by slug. */
export function getStreamingModule(slug: string): Module | undefined {
  return streamingCurriculum.find((m) => m.slug === slug);
}

/** Slugs in curriculum order — powers the prev/next module navigation. */
export const streamingModuleOrder = streamingCurriculum
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((m) => m.slug);

/**
 * Streaming training chapters. Edit the groupings here; the /streaming page
 * renders whatever this defines.
 */
export const streamingPhases: TrainingPhase[] = [
  {
    id: "stream-orientation",
    name: "Get Oriented",
    tagline: "What the rig is, how it connects, and where every control lives.",
    moduleSlugs: ["stream-overview", "stream-ecamm-tour"],
  },
  {
    id: "stream-controls",
    name: "The Controls",
    tagline: "The scene list and the 15 keys you will actually run a service from.",
    moduleSlugs: ["stream-scenes", "stream-streamdeck"],
  },
  {
    id: "stream-sources",
    name: "Cameras & Audio",
    tagline: "The two cameras, the slides, and the sound arriving from the SQ-6.",
    moduleSlugs: ["stream-cameras", "stream-audio"],
  },
  {
    id: "stream-sunday",
    name: "Running a Sunday",
    tagline: "The service start to finish, and calm fixes when something breaks.",
    moduleSlugs: ["stream-run-a-service", "stream-troubleshooting"],
  },
];

/**
 * Resolve `streamingPhases` to their module objects, in phase order. Any module
 * not assigned to a phase is appended in a trailing group so a newly added
 * module can never silently disappear from the curriculum view.
 */
export function getStreamingPhases(): ResolvedPhase[] {
  const assigned = new Set<string>();
  const resolved: ResolvedPhase[] = streamingPhases.map((phase) => {
    const modules = phase.moduleSlugs
      .map((slug) => getStreamingModule(slug))
      .filter((m): m is Module => Boolean(m));
    modules.forEach((m) => assigned.add(m.slug));
    return { ...phase, modules };
  });

  const orphans = streamingCurriculum
    .filter((m) => !assigned.has(m.slug))
    .sort((a, b) => a.order - b.order);
  if (orphans.length) {
    resolved.push({
      id: "stream-more",
      name: "More Modules",
      tagline: "Additional modules not yet assigned to a chapter.",
      moduleSlugs: orphans.map((m) => m.slug),
      modules: orphans,
    });
  }
  return resolved;
}

/**
 * CrossBridge Church (CBC) — SQ-6 Sound Tech Training Curriculum
 * -------------------------------------------------------------
 * Content is specific to the CrossBridge system as documented in the house
 * Sound Manuals (Allen & Heath SQ-6 + AR2412 stage box + ME-500 personal
 * monitors). Where the source notes were ambiguous, a section says
 * "confirm on the board" — verify against the physical console and update.
 *
 * To edit a lesson: change the `sections` text. To add a module: append a
 * new object to the exported `curriculum` array — the dashboard, module
 * list, quizzes, and admin grid pick it up automatically.
 */

export type LessonSection = {
  heading: string;
  /** Plain paragraphs; blank line separates paragraphs. "- " = bullets, "1. " = numbered. */
  body: string;
  /** Optional operator tip highlighted in the UI. */
  tip?: string;
  /** Optional physical control this section refers to (shown as a chip). */
  control?: string;
  /**
   * Optional named visual rendered under the lesson body (for visual learners).
   * Handled by components/LessonVisual.tsx. Current keys:
   *   "eq-vocal" | "eq-bass" | "eq-hpf" | "signal-chain"
   *   "comp-transfer" | "comp-controls" | "comp-limiter"
   */
  visual?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  /** Index into options of the correct answer. */
  answer: number;
  explanation: string;
};

export type Module = {
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  /** Emoji used as the module glyph. */
  icon: string;
  estMinutes: number;
  objectives: string[];
  sections: LessonSection[];
  quiz: QuizQuestion[];
};

export const curriculum: Module[] = [
  {
    slug: "welcome",
    order: 1,
    title: "Welcome to the CBC Sound Team",
    subtitle: "What this training covers and how our SQ-6 serves the service.",
    icon: "👋",
    estMinutes: 8,
    objectives: [
      "Understand the goal of the CrossBridge sound team",
      "Know what the Allen & Heath SQ-6 is and why we use it",
      "Learn how to move through this interactive guide",
    ],
    sections: [
      {
        heading: "Why we serve",
        body: "Great sound is invisible. When it's done well, nobody thinks about the mix — they're free to worship. Our job on the CrossBridge sound team is to serve the congregation and the platform team with clear, consistent, distraction-free audio, every service.\n\nThis program takes you from your first look at the board to confidently running a Sunday on our system. Work through the modules in order — each builds on the last — and it tracks your progress automatically.",
      },
      {
        heading: "Our system at a glance",
        body: "The heart of our audio system is the Allen & Heath SQ-6 digital mixing console. Around it:\n\n- An AR2412 stage box carries the stage inputs to the console over a single SLink cable.\n- ME-500 personal mixers give musicians their own in-ear monitor mixes on stage.\n- The console feeds the house (main speakers), the hallway, and the live stream.\n- Wireless handheld mics are color-coded (Pastor, Blue, Yellow, Orange, Green, White) so we can find a channel fast.\n\nUnlike an analog board, the SQ-6 is a digital console: it shows one channel's controls on a touchscreen at a time, and it remembers complete setups called Scenes — so every service can start from the same trusted baseline.\n\nThat baseline is a Scene called 'Singing R1'. When the system turns on it asks whether to recall the baseline — you select YES to load it. 'Singing R1' is never overwritten, so it's always there as a clean, known-good starting point for the next service. You'll do this hands-on in the Powering Up module.",
        tip: "\"Digital\" just means the board is a computer for sound. The concepts — gain, EQ, faders, groups, mixes — are universal. Learn the concepts and our specific buttons follow.",
      },
      {
        heading: "How to use this guide",
        body: "Each module is a set of short lessons followed by a quiz. Read a lesson, then when you're next in the booth, find the control on the real board and try it during rehearsal — hands-on repetition is how this sticks.\n\n- Use Next / Previous to move through a module's lessons.\n- Pass the quiz (70%) to mark a module complete.\n- Your dashboard shows overall progress and what's next.\n- Nothing you do in this guide touches the real console. Practice fearlessly here.",
        tip: "Pair this guide with real board time. Shadow a lead tech for your first couple of services before you fly solo.",
      },
    ],
    quiz: [
      {
        question: "What carries the stage inputs to our SQ-6 console?",
        options: [
          "A separate laptop for each instrument",
          "An AR2412 stage box over a single SLink cable",
          "Bluetooth from each microphone",
          "The ME-500 personal mixers",
        ],
        answer: 1,
        explanation:
          "The AR2412 stage box collects the stage inputs and sends them to the SQ-6 over one SLink cable. ME-500s are the musicians' personal in-ear mixers.",
      },
      {
        question: "What is our core job as CrossBridge sound techs?",
        options: [
          "To make the mix as loud and impressive as possible",
          "To deliver clear, consistent, distraction-free audio that serves worship",
          "To show off everything the SQ-6 can do",
          "To keep the platform team from touching the stage",
        ],
        answer: 1,
        explanation:
          "Good sound is invisible. We serve the congregation and platform by keeping audio clear and consistent so people can focus on worship.",
      },
      {
        question: "What is a Scene on the SQ-6?",
        options: [
          "A lighting cue",
          "A saved snapshot of a complete console setup we can recall each service",
          "A single microphone",
          "The live video feed",
        ],
        answer: 1,
        explanation:
          "A Scene stores a full console setup so every service can start from the same trusted baseline — we recall 'Singing R1' to begin.",
      },
    ],
  },
  {
    slug: "signal-flow",
    order: 2,
    title: "How Our System Is Wired",
    subtitle: "Signal flow at CrossBridge — from stage box to house, monitors, and stream.",
    icon: "🔀",
    estMinutes: 14,
    objectives: [
      "Trace a signal from the stage through the SQ-6 to every output",
      "Explain physical vs. digital routing at CBC",
      "Name our outputs: house LR, streaming, and hallway",
    ],
    sections: [
      {
        heading: "Physical routing: stage to console",
        body: "Every audio problem is easier to solve when you can picture the path a signal takes. At CBC the physical path is:\n\n1. Sound source — someone sings, speaks, or plays.\n2. Microphone / DI on stage — plugs into a stage box (the stage boxes are labeled by area, e.g. RFS, LRS, BCK for the drums).\n3. Stage box → back panel → SLink → the SQ-6 console.\n4. Our main mic inputs come in this way; the wireless handhelds are local inputs at the console.\n\nSo when a stage source is dead, the first question is: is it plugged into the right stage box socket, and is that socket patched to the channel you expect?",
        tip: "Most stage inputs reach the board through the AR2412 stage box over SLink. If a whole stage box goes quiet, suspect the SLink connection before any single channel.",
        control: "SLink / AR2412",
      },
      {
        heading: "Digital routing: inside the console",
        body: "Once a signal is inside the SQ-6, it flows: Input → processing → out to the mixes.\n\n- Every INPUT channel can be sent to a GROUP (which adds shared processing) and is controlled by a DCA (which sets mute and level, with no processing).\n- From there it reaches the outputs: the main L/R (house), the AUX mixes (monitors and stream feeds), and the streaming/hallway outputs.\n\nThe short version we teach: Board → Input → Group → L/R. Groups and DCAs each do a specific job — you'll learn both in their own module.",
        control: "Groups / DCAs",
      },
      {
        heading: "Our outputs",
        body: "The SQ-6 feeds several destinations at once:\n\n- MAIN L/R → out through the AR2412 (outputs 1 & 2) to the house speakers. This is what the congregation hears.\n- STREAMING → local outputs 11 & 12, feeding the live stream (YouTube / Facebook).\n- HALLWAY → local outputs 13 & 14, a duplicate of the L/R mix for the lobby/hallway.\n- MONITOR MIXES (AUX) → the ME-500 personal mixers so musicians hear themselves on stage.\n\nThe same channels feed all of these at different levels — that's the power of the console: many independent mixes from the same sources.",
        tip: "House, hallway, and stream are three different outputs. If the room sounds fine but the stream doesn't, the problem is downstream of the L/R mix — check the streaming feed, not the channel.",
        control: "Main LR / Outputs",
      },
    ],
    quiz: [
      {
        question: "At CBC, how do most stage inputs get from the stage to the SQ-6?",
        options: [
          "Each runs a long XLR straight to the console",
          "Through a stage box, then back panel → SLink → SQ-6",
          "Over WiFi",
          "Through the ME-500 mixers",
        ],
        answer: 1,
        explanation:
          "Stage sources plug into a stage box, which sends everything to the console over SLink. The wireless handhelds are the local inputs at the board.",
      },
      {
        question: "Which outputs carry the streaming and hallway feeds?",
        options: [
          "AR2412 outputs 1 & 2",
          "Local outputs 11 & 12 (streaming) and 13 & 14 (hallway)",
          "The ME-500 outputs",
          "There is no separate stream or hallway feed",
        ],
        answer: 1,
        explanation:
          "Main L/R goes out the AR2412 (1 & 2) to the house; local outputs 11/12 feed the stream and 13/14 feed the hallway (a duplicate of L/R).",
      },
      {
        question: "Inside the console, what's the difference between a Group and a DCA?",
        options: [
          "They are the same thing",
          "A Group adds shared processing; a DCA controls mute and level with no processing",
          "A Group only mutes; a DCA only adds reverb",
          "A DCA feeds the stream; a Group feeds the house",
        ],
        answer: 1,
        explanation:
          "Groups add processing to a set of channels; DCAs are just a convenient master for mute and level and do no processing.",
      },
      {
        question: "The house sounds fine but the live stream has no audio. Where should you look first?",
        options: [
          "The individual channel gains",
          "The streaming feed (local outputs 11 & 12), since it's a separate output from the house L/R",
          "The stage box SLink cable",
          "The ME-500 mixers",
        ],
        answer: 1,
        explanation:
          "House and stream are separate outputs. If the room is fine, the L/R mix is fine — the issue is downstream on the streaming feed.",
      },
    ],
  },
  {
    slug: "board-layout",
    order: 3,
    title: "Board Layout, Layers & Soft Keys",
    subtitle: "Getting oriented on our SQ-6 — layers, the touchscreen, and the key buttons.",
    icon: "🎛️",
    estMinutes: 13,
    objectives: [
      "Switch between our four fader layers (A/B/C/D)",
      "Use the touchscreen and select keys to focus a channel",
      "Find the mute-group and scene-recall buttons",
    ],
    sections: [
      {
        heading: "Our four layers",
        body: "The SQ-6 has more channels than physical faders, so it uses LAYERS — think of them as pages of faders. The Layer buttons on the bottom-left of the board cycle through them. At CrossBridge our layers are:\n\n- LAYER A — all inputs\n- LAYER B — DCAs, Groups, and FX Sends/Returns\n- LAYER C — AUX (monitor) controls\n- LAYER D — vocal inputs\n\nLearn where each thing lives so you're not hunting during a song. Press a Layer button and the same faders instantly become that page's controls.",
        tip: "During a service you'll spend most of your time on Layer A (inputs) and Layer D (vocals). Know how to jump to Layer C (AUX) when a musician needs a monitor tweak.",
        control: "Layer buttons (A/B/C/D)",
      },
      {
        heading: "Touchscreen + select keys",
        body: "The SQ-6 pairs a color touchscreen with physical knobs. You press a channel's SELECT key (or touch it on screen) to FOCUS it — the screen and rotaries then show that channel's processing (gain, HPF, EQ, compressor). Select a different channel and the same knobs now control the new one.\n\nSelecting a channel changes nothing about what's heard — it just decides which channel you're editing. That's how one board controls dozens of channels without thousands of knobs.",
        tip: "Use the interactive Board Explorer below to click each region of the SQ-6 and see what it does.",
        control: "Select keys",
      },
      {
        heading: "Mute-group and scene buttons",
        body: "Two sets of buttons do a lot of the work on a Sunday:\n\n- The MUTE-GROUP buttons at the top-right of the board mute or unmute a whole group of inputs at once. RED means muted. You'll unmute groups as the band comes in and mute the ones not in use.\n- The SCENE-RECALL buttons (soft keys) load saved setups. Buttons 1–6 recall scenes — and importantly they control MUTES only, not levels. Button 7 STORES the current setup back to the scene.\n\nWe recall the 'Singing R1' scene to start each service (selecting YES when the console asks). 'Singing R1' is our permanent baseline — we recall it but never overwrite it, so Button 7 is reserved for rare, deliberate changes a lead has approved.",
        tip: "Red = muted. A glance at the top-right mute buttons tells you what's live and what's silenced.",
        control: "Mute-group / Scene keys",
      },
    ],
    quiz: [
      {
        question: "On our SQ-6, what does Layer B hold?",
        options: [
          "All inputs",
          "DCAs, Groups, and FX Sends/Returns",
          "AUX (monitor) controls",
          "Only the vocals",
        ],
        answer: 1,
        explanation:
          "Our layers are A = all inputs, B = DCAs/Groups/FX, C = AUX controls, D = vocal inputs.",
      },
      {
        question: "On the top-right mute-group buttons, what does RED indicate?",
        options: [
          "The group is soloed",
          "The group is muted",
          "The group is recording",
          "Phantom power is on",
        ],
        answer: 1,
        explanation:
          "Red means muted. The top-right buttons mute/unmute whole groups of inputs at once.",
      },
      {
        question: "What do scene-recall buttons 1–6 control when you recall a scene?",
        options: [
          "All fader levels and processing",
          "Mutes only — not levels",
          "The lighting board",
          "The streaming feed",
        ],
        answer: 1,
        explanation:
          "Buttons 1–6 recall scenes but control mutes only, not levels. Button 7 stores the current setup back to the scene.",
      },
      {
        question: "What does pressing a channel's SELECT key do?",
        options: [
          "Mutes the channel",
          "Sends it to the congregation",
          "Focuses it so the touchscreen and rotaries show that channel's processing, without changing levels",
          "Stores a scene",
        ],
        answer: 2,
        explanation:
          "Select focuses a channel for editing only. It changes nothing about what's heard.",
      },
    ],
  },
  {
    slug: "startup",
    order: 4,
    title: "Powering Up: The Startup Sequence",
    subtitle: "The exact CrossBridge power-on steps, in order, every service.",
    icon: "🔌",
    estMinutes: 12,
    objectives: [
      "Perform the CBC startup sequence in the correct order",
      "Recall the 'Singing R1' scene and check mic batteries",
      "Follow the service-morning timeline",
    ],
    sections: [
      {
        heading: "The startup sequence",
        body: "Follow this order every service — it's our 'Operator's Guide to the Universe':\n\n1. Turn on the BREAKERS (the labeled breakers in the left two panels — this also powers the lighting).\n2. Turn on the KEY SWITCH (on the wall, to the right of the sound board).\n3. Bring up LIGHTING — go to lighting scene 19, then raise the master fader on the lighting control panel.\n4. Check MIC BATTERIES — if a mic shows only 1 bar (of 3), change the batteries (2 AA).\n5. Recall the 'Singing R1' SCENE on the SQ-6. When the console powers up it asks whether to recall the baseline — select YES to load 'Singing R1'.\n6. Unmute GROUPS as required once rehearsal starts.\n7. Unmute the SPECIFIC channels being used — mute the others.\n8. Walk the auditorium and listen for balanced levels.\n9. If Peter, Rob, or Jonathan are preaching, prep Pastor 2.\n\nNote: 'Singing R1' is our permanent baseline — we recall it, but we never overwrite it. It stays intact so every service (and next week's tech) starts from the same trusted setup.",
        tip: "The Blue mic is the announcement mic and creates static if the mic is unmuted without being on — be sure to turn the mic on before unmuting it.",
        control: "Key switch / Scenes",
      },
      {
        heading: "The service-morning timeline",
        body: "Timing keeps the morning calm. Aim to be set up and running by 8:20 AM (rehearsal starts at 8:30):\n\n- By 8:20 — breakers on, key switch on, lighting up, console booted and 'Singing R1' recalled (select YES when it asks to recall the baseline).\n- 8:25 — check the Scheduling App to see who's singing (which color mic each vocalist gets). Bring out the mics and turn each on with the red button on the bottom; check the battery bars.\n- 8:30 — be ready to unmute instruments as they're plugged in. Unmute the Vocal, Instrument, Drum, and Keys groups as applicable.\n- 8:35 — walk out to the auditorium and listen; it should be level across the board.\n- 8:40 — do a final line check. Leave the 'Singing R1' baseline as it is — recall it, don't overwrite it.",
        tip: "Arrive early. Your goal before rehearsal: every input verified and every performer able to hear themselves. Solve problems now, not during the first song.",
      },
      {
        heading: "Why order matters",
        body: "Powering up in the right order protects the gear and the room. The key switch brings the system up cleanly; recalling 'Singing R1' loads our known-good baseline (channel names, groups, routing, and starting mutes) so every service begins consistent instead of from whatever the last person left behind.\n\nChecking batteries early avoids a dead mic mid-song. And unmuting only what's in use keeps the stage clean and prevents feedback and buzz from open channels.",
        tip: "If you skip the 'Singing R1' recall, you're mixing on top of last week's leftovers. Always recall it first.",
      },
    ],
    quiz: [
      {
        question: "What are the first two steps of the CBC startup sequence?",
        options: [
          "Recall Singing R1, then check batteries",
          "Turn on the breakers, then the key switch",
          "Bring up lighting, then unmute groups",
          "Turn on the mics, then the stream",
        ],
        answer: 1,
        explanation:
          "Startup begins with the breakers (left two panels, also powers lighting), then the key switch on the wall to the right of the board.",
      },
      {
        question: "A wireless mic shows only 1 battery bar. What do you do?",
        options: [
          "Use it anyway — 1 bar is fine",
          "Change the batteries (2 AA)",
          "Mute it for the whole service",
          "Recall a new scene",
        ],
        answer: 1,
        explanation:
          "Our mics show 3 bars full; at 1 bar you change the batteries (2 AA) so it doesn't die mid-service.",
      },
      {
        question: "Which scene do we recall to start the service, and what do we do with it?",
        options: [
          "'Sunday Default' — overwrite it every week",
          "'Singing R1' — recall it (select YES when the console asks) and leave the baseline intact; never overwrite it",
          "Lighting scene 19 — store it with Select",
          "'Pastor 2' — recall it from the stream computer",
        ],
        answer: 1,
        explanation:
          "We recall 'Singing R1' to begin — when the console powers up it asks whether to recall the baseline, so select YES. 'Singing R1' is our permanent baseline; we never overwrite it.",
      },
      {
        question: "The Blue mic is picking up static as soon as you unmute it. What went wrong?",
        options: [
          "The battery is dead",
          "The mic was unmuted before it was turned on — the Blue announcement mic creates static if unmuted while off",
          "The Singing R1 scene is corrupted",
          "The stream is down",
        ],
        answer: 1,
        explanation:
          "The Blue mic is the announcement mic and creates static if it's unmuted without being on. Always turn the mic on first, then unmute it.",
      },
      {
        question: "By what time should the system be set up and running?",
        options: ["8:00 AM", "8:20 AM", "9:00 AM", "10:30 AM"],
        answer: 1,
        explanation:
          "Rehearsal starts at 8:30; be set up and running by 8:20 so musicians have monitors and you've verified inputs before rehearsal.",
      },
    ],
  },
  {
    slug: "mics-colors",
    order: 5,
    title: "Mics & the Color System",
    subtitle: "Our color-coded wireless mics and how singers are assigned in the Scheduling App.",
    icon: "🎤",
    estMinutes: 12,
    objectives: [
      "Identify our color-coded wireless mics and what each is for",
      "Use the Scheduling App to assign the right mic to each singer",
      "Power mics on/off and check batteries correctly",
    ],
    sections: [
      {
        heading: "The color system",
        body: "Our wireless handheld mics are color-coded so you can find any channel instantly under service pressure. The colors and their roles:\n\n- PASTOR 1 and PASTOR 2 — the preaching mics (their own group and DCA).\n- BLUE — the ANNOUNCEMENT mic. It is its own wireless handheld, separate from the computer input (the computer audio is a different channel entirely). Blue also creates static if it's unmuted while still turned off, so always turn the mic on before you unmute it.\n- YELLOW, ORANGE, GREEN, WHITE — worship vocalists.\n\nEach color maps to a fixed mute group and DCA on the board, so muting or leveling 'the vocals' is one move. Learn the colors cold — during a service you'll reach for 'Orange' faster than for a channel number.",
        tip: "The Blue mic is the announcement mic and creates static if the mic is unmuted without being on — be sure to turn the mic on before unmuting it. It is separate from the computer input.",
        control: "Wireless handhelds",
      },
      {
        heading: "Who sings which color — the Scheduling App",
        body: "Before the service, check the Scheduling App to see who is singing and which color mic each vocalist gets. Assignments change week to week, so always check the app rather than assuming.\n\nOur current standing mic assignments are:\n\n- Erin — Yellow\n- Sarah — Piano Mic\n- Val — Orange\n- William — White Mic\n- New Female Vocalist — Orange\n- New Male Vocalist — White\n\nOnce you know the assignments, bring out exactly those mics and hand them to the right people. This is why the color system works: the singer changes, but 'Yellow' is always the same channel, group, and DCA on the board.",
        tip: "Match the app to the mic to the person before rehearsal. A mislabeled mic is the most common cause of 'why is the wrong person's fader doing nothing?'",
        control: "Scheduling App",
      },
      {
        heading: "Why the mics are tuned by voice",
        body: "The mics aren't interchangeable — each one is EQ'd (tuned) for the kind of voice that uses it, so the singer sounds natural without a lot of channel EQ:\n\n- The WHITE mic is tuned for a MALE vocalist — its curve suits a lower, fuller voice.\n- The ORANGE and YELLOW mics are tuned for FEMALE vocalists — their curves suit a higher voice.\n\nThat's why our defaults line up the way they do: a new male vocalist takes White (already tuned for him), and a new female vocalist takes Orange (already tuned for her). Handing a male singer a mic tuned for a female voice (or vice-versa) means fighting the tuning with EQ all morning. Match the voice to the mic that's tuned for it first.",
        tip: "White = tuned for a male voice; Orange and Yellow = tuned for female voices. Match the voice to the mic and you'll barely need to touch the EQ.",
        control: "Mic tuning",
      },
      {
        heading: "Powering and checking mics",
        body: "For each mic in use:\n\n1. Turn it ON with the red button on the bottom of the handheld.\n2. Check the battery — full is 3 bars; if it's at 1 bar, change the batteries (2 AA).\n3. Confirm it shows up and passes signal at the board on the matching color channel.\n\nAt the end of the service, ensure every mic is turned OFF, then mute all groups. (Our wireless system includes Shure ULX and Sennheiser EW/XSW units — a lead can show you which receiver belongs to which color.)",
        tip: "Turn mics on with the red button on the bottom and always verify signal at the board before rehearsal — don't assume 'on' means 'working.'",
      },
    ],
    quiz: [
      {
        question: "What is the BLUE mic, and how is it related to the computer input?",
        options: [
          "It's the lead worship vocal, routed through the computer",
          "It's the announcement mic — its own wireless handheld, separate from the computer input",
          "It's the drum mic",
          "It's the same channel as the computer audio",
        ],
        answer: 1,
        explanation:
          "Blue is the announcement mic — a wireless handheld on its own channel, separate from the computer input. Turn it on before unmuting it, or it creates static.",
      },
      {
        question: "A new male vocalist arrives. Which mic should he get, and why?",
        options: [
          "Yellow — it's tuned for a female voice",
          "White — it's tuned for a male vocalist",
          "Blue — it's the announcement mic",
          "Any mic; the tuning is identical",
        ],
        answer: 1,
        explanation:
          "The White mic is tuned for a male voice, while Orange and Yellow are tuned for female voices. Matching the voice to the mic that's tuned for it avoids fighting the tuning with EQ.",
      },
      {
        question: "How do you know which vocalist gets which color mic?",
        options: [
          "It's always the same people every week",
          "Check the Scheduling App before the service",
          "Whoever grabs a mic first",
          "The mic colors are random",
        ],
        answer: 1,
        explanation:
          "Assignments change weekly. The Scheduling App shows who's singing and which color mic each gets (e.g., Erin → Yellow, Val → Orange).",
      },
      {
        question: "Why does the color system work even though singers change each week?",
        options: [
          "Because each color is always the same channel, group, and DCA on the board",
          "Because the mics rename themselves automatically",
          "Because there's only ever one singer",
          "Because colors don't actually matter",
        ],
        answer: 0,
        explanation:
          "A color maps to a fixed channel/group/DCA. The person holding 'Yellow' changes, but the board handling of Yellow stays constant.",
      },
      {
        question: "A wireless handheld shows 1 battery bar during setup. The correct action is:",
        options: [
          "Leave it — it will last",
          "Swap in fresh batteries (2 AA)",
          "Turn the gain up to compensate",
          "Reassign the singer to a wired mic only",
        ],
        answer: 1,
        explanation:
          "Full is 3 bars; at 1 bar change the batteries (2 AA) during setup so it doesn't fail mid-service.",
      },
    ],
  },
  {
    slug: "mutes-blue",
    order: 6,
    title: "Mute Groups, Channels & the Blue Mic",
    subtitle: "Keeping the stage clean — unmute what's in use, mute what isn't.",
    icon: "🔇",
    estMinutes: 11,
    objectives: [
      "Use the top-right mute-group buttons correctly",
      "Unmute channels as instruments plug in and mute unused ones",
      "Handle the Blue mic and open-channel buzz",
    ],
    sections: [
      {
        heading: "Mute groups as the band comes in",
        body: "The top-right buttons mute or unmute a whole GROUP of inputs at once (red = muted). As rehearsal starts and instruments get plugged in and turned on, you unmute the groups that are in use — Vocals, Instruments, Drums, Keys — and leave the rest muted.\n\nThis keeps the stage clean: only what's actually being played is open. Muting groups you don't need is one of the simplest, most powerful tools for a distraction-free mix.",
        tip: "Work the groups first, then fine-tune individual channels. A quick glance at the top-right buttons tells you what's live.",
        control: "Top-right mute buttons",
      },
      {
        heading: "Mute the unused — watch for buzz",
        body: "Some inputs BUZZ or hum when they're plugged in but not in use — the electric guitar and the piano mic are known culprits on our stage. If an instrument isn't being played, keep its channel muted so that buzz never reaches the mix.\n\nThe habit: unmute the SPECIFIC channels being used, mute the others. Then unmute a channel a beat before it's needed and re-mute it when it goes quiet. Open, unused mics and DIs are the #1 source of noise and feedback.",
        tip: "If you hear a mystery buzz, look for an open channel that isn't being played — especially electric guitar or the piano mic — and mute it.",
        control: "Channel mutes",
      },
      {
        heading: "Focus on the essentials first — the Blue mic",
        body: "When the service starts, get the essentials up before anything else: the Pastor mic and the Blue (announcement) mic. Those carry the spoken word, and a missed unmute there is the most noticeable mistake we can make.\n\nBlue is the announcement mic — its own wireless handheld, separate from the computer input. Turn the mic ON before you unmute it (unmuting it while it's off creates static), then unmute it when announcements are happening and mute it when they're done. Prioritize spoken-word channels being live and clean over fine-tuning the band.",
        tip: "Unmute first, fine-tune second. Pastor and Blue live and clear is the top priority every service — and turn Blue on before unmuting it so it doesn't static.",
      },
    ],
    quiz: [
      {
        question: "As the band plugs in during rehearsal, what do you do with the mute groups?",
        options: [
          "Leave every group muted the whole time",
          "Unmute the groups in use (Vocals, Instruments, Drums, Keys) and leave the rest muted",
          "Unmute every group immediately",
          "Only unmute the drum group",
        ],
        answer: 1,
        explanation:
          "Unmute the groups that are actually in use and keep the rest muted — that keeps the stage clean and prevents stray noise.",
      },
      {
        question: "You hear a buzz on stage during a quiet moment. What's the likely cause?",
        options: [
          "The house speakers are broken",
          "An open, unused channel — often electric guitar or the piano mic — that should be muted",
          "The Singing R1 scene is corrupted",
          "The stream computer is off",
        ],
        answer: 1,
        explanation:
          "Some inputs buzz when plugged in but not played. Keep unused channels (notably electric guitar and the piano mic) muted.",
      },
      {
        question: "When the service starts, which channels should you prioritize getting live?",
        options: [
          "The drum overheads",
          "The Pastor mic and the Blue (announcements) mic",
          "The FX returns",
          "The hallway feed",
        ],
        answer: 1,
        explanation:
          "Spoken word matters most — get Pastor and Blue up and clean first, then fine-tune the band.",
      },
    ],
  },
  {
    slug: "groups-dcas",
    order: 7,
    title: "Groups & DCAs",
    subtitle: "Two ways to control many channels at once — and how they differ.",
    icon: "🎚️",
    estMinutes: 13,
    objectives: [
      "Explain the difference between a Group and a DCA",
      "Recognize our group and DCA assignments",
      "Use DCAs and group compression to shape the mix",
    ],
    sections: [
      {
        heading: "Group vs. DCA",
        body: "Both let you control many channels together, but they do different jobs:\n\n- A GROUP is an actual audio bus: the channels are summed into it, and you can add PROCESSING (like compression) to the whole group at once. Our groups feed the L/R and are set PRE-FADER for their monitor sends.\n- A DCA (Digitally Controlled Amplifier) is NOT an audio bus — it's a remote master for the faders and mutes of its assigned channels. It controls MUTE and LEVEL only and does NO processing.\n\nRule of thumb: reach for a GROUP when you want shared processing; reach for a DCA when you just want one fader/mute to ride a set of channels.",
        tip: "Group = processing + audio bus. DCA = convenient master for level and mute, no processing. The audio still flows through the channels and groups; a DCA just rides them.",
        control: "Groups / DCAs",
      },
      {
        heading: "Our assignments",
        body: "Our setup groups things logically (confirm exact numbers on the board, as they've evolved):\n\n- GROUPS — roughly: 1 Pastor, 2 Vocals (Yellow/Orange/etc.), 3 Instruments, 4 Piano/Keys, plus a drums group. Groups add processing.\n- DCAs — roughly: 1 Pastor, 2 Vocals Main, 3 Vocals Second, 4 Electric Guitar, 5 Analog Guitar, 6 Synth L/R, 7 Piano L/R, 8 Drums.\n\nSo the pastor's mics ride together on Group 1 / DCA 1, the vocals ride on the vocal group and vocal DCAs, and so on. This is why one move can raise 'the vocals' or mute 'the drums.'",
        tip: "When someone says 'bring up the vocals,' you're moving a group/DCA — not chasing four individual faders. Learn which master controls which family.",
      },
      {
        heading: "Group compression, used musically",
        body: "Because a group can carry processing, we can compress a whole family of channels together (e.g., group compression on the vocals or drums) for a glued, consistent sound.\n\nA useful trick this enables: with a compressed group, raising one DCA while simultaneously lowering another (for example DCA 1 up as DCA 2 comes down) produces a more dynamic response than either move alone — because the group compression reacts to the changing balance. Small, purposeful moves; let the group processing do the smoothing.",
        tip: "Let group compression glue a section together, then ride DCAs for balance. You're shaping families of sound, not fighting individual channels.",
      },
    ],
    quiz: [
      {
        question: "What is the key difference between a Group and a DCA?",
        options: [
          "A Group controls only mute; a DCA adds reverb",
          "A Group is an audio bus that can add processing; a DCA is a level/mute master with no processing",
          "They are identical",
          "A DCA feeds the house; a Group feeds the stream",
        ],
        answer: 1,
        explanation:
          "Channels sum into a Group, which can carry processing. A DCA is just a remote master for level and mute and does no processing.",
      },
      {
        question: "You want to apply compression across all the vocals at once. Which do you use?",
        options: ["A DCA", "A Group", "The main L/R fader", "A scene recall"],
        answer: 1,
        explanation:
          "Processing (like compression) lives on Groups. A DCA only rides level and mute; it can't add processing.",
      },
      {
        question: "Roughly which family rides on DCA 1 in our setup?",
        options: ["Drums", "Pastor", "Synth", "The stream"],
        answer: 1,
        explanation:
          "Our DCAs run roughly 1 Pastor, 2 Vocals Main, 3 Vocals Second, 4 Electric Guitar, 5 Analog Guitar, 6 Synth, 7 Piano, 8 Drums.",
      },
      {
        question: "Why can raising one DCA while lowering another create a more dynamic response?",
        options: [
          "Because DCAs add reverb",
          "Because the group's compression reacts to the changing balance between the channels",
          "Because it mutes the house",
          "It doesn't — DCAs have no effect",
        ],
        answer: 1,
        explanation:
          "With group compression in place, shifting the balance between DCAs changes how the compressor responds, giving a more dynamic result.",
      },
    ],
  },
  {
    slug: "monitors-aux",
    order: 8,
    title: "Monitors: AUX Sends & ME-500s",
    subtitle: "Building what the stage hears — and how each vocalist mixes their own in-ears.",
    icon: "🎧",
    estMinutes: 14,
    objectives: [
      "Explain the difference between the house mix and monitor mixes",
      "Recognize our AUX assignments and the ME-500 system",
      "Understand how vocalists adjust their own levels on the ME-500",
    ],
    sections: [
      {
        heading: "House vs. monitors, and our AUX map",
        body: "The main L/R is what the congregation hears. The musicians need their own separate blends — MONITOR mixes — delivered to their ME-500 personal mixers as in-ears on stage.\n\nOur AUX assignments:\n- AUX 1 — Stream\n- AUX 2 — Drums\n- AUX 3 — Comms (talkback between team)\n- AUX 4 — FX Return\n- AUX 7 — Pastor\n\nNote what changed: the vocalists no longer have their own AUX monitor sends (we removed the old AUX 5 = Yellow and AUX 6 = Orange). The colored vocal mics now feed the ME-500s as straight mic inputs on the personal-mixer network, and each singer dials in how much of themselves they want in their ears right on their own ME-500. That takes the vocal-monitor level off your plate at the console — you're no longer riding an AUX send for each singer.",
        tip: "The AUX buses aren't all monitors — AUX 1 is the stream feed and AUX 3 is comms. Vocal monitors are no longer AUX sends: each vocalist adjusts their own level on their ME-500.",
        control: "AUX (Layer C)",
      },
      {
        heading: "Pre-fade: monitors stay stable",
        body: "Monitor sends are taken PRE-FADER — before the channel's main fader. That means when you change the house level, the performer's monitor level does NOT change. Their in-ear blend stays rock-steady no matter what you do out front.\n\n(Effects, by contrast, are usually POST-fade so the wet effect follows the vocal. Rule of thumb here: monitors = pre-fade, effects = post-fade.)",
        tip: "If a musician says their in-ears jump around whenever you mix the house, a send that should be pre-fade is set post-fade.",
        control: "Pre-fade sends",
      },
      {
        heading: "One vocal channel, two destinations",
        body: "Each vocal is a SINGLE channel on the board — the colored mic itself (Yellow, Orange, etc.). That one channel feeds two different places at once:\n\n- To the HOUSE — through the Vocal Group → main L/R, so the congregation hears the singer. This is the level you mix at the console.\n- To the STAGE — the same mic input is available on the ME-500 personal-mixer network, so each singer can put as much of themselves in their own in-ears as they want.\n\nThe key idea still holds: the singer's in-ear level and the house level are independent. But the responsibility split is simpler now — you own the house level; the vocalist owns their own monitor level on the ME-500. If a singer wants more of themselves in their ears, they turn themselves up on their ME-500; you don't touch the house fader for that.",
        tip: "You own the house level; the vocalist owns their own in-ear level on the ME-500. If they want more of themselves, that's a move on their personal mixer — not the house fader.",
        control: "ME-500 personal mix",
      },
    ],
    quiz: [
      {
        question: "How do vocalists now get more of themselves in their in-ears?",
        options: [
          "You turn up their AUX 5 or AUX 6 send at the console",
          "They adjust their own level on their ME-500 personal mixer",
          "You raise the house fader",
          "They can't — the level is fixed",
        ],
        answer: 1,
        explanation:
          "We removed the vocal AUX sends (the old AUX 5 = Yellow, AUX 6 = Orange). The vocal mics feed the ME-500s as straight mic inputs, so each singer dials in their own level on their personal mixer.",
      },
      {
        question: "Why are monitor sends taken pre-fader?",
        options: [
          "So they follow every house fader move",
          "So the performer's monitor level stays stable no matter what you do to the house mix",
          "To mute the monitors automatically",
          "To add reverb to the in-ears",
        ],
        answer: 1,
        explanation:
          "Pre-fade sends come before the channel fader, so house moves don't disturb the stage monitor blend.",
      },
      {
        question: "How does a single vocal channel reach both the house and the singer's in-ears?",
        options: [
          "It doesn't — you need two separate channels per singer",
          "The one channel feeds the house via the Vocal Group → L/R, and the same mic input is available on the ME-500 for the singer to mix themselves",
          "By turning the vocal up twice as loud",
          "Through the lighting board",
        ],
        answer: 1,
        explanation:
          "Each vocal is one channel: you mix it to the house through the Vocal Group → L/R, and the same mic input feeds the ME-500 network so the singer sets their own in-ear level. The two levels stay independent.",
      },
      {
        question: "Where do the musicians' monitor mixes actually come out?",
        options: [
          "The house speakers",
          "The ME-500 personal mixers (in-ears) on stage",
          "The hallway speakers",
          "The stream",
        ],
        answer: 1,
        explanation:
          "Monitor mixes are built on AUX buses and delivered to the ME-500 personal mixers as in-ears for the musicians on stage.",
      },
    ],
  },
  {
    slug: "eq",
    order: 9,
    title: "EQ at CrossBridge",
    subtitle: "Shaping tone the CBC way — check the source first, then HPF and EQ.",
    icon: "🎚️",
    estMinutes: 13,
    objectives: [
      "Check the source before reaching for EQ",
      "Apply the high-pass filter and a typical vocalist EQ",
      "Apply a typical bass EQ",
    ],
    sections: [
      {
        heading: "Check the source first",
        body: "Before touching EQ, check the incoming signal. The first question for any vocal mic: is the mic close to their mouth? Position fixes more tone problems than EQ ever will.\n\nEveryone's voice is unique. The goal of EQ isn't to make everyone sound the same — it's to make the mic accurately output their voice the way they sound in person. Start from a good, close capture, then shape gently.",
        tip: "If a voice sounds thin or distant, check mic technique first. EQ can't rescue a mic held six inches away.",
        visual: "signal-chain",
      },
      {
        heading: "HPF + typical vocalist EQ",
        body: "For vocals we shape a fairly consistent curve:\n\n- HIGH-PASS FILTER (HPF) — cut the low end. Stages are full of low rumble (foot stomps, handling, HVAC) that adds nothing to a voice. We use the HPF often on vocalists.\n- A gentle BOOST in the mid range for presence and body.\n- A small REDUCTION in the high-mids to add clarity and reduce harshness.\n- A BOOST at the higher end for air and sparkle.\n\nSmall, purposeful moves. If you find yourself making huge boosts, go back and check the mic and its position.",
        tip: "Roll in the HPF on almost every vocal — it cleans up the whole mix instantly without making the voice thin.",
        control: "HPF / PEQ",
        visual: "eq-vocal",
      },
      {
        heading: "Typical bass EQ",
        body: "Bass is shaped almost oppositely to vocals:\n\n- A BOOST in the low end for weight — especially where the bass mostly sits.\n- A REDUCTION in the mid range for a clearer, crisper sound that doesn't muddy the mix.\n- A BOOST at the high end to bring out the upper notes and definition.\n\nUnlike vocals, bass lives down low, so we don't high-pass it away. The goal is a bass that's felt underneath the mix but still articulate.",
        tip: "Vocals get an HPF; bass and kick generally don't — their sound lives in the low end you'd be cutting.",
        control: "PEQ",
        visual: "eq-bass",
      },
    ],
    quiz: [
      {
        question: "Before reaching for EQ on a vocal, what should you check first?",
        options: [
          "The lighting scene",
          "Whether the mic is close to the singer's mouth",
          "The streaming feed",
          "The battery color",
        ],
        answer: 1,
        explanation:
          "Mic position fixes more tone problems than EQ. Start from a good, close capture, then shape gently.",
      },
      {
        question: "What does the high-pass filter (HPF) do, and where do we use it?",
        options: [
          "Cuts the highs; used on the bass",
          "Cuts the low end; used often on vocalists",
          "Boosts everything; used on drums",
          "Adds reverb; used on the pastor",
        ],
        answer: 1,
        explanation:
          "The HPF removes low-end rumble and is used often on vocalists to clean up the sound without thinning the voice.",
      },
      {
        question: "In a typical CBC vocalist EQ, what do we do in the high-mids?",
        options: [
          "A large boost for loudness",
          "A small reduction to add clarity and reduce harshness",
          "Nothing ever",
          "A high-pass filter",
        ],
        answer: 1,
        explanation:
          "Our vocal curve boosts the mids and highs but reduces the high-mids slightly to add clarity and cut harshness.",
      },
      {
        question: "How does a typical bass EQ differ from a vocal EQ?",
        options: [
          "Bass gets a heavy HPF like vocals",
          "Bass boosts the low end and cuts the mids (for clarity), rather than high-passing the lows away",
          "Bass and vocals get the exact same EQ",
          "Bass only gets treble boost",
        ],
        answer: 1,
        explanation:
          "Bass lives low, so we boost the lows, cut the mids for crispness, and lift the highs for definition — we don't high-pass it like a vocal.",
      },
    ],
  },
  {
    slug: "compression",
    order: 10,
    title: "Compression",
    subtitle: "Keeping levels consistent — threshold, ratio, output gain, and the limiter.",
    icon: "📉",
    estMinutes: 11,
    objectives: [
      "Explain what a compressor does and its key controls",
      "Use sensible starting settings for speech",
      "Understand the limiter and group compression",
    ],
    sections: [
      {
        heading: "What a compressor does",
        body: "A compressor automatically turns DOWN a signal when it gets too loud, evening out the level so quiet and loud passages sit closer together. The result is a more CONSISTENT sound — a vocal stays present without you riding the fader every second.\n\nThe key controls:\n- THRESHOLD — the level where the compressor starts to engage. Only signal above it gets turned down.\n- RATIO — how much compression to apply once over the threshold. For speech, around 2:1 is a good general starting point.\n- OUTPUT GAIN — makes up level after compression; generally left around 0.",
        tip: "Set the threshold while the source is at real performance level. Set it during a soft check and it'll clamp far too hard when they open up.",
        control: "Compressor",
        visual: "comp-transfer",
      },
      {
        heading: "Tasteful, transparent control",
        body: "For worship, aim for GENTLE compression — a few dB of reduction on the loudest peaks, not obvious squashing. Watch the gain-reduction meter: if it's slamming down constantly, back off the threshold or ratio.\n\nFor a spoken voice, a modest ratio (around 2:1) with the threshold set so it only engages on louder phrases keeps the pastor even and intelligible without sounding processed. The goal is 'I can always hear the words clearly,' not 'wow, that's compressed.'",
        tip: "2:1 and a few dB of gain reduction is a safe home base for speech. Make it audible only as consistency, not as an effect.",
        visual: "comp-controls",
      },
      {
        heading: "The limiter and group compression",
        body: "A LIMITER is compression's stricter cousin — a very high ratio that acts as a ceiling, stopping a signal from exceeding a set level. We use limiting to catch sudden peaks and protect against spikes.\n\nWe also compress whole GROUPS (see the Groups & DCAs module) to glue a family of channels — like the vocals or drums — into a consistent, blended sound. Group compression is what makes riding DCAs feel smooth and dynamic.",
        tip: "Compressor = gentle, ongoing consistency. Limiter = a hard ceiling for safety. Use both for their own jobs.",
        control: "Limiter",
        visual: "comp-limiter",
      },
    ],
    quiz: [
      {
        question: "What does the THRESHOLD control set on a compressor?",
        options: [
          "The overall channel color",
          "The level where the compressor starts to engage",
          "The amount of reverb",
          "Which layer the channel is on",
        ],
        answer: 1,
        explanation:
          "Threshold is where compression begins — only signal above it gets turned down.",
      },
      {
        question: "What's a good general ratio starting point for speech?",
        options: ["20:1", "2:1", "0:1", "It doesn't matter"],
        answer: 1,
        explanation:
          "Around 2:1 is a good general ratio for speech — enough to even it out without sounding processed.",
      },
      {
        question: "Where is output gain generally set?",
        options: ["Maxed out", "Around 0", "Fully down", "At the threshold"],
        answer: 1,
        explanation:
          "Output gain makes up level after compression and is generally left around 0.",
      },
      {
        question: "How does a limiter differ from a compressor?",
        options: [
          "A limiter adds reverb",
          "A limiter is a very high-ratio ceiling that stops a signal from exceeding a set level, for safety",
          "They are identical",
          "A limiter only works on the stream",
        ],
        answer: 1,
        explanation:
          "A limiter is compression with a very high ratio acting as a hard ceiling — great for catching sudden peaks and protecting the system.",
      },
    ],
  },
  {
    slug: "scenes",
    order: 11,
    title: "Scenes: Recall & Store",
    subtitle: "Using 'Singing R1' and the scene buttons the CrossBridge way.",
    icon: "💾",
    estMinutes: 10,
    objectives: [
      "Recall the 'Singing R1' scene safely",
      "Understand that recall buttons control mutes, not levels",
      "Store the current setup with Button 7",
    ],
    sections: [
      {
        heading: "What our scenes do",
        body: "A SCENE is a saved snapshot of the console — channel names, groups, routing, and starting mutes. We keep a trusted 'Singing R1' scene and recall it each service so everything begins from the same known-good baseline instead of last week's leftovers.\n\nOn our board the scene-recall soft keys are set up so that buttons 1–6 recall scenes and control MUTES only — not levels. That's deliberate: recalling a scene mid-service rearranges what's muted without yanking your carefully set fader levels around.",
        tip: "Recalling 'Singing R1' at the start of every service is the single best habit for week-to-week consistency.",
        control: "Scene keys 1–6",
      },
      {
        heading: "The baseline is protected — Button 7",
        body: "Button 7 STORES the current setup into a scene. It exists for deliberate, team-approved permanent changes to the console — and those are rare.\n\nImportantly, we do NOT store over 'Singing R1' during a normal service. 'Singing R1' is our permanent baseline: we recall it, we never overwrite it. That's what keeps it a trustworthy starting point week after week. If something gets bumped mid-service, you don't re-store — you re-recall the baseline (select YES when prompted) to snap the mutes back where they belong.\n\nSo the everyday flow is recall-only: select YES on power-up to load 'Singing R1', and leave it untouched. Reach for Button 7 only when a lead has decided on a lasting change and asks you to save it.",
        tip: "Everyday rule: recall 'Singing R1', never overwrite it. Button 7 is only for a deliberate, team-approved permanent change — not for saving today's one-off tweaks.",
        control: "Store (Button 7)",
      },
      {
        heading: "Recall safely — and time the singing recall",
        body: "A recall can change mutes (and, for full recalls, more) instantly. Do it when the room is quiet — not in the middle of a loud moment. After a recall, do a quick line check to confirm the right channels are live.\n\nTiming matters because recalling 'Singing R1' un-mutes the singing mics. Call the recall JUST BEFORE the singing starts — not way ahead of time. If you recall it too early, you leave hot (live) vocal mics open on stage during the count-in, prayer, or announcements, which invites bumps, handling noise, and feedback. Bring the singing scene up right as the band is ready to sing, so no mic is hot on stage before it's needed.\n\nBecause our recall buttons touch mutes and not levels, they're safe to use during a service to jump between mute states — but always know which scene you're recalling before you press it.",
        tip: "Recall 'Singing R1' just before singing starts — not early. Recalling it too soon leaves hot mics open on stage before anyone is singing.",
      },
    ],
    quiz: [
      {
        question: "Which scene do we recall to start every service?",
        options: ["'Sunday AM'", "'Singing R1'", "Lighting scene 19", "'Pastor 2'"],
        answer: 1,
        explanation:
          "We recall 'Singing R1' — our trusted baseline — at the start of every service.",
      },
      {
        question: "On our board, what do scene-recall buttons 1–6 change?",
        options: [
          "All fader levels and processing",
          "Mutes only — not levels",
          "The lighting",
          "Nothing",
        ],
        answer: 1,
        explanation:
          "Buttons 1–6 recall scenes but control mutes only, so your fader levels aren't disturbed by a recall.",
      },
      {
        question: "What do we do with the 'Singing R1' baseline, and what is Button 7 for?",
        options: [
          "Overwrite 'Singing R1' every service with Button 7",
          "Recall 'Singing R1' but never overwrite it; Button 7 is only for deliberate, team-approved permanent changes",
          "Delete it after each service",
          "Store it automatically at shutdown",
        ],
        answer: 1,
        explanation:
          "'Singing R1' is our permanent baseline — we recall it (select YES on power-up) and never overwrite it. Button 7 stores a scene, but it's reserved for rare, deliberate, team-approved permanent changes.",
      },
      {
        question: "When should you recall 'Singing R1' relative to the singing, and why?",
        options: [
          "As early as possible, well before the service starts",
          "Just before the singing starts, so you don't leave hot vocal mics open on stage",
          "In the middle of the loudest song",
          "Only after the singing has finished",
        ],
        answer: 1,
        explanation:
          "Recalling 'Singing R1' un-mutes the singing mics, so call it just before singing starts. Recall it too early and you leave hot mics open on stage during the count-in, prayer, or announcements.",
      },
    ],
  },
  {
    slug: "service-workflow",
    order: 12,
    title: "Running the Service",
    subtitle: "From rehearsal to the last song — priorities, leveling, and dB targets.",
    icon: "⛪",
    estMinutes: 13,
    objectives: [
      "Run the service with the right moment-to-moment priorities",
      "Level the mix and hit our loudness targets",
      "Handle scene and mute changes smoothly",
    ],
    sections: [
      {
        heading: "During the service",
        body: "Once rehearsal is done and the room fills, your job is attentive, gentle mixing:\n\n- Follow the order of service. Know what's next — song, sermon, announcements, video — and have the right channels up and unused ones muted.\n- Unmute groups and channels as they're needed; focus on unmuting the essentials FIRST (Pastor and Blue).\n- Make scene/mute changes at natural breaks, not mid-phrase.\n- Ride the mix so the sound is even — no one element buried or blasting.\n- If Peter, Rob, or Jonathan are preaching, prep Pastor 2 ahead of time.",
        tip: "Be proactive: stay one step ahead of the platform. Keep the run sheet in front of you so nothing surprises you.",
        control: "Mutes / Scenes",
      },
      {
        heading: "Leveling and our dB targets",
        body: "We mix to consistent loudness targets so the service is comfortable and clear:\n\n- MUSIC — around 80 dBA.\n- SERMON — around 70 dBA.\n\nWalk the auditorium during rehearsal and listen: it should be LEVEL across the board — balanced, with the lead vocal clear over the band, and nothing harsh. The booth can sound different from the seats, so trust what you hear in the room.",
        tip: "Music ~80 dBA, sermon ~70 dBA. Step into the room to check — the mix that matters is the one the congregation hears.",
      },
      {
        heading: "Serve the moment",
        body: "Great mixing serves what's happening on the platform. Pull the band back under a prayer or a soft verse; support the build of a chorus. Keep the lead vocal clear and present so the congregation can follow the words.\n\nSmall, smooth moves — not jumps. When you're using groups and DCAs, one gentle move can shape a whole section. Stay calm, stay ahead, and keep the focus on worship rather than on the mix.",
        tip: "The best service mixing is felt, not noticed. Anticipate the dynamics of each song and move with them.",
      },
      {
        heading: "Stay present — put the phone away",
        body: "The booth is a visible position. During the service, keep your phone put away and your attention on the platform and the mix. It's easy to glance down at a notification and miss an unmute, a cue, or a level that's drifting — and just as importantly, a tech scrolling a phone in the booth becomes a distraction to the people around and behind us.\n\nWe are here to serve worship, not to become a distraction within the service. Anything you genuinely need for the job — the run sheet, the Scheduling App, this guide — is fine to have open, but treat the service like the focused, active work it is. Personal texting, social media, and browsing wait until after.",
        tip: "Phone away, eyes up. We never want to be the distraction in the room — stay present and on the mix through the whole service.",
      },
    ],
    quiz: [
      {
        question: "What are our approximate loudness targets?",
        options: [
          "Music 100 dBA, sermon 95 dBA",
          "Music ~80 dBA, sermon ~70 dBA",
          "Music 60 dBA, sermon 60 dBA",
          "As loud as the system will go",
        ],
        answer: 1,
        explanation:
          "We aim for about 80 dBA for music and 70 dBA for the sermon — comfortable and clear.",
      },
      {
        question: "When the service starts, which channels are the top priority to get live?",
        options: [
          "The drum overheads",
          "Pastor and Blue (announcements) — the spoken word",
          "The FX returns",
          "The hallway feed",
        ],
        answer: 1,
        explanation:
          "Spoken word is most noticeable if missed — get Pastor and Blue up first, then fine-tune the band.",
      },
      {
        question: "How do you judge whether the mix is balanced?",
        options: [
          "Trust the booth position only",
          "Walk the auditorium and listen — it should be level across the board",
          "Only look at the meters",
          "Ask the drummer",
        ],
        answer: 1,
        explanation:
          "The booth can sound different from the seats. Walk the room and listen for a balanced, level mix with the lead vocal clear.",
      },
      {
        question: "If Peter, Rob, or Jonathan are preaching, what should you do ahead of time?",
        options: [
          "Mute all vocals permanently",
          "Prep Pastor 2",
          "Turn off the stream",
          "Recall lighting scene 19",
        ],
        answer: 1,
        explanation:
          "Our workflow calls for prepping Pastor 2 when Peter, Rob, or Jonathan are preaching, so the sermon mic is ready.",
      },
      {
        question: "What's our expectation around phone use in the booth during the service?",
        options: [
          "Scroll freely between cues",
          "Keep your phone put away and stay present — we don't want to miss a cue or become a distraction",
          "Take calls as long as they're quiet",
          "Phones are required for mixing",
        ],
        answer: 1,
        explanation:
          "Personal phone use waits until after the service. Glancing at a phone risks missing an unmute or cue, and a tech on their phone becomes a distraction. Job tools (run sheet, Scheduling App) are fine.",
      },
    ],
  },
  {
    slug: "shutdown",
    order: 13,
    title: "After Service & Shutdown",
    subtitle: "Powering down safely and leaving the booth ready for next week.",
    icon: "🌙",
    estMinutes: 8,
    objectives: [
      "Follow the CBC shutdown sequence in order",
      "Handle mics, scenes, and the system safely",
      "Leave the booth secured and ready",
    ],
    sections: [
      {
        heading: "The shutdown sequence",
        body: "After the service and teardown, power down in order:\n\n1. Ensure all MICS are turned OFF (including the Blue announcement mic).\n2. MUTE ALL groups.\n3. Turn the COMPUTER audio path OFF.\n4. LIGHTS off.\n5. BREAKERS off.\n6. SYSTEM off (console and stage boxes).\n7. Put the COVER on the board.\n8. Turn the KEY SWITCH off.\n\nThis reverses the startup and leaves everything safe and protected until next week. You never store or overwrite the 'Singing R1' baseline at shutdown — leave it exactly as it is.",
        tip: "Mics off and all groups muted BEFORE you start switching things off — that prevents any pops or noise as the system powers down.",
        control: "Key switch",
      },
      {
        heading: "Scenes and mics",
        body: "Handle scenes responsibly at the end — which mostly means leaving them alone. The 'Singing R1' baseline is NEVER overwritten. It stays exactly as it is so it provides a clean, trusted baseline for the next service: next week's tech powers up, selects YES to recall it, and starts from the same known-good setup you did. Any one-off tweaks you made for today simply disappear when the system is powered down — that's by design, and it's a good thing.\n\nCollect the wireless mics, turn each OFF, and return them and their batteries to the booth standard. Note any low batteries or gear issues for the next tech.",
        tip: "Never overwrite 'Singing R1' at shutdown. Leaving the baseline untouched is what makes it a reliable starting point every single week.",
      },
      {
        heading: "Leave it better than you found it",
        body: "Put mics and cables away to our booth standard, cover the board, and secure the booth. Flag anything that needs attention — a scratchy mic, a flaky cable, a battery that drained fast — so the next tech isn't surprised.\n\nA tidy, documented handoff is part of serving the team. The person opening next week should be able to start the startup sequence and have everything work.",
        tip: "The best sign you did the job well: next week's tech powers up and everything just works.",
      },
    ],
    quiz: [
      {
        question: "What are the first two steps of shutdown?",
        options: [
          "Turn off the key switch, then the breakers",
          "Ensure all mics are off, then mute all groups",
          "Cover the board, then turn off lights",
          "Store the scene, then turn off the stream",
        ],
        answer: 1,
        explanation:
          "Start by making sure all mics are off and all groups are muted — that prevents pops as you power the system down.",
      },
      {
        question: "In what order do the system and key switch come at shutdown?",
        options: [
          "Key switch first, then everything else",
          "Lights off, breakers off, system off, cover on, then key switch off last",
          "Everything at once",
          "Key switch off before muting mics",
        ],
        answer: 1,
        explanation:
          "After mics off and groups muted, it's lights → breakers → system off → cover on → key switch off, reversing the startup.",
      },
      {
        question: "What happens to the 'Singing R1' baseline at shutdown?",
        options: [
          "You overwrite it with today's mix every week",
          "It is never overwritten — you leave it untouched so it's a clean baseline for the next service",
          "You delete it and rebuild it next week",
          "It saves your one-off tweaks automatically",
        ],
        answer: 1,
        explanation:
          "The baseline is never overwritten. Leaving 'Singing R1' exactly as it is means next week's tech recalls it (select YES) and starts from the same trusted setup. Today's one-off tweaks simply clear on power-down.",
      },
    ],
  },
  {
    slug: "troubleshooting",
    order: 14,
    title: "Troubleshooting Under Pressure",
    subtitle: "Calm, systematic fixes for the problems that actually happen at CBC.",
    icon: "🛠️",
    estMinutes: 12,
    objectives: [
      "Diagnose 'no sound' with our signal path in mind",
      "Handle buzz, feedback, and monitor complaints",
      "Know when to escalate to a lead",
    ],
    sections: [
      {
        heading: "No sound from a channel",
        body: "Stay calm and walk our signal path. Check, in order:\n\n1. Is the source live? Mic turned on (red button), close to the mouth, battery ok?\n2. Is the channel MUTED — or is its mute GROUP muted (red at top-right)?\n3. Are you on the right LAYER (A inputs, D vocals) and is the fader up?\n4. Is its DCA up and unmuted?\n5. Is the stage source patched to the right stage box socket / SLink input?\n6. Is the main L/R up and are the house outputs live?\n\nThe first point where the signal disappears is your problem. Fix it there.",
        tip: "Nine times out of ten it's a mute — the channel, or its mute group at the top-right. Check the simple stuff before assuming gear failed.",
      },
      {
        heading: "Buzz, feedback, and monitors",
        body: "- BUZZ/HUM on an open channel: an unused input left unmuted — often electric guitar or the piano mic. Mute what isn't being played.\n- FEEDBACK (squeal): pull down the offending channel calmly (or use PAFL to find it), then fix the cause — an open mic too close to a speaker/monitor, or a channel pushed too hot. Prevent it by muting unused mics and keeping levels disciplined.\n- MONITOR jumps with the house: a send that should be pre-fade is set post-fade. Remember our monitors are pre-fade.\n- WRONG PERSON'S FADER does nothing: the mic color and the person may be mismatched — recheck the Scheduling App assignment.",
        tip: "Prevention beats cure: mute unused inputs, keep gain sane, and verify mic-to-color-to-person before rehearsal.",
      },
      {
        heading: "When to escalate",
        body: "If a problem is beyond a quick fix and it's disrupting the service — the stream is down, a whole stage box dropped, the console is misbehaving — get a lead tech. Protecting the service matters more than solving it solo.\n\nFor streaming issues specifically, remember the stream is a separate output path (its own AUX/output feed): if the room is fine but the stream isn't, the problem is downstream of L/R. Note what happened so the team can trace it afterward.",
        tip: "Serving the service comes before solo heroics. Escalate early, document what you saw, and keep the room covered.",
      },
    ],
    quiz: [
      {
        question: "A mic that worked at rehearsal is now silent. What's the most common cause to check first?",
        options: [
          "The console needs a firmware update",
          "The channel is muted — or its mute group (red at top-right) is muted",
          "The building lost power",
          "The mic must be replaced",
        ],
        answer: 1,
        explanation:
          "Most 'no sound' issues are a mute — the channel itself or its mute group. Walk the signal path and check the simple things first.",
      },
      {
        question: "You hear a buzz during a quiet moment. What's the likely fix?",
        options: [
          "Add reverb",
          "Find the open, unused channel (often electric guitar or piano mic) and mute it",
          "Turn the house up",
          "Recall lighting scene 19",
        ],
        answer: 1,
        explanation:
          "Some inputs buzz when unused. Mute channels that aren't being played, especially electric guitar and the piano mic.",
      },
      {
        question: "A singer says their in-ears jump up and down when you mix the house. Why?",
        options: [
          "Their mic battery is low",
          "Their monitor send is set post-fade when our monitors should be pre-fade",
          "The stream is down",
          "The lighting is wrong",
        ],
        answer: 1,
        explanation:
          "A post-fade send follows house fader moves. Our monitors are pre-fade so the in-ear blend stays independent of the house.",
      },
      {
        question: "The room sounds fine but the live stream has no audio. What do you conclude?",
        options: [
          "Every channel is broken",
          "The problem is downstream of the L/R mix — on the separate streaming feed, not the channels",
          "The stage box SLink failed",
          "The mics need new batteries",
        ],
        answer: 1,
        explanation:
          "House and stream are separate outputs. If the room is fine, look downstream on the streaming feed, not at the input channels.",
      },
    ],
  },
  {
    slug: "input-patch",
    order: 15,
    title: "Reference: Input Patch & I/O",
    subtitle: "Which physical input feeds which channel — our patch, at a glance.",
    icon: "🧩",
    estMinutes: 12,
    objectives: [
      "Read the routing matrix: physical input (FROM) → mixer channel (TO)",
      "Know our Local and SLink input patch",
      "Use channel colors to scan the board by family",
    ],
    sections: [
      {
        heading: "How to read the patch",
        body: "On the SQ-6's Routing screen, the left column is each mixer CHANNEL (the 'TO') and the grid shows which physical INPUT feeds it (the 'FROM'). Our inputs come from two places:\n\n- LOCAL — sockets on the console itself: the wireless handhelds and the computer audio.\n- SLINK — everything from the stage box (AR2412) on stage, carried to the console over the single SLink cable.\n\nThis reference is your map from a socket to a named channel. When a source is dead, it tells you exactly which input and channel to check.",
        tip: "FROM = the physical socket (Local or SLink). TO = the named channel you see on the faders. The patch connects the two.",
        control: "Routing screen",
      },
      {
        heading: "Local inputs (at the console)",
        body: "The wireless handhelds and the computer feed come in locally at the board:\n\n| Local in | Channel | Family |\n| --- | --- | --- |\n| 01 | Pstr 1 | Pastor (green) |\n| 02 | Pstr 2 | Pastor (green) |\n| 03 | Blue | Announcements (blue) |\n| 04 | Yellow | Vocal (red) |\n| 05 | Orange | Vocal (red) |\n| 06 | Green | Vocal |\n| 07 | White | Vocal (red) |\n| St 1 R | Comput | Computer audio |\n| St 3 L/R | ST3 / BgTrx | Backing tracks |\n\nEach vocal runs through its single color channel — Yellow, Orange, and so on. The color mic is the channel.",
        tip: "Local 04 = Yellow, Local 05 = Orange. The color mic IS the channel — one channel per color.",
        control: "Local inputs",
      },
      {
        heading: "SLink inputs (from the stage box)",
        body: "Everything on stage arrives through the AR2412 stage box over SLink:\n\n| SLink in | Channel | Family |\n| --- | --- | --- |\n| 01 | KbrdV | Keys vocal (red) |\n| 02 | GtrAc1 | Acoustic gtr (gold) |\n| 03 / 04 | KbrdLR | Keys, stereo (magenta) |\n| 05 / 06 | SynLR | Synth, stereo (magenta) |\n| 07 | Bass | Bass (gold) |\n| 08 | GtrAC2 | Acoustic gtr (gold) |\n| 09 / 10 | GtrST1 | Guitar, stereo (gold) |\n| 12 | Viola | Strings (gold) |\n| 13 / 14 | GtSt2 | Guitar, stereo (gold) |\n| 15 | Kick | Drums (cyan) |\n| 16 | Snare | Drums (cyan) |\n| 17 | TomsL | Drums (cyan) |\n| 18 | TomsR | Drums (cyan) |\n| 19 | Jymbe | Drums (cyan) |\n| 20 | GPianV | Grand piano vocal (red) |\n| 21 / 22 | GPiano | Grand piano, stereo (magenta) |\n\nStereo sources take two adjacent SLink inputs (an L and an R).",
        tip: "If a whole family drops out (say all the drums), suspect the stage box or the SLink connection before any single channel.",
        control: "SLink / AR2412",
      },
      {
        heading: "Channel colors = families",
        body: "Every channel's button is color-coded by family so you can find things fast under pressure:\n\n- GREEN — Pastors (Pstr 1, Pstr 2)\n- BLUE — Blue / announcements\n- RED — Vocals (color mics, keys/piano vocal mics)\n- MAGENTA — Keys, synth, and grand piano (stereo)\n- GOLD/YELLOW — Guitars, bass, and strings\n- CYAN — Drums\n- WHITE — Utility (computer, returns)\n\nScan by color first, then by name. 'The drums' is everything cyan; 'the vocals' is everything red.",
        tip: "Learn the color families cold. In a busy moment you'll spot 'all the red channels' faster than reading each label.",
      },
      {
        heading: "Group & DCA assignments — to be added",
        body: "Beyond the input patch, each channel also routes to a GROUP (for shared processing) and rides on a DCA (for mute and level). Those exact numbers are being finalized on the board and will be filled in here.\n\n| Channel family | Group # | DCA # |\n| --- | --- | --- |\n| Pastors | (TBD) | (TBD) |\n| Vocals | (TBD) | (TBD) |\n| Guitars | (TBD) | (TBD) |\n| Keys / Synth / Piano | (TBD) | (TBD) |\n| Drums | (TBD) | (TBD) |\n\nCheck back once the Group and DCA numbers are confirmed — this table will be updated with the live assignments.",
        tip: "Placeholder: the Group/DCA numbers land here after they're confirmed on the console. Until then, use the Groups & DCAs module for the concepts.",
        control: "Groups / DCAs (TBD)",
      },
      {
        heading: "Outputs recap",
        body: "For completeness, where the mixes go out (see 'How Our System Is Wired' for detail):\n\n- MAIN L/R → out the AR2412 to the house speakers.\n- STREAMING → local outputs 11 & 12.\n- HALLWAY → local outputs 13 & 14 (a duplicate of L/R).\n- MONITORS → AUX sends to the ME-500 in-ears on stage.\n\nInputs come IN mostly over SLink; the finished mixes go OUT to the house, the stream, the hallway, and the musicians' in-ears.",
      },
    ],
    quiz: [
      {
        question: "On the routing screen, what do 'FROM' and 'TO' mean?",
        options: [
          "FROM is the output, TO is the microphone",
          "FROM is the physical input (Local or SLink); TO is the mixer channel it feeds",
          "They mean the same thing",
          "FROM is the lighting, TO is the sound",
        ],
        answer: 1,
        explanation:
          "The routing grid maps a physical input (FROM — a Local socket or an SLink input from the stage box) to the named mixer channel (TO).",
      },
      {
        question: "Which channel does the Yellow wireless mic feed?",
        options: [
          "SLink 04",
          "Local 04 → the 'Yellow' channel",
          "The hallway output",
          "The stream feed",
        ],
        answer: 1,
        explanation:
          "Yellow comes in on Local 04 and feeds the single 'Yellow' vocal channel. The color mic is the channel.",
      },
      {
        question: "Most stage instruments (drums, guitars, keys) arrive at the console how?",
        options: [
          "As Local inputs at the board",
          "Over SLink from the AR2412 stage box",
          "Through the ME-500 mixers",
          "Over the streaming feed",
        ],
        answer: 1,
        explanation:
          "Stage sources feed the AR2412 stage box and travel to the console over SLink. Local inputs are the wireless handhelds and computer.",
      },
      {
        question: "A channel's button is cyan. What family is it?",
        options: ["Vocals", "Drums", "Pastors", "Keys"],
        answer: 1,
        explanation:
          "Cyan = drums (Kick, Snare, Toms, Jymbe). Red = vocals, green = pastors, magenta = keys/synth/piano, gold = guitars/bass/strings.",
      },
    ],
  },
];

/** Total number of modules — handy for progress math. */
export const TOTAL_MODULES = curriculum.length;

/** Look up a module by its slug. */
export function getModule(slug: string): Module | undefined {
  return curriculum.find((m) => m.slug === slug);
}

/** Ordered list of slugs for prev/next navigation. */
export const moduleOrder = curriculum
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((m) => m.slug);

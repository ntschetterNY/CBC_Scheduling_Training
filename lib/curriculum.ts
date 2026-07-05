/**
 * CrossBridge SQ-6 Training Curriculum
 * ------------------------------------
 * Content is instructionally accurate for the Allen & Heath SQ-6 digital
 * mixer. Items marked with a [CrossBridge] note are configuration-specific
 * and should be confirmed against your house system outline / PDFs.
 *
 * To edit a lesson: change the `sections` text. To add a module: append a
 * new object to the exported `curriculum` array — the rest of the app
 * (dashboard, progress, quizzes) picks it up automatically.
 */

export type LessonSection = {
  heading: string;
  /** Plain paragraphs; blank line separates paragraphs. Use "- " for bullets. */
  body: string;
  /** Optional operator tip highlighted in the UI. */
  tip?: string;
  /** Optional physical control this section refers to (shown as a chip). */
  control?: string;
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
    title: "Welcome & Program Overview",
    subtitle: "What this training covers and how the SQ-6 fits our worship service.",
    icon: "👋",
    estMinutes: 8,
    objectives: [
      "Understand the goal of the CrossBridge sound tech program",
      "Know what the Allen & Heath SQ-6 is and why we use it",
      "Learn how to move through this interactive guide",
    ],
    sections: [
      {
        heading: "Why we train",
        body: "Great sound is invisible. When it's done well, nobody thinks about the mix — they're free to worship. Our job as sound techs is to serve the congregation and the platform team by delivering clear, consistent, distraction-free audio every service.\n\nThis program takes you from \"I've never touched the board\" to confidently running a Sunday service on the SQ-6. Work through the modules in order. Each one builds on the last, ends with a short knowledge check, and tracks your progress automatically.",
      },
      {
        heading: "Meet the SQ-6",
        body: "The Allen & Heath SQ-6 is a digital mixing console. Unlike an old analog board where every knob does one fixed thing, a digital mixer shows you one channel's controls at a time on a touchscreen, and remembers complete setups called Scenes.\n\nKey facts about our console:\n- 7-inch color capacitive touchscreen for detailed control\n- 24 physical fader strips, arranged in switchable Layers\n- 96kHz processing with extremely low latency (about 0.7 ms) — no audible delay\n- Full processing on every channel: preamp, high-pass filter, gate, 4-band EQ, compressor, and delay\n- Scene memory so we can recall a complete service setup in one press",
        tip: "\"Digital\" just means the board is a computer for sound. The concepts — gain, EQ, faders, mixes — are the same as any mixer. Learn the concepts and the buttons follow.",
      },
      {
        heading: "How to use this guide",
        body: "Each module is a set of short lessons followed by a quiz. Read a lesson, then when you're next in the booth, find the control on the real board and try it during a rehearsal or an empty room — hands-on repetition is how this sticks.\n\n- Use Next / Previous to move through a module's lessons.\n- Finish the quiz to mark a module complete.\n- Your dashboard shows overall progress and what's next.\n- Nothing you do in this guide touches the real console. Practice fearlessly here.",
        tip: "Pair this guide with real board time. Ask a lead tech to shadow you for your first two or three services before you fly solo.",
      },
    ],
    quiz: [
      {
        question: "What is the main difference between the SQ-6 and an old analog mixer?",
        options: [
          "The SQ-6 has more physical knobs, one per function",
          "The SQ-6 is digital — it shows one channel's controls on a touchscreen and can recall full setups as Scenes",
          "The SQ-6 cannot process EQ or dynamics",
          "The SQ-6 only works for recorded music, not live",
        ],
        answer: 1,
        explanation:
          "A digital console shows the selected channel's processing on the touchscreen and stores complete setups as Scenes, instead of a dedicated physical knob for every parameter.",
      },
      {
        question: "What is our core job as CrossBridge sound techs?",
        options: [
          "To make the mix as loud and impressive as possible",
          "To show off the capabilities of the SQ-6",
          "To deliver clear, consistent, distraction-free audio that serves worship",
          "To keep the platform team from touching anything",
        ],
        answer: 2,
        explanation:
          "Good sound is invisible. We serve the congregation and platform by keeping audio clear and consistent so people can focus on worship.",
      },
      {
        question: "Roughly how much latency (delay) does the SQ-6 add to the signal?",
        options: [
          "About half a second — very noticeable",
          "About 0.7 milliseconds — inaudible",
          "Exactly 2 seconds",
          "It varies wildly and can't be predicted",
        ],
        answer: 1,
        explanation:
          "The SQ-6 processes at 96kHz with about 0.7 ms of latency, which is far too short for anyone to hear as delay.",
      },
    ],
  },
  {
    slug: "signal-flow",
    order: 2,
    title: "Signal Flow: From Voice to Speaker",
    subtitle: "The single most important concept in audio — how sound travels through the system.",
    icon: "🔀",
    estMinutes: 12,
    objectives: [
      "Trace a signal from microphone to loudspeaker",
      "Explain what a preamp, channel, and mix do",
      "Use signal flow to troubleshoot 'why is there no sound?'",
    ],
    sections: [
      {
        heading: "The path of sound",
        body: "Every audio problem is easier to solve when you can picture the path a signal takes. For a single vocal mic, the journey is:\n\n1. Sound source — someone sings or speaks.\n2. Microphone — converts sound into a tiny electrical signal.\n3. Stage box / wall input — the mic plugs in here and the signal travels to the console.\n4. Preamp (gain) — boosts that tiny signal up to a healthy working level. This is the first thing the console does.\n5. Channel processing — HPF, gate, EQ, compressor shape the sound.\n6. Fader — sets how much of that channel goes into the mix.\n7. Mix bus — the channel is blended with everything else (the main Left/Right mix, and monitor mixes).\n8. Output & amplifier — the finished mix leaves the console.\n9. Loudspeakers — convert the signal back into sound the room hears.",
        tip: "Memorize this order. When something isn't working, walk the path from source to speaker and find the first point where the signal disappears.",
      },
      {
        heading: "Preamp vs. fader — two different volume controls",
        body: "New techs often confuse these. They are both 'volume,' but they live in different places and do different jobs.\n\n- The PREAMP (gain / trim) sets the signal's level as it ENTERS the console. Set it once during soundcheck so the signal is strong but not distorting. You rarely touch it again mid-service.\n- The FADER sets how much of that channel goes into the mix. This is your live, hands-on control during the service.\n\nThink of the preamp as filling a cup to the right level, and the fader as deciding how much you pour into the final mix.",
      },
      {
        heading: "Buses and mixes",
        body: "A 'bus' is just a destination that many channels can be sent to and mixed together.\n\n- The Main LR (Left/Right) bus is the mix the congregation hears through the main speakers.\n- Aux / Mix buses are separate blends we build for monitors — what the musicians and vocalists hear on stage (wedges or in-ear monitors).\n- FX buses send channels to effects like reverb, then return the wet effect back into the mix.\n\nThe same vocal can go to the main mix AND several monitor mixes at once, each at a different level. That's the power of a mixer: many independent blends from the same sources.",
        control: "Main LR / Mix keys",
      },
    ],
    quiz: [
      {
        question: "Put these in the correct signal-flow order: fader, preamp, microphone, loudspeaker.",
        options: [
          "Fader → preamp → microphone → loudspeaker",
          "Microphone → preamp → fader → loudspeaker",
          "Preamp → microphone → loudspeaker → fader",
          "Microphone → fader → loudspeaker → preamp",
        ],
        answer: 1,
        explanation:
          "Signal starts at the mic, gets boosted by the preamp, is blended by the fader into a mix, and finally reaches the loudspeaker.",
      },
      {
        question: "Which control sets a channel's level as it ENTERS the console and is normally set once at soundcheck?",
        options: ["The fader", "The preamp / gain (trim)", "The pan control", "The mute button"],
        answer: 1,
        explanation:
          "The preamp (gain/trim) sets input level and is set during soundcheck. The fader is what you ride live during the service.",
      },
      {
        question: "What is a 'bus' in a mixing console?",
        options: [
          "A physical cable that carries power",
          "A destination that many channels can be mixed into together (e.g., Main LR or a monitor mix)",
          "Another word for a microphone",
          "The console's power supply",
        ],
        answer: 1,
        explanation:
          "A bus is a shared mix destination. The Main LR bus feeds the house; aux buses feed monitors; FX buses feed effects.",
      },
      {
        question: "A vocal mic is completely silent in the house. What's the best first troubleshooting step?",
        options: [
          "Immediately reboot the entire console",
          "Turn every fader all the way up",
          "Walk the signal path from source to speaker and find the first point where signal disappears",
          "Replace the loudspeakers",
        ],
        answer: 2,
        explanation:
          "Signal-flow thinking is the fastest troubleshooter: check mic → cable/input → gain → channel not muted → fader up → assigned to LR → LR up.",
      },
    ],
  },
  {
    slug: "board-tour",
    order: 3,
    title: "Board Tour: The SQ-6 Surface",
    subtitle: "Get oriented — where everything lives on the physical console.",
    icon: "🎛️",
    estMinutes: 12,
    objectives: [
      "Identify the main regions of the SQ-6 surface",
      "Understand the touchscreen + physical control relationship",
      "Know what SoftKeys and SoftRotaries are for",
    ],
    sections: [
      {
        heading: "The four regions",
        body: "Stand in front of the SQ-6 and you can divide it into four areas:\n\n1. The FADER BAYS (left/center) — banks of motorized fader strips. Each strip has a fader, a mute, a PAFL (solo/listen) key, and a color-coded Select key.\n2. The TOUCHSCREEN (upper right) — a 7-inch color screen showing the selected channel's processing, meters, routing, Scenes, and setup menus.\n3. The PROCESSING / SOFT ROTARY controls (right of screen) — rotary encoders that adjust whatever is shown on screen (gain, EQ, etc.).\n4. The SOFTKEYS and master area — assignable buttons and the master controls, including PAFL level and the main mix.",
        tip: "Use the interactive Board Explorer (in the sidebar of this module) to click each region and see what it does.",
      },
      {
        heading: "Touchscreen + physical controls work together",
        body: "The SQ-6 combines a touchscreen with real knobs. You touch the screen to SELECT what you want to adjust — say, the compressor threshold — and then turn a physical rotary or drag on screen to change it.\n\nThis is why one console can control dozens of channels: instead of thousands of knobs, you pick a channel with its Select key, and the screen and rotaries instantly become that channel's controls. Select a different channel and the same knobs now control the new channel.",
        control: "Select keys",
      },
      {
        heading: "SoftKeys and the Select key color",
        body: "SOFTKEYS are assignable buttons you can program to jump to common tasks — recall a Scene, tap tempo for a delay, mute a group, and more. [CrossBridge] Our SoftKey layout is set in our house Scene; a lead tech will walk you through what each one does on our board.\n\nEach channel's SELECT key has an RGB color and a name on the screen strip above it. We color-code by instrument family (for example, vocals one color, band another) so you can find a channel fast under service pressure. [CrossBridge] Confirm our exact color scheme with your lead.",
        control: "SoftKeys",
      },
    ],
    quiz: [
      {
        question: "On the SQ-6, how do you change the compressor threshold for a specific channel?",
        options: [
          "There is a dedicated physical knob for every channel's threshold",
          "Select the channel, open its processing on the touchscreen, then adjust with the on-screen control or a rotary",
          "You can only set it from a laptop",
          "Threshold cannot be changed on the SQ-6",
        ],
        answer: 1,
        explanation:
          "You select a channel, the screen shows its processing, and the physical rotaries/on-screen controls adjust that channel's parameters.",
      },
      {
        question: "What is the purpose of a SoftKey?",
        options: [
          "It's a spare fader",
          "It's an assignable button programmed to a common task like recalling a Scene or tapping tempo",
          "It controls phantom power only",
          "It is the power switch",
        ],
        answer: 1,
        explanation:
          "SoftKeys are user-assignable shortcuts. Our house Scene defines what each does on the CrossBridge board.",
      },
      {
        question: "Why do the physical rotary knobs seem to 'change jobs' as you work?",
        options: [
          "They are broken",
          "They follow whatever channel/parameter is currently selected on the touchscreen",
          "They only work during soundcheck",
          "They control the lighting rig",
        ],
        answer: 1,
        explanation:
          "The rotaries adjust whatever is selected on screen. Select a new channel and the same knobs now control that channel — that's how a digital board avoids thousands of knobs.",
      },
    ],
  },
  {
    slug: "powering-on",
    order: 4,
    title: "Powering On & Shutting Down",
    subtitle: "The safe startup and shutdown sequence that protects the gear and the congregation's ears.",
    icon: "🔌",
    estMinutes: 10,
    objectives: [
      "Perform a safe power-on sequence",
      "Recall the correct starting Scene",
      "Shut down safely so nothing is damaged and nobody gets a loud pop",
    ],
    sections: [
      {
        heading: "The golden rule of power order",
        body: "Amplifiers and powered speakers go ON LAST and OFF FIRST. Always.\n\nWhen you power a mixer or source on/off it can send a loud 'thump' down the line. If the amps/speakers are already on, that thump blasts the room and can damage drivers and ears. So:\n\n- Powering UP: sources and console first → then the amps/speakers.\n- Powering DOWN: amps/speakers first → then the console and sources.\n\n[CrossBridge] Our specific power sequence and which switches to use are posted in the booth — follow that checklist exactly.",
        tip: "Speakers ON last, OFF first. If you remember nothing else about power, remember this.",
      },
      {
        heading: "Startup checklist",
        body: "A typical Sunday power-up:\n\n1. Confirm the main speaker/amp power is OFF.\n2. Power on the SQ-6 (and any stage boxes / snake units). Wait for it to fully boot to the mixing screen.\n3. Recall the house starting Scene so all channels, gains, EQ, and routing load to our known-good baseline.\n4. Check that stage boxes show connected (the console reports I/O status).\n5. Bring up the main speakers/amps last.\n6. Do a quick line check — talk into a mic, tap a DI — confirm signal reaches the house and monitors.",
        control: "Scenes",
      },
      {
        heading: "Shutting down",
        body: "After the service and teardown:\n\n1. Pull the main mix down / mute the house.\n2. Power OFF the amps/powered speakers first.\n3. [CrossBridge] Save or store the Scene if you made changes worth keeping — check with your lead before overwriting the house Scene.\n4. Power off the console and stage boxes.\n5. Cap and coil mics/cables per our booth standards, and secure the booth.",
        tip: "Never yank the console's power while it's writing a Scene or a USB recording — let operations finish first.",
      },
    ],
    quiz: [
      {
        question: "In what order should you power the system UP?",
        options: [
          "Speakers/amps first, then the console",
          "Console and sources first, then the speakers/amps last",
          "Everything at exactly the same time",
          "Order doesn't matter on a digital board",
        ],
        answer: 1,
        explanation:
          "Powering the console/sources first and the amps/speakers LAST prevents the startup 'thump' from blasting the room.",
      },
      {
        question: "When shutting down, what goes OFF first?",
        options: [
          "The console",
          "The stage boxes",
          "The amplifiers / powered speakers",
          "The lighting board",
        ],
        answer: 2,
        explanation:
          "Amps/speakers off FIRST, console off after. This is the reverse of power-up and protects drivers and ears.",
      },
      {
        question: "Why do we recall the house starting Scene right after boot?",
        options: [
          "To erase all our settings randomly",
          "To load a known-good baseline of channels, gains, EQ, and routing before the service",
          "It is not necessary and can be skipped",
          "To increase the latency",
        ],
        answer: 1,
        explanation:
          "Recalling the starting Scene loads our trusted baseline setup so every service starts consistent instead of from whatever the last person left behind.",
      },
    ],
  },
  {
    slug: "channels-layers",
    order: 5,
    title: "Channels, Layers, Mute & PAFL",
    subtitle: "Navigating the fader strips and finding the channel you need — fast.",
    icon: "🎚️",
    estMinutes: 12,
    objectives: [
      "Switch between fader Layers to reach any channel",
      "Use Select, Mute, and PAFL correctly",
      "Explain what PAFL (solo) does and does NOT do to the house mix",
    ],
    sections: [
      {
        heading: "Layers: more channels than faders",
        body: "The SQ-6 has 24 fader strips but can mix far more than 24 channels. It solves this with LAYERS — think of them as pages of faders.\n\nPress a Layer key and the same 24 physical faders instantly become a different set of channels. For example: Layer A might be your vocals and key inputs, Layer B your band and playback, and another layer your DAW/FX returns. [CrossBridge] Our exact layer layout is defined in the house Scene — learn where each instrument lives so you're not hunting during a song.",
        tip: "Spend rehearsal time memorizing which layer holds which channels. Fast, confident navigation is what separates a calm mix from a stressful one.",
        control: "Layer keys",
      },
      {
        heading: "Select, Mute, and the fader",
        body: "Each strip has three key controls plus the fader:\n\n- SELECT — makes this the 'focused' channel so the touchscreen and rotaries show its processing. Selecting does NOT change any levels; it's just 'show me this channel.'\n- MUTE — silences that channel everywhere it's routed. Muting an unused mic (e.g., a wireless handheld between songs) is the #1 tool for a clean mix and preventing feedback.\n- FADER — the channel's level into the currently active mix (the main LR, or a monitor mix when you're in sends-on-faders mode — covered later).",
        control: "Select / Mute",
      },
      {
        heading: "PAFL — listening without affecting the house",
        body: "PAFL stands for Pre/After-Fade Listen — most people just call it 'solo' or 'listen.' Pressing a channel's PAFL key routes THAT channel to your headphones (and the booth monitor / meters) so you can check it in isolation.\n\nCrucial point: PAFL is for YOUR ears only. It does not change what the congregation hears and does not mute other channels in the house. Use it to hunt down a buzz, check a mic before you push it up, or find which channel a noise is coming from.\n\nAlways clear PAFL when you're done so your meters and headphones return to the main mix.",
        tip: "If your meters or headphones seem 'stuck' on one channel, you probably left a PAFL engaged. Clear it.",
        control: "PAFL",
      },
    ],
    quiz: [
      {
        question: "The SQ-6 has 24 faders but needs to mix more channels. How does it handle that?",
        options: [
          "It can only ever mix 24 channels",
          "Layers — pressing a Layer key reassigns the same faders to a different set of channels",
          "You must plug in a second console",
          "It randomly rotates channels every minute",
        ],
        answer: 1,
        explanation:
          "Layers turn the 24 physical strips into multiple 'pages' of channels. Our house Scene defines which channels live on each layer.",
      },
      {
        question: "What does pressing a channel's Select key do?",
        options: [
          "Mutes the channel",
          "Sends it to the congregation",
          "Focuses it so the touchscreen and rotaries show that channel's processing — without changing any levels",
          "Deletes the channel",
        ],
        answer: 2,
        explanation:
          "Select just focuses a channel for editing. It changes nothing about what's heard; it only decides which channel the screen/knobs control.",
      },
      {
        question: "You press PAFL (solo) on the pastor's mic. What happens in the house?",
        options: [
          "The congregation now only hears the pastor's mic",
          "Nothing changes in the house — PAFL only affects your headphones/booth monitor and meters",
          "All other channels are muted for everyone",
          "The main speakers turn off",
        ],
        answer: 1,
        explanation:
          "PAFL is a listen/solo for the operator only. It never changes the house mix — it just lets you audition a channel in your headphones.",
      },
      {
        question: "Which control is your best friend for preventing feedback from an unused wireless mic?",
        options: ["The Select key", "The Mute key", "The Layer key", "The PAFL key"],
        answer: 1,
        explanation:
          "Muting channels that aren't in use (open mics on stage) is a primary defense against feedback and stray noise.",
      },
    ],
  },
  {
    slug: "gain-preamp",
    order: 6,
    title: "Gain & the Preamp",
    subtitle: "Setting a strong, clean input level — the foundation every good mix is built on.",
    icon: "📶",
    estMinutes: 14,
    objectives: [
      "Set gain so the signal is healthy but never clipping",
      "Know when 48V phantom power is required",
      "Understand good gain structure and why it matters",
    ],
    sections: [
      {
        heading: "What gain does",
        body: "Gain (also called Trim) is the very first control in the channel. It sets how much the preamp boosts the weak signal coming from a mic or DI up to a strong, usable level.\n\nSet it too LOW and the signal is weak; you'll have to push everything else hard, which adds hiss and noise. Set it too HIGH and the signal CLIPS — it distorts, sounds harsh and crackly, and can't be fixed later. The goal is a healthy level with headroom to spare.",
        control: "Gain / Trim",
      },
      {
        heading: "Setting gain by the meters",
        body: "On the SQ-6, select the channel and watch its input meter on the touchscreen while the source is at a realistic performance level (have the vocalist sing as loud as they will in the service, not a timid 'check one').\n\n- Aim for the meter to average in the healthy range, with the loudest peaks staying below the top.\n- The signal should never light the clip/peak indicator. If it does, back the gain down.\n- Leave headroom — worship gets louder at the climax than at soundcheck, so don't max out the meter during a quiet verse.",
        tip: "Set gain with the fader at its nominal '0 / unity' position. That way the meter reflects the real preamp level, not a fader that's been pulled way down to compensate.",
      },
      {
        heading: "Phantom power (48V)",
        body: "Condenser microphones and many active DI boxes need power to work, supplied by the console as '48V phantom power' down the same mic cable.\n\n- Turn 48V ON for: condenser mics (many vocal/choir/overhead mics) and active DIs that require it.\n- Leave 48V OFF for: dynamic mics (like a handheld SM58-style vocal mic) — they don't need it. Passive DIs don't need it either.\n\nImportant safety habit: MUTE the channel (or pull the fader) BEFORE toggling 48V, and don't plug/unplug a cable while phantom is live — switching it under load causes a loud pop and can stress equipment. [CrossBridge] If you're unsure whether a mic needs 48V, check our input list or ask a lead before enabling it.",
        control: "48V",
      },
      {
        heading: "Gain structure across the whole path",
        body: "Gain structure means keeping a strong, clean level at every stage — not too weak, not clipping — from the preamp all the way to the output. Good gain structure gives you a quiet, punchy mix with plenty of room to make moves.\n\nThe habit: get the gain right FIRST at soundcheck, then mix with the faders. If you find yourself running a fader almost all the way down to control a channel, its gain is probably set too high — fix the gain instead of fighting it with the fader.",
        tip: "Fix problems as far upstream as possible. A level set right at the preamp saves you from chasing it everywhere downstream.",
      },
    ],
    quiz: [
      {
        question: "What happens if you set the input gain too HIGH?",
        options: [
          "The signal is weak and hissy",
          "The signal clips and distorts — harsh, crackly, and unfixable later",
          "Nothing, gain has no effect",
          "The channel mutes automatically",
        ],
        answer: 1,
        explanation:
          "Too much gain clips the input, causing distortion you can't remove downstream. Too little gain gives a weak, noisy signal. Aim for healthy with headroom.",
      },
      {
        question: "Which of these needs 48V phantom power?",
        options: [
          "A dynamic handheld vocal mic",
          "A passive DI box",
          "A condenser microphone",
          "A pair of headphones",
        ],
        answer: 2,
        explanation:
          "Condenser mics (and active DIs) need 48V phantom power. Dynamic mics and passive DIs do not.",
      },
      {
        question: "What should you do just before toggling 48V phantom power on a channel?",
        options: [
          "Turn the house speakers all the way up",
          "Mute the channel (or pull the fader) to avoid a loud pop",
          "Unplug the console",
          "Recall a new Scene",
        ],
        answer: 1,
        explanation:
          "Muting first prevents the pop that occurs when phantom power switches, protecting speakers and ears.",
      },
      {
        question: "You're running a channel's fader almost all the way down to keep it from being too loud. What does that usually mean?",
        options: [
          "The fader is broken",
          "The gain is set too high and should be reduced at the preamp",
          "You need a bigger console",
          "The channel needs more phantom power",
        ],
        answer: 1,
        explanation:
          "Fighting a channel with a very low fader is a sign of bad gain structure. Fix it upstream by lowering the gain so the fader can sit near unity.",
      },
    ],
  },
  {
    slug: "eq-hpf",
    order: 7,
    title: "High-Pass Filter & EQ",
    subtitle: "Shaping tone and cleaning up mud with the HPF and 4-band parametric EQ.",
    icon: "🎚️",
    estMinutes: 14,
    objectives: [
      "Use the high-pass filter to remove low-end rumble",
      "Understand the three EQ controls: frequency, gain, and Q",
      "Make small, purposeful EQ moves instead of over-tweaking",
    ],
    sections: [
      {
        heading: "Start with the High-Pass Filter (HPF)",
        body: "The high-pass filter lets HIGH frequencies pass and cuts away the LOWs below a chosen point. It's the first cleanup tool on most channels.\n\nStages are full of low-frequency energy you don't want in vocal and instrument channels — foot stomps, mic handling, HVAC rumble, stage vibration. Rolling in an HPF on those channels (commonly somewhere around 80–120 Hz for vocals) removes that mud without making the voice sound thin. Bass guitar and kick drum are usually left with little or no HPF because their sound lives down low.",
        tip: "A little HPF on almost every vocal and instrument mic cleans up the whole mix instantly. Bass and kick are the main exceptions.",
        control: "HPF",
      },
      {
        heading: "The three EQ controls",
        body: "The SQ-6 gives each channel a 4-band parametric EQ. Every band has three controls:\n\n- FREQUENCY — WHICH pitch range you're adjusting (from lows to highs).\n- GAIN — how much you BOOST (turn up) or CUT (turn down) that range, in dB.\n- Q (width) — how WIDE or NARROW a range around that frequency is affected. A wide Q is gentle and musical; a narrow Q is surgical, for zapping one problem tone.\n\nTogether: pick the frequency, decide boost or cut, and set how wide the move is.",
        control: "PEQ",
      },
      {
        heading: "Cut first, boost gently",
        body: "The pro habit is to solve problems by CUTTING the offending frequency rather than boosting everything around it. Cutting is cleaner, adds less energy to the mix, and reduces feedback risk.\n\nA practical method to find a problem tone: temporarily BOOST a narrow band and sweep the frequency until the annoying/harsh/boomy quality jumps out, then turn that band into a CUT and dial the amount back to just enough. Then leave it alone.\n\nGo easy. Big EQ moves (many dB) usually mean the real fix is elsewhere — mic choice, mic position, or gain. Small, purposeful moves keep things natural.",
        tip: "If you catch yourself making huge EQ boosts, stop and check the mic and its placement first. EQ can't fix a badly captured source.",
      },
      {
        heading: "EQ and feedback",
        body: "Feedback (that squeal/howl) happens at specific frequencies where a mic and speaker form a loop. A narrow EQ CUT at the offending frequency can tame it, but EQ is a supporting fix — the primary tools are mic placement, gain discipline, and muting unused mics.\n\nNever try to 'EQ your way out' of a badly positioned monitor pointed at an open mic. Fix the physical setup first, then use a gentle cut to buy margin.",
      },
    ],
    quiz: [
      {
        question: "What does a high-pass filter (HPF) do?",
        options: [
          "Cuts the high frequencies and keeps the lows",
          "Lets the highs pass and cuts the low frequencies below a set point",
          "Boosts all frequencies equally",
          "Adds reverb",
        ],
        answer: 1,
        explanation:
          "A high-pass filter passes highs and removes lows below the chosen frequency — great for cutting rumble on vocal and instrument channels.",
      },
      {
        question: "The 'Q' control on an EQ band sets what?",
        options: [
          "How loud the channel is overall",
          "Which frequency is affected",
          "How wide or narrow a range around the chosen frequency is affected",
          "The phantom power voltage",
        ],
        answer: 2,
        explanation:
          "Q is bandwidth: wide Q affects a broad, gentle range; narrow Q is surgical for targeting one specific problem tone.",
      },
      {
        question: "What's the preferred approach to fixing a harsh or boomy frequency?",
        options: [
          "Boost everything around it",
          "Cut the offending frequency rather than boosting around it",
          "Turn the gain all the way up",
          "Add a second microphone",
        ],
        answer: 1,
        explanation:
          "Cutting the problem is cleaner and safer than boosting everything else. Find it by sweeping a narrow boost, then turn it into a modest cut.",
      },
      {
        question: "Which channels typically get little or no high-pass filtering?",
        options: [
          "Lead and background vocals",
          "Bass guitar and kick drum",
          "Acoustic guitar",
          "Spoken-word lapel mics",
        ],
        answer: 1,
        explanation:
          "Bass and kick live in the low frequencies, so we usually leave them with little or no HPF. Vocals and most instruments benefit from a modest HPF.",
      },
    ],
  },
  {
    slug: "dynamics",
    order: 8,
    title: "Dynamics: Gate & Compressor",
    subtitle: "Controlling loud and quiet — keeping vocals consistent and stages clean.",
    icon: "📉",
    estMinutes: 14,
    objectives: [
      "Explain what a compressor does and its key controls",
      "Explain what a noise gate does and when to use one",
      "Apply gentle, transparent dynamics rather than crushing the sound",
    ],
    sections: [
      {
        heading: "The compressor — evening out level",
        body: "A compressor automatically turns DOWN a signal when it gets too loud, then you make up the level. The result is a more CONSISTENT sound — the quiet words and the belted notes sit closer together, so a vocal stays present without you riding the fader every second.\n\nKey controls:\n- THRESHOLD — the level above which the compressor starts working. Only signal louder than this gets turned down.\n- RATIO — how firmly it turns down what's over the threshold (a gentle 2:1 vs. a firm 4:1+).\n- ATTACK / RELEASE — how fast it clamps down and how fast it lets go.\n- MAKEUP GAIN — brings the overall level back up after compression.",
        control: "Compressor",
      },
      {
        heading: "Using compression tastefully",
        body: "For worship vocals, aim for GENTLE, transparent control — a few dB of gain reduction on the loudest peaks, not obvious 'squashing.' Watch the gain-reduction meter: if it's slamming down 10+ dB constantly, you're overdoing it.\n\nGood starting instinct for a lead vocal: a moderate ratio, threshold set so the compressor only engages on the louder phrases, and just enough makeup gain to match the pre-compression level. The goal is 'I can always hear the words clearly,' not 'wow, that's compressed.'",
        tip: "Set threshold while the singer performs at full intensity. If you set it during a soft check, it'll clamp far too hard when they open up.",
      },
      {
        heading: "The noise gate — silencing the gaps",
        body: "A gate does the opposite of a compressor: it turns a channel DOWN (or off) when the signal falls BELOW a threshold, and opens it up when a real signal arrives.\n\nUse it to clean up channels that pick up unwanted noise in the gaps — for example a drum mic catching bleed from the rest of the kit, or a mic that hisses when nobody's talking. Set the threshold just above the noise floor so real playing/singing opens the gate but the background junk stays shut out.\n\nBe careful: too aggressive a gate 'chops' the start or end of soft notes. On lead vocals we often use little or no gating so quiet phrases aren't cut off.",
        control: "Gate",
      },
    ],
    quiz: [
      {
        question: "What does a compressor do?",
        options: [
          "Turns a signal UP when it gets quiet",
          "Turns a signal DOWN when it exceeds a threshold, making the level more consistent",
          "Removes low frequencies",
          "Adds echo",
        ],
        answer: 1,
        explanation:
          "A compressor reduces the loudest parts above the threshold, evening out the dynamics so a vocal stays consistent.",
      },
      {
        question: "The compressor's THRESHOLD control sets what?",
        options: [
          "The level above which compression starts working",
          "The overall channel color",
          "The phantom power",
          "Which layer the channel is on",
        ],
        answer: 0,
        explanation:
          "Threshold is the level above which the compressor acts. Only signal louder than the threshold gets turned down.",
      },
      {
        question: "How does a noise gate behave?",
        options: [
          "It boosts signals below the threshold",
          "It turns the channel down/off when signal falls below the threshold, and opens when real signal arrives",
          "It is identical to a compressor",
          "It only works on the main LR bus",
        ],
        answer: 1,
        explanation:
          "A gate silences a channel when the signal is below threshold and opens it for real signal — useful for cutting noise and bleed in the gaps.",
      },
      {
        question: "What's the right amount of compression for a worship lead vocal?",
        options: [
          "As much as possible — slam it 15+ dB constantly",
          "None ever",
          "Gentle and transparent — a few dB of reduction on the loudest peaks",
          "Only during the sermon",
        ],
        answer: 2,
        explanation:
          "Tasteful, gentle compression keeps the vocal consistent without an obvious 'squashed' sound. Watch the gain-reduction meter and keep it modest.",
      },
    ],
  },
  {
    slug: "mixes-monitors",
    order: 9,
    title: "Monitor Mixes & Sends on Faders",
    subtitle: "Building what the stage hears using aux mixes and the SQ-6's sends-on-faders workflow.",
    icon: "🔊",
    estMinutes: 14,
    objectives: [
      "Explain the difference between the house mix and monitor mixes",
      "Use 'sends on faders' to build a monitor mix quickly",
      "Understand pre-fade vs. post-fade sends for monitors",
    ],
    sections: [
      {
        heading: "House mix vs. monitor mixes",
        body: "The MAIN LR mix is what the congregation hears. But the musicians and vocalists on stage need their own separate blends — the MONITOR mixes — so they can hear themselves and each other. These come out of stage wedges or in-ear monitors (IEMs).\n\nEach monitor mix is independent. The drummer might want lots of click and bass; the worship leader wants mostly their own vocal and a little acoustic. You build each of these on its own aux/mix bus, drawing from the same channels but at completely different levels than the house.",
        control: "Mix / Aux",
      },
      {
        heading: "Sends on faders — the fast way to mix monitors",
        body: "Instead of tiny send knobs, the SQ-6 lets you build a monitor mix using the big physical faders. This is called SENDS ON FADERS.\n\nHow it works: press the Mix (aux) master for the monitor you want to build — say 'IEM 1: Worship Leader.' The console flips the fader strips so that each fader now sets how much of that channel is SENT to that one monitor mix. Move the acoustic guitar fader and you're setting how much guitar the worship leader hears in their ears — not the house level.\n\nWhen you're done, return to the LR/main mix and the faders go back to controlling the house. [CrossBridge] Confirm exactly how our Mix masters are labeled and which output feeds which performer.",
        tip: "Watch the screen/indicators to confirm which mix you're sending to. Changing a fader in the wrong mix is the classic monitor mistake — always verify you're on the intended aux before making moves.",
        control: "Sends on Faders",
      },
      {
        heading: "Pre-fade vs. post-fade",
        body: "A send to a mix can be PRE-fade or POST-fade, and it matters for monitors:\n\n- PRE-FADE sends take the signal BEFORE the channel's main fader. So when you change the house level, the monitor level does NOT change. Monitor mixes are almost always fed pre-fade, so a performer's in-ear blend stays stable no matter what you do to the house.\n- POST-FADE sends take the signal AFTER the fader, so they follow house fader moves. This is what we use for effects like reverb, so the wet effect rises and falls with the vocal.\n\nRule of thumb: monitors = pre-fade, effects = post-fade.",
        tip: "If a performer complains their monitor level jumps around when you mix the house, a send that should be pre-fade is probably set post-fade.",
      },
    ],
    quiz: [
      {
        question: "What is a monitor mix?",
        options: [
          "The mix the congregation hears from the main speakers",
          "A separate blend sent to stage wedges or in-ears so performers can hear themselves",
          "The recording sent to the lobby",
          "The lighting cue list",
        ],
        answer: 1,
        explanation:
          "Monitor mixes are independent blends for the stage. Each performer can have a different mix from the same channels.",
      },
      {
        question: "What does the SQ-6 'sends on faders' feature let you do?",
        options: [
          "Use the large faders to set how much of each channel goes to a selected monitor mix",
          "Automatically mix the whole service with no input",
          "Turn all faders into mute buttons",
          "Record to USB",
        ],
        answer: 0,
        explanation:
          "Pressing a Mix master flips the faders so they set that channel's send level to the selected monitor mix — a fast, tactile way to build monitors.",
      },
      {
        question: "Monitor mixes are almost always fed how, and why?",
        options: [
          "Post-fade, so they follow the house fader",
          "Pre-fade, so the performer's monitor level stays stable no matter what you do to the house",
          "Muted, so nobody hears them",
          "It doesn't matter",
        ],
        answer: 1,
        explanation:
          "Pre-fade sends are taken before the channel fader, so house mix moves don't disturb the stage monitor blend. Effects, by contrast, are usually post-fade.",
      },
      {
        question: "A performer says their in-ear vocal jumps up and down whenever you adjust the house. What's the likely cause?",
        options: [
          "The console is broken",
          "Their monitor send is set post-fade when it should be pre-fade",
          "The phantom power is off",
          "They need a new microphone",
        ],
        answer: 1,
        explanation:
          "A post-fade monitor send follows your house fader moves. Switching that send to pre-fade keeps their monitor level independent of the house.",
      },
    ],
  },
  {
    slug: "fx",
    order: 10,
    title: "Effects: Reverb & Delay",
    subtitle: "Adding space and polish with the SQ-6's onboard FX engines and returns.",
    icon: "✨",
    estMinutes: 12,
    objectives: [
      "Understand how FX sends and returns work",
      "Use reverb and delay tastefully on vocals",
      "Keep effects from washing out clarity",
    ],
    sections: [
      {
        heading: "How effects are wired",
        body: "The SQ-6 has built-in FX engines (reverb, delay, and more). Effects use a SEND and RETURN loop:\n\n- You SEND some of a channel (like a lead vocal) to an FX engine — usually a POST-fade send so the effect follows the vocal's level.\n- The FX engine produces the 'wet' effect (the reverb tail, the echo).\n- That wet signal RETURNS on its own channel/return and is blended into the main mix.\n\nSo the vocal you hear is the DRY channel plus a little of the WET return. Turning up the send adds more effect; the return level sets how loud the effect sits in the mix.",
        control: "FX Sends",
      },
      {
        heading: "Reverb and delay in worship",
        body: "- REVERB adds a sense of space, as if the voice is in a larger room. A touch of reverb on vocals makes them feel polished and blended. Too much and lyrics turn to mush and the mix sounds distant.\n- DELAY (echo) repeats the signal. A subtle delay can add depth to a lead vocal or create a rhythmic effect on a specific line. Tempo-synced delays should match the song's tempo (some SoftKeys can 'tap tempo').\n\nLess is more. The congregation should feel the effect more than notice it. [CrossBridge] We typically keep a light, consistent vocal reverb — check our house Scene for the preset we use.",
        tip: "Solo (PAFL) the FX return by itself and you'll hear how much effect you're really adding — it's usually more than you think in the full mix.",
      },
      {
        heading: "Keep clarity first",
        body: "Effects are seasoning, not the meal. Spoken word (sermon, announcements, prayer) usually gets little to no reverb — intelligibility is everything. Save the space and shine for sung worship.\n\nWhen in doubt, pull effects back. A clear, present, slightly dry mix always beats a washed-out, echoey one where nobody can understand the words.",
      },
    ],
    quiz: [
      {
        question: "How do effects like reverb get into the mix on the SQ-6?",
        options: [
          "Every channel has a permanent built-in reverb that can't be changed",
          "You SEND a channel to an FX engine, and its 'wet' output RETURNS and is blended into the mix",
          "Effects only work on recordings",
          "You must use an external rack unit",
        ],
        answer: 1,
        explanation:
          "FX use a send/return loop: send part of a channel to the FX engine, and the wet result returns to be blended with the dry channel.",
      },
      {
        question: "Sends to a reverb are usually set to what, so the effect follows the vocal's level?",
        options: ["Pre-fade", "Post-fade", "Muted", "Phantom-powered"],
        answer: 1,
        explanation:
          "Effects sends are typically post-fade so the wet effect rises and falls with the channel fader. (Monitors, by contrast, are pre-fade.)",
      },
      {
        question: "How much reverb belongs on the spoken sermon?",
        options: [
          "As much as possible for drama",
          "Little to none — intelligibility of the words comes first",
          "The same heavy amount as sung worship",
          "Only delay, never reverb",
        ],
        answer: 1,
        explanation:
          "Spoken word needs clarity, so we keep it dry. Reverb and delay are reserved mostly for sung worship, and even then used tastefully.",
      },
    ],
  },
  {
    slug: "scenes",
    order: 11,
    title: "Scenes: Save & Recall",
    subtitle: "Storing complete console setups so every service starts consistent.",
    icon: "💾",
    estMinutes: 10,
    objectives: [
      "Explain what a Scene stores",
      "Recall the house Scene safely",
      "Understand when (and when not) to overwrite a Scene",
    ],
    sections: [
      {
        heading: "What a Scene is",
        body: "A SCENE is a saved snapshot of the console's settings — channel names, gains, EQ, dynamics, routing, fader levels, mix setups, and more. Recall a Scene and the board instantly reconfigures to that saved state.\n\nThis is a superpower for a church. Instead of rebuilding the whole board every week, we keep a trusted 'house' starting Scene and recall it each service so everything begins from the same known-good baseline.",
        control: "Scenes",
      },
      {
        heading: "Recalling safely",
        body: "Recalling a Scene can change fader levels and routing instantly. To avoid a sudden jump in the room:\n\n- Recall Scenes when the house is quiet — before the service or between sets — not in the middle of a loud moment.\n- After recall, do a quick line check to confirm mics and DIs are passing signal as expected.\n- [CrossBridge] Our board may use recall filtering/safes so a recall doesn't stomp on something you want to protect. Ask your lead which parameters are 'safe' on our setup before relying on it.",
        tip: "Recall the starting Scene at the start of every service. It's the single best habit for consistency week to week.",
      },
      {
        heading: "Saving and overwriting — with care",
        body: "You can save changes to a Scene, but overwriting the house Scene affects EVERY future service and every other tech. Treat it like editing a shared document.\n\n- Small tweak just for today? Make it live and DON'T save over the house Scene.\n- A genuine improvement worth keeping? Talk to your lead, then save deliberately — ideally to a new Scene slot or per our naming convention, not by silently clobbering the baseline.\n- [CrossBridge] Follow our booth policy on who may edit the house Scene and how we name/back up Scenes.",
        tip: "When unsure, don't overwrite. It's far easier to redo a small tweak next week than to recover a house Scene someone accidentally saved over.",
      },
    ],
    quiz: [
      {
        question: "What does a Scene store?",
        options: [
          "Only the master volume",
          "A complete snapshot — channel names, gains, EQ, dynamics, routing, fader levels, and more",
          "Just the lighting cues",
          "Nothing; Scenes are only labels",
        ],
        answer: 1,
        explanation:
          "A Scene is a full snapshot of the console state, so recalling it reconfigures the whole board to that saved setup.",
      },
      {
        question: "When is the best time to recall a Scene?",
        options: [
          "During the loudest moment of a song",
          "While the house is quiet — before the service or between sets",
          "Only after the service ends",
          "It never matters when",
        ],
        answer: 1,
        explanation:
          "Because a recall can jump fader levels and routing instantly, do it when the room is quiet, then line-check before going live.",
      },
      {
        question: "You made a small EQ tweak just for today's guest speaker. What should you do at the end?",
        options: [
          "Overwrite the house Scene so it's permanent",
          "Leave it live for today but do NOT save over the house Scene",
          "Delete every Scene on the board",
          "Email the change to the whole congregation",
        ],
        answer: 1,
        explanation:
          "One-off tweaks shouldn't overwrite the shared house baseline. Only save deliberate, agreed improvements, per our booth policy.",
      },
    ],
  },
  {
    slug: "service-workflow",
    order: 12,
    title: "The CrossBridge Sunday Workflow",
    subtitle: "Putting it all together: from arrival to soundcheck to running the service.",
    icon: "⛪",
    estMinutes: 15,
    objectives: [
      "Follow the full service-day flow from setup to teardown",
      "Run an efficient soundcheck",
      "Know your priorities and etiquette while running a live service",
    ],
    sections: [
      {
        heading: "Before the service",
        body: "A calm service starts with unhurried prep. A typical flow:\n\n1. Arrive early — before the team needs monitors.\n2. Power up in the correct order (console/sources first, speakers last) and recall the house starting Scene.\n3. Confirm stage boxes are connected and channels are showing signal.\n4. Line-check every input: each mic, DI, and playback source passes signal to the house and to the right monitors.\n5. Coordinate with the worship team on stage placement and any special needs (extra mic, click track, video audio).",
        tip: "Your goal before rehearsal: every input verified and every performer able to hear themselves. Solve problems now, not during the first song.",
      },
      {
        heading: "Soundcheck",
        body: "Soundcheck is where you set the foundation:\n\n1. Set GAIN on each channel with the source at realistic performance level.\n2. Build MONITORS first — musicians play better when they can hear. Use sends-on-faders and ask each performer what they need.\n3. Then build the HOUSE mix: HPF and gentle EQ to clean each channel, tasteful dynamics on vocals, and balance the faders so the mix supports the song (usually lead vocal on top, clear and present).\n4. Run a full song if you can, listening for problem frequencies, feedback risks, and anything harsh.",
        control: "Sends on Faders",
      },
      {
        heading: "Running the service",
        body: "During the service your job is attentive, gentle mixing and readiness:\n\n- Follow the service order. Know what's next — sermon, song, video, baptism — and have the right channels up and unused mics muted.\n- Mute mics that aren't in use (a huge win for cleanliness and feedback prevention). Unmute a beat before someone speaks/sings.\n- Ride the lead vocal so the words are always clear over the band. Make small, smooth moves, not jumps.\n- Watch for feedback and clipping; respond early and calmly.\n- Serve the moment: pull the band back under a prayer, support the dynamic build of a chorus.",
        tip: "The best service mixing is proactive: you're one step ahead of the platform, not reacting late. Keep the run sheet in front of you.",
      },
      {
        heading: "After the service",
        body: "1. Pull down the house and mute as the room clears.\n2. Power down in the correct order (speakers/amps first).\n3. Handle Scenes responsibly — don't overwrite the house Scene with one-off changes.\n4. Store mics and cables to our booth standard, secure the booth, and note any gear issues for the next tech or your lead.",
      },
    ],
    quiz: [
      {
        question: "During soundcheck, what should you generally build FIRST?",
        options: [
          "The lobby feed",
          "The monitors — musicians play better when they can hear themselves",
          "The recording",
          "The reverb tails",
        ],
        answer: 1,
        explanation:
          "Set gains, then build monitors first so performers can hear, then build the house mix. A confident stage leads to a better house sound.",
      },
      {
        question: "What's a key habit for cleanliness and feedback prevention while running the service?",
        options: [
          "Leave every mic open the whole time",
          "Mute mics that aren't in use and unmute just before they're needed",
          "Turn the gain up on all channels",
          "Recall a new Scene every few minutes",
        ],
        answer: 1,
        explanation:
          "Muting unused mics removes open channels that cause noise and feedback. Unmute a beat ahead so nothing gets clipped off.",
      },
      {
        question: "What does 'riding the lead vocal' mean during the service?",
        options: [
          "Turning the vocal off during songs",
          "Making small, smooth fader adjustments so the lead vocal stays clear over the band",
          "Adding maximum reverb at all times",
          "Muting the vocal to protect it",
        ],
        answer: 1,
        explanation:
          "You continuously make gentle fader moves so the lead vocal stays present and intelligible above the changing band level.",
      },
      {
        question: "What's the mindset that separates great live mixing from stressful mixing?",
        options: [
          "Reacting only after something goes wrong",
          "Being proactive — knowing what's next and staying one step ahead of the platform",
          "Keeping the run sheet out of sight",
          "Making large, dramatic fader jumps",
        ],
        answer: 1,
        explanation:
          "Great mixing is proactive. Following the run sheet and anticipating what's next keeps you ahead of the service instead of chasing it.",
      },
    ],
  },
  {
    slug: "troubleshooting",
    order: 13,
    title: "Troubleshooting Under Pressure",
    subtitle: "Calm, systematic fixes for the problems that actually happen on Sunday.",
    icon: "🛠️",
    estMinutes: 12,
    objectives: [
      "Diagnose 'no sound' with the signal-flow method",
      "Respond to feedback quickly and safely",
      "Handle common real-world issues without panic",
    ],
    sections: [
      {
        heading: "No sound from a channel",
        body: "Stay calm and walk the signal path from source to speaker. Check, in order:\n\n1. Is the source live? Is the mic on / cable seated / is the performer actually near the mic?\n2. Is the channel MUTED? (The most common culprit.)\n3. Is the FADER up, and are you on the LAYER where that channel lives?\n4. Is the GAIN set (not at minimum)? Is 48V on if it's a condenser/active DI?\n5. Is the channel ROUTED/assigned to the Main LR?\n6. Is the Main LR up and are the house speakers/amps on?\n\nThe first place the signal is missing is your problem. Fix it there.",
        tip: "Nine times out of ten it's a mute, a fader down, or the wrong layer. Check the simple stuff first before assuming the gear failed.",
      },
      {
        heading: "Feedback (the squeal)",
        body: "Feedback is a loop between a mic and a speaker. When it starts, act fast but controlled:\n\n1. Quickly pull down the fader (or PAFL to find which channel is the culprit) — don't hit random controls in a panic.\n2. Identify the source: usually an open mic too close to a speaker/monitor, or a channel pushed too hot.\n3. Reduce that channel's level, reposition the mic/monitor, or apply a narrow EQ cut at the offending frequency.\n\nPrevent it next time: mute unused mics, keep gain disciplined, mind mic and monitor placement, and don't over-boost.",
        tip: "Prevention beats cure. Most feedback is avoided by muting open mics and not pushing gain/levels past what the room allows.",
      },
      {
        heading: "Other common issues",
        body: "- DISTORTED/CRACKLY channel: check for clipping — the gain is likely too high. Back it down.\n- HUM or BUZZ: often a cable, DI, or grounding issue. PAFL to isolate the channel, then try a different cable/DI or a passive DI's ground-lift. [CrossBridge] Report persistent hum to your lead so we can trace it.\n- MONITOR LEVEL JUMPS with the house: a monitor send set post-fade instead of pre-fade.\n- WHOLE SIDE OF THE ROOM DEAD: check that speaker/amp and its feed, not the console channel.\n- Something big and unclear: if you can't solve it quickly and it's affecting the service, get a lead tech — protecting the service matters more than solving it solo.",
      },
    ],
    quiz: [
      {
        question: "A mic that worked at soundcheck is now silent. What's the single most common cause to check first?",
        options: [
          "The console needs a firmware update",
          "The channel is muted (or its fader is down / you're on the wrong layer)",
          "The building lost power",
          "The mic needs to be replaced immediately",
        ],
        answer: 1,
        explanation:
          "Most 'no sound' issues are a mute, a fader down, or the wrong layer. Walk the signal path and check the simple things first.",
      },
      {
        question: "Feedback suddenly starts during a song. What's the best first move?",
        options: [
          "Randomly press buttons until it stops",
          "Calmly pull down the offending fader (or PAFL to find it), then address the cause",
          "Turn the house speakers up",
          "Unplug the console",
        ],
        answer: 1,
        explanation:
          "Act fast but controlled: reduce the offending channel, identify the open mic/monitor, then fix placement/level/EQ. Panic-pressing makes it worse.",
      },
      {
        question: "A channel sounds crackly and distorted. What's the likely fix?",
        options: [
          "Add reverb",
          "The gain is probably too high and clipping — reduce it",
          "Increase the fader to maximum",
          "Switch to a different layer",
        ],
        answer: 1,
        explanation:
          "Crackly distortion is usually clipping from too much gain. Back the gain down to restore a clean signal.",
      },
      {
        question: "You hit a major problem you can't solve quickly and it's disrupting the service. What should you do?",
        options: [
          "Keep experimenting alone no matter how long it takes",
          "Get a lead tech — protecting the service matters more than solving it solo",
          "Turn everything off",
          "Ignore it and hope it resolves",
        ],
        answer: 1,
        explanation:
          "When a problem is beyond a quick fix and affecting worship, escalate to a lead. Serving the service comes before solo heroics.",
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

/**
 * CrossBridge Church (CBC) — Safety & Security Team Training Curriculum
 * --------------------------------------------------------------------
 * ⚠️ ROUGH DRAFT. This curriculum is a first pass generated from the Safety &
 * Security slide deck (6 chapters / 15 lessons) and the church's "Security
 * Book" (Mission Statement, Roles & Responsibilities, Emergency Action Plan,
 * Fire Evacuation Plan, and Armed Intruder / Lock-Down plans). Wording,
 * procedures, names, and phone/radio protocols must be verified with the
 * Safety Team lead and elders before this is treated as authoritative.
 *
 * It reuses the Module / LessonSection / QuizQuestion / TrainingPhase types
 * from the Sound Tech curriculum so it renders through the same ModuleRunner.
 * Safety modules intentionally omit the `visual` field (those named visuals are
 * SQ-6-specific). To edit a lesson, change its `sections`. To add a module,
 * append to `safetyCurriculum` and (optionally) list its slug in a phase.
 *
 * Guiding frame from the slides, applied throughout: Safety Team members
 * OBSERVE, SUPPORT, REPORT, and ESCALATE — they stay in their lane, act early,
 * and hand off to leadership and emergency responders. This is not tactical or
 * law-enforcement training.
 */

import type {
  Module,
  TrainingPhase,
  ResolvedPhase,
} from "./curriculum";
import { safetySlides } from "./safety-slides";

const safetyCurriculumBase: Module[] = [
  // ── Chapter 1 · Operating Framework ──────────────────────────────────────
  {
    slug: "sec-team-framework",
    order: 1,
    title: "The Safety Team Framework",
    subtitle: "Who we are, the lane we operate in, and the pattern every action follows.",
    icon: "🛡️",
    estMinutes: 12,
    objectives: [
      "State the mission and posture of the CrossBridge Safety Team",
      "Describe the operating lane — what the team does and does not do",
      "Apply the Observe → Support → Report → Escalate action pattern",
    ],
    sections: [
      {
        heading: "Our mission and posture",
        body: "The CrossBridge Safety & Security Team exists to glorify God by protecting the people entrusted to our care, so the Word can be preached without unnecessary distraction and the congregation can gather in peace. We serve under the authority of the church's elders, not on our own initiative.\n\nOur posture is welcoming but watchful. We are not a 'bunch of cowboys,' we do not do physical detention, and the goal is not to look like security. We keep a visible, calm, helpful presence while quietly reducing risk. We treat every person with dignity, avoid unnecessary confrontation, and use only the minimum reasonable response consistent with church policy and the law.",
        tip: "Balance vigilance with hospitality. Members and guests should feel welcomed and cared for, not watched.",
      },
      {
        heading: "Staying in the operating lane",
        body: "Safety Team members SUPPORT the ministry — they don't run it, and they don't take on roles they aren't trained for. Boundaries keep the role useful:\n\n- We observe conditions, access, and behavior.\n- We support access, movement, medical, and evacuation efforts.\n- We report clearly and escalate to the right leader or to 911.\n- We do NOT investigate threats, confront armed persons, provide medical care beyond our training, or freelance.\n\nStaying in the lane doesn't mean staying passive. Within our lane we are expected to act — correct small problems, report concerns, and escalate early.",
        tip: "When something is outside your lane or training, your job is to report and escalate — fast and clearly — not to handle it yourself.",
      },
      {
        heading: "The action pattern",
        body: "Almost everything the team does follows one repeatable pattern:\n\n1. OBSERVE — notice what is normal and what has changed.\n2. SUPPORT — help with access, movement, or direction using calm, simple words.\n3. REPORT — describe facts (location, behavior, current risk) to the right person.\n4. ESCALATE — hand off to leadership or emergency responders when the situation exceeds your role.\n\nThe bottom line: know your lane, act within it, and escalate early. A concern reported thirty seconds sooner gives everyone more time to respond well.",
        tip: "Bottom line — Observe, Support, Report, Escalate. When unsure, report early.",
      },
    ],
    quiz: [
      {
        question: "Under whose authority does the Safety Team operate?",
        options: [
          "Its own team leader alone, independently of the church",
          "The church's elders",
          "Local law enforcement",
          "Whoever is loudest in the moment",
        ],
        answer: 1,
        explanation:
          "The team serves under the authority of the church's elders, supporting the shepherding ministry rather than acting on its own initiative.",
      },
      {
        question: "Which of these is INSIDE the Safety Team's operating lane?",
        options: [
          "Confronting and disarming an armed intruder",
          "Investigating who caused a suspicious situation",
          "Observing, supporting movement, reporting facts, and escalating",
          "Providing advanced medical care without training",
        ],
        answer: 2,
        explanation:
          "The lane is Observe, Support, Report, Escalate. Confrontation, investigation, and care beyond your training are out of lane — escalate instead.",
      },
      {
        question: "What is the correct order of the action pattern?",
        options: [
          "Escalate → Observe → Support → Report",
          "Observe → Support → Report → Escalate",
          "Report → Confront → Observe → Support",
          "Support → Investigate → Detain → Report",
        ],
        answer: 1,
        explanation:
          "Observe what changed, support with calm direction, report the facts, and escalate to the right leader or 911 when it exceeds your role.",
      },
    ],
  },
  {
    slug: "sec-pre-service",
    order: 2,
    title: "Pre-Service Readiness",
    subtitle: "Starting every service ready — assignment, comms, access points, and knowing normal.",
    icon: "✅",
    estMinutes: 12,
    objectives: [
      "Complete a pre-service readiness check before doors open",
      "Confirm your assignment, communications, and access points",
      "Establish what 'normal' looks like so you can spot what changes",
    ],
    sections: [
      {
        heading: "Start ready",
        body: "Readiness is decided before the first guest arrives. Arrive early enough to walk your area and settle these before doors open:\n\n- KNOW YOUR ASSIGNMENT — the post or area you're responsible for and who your lead is.\n- CHECK COMMUNICATION FIRST — test your radio or agreed device; confirm you can reach your lead and be reached.\n- CHECK ACCESS POINTS — which doors should be locked, unlocked, or monitored per the security plan.\n- CHECK CHILDREN'S AND RESTRICTED AREAS — confirm boundaries are set and check-in is ready.\n- CHECK MOVEMENT ROUTES — entrances, exits, and the paths guests will use.\n- CHECK RESPONDER & MEDICAL READINESS — know where the AED, exits, and rally points are.",
        tip: "Communication is the first check, not the last. A post you can't reach is a coverage gap.",
      },
      {
        heading: "Know what normal looks like",
        body: "You can only notice what has changed if you first know what normal is. During setup, take in the baseline: the usual flow of people, which doors are used, the normal noise level, who belongs in restricted areas.\n\nStay visible but not intimidating, avoid coverage gaps, and adjust during transitions — the busiest, highest-risk moments are arrival, dismissal to children's ministry, offering, and departure. Position yourself for those, not just for the calm middle of the service.",
        tip: "Normal doesn't mean 'nothing matters.' A quiet baseline is exactly what lets a small change stand out.",
      },
      {
        heading: "Correct, report, escalate — don't freelance",
        body: "When your pre-service check turns up a problem, respond in proportion:\n\n- CORRECT the small things you can (a propped door, a trip hazard, a mislabeled area).\n- REPORT what you can't fix yourself or that a lead should know about.\n- ESCALATE anything that involves a threat, a person, or your safety.\n\nWhat you do not do is freelance — invent your own plan, leave your post uncovered, or take on a task outside your assignment. Coordinate through your lead so coverage stays intact.",
        tip: "Bottom line — begin every service set, reachable, and oriented to normal, with access points and routes confirmed.",
      },
    ],
    quiz: [
      {
        question: "What should be your FIRST pre-service check?",
        options: [
          "Counting the offering",
          "Communication — test your radio/device and confirm you can reach and be reached",
          "Locking every door in the building",
          "Nothing; wait until an incident happens",
        ],
        answer: 1,
        explanation:
          "Check communication first. A post that can't reach its lead is a coverage gap before the service even starts.",
      },
      {
        question: "Why does the team deliberately learn 'what normal looks like' during setup?",
        options: [
          "So the service feels routine and boring",
          "Because you can only notice what has changed if you know the baseline first",
          "To decide who to profile",
          "It isn't important",
        ],
        answer: 1,
        explanation:
          "Knowing the normal flow, doors, and noise level is what lets a small change stand out later.",
      },
      {
        question: "A pre-service walk turns up a threat involving a person. What do you do?",
        options: [
          "Handle it yourself quietly",
          "Ignore it until the service ends",
          "Escalate it to your lead / the right authority right away",
          "Leave your post to investigate on your own",
        ],
        answer: 2,
        explanation:
          "Correct small things, report what a lead should know, and escalate anything involving a threat or a person — without freelancing or leaving coverage gaps.",
      },
    ],
  },
  {
    slug: "sec-changes-escalate",
    order: 3,
    title: "What Changes Action & When to Escalate",
    subtitle: "Reading the situation — the three categories and what raises urgency.",
    icon: "🔀",
    estMinutes: 12,
    objectives: [
      "Sort any situation into Normal, Escalating, or Immediate",
      "Name the factors that change the required action",
      "Escalate earlier when children or worsening conditions are involved",
    ],
    sections: [
      {
        heading: "Match the action to the situation",
        body: "Action should match the situation, not your mood or curiosity. The slides teach three categories that carry through the whole curriculum:\n\n- NORMAL — routine conditions; observe and support.\n- ESCALATING — something is changing or wrong; report and get the right leader involved.\n- IMMEDIATE — danger to people now; protect first, then call/confirm 911.\n\nNormal does not mean nothing matters — it means you're watching. Most of your service is spent here, staying oriented so you catch the shift into 'escalating' early.",
        tip: "Three buckets: Normal (observe), Escalating (report/involve a leader), Immediate (protect, then 911).",
      },
      {
        heading: "What changes the required action",
        body: "Several factors move a situation up the scale. Any of these can change what you should do:\n\n- ACCESS — a door, boundary, or restricted area is breached.\n- MOVEMENT — flow stops, reverses, or surges.\n- BEHAVIOR — someone is agitated, fixated, or acting far outside normal.\n- REFUSAL — a person won't follow simple, reasonable direction.\n- CHILDREN & VULNERABLE PEOPLE — their presence raises urgency.\n- LOCATION — risk near children's areas, exits, or the platform is higher.\n- ENVIRONMENT & MEDICAL — weather, smoke, gas, or a medical event.\n- IMMEDIATE HAZARDS — fire, HazMat, weapons, or explicit threats require immediate action.",
        tip: "Refusal changes the situation. When someone won't follow simple direction, stop persuading and start reporting.",
      },
      {
        heading: "Escalate early — recovery is still the response",
        body: "Worsening conditions require earlier action, not later. If a situation is trending the wrong way, escalate before it becomes an emergency. Volunteer reports can change your read, so take them seriously.\n\nLeadership and responders arriving changes the phase — your job shifts from acting to supporting them. And recovery is still part of the response: the event isn't over when the loudest part ends. When unsure at any point, report early.",
        tip: "Bottom line — when in doubt, report early. Escalating a step too soon costs little; a step too late costs time you can't get back.",
      },
    ],
    quiz: [
      {
        question: "Which category means 'danger to people now — protect first, then call/confirm 911'?",
        options: ["Normal", "Escalating", "Immediate", "Routine"],
        answer: 2,
        explanation:
          "Immediate = danger now. Protect people first, then call or confirm 911. Normal is observe; Escalating is report/involve a leader.",
      },
      {
        question: "Which factor RAISES the urgency of a situation?",
        options: [
          "Everyone is following direction",
          "A restricted-area boundary is breached and children are nearby",
          "The room is at its normal noise level",
          "A door that should be locked is locked",
        ],
        answer: 1,
        explanation:
          "Access breaches, the presence of children/vulnerable people, and risky locations all move a situation up the scale and change the required action.",
      },
      {
        question: "Conditions are trending worse but nothing has 'happened' yet. What's the right move?",
        options: [
          "Wait until it becomes a clear emergency",
          "Escalate early, before it becomes an emergency",
          "Leave your post to investigate the cause",
          "Assume a volunteer's report is exaggerated",
        ],
        answer: 1,
        explanation:
          "Worsening conditions require earlier action. Escalate before the situation becomes an emergency, and take volunteer reports seriously.",
      },
    ],
  },
  {
    slug: "sec-reports-comms",
    order: 4,
    title: "Clear Reports & Communication",
    subtitle: "Reporting so the church can respond — plain language, facts, location, and the right channel.",
    icon: "📻",
    estMinutes: 12,
    objectives: [
      "Build a report that drives action: location, facts, current risk, action needed",
      "Use plain language and report facts, not labels",
      "Use the correct reporting pathway and protect privacy",
    ],
    sections: [
      {
        heading: "Build the report for action",
        body: "A clear report helps the church respond; a vague one wastes the time you're trying to save. Communication discipline means keeping it short, plain, and useful. Build every report to answer four things:\n\n1. LOCATION — where, specifically.\n2. WHAT YOU SEE — observable facts, not conclusions.\n3. CURRENT RISK — who or what is at risk right now.\n4. ACTION NEEDED — what you need (a leader, medical, 911, more eyes).\n\nUse plain language, not codes people have to decode. Keep it short so the channel stays clear for the next message.",
        tip: "Report facts, not labels. 'Man in red jacket pulling on the locked north door' beats 'suspicious guy' every time.",
      },
      {
        heading: "The CrossBridge reporting pathway",
        body: "Use the right pathway and protect the channel. Per the church Emergency Action Plan, most emergencies are reported IN PERSON to any Pastor or Deacon, and/or by cell, and 911 as the situation requires (for an armed intruder or bomb threat, 911 and a Pastor/Deacon).\n\nThe on-duty contact order differs by service, so know who's on for the service you're serving. Reporting procedures and contact lists are posted in the Main Office, Guest Services, Youth Chapel, and every check-in station, with copies in classrooms and the Maintenance Office. When you make a report, include any uncertainty ('I think, not sure') and update it when the picture changes.",
        tip: "Know today's on-duty Pastor/Deacon contact order before the service — it changes between the first and second service.",
      },
      {
        heading: "Protect the channel and privacy",
        body: "During a serious event the radio channel is a shared, limited resource. Keep it protected:\n\n- Say only what's needed; don't narrate.\n- Use the right pathway so you're not stepping on emergency traffic.\n- Protect privacy — names, medical details, and sensitive facts stay on a need-to-know basis, not broadcast to everyone.\n\nDuring a declared lock-down there is a special rule you'll learn later: after the lock-down order, no further radio communication is made until the order to release is given.",
        tip: "Bottom line — location, facts, current risk, action needed. Short, plain, and only to who needs it.",
      },
    ],
    quiz: [
      {
        question: "Which report is built correctly for action?",
        options: [
          "'There's a weird guy somewhere.'",
          "'Suspicious person, handle it.'",
          "'North lobby door — man in red jacket pulling the locked door, no one hurt, need a lead here now.'",
          "'Something's off, not sure what.'",
        ],
        answer: 2,
        explanation:
          "A good report gives location, observable facts, current risk, and the action needed — in plain language.",
      },
      {
        question: "Per the church's plan, how are most emergencies reported?",
        options: [
          "Only by posting online",
          "In person to any Pastor or Deacon and/or by cell, with 911 as the situation requires",
          "By waiting for someone else to notice",
          "Only over a secret code word",
        ],
        answer: 1,
        explanation:
          "The Emergency Action Plan routes reports in person to any Pastor or Deacon, by cell, and to 911 as needed. The on-duty order changes by service.",
      },
      {
        question: "What should you do about names and medical details in a report?",
        options: [
          "Broadcast them to everyone so all volunteers know",
          "Keep them on a need-to-know basis to protect privacy",
          "Post them publicly after the service",
          "Include as much personal detail as possible on the open radio",
        ],
        answer: 1,
        explanation:
          "Protect privacy — sensitive facts stay need-to-know, not broadcast. Keep the channel clear and the details discreet.",
      },
    ],
  },

  // ── Chapter 2 · Access & Movement Support ────────────────────────────────
  {
    slug: "sec-access-control",
    order: 5,
    title: "Controlled Access in Real Time",
    subtitle: "Welcoming but not unmanaged — supporting doors, boundaries, and restricted areas.",
    icon: "🚪",
    estMinutes: 12,
    objectives: [
      "Support controlled access without physically blocking people",
      "Protect children's and restricted-area boundaries",
      "Correct door problems without creating new risks",
    ],
    sections: [
      {
        heading: "Welcoming but not unmanaged",
        body: "Access should feel welcoming and still be managed. Start by knowing the normal — which doors are used, who belongs in restricted areas — then watch for ACCESS DRIFT: props, tailgating, a door quietly left unlocked, someone easing past a boundary.\n\nSupport access with simple direction and a warm tone. 'Good morning — check-in's right this way' redirects most people without any friction. Tone matters: you're guiding, not guarding.",
        tip: "Watch for access drift — the slow, unnoticed loosening of a boundary — not just obvious break-ins.",
      },
      {
        heading: "Boundaries, refusal, and support vs. blocking",
        body: "Some boundaries matter more than others. Protect children's-area boundaries and support restricted areas firmly but calmly — only authorized adults belong there.\n\nIf someone refuses simple direction, that refusal changes the situation: stop persuading and report/escalate. Critically, access support does NOT mean physically blocking people. You use position, direction, and words — not your body as a barricade. If a person is determined to breach a boundary, that's a report-and-escalate moment, not a physical confrontation.",
        tip: "You control access with words and position, never by physically blocking or grabbing. Refusal → report and escalate.",
      },
      {
        heading: "Fix doors safely and report with facts",
        body: "Correct door problems without creating new risks. Re-securing a propped exterior door is good — but never lock someone into a hazard or block an egress path in the process. If fixing a door would create a new problem, report it instead.\n\nWhen you report an access concern, use facts: which door, what you saw, who's involved, current risk. And remember access changes during emergencies — during an evacuation, doors that are normally controlled may need to be open; during a lock-down, the opposite. Follow the plan for the phase you're in.",
        tip: "Bottom line — keep access welcoming and managed, guide with words not your body, and never solve a door problem by creating a worse one.",
      },
    ],
    quiz: [
      {
        question: "What is 'access drift'?",
        options: [
          "A door that is working perfectly",
          "The slow, unnoticed loosening of a boundary (propping, tailgating, easing past)",
          "A scheduled fire drill",
          "Moving your post to a new area",
        ],
        answer: 1,
        explanation:
          "Access drift is the gradual, quiet erosion of a boundary. Catching it early is much of the job — it's rarely an obvious break-in.",
      },
      {
        question: "A person refuses your simple, reasonable direction and heads for a restricted children's area. What do you do?",
        options: [
          "Physically block them with your body",
          "Grab them and remove them",
          "Stop persuading and report/escalate — do not physically block",
          "Ignore it; boundaries are only suggestions",
        ],
        answer: 2,
        explanation:
          "Access support never means physically blocking. Refusal changes the situation — report and escalate rather than making it a physical confrontation.",
      },
      {
        question: "You find a propped exterior door. What's the right way to fix it?",
        options: [
          "Lock it immediately no matter what's on the other side",
          "Re-secure it only if that doesn't block an egress path or trap anyone; otherwise report it",
          "Leave it propped; it's not your concern",
          "Remove the door entirely",
        ],
        answer: 1,
        explanation:
          "Correct door problems without creating new risks. Never block egress or lock someone into a hazard — if the fix creates a new problem, report instead.",
      },
    ],
  },
  {
    slug: "sec-movement",
    order: 6,
    title: "Movement Support in Real Time",
    subtitle: "Keeping people moving safely — routes, crowding, counterflow, and responder access.",
    icon: "🚶",
    estMinutes: 12,
    objectives: [
      "Support smooth movement and prevent dangerous crowding",
      "Keep responder routes clear at all times",
      "Adapt movement support for evacuate, shelter, and lockdown",
    ],
    sections: [
      {
        heading: "Support movement, prevent crowding",
        body: "Movement matters: how people flow through the building affects both experience and safety. Know the movement pattern — where people enter, gather, and exit — so you can spot movement problems early.\n\nUse clear, simple direction to support routes, and gently prevent stopping and crowding at pinch points (doorways, hallways, the lobby after dismissal). Support the intended routes, not curiosity — keep people moving toward where they're going instead of clustering around whatever's interesting.",
        tip: "Crowding forms at pinch points. Keep people moving through doorways and halls before a cluster becomes a crush.",
      },
      {
        heading: "Counterflow, children, and people who need help",
        body: "Manage counterflow — people moving against the main flow create friction and risk; redirect them to a better path or time. Give extra support to those who need it:\n\n- SUPPORT CHILDREN'S MOVEMENT — keep kids' transitions orderly and accounted for.\n- SUPPORT PEOPLE WHO NEED ASSISTANCE — the elderly, those with mobility needs, families with strollers.\n\nAnd always KEEP RESPONDER ROUTES CLEAR. The paths EMS or firefighters would use must stay open even during normal, busy movement — a blocked route costs minutes in an emergency.",
        tip: "Keep responder routes clear even when nothing is wrong. You can't clear a path fast once seconds count.",
      },
      {
        heading: "Movement during emergencies",
        body: "The type of protective action changes how you support movement:\n\n- EVACUATE — move people out along primary/secondary routes, away from the hazard, toward rally points.\n- SHELTER — move people INTO safer interior spaces, away from exterior danger.\n- LOCKDOWN — movement stops; get people into secured spaces and hold.\n\nAfter the immediate response, movement support continues — controlled, deliberate movement during recovery and reunification, not a free-for-all.",
        tip: "Bottom line — evacuate moves people out, shelter moves them in, lockdown holds them. Match your movement support to the phase.",
      },
    ],
    quiz: [
      {
        question: "Why must responder routes stay clear even during normal, busy movement?",
        options: [
          "To make the lobby look tidy",
          "Because a blocked route costs critical minutes when EMS or firefighters need it",
          "Responders never use interior routes",
          "It doesn't matter until an emergency is declared",
        ],
        answer: 1,
        explanation:
          "You can't clear a path quickly once seconds count. Keep responder routes open at all times, not just during emergencies.",
      },
      {
        question: "In a SHELTER protective action, how does movement support change?",
        options: [
          "Move people out of the building",
          "Move people INTO safer interior spaces, away from the exterior danger",
          "Stop all movement and hold in place only",
          "Encourage people to go to the parking lot",
        ],
        answer: 1,
        explanation:
          "Shelter moves people inward to safer interior spaces because the danger is outside. Evacuate moves them out; lockdown holds them.",
      },
      {
        question: "You see people clustering and stopping in a doorway after dismissal. What's the goal?",
        options: [
          "Let the crowd build; it will sort itself out",
          "Support the route and keep people moving through the pinch point before crowding becomes a crush",
          "Close the doorway entirely",
          "Send everyone back the way they came",
        ],
        answer: 1,
        explanation:
          "Prevent stopping and crowding at pinch points. Keep people moving along the intended route so a cluster never becomes dangerous.",
      },
    ],
  },

  // ── Chapter 3 · Medical & Building Life Safety Response ───────────────────
  {
    slug: "sec-medical",
    order: 7,
    title: "Medical Emergencies",
    subtitle: "Early coordination, clear reports, EMS access, and supporting trained responders.",
    icon: "🩺",
    estMinutes: 13,
    objectives: [
      "Follow the medical response pathway and confirm 911",
      "Take the first Safety Team actions: report, clear space, protect privacy",
      "Support trained medical volunteers and clear access for EMS",
    ],
    sections: [
      {
        heading: "Early coordination and the response pathway",
        body: "Medical emergencies need early coordination — the sooner the right people and EMS are moving, the better the outcome. Know the medical response pathway before it happens: who provides care, who calls 911, who meets EMS at the door.\n\nRecognize urgent conditions (unresponsiveness, chest pain, trouble breathing, severe bleeding, seizure, a bad fall). The moment you recognize one, your first actions are to get help moving — report clearly and make sure 911 is being called.",
        tip: "The first goal in a medical event is coordination: care started, 911 confirmed, and EMS on the way — in parallel, not one at a time.",
      },
      {
        heading: "First Safety Team actions",
        body: "When you're first on a medical scene, your actions are supportive, not clinical (unless you are trained and it's within your role):\n\n1. REPORT — make the medical report clear: exact location, what's happening, and that 911 is needed.\n2. ASSIGN OR CONFIRM 911 — explicitly make sure someone is calling; don't assume. Name the person if you can.\n3. CLEAR SPACE & PROTECT PRIVACY — move bystanders back; give the patient room and dignity.\n4. SUPPORT TRAINED MEDICAL VOLUNTEERS — CPR, AED, and first aid are for those trained and equipped; help them by managing the scene around them.\n\nIf multiple people are hurt, trained responders may use START triage (assess, treat, tag, move on) — your role is to support that, not run it.",
        tip: "'Assign or confirm 911' is its own step for a reason. In a crowd, everyone assumes someone else called. Make it explicit.",
      },
      {
        heading: "Clear access, manage movement, and what not to do",
        body: "Clear access for EMS: prop the right doors, hold an elevator if appropriate, and have someone ready to guide responders straight to the patient. Manage movement around the scene so the crowd doesn't block care or the incoming stretcher.\n\nMedical emergencies involving children need extra care and immediate involvement of Kids Ministry and a parent/guardian. When the scene stabilizes, support the handoff and help restore normal flow.\n\nWhat NOT to do: don't provide care beyond your training, don't move a seriously injured person unless they're in immediate danger, don't crowd the patient, and don't broadcast their name or condition on the open radio.",
        tip: "Bottom line — recognize, report, confirm 911, clear space and access, support the trained responders, protect privacy.",
      },
    ],
    quiz: [
      {
        question: "Why is 'assign or confirm 911' treated as its own explicit step?",
        options: [
          "Because 911 is rarely needed",
          "Because in a crowd everyone assumes someone else already called — so you make it explicit",
          "Because only the pastor may call 911",
          "It isn't a real step",
        ],
        answer: 1,
        explanation:
          "Diffusion of responsibility is real: name a person or confirm out loud that 911 is being called, rather than assuming it happened.",
      },
      {
        question: "Who should be performing CPR, AED, and first aid?",
        options: [
          "Any Safety Team member, trained or not",
          "Only those trained and equipped for it; others support by managing the scene",
          "Bystanders chosen at random",
          "No one — always wait for EMS with no action",
        ],
        answer: 1,
        explanation:
          "Hands-on care is for trained, equipped volunteers. Untrained members support by clearing space, protecting privacy, and guiding EMS.",
      },
      {
        question: "Which is a correct first Safety Team action at a medical scene?",
        options: [
          "Broadcast the patient's name and condition on the open radio",
          "Move a seriously injured person immediately even if they're not in danger",
          "Clear space around the patient and protect their privacy",
          "Gather a crowd to watch",
        ],
        answer: 2,
        explanation:
          "Clear space and protect privacy. Don't move the seriously injured unless they're in immediate danger, and keep details off the open channel.",
      },
    ],
  },
  {
    slug: "sec-fire-hazmat",
    order: 8,
    title: "Fire, Smoke, Gas & HazMat Emergencies",
    subtitle: "Immediate building-safety concerns — evacuate, support responders, prevent re-entry.",
    icon: "🔥",
    estMinutes: 13,
    objectives: [
      "Recognize fire/smoke/gas/HazMat triggers and take first actions",
      "Support evacuation using the Fire Warden roles and safe egress",
      "Meet responders and prevent re-entry until it's cleared",
    ],
    sections: [
      {
        heading: "These are immediate concerns",
        body: "Fire, smoke, gas odor, carbon monoxide, and hazardous materials are IMMEDIATE concerns — they move fast and don't wait. Know the response before it happens: primary and secondary egress routes, rally points, where extinguishers and alarms are.\n\nRecognize the triggers: visible smoke or flame, the smell of gas, a CO alarm, a chemical spill or fumes, or a fire alarm activation. Treat them as real until proven otherwise.",
        tip: "Fire, gas, CO, and HazMat are immediate — there's no 'wait and see.' Act on the trigger, verify later.",
      },
      {
        heading: "First actions and the Fire Warden roles",
        body: "First Safety Team actions on a fire/smoke event: activate/confirm the alarm, report location, and begin supporting evacuation. CrossBridge assigns Fire Warden roles (the check-in monitor serves as Fire Warden for their area):\n\n- On an automatic alarm with no obvious danger, keep primary and secondary egress clear and await direction.\n- On a clear/present danger or an evacuation order, direct occupants to the correct egress, ensure restrooms are empty, and check classrooms after evacuation for full compliance.\n- Under NO CIRCUMSTANCES use the elevator during a fire evacuation.\n\nFor a gas odor or CO alarm, get people out and avoid ignition sources; for HazMat, keep people away from the material and let trained responders handle it. A false alarm is still treated as real until leadership/responders confirm otherwise.",
        tip: "Never the elevator in a fire evacuation. Primary and secondary egress on foot — and clear the restrooms, which people forget.",
      },
      {
        heading: "Support responders and prevent re-entry",
        body: "As the building empties, support children's areas during evacuation (kids move with their class, accounted for), meet and support responders, and guide them to the location.\n\nThen PREVENT RE-ENTRY. No one goes back in — for a forgotten item, to check on something, for any reason — until the Fire Department and church staff have declared the building safe. After a completed floor evacuation, the Fire Warden reports completion to the Pastor/Deacon stationed in the lobby.\n\nWhat NOT to do: don't fight anything beyond a small, contained fire you can safely handle with an extinguisher, don't investigate smoke or gas yourself, and don't let anyone re-enter early.",
        tip: "Bottom line — get out along known routes (never the elevator), account for children, guide responders, and let no one back in until it's officially cleared.",
      },
    ],
    quiz: [
      {
        question: "During a fire evacuation at CrossBridge, the elevator should be used…",
        options: [
          "For anyone in a hurry",
          "For the Safety Team only",
          "Under no circumstances",
          "Only on the second floor",
        ],
        answer: 2,
        explanation:
          "The Fire Evacuation Plan is explicit: under no circumstances use the elevator. Evacuate on foot via primary and secondary egress.",
      },
      {
        question: "When may people re-enter the building after a fire/smoke evacuation?",
        options: [
          "As soon as the smoke looks gone",
          "To grab a forgotten item, briefly",
          "Only after the Fire Department and church staff declare it safe",
          "Whenever a Safety Team member says so",
        ],
        answer: 2,
        explanation:
          "Prevent re-entry for any reason until the Fire Department and staff have cleared the building.",
      },
      {
        question: "How should a fire alarm that might be a false alarm be treated?",
        options: [
          "Ignored until someone confirms real fire",
          "As real until leadership/responders confirm otherwise",
          "As a drill, always",
          "As a reason to investigate the source yourself",
        ],
        answer: 1,
        explanation:
          "Treat the trigger as real and act; verify later. Don't investigate smoke or gas yourself.",
      },
    ],
  },

  // ── Chapter 4 · Shelter & Lockdown Protective Actions ─────────────────────
  {
    slug: "sec-weather-shelter",
    order: 9,
    title: "Severe Weather & Outside Hazards",
    subtitle: "Sheltering when the danger is outside — triggers, interior safe areas, and ending shelter.",
    icon: "🌪️",
    estMinutes: 12,
    objectives: [
      "Recognize shelter triggers and take first actions",
      "Move people to safe interior areas and control exterior movement",
      "Communicate during shelter and end it only on the right authority",
    ],
    sections: [
      {
        heading: "Shelter when outside is the danger",
        body: "Shelter is the protective action when the danger is OUTSIDE — severe weather (tornado, high wind, hail, lightning) or an outside hazard. Know the shelter plan before it happens: which interior rooms and hallways are the designated safe areas (away from windows and exterior walls).\n\nRecognize shelter triggers early: a warning issued, threatening sky, an outside hazard reported. First Safety Team actions are to alert your lead, begin moving people to interior safe areas, and control exterior movement.",
        tip: "Shelter = danger outside → move people inward. Safe areas are interior, away from glass and exterior walls.",
      },
      {
        heading: "Move people in, protect the vulnerable",
        body: "For a severe-weather shelter, move people into the designated interior safe areas and keep them there. For an outside hazard, the same principle — get people away from the exterior threat.\n\nControl exterior movement: no one goes out to look, move a car, or 'just check.' Support children's areas during shelter — kids stay accounted for and with their class in a safe area. Parking and exterior volunteers need to come inside too, and you'll help account for them.",
        tip: "The instinct to step outside 'just to see' is exactly what shelter prevents. Keep everyone in until it's ended.",
      },
      {
        heading: "Communicate, adapt, and end shelter properly",
        body: "Communication during shelter keeps people calm and coordinated: give simple, clear updates and route information to your lead. When conditions change, adapt — a worsening situation may become an evacuation or lockdown instead.\n\nEnding shelter is a decision made by competent authority, not by whoever gets restless first. Wait for the all-clear before moving people back to normal areas, and help restore orderly movement afterward.\n\nWhat NOT to do: don't send people outside to check conditions, don't end shelter on your own judgment, and don't leave children's areas unsupported.",
        tip: "Bottom line — danger outside means shelter inside; move people to interior safe areas, hold, and end only on the all-clear.",
      },
    ],
    quiz: [
      {
        question: "When is SHELTER the correct protective action?",
        options: [
          "When the danger is inside the building",
          "When the danger is outside (severe weather or an outside hazard)",
          "Only during a medical emergency",
          "Whenever the parking lot is full",
        ],
        answer: 1,
        explanation:
          "Shelter is for outside danger — move people into interior safe areas away from windows and exterior walls.",
      },
      {
        question: "A member wants to step outside during a tornado warning to move their car. What do you do?",
        options: [
          "Let them; it's their car",
          "Go with them to help",
          "Control exterior movement — keep them inside in the safe area",
          "Send several people out to move cars",
        ],
        answer: 2,
        explanation:
          "Control exterior movement during shelter. No one goes out to 'just check' or move a vehicle until shelter is ended.",
      },
      {
        question: "Who decides when shelter ends?",
        options: [
          "Whoever gets restless first",
          "Any Safety Team member individually",
          "Competent authority gives the all-clear",
          "The first person to reach a door",
        ],
        answer: 2,
        explanation:
          "Ending shelter is a decision by competent authority. Wait for the all-clear rather than ending it on your own judgment.",
      },
    ],
  },
  {
    slug: "sec-lockdown",
    order: 10,
    title: "Lockdown Conditions",
    subtitle: "Immediate interior threat — secure the space, use clear language, do not confront.",
    icon: "🔒",
    estMinutes: 13,
    objectives: [
      "Recognize lockdown triggers and take first actions",
      "Use the CrossBridge lockdown language and secure spaces per plan",
      "Call/confirm 911 when safe and cooperate with police on arrival",
    ],
    sections: [
      {
        heading: "Lockdown is for an immediate threat",
        body: "Lockdown is for an IMMEDIATE threat — typically a dangerous person inside or right at the building. Know the lockdown plan before it happens. At CrossBridge, the order for a building-wide lock-down is transmitted over the radio by repeating the word 'Lock-Down' three times — and after that order, NO further radio communication is made until the order to release is given.\n\nRecognize triggers: a violent or armed person, a credible immediate threat, or a direct lockdown order. First Safety Team actions: get people into secured spaces fast and stop movement.",
        tip: "'Lock-Down' × 3 on the radio starts it — then radio silence until release. That silence is a rule, not an accident.",
      },
      {
        heading: "Secure the space — the CrossBridge method",
        body: "Secure the space if it's safe to do so. The church's Armed Intruder plan is specific for classrooms and areas:\n\n- Lower the classroom blackout shade.\n- Install the high-security door lock, fully seated in the floor.\n- Gather children behind the door or in another safe zone in the room.\n- Maintain quiet and order.\n- If someone is injured inside, DO NOT OPEN THE DOOR — provide first aid as able and wait for emergency personnel.\n\nThe Lock-Down Monitor (the check-in monitor) secures their area's high-security locks and shades, secures the master attendance report, keeps the check-in radio, and shelters in place (e.g., room #214 on the second floor). Open areas require fast decisions — get to a securable space or, if none, follow the immediate-threat guidance in the next chapter.",
        tip: "Secured space = shade down, high-security lock seated, children in a safe zone, quiet. Do not open the door — even for an injury.",
      },
      {
        heading: "Do not investigate — call 911, cooperate with police",
        body: "The hardest discipline of lockdown: DO NOT INVESTIGATE OR CONFRONT. Your job is to protect people and secure space — not to find or engage the threat.\n\nCall or confirm 911 when it's safe to do so, and report only what is known (location, description, what you saw) without guessing. When police arrive, cooperate fully: follow their commands exactly, keep hands visible, and don't be mistaken for the threat. Ending lockdown is done only by competent authority / the release order.\n\nWhat NOT to do: don't investigate, don't confront, don't break radio silence after the lock-down order, and don't open a secured door until released.",
        tip: "Bottom line — secure people and space, never hunt the threat, call/confirm 911 when safe, and release only on the order.",
      },
    ],
    quiz: [
      {
        question: "How is a building-wide lock-down ordered at CrossBridge, and what follows?",
        options: [
          "A single announcement, then normal radio chatter continues",
          "Repeating 'Lock-Down' three times on the radio — then no further radio comms until release",
          "Pulling the fire alarm",
          "A text message only",
        ],
        answer: 1,
        explanation:
          "The order is 'Lock-Down' repeated three times over the radio, after which no further radio communication is made until the release order.",
      },
      {
        question: "Someone is injured inside a secured classroom during lockdown. What does the plan say?",
        options: [
          "Open the door to get them help",
          "Do NOT open the door — provide first aid as able and wait for emergency personnel",
          "Evacuate the whole room immediately",
          "Radio for a medic on the open channel",
        ],
        answer: 1,
        explanation:
          "During lockdown, do not open the door even for an injury. Provide first aid within the room and await responders.",
      },
      {
        question: "What is the Safety Team's role toward the threat during a lockdown?",
        options: [
          "Locate and confront the threat",
          "Investigate where it came from",
          "Do not investigate or confront — protect people, secure space, and call/confirm 911 when safe",
          "Follow the threat through the building",
        ],
        answer: 2,
        explanation:
          "This is not tactical training. Never investigate or confront — secure people and space and let police handle the threat.",
      },
    ],
  },

  // ── Chapter 5 · Disruptive, Suspicious & Child Accountability ─────────────
  {
    slug: "sec-disruptive",
    order: 11,
    title: "Disruptive Person Response",
    subtitle: "Early coordination, calm first contact, redirect without arguing, and protect people nearby.",
    icon: "🗣️",
    estMinutes: 12,
    objectives: [
      "Sort disruption into the three response categories",
      "Keep first contact simple and redirect without arguing",
      "Call support early and know when to call 911",
    ],
    sections: [
      {
        heading: "Start with observable behavior",
        body: "A disruptive person requires early coordination — loop in the right people before it grows. Start with OBSERVABLE BEHAVIOR, not assumptions about who someone is or why they're acting up. Describe what they're doing.\n\nUse three response categories (the same frame as the whole curriculum): NORMAL (routine, monitor), ESCALATING (disruptive but not dangerous — redirect and involve a leader), IMMEDIATE (danger to people — protect and call 911). Most disruptions live in the middle category.",
        tip: "Judge behavior you can see, not the person you assume. 'Standing and shouting during the sermon' is reportable; 'seems like trouble' is not.",
      },
      {
        heading: "First contact and redirection",
        body: "Keep the first contact simple and low-key. A calm greeting and a simple offer ('Can I help you find a seat?') resolves many situations without escalation. Use space wisely — give the person room, keep an exit for both of you, don't corner them.\n\nRedirect WITHOUT arguing. You're not there to win a debate or correct their theology — you're there to reduce disruption and protect worship. If a first, calm attempt doesn't work, don't keep engaging: call support early and involve the right leader (a pastor/deacon for a member situation, for example).",
        tip: "Don't argue and don't corner. Offer a calm redirect once; if it doesn't land, call support rather than pressing the point.",
      },
      {
        heading: "Protect people, involve children carefully, know the 911 line",
        body: "Protect people nearby: position yourself between the disruption and vulnerable people, and keep a calm buffer. When children are involved (theirs or nearby), take extra care and involve Kids Ministry.\n\nCall 911 when there's a threat of violence, a weapon, a crime in progress, or the person won't leave and is endangering others. If the person leaves on their own, that can be a good outcome — note description and direction and report it; don't chase.\n\nWhat NOT to do: don't argue, don't touch or physically remove someone, don't corner them, and don't handle a violent situation yourself — that's a 911 and protect-people situation.",
        tip: "Bottom line — observe behavior, keep first contact simple, redirect without arguing, call support early, and escalate to 911 when there's real danger.",
      },
    ],
    quiz: [
      {
        question: "What should the FIRST contact with a disruptive person look like?",
        options: [
          "A firm order to leave immediately",
          "A calm, simple, low-key greeting or offer of help",
          "Physically guiding them out",
          "A debate about their behavior",
        ],
        answer: 1,
        explanation:
          "Keep first contact simple and calm. A low-key offer resolves many situations; if it doesn't, call support rather than escalating yourself.",
      },
      {
        question: "A calm redirect isn't working. What's the right next step?",
        options: [
          "Keep arguing until they agree",
          "Corner them so they can't move",
          "Call support early and involve the right leader",
          "Physically remove them",
        ],
        answer: 2,
        explanation:
          "Redirect without arguing, and if it doesn't land, call support early. Don't argue, corner, or physically remove.",
      },
      {
        question: "The disruptive person walks out of the building on their own. You should…",
        options: [
          "Chase them to continue the conversation",
          "Note their description and direction and report it — don't chase",
          "Physically detain them at the door",
          "Do nothing at all and forget it",
        ],
        answer: 1,
        explanation:
          "If the person leaves, that can be a fine outcome. Record description and direction and report it; don't pursue.",
      },
    ],
  },
  {
    slug: "sec-suspicious",
    order: 12,
    title: "Suspicious Activity & Unusual Behavior",
    subtitle: "Observable concern — what to notice, reporting the pattern, and avoiding profiling.",
    icon: "👁️",
    estMinutes: 12,
    objectives: [
      "Define suspicious activity as observable concern, not a hunch about a person",
      "Notice behavior, access, movement, and context — and report the pattern early",
      "Handle unattended items and avoid profiling and overreach",
    ],
    sections: [
      {
        heading: "Suspicious activity means observable concern",
        body: "Suspicious activity is about OBSERVABLE CONCERN, not a feeling about who someone is. Notice behavior, access, movement, and context together. What to notice:\n\n- BEHAVIOR out of step with the setting (fixation on doors/children's areas, concealment, scouting).\n- ACCESS attempts at restricted or unusual points.\n- MOVEMENT against the normal flow or into off-limits areas.\n- CONTEXT that makes the above stand out.\n\nSort it like everything else: normal, escalating, or immediate protection.",
        tip: "It's a pattern of observable facts — behavior + access + movement + context — not a single trait or a gut feeling.",
      },
      {
        heading: "Report early, handle items and children carefully",
        body: "Start with a ministry-facing contact when appropriate — a warm greeting can both help a guest and resolve a concern. Report early when the pattern matters; you don't need certainty to tell a lead 'here's what I'm seeing.'\n\nFor a SUSPICIOUS ITEM or unattended bag: don't touch, move, or open it — keep people back and report it. Suspicious activity near children raises urgency immediately — involve Kids Ministry and a lead. Suspicious activity outside the building (someone scouting the lot or perimeter) is reportable too.",
        tip: "Unattended bag? Don't touch it, don't move it. Keep people back and report — that's the whole procedure.",
      },
      {
        heading: "Avoid profiling; preserve useful information",
        body: "Avoid profiling and overreach. Base concern on behavior and observable facts — never on race, dress, disability, or 'not looking like they belong.' The goal is to be welcoming to everyone while staying alert to genuine warning signs.\n\nWhen suspicion becomes immediate risk, shift to protect-and-escalate. Preserve useful information: description, location, time, direction of travel, vehicle if relevant — accurate facts help responders far more than adjectives.\n\nWhat NOT to do: don't profile, don't confront or interrogate, don't touch suspicious items, and don't let 'just a hunch' turn into treating a guest as a suspect.",
        tip: "Bottom line — report observable patterns early, never profile, don't touch suspicious items, and preserve accurate facts.",
      },
    ],
    quiz: [
      {
        question: "Suspicious activity is best defined as…",
        options: [
          "Anyone who looks like they don't belong",
          "A pattern of observable concern — behavior, access, movement, and context",
          "A gut feeling about a stranger",
          "Someone dressed differently than usual",
        ],
        answer: 1,
        explanation:
          "It's observable concern — behavior, access, movement, and context together — not a trait or a hunch about a person.",
      },
      {
        question: "You find an unattended bag in the lobby. What's the procedure?",
        options: [
          "Open it to check the contents",
          "Move it to lost-and-found",
          "Don't touch or move it — keep people back and report it",
          "Ignore it",
        ],
        answer: 2,
        explanation:
          "Don't touch, move, or open a suspicious item. Keep people back and report — that's the entire procedure.",
      },
      {
        question: "What must concern always be based on?",
        options: [
          "Race, dress, or disability",
          "Whether someone 'looks like they belong'",
          "Observable behavior and facts — never profiling",
          "The opinion of the loudest volunteer",
        ],
        answer: 2,
        explanation:
          "Avoid profiling and overreach. Base every concern on observable behavior and facts so the church stays welcoming to all.",
      },
    ],
  },
  {
    slug: "sec-missing-child",
    order: 13,
    title: "Missing Child & Reunification Support",
    subtitle: "Immediate accountability — control exits, coordinate the search, verify custody.",
    icon: "🧒",
    estMinutes: 13,
    objectives: [
      "Treat a missing child as an immediate coordination problem",
      "Control exits and support a coordinated search",
      "Verify authorized pickup and support controlled reunification",
    ],
    sections: [
      {
        heading: "Accountability comes first",
        body: "A missing child is an IMMEDIATE coordination problem — not a wait-and-see. Accountability comes first: the priority is accounting for the child, quickly and calmly.\n\nFirst actions: alert your lead and Kids Ministry, get a clear description (name, age, clothing, last seen where/when), and start coordinating. Make the report clear and specific — a good description is the single most useful thing you can provide.",
        tip: "The clock matters. A missing child is immediate — get the description out and start controlling exits right away.",
      },
      {
        heading: "Control exits, coordinate the search",
        body: "Control exits and movement: covering the doors quickly reduces the chance a child leaves or is taken from the building. Search support must stay COORDINATED — a scattered, everyone-runs-everywhere search misses areas and loses track of who's checked what. Work assigned areas and report back.\n\nKids Ministry leads the child-information side (who the child is, who's authorized to have them). Contact the parent/guardian per church policy. Be alert to an unauthorized pickup or custody situation — that changes the response and may require police.",
        tip: "Cover the exits first, then search in a coordinated pattern. Unmanaged searching lets a child slip through an uncovered door.",
      },
      {
        heading: "When it becomes 911, and controlled reunification",
        body: "A missing child becomes a 911 call when the child can't be found after an initial coordinated search, when there's any sign of an abduction, or when an unauthorized-custody situation arises. Don't delay 911 out of hope it'll resolve itself.\n\nIf the child is found, confirm identity and reunify through the church's controlled release process — matching child to authorized guardian, not just handing off to whoever's nearby. Accountability reports (check-in/check-out records) help confirm who belongs with whom. Reunification is a controlled release, not a scramble.\n\nWhat NOT to do: don't downplay it, don't release a child to an unverified adult, and don't run an uncoordinated search.",
        tip: "Bottom line — immediate coordination, control exits, search in a pattern, verify custody, and reunify through controlled release.",
      },
    ],
    quiz: [
      {
        question: "How should a missing-child report be treated?",
        options: [
          "As a wait-and-see situation",
          "As an immediate coordination problem — account for the child now",
          "As a lost-and-found matter",
          "As something only the parents handle",
        ],
        answer: 1,
        explanation:
          "A missing child is immediate. Accountability comes first — get a clear description out and begin coordinating right away.",
      },
      {
        question: "What is the value of controlling exits early?",
        options: [
          "It looks organized",
          "It reduces the chance the child leaves or is taken from the building while the search runs",
          "It replaces the need to search",
          "It has no real benefit",
        ],
        answer: 1,
        explanation:
          "Covering doors quickly limits how the child could leave, while a coordinated search covers the interior systematically.",
      },
      {
        question: "The child is found. How should reunification happen?",
        options: [
          "Hand the child to whoever is closest",
          "Release the child only to a verified, authorized guardian through the controlled release process",
          "Let the child leave on their own",
          "Announce the child's name publicly and move on",
        ],
        answer: 1,
        explanation:
          "Reunification is a controlled release — verify identity and authorized custody using check-in/out records before handing off.",
      },
    ],
  },

  // ── Chapter 6 · Immediate Threat Handoff & Recovery ──────────────────────
  {
    slug: "sec-violent-intruder",
    order: 14,
    title: "Violent Intruder & Immediate Threat",
    subtitle: "Immediate protection — lockdown or evacuate, do not move toward the threat, hand off to police.",
    icon: "🚨",
    estMinutes: 14,
    objectives: [
      "Recognize immediate-threat indicators and choose lockdown vs. evacuate",
      "Protect people using secure spaces or safe egress — never engage the threat",
      "Call/confirm 911, report status when safe, and cooperate on police arrival",
    ],
    sections: [
      {
        heading: "Immediate threat requires immediate protection",
        body: "An immediate threat — a violent or armed intruder — requires immediate PROTECTION of people. This is NOT tactical training. Your job is to protect people and get them to safety, never to engage.\n\nRecognize the indicators: a weapon, active violence, or a credible, present threat to life. The decision between LOCKDOWN and EVACUATE depends on conditions: lock down and secure if the threat is between you and the exits; evacuate along a safe route away from the threat if you have one.",
        tip: "Two protective options: secure (lockdown) or get away (evacuate). Which one depends entirely on where the threat is relative to your exits.",
      },
      {
        heading: "Secure space or open area — act to protect",
        body: "Use direct emergency language — plain, urgent words, not codes people have to interpret. Then act for your situation:\n\n- NEAR A SECURE SPACE — get people in, secure it (shade down, high-security lock seated), quiet, away from the door. Do not open it.\n- IN AN OPEN AREA — make fast decisions to move people away from the threat toward a safe exit or securable space; use distance and barriers.\n- CHILDREN'S AREAS — follow the lockdown method; keep kids secured and accounted for.\n- PARENTS — during an immediate threat, uncontrolled parent movement toward children can add danger; direct calmly per plan.\n\nCall or confirm 911 when it's safe, and DO NOT move toward the threat for any reason.",
        tip: "Direct language saves seconds: 'Lock this door now, get behind me, stay down' beats any code word when lives are at stake.",
      },
      {
        heading: "Handoff to police and the start of recovery",
        body: "Report status when it's safe — location, number of people, any injuries, what you know of the threat — without guessing or breaking a lockdown's radio silence prematurely.\n\nWhen police arrive, cooperate completely: follow commands exactly, keep hands visible and empty, and don't do anything that could make them mistake you for the threat. When an all-clear is given by authority, recovery begins — controlled movement, accounting for people, and supporting the shift into the recovery phase covered in the final module.\n\nWhat NOT to do: don't move toward or confront the threat, don't play hero, don't break secure-space discipline, and don't approach police with anything in your hands.",
        tip: "Bottom line — protect people (secure or evacuate), never engage, call/confirm 911, and hand off cleanly to police with hands visible.",
      },
    ],
    quiz: [
      {
        question: "What determines whether you lock down or evacuate during a violent-intruder threat?",
        options: [
          "Personal preference",
          "Conditions — mainly where the threat is relative to your exits",
          "Always evacuate, no matter what",
          "Always lock down, no matter what",
        ],
        answer: 1,
        explanation:
          "Lock down and secure if the threat is between you and the exits; evacuate along a safe route away from the threat if you have one.",
      },
      {
        question: "This module is explicit that immediate-threat response is…",
        options: [
          "Tactical training to engage the intruder",
          "NOT tactical training — protect people and never engage the threat",
          "A reason to search for the intruder",
          "Only for trained security guards to attempt disarmament",
        ],
        answer: 1,
        explanation:
          "This is not tactical training. The role is to protect people and get to safety — never to move toward or engage the threat.",
      },
      {
        question: "Police arrive during the response. How do you interact with them?",
        options: [
          "Run toward them to explain, hands full of your radio and phone",
          "Follow their commands exactly, keep hands visible and empty, and don't be mistaken for the threat",
          "Ignore them and keep managing the crowd",
          "Argue about who's in charge",
        ],
        answer: 1,
        explanation:
          "Cooperate fully: follow commands, keep hands visible and empty, and avoid any action that could make police mistake you for the threat.",
      },
    ],
  },
  {
    slug: "sec-recovery",
    order: 15,
    title: "Leadership, Responders, Documentation & Recovery",
    subtitle: "After the loudest part — clean handoffs, factual documentation, reunification, and debrief.",
    icon: "📝",
    estMinutes: 14,
    objectives: [
      "Support leadership and give clean handoffs to EMS, police, and fire",
      "Run controlled reunification and re-entry",
      "Document factually and debrief to improve",
    ],
    sections: [
      {
        heading: "The response isn't over when the loud part ends",
        body: "The response is not over when the loudest part is over. Recovery is still the response, and it has its own discipline. Stay in your operating lane during recovery — leadership makes leadership decisions (communications, closing the building, releasing information); your job is to support them with useful, factual information.\n\nGive leadership what helps: what you saw, where, who's accounted for, what's still open. Clear, factual updates let leaders decide well.",
        tip: "Recovery has a lane too. Feed leadership facts; let leadership make the leadership calls.",
      },
      {
        heading: "Clean responder handoffs",
        body: "Working with emergency responders means giving a CLEAN handoff — organized, factual, brief. Each responder type needs slightly different information:\n\n- EMS HANDOFF — patient location, what happened, what care was given, number of patients.\n- POLICE HANDOFF — threat description, last known location/direction, witnesses, what you observed.\n- FIRE HANDOFF — location and nature of fire/smoke/hazard, whether the building is evacuated, who may still be inside.\n\nPreserve privacy during handoff — give responders what they need without broadcasting sensitive details to bystanders.",
        tip: "A clean handoff is factual and brief: what, where, who, and what's been done — not a story or a guess.",
      },
      {
        heading: "Reunification, documentation, and debrief",
        body: "Children's accountability requires special discipline in recovery. Reunification is a CONTROLLED RELEASE — verified guardian to verified child, using clear language, never a scramble. Control closed areas and re-entry: keep people out of areas that responders or leadership have closed until they're cleared.\n\nPreserve useful information and complete an AFTER-ACTION / incident report that is FACTUAL — what happened, when, what was done — not opinion or blame. Support people after the event; a safety incident affects people emotionally. Finally, debrief and improve: honest review is how the team gets better for next time.\n\nWhat NOT to do: don't speculate in documentation, don't release children without verification, don't reopen closed areas early, and don't skip the debrief.",
        tip: "Bottom line — support leadership, hand off cleanly, reunify through controlled release, document facts, and debrief to improve.",
      },
    ],
    quiz: [
      {
        question: "During recovery, what is the Safety Team's relationship to leadership?",
        options: [
          "Make the communications and building-closure decisions yourself",
          "Stay in your lane and support leadership with useful, factual information",
          "Leave once the loud part is over",
          "Release information to the public directly",
        ],
        answer: 1,
        explanation:
          "Leadership makes leadership decisions; the team supports them with clear facts. Recovery is still the response and has its own lane.",
      },
      {
        question: "What makes a good responder handoff (EMS, police, or fire)?",
        options: [
          "A long, detailed story with your theories",
          "Clean, factual, and brief — what, where, who, and what's been done",
          "Whatever bystanders overheard",
          "Withholding information until asked repeatedly",
        ],
        answer: 1,
        explanation:
          "Handoffs are organized, factual, and brief, tailored to what that responder needs, while preserving privacy from bystanders.",
      },
      {
        question: "How should the incident / after-action report be written?",
        options: [
          "As opinion and blame",
          "Factually — what happened, when, and what was done",
          "As a dramatic narrative",
          "Not at all; documentation isn't needed",
        ],
        answer: 1,
        explanation:
          "Documentation is factual — events, timing, and actions taken — not speculation or blame. It supports honest debrief and improvement.",
      },
    ],
  },
];

/**
 * The safety curriculum, with each module's source slide deck attached from
 * lib/safety-slides.ts (keyed by slug). Modules without slides are unchanged.
 */
export const safetyCurriculum: Module[] = safetyCurriculumBase.map((m) => {
  const slides = safetySlides[m.slug];
  return slides && slides.length ? { ...m, slides } : m;
});

/** Total number of safety modules — handy for progress math. */
export const SAFETY_TOTAL_MODULES = safetyCurriculum.length;

/** Look up a safety module by its slug. */
export function getSafetyModule(slug: string): Module | undefined {
  return safetyCurriculum.find((m) => m.slug === slug);
}

/** Ordered list of safety slugs for prev/next navigation. */
export const safetyModuleOrder = safetyCurriculum
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((m) => m.slug);

/**
 * Safety training phases — the six chapters of the source deck, grouped so a
 * volunteer works through them a chapter at a time. Edit the groupings here;
 * the /safety page renders whatever this defines.
 */
export const safetyPhases: TrainingPhase[] = [
  {
    id: "sec-operating-framework",
    name: "Operating Framework",
    tagline: "Who we are, the lane we work in, reading situations, and reporting clearly.",
    moduleSlugs: [
      "sec-team-framework",
      "sec-pre-service",
      "sec-changes-escalate",
      "sec-reports-comms",
    ],
  },
  {
    id: "sec-access-movement",
    name: "Access & Movement Support",
    tagline: "Support controlled access and safe movement in real time.",
    moduleSlugs: ["sec-access-control", "sec-movement"],
  },
  {
    id: "sec-medical-lifesafety",
    name: "Medical & Building Life Safety",
    tagline: "Medical emergencies and fire/smoke/gas/HazMat response.",
    moduleSlugs: ["sec-medical", "sec-fire-hazmat"],
  },
  {
    id: "sec-shelter-lockdown",
    name: "Shelter & Lockdown Protective Actions",
    tagline: "Shelter from outside danger and lock down against an inside threat.",
    moduleSlugs: ["sec-weather-shelter", "sec-lockdown"],
  },
  {
    id: "sec-disruptive-child",
    name: "Disruptive, Suspicious & Child Accountability",
    tagline: "Disruptive people, suspicious activity, and missing-child response.",
    moduleSlugs: ["sec-disruptive", "sec-suspicious", "sec-missing-child"],
  },
  {
    id: "sec-threat-recovery",
    name: "Immediate Threat Handoff & Recovery",
    tagline: "Violent-intruder protection, clean responder handoffs, and recovery.",
    moduleSlugs: ["sec-violent-intruder", "sec-recovery"],
  },
];

/**
 * Resolve `safetyPhases` to their module objects, in phase order. Any module
 * not assigned to a phase is appended in a trailing group so a newly added
 * module can never silently disappear from the curriculum view.
 */
export function getSafetyPhases(): ResolvedPhase[] {
  const assigned = new Set<string>();
  const resolved: ResolvedPhase[] = safetyPhases.map((phase) => {
    const modules = phase.moduleSlugs
      .map((slug) => getSafetyModule(slug))
      .filter((m): m is Module => Boolean(m));
    modules.forEach((m) => assigned.add(m.slug));
    return { ...phase, modules };
  });

  const orphans = safetyCurriculum
    .filter((m) => !assigned.has(m.slug))
    .sort((a, b) => a.order - b.order);
  if (orphans.length) {
    resolved.push({
      id: "sec-more",
      name: "More Modules",
      tagline: "Additional modules not yet assigned to a chapter.",
      moduleSlugs: orphans.map((m) => m.slug),
      modules: orphans,
    });
  }
  return resolved;
}

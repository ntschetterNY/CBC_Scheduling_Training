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
    estMinutes: 9,
    objectives: [
      "State the mission and posture of the CrossBridge Safety Team",
      "Describe the operating lane — what the team does and does not do",
      "Apply the Observe → Support → Report → Escalate action pattern",
    ],
    sections: [
      {
        heading: "Safety Team Essentials",
        body: "Practical, role-correct readiness training for church Safety Team members - built around one question: What does a reliable Safety Team member do next?\n\n- Not Law Enforcement: This is not tactical or security officer training.\n- Not Medical Training: This is not CPR, AED, or clinical care.\n- Role-Correct Readiness: Designed to help you function reliably inside your church safety role.",
      },
      {
        heading: "The Operating Lane",
        body: "The Safety Team lane is active, disciplined, and bounded. You are there to serve the ministry - keeping people, information, access, movement, and emergency response coordinated.\n\nWhat You Are NOT:\n\n- Taking over the church\n- Creating fear or tension\n- Acting as law enforcement\n- Operating freelance\n\nWhat You ARE:\n\n- Noticing what is changing\n- Reporting clearly and early\n- Supporting the right response\n- Staying connected to leadership and the team",
      },
      {
        heading: "What Safety Team Members Support",
        body: "You are not responsible for doing everything. You are responsible for doing your part well. That is what makes the team dependable.\n\n- Safety Posture: Maintain church readiness before an incident occurs.\n- Controlled Access: Direct entry, protect restricted and children's areas.\n- Clear Communication: Report observable facts; escalate concerns promptly.\n- Movement & Escalation: Direct people, support evacuation, and meet responders.\n- Recovery & Accountability: Document, reunify, and support the church after an incident.",
      },
      {
        heading: "The Action Pattern",
        body: "Every response begins with three disciplined steps. You don't need perfect certainty - you need clear, observable facts.\n\n- Notice: Observe behavior, access, or environment.\n- Report: State who, what, where, and risk.\n- Support: Coordinate response: redirect or call support.\n\nSupporting the response may mean staying in your assigned area, redirecting someone, calling for support, keeping a route clear, meeting responders, helping with accountability, or confirming that 911 has been called.",
      },
      {
        heading: "Safety Posture",
        body: "STARTING POINT\n\nSafety Posture is the church's normal operating readiness - before any emergency happens. Your job is to help that readiness hold together through small, consistent actions.\n\n- Correct a propped door: Or report it immediately.\n- Clear a blocked hallway: Or report it before service begins.\n- Redirect wrong-door entry: Calmly guide people to the right area.\n- Take volunteer concerns seriously: Early reporting prevents escalation.",
      },
      {
        heading: "Boundaries Keep the Role Useful",
        body: "Boundaries are not weakness. They keep the Safety Team useful, lawful, and role-correct.\n\nThis course does NOT qualify you in: firearms, restraint, defensive tactics, hands-on removal, medical care, CPR, AED, Stop the Bleed, tactical response, or law enforcement functions. Those capabilities require qualified instruction, written policy, and leadership oversight.\n\nWhat You Do Not Do:\n\n- Pursue, detain, or restrain people\n- Search people or bags\n- Clear rooms or physically remove people\n- Use force as part of this training\n- Act as law enforcement\n\nWhen a situation exceeds your role: report, escalate, move people away from danger, call or confirm 911, and hand off to the proper authority.",
      },
      {
        heading: "Staying in the Lane Means Acting - Not Standing Still",
        body: "Your lane is bounded, not passive. Both extremes are dangerous: the person who ignores limits, and the person who hides behind them.\n\n- Reckless (NO): Acting outside your role, freelancing, using force without authority.\n- Reliable (YES): Notice early. Report clearly. Redirect within role. Support response. Call 911 when needed.\n- Passive (NO): Hiding behind limits, failing to act when action is clearly needed.\n\nSafety Team Essentials rejects both problems. The goal is disciplined action - doing the right thing, at the right time, inside the right role.",
        tip: "The goal is disciplined action - doing the right thing, at the right time, inside the right role.",
      },
      {
        heading: "Bottom Line",
        body: "\"What does a reliable Safety Team member do next - inside their role?\"\n\n- 01 Notice Early: Spot behavior, access, and environmental changes before they escalate.\n- 02 Report Clearly: Observable facts - who, what, where, risk, action needed.\n- 03 Support Access & Movement: Keep routes clear, redirect people, maintain assigned areas.\n- 04 Escalate & Call 911: When the threshold is met, confirm help is on the way.\n- 05 Support Recovery: Help the church document, reunify, and recover after the incident.",
        tip: "A reliable Safety Team member notices early, reports clearly, supports access and movement, escalates and calls 911, and supports recovery - all inside their role.",
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
    estMinutes: 14,
    objectives: [
      "Complete a pre-service readiness check before doors open",
      "Confirm your assignment, communications, and access points",
      "Establish what 'normal' looks like so you can spot what changes",
    ],
    sections: [
      {
        heading: "Start Ready",
        body: "Pre-service readiness is what the Safety Team does before the building fills with people. Coverage means staying assigned, positioned, available, and connected throughout ministry activity. The goal is simple: start from strength.\n\n- Know Your Post: Assigned, not wandering\n- Communicate: Connected before it matters\n- Correct Early: Small problems, before they grow\n- Report Up: Larger concerns reach the right person",
        tip: "The goal is simple: start from strength.",
      },
      {
        heading: "Know Your Assignment",
        body: "Before you look around, know what you are responsible for. Your assignment defines the area, people, access points, movement patterns, and concerns you own. Readiness is not random movement.\n\n- Know Where You're Supposed to Be: Entrance, lobby, hallway, children's area, parking, medical support, or responder access - your post is specific.\n- Know Who You Report To: Identify your Safety Team lead and the right leader for your area before anything happens.\n- Know What Would Make Your Area Unsafe: Unmanaged access, blocked routes, uncovered posts - picture the risk before it arrives.\n\nCoverage begins with discipline. A team member who wanders without purpose may miss the actual responsibility.",
        tip: "Coverage begins with discipline. A team member who wanders without purpose may miss the actual responsibility.",
      },
      {
        heading: "Check Communication First",
        body: "Do not wait until something happens to discover your radio is dead, your phone is on silent, or nobody knows who to call. Confirm your communication method is working before service begins.\n\n- Radio: charged, on, correct channel, and tested\n- Phone/app: confirmed and not on silent\n- Know how to reach the Safety Lead, children's ministry, and medical support\n- Know who receives your reports\n\nCommunication failure is a readiness failure.",
        tip: "Communication failure is a readiness failure.",
      },
      {
        heading: "Check Access Points",
        body: "Not every door is a public entrance. Know which entrances are open, monitored, or restricted - and look for door problems before service begins.\n\nKnow the Entry Pattern Public entrances, children's ministry doors, staff access, accessibility routes, and late arrival points.\n\nSpot Door Problems Propped open, not latching, wedged, damaged, taped, or crash bar blocked.\n\nCorrect or Report Fix what fits your role. Report anything affecting access, life safety, or building function.\n\nDo NOT ignore door drift. Small door problems often become larger access problems.",
        tip: "Do NOT ignore door drift. Small door problems often become larger access problems.",
      },
      {
        heading: "Check Children's & Restricted Areas",
        body: "Children's and youth spaces require stronger access discipline. Your role is not to run children's ministry - your role is to support the boundary.\n\nBefore Service, Notice:\n\n- Check-in is set up and staffed\n- Classroom doors match church practice\n- Nearby hallways are not becoming open-access pathways\n- Adults approaching children's areas are following normal process\n\nAlso Watch Restricted Areas:\n\n- Offices and staff-only rooms\n- Storage, utility, and backstage spaces\n- Classrooms not in active use\n\nIf access is unclear or the normal process isn't being followed, report it early to the right leader.",
        tip: "Your role is not to run children's ministry - your role is to support the boundary.",
      },
      {
        heading: "Check Movement Routes",
        body: "During normal activity, people need clear movement. During an emergency, it matters even more.\n\nLook for:\n\n- Blocked exits, locked gates, or narrowed aisles\n- Misplaced furniture, cords, or temporary displays\n- Construction materials or slick floors\n- Crowding points near lobbies, stairways, or children's hallways\n\nConsider guests, older adults, children, and people with disabilities who may not know the building.\n\nThe process: Look - Scan exits, aisles, hallways for blockages. Ask - Would people move if conditions change? Correct - Fix what you can, report or escalate rest.\n\nMovement readiness is a practical question, not an engineering inspection. Ask it before every service.",
        tip: "Movement readiness is a practical question, not an engineering inspection. Ask it before every service.",
      },
      {
        heading: "Check Responder & Medical Readiness",
        body: "In an emergency, your role may be communication, space, access, and handoff. Prepare for that before the emergency happens.\n\nResponder Access Know which doors and driveways EMS, fire, and law enforcement may need. Check that fire lanes are clear of vehicles, trailers, and event equipment.\n\nKnow the Building Be ready to direct responders to the sanctuary, children's area, gym, classrooms, parking lot, or playground - confidently and quickly.\n\nMedical Support Know where the AED, first aid kit, and medical supplies are located. Know who the trained medical volunteers are and which entrance EMS should use.",
      },
      {
        heading: "Know What Normal Looks Like",
        body: "You cannot recognize abnormal well if you do not understand normal. Learn the rhythm of your church - not to create suspicion, but to notice when something has changed.\n\nPeople & Flow When do volunteers arrive? Where do guests enter? Where do people naturally bottleneck?\n\nAreas & Access Which areas are public? Which are restricted? Where do youth gather? Where do children check in?\n\nChanges to Watch Shifts in access, movement, behavior, environment, or timing may require action - even if they are not obviously threatening.",
        tip: "Learn the rhythm of your church - not to create suspicion, but to notice when something has changed.",
      },
      {
        heading: "Stay Visible, Not Intimidating",
        body: "Your presence should communicate: \"We are ready to help.\" - not \"We are looking for trouble.\"\n\n- People should be able to find you if they need help\n- Guests should not feel like they are walking through a security checkpoint\n- Children's workers should feel supported, not watched\n\nCoverage Does Not Mean Profiling You do not judge by appearance, clothing, disability, race, or familiarity. You notice behavior, access, movement, conditions, and context.",
        tip: "Your presence should communicate: \"We are ready to help.\" - not \"We are looking for trouble.\"",
      },
      {
        heading: "Avoid Coverage Gaps",
        body: "Coverage fails when team members drift. Two common failures undermine an otherwise ready team.\n\nClustering Two or three members gather in the same lobby, talk to each other, and leave other areas uncovered. Stay spread out and on post.\n\nCuriosity Drift A member sees activity elsewhere, becomes interested, and leaves the assigned area without telling anyone. That post is now exposed.\n\nIf you must leave your area, make sure someone knows - or another team member covers it. When handing off, share what is normal right now, what has changed, and any open concerns or instructions.",
        tip: "If you must leave your area, make sure someone knows - or another team member covers it.",
      },
      {
        heading: "Adjust During Transitions",
        body: "Do not assume one coverage pattern works the same all day. Good coverage adjusts without freelancing.\n\n- Before Service: Arrivals, check-in, parking flow, and early access concerns\n- During Service: Movement slows; hallways quiet; maintain post discipline\n- Dismissal: Families move, children release, exits get busy - highest accountability moment\n- Special Events: Normal entry patterns may change; re-confirm assignments and communication\n\nAsk: What is happening right now? What does my assignment need to support? What has changed? Who needs to know?",
        tip: "Good coverage adjusts without freelancing.",
      },
      {
        heading: "Correct, Report, Escalate",
        body: "When you find a concern, identify what kind it is - then respond at the right level.\n\n1. Simple Readiness Problem: Propped door, blocked hallway, low radio battery, chair in exit path. CORRECT it or REPORT it.\n\n2. Escalating Problem: Repeated locked-door attempts, unauthorized access to children's areas, custody concern, agitated person. REPORT early and call support.\n\n3. Immediate Protection: Fire, smoke, weapon concern, forced entry, violence, medical emergency, attempted abduction. Act IMMEDIATELY. Alert IMMEDIATELY. Confirm 911.",
        tip: "Identify what kind of concern it is - then respond at the right level.",
      },
      {
        heading: "Do Not Freelance",
        body: "Stay in your operating lane. The goal is not to act impressive - it is to keep the church ready, coordinated, and safe within role.\n\nDo Not:\n\n- Follow someone around the property without direction\n- Search bags, vehicles, or private areas\n- Confront someone just because something feels off\n- Diagnose motive or create alarm with dramatic language\n- Enter spaces you are not assigned to check\n\nDo:\n\n- Correct simple readiness problems\n- Report observable concerns\n- Call support early\n- Escalate when risk rises\n- Call or confirm 911 when the threshold is met\n\nReport it. Don't investigate it. Support is available - use it.",
        tip: "Report it. Don't investigate it. Support is available - use it.",
      },
      {
        heading: "Bottom Line: Pre-Service Readiness",
        body: "Ask these questions before every service or event. This is how a Safety Team member becomes dependable before the first problem ever appears.\n\n01. Assignment & Communication: What is my post? How do I communicate? Who do I report to?\n\n02. Access & Protected Areas: Which entrances are active? Are children's and restricted areas secured?\n\n03. Routes & Responder Access: Are movement routes usable? Is responder and medical access clear?\n\n04. Normal, Changes & Action: What does normal look like today? What has changed? What needs to be corrected, reported, or escalated?",
        tip: "This is how a Safety Team member becomes dependable before the first problem ever appears.",
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
    estMinutes: 17,
    objectives: [
      "Sort any situation into Normal, Escalating, or Immediate",
      "Name the factors that change the required action",
      "Escalate earlier when children or worsening conditions are involved",
    ],
    sections: [
      {
        heading: "Action Should Match the Situation",
        body: "A reliable Safety Team member does not react the same way to every concern. Escalation discipline means recognizing when the current level of response is no longer enough - then acting sooner, communicating better, and staying connected rather than isolated.\n\n- Some things are normal\n- Some things need a report\n- Some things need support\n- Some require 911 now",
      },
      {
        heading: "Use Three Categories",
        body: "Every situation fits one of three response categories. Ask: What category does this situation fit right now?\n\nNormal: Routine ministry activity. Greet, guide, observe, redirect when appropriate, and continue your assignment.\n\nEscalating: Unresolved, growing, or affecting access, movement, or vulnerable people. Report, call support, involve leadership, and prepare for a higher response.\n\nImmediate Protection: Life, violence, urgent medical danger, fire, forced entry, abduction, or weapon concern. Act immediately, alert immediately, protect people, and call 911.",
        tip: "What category does this situation fit right now?",
      },
      {
        heading: "Normal Does Not Mean Nothing Matters",
        body: "Normal conditions are routine ministry activity - people arriving, parents checking children in, volunteers moving between areas. Someone may be confused, emotional, or distracted. Not everything unusual is dangerous.\n\n- Your job is not to treat normal variation as danger.\n- Your job is to notice when behavior, access, movement, risk, or context changes enough that action is needed.",
        tip: "Not everything unusual is dangerous.",
      },
      {
        heading: "Access Changes Action",
        body: "- Confused guest at wrong entrance: Direction only - \"The main entrance is this way.\"\n\n- Propped side door: Correct it and report.\n\n- Multiple locked doors tried: Report and call support immediately.\n\n- Adult bypassing children's check-in: Faster escalation required.\n\n- Forced entry, weapon, or abduction: Call 911 now.",
        tip: "Escalate faster when access is repeated, challenged, forced, or connected to children's or restricted areas.",
      },
      {
        heading: "Movement Changes Action",
        body: "Movement becomes a concern when it no longer matches the setting, role, or expected response. You may redirect, report, hold position, or call support - but you do not force movement.\n\n- Child alone outside assigned area: Report immediately and notify the ministry leader.\n\n- Person moving toward restricted hallway after redirection: Call support. Do not repeat the same direction.\n\n- People stopping in exits during emergency: Use clear words, useful positioning, and coordination.\n\n- Vehicle blocking emergency access: Report and escalate - do not assume it will self-correct.",
        tip: "You do not force movement.",
      },
      {
        heading: "Behavior Changes Action",
        body: "A person may start calm and become agitated - refusing direction, raising his voice, using threatening language, or moving toward a vulnerable area. Do not diagnose. Report behavior.\n\n\"Adult male in the west lobby is refusing to leave the children's hallway entrance. He is raising his voice at the check-in worker. I need support now.\"",
        tip: "Escalate when behavior becomes louder, closer, faster, more threatening, or more connected to vulnerable areas. If threats or violence appear, call or confirm 911.",
      },
      {
        heading: "Refusal Changes the Situation",
        body: "A single misunderstanding may not be a major concern. Refusal is different. When someone argues, delays, challenges boundaries, or keeps moving after redirection - the situation has changed.\n\nUse one clear direction. Then shift to support and escalation. Do not repeat yourself six times hoping it works.\n\n1. Give one clear direction: \"I need you to stay in the lobby.\"\n\n2. If refused, report immediately: \"He has been directed to stay in the lobby and is refusing.\"\n\n3. Call support early: Refusal means the response becomes more coordinated.",
        tip: "Use one clear direction. Then shift to support and escalation.",
      },
      {
        heading: "Children and Vulnerable People Change Urgency",
        body: "A concern near children's ministry is not the same as a concern in an empty hallway. Do not wait for certainty.\n\nReport Early When You See: Unauthorized adult near classroom, custody concern, missing child, bypassed check-in, or vulnerable person separated from support.\n\nCall or Confirm 911 When: Child cannot be located quickly, forced removal is attempted, abduction is suspected, or immediate danger exists.\n\nYour Role: Protect the process. Report facts. Escalate quickly. Keep the right people involved. Do not investigate family situations.",
        tip: "Do not wait for certainty.",
      },
      {
        heading: "Location Changes Risk",
        body: "The same behavior creates different risk depending on where it happens. Location helps determine urgency - don't overreact, but don't ignore it.\n\n- Confused visitor in the lobby: Needs help and direction.\n\n- Confused visitor at restricted hallway: Needs redirection and reporting.\n\n- Frustrated parent in parking lot: May need assistance.\n\n- Frustrated parent forcing children's check-in: Requires immediate support.\n\nAsk: What is happening? Where is it happening? Who may be affected? What does this location protect? What could happen if this gets worse?",
        tip: "The same behavior creates different risk depending on where it happens.",
      },
      {
        heading: "Environmental and Medical Conditions Change Action",
        body: "Environmental Hazards: Fire alarm, smoke, gas odor, blocked exit, forced entry, icy walkway, vehicle blocking emergency access. Report - some require immediate escalation.\n\nMedical Emergencies: Collapse, chest pain, stroke symptoms, seizure, severe bleeding, or loss of consciousness. Call 911 early. Send for AED if assigned. Clear space. Direct EMS.\n\nYou are not diagnosing. You are recognizing that emergency medical or emergency safety response may be needed - and acting early enough to matter.\n\nWhen the condition affects life safety, emergency routes, or children's areas - report it. When it creates immediate danger - escalate immediately.",
        tip: "You are not diagnosing. You are recognizing that emergency response may be needed - and acting early enough to matter.",
      },
      {
        heading: "Fire, Hazardous Air, Weapons, and Threats Require Immediate Action",
        body: "Fire / Hazardous Air: Alert immediately. Move people away. Call 911. Do not send volunteers into danger. Prevent re-entry until proper all-clear.\n\nWeapon Concerns: Do not approach. Do not try to disarm. Do not create a confrontation. Report what was seen, who is involved, and where. Call 911 when weapon is present, displayed, or credibly reported.\n\nThreats: Do not assume it is a joke. Preserve the message. Report through the correct pathway. Call 911 when the threat involves violence, weapons, or immediate harm.",
      },
      {
        heading: "Volunteer Reports Can Change Action",
        body: "Greeters, ushers, children's workers, and ministry leaders may notice something before the Safety Team does. Do not dismiss a concern because you did not see it first.\n\n\"Thank you for telling me. Tell me who, what, where, and what is happening right now.\"\n\nThe volunteer does not need perfect safety language. Your job is to turn the report into clear, coordinated action - then push it through the team's communication pathway.",
        tip: "Do not dismiss a concern because you did not see it first.",
      },
      {
        heading: "Worsening Conditions Require Earlier Action",
        body: "Escalation is not only about one dramatic event. Sometimes escalation is a pattern. When the situation is trending in the wrong direction, act earlier - not after the worst version arrives.\n\n- Notice Trend\n- Report Facts\n- Call Support\n\nA reliable Safety Team member notices trajectory. Say what changed: \"He is louder now.\" \"She moved from the lobby to the children's hallway.\" \"The north exit is now blocked.\" That is useful information.",
        tip: "When the situation is trending in the wrong direction, act earlier - not after the worst version arrives.",
      },
      {
        heading: "The Correct Emergency Response Changes Action",
        body: "Evacuate: Leave the building and move to the correct assembly or reunification location.\n\nShelter: Stay inside or move to a safer interior location. Danger is outside or open movement is unsafe.\n\nLockdown: Secure from immediate threat. Reduce visibility. Remain quiet. Protect life. Call or confirm 911 when safe.",
        tip: "Do not assume Lockdown is always the answer. Do not assume Evacuate is always the answer. Action must match the current condition.",
      },
      {
        heading: "Leadership and Responders Change the Phase",
        body: "When Leadership Gives Direction: Support evacuation, shelter movement, controlled release, or area closure within your role. Do not create competing directions. If conditions make an instruction unsafe, report the facts immediately.\n\nWhen Responders Arrive: Meet them. Identify the location. Keep routes clear. Provide facts. Direct bystanders away. Prevent re-entry.\n\nOnce responders are on scene - do not compete. Support, hand off, and follow lawful direction.",
        tip: "Once responders are on scene - do not compete. Support, hand off, and follow lawful direction.",
      },
      {
        heading: "Recovery Is Still Part of the Response",
        body: "Do not assume the response is over because the situation is quieter. A reliable Safety Team member stays useful until released or reassigned.\n\n1. People accountability: Children need reunification. Individuals may need pastoral care.\n\n2. Area control: Rooms may need to remain closed. Hallways may need to stay clear. Responders may still need access.\n\n3. Documentation: Preserve information, identify witnesses, and help leadership with next steps.",
        tip: "A reliable Safety Team member stays useful until released or reassigned.",
      },
      {
        heading: "When Unsure, Report Early",
        body: "Early reporting does not mean panic. It means the system gets information while there is still time to act.\n\n\"I do not know his reason for being here. What I can report is that he tried two locked side doors, ignored the main entrance sign, and is now standing near the children's hallway.\"\n\n- Say what you know. Say what you don't know. Say what has changed. Say what you are doing.\n\n- If nobody acknowledges the report, escalate the message path - call directly, notify a leader face-to-face, or send another team member.\n\n- Call 911 yourself if the threshold is met and delay would increase risk. Do not wait while the situation worsens.",
        tip: "Early reporting does not mean panic. It means the system gets information while there is still time to act.",
      },
      {
        heading: "Bottom Line",
        body: "Action changes when risk changes. Your job is to notice the change, report clearly, support the coordinated response, escalate early, and call 911 when the threshold is met.\n\n- Normal observation\n- A report or call for support\n- Leadership notification\n- Evacuate / Shelter / Lockdown\n- 911\n- Responder handoff\n- Recovery support\n\nThe practical question is always: What does this situation require right now? That is disciplined Safety Team judgment.",
        tip: "The practical question is always: What does this situation require right now?",
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
    estMinutes: 14,
    objectives: [
      "Build a report that drives action: location, facts, current risk, action needed",
      "Use plain language and report facts, not labels",
      "Use the correct reporting pathway and protect privacy",
    ],
    sections: [
      {
        heading: "Clear Reports Help the Church Respond",
        body: "When something changes, the Safety Team needs facts - not drama, not guesses, not labels. A vague report creates delay. A clear report helps leaders decide what needs to happen next.\n\n- Who\n- What\n- Where\n- Risk\n- Action\n\nYour report does not need to be long. It needs to be useful. Clear communication creates clearer response.",
        tip: "Your report does not need to be long. It needs to be useful.",
      },
      {
        heading: "Communication Discipline",
        body: "Communication discipline means using your church's system in a way that helps the response - not hinders it. The tool may change. The discipline does not.\n\n- Clearly: Say exactly what is happening without ambiguity.\n- Briefly: Keep it short so others can act immediately.\n- Calmly: Tone shapes how the team receives the message.\n- Factually: Report what you observe, not what you assume.\n\nThe goal is to move the right information to the right person at the right time.",
        tip: "The goal is to move the right information to the right person at the right time.",
      },
      {
        heading: "Use Plain Language",
        body: "Do not use codes unless your entire team has been trained on them and uses them consistently. In most church environments, plain language is stronger.\n\nPlain language reduces confusion and helps everyone understand - without translating code under stress.\n\n- \"Medical emergency in the sanctuary center aisle.\"\n- \"Need Safety Team support at the west lobby.\"\n- \"Children's ministry reports a missing child from Room 204.\"\n- \"Law enforcement is arriving at the main entrance.\"",
        tip: "In most church environments, plain language is stronger.",
      },
      {
        heading: "Keep Messages Short",
        body: "A communication channel is not a conversation space during an active concern. Say what needs to be known - then stop talking so others can respond.\n\n\"Need Safety Team support at the west lobby. Adult male refusing direction near children's check-in.\"\n\nThat is enough to get help moving. Do not explain the whole history unless someone asks or the detail changes the action. During stress, short and factual works better than long and complete.",
        tip: "During stress, short and factual works better than long and complete.",
      },
      {
        heading: "Build the Report for Action",
        body: "- Who\n- What\n- Where\n- Risk\n- Action\n\nYou may not need every part in every quick message - but this pattern should shape how you communicate. A message built for action gives the team what it needs to move.\n\n\"Adult male in blue jacket is trying to enter the children's hallway without check-in. West lobby. Current risk is access bypass. I am redirecting and need support.\"",
        tip: "A message built for action gives the team what it needs to move.",
      },
      {
        heading: "Report Facts, Not Labels",
        body: "Don't Say / Say Instead\n\n- Don't Say: \"There's a crazy person in the lobby.\"\n- Say Instead: \"Adult male is yelling at the welcome desk volunteer and refusing to step back.\"\n\n- Don't Say: \"There's a suspicious woman near the children's wing.\"\n- Say Instead: \"Adult female near the children's hallway says she's looking for a child but doesn't know the classroom or last name.\"\n\n- Don't Say: \"That guy looks dangerous.\"\n- Say Instead: \"He has threatened to hurt the usher and is moving toward the sanctuary doors.\"\n\nLabels create confusion, bias, and unnecessary escalation. Facts help the team respond.",
        tip: "Facts help the team respond.",
      },
      {
        heading: "Include Location and Current Risk",
        body: "Be Specific With Location\n\n- \"West lobby\"\n- \"North exterior door\"\n- \"Children's check-in hallway\"\n- \"Sanctuary center aisle\"\n- \"South parking lot\"\n\nState the Current Risk Clearly\n\n- \"Access to children's ministry is being challenged.\"\n- \"The person is refusing direction and becoming louder.\"\n- \"The evacuation route is blocked.\"\n- \"The item is unclaimed near a main entrance.\"\n\nRisk means explaining what makes the situation matter right now - not guessing the worst outcome. Do not exaggerate. Do not minimize.",
        tip: "Risk means explaining what makes the situation matter right now - not guessing the worst outcome.",
      },
      {
        heading: "Say What Action Is Needed",
        body: "A report should tell people what action is needed - or what is already underway. Don't just say \"I need help.\" Be specific about what, where, and why.\n\n- \"I need another Safety Team member at the west lobby.\"\n- \"We need EMS at the south entrance.\"\n- \"The north exit is blocked - we need an alternate route.\"\n- \"I am keeping the hallway clear.\"\n\nThe more urgent the situation, the more direct the action language should be. A report without action may leave others guessing.",
        tip: "A report without action may leave others guessing.",
      },
      {
        heading: "Access Concern Report - Example",
        body: "\"Unknown adult male, gray hoodie, tried the north side door twice and is now standing near the children's hallway. Location is the north education wing entrance. Current risk is possible access bypass near children's ministry. I am staying in position and need a second team member.\"\n\nThat report is short, factual, and useful. It does not accuse. It does not guess motive. It gives the team enough to act.\n\nA weak report: \"There is a suspicious guy outside.\" - Sounds urgent. Not useful. Facts beat labels.",
        tip: "Facts beat labels.",
      },
      {
        heading: "Medical and Missing Child Reports",
        body: "Medical Report\n\n\"Adult woman collapsed in the center aisle of the sanctuary. She is conscious but weak. Location: sanctuary center aisle, halfway back. Risk: urgent medical need and crowding. We are calling 911, sending for the AED, and need someone to meet EMS at the main entrance.\"\n\nMissing Child Report\n\n\"Room 204 is missing one child, Caleb Johnson, age six. Last seen near the classroom door during pickup. Location: upper children's hallway. Risk: missing child during release. Children's ministry leader notified. We need exit awareness and leadership response now.\"\n\nA missing child report should never be casual. It should move quickly, clearly, and through the right people. The goal is coordination, not panic.",
        tip: "The goal is coordination, not panic.",
      },
      {
        heading: "Disruptive Person and Suspicious Item Reports",
        body: "Disruptive Person\n\n\"Adult male in the west lobby is refusing to leave the children's hallway entrance. Raising his voice at the check-in worker. Ignored two directions. Location: west lobby, outside children's check-in. Risk: escalation near a child-used area. Need Safety Team support and children's ministry leadership now.\"\n\nSuspicious Item\n\n\"Unclaimed black backpack near the main entrance, against the wall by the welcome desk. Several people nearby say it does not belong to them. Location: main lobby entrance. Risk: unclaimed item near active entry. We are keeping people away and need leadership to respond.\"\n\nBoth reports avoid guessing. Both state facts, location, risk, and action. That is the standard.",
        tip: "Both state facts, location, risk, and action. That is the standard.",
      },
      {
        heading: "Include Uncertainty - and Update When Things Change",
        body: "Avoid speculation. Do not guess motive, diagnosis, or whether something is dangerous without factual basis. Say what you know. Say what you don't. Then update the team when conditions change.\n\n- \"I do not know who placed the backpack. It is unclaimed, and we are keeping people away.\"\n- \"I have not confirmed whether 911 has been called.\"\n- \"I do not know where the child went after leaving the classroom.\"\n\nUpdate the team when: the person moves, condition worsens, the child is found, 911 is called, or responders arrive. A stale report can create wrong action.",
        tip: "A stale report can create wrong action.",
      },
      {
        heading: "Use the Right Pathway - and Protect the Channel",
        body: "Send Reports to the Right Person\n\nDo not tell three random people and assume the right leader heard it. Use the pathway your church has assigned. If an urgent report is not acknowledged - escalate. Call directly. Send a team member. Notify a leader face-to-face. Call 911 yourself if delay would increase risk.\n\nKeep the Channel Clear\n\nReserve emergency communication for:\n\n- Immediate danger or violent threat\n- Urgent medical need or fire/smoke\n- Missing child or forced entry\n- Emergency responder arrival\n\nNo routine updates, commentary, or side conversations on the channel. Communication discipline includes knowing when not to speak.",
        tip: "Communication discipline includes knowing when not to speak.",
      },
      {
        heading: "Protect Privacy",
        body: "Safety Team communication is not gossip. Do not broadcast unnecessary names, medical details, family conflict, custody information, or embarrassing details unless the information is needed for safety or handoff.\n\nMedical Emergency\n\nShare location, condition, and responder access. Not private medical history broadcast widely.\n\nCustody Concern\n\nThe right leaders may need specific names and restrictions. The whole volunteer group does not.\n\nShare what is needed with the people who need it. Protecting people includes protecting information.",
        tip: "Protecting people includes protecting information.",
      },
      {
        heading: "Bottom Line",
        body: "Who · What · Where · Risk · Action Use the pattern every time.\n\nPlain Language Short, factual, calm. No codes unless trained.\n\nFacts, Not Labels Avoid speculation. Include honest uncertainty.\n\nRight Pathway Escalate if urgent messages go unacknowledged.\n\nProtect Privacy Share only what is needed, with the right people.\n\nProtect the Channel Reserve it for urgent matters. Update when things change.\n\nThe practical question: What information does the right person need to act now? Not everything you know - the useful facts. Clear communication keeps the Safety Team disciplined, coordinated, and role-correct.",
        tip: "What information does the right person need to act now? Not everything you know - the useful facts.",
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
    estMinutes: 13,
    objectives: [
      "Support controlled access without physically blocking people",
      "Protect children's and restricted-area boundaries",
      "Correct door problems without creating new risks",
    ],
    sections: [
      {
        heading: "Welcoming, But Not Unmanaged",
        body: "Controlled access means the church has already decided where people enter, where they go, which areas are public, and which are protected. Your job is to support that process in real time.\n\nNot This Acting like a guard. Making guests feel inspected. Turning the church into a checkpoint.\n\nThis Controlled access is not suspicion - it is stewardship. Open, directed, and accountable.",
        tip: "Controlled access is not suspicion - it is stewardship.",
      },
      {
        heading: "Know the Normal Entry Pattern",
        body: "Before a problem occurs, every Safety Team member must know the plan. If the team is unclear, the church's access pattern becomes unclear.\n\n- Which doors are active? Public entrances, exit-only doors, staff and vendor access, accessibility routes, and children's ministry check-in points.\n\n- Which areas are monitored? Know which entrances are watched, which spaces are public, and which are protected before anyone arrives.\n\n- Where do responders enter? Know the responder access point in advance so support can be directed quickly and clearly when needed.",
      },
      {
        heading: "Watch for Access Drift",
        body: "Access drift happens when convenience becomes the real system - not policy. Most drift is not malicious, but repeated exceptions quietly change the system.\n\n- Propped Side Doors: A door left open during setup becomes an unmonitored entry point.\n\n- Informal Entry Points: A delivery entrance or volunteer shortcut becomes a casual public entrance.\n\n- Unguarded Hallways: A hallway near children's ministry becomes a shortcut if no one redirects traffic.\n\n- Your Role: Notice drift early. Correct simple problems within your role. Report larger concerns before unmanaged access becomes the new normal.",
        tip: "Access drift happens when convenience becomes the real system - not policy.",
      },
      {
        heading: "Start With Simple Direction",
        body: "Your first response to most access concerns is calm, clear direction - not suspicion, not confrontation. Most wrong-door situations are ordinary confusion. Treat them that way.\n\nControlled access must still sound like ministry. Clear direction resolves most concerns before any escalation is needed.\n\n- \"We use the main entrance. I'll help you get there.\"\n\n- \"This door is exit-only during service. The entrance is around the corner.\"\n\n- \"That hallway is for checked-in children and approved workers. Let me connect you with the right person.\"\n\n- \"This area is not open right now. I can help you find where you need to go.\"",
        tip: "Controlled access must still sound like ministry.",
      },
      {
        heading: "Tone Matters",
        body: "You can say the right words the wrong way. An irritated or suspicious tone can make a simple redirect harder than it needs to be.\n\nAvoid Arguing, lecturing, shaming a visitor for not knowing the building, or proving authority.\n\nAim For Calm, direct, respectful language that helps the person cooperate. Keep access warm, orderly, accountable, and safe.",
        tip: "You can say the right words the wrong way.",
      },
      {
        heading: "Refusal Changes the Situation",
        body: "A confused person may accept help. A person who refuses simple direction creates a different concern - the situation is no longer routine.\n\nGive Direction\n\nRefusal\n\nCall Support\n\nRefusal does not automatically mean danger, but it means the situation has moved beyond routine access management.\n\nExample Report \"Adult male at the north side door has been redirected twice to the main entrance and is refusing direction. He is still trying to enter through the side door. I need support.\"\n\nKeep your words simple. Report what happened - who, what, where, and what action you need.",
        tip: "Refusal does not automatically mean danger, but it means the situation has moved beyond routine access management.",
      },
      {
        heading: "Protect Children's & Youth-Area Boundaries",
        body: "Children's and youth areas require stronger access discipline. These are not open-access spaces. Adults should not enter outside the normal process, and children should not leave without proper supervision or release.\n\n1. Redirect Clearly: \"Children's ministry uses check-in for that area. Please wait here while we get the ministry leader.\"\n\n2. Support the Boundary: You do not take over children's ministry - you support the boundary, notify the right leader, and call for help when needed.\n\n3. Hold the Release Process: \"We cannot release a child here. Release happens through the approved process.\"\n\n4. Immediate Danger: If forced removal, attempted abduction, or violence is present - call or confirm 911 immediately.",
        tip: "Children's and youth areas require stronger access discipline.",
      },
      {
        heading: "Support Restricted Areas",
        body: "Not every restricted area carries the same risk, but public ministry space should not silently become open access to private or operational areas.\n\nRestricted areas include:\n\n- Offices & Counseling Rooms\n- Staff-Only Areas\n- Money-Handling Areas\n- Storage & Utility Rooms\n- Production & Mechanical\n- Volunteer-Only Spaces\n\nSupport boundaries through calm direction and leadership coordination - not confrontation.\n\n- Give clear direction if someone is in the wrong area.\n- Connect them with the right staff member if they have a legitimate reason.\n- Report and call support if direction is refused or the situation is unresolved.",
        tip: "Support boundaries through calm direction and leadership coordination - not confrontation.",
      },
      {
        heading: "Correct Door Problems Without Creating New Risks",
        body: "Access support includes fixing simple door problems - but life safety always remains part of the system.\n\nCorrect or Report Close propped-open side doors. Remove objects holding doors open. Report broken latches, broken locks, or blocked crash bars immediately.\n\nPreserve Safe Exit Doors that must allow emergency exit should always remain available. Controlled access never means trapping people inside.\n\nPreserve Accessibility Routes needed by people with disabilities must remain usable at all times. Responder access must stay clear.\n\nThe goal is controlled access, not dangerous obstruction.",
        tip: "The goal is controlled access, not dangerous obstruction.",
      },
      {
        heading: "Access Support Does Not Mean Physical Blocking",
        body: "Your tools are words, distance, communication, and leadership - not your body. When a concern exceeds your role, become more coordinated, not more physical.\n\n- Give Clear Direction: Use calm, direct language to redirect.\n\n- Call Support: Notify leadership and call for backup.\n\n- Move Others Away: Reduce exposure for bystanders if needed.\n\n- Call 911: Confirm emergency services when the threshold is met.\n\nA person refusing direction does NOT give permission to restrain, detain, search, or physically control them.",
        tip: "A person refusing direction does NOT give permission to restrain, detain, search, or physically control them.",
      },
      {
        heading: "Report Access Concerns With Facts",
        body: "The Five-Part Report\n\n01 Who: Describe the person clearly - clothing, location, direction of movement.\n\n02 What: What did you observe? What happened?\n\n03 Where: Specific location - door name, wing, hallway.\n\n04 Risk: What is the current concern?\n\n05 Action: What have you done, and what do you need?\n\nExample Reports \"Adult male in black jacket tried the east side door twice, then walked toward the children's hallway. Location: east education wing. Risk: access bypass near children's ministry. I am at the hallway and need support.\"\n\n\"South exterior door propped open with a chair near the fellowship hall - unmonitored. Risk: unmanaged entry. I removed the chair. Leadership needs to know.\"\n\nDo not report guesses, motives, or labels. Facts make the response clearer.",
        tip: "Do not report guesses, motives, or labels. Facts make the response clearer.",
      },
      {
        heading: "Access Changes During Emergencies",
        body: "During emergency response, the access question shifts from \"How do people enter correctly?\" to \"How do we reduce exposure and protect life?\"\n\nEvacuate Help prevent re-entry. \"We are not re-entering until leadership gives the all-clear.\" Guide people to the assembly area and support child reunification.\n\nShelter Control exterior movement. \"Please move away from the exterior doors.\" Keep people inside and away from exterior openings.\n\nLockdown Access becomes protective. Secure assigned spaces, stop unnecessary movement, do not open doors casually, and do not move toward the threat.",
      },
      {
        heading: "Bottom Line",
        body: "The practical question is always: What does this access point need right now?\n\n- Direction: Redirect with calm, clear words.\n\n- Correction: Fix or report simple door problems.\n\n- Support: Call for leadership or backup when needed.\n\n- 911: Confirm emergency services when the threshold is met.\n\nControlled access works when the Safety Team stays calm, clear, early, and role-correct. Welcoming, but never unmanaged.",
        tip: "Welcoming, but never unmanaged.",
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
    estMinutes: 14,
    objectives: [
      "Support smooth movement and prevent dangerous crowding",
      "Keep responder routes clear at all times",
      "Adapt movement support for evacuate, shelter, and lockdown",
    ],
    sections: [
      {
        heading: "Movement Matters",
        body: "Movement becomes a safety issue when people don't know where to go, when routes get blocked, or when responders can't reach the scene. Your role is to guide - not control.\n\nYou Support Movement Through direction, positioning, reporting, and coordination\n\nYou Do Not Force It No pushing, grabbing, blocking, or pulling people into compliance\n\nThe Goal Guided movement inside the church's response - without creating a second problem",
        tip: "Your role is to guide - not control.",
      },
      {
        heading: "Know the Movement Pattern",
        body: "Good movement support begins before the emergency. Understand your building and ministry rhythm so you can support movement when it counts.\n\n- Entry & Gathering: Where do people enter, gather, and stop to talk?\n- Vulnerable Populations: Where are children, youth, older adults, and accessible routes?\n- Exits & Shelter: Where are exits, shelter areas, and reunification locations?\n\nA reliable Safety Team member knows where movement usually works, where it slows down, and where it may fail under pressure.",
        tip: "A reliable Safety Team member knows where movement usually works, where it slows down, and where it may fail under pressure.",
      },
      {
        heading: "Watch for Movement Problems",
        body: "Movement problems are often visible before they become serious. Recognize the signs early and report before a situation compounds.\n\n- Hesitation & Crowding: People stopping in doorways, hallways beginning to crowd, or exits becoming blocked\n- Counterflow: Parents moving toward children's areas during evacuation; guests using unfamiliar routes\n- Mobility Needs: A person with mobility needs falling behind; children drifting from assigned workers\n- Responder Access: A responder route filling with people; a parking area becoming unsafe for pedestrians\n\nMovement problems create delay, confusion, counterflow, and exposure. Report early - don't wait for it to escalate.",
        tip: "Report early - don't wait for it to escalate.",
      },
      {
        heading: "Use Clear Direction",
        body: "People under stress need short, calm, direct language. Say the same instruction consistently and avoid competing messages.\n\n- \"Please keep moving to the west exit.\"\n- \"Stay with your group.\"\n- \"Do not stop in the doorway.\"\n- \"We are sheltering inside. Move away from the glass.\"\n- \"Do not re-enter the building.\"\n\nIf leadership gives a direction, support that direction unless conditions have clearly changed and the instruction has become unsafe. If something has changed, report the facts immediately.",
        tip: "If leadership gives a direction, support that direction unless conditions have clearly changed and the instruction has become unsafe.",
      },
      {
        heading: "Support Routes, Not Curiosity",
        body: "During a response, people naturally move toward what they want to know. Safety Team members must resist that same pull.\n\nStay at Your Assignment If you're assigned to an exit, hallway, or responder path - stay useful there until reassigned.\n\nDon't Drift A route left uncovered can create a larger problem than the one you left to address.\n\nReport & Call Support If something needs attention elsewhere, report it. Don't abandon your position to investigate.",
        tip: "Don't abandon your position to investigate.",
      },
      {
        heading: "Prevent Stopping and Crowding",
        body: "Doorways, hallways, exits, and responder paths must not become gathering points. Use calm, repeated direction - not shame, barking orders, or physical contact.\n\n- \"Please keep moving through the doorway.\"\n- \"We will answer questions outside.\"\n- \"EMS needs this path open.\"\n- \"Move to the assembly area and stay with your group.\"\n\nMovement support is often just disciplined repetition of the right instruction.",
        tip: "Movement support is often just disciplined repetition of the right instruction.",
      },
      {
        heading: "Manage Counterflow",
        body: "Counterflow happens when people move against the intended direction. It's common in churches - families want to reconnect, and that instinct can slow or endanger the response.\n\n- Parents During Evacuation: \"Children's ministry is moving to the reunification area. Please go there now.\"\n- Medical Scene: \"We need this hallway clear for responders.\"\n- During Lockdown: \"We are not going back into that area.\"\n- During Reunification: \"Please stay with us. Release will happen at the reunification point.\"\n\nIf someone refuses direction or becomes aggressive, report it and call support. Do not escalate physically.",
        tip: "If someone refuses direction or becomes aggressive, report it and call support. Do not escalate physically.",
      },
      {
        heading: "Support Children's Movement",
        body: "Children and youth must stay with assigned workers. Groups should not scatter. Reunification - not informal pickup - is the correct process.\n\nYour Role\n\n- Keep routes clear for children's groups\n- Redirect parents to the correct reunification location\n- Prevent uncontrolled re-entry into children's areas\n- Report problems to children's ministry leadership\n\n\"We need to keep the class together so every child is accounted for.\"\n\nDo not physically hold a child or parent. Support the process. Report resistance. Escalate quickly if a child is missing or forced removal is attempted.",
        tip: "Support the process. Report resistance. Escalate quickly if a child is missing or forced removal is attempted.",
      },
      {
        heading: "Support People Who Need Assistance",
        body: "Older adults, people with disabilities, injured persons, children, and guests may need more time, space, or clearer direction. Accessibility is part of movement support - not an afterthought.\n\nDon't Pressure Never rush someone who cannot move quickly.\n\nDon't Abandon Report the need, create space, and ask simple questions: \"Can you use the stairs, or do you need another route?\"\n\nCall the Right Help If physical assistance is beyond your ability or role, call for support immediately.",
        tip: "Accessibility is part of movement support - not an afterthought.",
      },
      {
        heading: "Keep Responder Routes Clear",
        body: "Emergency responders need access. If they cannot reach the scene, the church's entire response slows down. Responder access is not optional.\n\nYour Role May Include\n\n- Keeping people away from responder paths\n- Meeting responders at the assigned entrance\n- Guiding them to the right location\n- Reporting that a route is blocked\n\n- \"Step to the side. Responders need this hallway.\"\n- \"EMS is coming through the south entrance.\"",
        tip: "Responder access is not optional.",
      },
      {
        heading: "Movement During Evacuate",
        body: "RESPONSE MODE\n\nPeople leave the building and move to the assigned assembly or reunification location. Expect delays - people ask questions, look for family, and follow familiar routes.\n\n1. Keep Exits Moving: Redirect away from blocked routes and prevent bottlenecks\n\n2. Direct Away from Building: \"Keep moving to the assembly area.\" \"Do not stop near the doorway.\"\n\n3. Prevent Re-Entry: \"Do not re-enter until leadership gives the all-clear.\"\n\nYour job is to support clear, continuous movement - without force and without creating a second problem.",
        tip: "Your job is to support clear, continuous movement - without force and without creating a second problem.",
      },
      {
        heading: "Movement During Shelter",
        body: "RESPONSE MODE\n\nPeople stay inside or move to a safer interior location because the danger is outside or open movement is unsafe. Shelter is not casual waiting - it is controlled movement or controlled staying.\n\nMove Away From Exposure Direct people away from exterior doors, windows, and glass\n\nDirect to Shelter Areas Use interior hallways and designated shelter locations\n\nHold Until Leadership Directs Keep people from leaving; help account for all groups\n\n- \"We are sheltering inside.\"\n- \"Please move away from the windows.\"\n- \"Stay with your group.\"\n- \"Wait for leadership direction.\"\n\nThe goal is to reduce exposure while keeping people accounted for.",
        tip: "The goal is to reduce exposure while keeping people accounted for.",
      },
      {
        heading: "Movement During Lockdown",
        body: "RESPONSE MODE\n\nThere is an immediate threat inside or near the church. Movement becomes limited. The priority is to secure, reduce visibility, remain quiet, and protect life.\n\nDo\n\n- Secure your assigned space if safe\n- Call 911 when safe to do so\n- Follow the safest available action if evacuation is clearly safer\n\nDo Not\n\n- Move through the building to investigate\n- Search for the threat\n- Open doors casually\n- Gather people from other areas if doing so increases danger\n\nLockdown movement is not hallway management. It is life protection under immediate threat.",
        tip: "Lockdown movement is not hallway management. It is life protection under immediate threat.",
      },
      {
        heading: "Movement After the Immediate Response",
        body: "The response is not over just because the loudest part is over. Recovery movement must remain controlled.\n\nWhat May Still Be Happening\n\n- People attempting to re-enter\n- Parents pushing toward children's areas\n- Bystanders, media, or neighbors arriving\n- Responders still needing access\n- Controlled reunification in progress\n\n- \"Please remain in the assembly area.\"\n- \"Reunification is happening at the west parking area.\"\n- \"This hallway is closed.\"\n- \"Emergency responders are still working. Keep this area clear.\"",
        tip: "Recovery movement must remain controlled.",
      },
      {
        heading: "Bottom Line",
        body: "What does movement need right now? Ask that question and act on the answer.\n\n01 Keep Routes Clear Prevent stopping, crowding, and counterflow\n\n02 Give Clear Direction Short, calm, repeated instructions - no force\n\n03 Support Vulnerable Populations Children, people needing assistance, and those unfamiliar with the building\n\n04 Keep Responder Routes Open Access for EMS, fire, and law enforcement is non-negotiable\n\n05 Adapt Across All Modes Evacuate, Shelter, Lockdown, and recovery each require movement awareness\n\nMovement support works when the Safety Team stays calm, positioned, clear, and coordinated.",
        tip: "Movement support works when the Safety Team stays calm, positioned, clear, and coordinated.",
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
    estMinutes: 14,
    objectives: [
      "Follow the medical response pathway and confirm 911",
      "Take the first Safety Team actions: report, clear space, protect privacy",
      "Support trained medical volunteers and clear access for EMS",
    ],
    sections: [
      {
        heading: "Medical Emergencies Need Early Coordination",
        body: "A medical emergency can change the room in seconds. People gather, aisles block, family members panic - and responders may not know where to enter. Your role on the Safety Team is not medical treatment. Your role is coordination.\n\n- Get Help Moving: Connect trained volunteers, leadership, and EMS\n- Protect Space: Clear access and keep routes open\n- Communicate Facts: Report what you observe - not what you guess",
        tip: "The question is not \"Can I diagnose what is happening?\" The question is: Does this person need urgent help, and what does my role require right now?",
      },
      {
        heading: "Know the Medical Response Pathway",
        body: "Before an emergency happens, every Safety Team member should know the answers to these questions - not discover them in the moment.\n\nThe Medical Response Pathway includes: who is notified, volunteer contacted, AED location, entrance, supply storage, entrance, EMS meet-and-clear, and EMS meet-and-clear.\n\n- Notification Chain: Who is called first - and how are medical volunteers reached?\n- Equipment Locations: Where is the AED, first aid kit, or medical bag?\n- EMS Access: Which entrance for sanctuary, children's area, gym, parking lot?\n- Leadership Roles: Who clears space? Who communicates with leadership?",
        tip: "Preparation makes response faster. A medical emergency is not the time to discover nobody knows where the AED is.",
      },
      {
        heading: "Recognize Urgent Medical Conditions",
        body: "Safety Team members do not diagnose - but you must recognize when a condition may require emergency medical response. If the threshold is met, call or confirm 911.\n\nUrgent Conditions:\n\n- Collapse or loss of consciousness\n- Chest pain or trouble breathing\n- Stroke-like symptoms\n- Severe bleeding or serious injury\n- Seizure or serious allergic reaction\n\nDo Not:\n\n- Wait for perfect certainty\n- Debate whether the person is embarrassed\n- Assume someone else has already called",
        tip: "Medical response is not a failure of ministry. It is part of protecting people.",
      },
      {
        heading: "First Safety Team Actions",
        body: "When a medical emergency is reported or observed, act quickly and stay in your assigned role. You may not do all of these - do your part and make sure the rest of the response is moving.\n\n- Notify the Pathway: Activate the church's medical response chain\n- Call or Confirm 911: When the condition is urgent - do not assume it's been done\n- Send for AED / Medical Bag: If assigned, retrieve and deliver immediately\n- Clear Space: Keep aisles, doors, and responder routes open\n- Report Facts: Communicate location, condition, and actions to the right people",
        tip: "A reliable Safety Team member does not crowd the scene. He supports the response.",
      },
      {
        heading: "Make the Medical Report Clear",
        body: "Report location, condition, action taken, and what is needed next. Use observable facts - not diagnoses.\n\nStrong Report: \"Medical emergency in the sanctuary center aisle. Adult female collapsed, now conscious but weak. Calling 911, sending for the AED, need someone to meet EMS at the main entrance.\"\n\nStrong Report: \"Child injured on the playground. Bleeding from the head after a fall. Children's ministry leader is present. Need medical support and 911 confirmation.\"\n\nDo Not Say: \"She is having a heart attack\" - unless a qualified person has confirmed that.\n\nDo Say:\n\n- \"She is reporting chest pain.\"\n- \"He is having trouble breathing.\"\n- \"She lost consciousness.\"\n- \"He is bleeding heavily.\"",
        tip: "Facts move the response better than guesses.",
      },
      {
        heading: "Assign or Confirm 911",
        body: "In a medical emergency, one of the most important questions is: Has 911 been called? Do not assume. Confirm it.\n\nBe Specific - Not Vague: Say: \"You - call 911 now. Tell me when the call is connected.\" Not: \"Somebody call 911.\" Pointing into a crowd fails because everyone assumes someone else is doing it.\n\nWhen Calling, Give:\n\n- Location and entrance\n- Condition, age if known\n- Current status and access instructions\n\nThen Update the Team: \"911 is connected. EMS is en route. They should use the south entrance. Someone needs to meet them there.\"",
        tip: "Has 911 been called? Do not assume. Confirm it.",
      },
      {
        heading: "Clear Space and Protect Privacy",
        body: "Medical scenes attract people. Crowding blocks care, embarrasses the person, and delays EMS. Your role may be to create and hold space.\n\nUse Calm Words:\n\n- \"Please step back and give them room.\"\n- \"Medical help is coming. Keep this aisle clear.\"\n- \"EMS will need this path.\"\n- \"Let's move back so they have privacy.\"\n\nDo Not:\n\n- Be harsh or create drama\n- Share unnecessary details with bystanders\n- Allow the scene to become a public event",
        tip: "Protecting the person includes protecting their dignity. A medical emergency is a person in need - not a public event.",
      },
      {
        heading: "Support Trained Medical Volunteers",
        body: "If your church has trained medical volunteers, your job is to support them - not crowd them or duplicate their work.\n\n- Get Them There: Help them reach the scene quickly and without obstruction\n- Bring Supplies: Deliver the AED, medical bag, or other equipment if assigned\n- Relay Information: Keep leadership and EMS informed; ask volunteers what support they need\n\nDo not interrupt trained medical care with unnecessary questions. Do not assume this course qualifies you to perform treatment. If you have outside medical training, follow your church's policy, your training, and applicable law.",
        tip: "Safety Team Level 1 does not create medical certification. It teaches support, communication, access, and handoff - not medical treatment.",
      },
      {
        heading: "Keep Access Clear for EMS",
        body: "EMS needs a clean, direct path to the scene. Know the access points before an emergency - and be ready to guide responders from the door.\n\nThe access sequence: Know Entrance, Clear Path, Guide EMS, Hand Off.\n\nWhen EMS arrives, hand off clearly: location, patient status, time 911 was called, whether the AED is on scene, and whether a trained volunteer is present. Then get out of the way unless responders ask for more help. Support their work - do not compete with it.",
        tip: "Support their work - do not compete with it.",
      },
      {
        heading: "Manage Movement Around the Scene",
        body: "Medical emergencies often create movement problems - aisles clog, parents move toward children's areas, and service flow is disrupted. Your job is to direct, not override leadership.\n\nDirect with Simple Language:\n\n- \"Please use the side aisle.\"\n- \"Keep this path open for EMS.\"\n- \"Please remain seated unless directed.\"\n- \"Move to the lobby so responders can work.\"\n- \"Children's ministry is continuing as directed.\"\n\nSupport Leadership: The service may pause, continue, or redirect under leadership's call. Do not give competing instructions. Report movement problems early so leadership can decide.",
        tip: "Your job is to direct, not override leadership.",
      },
      {
        heading: "Medical Emergencies Involving Children or Youth",
        body: "When a child or student is involved, fast coordination and careful control are both essential. The Safety Team supports the process - children's and youth leadership remain central.\n\n- Notify Immediately: Contact children's or youth leadership right away\n- Protect Privacy: Keep other children away; do not release children casually because the scene is stressful\n- Contact Parents: Use the church's established process - do not let the group scatter\n- Document Key Facts: Who is with the child, where they are going, who contacted the parent, what was documented",
        tip: "If EMS responds to a child, leadership must know: who is with the child, where the child is going, who contacted the parent, and what has been documented.",
      },
      {
        heading: "When the Scene Stabilizes",
        body: "The response is not over when the person is moved or taken by EMS. Several things may still need attention.\n\n- Keep the Area Clear: The space may need to stay restricted until leadership releases it\n- Support People: Family members, witnesses, children, and bystanders may need reassurance or guidance\n- Inform Leadership: Provide facts to help leadership decide whether to continue, pause, or adjust the service\n- Document Useful Facts: What happened, where, who reported it, when 911 was called, when EMS arrived, what actions were taken, who was notified",
        tip: "Do not document guesses. Do not document private medical details beyond what the church process requires. Document useful, observable facts only.",
      },
      {
        heading: "What Not To Do",
        body: "In a medical emergency, well-meaning actions can make things worse. Avoid these common mistakes.\n\n- Do Not Diagnose: Do not give medical instructions beyond your training. Say what you observe - never what you assume.\n- Do Not Delay or Assume: Do not delay 911. Do not assume someone else called. Do not move the person unless there is immediate danger or qualified responders direct it.\n- Do Not Crowd or Interfere: Do not crowd the scene. Do not let bystanders gather. Do not interfere with trained volunteers or EMS. Do not block responder routes.\n- Do Not Broadcast: Do not share private medical details. Do not turn a medical emergency into a spectacle.",
        tip: "Stay useful. Call help. Clear space. Protect privacy. Support access. Communicate facts. Hand off to qualified responders.",
      },
      {
        heading: "Bottom Line",
        body: "In a medical emergency, the Safety Team role is coordination - not medical treatment. Ask yourself: What does this scene need right now?\n\n- Call 911: Confirm it's been done - don't assume\n- AED / Medical Bag: Send for it if assigned\n- Space & Privacy: Clear the scene and protect the person\n- EMS Access: Keep routes open; meet and guide responders\n- Leadership & Documentation: Notify leadership; document observable facts\n\nA reliable Safety Team member does not stand around the scene trying to look useful. He makes the response work.",
        tip: "In a medical emergency, the Safety Team role is coordination - not medical treatment.",
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
    estMinutes: 14,
    objectives: [
      "Recognize fire/smoke/gas/HazMat triggers and take first actions",
      "Support evacuation using the Fire Warden roles and safe egress",
      "Meet responders and prevent re-entry until it's cleared",
    ],
    sections: [
      {
        heading: "These Are Immediate Concerns",
        body: "Fire, smoke, gas odors, carbon monoxide, chemical fumes, and hazardous air are not wait-and-see situations. They move fast, spread beyond what you can see, and can make a familiar building unsafe in minutes.\n\nAlert\n\n- Notify leadership and the Safety Team pathway immediately\n\nReport\n\n- Communicate what is known - location, condition, people affected\n\nAct\n\n- Support movement, protect access, call or confirm 911 when needed\n\nYour role is not to investigate the source. You do not search for the cause. You do not assume the problem is minor because the service is still happening.",
        tip: "Your role is not to investigate the source - alert, report, and act.",
      },
      {
        heading: "Know the Response Before It Happens",
        body: "Before service begins, know your fire and hazardous-air response pathway. Preparation prevents improvisation when it matters most.\n\n- Alarms & Reporting: Know how alarms are handled, who receives reports, and who calls or confirms 911\n\n- Exits & Assembly: Know which exits serve your area, where assembly points are, and where fire lanes are located\n\n- Special Areas: Kitchens, mechanical rooms, nurseries, classrooms, stages, and utility spaces require extra awareness\n\n- People Needs: Know how children's ministry evacuates, how mobility needs are supported, and who meets responders",
        tip: "Preparation prevents improvisation when it matters most.",
      },
      {
        heading: "Recognize the Triggers",
        body: "Fire or hazardous-air response may be triggered by any of the following conditions. Treat every report seriously.\n\n- Physical Alarm: Fire alarm sounds or a responder, leader, or alarm system directs evacuation\n\n- Visible or Sensory Signs: Smoke seen, gas smelled, burning odor reported, or haze observed in any area\n\n- Symptoms in People: Dizziness, headache, nausea, breathing trouble, or eye/throat irritation tied to the environment\n\n- Unsafe Area Identified: Kitchen, mechanical room, electrical area, or storage space appears unsafe\n\nDo not dismiss a report because you cannot personally confirm it. Do not delay while people debate whether the smell is \"probably nothing.\" Report the condition, the location, and the current risk - then support the response.",
        tip: "Treat every report seriously.",
      },
      {
        heading: "First Safety Team Actions",
        body: "When fire, smoke, gas, or hazardous air is reported or observed, act quickly and in sequence.\n\n- Alert Leadership: Notify the Safety Team pathway and leadership immediately\n\n- Call or Confirm 911: When fire, gas, CO, hazardous air, or urgent life-safety risk is present\n\n- Support Protective Action: Direct evacuation, keep exits moving, clear responder routes\n\n- Report What You Know: Location, what was seen or smelled, who may be affected, what action is underway\n\n- Prevent Re-Entry: Keep people away from the affected area until a proper all-clear is given\n\nDo not investigate beyond safe role action. Do not send untrained volunteers toward the source. Do not assume an alarm is false.",
        tip: "Do not assume an alarm is false.",
      },
      {
        heading: "Fire Alarm Response",
        body: "A fire alarm requires disciplined action. In most cases, evacuation begins or is prepared immediately according to your church's plan.\n\n- \"Please move to the nearest safe exit.\"\n- \"Keep moving away from the building.\"\n- \"Do not stop in the doorway.\"\n- \"Please go to the assembly area.\"\n- \"We are not re-entering until leadership or responders give the all-clear.\"\n\nA fire alarm is not a discussion prompt. It is a response trigger.\n\nDo Not Ignore It\n\n- Never silence casually or tell people to stay seated without confirmed leadership direction\n\nDirect Movement\n\n- Guide people to exits, keep routes clear, prevent re-entry, support children's ministry\n\nMeet Responders\n\n- If assigned, meet fire or EMS at the correct entrance and provide clear information",
        tip: "A fire alarm is not a discussion prompt. It is a response trigger.",
      },
      {
        heading: "Smoke or Fire Report",
        body: "If smoke or fire is seen or credibly reported, escalate immediately. Report the location as specifically as possible, call or confirm 911, and move people away.\n\nReport Specifically\n\n- \"Smoke reported near the kitchen hallway.\" Give the exact location every time.\n\nCall or Confirm 911\n\n- Do not wait to determine severity. Firefighters assess the hazard - you protect people.\n\nControl Movement\n\n- Move people away. Keep them from going toward smoke. Support evacuation if directed.\n\n- \"Fire visible in the trash can outside the fellowship hall.\"\n- \"Burning odor and haze near the mechanical room.\"\n- \"Smoke in the children's wing near Room 204.\"\n\nDo not open doors into suspected fire areas unless your church's procedure and your safety allow it. Smoke means something is changing.",
        tip: "Smoke means something is changing.",
      },
      {
        heading: "Gas Odor and Carbon Monoxide",
        body: "Gas odor and carbon monoxide are silent, fast-moving hazards. Do not treat them casually.\n\nDo Not Search\n\n- Do not send anyone to find the leak or assume fresh air will resolve it\n\nReport Clearly\n\n- \"Gas odor reported near the kitchen.\" Use direct, specific language\n\nCall or Confirm 911\n\n- When gas, CO, or hazardous air is suspected - no exceptions\n\nEvacuate and Hold\n\n- Move people outside and away. No re-entry until responders give the all-clear\n\n\"Several people reporting headache and dizziness in the lower-level classrooms.\" Symptoms in a group are a red flag - report and act immediately.",
        tip: "Symptoms in a group are a red flag - report and act immediately.",
      },
      {
        heading: "Hazardous Air or Chemical Fumes",
        body: "Hazardous air may come from cleaning chemicals, maintenance work, mechanical failure, smoke, or an outside condition. Your role is not to identify the chemical - it is to report and act.\n\nRecognize the Signs\n\n- Odor, irritation, coughing, dizziness, nausea, headache, or breathing trouble in a specific area\n\nReport Immediately\n\n- \"Strong chemical odor in the nursery hallway. Several workers are coughing. We need leadership and 911 confirmation.\"\n\nMove People Out\n\n- Clear the affected area, keep others from entering, report who may have been exposed\n\nSupport Responders\n\n- Provide facts when they arrive. Unknown hazardous air is still a life-safety concern",
        tip: "Your role is not to identify the chemical - it is to report and act.",
      },
      {
        heading: "Support Evacuation",
        body: "Fire, smoke, gas, carbon monoxide, and hazardous air often require evacuation. Keep movement clear, calm, and continuous.\n\n- Keep Exits Moving: Redirect away from blocked routes and report route problems immediately\n\n- Support Special Needs: Watch for mobility needs; support children's ministry movement and accountability\n\n- Clear Access Routes: Keep emergency vehicle lanes and responder entrances clear at all times\n\n- \"We are moving outside now.\"\n- \"Please keep going to the assembly area.\"\n- \"Do not re-enter the building.\"\n- \"Children's ministry is accounting for children at the assigned location.\"\n\nDo not let people return for coats, bags, phones, instruments, or any belongings. Once outside, they stay outside.",
        tip: "Once outside, they stay outside.",
      },
      {
        heading: "Children's Areas During Evacuation",
        body: "Children's and youth areas require structured, disciplined movement. Accountability is the priority.\n\nDo not take over children's ministry - support the process. Never send untrained volunteers back into a dangerous area.\n\nStay With Workers\n\n- Children remain with assigned workers; workers take attendance at a stable location\n\nRedirect Parents\n\n- \"Please stay with us and come to the reunification area. We'll check out there.\"\n\nReport Missing Children\n\n- If a child is missing, report immediately and activate the church's missing child response",
        tip: "Accountability is the priority.",
      },
      {
        heading: "Meet and Support Responders",
        body: "When fire, EMS, or law enforcement arrives, they need concise, accurate facts - not opinions or speculation.\n\n- \"Smoke was reported near the kitchen hallway.\"\n- \"The building has been evacuated.\"\n- \"Children's ministry is accounted for at the west parking area.\"\n- \"One adult reported trouble breathing.\"\n- \"The fire alarm activated at approximately 10:20.\"\n- \"The affected area is through this entrance, down the right hallway.\"\n\nMeet at the Right Entrance\n\n- If assigned, be at the correct driveway or entrance when responders arrive\n\nSupport Their Access\n\n- Keep people away from responder routes and prevent re-entry\n\nStay in Your Role\n\n- Do not compete with responders. Give facts, not opinions. Identify who has more information.",
        tip: "They need concise, accurate facts - not opinions or speculation.",
      },
      {
        heading: "Prevent Re-Entry",
        body: "Re-entry control is one of the most critical Safety Team responsibilities after evacuation. People will want back in - your job is to hold the line.\n\nCommon Re-Entry Requests\n\n- Phones, purses, medications, keys, instruments, laptops, children's items, documents - and curiosity\n\nThe Right Answer\n\n- \"We are not re-entering until the all-clear is given. Emergency responders are still working.\"\n\nUrgent Needs\n\n- Report urgent needs to leadership or responders - do not solve them by letting someone go back inside\n\nOnce people are out, they stay out until the proper all-clear. \"Please remain in the assembly area. Leadership will tell us when re-entry is allowed.\"",
        tip: "Once people are out, they stay out until the proper all-clear.",
      },
      {
        heading: "What Not To Do",
        body: "Never Ignore Alarms\n\n- Do not silence or reset alarms casually. Do not assume smoke, gas, or CO is minor.\n\nNever Send Volunteers Into Danger\n\n- Do not search for the source beyond safe role action. Keep untrained people away.\n\nNever Delay 911\n\n- When urgent life-safety risk is present, call or confirm 911 without hesitation.\n\nNever Break Child Accountability\n\n- Do not allow parents to pull children out of line during evacuation movement.\n\nNever Allow Early Re-Entry\n\n- Do not let people return before the all-clear. Do not speculate about cause or tell people everything is fine when you do not know that.\n\nStay factual. Stay calm. Support movement. Support accountability. Support responders.\n\nThese three disciplines keep people safe when conditions are unclear.",
        tip: "Stay factual. Stay calm. Support movement. Support accountability. Support responders.",
      },
      {
        heading: "Bottom Line",
        body: "Fire, smoke, gas, carbon monoxide, chemical fumes, and hazardous air require early action. The practical question is always: What does this condition require right now?\n\nAlert & Report\n\n- Notify leadership and give a clear, specific report of the condition and location\n\nCall or Confirm 911\n\n- When the threshold is met - no delay, no debate\n\nEvacuate & Control\n\n- Support movement, clear exits, keep responder routes open, prevent re-entry\n\nProtect Children\n\n- Support children's ministry movement and maintain accountability throughout\n\nHand Off\n\n- Give responders accurate facts and support their access - then stay in your role\n\nDo not wait for perfect certainty when life safety may be involved. A reliable Safety Team member treats fire and hazardous-air concerns as immediate protection issues - and helps the church move with discipline.",
        tip: "Do not wait for perfect certainty when life safety may be involved.",
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
    estMinutes: 14,
    objectives: [
      "Recognize shelter triggers and take first actions",
      "Move people to safe interior areas and control exterior movement",
      "Communicate during shelter and end it only on the right authority",
    ],
    sections: [
      {
        heading: "Shelter When Outside Is the Danger",
        body: "Some emergencies don't start inside the building. When severe weather, hazardous conditions, police activity, or outside threats make open movement unsafe - Shelter is the response.\n\nWhat It Means: People stay inside or move to a safer interior location because the danger is outside.\n\nWhat It Is Not: Shelter is not casual waiting - it is a deliberate, protective action.\n\nYour Role: Move people away from exposure, reduce uncontrolled movement, keep groups accounted for.\n\nThe guiding question: What does this outside condition require us to do right now?",
        tip: "The guiding question: What does this outside condition require us to do right now?",
      },
      {
        heading: "Know the Shelter Plan Before It Happens",
        body: "Before service begins, make sure you already know how your church shelters. Preparation prevents confusion when conditions change fast.\n\n- Know the People: Who gives shelter direction. Who monitors weather alerts and emergency updates.\n- Know the Spaces: Which areas are used for severe weather. Which areas to avoid - glass, exterior walls, large-span roofs.\n- Know the Groups: How children's ministry and youth areas shelter. How people with mobility needs are supported.\n- Know the Flow: How communication reaches classrooms, lobbies, parking areas, and outside volunteers.",
      },
      {
        heading: "Recognize Shelter Triggers",
        body: "Shelter may be needed for many types of outside conditions - not just severe weather. Ask: Is staying inside safer than leaving?\n\n- Severe Weather: Tornado warning, dangerous lightning, hail, or high wind\n- Law Enforcement Activity: Police activity nearby or a violent event in the area\n- Hazardous Material: A nearby incident creating outdoor air or exposure risk\n- Suspicious Presence: A suspicious person or dangerous animal near entrances\n- Civil Disturbance: Protest or disorder outside affecting access or safety\n- Leadership Direction: A directive from leadership or responders to stay in place\n\nDo not assume evacuation is always the right answer. Do not send people home into the hazard.",
        tip: "Do not assume evacuation is always the right answer. Do not send people home into the hazard.",
      },
      {
        heading: "First Safety Team Actions",
        body: "When Shelter is directed, act quickly. Stay in your role. Keep communication simple and consistent.\n\nImmediate Steps:\n\n- Receive and repeat the correct instruction\n- Move people away from glass, exterior doors, and exposed areas\n- Notify outside volunteers to come in immediately\n- Support children's and youth workers as they account for groups\n- Report blocked routes, missing people, or resistance\n\nClear Language to Use:\n\n- \"We are sheltering inside.\"\n- \"Please move to the interior hallway.\"\n- \"Stay away from the windows.\"\n- \"Do not leave the building right now.\"\n- \"Stay with your group and wait for leadership direction.\"",
      },
      {
        heading: "Severe Weather Shelter",
        body: "During severe weather, people often underestimate risk. They may want to watch from windows, go to their cars, or assume the church is overreacting. Stay calm, stay direct.\n\nCommon Resistance:\n\n- Watching from windows or glass doors\n- Heading to the parking lot during a storm\n- Assuming conditions aren't that bad\n- Wanting to leave before it gets worse\n\nYour Response:\n\n- Support movement to the safer area - keep routes clear\n- Watch for people with mobility needs\n- Report groups that have not arrived\n- Do not debate weather conditions in the hallway\n\n\"We are moving to the shelter area now.\" - \"Stay in this area until leadership gives the all-clear.\"",
        tip: "\"We are moving to the shelter area now.\" - \"Stay in this area until leadership gives the all-clear.\"",
      },
      {
        heading: "Outside Hazard Shelter",
        body: "Shelter also applies when danger outside is not weather-related. Keep people inside, limit exterior exposure, and wait for direction.\n\n- Law Enforcement / Disturbance: Police activity, protests, or civil disorder near the building\n- Hazardous Material: Chemical or environmental incident affecting the surrounding area\n- Access Threat: Suspicious person, dangerous animal, or crash affecting entry points\n\nDo not go outside to investigate. Do not follow the activity. Report what is known and support the protective action.",
        tip: "Do not go outside to investigate. Do not follow the activity. Report what is known and support the protective action.",
      },
      {
        heading: "Control Exterior Movement",
        body: "Shelter often fails at the doors. People try to leave. Parents want children released. Someone opens a door to look. Your role at an exterior access point is calm direction - not physical blocking.\n\n- Calm Direction\n- Report Attempts\n- Escalate Danger\n\nLanguage for Exterior Access:\n\n- \"We are sheltering inside right now.\"\n- \"Please stay in this area until we receive the all-clear.\"\n- \"Children are staying with their assigned workers.\"\n- \"We are not releasing through this door right now.\"\n\nIf someone refuses direction, report it and call for support. If immediate danger escalates, confirm 911.\n\nDoor control is about coordination and communication - not confrontation.",
        tip: "Door control is about coordination and communication - not confrontation.",
      },
      {
        heading: "Children's and Youth Areas During Shelter",
        body: "Children and students must remain accountable during Shelter. Groups do not move unless directed by the church's shelter plan.\n\n- Stay With Workers: Children remain with assigned workers. Students stay with assigned leaders until directed otherwise.\n- Account for the Group: Workers confirm their group is accounted for once the shelter area is reached or the room is secured.\n- Redirect Parents Calmly: \"Pickup will happen when leadership gives direction. Please stay here so we can keep everyone accounted for.\"\n- Escalate if Needed: If forced removal, abduction concern, or immediate danger appears - call or confirm 911 immediately.",
      },
      {
        heading: "Parking and Exterior Volunteers",
        body: "Do not forget the people stationed outside. Parking volunteers, greeters, and playground workers need direction when outside hazards develop.\n\nWhen Outside Conditions Change:\n\n- Outside volunteers may need to move inside quickly\n- Report who is still outside to leadership\n- Help communicate the change to all exterior positions\n- Keep entrances clear for people coming in\n- Keep fire lanes and driveways clear for emergency responders\n\nDo not send volunteers outside into danger to move cones, signs, or equipment. People matter more than property.",
        tip: "Do not send volunteers outside into danger to move cones, signs, or equipment. People matter more than property.",
      },
      {
        heading: "Communication During Shelter",
        body: "Shelter requires one clear, consistent message. Mixed instructions create confusion - and confusion creates risk.\n\nWhat Confusion Looks Like:\n\n- One person says: \"Stay inside.\"\n- Another says: \"Go to your cars.\"\n- Another says: \"Pick up your children.\"\n- Another says: \"Move downstairs.\"\n\nHow to Correct It:\n\n\"We have conflicting instructions in the east hallway. Please confirm the shelter location.\"\n\n\"Parents are being told to pick up children, but children's ministry is sheltering in place. Need leadership clarification.\"\n\nDo not invent your own plan. Do not spread unconfirmed information. Do not announce an all-clear without authority.",
        tip: "Do not invent your own plan. Do not spread unconfirmed information. Do not announce an all-clear without authority.",
      },
      {
        heading: "When Conditions Change",
        body: "Shelter is not static. Conditions may escalate, shift, or resolve. Your role is to report changes and support the new direction.\n\n- Monitor: Watch for weather, activity, or crowd changes near your position\n- Report: \"Storm intensifying near the west entrance.\" \"Police activity has moved closer.\"\n- Adapt: Shelter may shift to continued shelter, controlled release, evacuation, or lockdown\n\nWhen the response changes, your action changes with it. Stay in role until the new direction is confirmed.",
        tip: "When the response changes, your action changes with it. Stay in role until the new direction is confirmed.",
      },
      {
        heading: "Ending Shelter",
        body: "Shelter ends intentionally - not because things seem quieter. People should not leave on their own assumption that it's over.\n\nWhy Quiet Isn't Always Safe:\n\n- Storm noise may stop before danger has passed\n- Police activity may appear distant but still affect the area\n- A protest may move away and then return\n\nLeadership or proper authority must give the all-clear.\n\nAfter Shelter - Still Needs Discipline:\n\n- People may leave quickly - support orderly flow\n- Parents may rush toward children's areas\n- Children's ministry needs controlled release\n- Some areas may remain closed\n\n\"Please wait for release instructions.\" - \"Use the main exit.\" - \"Do not go into the closed area.\"",
        tip: "Leadership or proper authority must give the all-clear.",
      },
      {
        heading: "What Not To Do",
        body: "- Don't Send People Out: Never send people outside when Shelter has been directed or while an outside hazard is active\n- Don't Gather at Windows: Don't go outside to investigate, and don't let people gather at doors or glass to watch\n- Don't Release Children Casually: Don't let parents break accountability because they're anxious - support the process\n- Don't Self-Declare All-Clear: Never announce an all-clear without authority. Don't shift to Lockdown or Evacuation unless conditions require it\n\nAction must match the condition. Stay in role. Support the direction. Report changes. Escalate when the situation worsens.",
        tip: "Action must match the condition. Stay in role. Support the direction. Report changes. Escalate when the situation worsens.",
      },
      {
        heading: "Bottom Line",
        body: "Shelter protects people when outside conditions make open movement unsafe. Your role is to help the church move from normal ministry activity into controlled, protective action.\n\n01 Support Clear Direction: Move people away from exposure. Keep the message consistent and calm.\n\n02 Control Exterior Movement: Manage doors, redirect people, and remember outside volunteers.\n\n03 Keep Groups Accountable: Support children's and youth workers. Prevent casual or unauthorized release.\n\n04 Report and Adapt: Communicate confusion and changing conditions. Support the transition to the next instruction.\n\nThe practical question every time: What does Shelter require right now - interior movement, door control, children's accountability, parent redirection, or transition to the next response?",
        tip: "Shelter protects people when outside conditions make open movement unsafe - your job is to move the church from normal activity into controlled, protective action.",
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
    estMinutes: 14,
    objectives: [
      "Recognize lockdown triggers and take first actions",
      "Use the CrossBridge lockdown language and secure spaces per plan",
      "Call/confirm 911 when safe and cooperate with police on arrival",
    ],
    sections: [
      {
        heading: "Lockdown Is for Immediate Threat",
        body: "Lockdown protects life when there is immediate danger from violence, attempted violence, forced access, or direct threat. It is not the answer to every concern - it is a disciplined protective action for when delay increases danger.\n\nLockdown\n\n- Immediate threat inside or entering - violence, weapon, forced access\n\nShelter\n\n- Outside danger or controlled movement - weather, perimeter threat",
        tip: "Lockdown protects life when there is immediate danger from violence, attempted violence, forced access, or direct threat.",
      },
      {
        heading: "Know the Lockdown Plan Before It Happens",
        body: "A lockdown condition is not the time to create the plan. Know it now.\n\nCommunication\n\n- Who can call it, how the message is sent, and how the all-clear is verified\n\nSecured Spaces\n\n- Which rooms lock down, which areas are hard to secure, and where people may be exposed\n\nChildren & Youth\n\n- How children's ministry and youth areas lock down and how reunification works\n\nResponder Handoff\n\n- How 911 is called and how responders are met or directed when safe",
        tip: "A lockdown condition is not the time to create the plan. Know it now.",
      },
      {
        heading: "Recognize Lockdown Triggers",
        body: "When Lockdown May Apply\n\n- Active or attempted violence\n- Weapon concern or shots heard\n- Credible threat inside or near the building\n- Forced or attempted forced entry\n- Violent intruder report or assault in progress\n- Law enforcement direction to secure in place\n\nLockdown is not triggered by someone who is merely unfamiliar, upset, emotional, poor, or mentally distressed. It is based on immediate threat - not appearance.\n\nThe key question: Is there immediate danger that makes open movement unsafe? If yes, Lockdown may be the correct action.",
        tip: "It is based on immediate threat - not appearance.",
      },
      {
        heading: "First Safety Team Actions",
        body: "When Lockdown conditions exist, act immediately and stay in role.\n\n01 Alert\n\n- Use the church's emergency communication pathway immediately\n\n02 Secure\n\n- Lock your assigned room or access point if you can do so safely\n\n03 Reduce Exposure\n\n- Move people out of sight, reduce noise and visibility, stop unnecessary movement\n\n04 Call 911\n\n- Call or confirm 911 when safe - do not move toward danger to investigate\n\n05 Support Handoff\n\n- Be ready to direct and support responders when the situation allows\n\nDo not search for the threat. Do not move toward danger to confirm it. If evacuation is clearly safer, move away and report when possible.",
        tip: "Do not search for the threat. Do not move toward danger to confirm it.",
      },
      {
        heading: "Use Clear Lockdown Language",
        body: "When immediate threat conditions exist, the message must be clear enough for people to act. No long explanations. No hedging.\n\nSay This\n\n- \"Lockdown now.\"\n- \"Secure the room.\"\n- \"Move out of sight.\"\n- \"Stay quiet. Silence phones.\"\n- \"Do not open the door.\"\n- \"Call 911 when safe.\"\n\nWhen Reporting to the Team\n\n- \"Weapon reported near the east lobby. Lockdown now. Call 911.\"\n- \"Forced entry at the south entrance. Lockdown now.\"\n- \"Shots heard outside the north doors. Lockdown now.\"\n\nNever say \"Maybe we should lock down.\" Short, clear messages save time.",
        tip: "Never say \"Maybe we should lock down.\" Short, clear messages save time.",
      },
      {
        heading: "Secure the Space If Safe",
        body: "Steps to Reduce Exposure\n\n- Close and lock the door\n- Move people away from windows, doors, and lines of sight\n- Turn off lights if part of your church's practice and safe to do\n- Silence phones - keep people quiet and low\n\nDo not stand in the doorway. Do not look into the hallway. Do not open the door because someone knocks or claims it is safe. A door opens only through verified all-clear or lawful responder direction.",
        tip: "A door opens only through verified all-clear or lawful responder direction.",
      },
      {
        heading: "Open Areas Require Fast Decisions",
        body: "Lobbies, worship centers, hallways, and parking areas may not provide quick locked-room protection. The correct action depends on where the threat is, where people are, and what path is safest right now.\n\nDirect Movement with Clear Language\n\n- \"Move into this room now.\"\n- \"Get away from the lobby.\"\n- \"Go through that exit now.\"\n- \"Stay low and move.\"\n- \"Do not go that way.\"\n\nMove to a Securable Room Direct people into rooms that can be locked\n\nEvacuate if Clearly Safer Move out of the building away from danger\n\nDo Not Assume Not everyone should run - and not everyone should stay",
        tip: "Not everyone should run - and not everyone should stay.",
      },
      {
        heading: "Children's & Youth Areas During Lockdown",
        body: "Children's and youth areas require immediate protective action. Workers secure rooms. Children move out of sight and stay quiet.\n\nSafety Team Support Secure nearby access points, communicate threat info, prevent hallway movement, report status when possible\n\nDo Not Release Children Do not open children's areas because a parent is knocking or demanding entry - use the verified process\n\nDo Not Move Children Do not gather children from other rooms if moving would increase danger - stay secured\n\nLockdown is not normal pickup. It is immediate life protection. If a parent is outside a secured area, report the condition when safe.",
        tip: "Lockdown is not normal pickup. It is immediate life protection.",
      },
      {
        heading: "Do Not Investigate or Confront",
        body: "During Lockdown, do not: Move toward the threat, Search hallways, Clear rooms, Pursue anyone, Attempt to disarm, Confront a violent person, Give tactical instructions, Act as law enforcement\n\nLockdown conditions create pressure to do more than your role allows. Resist it.\n\n- Readiness and alerting\n- Movement away from danger when possible\n- Securing spaces and reducing exposure\n- Communication and 911 coordination\n- Responder handoff\n\nWhat This Course Trains Armed or specially trained roles require separate qualified instruction, written policy, and leadership oversight - beyond the scope of this training.",
        tip: "Lockdown conditions create pressure to do more than your role allows. Resist it.",
      },
      {
        heading: "Call or Confirm 911 When Safe",
        body: "Lockdown conditions require emergency services. Call or confirm 911 as soon as it is safe to do so.\n\nDirect Someone If Needed \"You call 911 now. Tell me when connected.\"\n\nGive the Dispatcher Facts Church name and address - Threat location - What was seen or heard - Weapons or injuries if known - Where people are locked down - Which entrance responders should use\n\nStay on the Line Do not hang up unless the dispatcher says to or your safety requires it. If speaking is dangerous, stay quiet and follow dispatcher instructions.",
        tip: "Call or confirm 911 as soon as it is safe to do so.",
      },
      {
        heading: "Report What Is Known",
        body: "During Lockdown, reports must be short and factual. Useful information protects life, supports 911, and helps leadership and responders understand status.\n\n- \"Lockdown. Shots heard near the north entrance. I am in Room 104 with eight adults. Door secured. Calling 911.\"\n- \"Lockdown. Weapon reported in the east lobby. Children's hallway doors are secured. No injuries reported here.\"\n- \"Room 204 is secured. Twelve children, three workers. No injuries. Staying quiet.\"\n\nDo not fill the channel with speculation. Do not broadcast hiding locations widely unless the communication pathway requires it for responder support.",
        tip: "Do not fill the channel with speculation.",
      },
      {
        heading: "When Law Enforcement Arrives",
        body: "When responders arrive, the phase changes. Their first priority may be to stop the threat - not answer questions or begin reunification.\n\nFollow Lawful Commands\n\n- Keep hands visible if directed\n- Do not run toward officers\n- Do not grab or point objects at officers\n- Do not argue or assume they know who belongs\n\nGive Facts When Asked\n\n- \"Threat was reported near the east lobby.\"\n- \"Children's ministry is locked down in the north hallway.\"\n- \"We have one injured adult in the sanctuary.\"\n- \"Main office has cameras.\"\n\nThen follow direction. Support responders. Do not compete with them.",
        tip: "Support responders. Do not compete with them.",
      },
      {
        heading: "Ending Lockdown",
        body: "Lockdown does not end because the building is quiet, someone knocks, or a familiar voice calls out.\n\nLockdown ends through: Verified all-clear from leadership, law enforcement, or the church's approved process - nothing else.\n\nAfter the All-Clear\n\n- Keep movement controlled - people may be frightened\n- Support child reunification with accountability\n- Provide medical, emotional, and pastoral support\n- Responders may still need access - areas may remain closed\n\nDo not turn a lockdown release into uncontrolled movement. Support accountability, reunification, and recovery.",
        tip: "Lockdown ends through a verified all-clear - nothing else.",
      },
      {
        heading: "What Not To Do",
        body: "Don't Over-Trigger Lockdown is not the default response to every problem - and never delay it when real threat conditions exist\n\nDon't Investigate Do not move toward danger, search hallways, sweep rooms, or try to confirm reports by approaching the threat\n\nDon't Confront Do not confront, disarm, pursue, detain, or physically control anyone as part of this training\n\nDon't Break Protocol Do not release children, open doors casually, announce an unverified all-clear, or leave your secured area out of curiosity\n\nStay quiet when quiet is needed. Stay clear when movement is needed. Stay in role.",
        tip: "Stay quiet when quiet is needed. Stay clear when movement is needed. Stay in role.",
      },
      {
        heading: "Bottom Line",
        body: "Lockdown protects life when immediate threat conditions make open movement unsafe. A reliable Safety Team member acts quickly without freelancing.\n\n- Alert through the church's communication pathway\n- Secure your area if safe - move people out of sight\n- Stop movement - reduce noise and exposure\n- Call 911 when safe - report facts, not speculation\n- Support handoff - wait for verified all-clear, then support reunification\n\nYou do not investigate. You do not confront. You do not act as law enforcement. Lockdown is disciplined life protection inside the role.",
        tip: "Lockdown is disciplined life protection inside the role.",
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
    estMinutes: 14,
    objectives: [
      "Sort disruption into the three response categories",
      "Keep first contact simple and redirect without arguing",
      "Call support early and know when to call 911",
    ],
    sections: [
      {
        heading: "Disruption Requires Early Coordination",
        body: "A disruptive person can change the environment quickly - and no one person should handle it alone. Your role as a Safety Team member is to notice, report, reduce pressure, and call support early.\n\n- Observe: Notice behavior early and stay aware\n- Report: Communicate clearly to the team\n- Coordinate: Call support before it escalates\n- Protect: Keep people nearby safe",
        tip: "No one person should handle it alone - notice, report, reduce pressure, and call support early.",
      },
      {
        heading: "Start With Observable Behavior",
        body: "Report what the person is doing - not what you think is wrong with them. Labels create bias and confusion. Behavior gives the team useful facts.\n\nDon't Say This:\n\n- \"He is crazy.\"\n- \"She is drunk.\"\n- \"He is dangerous.\"\n- \"She is mentally ill.\"\n\nSay What You Observe:\n\n- \"He is yelling at the welcome desk volunteer.\"\n- \"She is refusing to leave the children's hallway.\"\n- \"He smells of alcohol and is trying to enter the sanctuary.\"\n- \"He has threatened to hurt the usher.\"",
        tip: "The Safety Team does not diagnose. The Safety Team reports what is happening.",
      },
      {
        heading: "Three Response Categories",
        body: "Not every difficult person is an emergency. Use these three categories to guide your response level.\n\nNormal: Upset, confused, emotional, or asking for help. Guide, listen briefly, redirect, or connect with the right ministry leader.\n\nEscalating: Refusing direction, getting louder, moving toward protected areas, or disrupting ministry. Report, call support, and involve leadership.\n\nImmediate Protection: Threats, violence, weapon concern, forced entry, or attempted abduction. Act immediately, move people away, and call 911.",
      },
      {
        heading: "Keep the First Contact Simple",
        body: "Your tone should reduce pressure, not add pressure. Be calm, brief, and clear. Don't argue, lecture, shame, or crowd the person.\n\nExample Phrases:\n\n- \"Let's step over here so we can talk.\"\n- \"I want to help you, but we need to keep this hallway clear.\"\n- \"We need you to lower your voice.\"\n- \"Children's ministry is not open access. Please wait here.\"",
        tip: "Stay calm - but calm does not mean passive.",
      },
      {
        heading: "Use Space Wisely",
        body: "How you position yourself matters as much as what you say. Space management protects you and reduces tension.\n\n- Keep Distance: Maintain a reasonable buffer. Don't move into the person's face or back yourself into a corner.\n- Hands Visible: Keep hands open and non-threatening. Position yourself to step away if needed.\n- Limit Audience: Move the conversation away from children, crowds, and narrow hallways. Reduce bystanders gathering around the contact.\n- Stay Visible: Do not isolate yourself in a private room with an escalating person. Response should become more visible to the team, not less.",
      },
      {
        heading: "Redirect Without Arguing",
        body: "Give one clear direction. If the person refuses, report and call support - don't keep debating.\n\nClear Redirections:\n\n- \"Please stay in the lobby.\"\n- \"Please step away from the children's hallway.\"\n- \"Please lower your voice.\"\n- \"Please come with us to speak with a leader.\"\n- \"You may wait here, but you cannot enter that area.\"\n\nWhen They Refuse: A person who refuses a clear direction has changed the situation. Do not treat refusal as routine. Do not turn the hallway into a debate.",
        tip: "One clear direction - then support and escalation.",
      },
      {
        heading: "Call Support Early",
        body: "The most common failure is waiting too long. Don't keep talking and hoping it resolves. Call support when the person refuses direction, gets louder, moves toward a protected area, invades space, or creates concern for others.\n\nExample Report: \"Adult male in the west lobby is refusing to leave the children's hallway entrance. He is raising his voice at the check-in worker. I need Safety Team support and children's ministry leadership now.\"\n\n- Location: Where is the person right now?\n- Behavior: What are they doing - specifically?\n- Risk: Who is affected or at risk nearby?\n- Action Needed: What do you need - support, leadership, 911?",
        tip: "The most common failure is waiting too long.",
      },
      {
        heading: "Involve the Right Leader",
        body: "Some situations belong with a ministry or church leader - not the Safety Team alone.\n\nWhen to Involve Leadership:\n\n- Person demanding to see a pastor\n- Parent angry about children's ministry\n- Custody or release conflict\n- Volunteer or church discipline dispute\n- Person seeking financial assistance",
        tip: "Safety Team supports order and access. Leadership handles the ministry decision. If the situation becomes threatening - safety comes first.",
      },
      {
        heading: "Protect People Nearby",
        body: "Disruptive behavior affects more than the person involved. Children may be frightened, volunteers may freeze, and guests may gather.\n\nYour Role May Be To:\n\n- Move other people away from the situation\n- Keep a hallway or exit route clear\n- Support the volunteer who reported the concern\n- Ask bystanders to step back calmly\n- Help leadership relocate the conversation\n\nSimple Language That Works:\n\n- \"Please give us some space.\"\n- \"Let's keep this hallway clear.\"\n- \"Please continue into the sanctuary.\"\n- \"Children's check-in is continuing. Please stay in line.\"",
        tip: "Reduce the audience. Protect the environment. Don't make the disruptive person the center of the whole church.",
      },
      {
        heading: "When Children or Vulnerable People Are Involved",
        body: "Escalate faster. A disruptive person near children's ministry is higher concern than the same behavior in an empty lobby.\n\n- Person Refusing to Leave Children's Hallway: Call support immediately. Do not manage this alone.\n- Custody or Unauthorized Pickup Concern: Involve children's ministry leadership and church leadership now. Do not make release decisions yourself.\n- Vulnerable Adult in Distress: Coordinate help. Report facts. Bring in the right leaders. Call 911 for immediate danger.",
        tip: "Do not investigate custody details. Do not physically block or restrain. Protect the process and report facts.",
      },
      {
        heading: "When to Call 911",
        body: "Don't wait until someone is injured. Don't assume someone else has called. If the threshold is met - call or confirm 911.\n\n- Threat of Harm or Assault\n- Weapon Seen, Displayed, or Credibly Reported\n- Forced Entry or Forced Access to Restricted Areas\n- Attempted Abduction or Forced Removal\n- Stalking or Following Creating Immediate Concern\n- Situation Beyond Church Control or Urgent Medical Emergency",
        tip: "Do not wait for the pastor if delay increases risk. Call or confirm 911 the moment the threshold is met.",
      },
      {
        heading: "What Not To Do",
        body: "Do Not:\n\n- Diagnose, mock, shame, or provoke the person\n- Argue to win or threaten what you cannot lawfully do\n- Crowd the person or isolate yourself with them\n- Follow the person around without direction\n- Search the person or their belongings\n- Restrain, detain, pursue, tackle, or physically remove\n\nAlso Do Not:\n\n- Allow children's or restricted areas to become open access\n- Ignore a volunteer's concern\n- Let a disruptive person pull the team out of coverage and leave other areas exposed",
        tip: "Stay calm. Stay coordinated. Stay in role.",
      },
      {
        heading: "If the Person Leaves",
        body: "Departure reduces immediate pressure - but the response is not automatically over.\n\n- Report Direction of Travel: Note whether they left on foot or in a vehicle, and which direction.\n- Report Impact: Was anyone threatened, injured, followed, or affected?\n- Report Return Risk: Is there reason to believe the person may return? Note it.\n- Preserve Documentation: Leadership and law enforcement may need facts. Do not pursue. Wait for direction.",
        tip: "Departure reduces immediate pressure - but the response is not automatically over.",
      },
      {
        heading: "Bottom Line",
        body: "Disruptive person response is about early coordination, clear boundaries, and role-correct action.\n\n- Observe: Report behavior, not labels\n- Direct: Calm, simple, one clear instruction\n- Escalate: Call support early - not after\n- Protect: Children, volunteers, guests, access\n- Call 911: Threats, violence, weapons, forced access\n\nThe practical question every time: What does this situation need right now - a calm redirect, leadership, Safety Team support, more space, or 911?",
        tip: "Disruptive person response is about early coordination, clear boundaries, and role-correct action.",
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
    estMinutes: 14,
    objectives: [
      "Define suspicious activity as observable concern, not a hunch about a person",
      "Notice behavior, access, movement, and context — and report the pattern early",
      "Handle unattended items and avoid profiling and overreach",
    ],
    sections: [
      {
        heading: "Suspicious Activity Means Observable Concern",
        body: "Suspicious activity is not about how someone looks. It is about what is happening - behavior, access, movement, timing, location, and conditions that create a concern requiring attention.\n\nNot This Question\n\n\"Does this person look suspicious?\"\n\nThis Question\n\n\"What is happening, where, what has changed, and what risk does it create?\"",
        tip: "Suspicious activity is not about how someone looks - it is about what is happening.",
      },
      {
        heading: "Notice Behavior, Access, Movement, and Context",
        body: "Suspicious activity is recognized through a combination of facts - rarely one detail alone.\n\n- Behavior: What the person is doing\n- Access: Where the person is trying to go\n- Movement: Whether movement fits the setting\n- Context: Time, location, ministry activity, and who may be affected\n\nA person standing near a hallway may be waiting for someone. A person standing near a children's hallway after trying two locked doors creates a different concern. Context changes the meaning of behavior.",
        tip: "Context changes the meaning of behavior.",
      },
      {
        heading: "What to Notice",
        body: "Notice actions that affect access, movement, safety, or ministry order - without turning every unusual moment into a crisis.\n\n- Trying multiple locked doors or entering through non-public entry\n- Attempting to bypass children's check-in or moving toward restricted areas\n- Watching children's areas without a clear reason\n- Leaving an item in an unusual location, then walking away\n- Repeatedly moving in and out without participating\n- Photographing children, security features, or restricted areas without a clear ministry reason\n- Refusing simple direction\n- Asking unusual questions about child release, cameras, keys, or building access",
      },
      {
        heading: "Normal, Escalating, Immediate Protection",
        body: "Every situation falls into one of three categories. The category determines the action.\n\n- NORMAL: Guest is unfamiliar, confused about entry, or in the wrong hallway. Guide, redirect, and keep watching.\n- ESCALATING: Concern repeats, moves closer to a protected area, refuses direction, or affects children or vulnerable people. Report, call support, involve leadership.\n- IMMEDIATE PROTECTION: Forced entry, weapon, violence, attempted abduction, active harm, or immediate danger. Act immediately. Alert. Move people away. Call 911.",
        tip: "The category determines the action.",
      },
      {
        heading: "Start With a Ministry-Facing Contact",
        body: "When contact is appropriate and safe, begin with a calm, helpful approach - not accusation, interrogation, or confrontation.\n\n- \"Good morning. Can I help you find where you're going?\"\n- \"This entrance is closed right now. The main entrance is around the corner.\"\n- \"That hallway is for checked-in children and approved workers. I can connect you with the right person.\"\n\nIf the person cooperates, the concern may stay normal. If the person refuses, argues, keeps moving, or tries again - the situation changes. Report and escalate.",
        tip: "If the person refuses, argues, keeps moving, or tries again, the situation changes. Report and escalate.",
      },
      {
        heading: "Report Early When the Pattern Matters",
        body: "Do not wait until the situation is dramatic. Report early when a pattern affects access, movement, children's areas, or ministry order.\n\nWhat a Useful Report Includes\n\n- What happened: Describe the observed behavior factually\n- Where it happened: Give the specific location\n- What risk is changing: Note what concern is growing or moving\n- What action is underway: State what you are doing and what you need\n\nExample Report\n\n\"Adult male in dark jacket tried the east side door twice, then walked toward the children's hallway. Location is east education wing. Current risk is access bypass near children's ministry. I am staying near the hallway and need support.\"\n\n\"Unclaimed black backpack near the main entrance. Nearby people say it does not belong to them. We are keeping people away and need leadership to respond.\"",
        tip: "Report early when a pattern affects access, movement, children's areas, or ministry order.",
      },
      {
        heading: "Suspicious Item or Unattended Bag",
        body: "An unattended item is not automatically dangerous - but location and context matter.\n\nIf Safe to Ask\n\nCheck with nearby people whether the item belongs to them. If concern remains: Create space. Report location, description, and why it concerns you. Notify leadership.\n\nCall or Confirm 911 When\n\n- The item is clearly threatening or connected to a threat\n- It is located in a sensitive area and cannot be resolved\n- Ownership cannot be confirmed and concern grows\n\nYour job is not to determine whether the item is dangerous. Your job is to keep people away and get the right help involved.\n\n- DO NOT Touch\n- DO NOT Move\n- DO NOT Open",
        tip: "Your job is not to determine whether the item is dangerous. Your job is to keep people away and get the right help involved.",
      },
      {
        heading: "Suspicious Activity Near Children or Youth",
        body: "Concerns near children's or youth areas require faster escalation. These are accountability zones - built on process, supervision, and early action.\n\nReport Early When Someone Is\n\n- Near classrooms without a clear reason or attempting to bypass check-in\n- Asking unusual questions about child release or photographing children\n- Trying to pick up a child without authorization or refusing direction\n\nYour Role\n\n- Support the boundary. Do not investigate alone or make custody decisions yourself.\n- Notify children's or youth leadership and call Safety Team support.\n- Call or confirm 911 if forced removal, attempted abduction, violence, or immediate danger appears.",
        tip: "Concerns near children's or youth areas require faster escalation.",
      },
      {
        heading: "Suspicious Activity Outside the Building",
        body: "Outside concerns can affect inside readiness quickly. Report facts. Call support. Notify leadership.\n\n- Vehicle Concerns: Person pulling door handles, looking into windows, or a vehicle parked in an unusual place for an extended time\n- Perimeter Watching: Person watching entrances without entering, moving between exterior doors, or leaving an item near an entrance\n- Physical Signs: Damage, vandalism, forced-entry signs, broken glass, or an unsecured exterior door\n\nDo not follow someone around the property alone. Do not search vehicles. If the situation involves forced entry, active theft, violence, weapon concern, or immediate risk - call or confirm 911.",
        tip: "Do not follow someone around the property alone. Do not search vehicles.",
      },
      {
        heading: "Avoid Profiling and Overreach",
        body: "Suspicious activity recognition must never become profiling. The standard is disciplined observation and factual reporting.\n\nYou Do Not Judge By\n\n- Race, age, clothing, or familiarity\n- Poverty, disability, or emotional state\n- Mental-health appearance\n\nYou Notice\n\n- What the person is doing and where it is happening\n- Whether direction is accepted or refused\n- Whether children, restricted areas, or vulnerable people may be affected\n- Whether the situation is getting better or worse\n\nDo not turn a person into a threat because they look different. Do not ignore behavior because you are afraid to report.",
        tip: "Do not turn a person into a threat because they look different. Do not ignore behavior because you are afraid to report.",
      },
      {
        heading: "When Suspicion Becomes Immediate Risk",
        body: "Some concerns move beyond observation. Do not wait for certainty when delay increases danger.\n\nCall or Confirm 911 When There Is\n\n- Forced Entry: Forced or attempted forced entry into the building or a protected area\n- Weapon or Violence: Weapon seen or credibly reported, assault, or active threat of violence\n- Abduction or Removal: Attempted abduction or forced removal of a child\n- Unresolved Threat: Bomb threat, suspicious package, or situation the church cannot safely manage internally\n\n- Alert Team: Notify staff immediately\n- Move People: Guide everyone to safety\n- Call 911: Call or confirm emergency services",
        tip: "Do not wait for certainty when delay increases danger.",
      },
      {
        heading: "Preserve Useful Information",
        body: "Suspicious activity often requires follow-up. Document observable facts - speculation does not help leadership, responders, or later review.\n\nWhat to Preserve\n\n- Time and location of the incident\n- Description and direction of travel\n- Vehicle description and license plate (if safely observed)\n- What was said, who reported it, and what action was taken\n- Whether 911 was called\n\nWhat to Avoid\n\n- Do not collect information by creating a confrontation\n- Do not follow someone to get more detail\n- Do not record people in ways that violate church policy or law\n- Do not spread names or rumors",
        tip: "Document observable facts - speculation does not help leadership, responders, or later review.",
      },
      {
        heading: "What Not to Do",
        body: "Staying in role means knowing where your responsibility ends. These boundaries protect people - including you.\n\n- Do Not Profile or Accuse: No profiling, diagnosing motive, or accusing without observable facts\n- Do Not Search or Touch: Do not search bags, vehicles, or rooms. Do not touch or open a concerning unattended item.\n- Do Not Confront or Follow: Do not follow someone alone around the property or confront based on a feeling\n- Do Not Detain or Remove: Do not physically block, detain, restrain, or remove anyone as part of this course\n\nDo not ignore children's-area concerns. Do not delay 911 when immediate risk appears. Do not create panic with dramatic language. Stay factual. Stay coordinated. Stay in role.",
        tip: "Stay factual. Stay coordinated. Stay in role.",
      },
      {
        heading: "Bottom Line",
        body: "A reliable Safety Team member notices without profiling, reports without exaggerating, and escalates before a concern becomes harder to manage.\n\n- Notice: Behavior, access, movement, location, timing, and context - not appearance\n- Help First: Begin with ministry-facing contact when appropriate and safe\n- Report Early: Report when the pattern affects access, children's areas, or safety\n- Escalate: Call support, involve leadership, or confirm 911 as the situation requires\n- Preserve: Document observable facts through the church's process\n\nThe practical question: What is happening, where is it happening, what has changed, and what does the church need to do now?",
        tip: "A reliable Safety Team member notices without profiling, reports without exaggerating, and escalates before a concern becomes harder to manage.",
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
    estMinutes: 14,
    objectives: [
      "Treat a missing child as an immediate coordination problem",
      "Control exits and support a coordinated search",
      "Verify authorized pickup and support controlled reunification",
    ],
    sections: [
      {
        heading: "A Missing Child Is an Immediate Coordination Problem",
        body: "Do Not Assume Never assume the child is probably with a parent or will turn up on their own.\n\nDo Not Wait Treat every missing child report as an immediate accountability problem requiring action now.\n\nDo Coordinate Help the church respond quickly and calmly alongside children's ministry and church leadership.\n\nCall or confirm 911 when the child cannot be located quickly, abduction is suspected, forced removal is attempted, or immediate danger exists.",
        tip: "Call or confirm 911 when the child cannot be located quickly, abduction is suspected, forced removal is attempted, or immediate danger exists.",
      },
      {
        heading: "Accountability Comes First",
        body: "Children's ministry must know which children are present, who is assigned to them, where they should be, and who is authorized for pickup. The Safety Team supports - not replaces - that system.\n\nCollect These Facts Immediately\n\n- Name, age, physical description\n- Classroom or group assignment\n- Last known location and time last seen\n- Last person who saw the child\n- Authorized pickup concerns\n- Medical, behavioral, or communication needs\n- Actions already taken\n\nDo not guess. Get the facts and move them to the right people.",
        tip: "Do not guess. Get the facts and move them to the right people.",
      },
      {
        heading: "First Safety Team Actions",
        body: "- Notify Leadership: Alert supervisors and incident lead\n- Gather Child Info: Confirm name, age, last seen location\n- Confirm Roles: Assign watchers and communication leads\n- Watch Exits: Monitor exits and record sightings\n\nWhen a missing child is reported, the first need is coordination - not random searching. Confirm who is missing, where they were last seen, which exits must be watched, and who is responsible for each task. Do not let volunteers scatter or leave coverage areas uncovered.",
        tip: "The first need is coordination - not random searching.",
      },
      {
        heading: "Make the Report Clear",
        body: "\"Missing child report from Room 204. Caleb Johnson, age six, blue shirt, khaki pants. Last seen near the classroom door during pickup about three minutes ago. Upper children's hallway. Children's ministry leader is responding. We need exit awareness now.\"\n\nIdentifies the child Name, age, clothing description\n\nStates last known location Room, hallway, timing\n\nNames who is responding Ministry leader confirmed\n\nStates the action needed Exit awareness requested now\n\nDo not say \"We lost a kid\" or \"There may be an abduction\" unless facts support it. Use disciplined language. A clear report prevents panic.",
        tip: "Use disciplined language. A clear report prevents panic.",
      },
      {
        heading: "Control Exits and Movement",
        body: "Approved Language\n\n- \"We need everyone to remain in this area for a moment.\"\n- \"Please do not leave with children until release is confirmed.\"\n- \"Children's ministry is checking attendance now.\"\n- \"Leadership will give the next instruction.\"\n\nWhat to Watch\n\n- Exterior doors and main exits\n- Hallways and stairwells\n- Bathrooms and playgrounds\n- Parking areas and likely movement routes\n\nDo not physically block people or create confrontation. But do not allow uncontrolled movement to weaken the response. Report resistance immediately.",
        tip: "Do not physically block people or create confrontation, but do not allow uncontrolled movement to weaken the response. Report resistance immediately.",
      },
      {
        heading: "Search Support Must Stay Coordinated",
        body: "Missing child response fails when people search without direction - exits go uncovered, parents get emotional questions, and confusion spreads. Every team member must stay on assignment.\n\nAssigned to an area? Check only that area, then report back.\n\nAssigned to an exit? Stay at the exit. Do not leave to search.\n\nAssigned to parking? Watch parking. Stay connected to leadership.\n\nDo not freelance into a private search. Do not enter areas outside your assignment. Support the plan.",
        tip: "Do not freelance into a private search. Do not enter areas outside your assignment. Support the plan.",
      },
      {
        heading: "Children's Ministry Leads the Child Information",
        body: "Children's ministry has the best information - the roster, workers, pickup procedures, and any authorized release restrictions. The Safety Team must not bypass that knowledge.\n\nChildren's Ministry holds:\n\n- Classroom Roster\n- Pickup Procedures\n- Authorized Release Restrictions\n- Custody Concerns\n- Worker Assignments\n- Last Known Location\n\nKey Questions to Ask\n\n- Was the child checked out?\n- Who last saw the child?\n- Is there an authorized pickup concern?\n- Are all other children accounted for?\n- Are parents or guardians present?\n\nMove that information to leadership and the Safety Team pathway. The Safety Team supports the child protection system. It does not replace it.",
        tip: "The Safety Team supports the child protection system. It does not replace it.",
      },
      {
        heading: "Parent and Guardian Contact",
        body: "If Assigned to Speak with a Parent, Use Calm, Factual Language\n\n\"We are checking on a child accountability concern now. Children's ministry leadership is involved, and we are keeping the process controlled.\"\n\n- Do not make promises\n- Do not blame workers\n- Do not speculate or share more than you know\n- Follow the church's notification process\n\nEscalation Thresholds\n\n- Parent is upset -> stay calm, bring in the right leader\n- Parent pushes past the process -> report and call support\n- Forced removal, abduction concern, or threats -> call or confirm 911\n- Violence appears -> call 911 immediately",
      },
      {
        heading: "Unauthorized Pickup or Custody Concern",
        body: "\"Unauthorized pickup concern at children's check-out. Adult male is demanding release of a child and is not listed as authorized. Child remains with assigned worker. Need children's ministry leadership and Safety Team support now.\"\n\n1. Keep the child with the assigned worker\n\nDo not release until leadership confirms it is appropriate.\n\n2. Notify children's ministry and the Safety Team lead\n\nMove the report quickly and clearly.\n\n3. Call or confirm 911 if it escalates\n\nForced removal, threats, violence, or safety concern - escalate immediately.\n\nDo not physically confront. Protect the process and escalate.",
        tip: "Do not physically confront. Protect the process and escalate.",
      },
      {
        heading: "When Missing Child Becomes a 911 Call",
        body: "Do not wait out of fear of embarrassment. Do not assume someone else called. A missing child becomes time-sensitive very fast.\n\n- Church name and address\n- Child's name, age, description, and last known location\n- Time last seen and who last saw the child\n- Known risks, medical needs, and possible direction of travel\n- Whether abduction is suspected and where responders should enter",
        tip: "Do not wait out of fear of embarrassment. Do not assume someone else called.",
      },
      {
        heading: "If the Child Is Found",
        body: "Report Immediately\n\n- Child has been found - state the location\n- Report condition: safe, injured, distressed, or with an adult\n- Report who found the child\n- Confirm whether 911 and leadership have been notified\n\nRestore Accountability\n\nDo not release the child casually because everyone is relieved. Return the child to children's ministry leadership through the church process.\n\nIf the child was found outside the building, in an unsafe location, or with an unauthorized person - leadership may need documentation and law enforcement involvement. Relief does not erase the need for process.",
        tip: "Relief does not erase the need for process.",
      },
      {
        heading: "Accountability Reports Help Leadership Know",
        body: "After an emergency or reunification begins, leadership needs real-time status. Safety Team members collect and move these reports.\n\nAll Present \"Nursery is accounted for. Twelve children, four workers. No injuries.\"\n\nChild Missing \"Room 204 is missing one child, Caleb Johnson, age six. Last seen in the hallway.\"\n\nExtra Child \"Youth group has one extra student from Room 3.\"\n\nProcess Breach \"One parent is attempting to bypass reunification at children's check-in.\"\n\nDo not assume accountability is complete. Confirm it through the process.",
        tip: "Do not assume accountability is complete. Confirm it through the process.",
      },
      {
        heading: "What Not To Do",
        body: "- Treat a missing child report casually or wait too long to escalate\n- Let the response become random, uncoordinated searching\n- Abandon assigned exits or coverage areas\n- Release children casually during movement or reunification\n- Make custody or release decisions yourself\n- Search vehicles, bags, or private areas as part of this course\n- Physically restrain, detain, or remove anyone\n- Send untrained volunteers into hazardous areas\n- Spread rumors or document guesses\n- Let anyone bypass the reunification process unchallenged",
      },
      {
        heading: "Bottom Line",
        body: "Fast information. Controlled movement. Disciplined accountability.\n\nGet the Facts Name, description, last location, last seen - move information to the right people fast.\n\nStay Assigned Hold your exit, hallway, or area. Do not freelance. Report clearly.\n\nProtect the Process Support children's ministry. Prevent uncontrolled release. Escalate to 911 when the threshold is met.\n\nRestore Accountability When the child is found or groups reunify - confirm it, report it, and close the loop.\n\nA reliable Safety Team member does not panic and does not delay. He helps the church account, reunite, and protect the process.",
        tip: "A reliable Safety Team member does not panic and does not delay. He helps the church account, reunite, and protect the process.",
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
    estMinutes: 16,
    objectives: [
      "Recognize immediate-threat indicators and choose lockdown vs. evacuate",
      "Protect people using secure spaces or safe egress — never engage the threat",
      "Call/confirm 911, report status when safe, and cooperate on police arrival",
    ],
    sections: [
      {
        heading: "Immediate Threat Requires Immediate Protection",
        body: "A violent intruder condition is an Immediate Protection event - not a routine disruption, not a normal access problem, not a situation where the team gathers to discuss what may be happening.\n\nWhat It May Involve\n\nActive violence, weapon concerns, forced entry, credible threats, attempted abduction, or behavior creating immediate danger\n\nYour Role\n\nAlert. Protect life. Support Lockdown or Evacuate. Call 911. Stop movement. Report facts. Hand off to law enforcement.\n\nWhat You Do Not Do\n\nYou do not hunt the threat. You do not clear rooms. You do not create your own tactical plan. You protect life inside your role.",
      },
      {
        heading: "This Is Not Tactical Training",
        body: "Safety Team Level 1 does not teach armed response, room clearing, building clearing, tactical movement, contact teams, threat engagement, weapon handling, or physical-control methods.\n\nWhat This Course Teaches\n\nReadiness support - and that matters. In a violent intruder condition, role discipline matters more, not less.\n\nSpecialized Capabilities\n\nArmed or tactical programs require qualified instruction, written policy, leadership authorization, legal and insurance alignment, and ongoing training records.\n\nThe Rule\n\nDo not improvise a role you have not been trained, authorized, or assigned to perform. Stay in the lane.",
        tip: "Stay in the lane.",
      },
      {
        heading: "Recognize Immediate Threat Indicators",
        body: "Act on Credible Information\n\nThe Safety Team does not need perfect certainty before acting on credible immediate danger. Delay can increase harm.\n\n- Weapon seen or credibly reported\n- Gunfire heard\n- Person threatening violence or assault in progress\n- Forced entry or attempted abduction\n- Movement toward children's areas with harmful intent\n- Law enforcement direction to secure in place\n\nDo not downgrade a weapon report because you did not see it personally. Report what was seen, heard, or reported - where it is, who is affected, and what protective action is underway.",
        tip: "Delay can increase harm.",
      },
      {
        heading: "Lockdown or Evacuate Depends on Conditions",
        body: "There is no single answer. Conditions control the response. The question is always: What protects life right now?\n\nLockdown\n\nThreat is inside or may enter the area. A secure room is available and nearby. Moving would increase exposure.\n\nEvacuate\n\nA safe exit away from the threat is available. Movement away from danger is faster and safer than securing in place.\n\nImmediate Redirect\n\nPeople are in open areas - lobbies, hallways, check-in. Move them fast into a securable space or toward a safe exit.\n\nA group near a secure classroom may need Lockdown. A group near a safe exit away from the threat may need to leave. Do not assume one answer fits every condition.",
        tip: "What protects life right now?",
      },
      {
        heading: "Use Direct Emergency Language",
        body: "Immediate threat communication must be direct and actionable. Give the instruction people can follow - then report facts when safe.\n\nSay This\n\n- \"Lockdown now.\"\n- \"Move away from the lobby.\"\n- \"Get inside this room now.\"\n- \"Secure the door.\"\n- \"Stay quiet. Do not open the door.\"\n- \"Call 911 when safe.\"\n- \"Go out that exit now.\"\n\nNot This\n\n- \"Something weird is happening.\"\n- \"Be on alert.\"\n- \"We may have an issue.\"\n- \"Can someone check this out?\"\n\nVague language creates hesitation. Hesitation costs time. A violent intruder concern requires action language - not questions.",
        tip: "Vague language creates hesitation. Hesitation costs time.",
      },
      {
        heading: "If You Are Near a Secure Space",
        body: "Close and Lock\n\nSecure the door if possible. Do not stand in the doorway or look into the hallway.\n\nReduce Exposure\n\nMove people away from doors, windows, and lines of sight. Keep people low. Silence phones. Reduce noise.\n\nStop Movement\n\nNo unnecessary movement. Call 911 when safe. Do not open the door for knocking, voices, or claims that everything is fine.\n\nWait for Verified All-Clear\n\nThe door opens only through the church's verified all-clear process or lawful responder direction.",
      },
      {
        heading: "If You Are in an Open Area",
        body: "Lobbies, sanctuaries, gyms, fellowship halls, and parking lots may not provide immediate secure-room protection. Open areas require fast decisions.\n\nDirect Immediately\n\n\"Move away from the lobby now.\" \"Get inside this room.\" \"Go through that exit.\" \"Stay low and move.\"\n\nDo Not Freeze\n\nDo not gather people in the open to explain. Do not send people toward the threat. Use the safest available action under the conditions.\n\nDecide Based on Location\n\nSafe exit available - Move away. Secure room nearby - Lockdown. Lobby that cannot be secured - Move people fast.",
        tip: "Open areas require fast decisions.",
      },
      {
        heading: "Children's and Youth Areas",
        body: "Immediate Protective Action Required\n\nWorkers secure rooms per church practice. Children move out of sight and stay quiet. Accountability happens when the room is stable enough.\n\nDo not release children to parents during an active threat. Do not open children's areas because a parent is knocking, calling, or demanding entry.\n\nSafety Team Support Role\n\n- Support nearby access points\n- Communicate threat information\n- Prevent hallway movement\n- Report status when possible\n\nLockdown is not pickup. It is life protection.",
        tip: "Lockdown is not pickup. It is life protection.",
      },
      {
        heading: "Parent Movement During Immediate Threat",
        body: "Parents want their children. Expect it. But uncontrolled parent movement during a violent intruder condition can increase danger for everyone.\n\nSay This - Calmly and Briefly\n\n- \"Lockdown is active. Stay secured.\"\n- \"Do not enter the hallway.\"\n- \"Children are secured by their workers.\"\n- \"Wait for verified all-clear.\"\n\nHold the Line\n\nDo not argue. Do not open secured areas casually. Do not let emotional pressure break the protective action.\n\nCompassion matters - but protection and accountability come first. A calm, brief response is the most caring thing you can do in that moment.",
        tip: "Compassion matters - but protection and accountability come first.",
      },
      {
        heading: "Call or Confirm 911 When Safe",
        body: "Assign the Call\n\nYou call 911 now - tell me when connected.\n\nGive Key Facts\n\nName, address, threat, weapons, injuries.\n\nStay on Line\n\nDo not hang up unless told or unsafe.\n\nIf speaking creates danger, stay quiet and follow dispatcher instructions as safely as possible. Do not guess. Assign clearly so 911 is confirmed without duplication or delay.",
      },
      {
        heading: "Report Status When Safe",
        body: "Communication during an immediate threat must be short and useful. Report only what helps protect life, supports 911, or informs leadership and responders.\n\nExample Reports\n\n- \"Lockdown. Weapon reported near east lobby. Children's hallway secured.\"\n- \"Shots heard outside north entrance. Locked down in Room 104. Eight adults. No injuries here.\"\n- \"Room 204 secured. Twelve children, three workers. No injuries. Staying quiet.\"\n\nKeep the Channel Clear\n\n- Use facts - not questions, rumors, or speculation\n- Do not broadcast hiding locations widely unless necessary\n- Location, status, injuries, and needs - that is the format",
        tip: "Communication during an immediate threat must be short and useful.",
      },
      {
        heading: "Do Not Move Toward the Threat",
        body: "Your role is protection, communication, and handoff - not investigation or confrontation.\n\nNever Do This\n\nSearch the building. Clear rooms. Pursue. Disarm. Confront. Create a contact team. Act as law enforcement.\n\nIf Threat Is Near\n\nMove away. Secure a door. Direct people out of sight. Use distance and barriers. Escape away from danger. Call 911 when safe.\n\nThis Course Teaches\n\nDecisive, role-correct protection - communication, movement, securing, and handoff. Do not freeze. Do not freelance.",
        tip: "Do not freeze. Do not freelance.",
      },
      {
        heading: "When Law Enforcement Arrives",
        body: "Their First Priority Is the Threat\n\nOfficers may not stop to comfort people, answer questions, or explain what is happening. They may not know who belongs to the church.\n\nFollow Commands - Give Facts\n\n- Keep hands visible if directed\n- Do not run toward or grab officers\n- Do not point objects at officers\n- Do not argue\n\n\"Threat reported near east lobby.\" \"Children's ministry locked down - north hallway.\" \"One injured adult in the sanctuary.\" \"Main office has cameras.\" Then follow direction. Support responders. Do not compete with them.",
        tip: "Support responders. Do not compete with them.",
      },
      {
        heading: "The All-Clear Must Be Verified",
        body: "The all-clear is a process - not a feeling.\n\nDo Not Self-Release\n\nDo not leave because time has passed. Do not open because the hallway sounds quiet. Do not open because someone says \"It's over\" without verification.\n\nVerified Sources Only\n\nThe all-clear comes from church leadership, law enforcement, or the church's established emergency process - not rumor, social media, or hallway noise.\n\nWhy It Matters\n\nUnverified release can expose people to danger, confuse law enforcement, disrupt accountability, and increase harm. Stay protected until release is confirmed.",
        tip: "The all-clear is a process - not a feeling.",
      },
      {
        heading: "Recovery After Immediate Threat",
        body: "After release, the response is not over. People may be injured, missing, or in need of immediate support. Recovery requires discipline.\n\nReunification\n\nSupport controlled parent-child reunification. Keep routes clear. Prevent uncontrolled rush into children's areas.\n\nDocumentation\n\nPreserve incident information. Assist leadership with accountability reports. Law enforcement may need witnesses, video, or statements.\n\nSupport\n\nPeople may need medical, emotional, or pastoral support. Prevent re-entry into closed areas. Assist leadership with coordination.\n\nCommunication Discipline\n\nDo not spread rumors. Do not post details publicly. Share only what leadership has authorized.",
        tip: "Recovery requires discipline.",
      },
      {
        heading: "What Not To Do",
        body: "Do Not Escalate or Investigate\n\n- Treat every disturbance as violent intruder\n- Move toward the threat to see what's happening\n- Search, sweep, or clear rooms\n- Create tactical plans\n\nDo Not Break Protection\n\n- Open secured doors casually\n- Release children during an active threat\n- Announce an all-clear without verification\n- Disappear after release\n\nDo not confront, disarm, pursue, detain, restrain, or physically control anyone as part of this training. Do not compete with law enforcement.\n\nStay In Role\n\nProtect life. Support communication. Support accountability. Support recovery. Role discipline is what separates a trained Safety Team from a dangerous improvisation.",
        tip: "Role discipline is what separates a trained Safety Team from a dangerous improvisation.",
      },
      {
        heading: "Bottom Line",
        body: "Violent intruder and immediate threat conditions require immediate protective action. The practical question is always: What protects life right now?\n\n1. Alert\n\nUse direct language. Report facts. Assign 911.\n\n2. Secure or Evacuate\n\nConditions control the decision. Lockdown, evacuate, or redirect based on what protects life.\n\n3. Protect Vulnerable Areas\n\nSupport children's areas. Stop hallway movement. Reduce exposure.\n\n4. Hand Off\n\nFollow law enforcement direction. Report facts. Wait for verified all-clear. Support recovery.\n\nA reliable Safety Team member acts quickly, stays disciplined, and protects life inside the role. You do not hunt. You do not clear. You do not engage. You protect.",
        tip: "You do not hunt. You do not clear. You do not engage. You protect.",
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
    estMinutes: 19,
    objectives: [
      "Support leadership and give clean handoffs to EMS, police, and fire",
      "Run controlled reunification and re-entry",
      "Document factually and debrief to improve",
    ],
    sections: [
      {
        heading: "The Response Is Not Over When the Loudest Part Is Over",
        body: "After the urgent moment passes, the church still needs leadership decisions, responder coordination, accountability, reunification, documentation, and pastoral care. A reliable Safety Team member helps the church finish well - staying useful until released, reassigned, or the response is fully handed off.",
      },
      {
        heading: "Stay in Your Operating Lane During Recovery",
        body: "Your role is to support - not take over. Safety Team members maintain clear handoff, controlled access, movement, accountability, documentation, and recovery.\n\nDo Not\n\n- Take over leadership decisions\n- Command emergency responders\n- Diagnose medical conditions\n- Release private information\n- Write opinions as facts\n- Disappear once urgency drops\n\nDo This\n\n- Support controlled access and movement\n- Maintain accountability\n- Document observable facts\n- Support clean responder handoff\n- Stay steady, factual, and role-correct",
      },
      {
        heading: "Leadership Makes Leadership Decisions",
        body: "Some decisions belong exclusively to leadership - pausing a service, closing an area, notifying parents, contacting legal counsel, or requesting outside support.\n\nYour role: Provide facts and support action. Do not become the decision-maker simply because you saw the incident first.\n\nGive useful, calm information. Then support the decision made - unless conditions change and create immediate danger. If they do, report the facts immediately.",
        tip: "Your role: Provide facts and support action. Do not become the decision-maker simply because you saw the incident first.",
      },
      {
        heading: "Give Leadership Useful Information",
        body: "Leadership needs facts, not drama. Vague information slows the response. Clear information helps leadership decide quickly.\n\nReport These Facts\n\n- Who is involved and what happened\n- Where it happened and current risk level\n- Actions already taken\n- Whether 911 was called and if responders are on scene\n- Whether children or vulnerable people are affected\n- Any remaining access, privacy, or accountability issues\n\nExample Handoff\n\n\"Medical emergency in the sanctuary center aisle. EMS is on the way. We need the south entrance kept clear and a leader with the family.\"\n\nCondition, Location, Current action, Next support need",
        tip: "Leadership needs facts, not drama.",
      },
      {
        heading: "Working With Emergency Responders",
        body: "When responders arrive, your role shifts. Support their work - do not compete with it.\n\n- Direct: Guide responders to the correct entrance and keep routes clear.\n- Inform: Identify who has information and provide facts about what happened.\n- Defer: Once responders are on scene, step back. Your Safety Team role does not make you part of the official emergency response.",
      },
      {
        heading: "Give a Clean Responder Handoff",
        body: "Handoff should be short, factual, and useful. Give responders what they need - then give them room to work.\n\nInclude in Your Handoff\n\n- What happened and where\n- Who is involved and whether anyone is injured\n- Actions already taken\n- Whether anyone is missing\n- Whether children or vulnerable people are affected\n- Where church leadership is located\n\nExample\n\n\"Fire alarm activated, smoke reported near the kitchen hallway. Building is evacuated. Children's ministry is accounted for in the west parking area. One adult reported trouble breathing. Leadership is at the main entrance.\"",
        tip: "Handoff should be short, factual, and useful.",
      },
      {
        heading: "EMS Handoff",
        body: "EMS handoff should be clear and brief. Tell them what they need to act - then step back.\n\nPatient Info\n\nWho is involved, current condition as observed, conscious and breathing if known, when condition started\n\nScene Info\n\nWhat happened, whether trained medical volunteers responded, whether AED or first aid kit was used, whether family is present\n\nDo not crowd the patient. Do not repeat private medical details to uninvolved people.",
        tip: "Do not crowd the patient. Do not repeat private medical details to uninvolved people.",
      },
      {
        heading: "Law Enforcement Handoff",
        body: "Give facts. Say what you saw, heard, or were told. Do not guess motive, embellish, or label anyone as having committed a crime unless law enforcement has established that.\n\nLocation & Involvement\n\nWhere the concern happened, who was involved, whether anyone was injured\n\nThreat Information\n\nWhether a threat was made, whether a weapon was seen or reported, whether a person left the property\n\nVulnerable People\n\nWhether children or vulnerable people were affected, and who has direct knowledge of the incident\n\nPreserved Evidence\n\nIf video, witnesses, messages, or written threats exist, report them to leadership and law enforcement through the proper process",
      },
      {
        heading: "Fire or Hazard Handoff",
        body: "Focus on location, condition, movement, and accountability. Responders determine the hazard - the Safety Team supports access, information, and re-entry control.\n\nReport\n\nWhat was seen, smelled, or heard, Specific location, Whether evacuation occurred, Anyone injured, missing, or symptomatic\n\nTell Responders\n\nWhether anyone may still be inside, Which doors and routes are available, Where leadership is located\n\nDo Not\n\nSpeculate about the cause, Declare the building safe, Allow re-entry until the proper all-clear is given",
      },
      {
        heading: "Preserve Privacy During Handoff",
        body: "Not everyone needs to hear everything. Share what is needed - with the people who need it.\n\n- Medical conditions: Do not become lobby announcements.\n- Child-related concerns: Should not be repeated to uninvolved people.\n- Pastoral or family issues: Should not become gossip or volunteer conversation.\n\nThe Safety Team should not become a rumor pipeline. Protecting people includes protecting their information.",
        tip: "The Safety Team should not become a rumor pipeline. Protecting people includes protecting their information.",
      },
      {
        heading: "Accountability Begins After Emergency Action",
        body: "Evacuation is not complete just because people are outside. Lockdown is not complete just because doors are closed. The church needs to know who is present, missing, injured, extra, or in need of help.\n\n- Identify Gaps: Flag missing, injured, or extra people.\n- Relay Concerns: Report critical issues to leadership immediately.\n- Collect Reports: Gather status from each area.\n- Support Recovery: Keep areas clear and assist coordination.\n\nIf someone is missing, injured, extra, separated, or unaccounted for - report it immediately. Accountability is part of recovery.",
        tip: "If someone is missing, injured, extra, separated, or unaccounted for - report it immediately. Accountability is part of recovery.",
      },
      {
        heading: "Children's Accountability Requires Special Discipline",
        body: "After any disruption near children's ministry, children must remain accounted for. The emergency may be over - but accountability can still fail at the end.\n\nDo Not\n\n- Release children casually\n- Allow parents to bypass the process\n- Let reunification happen randomly in hallways\n\nDo This\n\n- Support the approved process\n- Keep routes and release areas orderly\n- Report missing, extra, or unaccounted children immediately",
      },
      {
        heading: "Reunification Is Controlled Release",
        body: "Reunification means returning children, students, or separated people to the right person, in the right way, after emergency movement or disruption.\n\nParents may be worried, impatient, or frightened. The Safety Team supports the process - not shortcuts around it.\n\nControlled release is not bureaucracy. It is protection - for children, parents, workers, and the church.\n\nDo not shortcut reunification to reduce pressure. That shortcut may feel helpful in the moment but creates accountability failures.",
        tip: "Controlled release is not bureaucracy. It is protection - for children, parents, workers, and the church.",
      },
      {
        heading: "Use Clear Language During Reunification",
        body: "Consistency matters. If every Safety Team member says something different, frustration and movement problems increase.\n\n- \"Children will be released through the reunification process.\"\n- \"Please stay in this line. We need this doorway clear.\"\n- \"Please wait while the children's ministry leader verifies release.\"\n- \"Leadership will update everyone as soon as possible.\"\n\nDo not argue with parents. Do not make promises. Do not release children outside the approved process.",
        tip: "Do not argue with parents. Do not make promises. Do not release children outside the approved process.",
      },
      {
        heading: "Control Closed Areas and Re-Entry",
        body: "Why Areas Stay Closed\n\n- Medical scenes need privacy\n- Hazardous areas may be unsafe\n- Hallways may need to stay clear for responders\n- Rooms may contain information leadership or responders need preserved\n\nDo not open access on your own - even for urgent requests. Report them to leadership or responders.\n\nWhat to Say\n\n\"This area is closed right now.\"\n\n\"Please wait for leadership direction.\"\n\n\"Emergency responders are still working.\"\n\n\"We are not re-entering until the all-clear is given.\"",
        tip: "Do not open access on your own - even for urgent requests. Report them to leadership or responders.",
      },
      {
        heading: "Preserve Useful Information",
        body: "Some information may matter long after the immediate response ends. Preserve it - do not alter, delete, or casually forward messages, threats, photos, video, or reports.\n\n- Timeline Details: Time of incident, when 911 was called, when responders arrived\n- Location & People: Where it happened, who was involved, who reported the concern, whether children's ministry was affected\n- Actions Taken: What steps were taken, whether anyone was injured or missing, whether access or accountability problems occurred\n\nPreserve useful information through the right leadership or responder pathway. Do not spread it.",
        tip: "Preserve useful information through the right leadership or responder pathway. Do not spread it.",
      },
      {
        heading: "Documentation Should Be Factual",
        body: "Write observable facts. Documentation should help the church understand what happened and improve the response.\n\nExample Factual Note\n\n\"Adult male refused direction at children's hallway, raised his voice, and moved closer to the check-in worker. Safety Team support was called. Children's ministry leader responded. Person left the building at approximately 10:42.\"\n\nFactual, Supports review, Avoids accusation beyond what was observed\n\nWrite This\n\nWhat you saw, What you heard, What was reported, Times, Actions taken\n\nNot This\n\nGuesses, Diagnoses, Assigned motive, Emotional language, Exaggeration or minimization",
      },
      {
        heading: "Support People After the Incident",
        body: "Recovery is not only logistics. People may need care - and they will remember how the church responded.\n\nPeople Who May Need Support\n\n- Injured individuals and frightened families\n- Upset children and shaken volunteers\n- Medical volunteers who need time to reset\n- Workers involved in a confrontation\n\nHow You Can Help\n\n- Create calm and privacy\n- Connect people to leadership or pastoral support\n- Help communicate clear next steps\n- Stay present without overstepping\n\nSafety Team members are not counselors by default - but you can create the conditions for care.",
        tip: "Safety Team members are not counselors by default - but you can create the conditions for care.",
      },
      {
        heading: "Debrief and Improve",
        body: "A response should produce learning. Participate with facts - not blame, not self-promotion, not hidden problems. The goal is a better response next time.\n\n- What Worked\n- What Was Delayed\n- What Confused Us\n- What Must Change\n\nA reliable Safety Team member helps the church get better - even when the debrief is uncomfortable.",
        tip: "A reliable Safety Team member helps the church get better - even when the debrief is uncomfortable.",
      },
      {
        heading: "What Not To Do",
        body: "During the Response\n\n- Do not disappear after urgency drops\n- Do not take over leadership decisions\n- Do not command responders\n- Do not speculate on cause, motive, or fault\n\nWith People & Information\n\n- Do not release private information broadly\n- Do not allow casual child release\n- Do not allow uncontrolled re-entry\n- Do not let bystanders crowd scenes\n\nAfter the Incident\n\n- Do not write opinions as facts\n- Do not skip documentation\n- Do not turn the debrief into blame",
      },
      {
        heading: "Bottom Line",
        body: "The response is not over until it is fully handed off. Stay disciplined through every phase.\n\n- Inform Leadership: Facts only. Support decisions made.\n- Support Responders: Clean handoffs. Clear access. Step back.\n- Protect People: Privacy, reunification, re-entry control, and care.\n- Document & Improve: Factual notes. Honest debrief. Better next time.\n\nA reliable Safety Team member stays disciplined, stays useful, and helps the church finish well - every time.",
        tip: "A reliable Safety Team member stays disciplined, stays useful, and helps the church finish well - every time.",
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

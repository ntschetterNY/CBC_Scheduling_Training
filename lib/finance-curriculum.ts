/**
 * CrossBridge Church (CBC) — Personal Finance Training Curriculum
 * ---------------------------------------------------------------
 * ⚠️ ROUGH DRAFT. A first pass at a money track for the whole congregation,
 * modeled on the structure Dave Ramsey teaches (a small starter fund, a debt
 * snowball, a full emergency fund, then investing, kids' college, the house,
 * and generosity) with two deliberate CrossBridge changes:
 *
 *   1. CREDIT — we do not teach "cut every card up and live without a credit
 *      score." We teach: debt is still debt, a carried balance is off the
 *      table, and IF you use credit, you treat it as cash — the money is
 *      already in the bank before you swipe, and the statement is paid in
 *      full every month. See `money-credit-as-cash`.
 *   2. ROTH vs TRADITIONAL — we do not teach Roth-only. We teach building a
 *      MIX of tax buckets, because a large tax-deferred balance becomes a
 *      required-minimum-distribution problem later. See
 *      `money-roth-traditional`.
 *
 * This track is financial EDUCATION, not licensed financial, tax, or legal
 * advice, and nothing here is a solicitation. Dollar figures and age
 * thresholds are current as of the 2026 tax year and change — every place one
 * appears the lesson says to verify it at irs.gov or with a tax professional
 * before acting.
 *
 * It reuses the Module / LessonSection / QuizQuestion / TrainingPhase types
 * from the Sound Tech curriculum so it renders through the same ModuleRunner.
 * Section visuals whose key starts with "money-" are drawn by
 * components/FinanceVisual.tsx — LessonVisual delegates those keys to it.
 *
 * To edit a lesson: change its `sections`. To add a module: append to
 * `financeCurriculum` and list its slug in a phase at the bottom of the file.
 */

import type { Module, TrainingPhase, ResolvedPhase } from "./curriculum";

export const financeCurriculum: Module[] = [
  // ── Chapter 1 · Start Here ───────────────────────────────────────────────
  {
    slug: "money-why",
    order: 1,
    title: "Why the Church Teaches Money",
    subtitle:
      "What this track is, the seven steps it walks, and the two places we do it differently.",
    icon: "💵",
    estMinutes: 10,
    objectives: [
      "Say why money is a discipleship issue and not just a math issue",
      "Name the seven steps in order and why the order matters",
      "Know the two places this track departs from the plan it is modeled on",
    ],
    sections: [
      {
        heading: "Money is a heart issue with a spreadsheet attached",
        body: "Jesus talked about money constantly — not because the kingdom needs your paycheck, but because your money tells the truth about what you trust. A budget is a spiritual document. It shows, in numbers, what you actually believe is worth your one life.\n\nSo this is not a get-rich course. It is a get-free course. Free from the payment that owns your Tuesday, free from the fight that starts every time the statement arrives, free to say yes when someone in this church needs help.\n\nAnd it is not a course about being smarter than you are. Personal finance is mostly behavior, not math. Nobody in debt is there because they could not do fifth-grade arithmetic. They are there because life is loud, credit is easy, and no one ever handed them a plan. This is the plan.",
        visual: "money-seven-steps",
      },
      {
        heading: "The seven steps",
        body: "You work these ONE AT A TIME, in order, with focused intensity. Doing step four while still on step two feels productive and is the single most common way people stay stuck for a decade.\n\n1. SAVE $1,000 as a starter emergency fund. Fast — weeks, not months.\n2. PAY OFF ALL DEBT except the house, smallest balance to largest. This is the snowball.\n3. SAVE 3–6 MONTHS of expenses in a full emergency fund.\n4. INVEST 15% of your gross income for retirement — across a deliberate mix of tax-now and tax-later accounts.\n5. SAVE for your kids' education, if you have kids and you choose to.\n6. PAY OFF THE HOUSE early.\n7. BUILD WEALTH AND GIVE. This is the point. Everything before it is clearing the runway.\n\nSteps 1 through 3 are defense. Steps 4 through 7 are offense. Most people try to play offense with no defense, which is why one transmission failure undoes three years of progress.",
        tip: "One step at a time is the whole trick. Intensity beats intelligence here — a person doing step two with their hair on fire beats a person doing all seven politely.",
      },
      {
        heading: "Where we do it differently",
        body: "This track is modeled on Dave Ramsey's baby steps, and we think the structure is excellent: it is simple, it is sequenced, and it works for real people under real pressure. We teach it with two deliberate changes, and we tell you where they are rather than hiding them.\n\n- CREDIT. The standard teaching is to close every card, cut them up, and be proud of having no credit score. We agree completely that debt is a trap and that a carried balance is never acceptable. We stop short of the scissors. Our rule is: IF YOU USE CREDIT, TREAT IT AS CASH. The money is already sitting in your checking account before you swipe, and the statement gets paid in full, every month, no exceptions. If that is not true for you — if a single month gets away from you — the card goes away. There is a whole module on this.\n- ROTH vs TRADITIONAL. The standard teaching leans hard toward Roth for everything. We teach a MIX. A very large tax-deferred balance turns into a tax problem the year required minimum distributions start, and a mix of accounts gives you a dial to turn in retirement instead of a bill you cannot refuse. There is a whole module on that too.\n\nEverything else — the starter fund, the snowball, the full emergency fund, 15% invested, the paid-off house, the generosity — we teach essentially as written, because it works.",
      },
      {
        heading: "What this is not",
        body: "Read this part slowly, because it matters.\n\nThis is financial EDUCATION from a church, taught by volunteers. It is not licensed financial, tax, investment, or legal advice, and no one at CrossBridge is being paid a commission on anything you do with your money. Nobody here sells investments. Nobody here gets a referral fee.\n\nBefore you make a big, hard-to-reverse decision — a Roth conversion, a rollover, a mortgage refinance, a change to your will — talk to a professional who is fiduciary to you: a CPA or enrolled agent for taxes, a fee-only fiduciary advisor for investments, an estate attorney for documents.\n\nAnd every dollar figure in this track — contribution limits, HSA limits, the age required minimum distributions begin — is current for the 2026 tax year and changes over time. Every place one appears, verify it at irs.gov before you act on it.",
        tip: "If a person teaching you about money makes money based on what you decide, that is not automatically wrong — but you need to know it. Ask anyone advising you: how are you paid?",
      },
      {
        heading: "How to work this track",
        body: "Each module is a set of short lessons and then a quiz. Read the lesson, then do the thing it asks you to do with your actual numbers — this track is worthless as reading and life-changing as homework.\n\n- Work the modules in order. Chapter two assumes chapter one is done.\n- Pass the quiz (70%) to mark a module complete; your progress saves automatically.\n- Do the work with your spouse if you are married. Both of you. Every time. A plan one spouse built alone is a plan the other spouse will quietly ignore.\n- Expect the first ninety days to be uncomfortable. Every budget's first three months are wrong. That is normal, and it is not a reason to quit.\n\nIf you get stuck — genuinely stuck, not just discouraged — ask. The church would rather walk with you now than help you clean up later.",
      },
    ],
    quiz: [
      {
        question: "Why do we say personal finance is mostly behavior, not math?",
        options: [
          "Because the math is too complicated for most people",
          "Because people in debt usually got there through habits and pressure, not an inability to do arithmetic",
          "Because interest rates do not really matter",
          "Because budgeting apps do the math for you",
        ],
        answer: 1,
        explanation:
          "Almost nobody is in debt because the arithmetic defeated them. They are there because life is loud, credit is easy, and no one gave them a plan. Change the behavior and the math follows.",
      },
      {
        question: "What is step 2 of the seven steps?",
        options: [
          "Invest 15% of your income",
          "Save 3–6 months of expenses",
          "Pay off all debt except the house, smallest balance to largest",
          "Pay off the house early",
        ],
        answer: 2,
        explanation:
          "Step 1 is the $1,000 starter fund; step 2 is the debt snowball — everything but the mortgage, smallest balance first. The full 3–6 month emergency fund is step 3.",
      },
      {
        question: "Which two things does this track teach differently from the plan it is modeled on?",
        options: [
          "The order of the steps, and how big the emergency fund should be",
          "How credit cards are handled, and mixing Roth with traditional retirement accounts",
          "Whether to budget, and whether to give",
          "The size of the starter fund, and the debt payoff order",
        ],
        answer: 1,
        explanation:
          "We teach 'if you use credit, treat it as cash' rather than cutting up every card, and we teach a deliberate mix of Roth and traditional accounts rather than Roth for everything. The rest of the structure we teach as written.",
      },
      {
        question: "Someone asks whether they should do a large Roth conversion. What does this track tell them?",
        options: [
          "Follow the module's rule of thumb and convert",
          "Ask a church volunteer to run the numbers for them",
          "Take it to a CPA or fee-only fiduciary advisor — this track is education, not licensed advice",
          "Never do a conversion under any circumstances",
        ],
        answer: 2,
        explanation:
          "This is a church education track taught by volunteers. Big, hard-to-reverse moves — conversions, rollovers, refinances, estate documents — belong with a professional who is fiduciary to you.",
      },
      {
        question: "Why do we insist on working one step at a time?",
        options: [
          "Because doing several at once is mathematically impossible",
          "Because focused intensity finishes steps, while spreading effort across all of them keeps people stuck for years",
          "Because the steps must each take exactly one year",
          "Because the software only tracks one step",
        ],
        answer: 1,
        explanation:
          "Working step four while still on step two feels productive and is the most common way people stall. Intensity on one step at a time is what actually finishes them.",
      },
    ],
  },

  {
    slug: "money-where-you-are",
    order: 2,
    title: "Tell Yourself the Truth",
    subtitle:
      "The honest inventory: what you own, what you owe, what comes in, and where it actually goes.",
    icon: "🧭",
    estMinutes: 12,
    objectives: [
      "Calculate your net worth and read it without flinching",
      "Build a complete debt list with balance, minimum payment, and rate",
      "Find out where your money actually went over the last 90 days",
    ],
    sections: [
      {
        heading: "You cannot fix a number you refuse to look at",
        body: "Most people know roughly what they make and have no idea what they owe. They know the payments — car payment, minimum, student loan — because payments show up monthly and demand attention. The BALANCES stay comfortably vague.\n\nThat vagueness is expensive. It is also, for a lot of us, deliberate: looking straight at the number feels like standing on a scale after a bad year.\n\nDo it anyway, and do it once, thoroughly. The number is not a verdict on you. It is a starting line. Every person who has ever gotten out started exactly here, with a number they did not want to write down.",
        tip: "If you are married, do this together in one sitting, with no interruptions and no blame. The rule for the hour: whoever is telling the truth is not in trouble.",
      },
      {
        heading: "Net worth in fifteen minutes",
        body: "Net worth is one subtraction: everything you own minus everything you owe. It is the single best measure of financial progress, because it moves when debt falls even if income never changes.\n\nWHAT YOU OWN (assets): cash in checking and savings; retirement accounts (401(k), 403(b), IRA); other investments; the honest resale value of your house and cars — what they would actually sell for this month, not what you paid or what you feel they are worth.\n\nWHAT YOU OWE (liabilities): mortgage, home equity line, car loans and leases, student loans, credit card balances, medical bills, personal loans, money borrowed from family, buy-now-pay-later balances, the payment plan on the furniture, back taxes.\n\nSubtract. Write down the date and the number. Then do it again on the same day every month — the trend line is what matters, and a negative number that is getting less negative is a person winning.",
        visual: "money-net-worth",
      },
      {
        heading: "The debt list",
        body: "Write out every debt, one row each, with four columns: WHO you owe, the BALANCE, the MINIMUM PAYMENT, and the INTEREST RATE. Do not skip the small ones and do not skip the embarrassing ones. The $340 you owe your brother-in-law goes on the list.\n\nGet real numbers, not remembered ones. Log in. Call. A statement in a drawer is not a number.\n\nMedical bills belong on the list even if no one is currently chasing you. Back taxes belong on the list and they go near the front no matter their size, because the IRS has collection tools other creditors do not have. If you owe taxes you cannot pay, call the IRS or an enrolled agent before you do anything else in this track — they have payment arrangements, and silence is the worst possible strategy.\n\nSort it smallest balance to largest and leave it that way. In two modules you will attack it in exactly that order.",
      },
      {
        heading: "Where it actually went",
        body: "Now the uncomfortable one. Open the last 90 days of your checking account and your cards, and put every transaction into a category: giving, housing, utilities, groceries, restaurants, transportation, insurance, debt payments, subscriptions, kids, clothes, entertainment, everything else.\n\nThree months, not one. One month is an anecdote; three is a pattern, and it catches the quarterly and annual charges people forget to plan for.\n\nTwo things almost always fall out of this exercise:\n\n- The restaurants-and-delivery number. It is always bigger than the guess. Not a moral failure — a data point.\n- The subscription pile. Streaming, apps, gym, cloud storage, the thing you signed up for in 2023. Cancel what you would not re-buy today, right now, while you are looking at it.\n\nAverage the three months by category. That average is the raw material for your first budget in the next module.",
        tip: "Do not fix anything yet. This step is measurement only. People who start cutting mid-count usually stop counting.",
      },
      {
        heading: "Pull your credit report",
        body: "Once a year, pull your credit reports from all three bureaus at annualcreditreport.com — the free, federally authorized site. Not a lookalike, not an app with a monthly fee.\n\nYou are looking for: accounts you do not recognize, balances that are wrong, debts already paid still showing open, and old collections. Errors are common and they are fixable — dispute them in writing with the bureau.\n\nWhile you are there, FREEZE your credit at all three bureaus (Equifax, Experian, TransUnion). It is free, it takes minutes, and it stops most new-account identity theft cold. You thaw it temporarily when you actually apply for something. If you have kids, freeze theirs too — child identity theft usually goes undiscovered until they apply for their first loan.",
      },
      {
        heading: "The shame conversation",
        body: "For some of you this module surfaced a number that made you feel sick. Here is the pastoral part, and it is not filler.\n\nDebt is a condition, not an identity. Being behind does not mean you are stupid, faithless, or a bad spouse. Plenty of it arrived through medical crises, layoffs, divorce, or a season where the only options were bad ones — and plenty of it arrived through decisions you would make differently now. Both of those get fixed the same way: a plan, worked in order, starting today.\n\nAnd secrecy is the multiplier. If you are hiding a card, an account, or a balance from your spouse, the hiding is doing more damage than the balance. Say it out loud this week. If that conversation feels impossible alone, ask a pastor to sit in it with you.",
      },
    ],
    quiz: [
      {
        question: "How is net worth calculated?",
        options: [
          "Annual income minus annual expenses",
          "Everything you own minus everything you owe",
          "The total of your retirement accounts",
          "Your credit score multiplied by your income",
        ],
        answer: 1,
        explanation:
          "Assets minus liabilities. It is the best single progress measure because it improves as debt falls, even if your income never changes.",
      },
      {
        question: "Why do we categorize 90 days of spending instead of one month?",
        options: [
          "Because banks only export 90 days",
          "One month is an anecdote; three months shows the pattern and catches quarterly and annual charges",
          "Because budgets are built quarterly",
          "To make the total look larger",
        ],
        answer: 1,
        explanation:
          "Three months reveals the real pattern and picks up the irregular charges — insurance, annual subscriptions, registrations — that a single month misses.",
      },
      {
        question: "Which debts belong on your debt list?",
        options: [
          "Only debts with interest",
          "Only debts reported to credit bureaus",
          "Every debt — including medical bills, back taxes, buy-now-pay-later, and money owed to family",
          "Only debts over $1,000",
        ],
        answer: 2,
        explanation:
          "All of it, including the small and embarrassing ones. Back taxes go near the front regardless of size, because the IRS has collection powers other creditors do not.",
      },
      {
        question: "Where should you pull your free annual credit reports?",
        options: [
          "annualcreditreport.com, the federally authorized site",
          "Any free credit score app",
          "Your bank's marketing email",
          "The credit card company that offers it for $19.99 a month",
        ],
        answer: 0,
        explanation:
          "annualcreditreport.com is the authorized source for free reports from all three bureaus. While you are there, freeze your credit at each bureau — it is free and stops most new-account identity theft.",
      },
    ],
  },

  {
    slug: "money-budget",
    order: 3,
    title: "The Zero-Based Budget",
    subtitle:
      "Give every dollar a job before the month starts — including the months your income is unpredictable.",
    icon: "📝",
    estMinutes: 15,
    objectives: [
      "Build a zero-based monthly budget where income minus outgo equals zero",
      "Name the Four Walls and fund them first in a short month",
      "Set up sinking funds so annual expenses stop being emergencies",
    ],
    sections: [
      {
        heading: "Zero-based means every dollar has a name",
        body: "A zero-based budget is not a spending limit. It is an assignment sheet: you list the income you expect this month, you assign every dollar of it to a category on paper BEFORE the month begins, and you keep assigning until income minus outgo equals exactly zero.\n\nZero does not mean you spent it all. Dollars assigned to savings, to the emergency fund, or to the debt snowball are assigned — they have a job, and the job is not 'sit in checking and get eaten.'\n\nThis is where the money actually gets found. Nearly everyone who does a real zero-based budget for the first time discovers several hundred dollars a month that had been leaking out with no name on it. That money was always yours. It just never had instructions.",
        visual: "money-zero-budget",
      },
      {
        heading: "The order you fund it",
        body: "Build the budget in this order, top to bottom. The order is doing real work: it puts the non-negotiables above the negotiables, so when the month is short, the cuts land where they should.\n\n1. GIVING. First, off the top, before anything else. This is a conviction, not a math result — more on it in the generosity module.\n2. SAVING. Whatever the current step calls for: the starter fund, the emergency fund, or investing.\n3. THE FOUR WALLS. Food, utilities, shelter, transportation. These come before every other bill in a bad month, and there is a section on that below.\n4. INSURANCE AND OTHER NECESSITIES. Premiums, required medications, childcare that lets you work.\n5. DEBT MINIMUMS. Every minimum payment on the list.\n6. EVERYTHING ELSE. Restaurants, subscriptions, clothes, entertainment, gifts, travel.\n7. THE EXTRA. Whatever remains goes at the current step with full force — usually the smallest debt.\n\nDo this before the first of the month, on paper or in an app, with your spouse. A budget written on the 14th is a report card, not a plan.",
      },
      {
        heading: "The Four Walls",
        body: "When there is not enough — a layoff, a slow month, a medical bill — you do not pay everyone a little. You pay the FOUR WALLS in full first:\n\n- FOOD. Groceries. Not restaurants.\n- UTILITIES. Power, water, gas, the phone you need to work.\n- SHELTER. Rent or mortgage, and the insurance and taxes attached to it.\n- TRANSPORTATION. Fuel and the minimum to keep a working vehicle running.\n\nEat, keep the lights on, stay in the house, get to work. Then, and only then, deal with the credit card company.\n\nThis inverts what panic tells you to do. Panic says pay whoever is calling loudest — and the loudest caller is almost never the landlord. Do not send the mortgage payment to a card because the card company was rude to you on the phone. And call your creditors before you miss a payment, not after: 'here is what I can pay this month' opens doors that silence closes.",
        tip: "Never borrow — from a card, a payday lender, or a 401(k) — to keep an unsecured creditor quiet. You are converting an annoying problem into a dangerous one.",
      },
      {
        heading: "Sinking funds kill the fake emergencies",
        body: "Car registration is not an emergency. Christmas is not an emergency. It happens on the same day every single year. These wreck budgets because they are annual and the budget is monthly.\n\nThe fix is a SINKING FUND: take the annual cost, divide by twelve, and set that aside every month so the bill arrives pre-paid.\n\nCommon ones: car registration and inspection, insurance premiums if you pay every six months, Christmas and birthdays, back-to-school, vacation, annual subscriptions, HOA dues, property taxes if they are not escrowed, vet care, and a CAR REPAIR fund — because your car will need something this year and the only unknown is what and when.\n\nKeep them in one savings account and track the categories on paper or in the app. You do not need eleven bank accounts; you need eleven line items.",
      },
      {
        heading: "Irregular income",
        body: "Commission, 1099, tips, seasonal work, or a small business — the zero-based budget still works, with one change: budget the LOW number, then spend the surplus on purpose.\n\n1. Look back over twelve months and find your lowest month. That is your baseline income.\n2. Build a bare-bones budget that survives on the baseline: Four Walls, insurance, debt minimums, giving.\n3. Write a PRIORITY LIST for extra money, in order, before it arrives — finish the starter fund, then the car debt, then the tax set-aside, then the vacation fund.\n4. When a big check lands, walk the list from the top. No new decisions in the moment of arrival.\n\nAnd if you are self-employed: set aside taxes off the top, every time, before the money feels like yours. Roughly a quarter to a third of net profit into a separate account, quarterly estimates paid on schedule. A surprise tax bill is the single most common way a small business owner ends up in debt.",
      },
      {
        heading: "The monthly budget meeting",
        body: "If you are married, this is a standing appointment, twenty to forty minutes, before the month starts. Not a negotiation about who spent what — a planning meeting about what the two of you will do next.\n\nSome rules that make it survivable:\n\n- Both of you are there, every time. The spender needs to see the constraints; the saver needs to see the human being.\n- Both of you get a personal spending line, equal and no-questions-asked, even if it is $25. A budget with zero fun in it fails, usually in about six weeks.\n- Nobody is on trial for last month. Look at what happened, adjust the categories, move on.\n- Neither of you has veto power by silence. 'Fine, whatever you want' is not agreement, and you will both find that out in three weeks.\n\nAnd expect the first three budgets to be wrong. Everyone forgets categories. Month one you are guessing, month two you are correcting, month three it starts to fit. Adjust the plan during the month when you need to — moving money between categories on purpose is budgeting, not failing.",
        tip: "Two adults, one plan, no secrets. Separate accounts can work; separate plans do not.",
      },
    ],
    quiz: [
      {
        question: "What does 'zero-based' mean?",
        options: [
          "You spend down to a zero balance every month",
          "Income minus every assigned dollar equals zero — including dollars assigned to saving and debt",
          "You start every month with zero savings",
          "You budget zero for entertainment",
        ],
        answer: 1,
        explanation:
          "Every dollar gets a job before the month starts. Money assigned to savings or the debt snowball is assigned — zero means nothing is left unnamed, not that nothing is left.",
      },
      {
        question: "What are the Four Walls, and when do they matter most?",
        options: [
          "Food, utilities, shelter, transportation — funded first when there is not enough to go around",
          "Rent, cable, phone, internet — the bills that come first every month",
          "The four categories you cut first in a short month",
          "Giving, saving, spending, investing",
        ],
        answer: 0,
        explanation:
          "Eat, keep the lights on, stay in the house, get to work. In a short month those get paid in full first — before unsecured creditors, no matter who is calling.",
      },
      {
        question: "Your car registration is due in October for $240. What is the budget answer?",
        options: [
          "Put it on a card and pay it off in November",
          "Treat it as an emergency and use the emergency fund",
          "A sinking fund — set aside $20 a month so it arrives pre-paid",
          "Skip a debt payment that month",
        ],
        answer: 2,
        explanation:
          "It happens on the same day every year, so it is not an emergency. Annual cost divided by twelve, set aside monthly, and the bill is already covered when it lands.",
      },
      {
        question: "How should someone on commission income build their budget?",
        options: [
          "Budget their best month and cut back if it falls short",
          "Budget their average month",
          "Budget their lowest month, then work a written priority list when extra money arrives",
          "Skip budgeting until the income stabilizes",
        ],
        answer: 2,
        explanation:
          "Bare-bones budget on the baseline low month, plus a priority list written in advance so surplus gets spent on purpose instead of in the moment.",
      },
      {
        question: "Why does every budget include a no-questions-asked personal spending line for each spouse?",
        options: [
          "Because it is required for the math to zero out",
          "Because a budget with no room for being human fails within a couple of months",
          "Because it replaces the entertainment category",
          "Because one spouse should control the other's spending",
        ],
        answer: 1,
        explanation:
          "Equal, small, no-explanation-required personal money keeps the plan livable. Airless budgets get abandoned, usually around week six.",
      },
    ],
  },
  // ── Chapter 2 · Dig Out ──────────────────────────────────────────────────
  {
    slug: "money-starter-fund",
    order: 4,
    title: "Step 1 — The $1,000 Starter Fund",
    subtitle:
      "A small, fast buffer that stops the next flat tire from becoming the next credit card balance.",
    icon: "🪣",
    estMinutes: 10,
    objectives: [
      "Explain why the starter fund is small and built fast",
      "Decide what counts as an emergency and what does not",
      "Choose where to keep it so it is available but not convenient",
    ],
    sections: [
      {
        heading: "Why $1,000, and why quickly",
        body: "Step one is a starter emergency fund of $1,000, saved as fast as you can — weeks, not months. If your household income is very low, $500 is a reasonable starting target; get to $1,000 as soon as you can.\n\nIt is deliberately small. This is not the fund that carries you through a layoff — that is step three, and it comes after the debt is gone. The starter fund has exactly one job: to stand between an ordinary bad day and your credit card.\n\nThat matters because the debt snowball only works if nothing keeps refilling the hole. Without a buffer, the first $400 surprise goes straight back on a card and three months of sacrifice evaporate. The starter fund is what makes step two finishable.\n\nAnd small-and-fast is doing psychological work too. A goal you can hit in three weeks proves to you that the plan moves. A twelve-month first goal loses most people by week five.",
        tip: "Sell something. A fast $1,000 usually comes from the garage, the marketplace app, and two weekends of extra work — not from trimming groceries for four months.",
      },
      {
        heading: "What counts as an emergency",
        body: "An emergency is UNEXPECTED, NECESSARY, and URGENT. All three. Miss one and it is not an emergency — it is a purchase you would like to make.\n\nYES: the transmission died and you need the car for work. The water heater flooded the utility room. An ER visit. A trip home for a parent's funeral. The income stopped.\n\nNO: Christmas. A wedding you have known about since March. Tires that have been bald for six months. A sale, however good. A vacation. The new phone, when the old phone works.\n\nThe honest test, asked out loud: 'If I do not spend this money today, what actually happens?' If the answer is 'I am disappointed' or 'I miss a deal,' it is not an emergency. If the answer is 'we have no heat' or 'I cannot get to work,' it is.\n\nWhen you do use it, you stop the snowball, refill the $1,000, and restart. That is the system working, not the system failing.",
      },
      {
        heading: "Where to keep it",
        body: "Available in a day or two, not available in ninety seconds. You want a little friction between an impulse and the money.\n\nGOOD: a separate savings account at your bank, or an online high-yield savings account. Separate from checking, so it never gets counted as spendable in your head.\n\nBAD: cash in the house in any amount (fire, theft, and the 2 a.m. pizza), your regular checking account, investments of any kind — including a brokerage account, crypto, or anything that can be worth 30% less on the exact day you need it — or a credit card described as 'my emergency fund.' A card is not an emergency fund; it is the thing an emergency fund exists to keep you away from.\n\nDo not chase yield here. The interest on $1,000 is not the point. Boring, liquid, and separate is the whole specification.",
      },
      {
        heading: "Getting to $1,000 this month",
        body: "Treat this like a sprint, not a savings habit. Concretely:\n\n- SELL THINGS. The unused kayak, the third TV, the exercise bike serving as a coat rack. Sell it this weekend.\n- PAUSE what can be paused. Subscriptions, restaurants, the barber upgrade, buying lunch. Temporarily — this is a season, not a personality change.\n- WORK EXTRA. Overtime, a short-term second job, a few weekends of delivery driving or side work. Most people get here fastest by adding income, not by shaving expenses.\n- REDIRECT windfalls. Tax refund, bonus, rebate, birthday money. Straight into the fund.\n- ONE THING YOU DO NOT DO: pause your giving to reach it faster. That trade is not worth it, and we will come back to why.\n\nWhen it is funded, stop. Do not roll straight into a bigger savings goal — the next dollar belongs to step two, and it belongs there with everything you have.",
        tip: "Set the target and the date on paper and tell somebody. A deadline you have said out loud to another human is worth about a month of willpower.",
      },
    ],
    quiz: [
      {
        question: "Why is the starter emergency fund only $1,000?",
        options: [
          "Because $1,000 covers most true emergencies",
          "Because it is small enough to build fast, and its only job is to keep an ordinary surprise off a credit card while you attack debt",
          "Because larger amounts are taxed",
          "Because most people cannot save more than that",
        ],
        answer: 1,
        explanation:
          "It is a buffer, not a safety net. The full 3–6 month fund is step three. Small and fast keeps the snowball from being refilled by every flat tire, and proves early that the plan moves.",
      },
      {
        question: "Which of these is a real emergency by the three-part test?",
        options: [
          "A very good sale on a laptop you have been wanting",
          "Christmas gifts",
          "The car's transmission failed and you need it to get to work",
          "New tires you have known you needed since spring",
        ],
        answer: 2,
        explanation:
          "Unexpected, necessary, and urgent — all three. Christmas and long-known tire wear are planning failures, not emergencies; they belong in sinking funds.",
      },
      {
        question: "Where should the starter fund live?",
        options: [
          "In a separate savings or high-yield savings account",
          "In cash at home for fastest access",
          "Invested in an index fund so it grows",
          "On a credit card kept for emergencies",
        ],
        answer: 0,
        explanation:
          "Liquid, boring, and separate from checking. Not cash at home, not invested where it can drop 30% the week you need it, and never a credit card.",
      },
      {
        question: "You use $600 of the starter fund on a genuine emergency. What now?",
        options: [
          "Restart the whole plan from module 1",
          "Keep the snowball going and rebuild the fund later",
          "Pause the snowball, refill the $1,000, then restart the snowball",
          "Move to step three early since the fund is depleted",
        ],
        answer: 2,
        explanation:
          "Pause, refill, resume. Using it for a real emergency is the system working exactly as designed — that is what kept the $600 off a card.",
      },
    ],
  },

  {
    slug: "money-debt-snowball",
    order: 5,
    title: "Step 2 — The Debt Snowball",
    subtitle:
      "Smallest balance to largest, with everything you have, until every debt but the house is gone.",
    icon: "⛄",
    estMinutes: 15,
    objectives: [
      "Order a debt list for the snowball and roll payments forward as debts die",
      "Explain why we sort by balance rather than interest rate",
      "Handle the special cases: cars, student loans, medical bills, and 401(k) loans",
    ],
    sections: [
      {
        heading: "How the snowball works",
        body: "Take the debt list you built and sort it by BALANCE, smallest to largest. Ignore the interest rates entirely for a moment.\n\n1. Pay the MINIMUM on every debt on the list.\n2. Throw every extra dollar you can find at the SMALLEST balance until it is dead.\n3. When it dies, take its whole payment — minimum plus extra — and add it to the next debt's minimum.\n4. Repeat. Each payoff makes the next payment bigger, which is why it is called a snowball. The last debt gets hit with a payment that would have looked impossible in month one.\n\nThe only exception to the ordering: back taxes and any debt with an imminent legal consequence — a car about to be repossessed, a house in foreclosure, a court judgment — go first regardless of size. Losing an asset or a wage garnishment beats any ordering advantage.\n\nThe mortgage is NOT in the snowball. That is step six.",
        visual: "money-snowball",
      },
      {
        heading: "Balance order, not interest order",
        body: "The obvious objection is correct: paying the highest interest rate first (the 'avalanche') saves more money on paper. On a typical debt list the difference is real but modest — often a few hundred dollars over the life of the payoff.\n\nWe sort by balance anyway, because the plan you finish beats the plan that is optimal. Killing a whole debt in six weeks does something to a household that saving $18 a month in interest does not: it produces a win, and wins produce momentum, and momentum is the scarce resource here. The number of debts shrinks visibly, minimum payments disappear, and the person who was overwhelmed in January can see the end by June.\n\nIf you are genuinely wired such that the higher rate will nag at you and the math is what keeps you going — run the avalanche. Both plans work. Neither one works if you quit. What does not work is switching methods every few months, which is really just a way of not attacking anything.",
        tip: "One real exception worth checking: a small balance at 29% and a slightly smaller one at 0% — pay the 29% first. Ties go to the higher rate.",
      },
      {
        heading: "Intensity is the whole strategy",
        body: "Step two typically takes eighteen to twenty-four months for a household that goes at it hard. It takes seven years for a household that goes at it politely. Same debt, same income. The variable is intensity.\n\nWhat intensity actually looks like:\n\n- The budget gets lean on purpose. Restaurants, travel, subscriptions, upgrades — paused. Not forever. For a season with an end date.\n- Extra income shows up. Overtime, a second job, side work, selling things that are not nailed down. Most fast payoffs are income stories, not coupon stories.\n- Every windfall goes to the snowball. Tax refund, bonus, inheritance, rebate.\n- No new debt. None. Not a card, not a payment plan, not 'zero percent for twelve months.' Digging while someone else is filling the hole is not a strategy.\n- Investing is paused, including your 401(k) match, for this season only. This is the most argued-over rule in the plan and it is worth understanding rather than just obeying: pausing costs you real match money, and the case for it is that the intensity of throwing everything at debt is what gets people out in two years instead of seven. If your match is large and your payoff is long, sit down with a fee-only advisor and make the call with your own numbers in front of you.\n\nTell people what you are doing. The friends who invite you on the trip cannot support a plan they do not know about.",
      },
      {
        heading: "The special cases",
        body: "CARS. A car payment is usually the biggest single obstacle in a household budget. If the car is worth more than the loan and the payment is crushing you, selling it and driving something paid-for for a year or two is the fastest single move available. Rule of thumb: the total value of the things you own with motors should not exceed about half your annual income. If you are upside down — you owe more than it is worth — you generally have to cover the gap to sell, so run the numbers before you decide. Do not trade it in on another loan.\n\nSTUDENT LOANS. They go in the snowball like everything else, by balance. Federal loans have real protections — income-driven plans, deferment, forgiveness programs for public service — so understand your options at studentaid.gov before refinancing federal loans into a private loan, because refinancing permanently gives those protections up.\n\nMEDICAL BILLS. Always ask for an itemized bill and check it; billing errors are common. Ask about financial assistance or charity care — many hospitals have programs that go unclaimed because nobody asks. Negotiate a payment plan directly with the provider (usually interest-free) rather than putting it on a card. Never put a medical bill on a card to make it go away.\n\n401(k) LOANS. Pay these off and never take another one. If you lose your job, the balance typically comes due fast, and if you cannot pay it, it becomes a distribution — taxes plus a penalty, at the worst possible moment. Never cash out or borrow from retirement to pay off consumer debt.\n\nDEBT SETTLEMENT AND CONSOLIDATION COMPANIES. Be extremely careful. Consolidation moves debt around and usually resets the clock at a longer term; settlement wrecks your credit, has tax consequences, and is full of predatory operators. Neither one changes the behavior that created the debt. If you are truly insolvent, talk to a nonprofit credit counselor (NFCC-affiliated) or a bankruptcy attorney — real professionals, not a company that found you through a mailer.",
      },
      {
        heading: "Keep it visible",
        body: "Put the debt list somewhere you both see it — the fridge, the bathroom mirror. Color in a thermometer. Cross debts off with a marker. This sounds childish and it works, because it converts an abstraction into a scoreboard.\n\nCelebrate the payoffs — cheaply. A $12 celebration for a $4,000 payoff is right. A weekend away is not; that is the debt coming back through the window.\n\nAnd when you slip — you will, at some point — you do not restart the plan. You restart the month. A blown week is a data point, not a verdict.",
        tip: "The last payment is worth a photo and a phone call to someone who has been walking with you. Finishing step two is the hinge the whole rest of this track swings on.",
      },
    ],
    quiz: [
      {
        question: "In the debt snowball, what happens when the smallest debt is paid off?",
        options: [
          "You lower your total monthly payment and enjoy the breathing room",
          "You add its entire payment to the next debt's minimum",
          "You start investing that amount",
          "You split it evenly across the remaining debts",
        ],
        answer: 1,
        explanation:
          "The freed-up payment rolls forward onto the next debt. That is the snowball — each payoff makes the next payment bigger, so the last debt gets hit hardest.",
      },
      {
        question: "Why do we sort by balance instead of by interest rate?",
        options: [
          "Because balance order always saves more money",
          "Because interest rates do not affect the total cost",
          "Because quick, visible wins build the momentum that gets people to the finish — and the finished plan beats the optimal one",
          "Because lenders require it",
        ],
        answer: 2,
        explanation:
          "The avalanche does save somewhat more on paper. We sort by balance because momentum is the scarce resource. Either method works; quitting is what does not.",
      },
      {
        question: "Which debt jumps the line regardless of its balance?",
        options: [
          "The one with the highest interest rate",
          "Back taxes and any debt facing imminent legal action, repossession, or foreclosure",
          "The newest debt",
          "The one owed to a family member",
        ],
        answer: 1,
        explanation:
          "The IRS and any creditor about to take an asset or garnish wages have powers ordinary creditors do not. Those go first no matter how small.",
      },
      {
        question: "A friend suggests taking a 401(k) loan to wipe out credit card debt. What is the answer?",
        options: [
          "Yes — the interest is paid back to yourself",
          "Yes, if the card rate is above 20%",
          "No — if you lose your job the balance comes due fast and can become a taxed, penalized distribution at the worst moment",
          "Only if you repay it within a year",
        ],
        answer: 2,
        explanation:
          "Never borrow from or cash out retirement to pay consumer debt. Job loss turns the loan into a distribution with taxes and penalties exactly when you can least afford it.",
      },
      {
        question: "What is the position on a debt consolidation loan during step two?",
        options: [
          "It is the fastest way through the snowball",
          "It is required before starting the snowball",
          "Be very careful — it moves debt around, usually at a longer term, and changes none of the behavior that created it",
          "It is fine as long as the rate is lower",
        ],
        answer: 2,
        explanation:
          "Consolidation rearranges debt and resets the clock; settlement companies are worse. If you are genuinely insolvent, see a nonprofit NFCC credit counselor or a bankruptcy attorney.",
      },
    ],
  },

  {
    slug: "money-credit-as-cash",
    order: 6,
    title: "Credit, Treated as Cash",
    subtitle:
      "Where we part ways with the scissors — the house rules that make a card safe, and when it has to go.",
    icon: "💳",
    estMinutes: 13,
    objectives: [
      "State the CrossBridge credit rule and the five house rules that enforce it",
      "Identify the forms of consumer credit that are always off the table",
      "Explain what a credit score is for and how to protect it without borrowing",
    ],
    sections: [
      {
        heading: "The rule",
        body: "This is the first place we depart from the plan this track is modeled on, and we want to be precise about how far the departure goes.\n\nWe agree with the standard teaching about the danger. Debt is a trap. A carried balance at 24% is a wealth-destroying machine. Nobody has ever borrowed their way to financial peace, and the rewards points do not come close to covering what the average cardholder pays in interest.\n\nWhere we differ is the conclusion. The standard teaching says close every account and be proud of having no credit score. We say something narrower and, we think, more honest about how people actually live:\n\nIF YOU USE CREDIT, TREAT IT AS CASH.\n\nThe money is already sitting in your checking account before you swipe. The statement is paid in full, every month, without exception. The card is a payment method, not a source of funds — a plastic version of a dollar you already have, not a way to buy Tuesday's groceries with Friday's paycheck.\n\nIf that is not true for you, this is not a debate. The card goes away.",
        visual: "money-credit-rules",
      },
      {
        heading: "The five house rules",
        body: "'Treat it as cash' is only meaningful if it is enforceable. Here is what enforces it.\n\n1. THE MONEY IS ALREADY THERE. Before you swipe, the dollars exist in checking and are already assigned in this month's budget. If the purchase is not in the budget, the card does not solve that — it just delays the argument.\n2. PAID IN FULL, EVERY MONTH. The statement balance, not the minimum, not 'most of it.' Autopay the full statement balance so a busy month cannot cost you 24%.\n3. ONE CARD. Not five. Not a store card at every checkout for the 10% off. One account, one statement, one thing to watch.\n4. YOU RECONCILE IT INSIDE THE BUDGET. Every charge lands in a budget category the same week it happens. A card you only look at on statement day is a card that is spending you.\n5. ONE MISS AND IT IS OVER. Carry a balance one single month for any reason other than a fraud dispute, and the card is closed and cut up. No second chances, no 'it was a weird month.' You agree to this rule while things are calm, precisely so it is already decided when things are not.\n\nAlso: no card use at all while you are in step two. During the snowball you are in a fight, and a fight is not the time to test whether you can handle a loaded weapon safely.",
        tip: "Write these five rules down and put them with the card. If you cannot honestly sign all five, you have your answer, and it is not a moral failure — it is self-knowledge, which is worth more than points.",
      },
      {
        heading: "Why the caution is warranted",
        body: "Do not read the rule above as permission. Read it as a narrow exception with teeth, because the evidence for caution is strong.\n\n- People genuinely spend more with plastic than with cash. It has been measured repeatedly across decades of research. The pain of paying is real, and cards anesthetize it. Assume you are not the exception.\n- Rewards programs exist because they are profitable for the issuer. The points are funded by the interest and fees paid by people who did not pay in full — sometimes including you, later.\n- Minimum payments are engineered. They are set low enough to keep the balance alive for years, and they are designed to feel manageable.\n- The 'I always pay it off' story often quietly becomes 'I usually pay it off' during one hard season — a job loss, a medical event, a new baby — and that is exactly the season with no capacity to notice.\n\nSo: the honest version of our position is that a card is a tool with a real edge on it. Some households handle it fine for thirty years. Others discover, expensively, that they cannot. If you have ever carried a balance, if a purchase has ever felt easier because it was on a card, or if you and your spouse are not fully in agreement on this — use a debit card and skip the whole question. Nothing in this plan requires a credit card.",
      },
      {
        heading: "Always off the table",
        body: "'Treat it as cash' applies to a card you pay in full. It never applies to any of these, and none of them belong in a CrossBridge household:\n\n- PAYDAY, TITLE, AND PAWN LOANS. Effective annual rates in the triple digits, structured so the fee resets before the principal ever falls. If you are considering one, come to the church first — that is what benevolence is for.\n- BUY NOW, PAY LATER. Four easy payments is a loan with a friendly font. It is untracked by your budget, it stacks invisibly across merchants, and late fees are real.\n- STORE CARDS for the checkout discount. A 10% one-time discount in exchange for a high-rate account and one more thing to manage.\n- CAR LOANS AND LEASES. The single biggest wealth killer in most middle-income households — a depreciating asset financed at length, repeated every four years for a working lifetime. Pay cash for cars. Cheaper cars, at first.\n- RENT-TO-OWN. You will pay several times the retail price of the furniture.\n- CASH ADVANCES on a credit card. Interest from day one at a higher rate, plus a fee.\n- HOME EQUITY LINES used to consolidate consumer debt. You just converted a debt that could cost you your credit into a debt that can cost you your house.\n- CO-SIGNING. When you co-sign, you have borrowed the money — the lender required a co-signer because they expect not to be paid. If you want to help, give what you can afford to lose. Do not lend it and do not guarantee it.\n- ZERO PERCENT FINANCING on furniture, electronics, or the pool. The deferred interest clauses are brutal: miss the window or a payment and the whole retroactive interest bill lands at once.",
      },
      {
        heading: "About your credit score",
        body: "Here is the honest picture, without the mythology in either direction.\n\nA credit score is not a measure of wealth or of character. It is a measure of how you have handled BORROWED money — a debt-behavior score. Someone with a paid-off house, no debt, and a million dollars invested can have no score at all. That fact is used, correctly, to argue that the score is not a life goal.\n\nBut it is still a number other people use to make decisions about you, and not only lenders: landlords screen with it, most states let insurers use credit-based insurance scores to set auto and home premiums, and utility companies use it to decide on deposits. Going to zero has real costs unless you are genuinely never renting, never insuring, and never borrowing again.\n\nOur position: do not chase the score, and do not sabotage it either. If you have a card you pay in full every month, an aged account in good standing keeps the score healthy on its own with no debt and no interest. That is enough. Do not open accounts to build score, do not carry a balance to build score — carrying a balance does not help your score, that is a myth that costs Americans a fortune — and do not pay any company that offers to 'repair' or 'boost' it. Legitimate credit repair is you disputing genuine errors, for free.\n\nWhen you buy a house, a mortgage lender can underwrite a borrower with no score through manual underwriting; it is more work and fewer lenders offer it, so know that in advance rather than at closing.\n\nAnd freeze your credit at all three bureaus. Free, permanent until you thaw it, and it does nothing to your score.",
        tip: "Check the statement weekly, not monthly. Fraud caught in three days is a phone call; fraud caught in five weeks is a project.",
      },
    ],
    quiz: [
      {
        question: "What is the CrossBridge credit rule?",
        options: [
          "Cut up every card and live with no credit score",
          "If you use credit, treat it as cash — the money is already in the bank, and the statement is paid in full every month",
          "Use credit for large purchases and cash for small ones",
          "Carry a small balance to build your credit score",
        ],
        answer: 1,
        explanation:
          "A card is a payment method, not a source of funds. The dollars exist and are budgeted before the swipe, and the full statement balance is paid every month.",
      },
      {
        question: "Under the house rules, what happens if you carry a balance for one month?",
        options: [
          "Pay it off next month and continue",
          "Switch to a lower-rate card",
          "The card is closed and cut up — the rule is decided in advance, on purpose",
          "Reduce spending by 10% the following month",
        ],
        answer: 2,
        explanation:
          "One miss and it is over, agreed to while things are calm so the decision is already made when things are not. Fraud disputes are the only exception.",
      },
      {
        question: "Which of these is acceptable under this track's teaching?",
        options: [
          "Buy now, pay later for a $600 appliance",
          "A 0% 18-month furniture financing offer",
          "A store card for the 10% checkout discount",
          "None of these — all are consumer debt, and none belong in the plan",
        ],
        answer: 3,
        explanation:
          "BNPL is a loan with a friendly font, deferred-interest 0% offers bill retroactively if you slip, and store cards trade a one-time discount for a high-rate account.",
      },
      {
        question: "What does a credit score actually measure?",
        options: [
          "Your wealth",
          "How you have handled borrowed money — it is a debt-behavior score",
          "Your income stability",
          "How much you have saved",
        ],
        answer: 1,
        explanation:
          "It is a debt-behavior score. A debt-free person with a paid-off house can have no score at all — which is why we neither chase it nor sabotage it.",
      },
      {
        question: "Your brother asks you to co-sign his car loan. What does this track say?",
        options: [
          "Co-sign if you trust him",
          "Co-sign but require a written agreement",
          "Do not co-sign — the lender required one because they expect not to be paid; if you want to help, give what you can afford to lose",
          "Co-sign only for family",
        ],
        answer: 2,
        explanation:
          "Co-signing means you have borrowed the money. The request exists because a professional lender evaluated the risk and declined it. Give, do not guarantee.",
      },
    ],
  },

  {
    slug: "money-emergency-fund",
    order: 7,
    title: "Step 3 — The Full Emergency Fund",
    subtitle:
      "Three to six months of expenses in cash, and what having it does to the rest of your life.",
    icon: "🛟",
    estMinutes: 12,
    objectives: [
      "Size a full emergency fund from your own expenses and risk factors",
      "Choose where to hold it and why it is not invested",
      "Use the fund to lower insurance costs and take the right kinds of risk",
    ],
    sections: [
      {
        heading: "Size it from expenses, not income",
        body: "Step three is three to six months of EXPENSES — not income — in cash. Use your bare-bones number: what it costs to run your household with the extras switched off. Four Walls, insurance, minimum obligations, basics.\n\nThe honest math: total up that bare-bones monthly number, then multiply.\n\nCloser to THREE MONTHS if: two stable incomes, salaried work in a field with steady demand, good health, no dependents, marketable skills, low fixed costs.\n\nCloser to SIX MONTHS — or more — if: one income supports the household, your income is commission, seasonal, 1099, or self-employed, you work in a volatile industry, someone in the household has a chronic health condition, you have several dependents, you own an older home, or your job would take a long time to replace at the same pay.\n\nMost households land at six. If you are self-employed with lumpy income, twelve months is not paranoid.\n\nThis is the fund that changes what a crisis IS. With it, a layoff is a stressful season with a job search in it. Without it, the same layoff is a cascade — missed payments, cards, collections, and a decade of recovery. Same event. Different outcome, decided months earlier.",
      },
      {
        heading: "Where it lives",
        body: "Boring, liquid, insured, and separate. In practice: a high-yield savings account or a money market account at a bank or credit union, FDIC or NCUA insured, accessible in a day or two.\n\nWhat it is not:\n\n- NOT INVESTED. Not in index funds, not in a brokerage account, not in crypto, not in your employer's stock. Emergencies correlate with recessions — the layoff and the market drop tend to arrive in the same quarter, and selling investments at a 30% loss to buy groceries is the exact scenario this fund exists to prevent.\n- NOT LOCKED UP. No long CDs, no annuities, nothing with a surrender charge or a penalty.\n- NOT IN CHECKING. Different account, and ideally at a different institution than your checking, so moving it takes a deliberate decision and a day.\n- NOT YOUR RETIREMENT ACCOUNT. Early withdrawals cost you taxes, penalties, and the compounding that money would have done for thirty years.\n\nYes, inflation erodes it. That is the price of the insurance, and it is a fair price. This money is not an investment; it is the thing that lets your actual investments be left alone during the worst month of your life.",
        tip: "Keep it at a different bank than your checking, with no debit card attached. One extra day of friction has saved a lot of emergency funds from a very good sale.",
      },
      {
        heading: "When to use it and when not to",
        body: "Same three-part test as the starter fund: unexpected, necessary, urgent. But at this level you also get a fourth question worth asking out loud with your spouse: is this an emergency, or is this a decision I want to feel good about quickly?\n\nUse it: job loss or a big income drop. A major medical event. A major, necessary home or car repair. A genuine family crisis, including travel for a death.\n\nDo not use it: an investment opportunity. A business idea. A down payment. A vacation. A wedding. Helping someone else out of a crisis they will be in again next year — generosity is a budget line, not a raid on your safety net.\n\nWhen you do use it, you stop investing temporarily, refill the fund, then resume. Just like step one.\n\nAnd revisit the size every year or so. It should track your actual expenses, so a new baby, a bigger house, or a career change all mean recalculating.",
      },
      {
        heading: "What a funded emergency fund lets you do",
        body: "This is the part people do not anticipate, and it is worth more than the interest.\n\n- RAISE YOUR DEDUCTIBLES. With six months of expenses in cash, you can carry a $1,000 or $2,500 deductible on auto and homeowner's instead of $250. That cuts premiums meaningfully, every year, forever. You have self-insured the small stuff.\n- DROP THE JUNK COVERAGE. Extended warranties, appliance plans, phone insurance, the rental car counter add-on. All of those exist to cover losses you can now absorb.\n- SAY NO. To the boss with the unreasonable demand, to the job that is wrecking your family, to the client who does not pay. An emergency fund is a spine. It is the difference between choosing your work and being held by it.\n- STAY INVESTED. When the market falls 30%, the households that sell are usually the ones who need the money. Yours does not.\n- BE GENEROUS FAST. The people who can help a neighbor the same week they hear about the need are the ones with cash on hand.\n\nOne caution: the fund is done at three to six months. Do not keep piling cash out of anxiety — money past that point should be working, and hoarding is its own kind of fear. Finish the fund, then move to step four.",
        tip: "The month after this fund is finished, call your insurance agent and re-quote your auto and home policies at higher deductibles. It is often several hundred dollars a year, permanently.",
      },
    ],
    quiz: [
      {
        question: "The full emergency fund is three to six months of what?",
        options: [
          "Gross income",
          "Take-home pay",
          "Bare-bones household expenses",
          "Debt payments",
        ],
        answer: 2,
        explanation:
          "Expenses, not income — and the bare-bones version: what it costs to run the household with extras switched off.",
      },
      {
        question: "Why is the emergency fund not invested?",
        options: [
          "Investment accounts are difficult to open",
          "Emergencies correlate with recessions — you would be selling at a loss exactly when you need the cash",
          "Investments are taxed too heavily",
          "It would grow too slowly",
        ],
        answer: 1,
        explanation:
          "The layoff and the market drop tend to arrive together. This fund exists so your real investments never have to be sold during the worst month of your life.",
      },
      {
        question: "Who should be closer to six months (or more) rather than three?",
        options: [
          "A dual-income salaried couple with no dependents and stable jobs",
          "A single-income household with commission or self-employed income and several dependents",
          "Anyone under 30",
          "Anyone who rents rather than owns",
        ],
        answer: 1,
        explanation:
          "One income, variable pay, dependents, health issues, volatile industry, or a long job-replacement time all push toward six months — twelve is reasonable for lumpy self-employment.",
      },
      {
        question: "What is a smart move the month after the fund is fully funded?",
        options: [
          "Invest the fund in index funds so it grows",
          "Raise your auto and homeowner's deductibles and re-quote the policies",
          "Cancel your auto insurance",
          "Keep saving cash until you reach twelve months no matter your situation",
        ],
        answer: 1,
        explanation:
          "You have self-insured the small stuff, so higher deductibles cut premiums permanently. The fund is done at 3–6 months; past that, money should be working.",
      },
      {
        question: "A great business opportunity comes along and you need the cash quickly. Use the emergency fund?",
        options: [
          "Yes, if the return looks strong",
          "Yes, if you can replace it within a year",
          "No — an opportunity is not an emergency; this fund is for unexpected, necessary, urgent events",
          "Yes, if your spouse agrees",
        ],
        answer: 2,
        explanation:
          "Opportunities, down payments, vacations, and business ideas are not emergencies. Those get funded from the budget or a sinking fund, never from the safety net.",
      },
    ],
  },
  // ── Chapter 3 · Build ────────────────────────────────────────────────────
  {
    slug: "money-invest-15",
    order: 8,
    title: "Step 4 — Invest 15%",
    subtitle:
      "Fifteen percent of gross into retirement, in the right order, in boring funds you leave alone.",
    icon: "📈",
    estMinutes: 15,
    objectives: [
      "Fund retirement in the right order: match, then tax-advantaged, then the rest",
      "Tell the account (401(k), IRA, HSA) apart from the investment inside it",
      "Explain why low-cost index funds and time in the market beat picking and timing",
    ],
    sections: [
      {
        heading: "Fifteen percent of gross, automatically",
        body: "Once the debt is gone and the emergency fund is full, you invest 15% of your GROSS household income for retirement. Gross, not take-home — the bigger number, on purpose.\n\nWhy 15%: it is enough that a normal career produces a real retirement, and it is restrained enough to leave room for steps five and six — the kids' education and killing the mortgage. Save 5% and you will be working at 75. Save 40% and you will miss your children's childhood chasing a number.\n\nDo not count these toward the 15%: your employer's match (it is a bonus on top, not part of your contribution), the equity you are building in your house, or your kids' college savings. Your 15% is your money going toward your retirement.\n\nAnd make it AUTOMATIC. Payroll deduction into the workplace plan, an automatic monthly transfer into the IRA. Money that requires a monthly decision does not get invested for thirty years — it gets invested for about seven months. The whole strategy is: decide once, then let boring win.",
        visual: "money-compounding",
      },
      {
        heading: "The account is not the investment",
        body: "This confuses nearly everyone at the start, so say it out loud: THE ACCOUNT IS THE BUCKET. THE INVESTMENT IS WHAT YOU PUT IN IT.\n\n'I have a 401(k)' tells you nothing about what you own — you can hold a stock index fund or cash inside the same 401(k). Two separate decisions: which bucket, then what goes in it.\n\nThe buckets you will meet:\n\n- 401(k) / 403(b) / 457. Workplace plans. 403(b) is the nonprofit and school version; 457 is the government version. Contributions come out of payroll and often get an employer match.\n- TRADITIONAL IRA / ROTH IRA. Individual accounts you open yourself at a brokerage. Nobody matches them; you control the investment options entirely, which is usually an advantage.\n- HSA. A health savings account, available only with a qualifying high-deductible health plan. Uniquely, contributions are pre-tax, growth is untaxed, and withdrawals for qualified medical costs are untaxed — the only triple-tax-advantaged account in the code. Invest it rather than leaving it in cash, if you can pay current medical bills out of pocket.\n- TAXABLE BROKERAGE. No tax advantages, no limits, no restrictions. Where money goes after the tax-advantaged buckets are full.\n\n2026 CONTRIBUTION LIMITS — verify these at irs.gov, they change nearly every year: about $24,500 to a workplace plan ($8,000 more if you are 50+, and a larger catch-up at ages 60–63), about $7,500 to an IRA ($1,100 more at 50+), and about $4,400 individual / $8,750 family to an HSA ($1,000 more at 55+). Treat those as this year's numbers, not as facts.",
      },
      {
        heading: "The funding order",
        body: "Fill the buckets in this order until you hit 15% of gross:\n\n1. THE FULL EMPLOYER MATCH, first. If your employer matches 4%, contribute at least 4%. This is an instant, guaranteed return that no investment can match, and the amount you leave on the table by not doing it is simply gone. (Reminder from step two: we do pause this while attacking debt — but the moment step three is done, turn it back on and capture all of it.)\n2. HSA, if you are on a qualifying plan and can invest it rather than spend it. Triple tax advantage is hard to beat.\n3. ROTH IRA and/or TRADITIONAL IRA — you choose your options, keep costs low, and the next module covers how to split between them.\n4. BACK TO THE WORKPLACE PLAN until you reach 15% total. If your plan has great low-cost funds, this step can come before the IRA; if it is full of expensive funds, do the IRA first.\n5. TAXABLE BROKERAGE for anything beyond that, once the tax-advantaged room is used up.\n\nAlso watch the vesting schedule on your match: employer money often is not fully yours until you have been there a few years. Know your schedule before you resign in month thirty-five.",
        visual: "money-funding-order",
        tip: "Rolled-over 401(k)s from old jobs: consolidate them into an IRA (or your current plan) so you can actually see and manage what you own. Do it as a DIRECT trustee-to-trustee rollover — a check made out to you starts a 60-day clock and mandatory withholding.",
      },
      {
        heading: "What to actually buy",
        body: "For most people, most of the time: LOW-COST, BROADLY DIVERSIFIED INDEX FUNDS, held for decades.\n\nAn index fund owns the whole market (or a big slice of it) and charges very little to do so, because there is no expensive team trying to pick winners. A total US stock market fund plus a total international fund plus, as you age, a bond fund, will beat the large majority of professionally managed portfolios over long periods — after fees.\n\nFEES ARE THE PART PEOPLE UNDERESTIMATE. The expense ratio is an annual percentage of everything you own. The difference between 0.05% and 1.00% sounds trivial and is not: over a 35-year career it can consume a very large fraction of your final balance. Look up the expense ratio of every fund you own; if you cannot find it, that is itself information. Watch also for LOADS — a sales commission of several percent charged when you buy — and for advisors compensated by which fund they sell you.\n\nA TARGET-DATE INDEX FUND ('Target Retirement 2055') is a completely respectable one-fund answer inside a workplace plan: diversified, automatically rebalanced, and gradually more conservative as the date approaches. Check its expense ratio and that it is the index version.\n\nWhat not to buy with retirement money: individual stocks in any meaningful concentration (especially your employer's — your paycheck and your portfolio should not depend on one company), crypto, anything an insurance salesperson calls an investment, whole life as a retirement plan, or a product whose fee structure you cannot explain to your spouse in two sentences.",
      },
      {
        heading: "Behavior beats brilliance, again",
        body: "The great advantage the ordinary investor has is time, and the great danger is the temptation to interfere.\n\n- TIME IN THE MARKET beats timing the market. The market's best days cluster near its worst ones; miss a handful of them by sitting in cash and decades of returns thin out dramatically. Nobody, including professionals, reliably calls the turns.\n- CRASHES ARE NORMAL. A 20% drop happens regularly across a working life. If you are 35, a crash is a sale on shares you are buying for the next thirty years. The only way a downturn permanently hurts you is if you sell into it.\n- AUTOMATIC AND BORING WINS. Same contribution every month, regardless of headlines, is dollar-cost averaging and it removes the decision that most often destroys returns.\n- REBALANCE ONCE A YEAR, not constantly. Pick your mix, check it annually, put it back.\n- DO NOT CHECK IT WEEKLY. Watching a long-term account daily creates anxiety and anxiety creates trades.\n\nOne more: if you use an advisor, know exactly how they are paid. A FEE-ONLY FIDUCIARY is legally required to act in your interest and is paid by you — a flat fee, an hourly rate, or a percentage of assets. Someone paid by commission is a salesperson, which is not a crime but is a fact you should hold while listening. Ask the question directly: 'Are you a fiduciary to me at all times, and how are you compensated?' Then ask for it in writing.",
        tip: "Write your investing plan down in five sentences while you are calm — what you own, why, and what you will do in a crash (nothing). Read it during the crash. That page is worth more than any forecast.",
      },
    ],
    quiz: [
      {
        question: "Fifteen percent of what, and does the employer match count toward it?",
        options: [
          "Take-home pay, and yes the match counts",
          "Gross income, and no — the match is a bonus on top",
          "Gross income, and yes the match counts",
          "Take-home pay, and no the match does not count",
        ],
        answer: 1,
        explanation:
          "15% of gross household income, from your own money. The employer match is extra, and house equity and college savings do not count either.",
      },
      {
        question: "What comes first in the funding order once you are on step four?",
        options: [
          "A Roth IRA",
          "A taxable brokerage account",
          "Contributing at least enough to capture the full employer match",
          "The HSA",
        ],
        answer: 2,
        explanation:
          "The full match first — it is an instant guaranteed return, and any of it you skip is simply gone. Then the HSA, then IRAs, then back to the workplace plan up to 15%.",
      },
      {
        question: "What is the difference between an account and an investment?",
        options: [
          "There is none — a 401(k) is an investment",
          "The account is the bucket (401(k), IRA, HSA); the investment is what you hold inside it",
          "Accounts are taxable and investments are not",
          "Investments are only available in workplace plans",
        ],
        answer: 1,
        explanation:
          "Two separate decisions. 'I have a 401(k)' says nothing about what you own — you can hold a stock index fund or plain cash in the same account.",
      },
      {
        question: "Why does a 1.00% expense ratio matter compared with 0.05%?",
        options: [
          "It does not — the difference is under one percent",
          "It is charged annually on everything you own, and over a 35-year career it can consume a very large share of the final balance",
          "It only applies in the first year",
          "It is refunded at retirement",
        ],
        answer: 1,
        explanation:
          "Expense ratios are annual and compound against you. Fees are the most reliably predictable factor in long-run returns — and the one you actually control.",
      },
      {
        question: "The market drops 30% and you are 35 years old. What does the plan say?",
        options: [
          "Move to cash until it recovers",
          "Stop contributing until the market stabilizes",
          "Keep contributing on schedule — you are buying shares on sale for a thirty-year horizon",
          "Switch to individual stocks that dropped the most",
        ],
        answer: 2,
        explanation:
          "Crashes are normal across a working life. The only way a downturn permanently hurts a long-horizon investor is if they sell into it.",
      },
    ],
  },

  {
    slug: "money-roth-traditional",
    order: 9,
    title: "Roth and Traditional — Build Both Buckets",
    subtitle:
      "Why we do not teach Roth-for-everything: RMDs, tax brackets you cannot control, and the value of a dial.",
    icon: "⚖️",
    estMinutes: 14,
    objectives: [
      "Explain the tax treatment of taxable, tax-deferred, and tax-free accounts",
      "Say why a very large traditional balance becomes a problem at RMD age",
      "Choose a contribution split and know when conversions are worth exploring",
    ],
    sections: [
      {
        heading: "The three buckets",
        body: "Every dollar you save for the future sits in one of three tax buckets, and the whole subject gets simple once you can name them.\n\n- TAX-DEFERRED (traditional 401(k), 403(b), traditional IRA). You deduct the contribution now, the money grows untaxed, and every dollar you withdraw later is taxed as ORDINARY INCOME. You have a partner in this account — the IRS — and you have not yet settled up.\n- TAX-FREE (Roth 401(k), Roth IRA). You pay tax on the money now, it grows untaxed, and qualified withdrawals in retirement are untaxed. Settled up, permanently.\n- TAXABLE (a regular brokerage account). No deduction going in, dividends taxed as they arrive, and gains taxed when you sell — but at long-term capital gains rates, which are lower than ordinary income rates, and your heirs generally get a step-up in basis.\n\nThe conventional shorthand is 'traditional if your tax rate will be lower later; Roth if it will be higher.' That is correct as far as it goes, and it depends on a variable no one has: your tax rates thirty years from now, under tax law that has not been written yet.\n\nWhich is precisely the argument for owning some of each.",
        visual: "money-tax-buckets",
      },
      {
        heading: "Why we do not teach Roth-only",
        body: "This is the second place we depart from the plan this track is modeled on. The standard teaching leans hard toward Roth for essentially everything, and the reasoning is real: tax-free growth is wonderful, and today's rates are historically moderate.\n\nOur position is that a MIX beats an all-of-one strategy, for four reasons:\n\n1. YOU CANNOT PREDICT YOUR FUTURE BRACKET. Roth-only is a bet that rates will be higher later; traditional-only is a bet they will be lower. A mix means you do not have to be right.\n2. RETIREMENT INCOME IS OFTEN LOWER THAN PEAK EARNING INCOME. A high earner in their fifties deducting at their top bracket and withdrawing later in a lower one comes out ahead — that is the whole logic of tax deferral, and it still works.\n3. THE STANDARD DEDUCTION AND THE LOWEST BRACKETS ARE FREE MONEY. In retirement, some of your withdrawals get taxed at 0% and then at the lowest rates. If you have NO traditional balance, you have nothing to fill those cheap brackets with — you paid full freight decades earlier on dollars that could have come out nearly free.\n4. A MIX GIVES YOU A DIAL. This is the biggest one. In retirement you can decide each year where the next dollar comes from — traditional up to the top of a bracket, then Roth for anything more, so that one large expense does not push you into a higher bracket, trigger Medicare surcharges, or increase the taxable portion of your Social Security. With one bucket you have no dial. You have a bill.\n\nSo: build both. Details in the last section.",
      },
      {
        heading: "The RMD problem",
        body: "Here is the part that gets underweighted, and it is the reason we teach this at all.\n\nTax-deferred money does not stay optional forever. Starting at age 73 under current law — rising to 75 in 2033 for those born in 1960 or later — you MUST take a REQUIRED MINIMUM DISTRIBUTION from traditional accounts every year, whether you need the money or not, and it is taxed as ordinary income. Verify the current age and rules at irs.gov; SECURE 2.0 changed them recently and could change them again.\n\nWhy a very large traditional balance becomes a problem:\n\n- THE RMD PERCENTAGE RISES WITH AGE. It starts under 4% of the balance and climbs. On a $2 million traditional IRA, that is a mandatory, taxable, six-figure withdrawal you did not ask for — and if the account grew well, the forced withdrawals grow with it.\n- BRACKET CREEP YOU DO NOT CONTROL. Forced income can push you into a higher bracket in a year you had no intention of spending that money.\n- MEDICARE SURCHARGES (IRMAA). Higher income raises your Medicare Part B and D premiums, on a two-year lookback, in cliff-edged steps — a dollar of extra income can cost you hundreds.\n- MORE OF YOUR SOCIAL SECURITY GETS TAXED. Higher other income increases the taxable portion of your benefit.\n- THE WIDOW'S PENALTY. When one spouse dies, the survivor files single — narrower brackets, same RMDs. Households routinely see a tax increase in the worst year of their life.\n- YOUR HEIRS INHERIT THE TAX BILL. Most non-spouse beneficiaries must now empty an inherited retirement account within ten years, often during their own peak earning years, at their own top rate. A Roth inherited under the same ten-year rule comes out tax-free.\n\nRoth IRAs have no RMD for the original owner. Roth 401(k)s no longer have RMDs either. That is the value of having built the other bucket: it is money the IRS cannot force you to recognize.",
        visual: "money-rmd-curve",
        tip: "The goal is not to minimize this year's taxes or next year's. It is to minimize taxes across your whole lifetime — and your spouse's, and to some extent your kids'. Those are different objectives and they often point in different directions.",
      },
      {
        heading: "How to choose your split",
        body: "A workable default for most households: contribute to BOTH, and let your bracket tilt the ratio. Then revisit it every year at tax time, because your income, the law, and your balances all move.\n\nTILT TOWARD ROTH when: you are early in your career and your income will likely rise; you are in one of the lower brackets today; you already have a large traditional balance from years of workplace contributions (very common — that is what your 401(k) has been doing); you expect a pension or other fixed income in retirement; you want money your heirs can inherit tax-free; or you are simply young enough that decades of tax-free growth is a big prize.\n\nTILT TOWARD TRADITIONAL when: you are in your peak earning years in a high bracket; you live in a high-income-tax state and plan to retire in a low- or no-tax one; you are close to retirement with modest expected retirement income; or your traditional balance is small relative to your Roth.\n\nPRACTICAL NOTES: many workplace plans offer both a traditional and a Roth option — you can split your payroll deferral between them, which is the easiest way to build both buckets at once. The EMPLOYER MATCH has historically landed in the traditional side (some plans now allow a Roth match, which is taxable to you in the year it is made), so many people are accumulating traditional money whether they intend to or not — check your statement rather than assuming. Roth IRA contributions have INCOME LIMITS; above them, the 'backdoor Roth' exists but has real traps (the pro-rata rule) and is a conversation for a CPA, not a rule of thumb. Traditional IRA DEDUCTIBILITY is limited if you are covered by a workplace plan and over certain incomes.\n\nAnd one thing that is not a close call: contribute SOMETHING, in either bucket, rather than stalling on this decision for a year. Being invested in the wrong bucket beats being uninvested in the right one.",
      },
      {
        heading: "The gap years and Roth conversions",
        body: "There is usually a window — retirement on one end, Social Security and RMDs on the other, often the early to mid sixties — where household income drops to its lowest point in decades. Those are the GAP YEARS, and they are the single best planning opportunity most people get.\n\nIn those years you can do a ROTH CONVERSION: move money from a traditional account to a Roth, pay the ordinary income tax on it that year deliberately, and take that money out of the RMD base forever. Done repeatedly and sized to fill a low bracket exactly, it can shave a large amount off a lifetime tax bill and shrink the RMDs that would otherwise arrive at 73.\n\nThings that make conversions worth exploring: a large traditional balance, an early retirement, a low-income year (a sabbatical, a layoff, a business loss), a plan to leave money to children in high brackets, or a strong view that rates rise.\n\nThings that make them risky: paying the conversion tax out of the converted money itself (do not — pay it from other cash), triggering an IRMAA cliff two years later, losing an ACA health insurance subsidy in the same year, or converting so much you fill a bracket you were trying to avoid. And QCDs — qualified charitable distributions, available from IRAs at 70½ — let a generous household send RMD money straight to charity untaxed, which is sometimes a better tool than converting.\n\nThis is a CPA conversation, with a projection, run before December 31. It is also the clearest example of why a mix matters: every one of these levers requires having both kinds of money.",
      },
    ],
    quiz: [
      {
        question: "How is a withdrawal from a traditional 401(k) taxed in retirement?",
        options: [
          "Tax-free, since tax was paid on the way in",
          "At long-term capital gains rates",
          "As ordinary income",
          "It is not taxed if you are over 65",
        ],
        answer: 2,
        explanation:
          "Tax-deferred money is taxed as ordinary income when it comes out. You deducted it going in — the IRS is a silent partner in the account until you settle up.",
      },
      {
        question: "Why does a very large traditional balance create a problem later?",
        options: [
          "Traditional accounts cannot be inherited",
          "Required minimum distributions force taxable income you did not ask for — pushing brackets, Medicare surcharges, and Social Security taxation up",
          "Traditional balances stop growing at age 70",
          "Withdrawals before 73 are prohibited",
        ],
        answer: 1,
        explanation:
          "RMDs begin at 73 (rising to 75 in 2033) whether you need the money or not, and the percentage climbs with age — pulling bracket creep, IRMAA, and more taxable Social Security along with it.",
      },
      {
        question: "What is the main practical advantage of holding both Roth and traditional money?",
        options: [
          "You pay less tax on contributions",
          "It doubles your contribution limits",
          "It gives you a dial in retirement — choose each year which bucket the next dollar comes from to manage your bracket",
          "It guarantees a higher return",
        ],
        answer: 2,
        explanation:
          "With both buckets you can fill the cheap brackets with traditional dollars and take anything more from Roth. With one bucket you have no dial — just a bill.",
      },
      {
        question: "Which situation tilts a contribution toward traditional rather than Roth?",
        options: [
          "You are 24, in a low bracket, and expect your income to rise",
          "You are in your peak earning years in a high bracket, in a high-tax state, planning to retire in a no-tax state",
          "You already have a very large traditional balance and no Roth",
          "You want to leave tax-free money to your children",
        ],
        answer: 1,
        explanation:
          "Deducting at a high rate now and withdrawing at a lower one later is the logic of deferral. The other three all tilt toward Roth.",
      },
      {
        question: "What are the 'gap years' and why do they matter?",
        options: [
          "The years between jobs, when you should stop investing",
          "The low-income window between retiring and starting Social Security and RMDs — the best window for deliberate Roth conversions",
          "The ten years an heir has to empty an inherited IRA",
          "The years before you are vested in an employer match",
        ],
        answer: 1,
        explanation:
          "Income is at its lowest, so conversions can be sized to fill a low bracket and permanently shrink the future RMD base. Run it with a CPA before December 31, and pay the tax from outside the account.",
      },
    ],
  },

  {
    slug: "money-college-house-legacy",
    order: 10,
    title: "Steps 5, 6 & 7 — College, the House, and Legacy",
    subtitle:
      "Funding education without wrecking retirement, killing the mortgage, and what the money is finally for.",
    icon: "🏠",
    estMinutes: 14,
    objectives: [
      "Choose an education savings approach without borrowing or raiding retirement",
      "Apply the mortgage rules and pay a house off years early",
      "Describe what step seven — build wealth and give — actually looks like",
    ],
    sections: [
      {
        heading: "Step 5 — the kids' education, in its proper place",
        body: "Notice where this sits: AFTER retirement investing has started, not before. That ordering offends a lot of parents and it is still right — your child can borrow for school, get scholarships, work, choose a cheaper school, or start at a community college. You cannot borrow for retirement, and the most expensive thing you can do to your children is become their financial burden at 80.\n\nSecure your own oxygen mask. Then fund theirs.\n\nThe main tools:\n\n- 529 PLAN. The workhorse. Growth and qualified withdrawals are tax-free for education, many states give a deduction or credit for contributions, contribution room is large, and unused funds can be moved to another family member. Rules have loosened over time — limited amounts can now be rolled to the beneficiary's Roth IRA under specific conditions — so check current rules. Shop plans: you are not limited to your own state's, though the state tax break may be.\n- COVERDELL ESA. Smaller annual limit, more investment flexibility, income limits apply. Usually a supplement rather than the main vehicle.\n- PLAIN SAVINGS OR BROKERAGE. Less tax-efficient, completely flexible, and not counted against you if the child does not go to college.\n\nWhat we do not do: borrow for our children's education, put it on a card, take a parent loan, cash out or borrow against retirement, or stop investing to fund a 529. And go into it with a number: decide what you can contribute, tell your kids the number early and honestly, and let them plan around a real figure rather than a vague hope.",
      },
      {
        heading: "Choosing a school without a loan",
        body: "This is a family conversation to have when a child is fifteen, not seventeen and in love with a campus.\n\n- FILL OUT THE FAFSA every year regardless of income. It gates grants, work-study, and many scholarships, not just loans.\n- CHASE SCHOLARSHIPS LIKE A PART-TIME JOB. Local ones — service clubs, employers, churches, trade associations — get far fewer applicants than national ones and are frequently unclaimed.\n- COMMUNITY COLLEGE THEN TRANSFER is not a downgrade. The diploma names the school that grants it. Verify the transfer agreements in advance and in writing.\n- IN-STATE PUBLIC, or a private school whose aid package makes it competitive. Compare the NET price, not the sticker price.\n- WORK DURING SCHOOL. Fifteen to twenty hours a week is normal and correlates fine with finishing.\n- TALK ABOUT THE MAJOR AND THE MONEY TOGETHER, honestly and without contempt. Debt at graduation and likely starting salary are both real numbers, and an eighteen-year-old deserves to see both before signing.\n- THE TRADES ARE A GREAT ANSWER for many students. Shorter training, strong demand, real income, and no four-year debt.\n\nIf your student must borrow something, federal subsidized loans first, borrow the minimum, and total borrowing under one year of expected starting salary is the outer edge of sane.",
        tip: "Sit down and total the four-year cost of each option before any visits happen. Campus visits are marketing, and they work.",
      },
      {
        heading: "Step 6 — kill the mortgage",
        body: "With no other debt, a full emergency fund, 15% going into retirement, and the kids' plan funded, everything else goes at the house.\n\nTHE MORTGAGE RULES, for anyone buying or refinancing:\n\n- A 15-YEAR FIXED-RATE loan. Not 30, not adjustable, not interest-only. The 15 costs more per month and dramatically less in total, and it forces a finish line.\n- PAYMENT NO MORE THAN ABOUT 25% OF TAKE-HOME PAY, including taxes and insurance. Above that, the house owns you.\n- PUT DOWN AS MUCH AS POSSIBLE, ideally 20% to avoid PMI. 100% down is better still.\n- BUY LESS HOUSE THAN YOU QUALIFY FOR. The approval letter measures what a bank will risk on you, not what you can live well inside of.\n\nPAYING IT OFF EARLY: every extra dollar goes to PRINCIPAL — label it, verify it landed, and check the statement afterward. Because a mortgage front-loads interest, extra principal early is enormously effective; a modest, consistent extra payment often removes years from a 30-year loan and a large fraction of the total interest. Consider it a guaranteed, risk-free return equal to your mortgage rate.\n\nThe standard objection is 'my rate is 3% and the market returns more, so I should invest instead.' On average, over long periods, that math is right. We still teach paying it off, for two non-mathematical reasons: the return on the mortgage is CERTAIN and the market's is not, and a paid-off house changes your capacity to absorb a job loss, a health crisis, or a call to do something risky and good. If you carry a very low rate and you genuinely will invest the difference every month for fifteen years without flinching, that is a defensible choice — make it deliberately with your spouse, not as an excuse.\n\nWhat not to do: do not refinance to a longer term to lower the payment, do not roll consumer debt into the house, do not take a HELOC for a kitchen, and do not skip homeowner's insurance escrow discipline.",
        visual: "money-mortgage-payoff",
      },
      {
        heading: "Step 7 — build wealth and give",
        body: "No payments. No mortgage. A full emergency fund. Retirement funded. From here, your income is almost entirely yours to direct, and this is the step the other six existed to reach.\n\nWhat it looks like in practice:\n\n- INVEST BEYOND 15%. Max the tax-advantaged accounts, then a taxable brokerage. Keep it boring.\n- GIVE AT A LEVEL THAT SURPRISES YOU. Not a leftover — a plan. Fund the thing nobody else is funding. Pay a family's rent quietly. Endow something small that outlasts you.\n- KEEP WORKING AT SOMETHING WORTH DOING. Financial independence is not the same as retirement, and the people who fare worst after retiring are usually the ones who retired FROM something rather than TO something.\n- BE CAREFUL. This is when the pitches arrive: the can't-miss real estate deal, the friend's startup, the complicated insurance product. Wealth attracts sales. Slow down, get advice from someone with no stake, and remember you do not have to win twice.\n- TEACH THE NEXT GENERATION. Let your kids watch you budget, give, and say no to things you could afford. That is the transfer that actually compounds.\n\nAnd the biblical frame that has been running underneath all seven steps: none of it is ultimately yours. You are a manager of someone else's assets, for a while, with instructions. Wealth is a tool and a test — and the point of getting free is not a bigger pile. It is a wider hand.",
        tip: "Write down what 'enough' is for your household — a number and a lifestyle — while you are still climbing. Without that line, every raise gets absorbed and nobody ever arrives.",
      },
    ],
    quiz: [
      {
        question: "Why does saving for a child's college come after starting retirement investing?",
        options: [
          "College costs less than retirement",
          "Your child has options — scholarships, work, cheaper schools, loans — and you cannot borrow for retirement",
          "529 plans require an existing retirement account",
          "Retirement accounts can be used for college anyway",
        ],
        answer: 1,
        explanation:
          "Secure your own oxygen mask first. The most expensive thing you can do to your children is become their financial burden in your eighties.",
      },
      {
        question: "What are the mortgage rules this track teaches?",
        options: [
          "30-year fixed, payment under 40% of gross",
          "15-year fixed, payment no more than about 25% of take-home pay",
          "Adjustable rate to keep the payment low, refinanced every five years",
          "Interest-only while you invest the difference",
        ],
        answer: 1,
        explanation:
          "15-year fixed with a payment at or under roughly 25% of take-home, including taxes and insurance, and as large a down payment as you can manage.",
      },
      {
        question: "How do you make an extra mortgage payment count toward payoff?",
        options: [
          "Send it as a normal payment and the servicer applies it to principal",
          "Designate it as principal-only and verify on the next statement that it was applied that way",
          "Ask for a recast every year",
          "Pay it into escrow",
        ],
        answer: 1,
        explanation:
          "Extra money must be labeled principal-only, and you should verify it landed there. Because mortgages front-load interest, early principal is extraordinarily effective.",
      },
      {
        question: "Someone with a 3% mortgage says investing the difference beats paying it off. What is the response?",
        options: [
          "They are simply wrong — always pay the house off",
          "On average the math favors investing; we still teach payoff because the return is certain and a paid-off house changes what your household can absorb",
          "Refinance to a 30-year and invest everything",
          "Take a HELOC and invest that too",
        ],
        answer: 1,
        explanation:
          "The math is a fair point over long horizons. We weigh certainty and resilience — and a defensible alternative requires actually investing the difference every month for fifteen years.",
      },
      {
        question: "What is step 7?",
        options: [
          "Retire as early as possible",
          "Maximize net worth",
          "Build wealth and give generously — the step the other six were clearing the runway for",
          "Pay off the house",
        ],
        answer: 2,
        explanation:
          "Build wealth and give. The point of getting free was never a bigger pile; it was a wider hand — and a household that can say yes when it matters.",
      },
    ],
  },
  // ── Chapter 4 · Protect It ───────────────────────────────────────────────
  {
    slug: "money-insurance",
    order: 11,
    title: "Insurance — What to Carry, What to Skip",
    subtitle:
      "Transfer the risks that would wreck you; self-insure the ones you can absorb; refuse the rest.",
    icon: "🛡️",
    estMinutes: 13,
    objectives: [
      "Name the coverages every household needs and roughly how much",
      "Explain why we buy term life and never cash-value life as an investment",
      "Recognize the products designed to be sold rather than to protect you",
    ],
    sections: [
      {
        heading: "What insurance is for",
        body: "Insurance exists to transfer a risk you could not survive financially to a company that can. That sentence decides almost every question in this module.\n\nA $600,000 house fire would ruin you — transfer it. A $300 phone screen would annoy you — absorb it. The reason phone insurance, extended warranties, and appliance plans are profitable is that they insure annoyances, and you pay a premium plus the seller's margin for the privilege.\n\nSo the rule is: INSURE THE CATASTROPHES, SELF-INSURE THE INCONVENIENCES. And note how this connects to step three — the bigger your emergency fund, the more you can absorb, the higher your deductibles can go, and the lower your premiums are, permanently.\n\nOne more rule: never let a stranger who is paid a commission tell you what you need without you knowing what a good answer looks like first. That is what this module is for.",
        visual: "money-insurance-map",
      },
      {
        heading: "The coverage every household needs",
        body: "- HEALTH INSURANCE. Non-negotiable. Medical bills are a leading driver of American bankruptcy. If money is tight, look at the marketplace subsidies and, if you are healthy with cash reserves, an HSA-eligible high-deductible plan paired with a funded HSA is often the strongest combination available.\n- AUTO. Liability limits well above your state's legal minimum — the minimums are far too low to cover a serious accident, and the gap comes out of your assets. Comprehensive and collision only while the car is worth enough to be worth insuring. Raise the deductible once step three is funded.\n- HOMEOWNER'S OR RENTER'S. Renter's insurance costs very little and covers your belongings and, importantly, your liability. Homeowners: check that you have replacement-cost coverage, not actual-cash-value, and know that standard policies exclude flood and often earthquake — buy those separately if you are exposed.\n- TERM LIFE, if anyone depends on your income. Roughly 10 to 12 times your annual income, on a 15- or 20-year level term that lasts until the kids are grown and the house is paid. Insure the stay-at-home spouse too: the cost to replace that labor — childcare, transportation, household management — is very real.\n- LONG-TERM DISABILITY. Statistically more likely than dying young during your working years, and far more likely to be financially devastating. Aim for 60–70% of income, own-occupation if you can get it. Take the employer plan and understand that if the premium is paid pre-tax, the benefit is taxable.\n- UMBRELLA LIABILITY. Once you have assets to lose, $1–2 million of umbrella coverage over your auto and home policies costs surprisingly little and covers the lawsuit that exceeds those policies.\n- LONG-TERM CARE, starting around age 60. This is the risk most likely to consume a retirement. Look at it before health problems make you uninsurable, and price it against self-funding.\n- IDENTITY THEFT PROTECTION with RESTORATION services — the value is someone doing the cleanup work, not the monitoring.",
      },
      {
        heading: "Term, not cash value",
        body: "Life insurance comes in two shapes, and the difference matters more than almost any other decision in this module.\n\nTERM LIFE is pure insurance: you pay a premium, and if you die during the term your family gets the death benefit. It is cheap, it is simple, and it is what we buy.\n\nCASH VALUE LIFE — whole life, universal, variable universal, indexed universal — bundles insurance with a savings or investment component. It is sold enthusiastically, because the commissions are large. The problems are consistent: the premiums are many times the cost of comparable term coverage, the internal returns are usually mediocre after fees and the cost of insurance, the fee structure is opaque, and in many designs the insurer keeps the cash value when you die and your family receives only the death benefit.\n\nThe alternative is the phrase to remember: BUY TERM AND INVEST THE DIFFERENCE. Get the coverage cheaply, put the savings in low-cost index funds inside real retirement accounts, and by the time the term expires you should not need the insurance — the kids are grown, the house is paid, and the portfolio is the safety net. That is the plan working.\n\nThere are narrow situations — certain estate-tax, special-needs, or business-succession cases — where permanent insurance is a legitimate tool. Those are handled with an attorney and a fee-only advisor, not a salesperson at your kitchen table. If someone is pitching whole life as a retirement plan, a college fund, or an 'infinite banking' strategy, the answer is no.",
        tip: "Buy term while you are young and healthy. Health, not age alone, drives the price, and a policy bought at 32 is locked in for the level term period.",
      },
      {
        heading: "What to skip",
        body: "- WHOLE, UNIVERSAL, AND VARIABLE LIFE as investments. See above.\n- CREDIT LIFE AND MORTGAGE LIFE INSURANCE. Expensive coverage that pays the lender, not your family. Real term life does the job better and the family decides how to use it.\n- EXTENDED WARRANTIES AND APPLIANCE PLANS. This is what the emergency fund is for.\n- CANCER, ACCIDENT, AND OTHER DISEASE-SPECIFIC POLICIES. Real health insurance covers illness regardless of which one you get.\n- CHILD LIFE INSURANCE as an investment. A small final-expense rider is inexpensive; a policy sold as a college fund is not a college fund.\n- RENTAL CAR COUNTER COVERAGE, usually — check your auto policy and your card's benefits first.\n- ANNUITIES SOLD BY COMMISSION with surrender charges you did not understand, especially inside an IRA, where you are paying for a tax deferral the account already gives you.\n- PREPAID FUNERAL PLANS from an operator who may not exist in twenty years.\n\nA general filter: if the pitch leads with a tax benefit, a 'be your own bank' story, or urgency, slow down. Legitimate insurance is boring and easy to compare.",
      },
      {
        heading: "The annual review",
        body: "Once a year, forty-five minutes:\n\n1. RE-QUOTE auto and home with two or three carriers, including an independent agent who can shop several. Loyalty is routinely punished with quiet rate creep.\n2. CHECK DEDUCTIBLES against your current emergency fund and raise them if the fund has grown.\n3. CHECK YOUR LIABILITY LIMITS against your current net worth. As your assets grow, the coverage protecting them should too.\n4. CHECK BENEFICIARIES on every life insurance policy and every retirement account. Beneficiary designations OVERRIDE your will — the ex-spouse named on a 401(k) in 2009 will receive that money regardless of what any document says. This is the most common and most preventable estate disaster there is.\n5. REVIEW COVERAGE AFTER LIFE EVENTS: marriage, a birth, a divorce, a death, a move, a big raise, buying a house, starting a business.\n6. BUNDLE OR UNBUNDLE based on the actual quotes, not the advertisement.",
      },
    ],
    quiz: [
      {
        question: "What is the guiding principle for buying insurance?",
        options: [
          "Insure everything you can afford to insure",
          "Transfer the risks that would ruin you; self-insure the ones you can absorb",
          "Take the lowest deductible you can get",
          "Buy whatever your agent recommends",
        ],
        answer: 1,
        explanation:
          "Catastrophes get transferred; inconveniences get absorbed. That is why a funded emergency fund lets you raise deductibles and drop the small-loss products entirely.",
      },
      {
        question: "How much term life insurance, and for how long?",
        options: [
          "Two times income, whole life",
          "Roughly 10–12 times annual income on a 15- or 20-year level term",
          "Enough to cover the funeral",
          "Whatever the employer provides is always sufficient",
        ],
        answer: 1,
        explanation:
          "10–12x income, on a term long enough to carry you until the kids are grown and the house is paid — and cover a stay-at-home spouse too, because replacing that labor costs real money.",
      },
      {
        question: "Why does this track reject whole life as an investment?",
        options: [
          "Whole life does not pay a death benefit",
          "Premiums are many times comparable term, returns are mediocre after fees, and the structure is opaque — buy term and invest the difference",
          "It is not available to most people",
          "It is illegal in most states",
        ],
        answer: 1,
        explanation:
          "The insurance and the investment both get done better separately. Narrow estate, special-needs, or business-succession cases are handled with an attorney, not a kitchen-table pitch.",
      },
      {
        question: "Which is more likely to devastate you financially during your working years?",
        options: [
          "Dying young",
          "A long-term disability",
          "A car theft",
          "A flooded basement",
        ],
        answer: 1,
        explanation:
          "Disability is both more likely and often more expensive than an early death — the income stops while the expenses rise. Aim for 60–70% of income, own-occupation if available.",
      },
      {
        question: "Your will leaves everything to your current spouse, but your 401(k) still names an ex-spouse. Who gets the 401(k)?",
        options: [
          "The current spouse, because the will controls",
          "The ex-spouse — beneficiary designations override the will",
          "It is split evenly",
          "A court decides case by case",
        ],
        answer: 1,
        explanation:
          "Beneficiary designations control the account and override the will. Checking them annually is the cheapest estate planning that exists.",
      },
    ],
  },

  {
    slug: "money-wills-records",
    order: 12,
    title: "Wills, Beneficiaries & the Folder",
    subtitle:
      "The documents your family needs, and putting your whole financial life in one findable place.",
    icon: "🗂️",
    estMinutes: 10,
    objectives: [
      "List the four core estate documents and what each one does",
      "Explain why beneficiary designations and titling matter more than the will",
      "Build an 'if something happens to me' folder your spouse can actually use",
    ],
    sections: [
      {
        heading: "This is an act of love, not a morbid errand",
        body: "Most people avoid this because it means thinking about dying. But the person who has to live with the avoidance is not you.\n\nWithout documents, your family gets a probate court deciding who raises your children, a spouse locked out of accounts they cannot access, months of delay while the mortgage still comes due, and a set of arguments among grieving people who all think they know what you would have wanted.\n\nWith documents, they get a hard week instead of a hard year.\n\nIf you have minor children and no will, stop and read that sentence again. Naming a guardian is the single most important thing on this page, and it is the one a court will otherwise do for you.",
      },
      {
        heading: "The four documents",
        body: "1. A WILL. Says who gets what, and — critically — NAMES A GUARDIAN for minor children. Name an executor and a backup. Talk to the people you name before you name them.\n2. DURABLE POWER OF ATTORNEY (financial). Names who can act on your finances if you are incapacitated. Without it, your spouse may need a court guardianship to pay your bills from an account in your name.\n3. HEALTH CARE POWER OF ATTORNEY AND ADVANCE DIRECTIVE (living will). Names who makes medical decisions and records your wishes about life-sustaining treatment. Add a HIPAA release so they can be told anything at all.\n4. BENEFICIARY DESIGNATIONS on every retirement account, life insurance policy, and payable-on-death bank account. Not technically a document you draft, and it moves more money than the will does.\n\nA LIVING TRUST is worth asking about if you own property in more than one state, want to avoid probate, have a blended family, or have a child with special needs (where a properly drafted special needs trust protects benefits eligibility). It is not necessary for everyone.\n\nDIY vs. attorney: a reputable online will is far better than nothing and is reasonable for a simple situation. Use an estate attorney if you have a blended family, a business, property in multiple states, a special-needs dependent, or significant assets. State rules on signing and witnessing are strict — an unwitnessed will can be worthless, so follow the execution instructions exactly.",
        tip: "Whatever you sign, tell your executor and your agents where the originals are. A perfect will nobody can find does nothing.",
      },
      {
        heading: "Beneficiaries and titling beat the will",
        body: "Assets pass in three ways, and only one of them is the will:\n\n- BY BENEFICIARY DESIGNATION: retirement accounts, life insurance, payable-on-death and transfer-on-death accounts. Goes to whoever is named, immediately, regardless of the will.\n- BY TITLING: jointly owned property with rights of survivorship passes to the co-owner automatically.\n- BY WILL: everything else, through probate.\n\nSo the will is the backstop, not the main event. Check every designation after any marriage, divorce, birth, or death, and name CONTINGENT beneficiaries as well as primary ones. Never name a minor child directly as a beneficiary of a large account — that forces a court-supervised arrangement; name a trust or use a custodial structure and talk to an attorney about it.",
      },
      {
        heading: "The folder",
        body: "One place — a fireproof box, a labeled binder, or an encrypted digital vault with an emergency access plan — holding everything a spouse or executor would need on the worst day of their life:\n\n- The estate documents, and where the signed originals live.\n- A list of every account: bank, retirement, brokerage, HSA, 529, with institution and roughly what is there. Not passwords in plain text on paper.\n- Insurance policies: life, health, auto, home, disability, umbrella — with policy numbers and agent contacts.\n- Debts: mortgage, any loans, with servicer and account numbers.\n- Tax returns for the last three years and your CPA's contact.\n- Property documents: deed, titles, and any safe deposit box location and key.\n- Digital life: a password manager with a documented emergency-access process, and a note about email, phone, photos, and any online business.\n- Employer benefits: HR contact, group life, pension, unused PTO.\n- A short letter of instruction: funeral wishes, who to call, and anything the documents do not say.\n\nThen tell one other trusted person it exists and how to get to it. Review it every year — put it on the same day you do the insurance review.",
      },
      {
        heading: "Both spouses have to know",
        body: "In most marriages one person handles the money. That is fine and efficient right up until that person is the one in the hospital.\n\nThe less-involved spouse needs to know, at minimum: where the folder is, which institutions hold the accounts, how the bills get paid and when, who the professionals are (CPA, agent, attorney), and what the household plan actually is.\n\nThe monthly budget meeting handles most of this by itself. Add one deeper session a year — a walk through the folder end to end. It takes an hour and it removes an entire category of catastrophe.\n\nAnd if you are the money spouse: teach, do not perform. The goal is a partner who could run this alone if they had to, not one who is impressed by how well you handle it.",
        tip: "Widows and widowers frequently report that the paperwork was harder than the grief was survivable. One hour a year is the whole fix.",
      },
    ],
    quiz: [
      {
        question: "What is the single most important reason for parents of young children to have a will?",
        options: [
          "It reduces estate taxes",
          "It names a guardian for the children — otherwise a court decides",
          "It is required to open a 529",
          "It replaces the need for life insurance",
        ],
        answer: 1,
        explanation:
          "Guardianship. Without a will, a court chooses who raises your children, using strangers' judgment about your family.",
      },
      {
        question: "Which document lets someone pay your bills if you are incapacitated?",
        options: [
          "The will",
          "A durable power of attorney for finances",
          "A health care directive",
          "A beneficiary designation",
        ],
        answer: 1,
        explanation:
          "A will only operates at death. Without a durable financial power of attorney, your spouse may need a court guardianship to act on accounts in your name.",
      },
      {
        question: "Which assets pass outside the will?",
        options: [
          "Only jointly titled real estate",
          "Retirement accounts, life insurance, POD/TOD accounts, and jointly titled property with survivorship",
          "Nothing — the will controls everything",
          "Only accounts under a certain dollar amount",
        ],
        answer: 1,
        explanation:
          "Beneficiary designations and titling move assets directly and immediately. The will is the backstop for everything else.",
      },
      {
        question: "What belongs in the 'if something happens to me' folder?",
        options: [
          "Estate documents, account and insurance lists, debts, tax returns, property documents, and a digital-access plan",
          "Only the will",
          "Passwords written in plain text on the front page",
          "Only the items your attorney drafted",
        ],
        answer: 0,
        explanation:
          "Everything an executor or spouse would need on the worst day — with password access handled through a manager and a documented emergency process, not plain text.",
      },
    ],
  },

  {
    slug: "money-scams",
    order: 13,
    title: "Scams, Schemes & Pressure",
    subtitle:
      "How fraud finds church people, why urgency is the tell, and what to do in the first hour.",
    icon: "🚨",
    estMinutes: 12,
    objectives: [
      "Recognize affinity fraud and the scams that impersonate church leaders",
      "Apply the pause rule to any request that combines urgency and money",
      "Know the first-hour steps if you or someone you love has been hit",
    ],
    sections: [
      {
        heading: "Why churches are targeted",
        body: "AFFINITY FRAUD is fraud that travels along lines of trust — a congregation, an ethnic community, a professional group, a friend network. It works because we extend to fellow members a credibility we would never extend to a stranger, and because the first victims recruit the next ones sincerely.\n\nThe pattern is always similar: someone inside the group, or someone who joins and gets involved quickly, offers an opportunity with unusually good returns, frames it in spiritual language ('the Lord has blessed this'), applies gentle urgency, and points at earlier participants who really did get paid — because early payouts in these schemes come from later investors' money.\n\nThe defenses are not complicated:\n\n- SHARED FAITH IS NOT DUE DILIGENCE. A person's testimony is not an audited financial statement.\n- VERIFY THE LICENSE. Check any investment professional at brokercheck.finra.org and any adviser at adviserinfo.sec.gov. It is free and takes two minutes.\n- HIGH RETURN WITH LOW RISK DOES NOT EXIST. If it is guaranteed and it beats the market, it is a lie or a crime.\n- NEVER INVEST IN SOMETHING YOU CANNOT EXPLAIN to a skeptical friend in plain words.\n- SLOW IS SAFE. Every legitimate investment will still be there next week. Urgency is the product.\n\nCrossBridge does not endorse investments, and no one should be soliciting money for a private deal on church property or in a church group chat. If it is happening, tell a pastor.",
      },
      {
        heading: "The scams that hit our people",
        body: "- THE PASTOR GIFT-CARD TEXT. A message that looks like it is from a pastor or ministry leader: 'Are you available? I need a favor — I'm in a meeting.' Then a request for gift cards for a member in need, and a plea for discretion. It is always fake. No leader at CrossBridge will ever ask you for gift cards, a wire, or crypto by text or email. Verify by calling a number you already had.\n- ROMANCE AND 'PIG BUTCHERING' CRYPTO SCAMS. A months-long relationship built by text, then an investment platform that shows growing balances, then a withdrawal that requires 'taxes' or 'fees.' The platform is a website with no money behind it. Losses are typically total and rarely recoverable. If someone you have never met in person is talking to you about crypto, it is a scam. Full stop.\n- THE GRANDPARENT SCAM. A call, sometimes with a voice cloned from social media, from a grandchild in jail or in an accident, needing bail money kept secret from the parents. Hang up and call the grandchild directly.\n- GOVERNMENT IMPERSONATION. The IRS, Social Security, or the sheriff calling about a warrant or a suspended number. Real agencies write letters. They do not demand gift cards, wire transfers, or crypto, and they do not threaten arrest by phone.\n- TECH SUPPORT POP-UPS. A scary screen and a number to call; the caller wants remote access to your computer and then to your bank. Close the browser. Never let anyone you did not call take control of your computer.\n- DISASTER AND CHARITY APPEALS. Fake charities surge after every tragedy. Give to organizations you already know, through their own website you typed in yourself.\n- CHECK OVERPAYMENT AND FAKE JOB SCAMS. Someone sends a check, asks you to send part of it back, and the check bounces two weeks later — leaving you liable for the whole amount.\n- MLMs AND 'BE YOUR OWN BOSS' PITCHES. Not always fraud, and the great majority of participants lose money after inventory and fees. Be especially careful when the recruiting happens inside church friendships, because the friendship is the sales channel.",
        tip: "The three payment methods that scream fraud: GIFT CARDS, WIRE TRANSFERS, and CRYPTOCURRENCY. Nobody legitimate — no agency, no utility, no church, no employer — needs to be paid that way. Ever.",
      },
      {
        heading: "The pause rule",
        body: "Almost every scam requires one thing: that you act before you think. So install a household rule and follow it without exceptions.\n\nANY request that combines MONEY with URGENCY gets a 24-HOUR PAUSE and a SECOND OPINION.\n\nThe script, out loud: 'I don't make financial decisions on the phone. I'll call you back.' Then hang up and call a number you looked up independently — never the number they gave you, never the one in the email.\n\nWhat to notice in the moment:\n\n- SECRECY. 'Don't tell your husband.' 'Don't tell the parents.' 'Keep this between us.' Legitimate business does not require you to isolate yourself.\n- UNUSUAL PAYMENT METHODS. See the tip above.\n- PRESSURE AND FLATTERY TOGETHER. You are special, and you must act now.\n- A STORY THAT KEEPS GROWING. New fees, new taxes, one more transfer to release the funds. Once this starts, everything before it was fake too.\n- REFUSAL TO PUT IT IN WRITING.\n\nProtect the older adults in your life proactively — not by taking over, but by agreeing in advance: 'We check with each other before any money moves.' Framed as mutual, it preserves dignity and it works.",
      },
      {
        heading: "If it already happened",
        body: "Speed matters, and so does not spiraling. Do these in order:\n\n1. STOP ALL CONTACT and stop sending money. If a story is still growing, it is still a scam.\n2. CALL YOUR BANK OR CARD ISSUER IMMEDIATELY. Wires and gift cards are sometimes recoverable within hours; almost never after days. Ask for their fraud department directly.\n3. CHANGE PASSWORDS on email first, then financial accounts, and turn on two-factor authentication everywhere.\n4. FREEZE YOUR CREDIT at all three bureaus and check your reports for accounts you did not open.\n5. REPORT IT: reportfraud.ftc.gov, IdentityTheft.gov for identity theft, ic3.gov for internet crime, your state attorney general, and local police for a report number (insurers and banks often require one).\n6. IF RETIREMENT OR INVESTMENT MONEY IS INVOLVED, call a CPA — there may be tax consequences to a distribution that need handling this year.\n7. TELL SOMEONE. A spouse, a friend, a pastor.\n\nAnd the pastoral note: shame is the reason most fraud goes unreported, and unreported fraud is what lets the same operator work the next family in the same congregation. Being deceived by a professional deceiver is not stupidity. These are practiced, well-resourced criminals whose entire job is this. Tell people, so the next person is warned.",
      },
    ],
    quiz: [
      {
        question: "What is affinity fraud?",
        options: [
          "Fraud committed by financial professionals",
          "Fraud that spreads through a trusted community — a church, ethnic group, or friend network — using shared identity as credibility",
          "Fraud involving credit cards only",
          "A scam that targets people online at random",
        ],
        answer: 1,
        explanation:
          "It travels along lines of trust, and early victims recruit later ones sincerely. Shared faith is not due diligence — verify licenses at brokercheck.finra.org.",
      },
      {
        question: "You get a text from your pastor asking you to buy gift cards for a family in need, and to keep it quiet. What is it?",
        options: [
          "A legitimate request that should be handled discreetly",
          "A scam — no CrossBridge leader will ever request gift cards, wires, or crypto by text or email",
          "Probably real if the phone number looks familiar",
          "A request to forward to the church office for approval",
        ],
        answer: 1,
        explanation:
          "It is always fake. Gift cards, wires, and crypto are the three payment methods that scream fraud, and the secrecy request is part of the con. Verify with a number you already had.",
      },
      {
        question: "What is the pause rule?",
        options: [
          "Wait a week before any purchase over $100",
          "Any request combining money with urgency gets a 24-hour pause and a second opinion",
          "Never answer unknown phone numbers",
          "Pause investing during market volatility",
        ],
        answer: 1,
        explanation:
          "Scams require you to act before you think. 'I don't make financial decisions on the phone. I'll call you back' — using a number you look up yourself.",
      },
      {
        question: "What is the very first financial step after realizing you have been scammed?",
        options: [
          "File a police report",
          "Post a warning on social media",
          "Contact your bank or card issuer immediately — some transfers are recoverable within hours",
          "Wait to see if the money comes back",
        ],
        answer: 2,
        explanation:
          "Speed decides recovery. Bank first, then passwords and 2FA, then credit freeze, then the FTC, IC3, and a police report for the case number.",
      },
      {
        question: "Someone in a church small group offers a private investment with guaranteed 15% monthly returns. What is the right response?",
        options: [
          "Invest a small amount to test it",
          "Ask other members whether they have been paid",
          "Decline — guaranteed high returns with low risk do not exist, and early payouts in these schemes come from later investors",
          "Invest if they are a longtime member",
        ],
        answer: 2,
        explanation:
          "That is the textbook shape of affinity fraud, and the fact that earlier participants were paid is a feature of the scheme, not evidence against it.",
      },
    ],
  },

  // ── Chapter 5 · Live It ──────────────────────────────────────────────────
  {
    slug: "money-generosity",
    order: 14,
    title: "Generosity — The Point of the Whole Thing",
    subtitle:
      "Giving as a first line, not a leftover — and how to receive help without shame.",
    icon: "🎁",
    estMinutes: 11,
    objectives: [
      "Place giving at the top of the budget and explain why it stays there in hard seasons",
      "Teach children a give / save / spend habit that outlasts your instruction",
      "Know how CrossBridge handles benevolence, on both sides of the request",
    ],
    sections: [
      {
        heading: "Giving is first, not last",
        body: "In the budget module giving sat at the top, above savings and above the Four Walls. That placement is deliberate and it is the oldest idea in this track.\n\nGiving first does something to the giver that giving last cannot. A leftover gift says: I will be generous if the month cooperates. A first gift says: this is who we are, and the month arranges itself around it. One of those forms a person and one of them does not.\n\nIt is also the most reliable antidote to the thing that actually drives money misery — not low income, but the fear that there will not be enough. Generosity is how you get your hands open. And a household with open hands turns out to be much harder to frighten.\n\nA tithe — the first tenth — is the historic Christian practice and the standard we teach. Offerings are what goes beyond it. If ten percent is not where you are today, start where you are and move: a household that gives 3% on purpose is in a completely different place than one that gives 3% by accident.",
      },
      {
        heading: "Giving while you are in the hole",
        body: "The question comes up in every class: should I keep giving while I am in step two, with debt and pressure everywhere?\n\nOur answer is yes, keep giving. Here is why, honestly stated.\n\nThe pure math says pause it — a few hundred dollars a month shortens the snowball. But the math is not the whole account. The habit you keep during the hard season is the habit you will have in the good one, and people who stop giving to get out of debt overwhelmingly do not resume when the debt is gone; the money simply gets absorbed. Meanwhile the same person's restaurant spending usually has ten times the room to move that their giving does.\n\nAnd there is a deeper thing: debt is fundamentally a problem of trusting that there will not be enough. Giving addresses that at the root in a way that spreadsheet optimization does not.\n\nSo: keep giving, cut hard everywhere else, and do not let anyone — including a well-meaning teacher — make giving into a transaction where you put in ten and expect a hundred back. That is not generosity; it is a vending machine with a religious skin, and it has hurt a lot of people.\n\nIf you truly cannot cover the Four Walls this month, feeding your children comes first. That is not a violation of anything. Come talk to us.",
        tip: "Generosity is not only money. Time, skills, a meal, a ride, a spare room, an afternoon fixing someone's car — households in step two often give the most valuable things they own, and none of it is cash.",
      },
      {
        heading: "Teaching kids",
        body: "Children learn money the way they learn language: by immersion, long before instruction.\n\n- COMMISSION, NOT ALLOWANCE. Pay for work done, so the connection between effort and money is built early. Some chores are just family membership and pay nothing; that distinction is worth teaching too.\n- THREE ENVELOPES: GIVE, SAVE, SPEND. Every dollar gets split when it arrives. The proportions matter less than the habit of dividing before spending.\n- LET THEM BUY A BAD TOY with their own money and let it break. A $9 lesson at seven beats a $9,000 lesson at twenty-seven. Do not rescue them from the consequence you are trying to teach.\n- LET THEM SEE YOU GIVE, and see you say no to something you could afford. Silent generosity is beautiful and it teaches nothing; be selectively visible with your own children.\n- TEENAGERS: a bank account, a debit card, a real budget, a job, and the entire truth about how much college costs and where that money is coming from.\n- SAY THE HARD THINGS OUT LOUD. 'We can afford it, and we are choosing not to.' That sentence does more work than any lecture.\n\nAnd let them see the failures too — the month the budget did not work, the thing you had to sell. Children who never see the process assume adults just have money.",
      },
      {
        heading: "Receiving help",
        body: "This half of generosity gets almost no airtime, and half the people reading this need it more than the other half.\n\nIf you are the one who needs help: asking is not failure. The church is not a charity that helps strangers at a distance; it is a family, and families move resources toward whoever needs them at the moment. You have probably given before, and you will give again. Right now is not permanent.\n\nHow CrossBridge handles it: talk to a pastor or the church office. Benevolence is confidential — it is not discussed from the platform, it is not gossip, and it does not change your standing. It is usually meant for urgent, temporary need: keeping the lights on, keeping a family housed, food, a car repair that saves a job. It is generally not a substitute for income over the long term, and it works best alongside a plan, which is part of why this track exists.\n\nWhat we will not do is shame you for the choices that got you here, and what we will do is walk with you afterward if you want that.\n\nAnd if you are the one giving: give quietly, give without strings, and do not make the person perform gratitude for you. When you help someone in this church, they should feel loved, not managed.",
      },
      {
        heading: "The finish line",
        body: "Look back at the seven steps. Every one of them is in service of the last one.\n\nThe starter fund so a flat tire does not derail you. The snowball so your income belongs to you again. The emergency fund so a crisis is survivable. The investing so your later years are not a burden to your children. The house so your largest payment disappears. And then — with no payments and no fear — you are the household that can write the check the week someone needs it.\n\nThat is what this is for. Not a number. Not a score. Not comparison with anyone else's kitchen.\n\nA life where money is a tool you use instead of a master you serve, and where the surplus goes out the door toward people who need it. If you get to step seven and the money just sits there, you have won the game and missed the point.",
      },
    ],
    quiz: [
      {
        question: "Where does giving sit in the budget, and why?",
        options: [
          "Last, after all obligations are met, so you know what you can afford",
          "First, off the top — a leftover gift forms a different kind of person than a first gift does",
          "Only in months with surplus",
          "It is not part of the budget",
        ],
        answer: 1,
        explanation:
          "Giving first says this is who we are; giving last says we will be generous if the month cooperates. It is also the most reliable antidote to the fear that there will not be enough.",
      },
      {
        question: "Should someone keep giving while working the debt snowball?",
        options: [
          "No — pause it and resume when debt-free",
          "Yes — the habit kept in the hard season is the habit you will have in the good one, and the room to cut is almost always elsewhere",
          "Only if their debt is under $10,000",
          "Only after the emergency fund is full",
        ],
        answer: 1,
        explanation:
          "Pausing shortens the snowball slightly, but people who stop rarely resume. Cut hard everywhere else — and if the Four Walls truly cannot be covered, feed your family and come talk to a pastor.",
      },
      {
        question: "What is the three-envelope habit for children?",
        options: [
          "Save, spend, invest",
          "Give, save, spend — every dollar divided as it arrives",
          "Tithe, taxes, spend",
          "College, car, spend",
        ],
        answer: 1,
        explanation:
          "Give, save, spend. The proportions matter less than building the habit of dividing money before any of it is spent.",
      },
      {
        question: "What is the right posture toward church benevolence?",
        options: [
          "It is only for people outside the church",
          "Asking is failure and should be a last resort you keep private forever",
          "It is confidential, meant for urgent temporary need, and asking is not failure — the church is a family, not a charity at a distance",
          "It is an entitlement of membership",
        ],
        answer: 2,
        explanation:
          "Confidential, usually for urgent temporary need, and best paired with a plan. Give quietly and without strings; receive without shame.",
      },
    ],
  },

  {
    slug: "money-your-plan",
    order: 15,
    title: "Your Plan on One Page",
    subtitle:
      "Which step you are on, what you do in the next ninety days, and how to not quit in week six.",
    icon: "✅",
    estMinutes: 12,
    objectives: [
      "Identify your current step and write a one-page plan for it",
      "Set up the monthly and annual rhythms that keep the plan alive",
      "Name the common failure points and what to do when you slip",
    ],
    sections: [
      {
        heading: "Find your step",
        body: "Walk down this list and stop at the first 'no.' That is where you are, and it is the only step you work.\n\n- Do you have $1,000 (or $500 on a very low income) in a separate savings account? → No: STEP 1.\n- Is every debt except the mortgage paid off? → No: STEP 2.\n- Do you have 3–6 months of bare-bones expenses in cash? → No: STEP 3.\n- Are you investing 15% of gross into retirement? → No: STEP 4.\n- If you have kids and intend to help with school, is that funded on a plan? → No: STEP 5.\n- Is the house paid off? → No: STEP 6.\n- Then you are on STEP 7, and the question is no longer how much you keep but how much goes out.\n\nOne caveat worth repeating: everybody does the budget, at every step, forever. The budget is not a step. It is the engine underneath all seven.",
        visual: "money-seven-steps",
      },
      {
        heading: "The one-page plan",
        body: "Write this down — actually on paper, actually today. It fits on one page and it is the deliverable of this whole track.\n\n1. TODAY'S DATE and our NET WORTH.\n2. THE STEP WE ARE ON, and the specific number that finishes it — '$1,000', or 'the last $6,430 of debt', or '$18,000 in the emergency fund.'\n3. THE MONTHLY AMOUNT we are throwing at it, and the DATE that finishes it at that rate.\n4. WHAT WE ARE CUTTING to fund it, listed specifically. Not 'spend less.'\n5. WHAT WE ARE ADDING — extra income, things being sold, with dates.\n6. OUR GIVING, as a number.\n7. THREE THINGS WE WILL NOT DO: no new debt, no touching the emergency fund for non-emergencies, no quitting after a bad week.\n8. BOTH SIGNATURES, if you are married.\n\nPut it on the fridge. A plan in a drawer is a wish.",
      },
      {
        heading: "The first ninety days",
        body: "WEEK 1: Finish the honest inventory — net worth, debt list, 90 days of spending categorized. Pull credit reports and freeze credit at all three bureaus. Cancel the subscriptions you would not re-buy today.\n\nWEEK 2: Write next month's zero-based budget together. Set up the sinking funds. Pick your budgeting tool and actually put the numbers in it.\n\nWEEK 3: Sprint at the starter fund — list five things to sell, and pick up extra work. Open the separate savings account.\n\nWEEK 4: Check beneficiaries on every retirement account and insurance policy. Re-quote auto and home. Book the monthly budget meeting as a recurring appointment.\n\nMONTH 2: Work your step hard. Write the second budget — it will be better than the first and still wrong. Tell one trusted friend what you are doing.\n\nMONTH 3: Third budget. Compare month one's spending to month three's; the difference is usually startling. Then set the next ninety-day target and repeat.\n\nSomewhere in there, if you have no will and you have children, get that done. It is the cheapest peace available.",
        visual: "money-first-90-days",
      },
      {
        heading: "The rhythms that keep it alive",
        body: "WEEKLY (10 minutes): check the accounts against the budget. Any charge you do not recognize gets chased the same week.\n\nMONTHLY (30–45 minutes, before the month starts): the budget meeting. New month, both spouses, adjust categories, celebrate any win.\n\nQUARTERLY (30 minutes): net worth updated. Progress on the current step measured against the plan. Sinking funds reviewed.\n\nANNUALLY (a couple of hours, same weekend every year): re-quote insurance, verify beneficiaries, review deductibles against the emergency fund, walk the folder end to end, rebalance investments once, review your Roth/traditional split against this year's income, pull credit reports, and rewrite the one-page plan for the next year.\n\nThat is the entire maintenance burden of a financially healthy household. It is roughly fifteen hours a year, and it is worth more per hour than anything else you will do with your money.",
      },
      {
        heading: "Where people quit, and what to do instead",
        body: "- WEEK SIX. The novelty is gone and the finish line is far. This is normal and it is where most plans die. The fix is a visible scoreboard and a near-term win — which is exactly why we do the smallest debt first.\n- THE BLOWN MONTH. Something breaks, the budget shatters, and the reflex is to declare the whole thing a failure. You do not restart the plan. You restart the month. One bad month inside a two-year plan is noise.\n- THE SPOUSE WHO IS NOT ON BOARD. You cannot force this, and nagging makes it worse. Ask for a 90-day trial rather than a conversion. Let them hold the calculator. Look for the thing they actually want — a truck, a trip, a year at home with the kids — and show them how the plan gets it.\n- COMPARISON. Somebody's new car, somebody's kitchen, somebody's vacation photos. You do not know their balance sheet, and a startling amount of what you are looking at is financed. Run your own race.\n- LIFESTYLE CREEP AFTER A WIN. The raise, the paid-off car, the bonus — absorbed within two months, invisibly. Every raise gets a written assignment before it arrives.\n- SHAME AFTER A SETBACK. Shame makes people stop looking at the numbers, and not looking is what makes it worse. Look at it, say it out loud to somebody, adjust, keep going.\n\nGet a partner: another household on the same plan, or a friend you report to monthly. The single strongest predictor of finishing is that someone else knows what you are trying to do.",
        tip: "You will not be perfect at this. Nobody is. Consistent and imperfect beats perfect and abandoned, every single time.",
      },
      {
        heading: "Do this on Monday",
        body: "If you take one thing out of fifteen modules, take these five, in order:\n\n1. Write next month's budget with your spouse before the first of the month.\n2. Freeze your credit at all three bureaus. Fifteen minutes, free, today.\n3. Check the beneficiaries on every retirement account and insurance policy.\n4. Find your step and name the number that finishes it.\n5. Tell one person what you are doing, and ask them to ask you about it in thirty days.\n\nThen keep going. This is not a course you finish; it is a way of running a household, and the difference between a family who works this plan and one who does not compounds for the rest of your life — and, if you do it well, for the lives of the people you leave it to.\n\nIf you get stuck, ask. That is what the church is here for.",
      },
    ],
    quiz: [
      {
        question: "You have $1,000 saved, $12,000 in car debt, and you are contributing 6% to a 401(k). Which step are you on?",
        options: [
          "Step 1 — the starter fund",
          "Step 2 — the debt snowball",
          "Step 3 — the full emergency fund",
          "Step 4 — investing 15%",
        ],
        answer: 1,
        explanation:
          "Stop at the first 'no' walking down the list. The starter fund is done, but the debt is not gone — so it is step two, with investing paused for that season.",
      },
      {
        question: "Which activity happens at every step, forever?",
        options: [
          "The debt snowball",
          "Roth conversions",
          "The monthly zero-based budget",
          "Paying extra on the mortgage",
        ],
        answer: 2,
        explanation:
          "The budget is not a step — it is the engine underneath all seven, and it runs at every stage of the plan.",
      },
      {
        question: "Your budget falls apart in week three of the month. What do you do?",
        options: [
          "Restart the whole plan from the beginning",
          "Abandon budgeting until next quarter",
          "Restart the month — one bad month inside a two-year plan is noise",
          "Use a credit card to cover the gap and reset",
        ],
        answer: 2,
        explanation:
          "You restart the month, not the plan. Adjusting categories mid-month on purpose is budgeting, not failing.",
      },
      {
        question: "What is the strongest single predictor that a household finishes the plan?",
        options: [
          "A high income",
          "Someone else knowing what they are trying to do — an accountability partner",
          "Using a paid budgeting app",
          "Starting with little debt",
        ],
        answer: 1,
        explanation:
          "Accountability. A visible scoreboard, a partner household, or a friend who asks monthly does more for follow-through than income does.",
      },
      {
        question: "How much ongoing maintenance does a financially healthy household need?",
        options: [
          "Daily monitoring of accounts and markets",
          "About fifteen hours a year — weekly checks, a monthly budget meeting, a quarterly review, and one annual deep session",
          "A professional advisor handling everything",
          "Nothing once the plan is written",
        ],
        answer: 1,
        explanation:
          "Ten minutes weekly, 30–45 minutes monthly, a quarterly net-worth check, and one annual review of insurance, beneficiaries, and the plan itself.",
      },
    ],
  },
];

/** Slugs in curriculum order — used for prev/next navigation. */
export const financeModuleOrder: string[] = financeCurriculum
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((m) => m.slug);

export function getFinanceModule(slug: string): Module | undefined {
  return financeCurriculum.find((m) => m.slug === slug);
}

/**
 * Personal Finance chapters. Edit the groupings here; the /finance page
 * renders whatever this defines.
 */
export const financePhases: TrainingPhase[] = [
  {
    id: "money-start",
    name: "Start Here",
    tagline:
      "Why the church teaches this, the truth about your numbers, and the budget everything else runs on.",
    moduleSlugs: ["money-why", "money-where-you-are", "money-budget"],
  },
  {
    id: "money-dig-out",
    name: "Dig Out",
    tagline:
      "Steps 1–3: a fast starter fund, the debt snowball, credit handled like cash, and a real safety net.",
    moduleSlugs: [
      "money-starter-fund",
      "money-debt-snowball",
      "money-credit-as-cash",
      "money-emergency-fund",
    ],
  },
  {
    id: "money-build",
    name: "Build",
    tagline:
      "Steps 4–7: 15% invested, a deliberate mix of tax buckets, the kids' school, and the house.",
    moduleSlugs: [
      "money-invest-15",
      "money-roth-traditional",
      "money-college-house-legacy",
    ],
  },
  {
    id: "money-protect",
    name: "Protect It",
    tagline:
      "Insurance that transfers the risks that would ruin you, documents your family can find, and fraud that targets churches.",
    moduleSlugs: ["money-insurance", "money-wills-records", "money-scams"],
  },
  {
    id: "money-live-it",
    name: "Live It",
    tagline: "Generosity as the point, and your own plan on one page.",
    moduleSlugs: ["money-generosity", "money-your-plan"],
  },
];

/**
 * Resolve `financePhases` to their module objects, in phase order. Any module
 * not assigned to a phase is appended in a trailing group so a newly added
 * module can never silently disappear from the curriculum view.
 */
export function getFinancePhases(): ResolvedPhase[] {
  const assigned = new Set<string>();
  const resolved: ResolvedPhase[] = financePhases.map((phase) => {
    const modules = phase.moduleSlugs
      .map((slug) => getFinanceModule(slug))
      .filter((m): m is Module => Boolean(m));
    modules.forEach((m) => assigned.add(m.slug));
    return { ...phase, modules };
  });

  const orphans = financeCurriculum
    .filter((m) => !assigned.has(m.slug))
    .sort((a, b) => a.order - b.order);
  if (orphans.length) {
    resolved.push({
      id: "money-more",
      name: "More Modules",
      tagline: "Additional modules not yet assigned to a chapter.",
      moduleSlugs: orphans.map((m) => m.slug),
      modules: orphans,
    });
  }
  return resolved;
}

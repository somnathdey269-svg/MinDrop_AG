// Auto-generated unique recall content per category / pack.
// Every source (category or pack) gets its OWN copy + its OWN method examples.
// Known keys use hand-crafted content. Unknown keys pick a distinct "style" based
// on a stable hash of the name — so two new custom packs still feel different.
// Super Admin can override anything; overrides win over auto content.

import type { RecallMethodId } from "./recall";

export interface MethodExample {
  title?: string;
  text?: string;
  imageUrl?: string;
  items?: string[];
}

export interface GeneratedContent {
  title: string;
  patternCopy: string;
  whyCopy: string;
  nextTimeCopy: string;
  benefit: string;
  emotion: string;
  methodExamples: Partial<Record<RecallMethodId, MethodExample>>;
}

// -------- Hand-crafted, fully unique per source --------
const LIBRARY: Record<string, GeneratedContent> = {
  idea: {
    title: "Your ideas are piling up",
    patternCopy: "You've dropped {n} raw ideas lately — some brilliant, some just seeds.",
    whyCopy: "Ideas fade the moment life moves on. The good ones deserve a hook, not another note.",
    nextTimeCopy: "Next time a spark hits, attach it to a scene or a phrase so it survives the next hour.",
    benefit: "You stop losing the 3am ideas that could have changed something.",
    emotion: "💡 Spark",
    methodExamples: {
      story: { title: "Turn the idea into a scene", text: "You're on a train, staring out the window. The idea taps your shoulder and says “remember me — I'm the one that flips things.” From now on every train window quietly asks about your idea." },
      quote: { title: "Bottle it in one line", text: "“The idea I didn't want to lose — I'm keeping it alive.”" },
      checklist: { title: "Rescue the idea in 30s", items: ["One sentence — what is the idea, really?", "Who does it help, and when?", "One tiny next step, doable this week"] },
      image: { title: "Pin it to something you see daily", text: "Take a photo of your desk lamp or notebook cover. That object now carries your idea until you act on it." },
      chain: { title: "Piggyback the idea on coffee", items: ["Every first sip of coffee → recite the idea", "Every second sip → decide the next step", "By the third sip → the idea has moved forward"] },
    },
  },

  task: {
    title: "Small tasks are stacking up",
    patternCopy: "{n} little tasks captured — the kind that vanish if nobody catches them.",
    whyCopy: "Tasks don't need more reminders. They need an anchor to a moment where you can actually do them.",
    nextTimeCopy: "Attach each task to the exact moment you'll be free to do it — not a vague “later”.",
    benefit: "Tasks stop haunting you and start finishing themselves.",
    emotion: "✅ On it",
    methodExamples: {
      checklist: { title: "Squeeze this task in 3 lines", items: ["What exactly needs to happen", "When — the specific 10-minute window", "Where you'll be when you do it"] },
      quote: { title: "One-liner that finishes it", text: "“Two minutes. Right after I sit down. Done.”" },
      location: { title: "Pin it to a spot", text: "This task lives at your desk chair. The second you sit, the task waves — do me first." },
      "before-leave": { title: "Before you close the laptop", items: ["Ping — is this task 2 minutes or less?", "If yes → do it now, don't save it", "If no → schedule the exact block"] },
      rehearsal: { title: "Rehearse the task in your head", text: "Close your eyes for 10 seconds. See yourself opening the app, doing the thing, closing it. You've already done it once — the real one is just the replay." },
    },
  },

  reminder: {
    title: "You're relying on reminders a lot",
    patternCopy: "{n} reminders queued — that's a signal these things need a smarter cue.",
    whyCopy: "A reminder that pings once is easy to swipe away. A reminder tied to a place, person, or moment is much harder to miss.",
    nextTimeCopy: "Next time, tie the reminder to the moment it actually matters — not a random hour.",
    benefit: "You stop swiping notifications and start actually doing them.",
    emotion: "⏰ Don't miss",
    methodExamples: {
      "before-leave": { title: "Right before you step out", items: ["Keys, wallet, phone — check", "The reminder — done or ignored?", "Only then, out the door"] },
      location: { title: "Attach it to the doorframe", text: "The reminder lives at your front door. Hand on the handle = reminder rings in your head." },
      person: { title: "Hitch it to the next person", text: "Whoever you see next today — their face triggers the reminder. Human faces are stronger than any phone alarm." },
      song: { title: "Turn it into a tiny jingle", text: "Hum it to “Twinkle Twinkle” — one line, one melody. Your brain will sing it back at the right moment." },
    },
  },

  parking: {
    title: "You keep saving parking spots",
    patternCopy: "You've noted {n} parking locations recently — the panic is real.",
    whyCopy: "Parking amnesia isn't a memory problem — it's a moment-of-arrival problem. Your brain wasn't ready to encode it.",
    nextTimeCopy: "Next time you park, pair the spot with one weird visible thing you can't miss on return.",
    benefit: "You never do the sad slow lap around a parking lot again.",
    emotion: "🅿️ Relief",
    methodExamples: {
      image: { title: "Photograph the weirdest thing near you", text: "A pillar number, a stain, a poster, a lift door — snap it. Your camera roll is now your parking map." },
      story: { title: "Tell the spot a tiny story", text: "“I parked next to a red pillar labelled B7. B7 = Bond, 007. Agent Bond is guarding my car until I return.”" },
      quote: { title: "Say it out loud once", text: "“B7, red pillar, lift on the left.” Say it. Walk 5 steps. Say it again. Now it's yours." },
      "number-hook": { title: "Turn the bay into a rhyme", text: "“Bay one — sun. Bay two — shoe. Bay three — free.” Match your bay to the rhyme and it will echo back." },
      location: { title: "Anchor it to the exit", text: "The exit you use to leave is the one that must point back to your bay. Note it as you walk away, not before." },
    },
  },

  bill: {
    title: "Bills keep showing up in your captures",
    patternCopy: "{n} bill-related captures — money on the mind.",
    whyCopy: "Bills forgotten cost twice — the money AND the guilt. A rhythm beats a reminder every time.",
    nextTimeCopy: "Attach each bill to a fixed weekly ritual — Sunday coffee, Friday close-out — so you never chase them.",
    benefit: "You reclaim mental space that was silently rented by unpaid bills.",
    emotion: "💸 Peace of mind",
    methodExamples: {
      chain: { title: "Bills piggyback on Sunday coffee", items: ["Sunday, first coffee → open the bills tab", "Pay whatever is due this week", "Close the tab, sip the rest of the coffee"] },
      checklist: { title: "5-minute bill sweep", items: ["Which bills are due in 7 days?", "Auto-pay on for the recurring ones?", "One left to pay manually — do it now"] },
      quote: { title: "The one line that saves you", text: "“Sunday, coffee, bills. In that order.”" },
      "before-leave": { title: "Before you leave the house Monday", items: ["Any bill due today?", "Any bill you promised to pay yesterday?", "One tap now beats a late fee tomorrow"] },
    },
  },

  medication: {
    title: "Medicine reminders keep coming up",
    patternCopy: "{n} medication captures — this pattern deserves a bulletproof cue.",
    whyCopy: "Medicine timing needs a physical anchor, not a mental one. Willpower forgets. Objects don't.",
    nextTimeCopy: "Chain the dose to something you already do daily and cannot skip.",
    benefit: "You stop wondering “did I take it?” — the ritual does the remembering.",
    emotion: "🩺 Care",
    methodExamples: {
      chain: { title: "Piggyback the dose", items: ["Toothbrush picked up → dose taken", "Kettle switched on → dose swallowed", "Phone charger plugged in at night → last dose"] },
      location: { title: "Move it next to something unavoidable", text: "Place the bottle right next to your toothbrush or coffee cup. If you can't do the morning without seeing it, you can't miss it." },
      checklist: { title: "3-second confirm", items: ["Bottle in hand?", "Water in the other hand?", "Swallowed → cap back on"] },
      rehearsal: { title: "Mentally take the dose", text: "10 seconds — see yourself opening the bottle, pouring water, swallowing, capping it. The real one becomes automatic." },
    },
  },

  gift: {
    title: "You're thinking about gifts often",
    patternCopy: "{n} gift ideas caught — the good ones vanish by the time the occasion arrives.",
    whyCopy: "Gift ideas are precious and time-sensitive. They lose their charm if you find them in a note two years later.",
    nextTimeCopy: "Tag each gift with the person AND the exact next occasion, so it surfaces at the right moment.",
    benefit: "You become the friend who always remembers — without trying.",
    emotion: "🎁 Warmth",
    methodExamples: {
      person: { title: "Anchor the gift to the person's face", text: "Picture their face — now hand them the gift in your mind and watch them smile. That smile is the bookmark." },
      story: { title: "The tiny gifting scene", text: "It's their birthday. You hand over the gift. Their face lights up because the gift is oddly specific to them. Hold that image." },
      checklist: { title: "Lock the gift in 3 lines", items: ["Who — the exact person", "When — next birthday, anniversary, or meetup", "What — the specific idea, size, colour"] },
      quote: { title: "Whisper it to yourself", text: "“For {name} — the one that fits.”" },
    },
  },

  work: {
    title: "Work follow-ups keep piling up",
    patternCopy: "{n} work notes — meetings, follow-ups, promises made.",
    whyCopy: "Work memory dies fast because there's always the next meeting. Anchoring beats scrolling back through notes.",
    nextTimeCopy: "Tie each follow-up to the moment you'll actually act — end of standup, start of your focus block.",
    benefit: "You show up as the person who never drops a thread.",
    emotion: "💼 Focus",
    methodExamples: {
      "before-leave": { title: "Before you close the laptop", items: ["Any promise made today?", "Any unread from your manager?", "One line to send before you shut down"] },
      checklist: { title: "End-of-day 90s sweep", items: ["Slack unread — cleared", "Follow-up email — sent or scheduled", "Tomorrow's first task — chosen"] },
      chain: { title: "Piggyback on the last meeting", items: ["Last meeting ends → note the promise", "Promise noted → schedule the reply", "Reply scheduled → close the tab"] },
      location: { title: "Anchor to the desk chair", text: "The moment you sit at your desk, the follow-up rings. The chair is the alarm." },
    },
  },

  shopping: {
    title: "Shopping lists are forming",
    patternCopy: "{n} shopping bits — the classic “I'll remember at the store” trap.",
    whyCopy: "You never remember at the store. You remember at home, empty-handed, wondering why you went out.",
    nextTimeCopy: "Batch the list to the store entrance moment — not the moment you thought of it.",
    benefit: "You come back with exactly what you went for, plus nothing you didn't need.",
    emotion: "🛒 Ready",
    methodExamples: {
      location: { title: "Trigger at the store entrance", text: "The moment you push the store door — the list opens in your head. The doorway is the cue." },
      checklist: { title: "Aisle-order list", items: ["Produce first — the fresh stuff", "Middle aisles — the boring stuff", "Frozen last — so it doesn't melt"] },
      image: { title: "Photograph the empty shelf", text: "Snap the empty spot at home — jar, shelf, fridge drawer. That photo IS your list." },
      quote: { title: "The one line at checkout", text: "“Before I pay — did I get everything I actually came for?”" },
    },
  },

  travel: {
    title: "Travel details keep landing",
    patternCopy: "{n} travel captures — flights, packing, addresses, tickets.",
    whyCopy: "Travel memory fragments across days and apps. It needs one moment where everything is checked at once.",
    nextTimeCopy: "Sweep every travel detail 24 hours before you leave — one pass, one moment.",
    benefit: "You leave home relaxed instead of frantically double-checking at the gate.",
    emotion: "✈️ Excitement",
    methodExamples: {
      "before-leave": { title: "T-minus 24 hours checklist", items: ["Tickets and IDs — printed or offline", "Bag packed to the last item", "Chargers, adapters, medicine"] },
      checklist: { title: "Airport-door checklist", items: ["Wallet, phone, passport", "Boarding pass loaded offline", "Home locked, plants watered, keys with neighbour"] },
      image: { title: "Screenshot the essentials", text: "Screenshot: boarding pass, hotel address, first day's itinerary. All in the same album — one swipe and you're set." },
      story: { title: "Rehearse the arrival", text: "Imagine landing, walking out of the airport, showing the taxi the hotel address on your screen. If any step is fuzzy — fix it before you leave." },
    },
  },

  study: {
    title: "Study notes are stacking",
    patternCopy: "{n} study captures — the raw material is here, the retention isn't.",
    whyCopy: "Notes you never revisit are decoration. Recall is where the real learning happens.",
    nextTimeCopy: "For each concept, force yourself to explain it in one sentence — no textbook words.",
    benefit: "You learn once and remember it, instead of re-reading forever.",
    emotion: "📚 Growth",
    methodExamples: {
      quote: { title: "The one-line explainer", text: "“If I had to teach this to a 10-year-old, I'd say: ___.”" },
      story: { title: "Wrap it in a mini-story", text: "Attach the concept to a character doing the thing. Stories with a face beat definitions with a bullet." },
      checklist: { title: "3-question self-quiz", items: ["What is it, in one line?", "Why does it matter?", "When would I actually use it?"] },
      chain: { title: "Piggyback revision on walks", items: ["Every walk → replay one concept in your head", "Every meal → explain one concept out loud", "Every night → recall the day's top idea"] },
    },
  },

  food: {
    title: "Food notes keep appearing",
    patternCopy: "{n} food captures — recipes, cravings, restaurants, groceries.",
    whyCopy: "Food memory is fleeting because the next meal always overwrites it. It needs a hook to the moment you're actually hungry.",
    nextTimeCopy: "Attach the food idea to the meal slot it belongs to — Sunday dinner, weekday lunch, midnight snack.",
    benefit: "You eat what you actually wanted, not whatever's fastest.",
    emotion: "🍲 Comfort",
    methodExamples: {
      image: { title: "Snap the dish or the place", text: "One photo of the food or the sign outside. That photo becomes tomorrow's craving trigger." },
      checklist: { title: "Recipe rescue", items: ["Ingredients — the ones you don't have", "Time it takes — realistic", "When you'll actually make it — the specific day"] },
      quote: { title: "Craving one-liner", text: "“Next Sunday — the ___ I keep thinking about.”" },
      location: { title: "Pin it to the neighbourhood", text: "This place lives on the corner near the metro. Every time you pass — the memory pings." },
    },
  },

  health: {
    title: "Health signals keep repeating",
    patternCopy: "{n} health captures — the body is trying to tell you something.",
    whyCopy: "Health patterns matter most when you can see them at a glance. One-off notes don't reveal trends.",
    nextTimeCopy: "Log each signal with time + context — sleep, food, stress. Patterns emerge in a week.",
    benefit: "You catch what's going wrong before your body has to shout.",
    emotion: "🌿 Care",
    methodExamples: {
      checklist: { title: "3-line body check", items: ["What did I feel — one word", "What was I doing an hour before", "How intense — 1 to 10"] },
      chain: { title: "Body-scan piggybacked on bedtime", items: ["Head hits pillow → scan neck to toes", "Anything sore? Log it", "Anything wonderful? Log that too"] },
      location: { title: "The medicine cabinet as a cue", text: "The cabinet you open every morning — that's where the signal gets logged, no exceptions." },
      rehearsal: { title: "Rehearse the doctor visit", text: "Picture yourself explaining the pattern to your doctor in 30 seconds. If you can't — you're missing a detail. Add it now." },
    },
  },

  family: {
    title: "Family moments keep landing",
    patternCopy: "{n} family notes — the people who matter most.",
    whyCopy: "Family memory feels automatic but isn't. The details make the love visible — and details fade fastest.",
    nextTimeCopy: "For each family moment, capture one specific detail — a phrase, a smell, a small joke.",
    benefit: "You become the keeper of the moments everyone else forgets.",
    emotion: "🏠 Home",
    methodExamples: {
      story: { title: "The 3-sentence memory", text: "Where you were, what someone said, why it made you smile. Three sentences preserves it for a decade." },
      person: { title: "Anchor it to their face", text: "Picture their exact face in that moment. That face becomes the doorway back to it." },
      quote: { title: "Bottle the phrase", text: "“Nana said: ___. That's the line.”" },
      image: { title: "Photograph the ordinary thing", text: "Not the pose — the ordinary thing: the tea cup, the couch, the corner. Ordinary details age into gold." },
    },
  },

  festival: {
    title: "Festivals keep coming into your captures",
    patternCopy: "{n} festival captures — plans, gifts, greetings, food.",
    whyCopy: "Festival prep hits everyone at the last minute. Anchoring beats scrambling.",
    nextTimeCopy: "For every festival, capture in a checklist — greetings, gifts, food, outfit — a week ahead.",
    benefit: "You show up celebrating, not organising.",
    emotion: "🎉 Joy",
    methodExamples: {
      checklist: { title: "Festival-week checklist", items: ["Greetings — who to call, who to message", "Gifts — bought or planned", "Food — cooking, ordering, or joining"] },
      "before-leave": { title: "Right before the celebration", items: ["Outfit — ready and clean", "Gifts — in the bag", "Phone charged for photos"] },
      story: { title: "Rehearse the moment", text: "Picture the room, the people, the food. Anything missing? Fix it while there's still time." },
      person: { title: "Person-by-person round", text: "Go through your inner circle one face at a time — greeting sent, plan made, no one skipped." },
    },
  },

  money: {
    title: "Money is on your mind",
    patternCopy: "{n} money captures — budgets, expenses, decisions.",
    whyCopy: "Money stress lives in the fog of “I don't know exactly.” The fix is a fixed weekly moment — not more anxiety.",
    nextTimeCopy: "Pin the money review to one fixed time — every Sunday evening, coffee in hand.",
    benefit: "Money stops feeling like a mystery and starts feeling like a plan.",
    emotion: "💰 Control",
    methodExamples: {
      chain: { title: "Money check piggybacked on Sunday", items: ["Sunday evening → open the bank app", "Skim the week — anything odd?", "Move whatever needs moving"] },
      checklist: { title: "5-minute money sweep", items: ["Bank balance — checked", "Upcoming bills — accounted for", "Any unused subscription — cancelled"] },
      quote: { title: "The line that keeps you steady", text: "“Sunday evening. 10 minutes. That's all money gets from me this week.”" },
    },
  },

  meeting: {
    title: "Meetings keep filling your captures",
    patternCopy: "{n} meeting captures — attendees, notes, follow-ups.",
    whyCopy: "Meetings only pay off if the follow-ups get done. The notes are worthless without a next-step anchor.",
    nextTimeCopy: "After each meeting, capture ONE action, ONE owner, ONE deadline. Nothing more.",
    benefit: "You leave meetings with momentum instead of a wall of text.",
    emotion: "🤝 Prepared",
    methodExamples: {
      checklist: { title: "60-second post-meeting note", items: ["The ONE action", "The ONE owner", "The ONE deadline"] },
      "before-leave": { title: "Before you leave the room", items: ["Recap the ask out loud", "Confirm who does what", "Send the note before you stand up"] },
      quote: { title: "The closing line", text: "“Sending a recap in 5. Reply if I've missed anything.”" },
      rehearsal: { title: "Rehearse the recap", text: "In your head, deliver the 30-second recap of what was decided. Any gap = ask now, not later." },
    },
  },

  person: {
    title: "You're capturing people a lot",
    patternCopy: "{n} people-related captures — names, promises, plans.",
    whyCopy: "People stuff falls through the cracks fastest because it feels informal. It isn't — it's the whole thing.",
    nextTimeCopy: "For each person, save the one detail that will make them feel seen next time.",
    benefit: "People feel remembered by you. That's rare and worth everything.",
    emotion: "❤️ Belonging",
    methodExamples: {
      person: { title: "One detail per face", text: "For each person: one specific detail — their kid's name, their new job, the thing they were worried about." },
      story: { title: "The mini-scene about them", text: "Picture the last time you met them. What did they say? What were they wearing? Two details = future warmth." },
      checklist: { title: "Reconnect checklist", items: ["Who I haven't spoken to in 2+ weeks", "What was the last thing they told me", "One line message that acknowledges it"] },
    },
  },
};

// -------- Variant styles for unknown source names --------
// A stable hash picks one style so different new packs feel different.
const STYLES: Array<(name: string) => GeneratedContent> = [
  // Style 0 — Coach voice
  (name) => ({
    title: `${cap(name)} keeps circling back`,
    patternCopy: `You've captured {n} ${name.toLowerCase()} items lately — that's a signal, not noise.`,
    whyCopy: `When ${name.toLowerCase()} shows up this often, a plain note stops working. It needs a moment to live in.`,
    nextTimeCopy: `Next ${name.toLowerCase()} that lands — tie it to a fixed daily moment so it doesn't drift.`,
    benefit: `You stop babysitting ${name.toLowerCase()} and it starts running on its own.`,
    emotion: pickEmotion(name, 0),
    methodExamples: {
      story: { title: `A tiny ${name.toLowerCase()} scene`, text: `Picture ${name.toLowerCase()} showing up as a character at your door — polite, insistent, refusing to leave until you deal with it. Every doorbell now nudges ${name.toLowerCase()}.` },
      checklist: { title: `${cap(name)} in 3 lines`, items: [`What ${name.toLowerCase()} needs from you`, `When you'll give it that`, `What "done" actually looks like`] },
      quote: { title: `One line for ${name.toLowerCase()}`, text: `"${cap(name)} — handled by ${today()}, off my head by tonight."` },
      chain: { title: `Piggyback ${name.toLowerCase()}`, items: [`Morning coffee → ${name.toLowerCase()} check`, `Lunch break → ${name.toLowerCase()} step done`, `Evening walk → ${name.toLowerCase()} closed`] },
    },
  }),
  // Style 1 — Playful storyteller
  (name) => ({
    title: `The ${name.toLowerCase()} chapter has a lot of pages`,
    patternCopy: `${cap(name)} shows up {n} times in your recent notes — it's writing itself into your week.`,
    whyCopy: `Recurring things earn their own ritual. ${cap(name)} deserves one so it stops eating fresh brain space.`,
    nextTimeCopy: `Next ${name.toLowerCase()} entry — give it a place, a time, and a witness (a person, a spot, a sound).`,
    benefit: `${cap(name)} stops being a to-do list and starts being a rhythm.`,
    emotion: pickEmotion(name, 1),
    methodExamples: {
      story: { title: `Storyfy ${name.toLowerCase()}`, text: `Every ${name.toLowerCase()} moment is a scene. Give it a title, a setting, and one line of dialogue. Stories stick where lists slip.` },
      image: { title: `Photograph one ${name.toLowerCase()} moment`, text: `Take one photo that captures the essence of this ${name.toLowerCase()}. Album it. Six months from now it will still tell the story.` },
      quote: { title: `${cap(name)} in a sentence`, text: `"${cap(name)} — small thing today, big compound tomorrow."` },
      person: { title: `Attach ${name.toLowerCase()} to one person`, text: `Pick the person most connected to this ${name.toLowerCase()}. Their face is now your reminder — free, wireless, always with you.` },
    },
  }),
  // Style 2 — Calm ritual
  (name) => ({
    title: `A quiet ${name.toLowerCase()} pattern is forming`,
    patternCopy: `${n(`{n}`)} ${name.toLowerCase()} captures. Not urgent — meaningful.`,
    whyCopy: `Slow patterns are the ones worth naming. ${cap(name)} is asking for a small ritual, not a bigger reminder.`,
    nextTimeCopy: `Attach the next ${name.toLowerCase()} to a quiet moment — first coffee, last walk, before bed.`,
    benefit: `${cap(name)} becomes something you tend, not something that nags.`,
    emotion: pickEmotion(name, 2),
    methodExamples: {
      chain: { title: `A daily ${name.toLowerCase()} ritual`, items: [`Choose one quiet moment in your day`, `Every day, at that moment → one ${name.toLowerCase()} check-in`, `Two weeks in — it runs itself`] },
      location: { title: `A place for ${name.toLowerCase()}`, text: `Pick one spot at home — a chair, a window, a corner. That spot is where ${name.toLowerCase()} lives now.` },
      quote: { title: `${cap(name)} mantra`, text: `"${cap(name)} gets 5 minutes a day. That's enough."` },
      checklist: { title: `The gentle ${name.toLowerCase()} check`, items: [`How is ${name.toLowerCase()} today?`, `Anything one small step could help?`, `Take that step, then let it rest`] },
    },
  }),
  // Style 3 — Sharp operator
  (name) => ({
    title: `${cap(name)} is a repeatable pattern now`,
    patternCopy: `{n} ${name.toLowerCase()} entries. Time to systemise.`,
    whyCopy: `Anything you capture more than 3 times deserves a template, not another note. ${cap(name)} qualifies.`,
    nextTimeCopy: `Next ${name.toLowerCase()} — process it through the same 3-line template every time.`,
    benefit: `${cap(name)} runs on a system. You reclaim the decision energy.`,
    emotion: pickEmotion(name, 3),
    methodExamples: {
      checklist: { title: `${cap(name)} template`, items: [`Input — what triggered this ${name.toLowerCase()}`, `Action — the specific next move`, `Owner + deadline — no ambiguity`] },
      "before-leave": { title: `Close-out for ${name.toLowerCase()}`, items: [`Any ${name.toLowerCase()} still open?`, `Any ${name.toLowerCase()} to hand off?`, `Any ${name.toLowerCase()} to log for later?`] },
      rehearsal: { title: `Run ${name.toLowerCase()} in your head`, text: `10-second replay: see yourself handling this exact ${name.toLowerCase()} start to finish. The real one is now a rerun.` },
      quote: { title: `${cap(name)} operating principle`, text: `"${cap(name)} — captured, processed, closed. In that order, every time."` },
    },
  }),
  // Style 4 — Warm friend
  (name) => ({
    title: `Hey — ${name.toLowerCase()} keeps showing up`,
    patternCopy: `{n} ${name.toLowerCase()} notes recently. That's you telling yourself something matters here.`,
    whyCopy: `The reason it keeps coming back is that a plain reminder isn't landing. Give ${name.toLowerCase()} a real hook.`,
    nextTimeCopy: `Next ${name.toLowerCase()} — pin it to someone you'll see or a place you'll go.`,
    benefit: `You stop feeling forgetful. You start feeling on top of ${name.toLowerCase()}.`,
    emotion: pickEmotion(name, 4),
    methodExamples: {
      person: { title: `Who else cares about ${name.toLowerCase()}?`, text: `Pick one person who is part of this ${name.toLowerCase()} story. Tell them. Now ${name.toLowerCase()} has a second brain remembering it.` },
      location: { title: `The ${name.toLowerCase()} spot`, text: `Choose one place — kitchen counter, car dashboard, bathroom mirror. Everything about ${name.toLowerCase()} lands there.` },
      song: { title: `A ${name.toLowerCase()} jingle`, text: `Set "${cap(name)}, ${cap(name)}, don't forget ${cap(name)}" to Happy Birthday. Silly = sticky.` },
      story: { title: `Tell yourself the ${name.toLowerCase()} story`, text: `Two sentences: why ${name.toLowerCase()} matters, and how it feels when it's handled. Read it back next time it appears.` },
    },
  }),
];

function cap(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }
function n(x: string) { return x; }
function today(): string {
  const d = new Date();
  return d.toLocaleDateString(undefined, { weekday: "long" });
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const EMOTION_POOL = [
  "🌱 Growth", "🎯 Focus", "🕯️ Calm", "🚀 Momentum", "🧭 Direction",
  "💫 Clarity", "🔥 Drive", "☕ Ritual", "🌤️ Ease", "🎈 Lift",
];
function pickEmotion(name: string, offset: number): string {
  return EMOTION_POOL[(hash(name) + offset) % EMOTION_POOL.length];
}

export function generateRecallContent(sourceName: string): GeneratedContent {
  const key = sourceName.trim().toLowerCase();
  const known = LIBRARY[key];
  if (known) return known;
  const style = STYLES[hash(key) % STYLES.length];
  return style(sourceName);
}

/** Convenience: apply {name} / {n} fill to a MethodExample. */
export function fillMethodExample(
  ex: MethodExample | undefined,
  name: string,
  count?: number,
): MethodExample | undefined {
  if (!ex) return undefined;
  const fill = (s: string | undefined) =>
    s == null ? s : s.replaceAll("{name}", name).replaceAll("{n}", count == null ? "" : String(count));
  return {
    title: fill(ex.title),
    text: fill(ex.text),
    imageUrl: ex.imageUrl,
    items: ex.items?.map((i) => fill(i) ?? "").filter(Boolean),
  };
}

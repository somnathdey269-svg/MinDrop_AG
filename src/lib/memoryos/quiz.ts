export type PersonalityId = "explorer" | "juggler" | "storyteller" | "planner" | "freespirit";

export interface Personality {
  id: PersonalityId;
  emoji: string;
  name: string;
  color: string;
  blurb: string;
  remembers: string[];
  forgets: string[];
  fascinatingFact: string;
  rules: string[];
}

export interface QuizOption {
  id: string;
  label: string;
  emoji?: string;
  score: PersonalityId;
}

export interface QuizQuestion {
  id: string;
  title: string;
  scene?: string;
  helper?: string;
  multi?: boolean;
  maxPick?: number;
  options: QuizOption[];
}

export const defaultPersonalities: Personality[] = [
  {
    id: "storyteller",
    emoji: "🟣",
    name: "The Story Thinker",
    color: "#B79BCB",
    blurb: "You remember in scenes, not bullet points. Anything attached to a person or a moment lives in you forever.",
    remembers: ["What someone wore on a first date", "Jokes from a decade ago", "The shape of a conversation"],
    forgets: ["The actual date", "Where you put the receipt", "The username, not the face"],
    fascinatingFact: "Memories tied to emotion are stored differently in the brain — the amygdala stamps them as 'keep forever.' Your brain is just doing more of that.",
    rules: ["story-link", "people-cards"],
  },
  {
    id: "juggler",
    emoji: "🔵",
    name: "The Juggler",
    color: "#7BA7C9",
    blurb: "You're not forgetful — you're running seven things in parallel. The small stuff drops because the big stuff is loud.",
    remembers: ["What everyone in the room needs", "The deadline at the top of the hour", "Who said what in the meeting"],
    forgets: ["The charger on the desk", "Why you walked into the kitchen", "The thing you literally just said you'd do"],
    fascinatingFact: "Working memory holds about four items at a time. You're typically holding nine. The math isn't kind, but the brain is doing its best.",
    rules: ["quick-capture", "morning-digest"],
  },
  {
    id: "explorer",
    emoji: "🟢",
    name: "The Explorer",
    color: "#7BAE7F",
    blurb: "You think in maps and pictures. A place, a colour, a corner of a room — those are your bookmarks.",
    remembers: ["The exact café table you sat at", "A face from a train two years ago", "How to get back to somewhere once"],
    forgets: ["The name that goes with the face", "Which folder you saved it in", "Whether you locked the door"],
    fascinatingFact: "London cabbies grow a measurably larger hippocampus from memorising streets. Your brain leans on that same spatial wiring.",
    rules: ["location-recall", "visual-tagging"],
  },
  {
    id: "planner",
    emoji: "🟠",
    name: "The Planner",
    color: "#E0A368",
    blurb: "You already externalise — calendars, lists, sticky notes. You'd just love a system that learns instead of nagging.",
    remembers: ["Every renewal date", "Who owes who money", "The right time to leave for the airport"],
    forgets: ["To actually rest", "The unscheduled thing", "What it felt like, only what was done"],
    fascinatingFact: "Writing something down once makes you 42% more likely to act on it. You instinctively offload — MinDrop just makes it weightless.",
    rules: ["habit-learn", "smart-bundle"],
  },
  {
    id: "freespirit",
    emoji: "🟡",
    name: "The Free Spirit",
    color: "#E6C76A",
    blurb: "Your memory works on vibes. Mostly fine, occasionally catastrophic, always interesting.",
    remembers: ["The mood of a whole summer", "Songs you heard once", "Which friend makes you laugh hardest"],
    forgets: ["Where the phone is (it's in your hand)", "What you came upstairs for", "The thing you swore you'd never forget"],
    fascinatingFact: "The 'doorway effect' is real — walking through a door literally clears parts of your short-term memory. It's architecture, not you.",
    rules: ["gentle-nudge"],
  },
];

export const defaultQuestions: QuizQuestion[] = [
  {
    id: "q1",
    scene: "Friday, 7:14 pm",
    title: "You finally sit down. What's the first thing your brain reminds you that you forgot today?",
    options: [
      { id: "a", label: "Replying to that one message", emoji: "💬", score: "juggler" },
      { id: "b", label: "Something on the grocery list", emoji: "🥑", score: "freespirit" },
      { id: "c", label: "A bill or a renewal", emoji: "📄", score: "planner" },
      { id: "d", label: "Wishing someone happy birthday", emoji: "🎂", score: "storyteller" },
      { id: "e", label: "Where you left your earphones", emoji: "🎧", score: "explorer" },
    ],
  },
  {
    id: "q2",
    scene: "Be honest",
    title: "You open the fridge. Then you stand there. What's actually happening?",
    options: [
      { id: "a", label: "I forgot what I came for", emoji: "🌀", score: "freespirit" },
      { id: "b", label: "I'm mentally writing tomorrow's to-do list", emoji: "🗒️", score: "planner" },
      { id: "c", label: "I'm replaying a conversation in my head", emoji: "💭", score: "storyteller" },
      { id: "d", label: "I'm scanning, like a hawk — I will find food", emoji: "🦅", score: "explorer" },
      { id: "e", label: "Six tabs are open in my brain", emoji: "🧠", score: "juggler" },
    ],
  },
  {
    id: "q3",
    scene: "A name on the tip of your tongue",
    title: "What usually comes back first?",
    options: [
      { id: "a", label: "Their face", emoji: "👤", score: "explorer" },
      { id: "b", label: "Where you last saw them", emoji: "📍", score: "explorer" },
      { id: "c", label: "What you talked about", emoji: "💬", score: "storyteller" },
      { id: "d", label: "The first letter, I swear", emoji: "🔤", score: "planner" },
      { id: "e", label: "Nothing. Just static.", emoji: "📺", score: "freespirit" },
    ],
  },
  {
    id: "q4",
    scene: "Something you must not forget tomorrow",
    title: "Where does it go right now?",
    options: [
      { id: "a", label: "In my head, I'll remember", emoji: "🤞", score: "freespirit" },
      { id: "b", label: "WhatsApp to myself", emoji: "📩", score: "juggler" },
      { id: "c", label: "Calendar with an alarm", emoji: "⏰", score: "planner" },
      { id: "d", label: "I tell someone else to remind me", emoji: "🫶", score: "storyteller" },
      { id: "e", label: "Pinned tab, sticky note, or photo", emoji: "📌", score: "explorer" },
    ],
  },
  {
    id: "q5",
    scene: "It's a tiny win",
    title: "Which one would actually make your week better?",
    options: [
      { id: "a", label: "Never standing in the parking lot again", emoji: "🅿️", score: "explorer" },
      { id: "b", label: "Remembering names on the first try", emoji: "🪪", score: "storyteller" },
      { id: "c", label: "Bills paid before the reminder texts", emoji: "💸", score: "planner" },
      { id: "d", label: "Walking out the door with everything", emoji: "🎒", score: "juggler" },
      { id: "e", label: "Just one less 'I knew I forgot something' moment", emoji: "🫠", score: "freespirit" },
    ],
  },
  {
    id: "q6",
    scene: "Imagine a soft notification, perfectly timed",
    title: "Which one would make you smile, not roll your eyes?",
    options: [
      { id: "a", label: "'Mum's medicine in 10 mins.'", emoji: "💊", score: "storyteller" },
      { id: "b", label: "'You parked on Level 3, Section B.'", emoji: "🅿️", score: "explorer" },
      { id: "c", label: "'Bill due Friday — already drafted.'", emoji: "🧾", score: "planner" },
      { id: "d", label: "'You said you'd call Riya this week.'", emoji: "📞", score: "juggler" },
      { id: "e", label: "'That song you loved last June.'", emoji: "🎵", score: "freespirit" },
    ],
  },
  {
    id: "q7",
    title: "Pick the sentence that sounds embarrassingly like you.",
    options: [
      { id: "a", label: "'I have a brilliant system. Somewhere.'", emoji: "🗂️", score: "planner" },
      { id: "b", label: "'My brain has 57 tabs open and one is playing music.'", emoji: "🎶", score: "juggler" },
      { id: "c", label: "'I'll never forget that day in 2014.'", emoji: "🗓️", score: "storyteller" },
      { id: "d", label: "'I know it's somewhere on the third shelf.'", emoji: "📚", score: "explorer" },
      { id: "e", label: "'It'll come to me. It always does. (it won't)'", emoji: "🌬️", score: "freespirit" },
    ],
  },
  {
    id: "q8",
    scene: "One free superpower",
    title: "If a tiny chip in your brain could hold ONE thing forever, what's it for?",
    helper: "Pick up to 2",
    multi: true,
    maxPick: 2,
    options: [
      { id: "a", label: "Names of every person I meet", emoji: "🪪", score: "storyteller" },
      { id: "b", label: "Every promise I made", emoji: "🤝", score: "planner" },
      { id: "c", label: "Where I put every important thing", emoji: "🗝️", score: "explorer" },
      { id: "d", label: "Every birthday and anniversary", emoji: "🎂", score: "storyteller" },
      { id: "e", label: "Everything I'm supposed to be carrying", emoji: "🎒", score: "juggler" },
      { id: "f", label: "Every idea I had in the shower", emoji: "💡", score: "freespirit" },
    ],
  },
  {
    id: "q9",
    scene: "End of a long day",
    title: "What's the most likely reason something fell through the cracks?",
    options: [
      { id: "a", label: "Too many small things at once", emoji: "🌀", score: "juggler" },
      { id: "b", label: "I trusted memory, didn't write it down", emoji: "✍️", score: "freespirit" },
      { id: "c", label: "I wrote it in the wrong place", emoji: "📒", score: "planner" },
      { id: "d", label: "I remembered the wrong detail", emoji: "🔁", score: "storyteller" },
      { id: "e", label: "I went looking, couldn't find it", emoji: "🔎", score: "explorer" },
    ],
  },
  {
    id: "q10",
    title: "Last one — what would you actually want from a second memory?",
    options: [
      { id: "a", label: "Quiet — only nudge when I really need it", emoji: "🌙", score: "freespirit" },
      { id: "b", label: "A clean home for every loose end", emoji: "🧺", score: "planner" },
      { id: "c", label: "Faces and names that finally stick", emoji: "👥", score: "storyteller" },
      { id: "d", label: "A map of where everything is", emoji: "🗺️", score: "explorer" },
      { id: "e", label: "Help me drop two of my nine open tabs", emoji: "🪟", score: "juggler" },
    ],
  },
];

export function scorePersonality(
  answers: Record<string, string[]>,
  questions: QuizQuestion[],
  personalities: Personality[],
): Personality {
  const tally: Record<string, number> = {};
  for (const q of questions) {
    const picks = answers[q.id] ?? [];
    for (const optId of picks) {
      const opt = q.options.find((o) => o.id === optId);
      if (opt) tally[opt.score] = (tally[opt.score] ?? 0) + 1;
    }
  }
  let winner = personalities[0];
  let max = -1;
  for (const p of personalities) {
    if ((tally[p.id] ?? 0) > max) {
      max = tally[p.id] ?? 0;
      winner = p;
    }
  }
  return winner;
}

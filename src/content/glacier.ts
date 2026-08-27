export type Provenance = "OBSERVED" | "MODELED" | "ILLUSTRATIVE" | "FICTIONAL STORY ELEMENT";

export type Act = {
  id: string;
  index: number;
  eyebrow: string;
  title: string;
  statement: string;
  body: string;
};

export const ACTS: Act[] = [
  {
    id: "arrival",
    index: 0,
    eyebrow: "Act I — Arrival",
    title: "A quiet, frozen world",
    statement: "Some places keep time better than we do.",
    body: "You are standing at the edge of a valley that has been writing itself for eleven thousand winters. Nothing here is in a hurry. Let your eyes adjust to the dark before we begin.",
  },
  {
    id: "ice-core",
    index: 1,
    eyebrow: "Act II — Ice Memory",
    title: "The archive inside the ice",
    statement: "Every layer is a season that stayed.",
    body: "Cut the glacier open and it reads like paper. Dust from distant fires, ash, pollen, trapped air — each band is a year that refused to disappear.",
  },
  {
    id: "surface",
    index: 2,
    eyebrow: "Act III — The Changing Surface",
    title: "Time you can hold in your hand",
    statement: "The landscape is changing faster than memory can hold.",
    body: "Drag through the years. The terminus withdraws, the meltwater basin widens, and the mountain remembers a shape it no longer has.",
  },
  {
    id: "river",
    index: 3,
    eyebrow: "Act IV — The River Below",
    title: "Follow the water down",
    statement: "A glacier is a promise the mountain makes to the valley.",
    body: "Meltwater is the thread. It reaches meadows, wildlife, fields, turbines, taps, and one small town that turns its lights on at dusk.",
  },
  {
    id: "future",
    index: 4,
    eyebrow: "Act V — Possible Futures",
    title: "Choices are connected",
    statement: "No single lever moves the whole system.",
    body: "Adjust five collective choices and watch the valley respond. Nothing here is a prediction — it is a way of feeling how decisions interact.",
  },
  {
    id: "reflection",
    index: 5,
    eyebrow: "Act VI — Reflection",
    title: "What remains",
    statement: "What will remain depends on what we choose together.",
    body: "Take a card with you. Not as a warning — as a note from a place that is still here.",
  },
];

export type TimeState = {
  id: string;
  label: string;
  year: string;
  extent: number; // 1 = full historical extent
  note: string;
  provenance: Provenance;
};

export const TIMELINE: TimeState[] = [
  {
    id: "then",
    label: "Then",
    year: "c. 1890",
    extent: 1,
    note: "The terminus reaches the lower basin. The valley floor is ice, not water.",
    provenance: "ILLUSTRATIVE",
  },
  {
    id: "today",
    label: "Today",
    year: "Present",
    extent: 0.72,
    note: "The tongue has withdrawn above the moraine. A proglacial lake now holds the melt.",
    provenance: "OBSERVED",
  },
  {
    id: "2050",
    label: "2050",
    year: "2050",
    extent: 0.48,
    note: "Summer melt outpaces winter accumulation in most modelled years.",
    provenance: "MODELED",
  },
  {
    id: "2080",
    label: "2080",
    year: "2080",
    extent: 0.26,
    note: "Only the high cirque holds permanent ice. Late-summer flow becomes unreliable.",
    provenance: "MODELED",
  },
  {
    id: "beyond",
    label: "Beyond",
    year: "Beyond",
    extent: 0.1,
    note: "What remains depends on choices made decades earlier — and on how quickly they were made.",
    provenance: "ILLUSTRATIVE",
  },
];

export type CoreLayer = {
  depth: string;
  era: string;
  label: string;
  detail: string;
};

export const CORE_LAYERS: CoreLayer[] = [
  { depth: "0–4 m", era: "Last decade", label: "Fresh firn", detail: "Loose, air-rich snow still compacting into ice. Warm summers leave visible melt crusts." },
  { depth: "12 m", era: "1980s", label: "Soot band", detail: "A dark ribbon of industrial carbon. Dark ice absorbs more light and melts faster." },
  { depth: "31 m", era: "1940s", label: "Ash horizon", detail: "Volcanic glass from a distant eruption, carried across an ocean in the upper atmosphere." },
  { depth: "58 m", era: "1810s", label: "Cold decade", detail: "Dense, bubble-poor ice from a run of long winters. The layer is thin but very hard." },
  { depth: "96 m", era: "c. 1450", label: "Pollen line", detail: "Grains from a forest that grew several hundred metres lower than today's treeline." },
];

export type RiverStop = {
  id: string;
  name: string;
  line: string;
  detail: string;
};

export const RIVER_STOPS: RiverStop[] = [
  { id: "plants", name: "Alpine meadow", line: "First green", detail: "Cushion plants time their flowering to the first meltwater of the season." },
  { id: "wildlife", name: "Wildlife habitat", line: "Cold-water refuge", detail: "Trout and invertebrates depend on the narrow temperature window glacial flow provides." },
  { id: "fields", name: "Terraced fields", line: "Late-summer irrigation", detail: "When the rain stops, the ice keeps the valley's fields watered until harvest." },
  { id: "power", name: "Run-of-river turbine", line: "Steady current", detail: "Reliable summer flow is a quiet form of energy infrastructure." },
  { id: "town", name: "Downstream town", line: "Taps and reservoirs", detail: "Two thousand households draw from the same channel that leaves the ice." },
  { id: "home", name: "One lit window", line: "Home", detail: "Everything upstream ends here: a kitchen light, a kettle, an ordinary evening." },
];

export type Lever = {
  id: string;
  label: string;
  detail: string;
  weights: { ice: number; water: number; eco: number; community: number };
};

export const LEVERS: Lever[] = [
  { id: "energy", label: "Clean energy transition", detail: "How quickly emissions from power generation fall.", weights: { ice: 0.34, water: 0.22, eco: 0.14, community: 0.12 } },
  { id: "transport", label: "Transport transformation", detail: "Electrification, rail, and reduced aviation demand.", weights: { ice: 0.24, water: 0.14, eco: 0.12, community: 0.1 } },
  { id: "eco", label: "Ecosystem restoration", detail: "Forests, wetlands, and soil recovery in the catchment.", weights: { ice: 0.12, water: 0.18, eco: 0.4, community: 0.14 } },
  { id: "water", label: "Water planning", detail: "Storage, allocation, and leak reduction downstream.", weights: { ice: 0.04, water: 0.34, eco: 0.16, community: 0.28 } },
  { id: "community", label: "Community adaptation", detail: "Local knowledge, funding, and shared infrastructure.", weights: { ice: 0.04, water: 0.14, eco: 0.14, community: 0.4 } },
];

export const LAYERS = [
  { id: "ice", label: "Ice & terrain" },
  { id: "water", label: "Meltwater" },
  { id: "aurora", label: "Aurora & sky" },
  { id: "human", label: "Human scale" },
  { id: "labels", label: "Data hotspots" },
] as const;

export type LayerId = (typeof LAYERS)[number]["id"];

export const SOURCES = [
  {
    title: "Glacier mass balance monitoring",
    org: "World Glacier Monitoring Service",
    provenance: "OBSERVED" as Provenance,
    note: "Long-run measurements of glacier gain and loss inform the shape of the retreat curve shown in Act III.",
  },
  {
    title: "Cryosphere chapter, assessment synthesis",
    org: "IPCC",
    provenance: "MODELED" as Provenance,
    note: "Scenario framing for the 2050 / 2080 states and for how the five levers interact.",
  },
  {
    title: "Ice core paleoclimate records",
    org: "Published core archives",
    provenance: "OBSERVED" as Provenance,
    note: "The layer types in Act II — firn, soot, ash, pollen — are real features of real cores.",
  },
  {
    title: "This valley",
    org: "The Last Glacier",
    provenance: "FICTIONAL STORY ELEMENT" as Provenance,
    note: "The glacier, river stops, and town are composites written for this piece. Numbers on screen are illustrative, not measurements of a named place.",
  },
];

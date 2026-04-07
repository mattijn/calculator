import { InteractiveContent } from "./types";

export const contentNl: InteractiveContent = {
  languageName: "Nederlands",
  title: "Een Betere Manier Om Machten, Wortels en Logaritmes Te Lezen",
  subtitle:
    "Dit interactieve verhaal legt de notatie stap voor stap uit en laat je elk idee direct testen in de calculator.",
  sections: {
    hookTitle: "Waarom voelt dit moeilijker dan nodig?",
    hookBody:
      "Veel mensen ervaren machten, wortels en logaritmes als losse trucjes. Het doel hier is om ze te tonen als een samenhangende familie van rekenbewerkingen.",
    intuitionTitle: "Notatie-intuitie in een minuut",
    intuitionBody:
      "Lees ↑ als macht omhoog, ↓ als macht omlaag (wortel), en ⇓ als dubbel omlaag (logaritme met basis). De symbolen lijken op elkaar omdat de bewerkingen ook bij elkaar horen.",
    guidedTitle: "Geleide voorbeelden: klassieke notatie vs nieuwe notatie",
    proofTitle: "Bewijs-theater: moeilijke wortel, simpele stappen",
    practiceTitle: "Oefen vrij met de volledige calculator",
    reflectionTitle: "Reflectie",
    reflectionBody:
      "Als notatie je sneller laat denken, dan doet notatie echt werk. Vergelijk vormen in de calculator tot het natuurlijk gaat voelen.",
  },
  labels: {
    traditional: "Klassieke notatie",
    notation: "Alternatieve notatie",
    runInCalculator: "Voer uit in calculator",
    runStep: "Voer deze stap uit",
  },
  examples: [
    {
      id: "principal",
      title: "Benodigd startbedrag na 10 jaar",
      context: "Hoeveel heb ik nu nodig om op 1000 uit te komen bij 3% voor 10 jaar?",
      traditional: "m = 1000 / 1.03^10",
      notation: "m = 1000 ÷ 1.03↑10",
      expression: "1000÷1.03↑10",
    },
    {
      id: "rate",
      title: "Rente om geld in 10 jaar te verdubbelen",
      context: "Los r op in r^10 = 2",
      traditional: "r = 2^(1/10)",
      notation: "r = 2↓10",
      expression: "2↓10",
    },
    {
      id: "time",
      title: "Aantal jaren om te verdubbelen bij 3%",
      context: "Los y op in 1.03^y = 2",
      traditional: "y = log(2) / log(1.03)",
      notation: "y = 2⇓1.03",
      expression: "2⇓1.03",
    },
  ],
  proof: {
    title: "Identiteit met geneste wortel",
    intro:
      "We doorlopen een klassieke wortelstelling met notatie waarin inverse relaties zichtbaar blijven in elke stap.",
    steps: [
      { id: "s1", label: "Start met de doelvorm", expression: "(3+2×2↓2)↓2" },
      { id: "s2", label: "Kwadrateer de rechterkant", expression: "(1+2↓2)↑2" },
      { id: "s3", label: "Werk (a+b)↑2 uit", expression: "1↑2+2×2↓2+(2↓2)↑2" },
      { id: "s4", label: "Vereenvoudig 1↑2 en (2↓2)↑2", expression: "1+2×2↓2+2" },
      { id: "s5", label: "Herschik", expression: "3+2×2↓2" },
      { id: "s6", label: "Neem de vierkantswortel", expression: "(3+2×2↓2)↓2" },
    ],
  },
};

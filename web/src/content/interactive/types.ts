export type ExampleCard = {
  id: string;
  title: string;
  context: string;
  traditional: string;
  notation: string;
  expression: string;
};

export type ProofStep = {
  id: string;
  label: string;
  expression: string;
};

export type InteractiveContent = {
  languageName: string;
  title: string;
  subtitle: string;
  sections: {
    hookTitle: string;
    hookBody: string;
    intuitionTitle: string;
    intuitionBody: string;
    guidedTitle: string;
    proofTitle: string;
    practiceTitle: string;
    reflectionTitle: string;
    reflectionBody: string;
  };
  labels: {
    traditional: string;
    notation: string;
    runInCalculator: string;
    runStep: string;
  };
  examples: ExampleCard[];
  proof: {
    title: string;
    intro: string;
    steps: ProofStep[];
  };
};

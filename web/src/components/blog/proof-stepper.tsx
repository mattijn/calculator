import { ProofStep } from "@/content/interactive/types";

type ProofStepperProps = {
  title: string;
  intro: string;
  steps: ProofStep[];
  runLabel: string;
  onRunStep: (expression: string) => void;
};

export function ProofStepper({
  title,
  intro,
  steps,
  runLabel,
  onRunStep,
}: ProofStepperProps) {
  return (
    <section className="card stack" id="proof">
      <h2>{title}</h2>
      <p className="muted">{intro}</p>
      <div className="stack">
        {steps.map((step, index) => (
          <div key={step.id} className="proofStep">
            <p>
              <strong>
                {index + 1}. {step.label}
              </strong>
            </p>
            <code>{step.expression}</code>
            <button className="secondaryBtn" onClick={() => onRunStep(step.expression)}>
              {runLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

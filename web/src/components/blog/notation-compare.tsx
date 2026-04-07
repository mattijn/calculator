type NotationCompareProps = {
  title: string;
  context: string;
  traditionalLabel: string;
  notationLabel: string;
  traditional: string;
  notation: string;
  runLabel: string;
  onRun: () => void;
};

export function NotationCompare(props: NotationCompareProps) {
  const {
    title,
    context,
    traditionalLabel,
    notationLabel,
    traditional,
    notation,
    runLabel,
    onRun,
  } = props;

  return (
    <article className="card stack">
      <h3>{title}</h3>
      <p className="muted">{context}</p>
      <div className="compareGrid">
        <div className="compareCell">
          <h4>{traditionalLabel}</h4>
          <code>{traditional}</code>
        </div>
        <div className="compareCell">
          <h4>{notationLabel}</h4>
          <code>{notation}</code>
        </div>
      </div>
      <button className="primaryBtn" onClick={onRun}>
        {runLabel}
      </button>
    </article>
  );
}

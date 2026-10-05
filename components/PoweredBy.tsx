export default function PoweredBy({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <span className="powered-by" data-variant={variant} aria-label="Powered by Prim">
      <span className="powered-by__tag">&lt;</span>
      <span className="powered-by__key">Powered</span> <span className="powered-by__attr">by</span>
      <span className="powered-by__tag">=</span>
      <span className="powered-by__val">&quot;Prim&quot;</span>
      <span className="powered-by__tag"> /&gt;</span>
      <span className="powered-by__caret" aria-hidden="true">_</span>
    </span>
  );
}

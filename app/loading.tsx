export default function Loading() {
  return (
    <main className="container page-top" aria-live="polite" aria-busy="true">
      <div className="panel loading-panel">
        <span className="eyebrow">StackNova</span>
        <h1>لحظة واحدة...</h1>
        <p>نجهّز لك محتوى الصفحة.</p>
        <div className="progress-track" aria-hidden="true"><div className="progress-fill loading-fill" /></div>
      </div>
    </main>
  );
}

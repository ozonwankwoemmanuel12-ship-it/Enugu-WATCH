const STEPS = [
  {
    num: '01',
    title: 'See Something',
    text: 'A resident notices an incident or potential danger in the community.',
    color: '#0284c7',
    bg: '#e0f2fe',
  },
  {
    num: '02',
    title: 'Report It',
    text: 'Submit a structured report with description, category, priority and relevant information.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    num: '03',
    title: 'Verify It',
    text: 'Authorised community personnel review the report before action.',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    num: '04',
    title: 'Respond',
    text: 'Relevant residents and responders receive the appropriate alert.',
    color: '#16a34a',
    bg: '#dcfce7',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">How It Works</div>
          <h2 className="section-title">From report to response.</h2>
          <p className="section-sub">
            A clear, structured path that keeps a community informed without panic.
          </p>
        </div>

        <div className="grid grid--4">
          {STEPS.map((step) => (
            <div key={step.num}>
              <article className="step-card">
                <div className="step-num">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-text">{step.text}</p>
              </article>
            </div>
          ))}
        </div>

        <div className="flow-chart">
          {['REPORT', 'VERIFY', 'ALERT', 'RESPOND'].map((step, index, arr) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="flow-step">{step}</span>
              {index < arr.length - 1 && <span className="flow-arrow">→</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
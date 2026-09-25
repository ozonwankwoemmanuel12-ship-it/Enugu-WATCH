import { ShieldCheck, Lock, Clipboard } from '../icons.jsx'

const ITEMS = [
  {
    title: 'Verified information',
    text: 'Reports can be reviewed before wider alerts are distributed.',
    icon: ShieldCheck,
  },
  {
    title: 'Privacy first',
    text: 'Only necessary information should be shared.',
    icon: Lock,
  },
  {
    title: 'Accountable response',
    text: 'Incidents have a documented status and response history.',
    icon: Clipboard,
  },
]

export default function Trust() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Trust &amp; Accountability</div>
          <h2 className="section-title">Built around trust, privacy and accountability.</h2>
        </div>

        <div className="grid grid--3">
          {ITEMS.map((item) => (
            <article className="trust-card" key={item.title}>
              <h3 className="trust-title">
                <span className="trust-icon">
                  <item.icon width={19} height={19} />
                </span>
                {item.title}
              </h3>
              <p className="trust-text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
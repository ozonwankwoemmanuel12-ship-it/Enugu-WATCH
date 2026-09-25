import { Bell, Clipboard, MapPin, Users, ShieldCheck, Activity } from '../icons.jsx'

const FEATURES = [
  {
    title: 'Emergency Alerts',
    text: 'Send urgent alerts to the people who need them.',
    icon: Bell,
  },
  {
    title: 'Incident Reporting',
    text: 'Report security and safety incidents with location and evidence.',
    icon: Clipboard,
  },
  {
    title: 'Safety Map',
    text: 'View relevant verified incidents around your community.',
    icon: MapPin,
  },
  {
    title: 'Community Network',
    text: 'Connect residents, community leaders and authorised security personnel.',
    icon: Users,
  },
  {
    title: 'Verification',
    text: 'Distinguish initial reports from verified incidents.',
    icon: ShieldCheck,
  },
  {
    title: 'Safety Intelligence',
    text: 'Identify recurring incidents and patterns over time.',
    icon: Activity,
  },
]

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Features</div>
          <h2 className="section-title">Everything your community needs to stay informed.</h2>
          <p className="section-sub">
            Built for calm, structured response — not panic.
          </p>
        </div>

        <div className="grid grid--3">
          {FEATURES.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon">
                <feature.icon width={22} height={22} />
              </span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-text">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
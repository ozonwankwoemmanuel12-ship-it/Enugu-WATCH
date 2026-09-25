import { Link } from 'react-router-dom'
import { ShieldCheck, Clipboard, Bell, MapPin } from '../icons.jsx'

const ITEMS = [
  {
    title: 'Community safety guide',
    text: 'Learn how structured reporting works in your zone.',
    icon: ShieldCheck,
    to: '/register',
    cta: 'Get started',
  },
  {
    title: 'Recent incidents',
    text: 'See reported incidents and their current status.',
    icon: Clipboard,
    to: '/app/incidents',
    cta: 'View incidents',
  },
  {
    title: 'Safety alerts',
    text: 'Stay informed about alerts relevant to your zone.',
    icon: Bell,
    to: '/app/alerts',
    cta: 'View alerts',
  },
  {
    title: 'Community map',
    text: 'Explore the safety map used across the platform.',
    icon: MapPin,
    to: '/#safety',
    cta: 'See the map',
  },
]

export default function Resources() {
  return (
    <section id="resources" className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Resources</div>
          <h2 className="section-title">Start with the essentials.</h2>
          <p className="section-sub">
            Quick paths into reporting, alerts and the safety map.
          </p>
        </div>
        <div className="grid grid--4">
          {ITEMS.map((item) => (
            <article className="feature-card" key={item.title}>
              <span className="feature-icon">
                <item.icon width={21} height={21} />
              </span>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-text">{item.text}</p>
              <Link to={item.to} className="btn btn--ghost btn--sm btn--block">
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
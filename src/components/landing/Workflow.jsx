import { Alert, Clock, CheckCircle, Siren } from '../icons.jsx'

const STAGES = [
  { title: 'Reported', text: 'A structured incident report is submitted.', icon: Alert, color: '#64748b', bg: '#f1f5f9' },
  { title: 'Under Review', text: 'Authorised personnel assess the report.', icon: Clock, color: '#2563eb', bg: '#eff6ff' },
  { title: 'Verified', text: 'Confirmations raise the report to verified status.', icon: CheckCircle, color: '#0284c7', bg: '#e0f2fe' },
  { title: 'Responding', text: 'Patrols and responders coordinate.', icon: Siren, color: '#d97706', bg: '#fef3c7' },
  { title: 'Resolved', text: 'The incident is documented and resolved.', icon: CheckCircle, color: '#16a34a', bg: '#dcfce7' },
]

export default function Workflow() {
  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Incident Workflow</div>
          <h2 className="section-title">One incident, one clear path.</h2>
          <p className="section-sub">
            Every report carries a documented status from submission to resolution.
          </p>
        </div>

        <div className="workflow">
          {STAGES.map((stage) => (
            <div className="workflow-stage" key={stage.title}>
              <span className="workflow-ic" style={{ background: stage.bg, color: stage.color }}>
                <stage.icon width={20} height={20} />
              </span>
              <div className="workflow-title">{stage.title}</div>
              <p className="workflow-text">{stage.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
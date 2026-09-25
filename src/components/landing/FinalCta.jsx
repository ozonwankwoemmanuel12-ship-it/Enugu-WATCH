import { Link } from 'react-router-dom'

export default function FinalCta() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-section">
          <div className="cta-inner">
            <h2 className="cta-title">Make your community safer.</h2>
            <p className="cta-sub">
              Give residents and community leaders a better way to report, verify and respond.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn--light btn--lg">
                Get Started
              </Link>
              <Link to="/app/incidents" className="btn btn--ghost-dark btn--lg">
                Explore the Platform
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
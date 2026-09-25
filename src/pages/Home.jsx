import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../lib/api.js'
import Hero from '../components/landing/Hero.jsx'
import LiveSafety from '../components/landing/LiveSafety.jsx'
import HowItWorks from '../components/landing/HowItWorks.jsx'
import Features from '../components/landing/Features.jsx'
import Workflow from '../components/landing/Workflow.jsx'
import Trust from '../components/landing/Trust.jsx'
import FinalCta from '../components/landing/FinalCta.jsx'
import Resources from '../components/landing/Resources.jsx'

function scrollToHash(hash) {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const id = hash.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    setTimeout(() => {
      el.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }, 50)
  }
}

export default function Home() {
  const location = useLocation()
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await api.stats()
        if (!cancelled) setStats(data)
      } catch {
        if (!cancelled) setStatsError(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    scrollToHash(location.hash)
  }, [location.hash, location.key])

  return (
    <article>
      <Hero stats={stats} statsError={statsError} />
      <LiveSafety />
      <HowItWorks />
      <Features />
      <Workflow />
      <Trust />
      <Resources />
      <FinalCta />
    </article>
  )
}
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function I(props) {
  return {
    ...base,
    ...props,
  }
}

export function Shield(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M12 3l7 2.5V11c0 4.6-3 8.7-7 10-4-1.3-7-5.4-7-10V5.5L12 3z" />
      <path d="M9 11.5l2.2 2.2L15.5 9.3" />
    </svg>
  )
}

export function Bell(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function MapPin(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

export function Globe(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 4 5.7 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.7-4-9s1.5-6.4 4-9z" />
    </svg>
  )
}

export function Message(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.7A8 8 0 1 1 21 12z" />
    </svg>
  )
}

export function ThumbsUp(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M7 10v11H3V10h4z" />
      <path d="M7 10l4-7a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.4l-1.4 6a2 2 0 0 1-2 1.6H7" />
    </svg>
  )
}

export function Alert(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M12 3L1.8 20h20.4L12 3z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function Clock(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function Check(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

export function CheckCircle(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.2l2.6 2.6L16.5 9" />
    </svg>
  )
}

export function Cross(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function Menu(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

export function Home(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M3 10.5L12 3l9 7.5V21H3V10.5z" />
      <path d="M9 21v-6h6v6" />
    </svg>
  )
}

export function Clipboard(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      <path d="M9 10h6M9 14h4" />
    </svg>
  )
}

export function Plus(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function User(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  )
}

export function Filter(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  )
}

export function Search(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}

export function Activity(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  )
}

export function Users(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-5.5 6.5-5.5s6.5 1.9 6.5 5.5" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <path d="M17.5 14.9c2.3.6 4 2.2 4 5.1" />
    </svg>
  )
}

export function Siren(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M7 18v-6a5 5 0 0 1 10 0v6" />
      <rect x="4" y="18" width="16" height="3" rx="1" />
      <path d="M12 3v2M5.3 4.3l1.4 1.4M18.7 4.3l-1.4 1.4" />
    </svg>
  )
}

export function Checkpoint(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M12 3l8 3v6c0 4.5-3.2 8.6-8 10-4.8-1.4-8-5.5-8-10V6l8-3z" />
      <path d="M12 8v4l2.5 2" />
    </svg>
  )
}

export function ShieldCheck(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M12 3l7 2.5V11c0 4.6-3 8.7-7 10-4-1.3-7-5.4-7-10V5.5L12 3z" />
      <path d="M9 11.5l2.2 2.2L15.5 9.3" />
    </svg>
  )
}

export function Lock(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function Eye(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  )
}

export function Phone(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M5 3l2.5 5L6 10a14 14 0 0 0 8 8l2-1.5L20 19c.6.6.7 1.6.2 2.4C19.6 22 18 23 16 23 8.8 23 1 15.2 1 8c0-2 .9-3.6 1.6-4.2A1.7 1.7 0 0 1 5 3z" />
    </svg>
  )
}

export function List(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M4 6h1M4 12h1M4 18h1" />
      <path d="M9 6h11M9 12h11M9 18h11" />
    </svg>
  )
}

export function LogOut(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M16 7l5 5-5 5" />
      <path d="M21 12H9" />
    </svg>
  )
}

export function Wifi(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5 12a10 10 0 0 1 14 0" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  )
}

export function ClockFast(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
      <path d="M3.5 6a9 9 0 0 1 3-3" />
    </svg>
  )
}

export function MapGrid(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  )
}

export function Handshake(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M11 17l1.7 1.7a2 2 0 0 0 2.8 0L20 14.2" />
      <path d="M4 6l3-3h4l5 5 3-2.5L19 7l-5 5-3-3-2 2H6L4 13 2 11l2-2z" />
      <path d="M4 6v4M20 14v4" />
    </svg>
  )
}

export function Badge(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <rect x="6" y="8" width="12" height="12" rx="2" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}

export function ChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function Inbox(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <path d="M4 5h16v14H4z" />
      <path d="M4 14h5l2 3h2l2-3h5" />
    </svg>
  )
}

export function Info(props) {
  return (
    <svg viewBox="0 0 24 24" {...I(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h0M12 11v5" />
    </svg>
  )
}
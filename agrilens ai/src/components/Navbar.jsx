import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, Menu, X, Microscope, Lightbulb, Clock, Info } from 'lucide-react'
import styles from './Navbar.module.css'

const navLinks = [
  { to: '/diagnose', label: 'Diagnose', icon: Microscope },
  { to: '/tips', label: 'Field Tips', icon: Lightbulb },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/about', label: 'About', icon: Info },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}><Leaf size={18} /></div>
          <span className={styles.logoText}>CropHealth AI</span>
          <span className={styles.logoBadge}>AI</span>
        </Link>

        <ul className={styles.links}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`${styles.link} ${location.pathname === to ? styles.active : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/diagnose" className={`btn btn-primary ${styles.ctaBtn}`}>
          Start Diagnosis
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className={styles.mobileMenu}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`${styles.mobileLink} ${location.pathname === to ? styles.activeMobile : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <Link to="/diagnose" className={`btn btn-primary ${styles.mobileCta}`}>
            Start Diagnosis
          </Link>
        </div>
      )}
    </nav>
  )
}

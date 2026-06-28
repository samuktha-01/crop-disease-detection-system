import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Github, Mail } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}><Leaf size={16} /></div>
            <span className={styles.logoText}>KrishiDoc AI</span>
          </div>
          <p className={styles.tagline}>
            AI-powered crop diagnosis for every Indian farmer.
            Built with ICAR guidelines and local resource awareness.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.linkCol}>
            <h5>Product</h5>
            <Link to="/diagnose">Diagnose Crop</Link>
            <Link to="/tips">Field Tips</Link>
            <Link to="/history">My History</Link>
          </div>
          <div className={styles.linkCol}>
            <h5>Learn</h5>
            <Link to="/about">How it works</Link>
            <a href="https://icar.org.in" target="_blank" rel="noreferrer">ICAR Portal</a>
            <a href="https://kvk.icar.gov.in" target="_blank" rel="noreferrer">Find your KVK</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <p>© {new Date().getFullYear()} KrishiDoc. For advisory use — verify with your local agriculture officer for serious outbreaks.</p>
        </div>
      </div>
    </footer>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import {
  Camera, Leaf, ShieldCheck, IndianRupee,
  MapPin, ChevronRight, Zap, BookOpen, Users
} from 'lucide-react'
import styles from './Home.module.css'

const features = [
  { icon: Camera, title: 'Photo diagnosis', desc: 'Snap a photo of any plant part — leaf, stem, fruit or root — and get an instant AI diagnosis.' },
  { icon: Leaf, title: 'Organic first', desc: 'Recommendations prioritise neem-based and bio-pesticide options before chemical interventions.' },
  { icon: IndianRupee, title: 'Budget-aware advice', desc: 'Solutions ranked from free household remedies to full-cost chemical treatments in ₹ per acre.' },
  { icon: MapPin, title: 'India-specific', desc: 'Advice references your agro-climatic zone, locally stocked products, and ICAR/KVK guidelines.' },
  { icon: ShieldCheck, title: 'Spread risk alerts', desc: 'Know if the disease can spread to neighbouring plants and how many days you have to act.' },
  { icon: BookOpen, title: 'Diagnosis history', desc: 'Every analysis is saved so you can track crop health across seasons.' },
]

const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Tomato', 'Chilli', 'Mango', 'Groundnut', 'Soybean', 'Maize', 'Potato', 'Banana']

const stats = [
  { value: '50+', label: 'diseases detected' },
  { value: '15+', label: 'crops supported' },
  { value: 'ICAR', label: 'guidelines used' },
  { value: '28', label: 'Indian states covered' },
]

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>
            <Zap size={13} />
            Powered by Claude Vision AI
          </div>
          <h1 className={styles.heroTitle}>
            Diagnose crop disease<br />
            <span className={styles.heroAccent}>before it spreads</span>
          </h1>
          <p className={styles.heroSub}>
            Upload a smartphone photo of your affected plant. Get instant diagnosis of diseases,
            pests, and nutritional deficiencies — with locally-available, budget-aware treatment
            recommendations built for Indian farmers.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/diagnose" className="btn btn-primary btn-lg">
              <Camera size={18} />
              Diagnose your crop
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              See how it works
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.heroStats}>
            {stats.map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statVal}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported crops ticker */}
      <div className={styles.cropTicker}>
        <div className={styles.tickerInner}>
          {[...crops, ...crops].map((c, i) => (
            <span key={i} className={styles.tickerItem}>
              <Leaf size={12} /> {c}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="section container">
        <div className={styles.sectionHead}>
          <h4>What KrishiDoc does</h4>
          <h2>Everything a farmer needs to protect yield</h2>
        </div>
        <div className="grid-3" style={{ marginTop: '2.5rem' }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIcon}><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={`section ${styles.howSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h4>How it works</h4>
            <h2>Diagnosis in under 30 seconds</h2>
          </div>
          <div className={styles.steps}>
            {[
              { n: '01', title: 'Take a photo', desc: 'Photograph the affected leaf, stem, fruit, or root clearly in natural light.' },
              { n: '02', title: 'Add context', desc: 'Select your crop type, growth stage, region, and treatment budget.' },
              { n: '03', title: 'Get diagnosis', desc: 'AI analyses symptoms and identifies the disease, pest, or deficiency.' },
              { n: '04', title: 'Follow treatment', desc: 'Apply the recommended treatment using locally available products.' },
            ].map(s => (
              <div key={s.n} className={styles.step}>
                <div className={styles.stepNum}>{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section container">
        <div className={styles.ctaBanner}>
          <h2>Start protecting your crop today</h2>
          <p>Free to use. No registration required. Works on any smartphone.</p>
          <Link to="/diagnose" className="btn btn-primary btn-lg">
            <Camera size={18} />
            Diagnose now — it's free
          </Link>
        </div>
      </section>
    </div>
  )
}

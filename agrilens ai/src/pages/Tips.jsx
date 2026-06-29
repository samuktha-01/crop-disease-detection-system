import React, { useState } from 'react'
import { Droplets, Bug, Leaf, Sun, Shield, Calendar, Zap, MapPin } from 'lucide-react'
import { getSeasonalTips } from '../services/gemini.js'
import styles from './Tips.module.css'

const REGIONS = ['Punjab / Haryana','Uttar Pradesh','Maharashtra','Karnataka','Tamil Nadu','Andhra Pradesh / Telangana','Gujarat','Madhya Pradesh','Rajasthan','West Bengal','Bihar','Odisha','Other']
const CROPS   = ['General','Rice / Paddy','Wheat','Cotton','Sugarcane','Tomato','Chilli','Mango','Groundnut','Soybean','Maize / Corn','Potato','Banana']

const iconMap = { water: Droplets, bug: Bug, leaf: Leaf, sun: Sun, shield: Shield, calendar: Calendar }

const staticTips = [
  { icon: 'calendar', title: 'Scout early, scout often', detail: 'Walk your field at 6–9 AM when dew and pest activity are most visible. Check at least 10 random plants per acre and record what you see.' },
  { icon: 'leaf', title: 'Use neem as your first line of defence', detail: 'Apply neem oil (5 ml/L + 2 ml soap) or Neemazal 0.15 EC as a preventive spray every 15 days. Widely available, affordable, and effective against a broad spectrum of pests.' },
  { icon: 'water', title: 'Avoid waterlogging', detail: 'Most fungal diseases — blast, blight, downy mildew — thrive when water sits for 24+ hours. Maintain proper bund drainage especially in monsoon.' },
  { icon: 'bug', title: 'Use sticky yellow traps', detail: 'Hang yellow sticky traps (1 per 25 sq m) from transplanting onwards to monitor and catch whiteflies, thrips, and leafminers before populations explode.' },
  { icon: 'shield', title: 'Rotate crops every season', detail: 'A rice–wheat–legume rotation breaks pest and disease cycles naturally. Legumes also fix atmospheric nitrogen, reducing your fertiliser cost next season.' },
  { icon: 'sun', title: 'Follow a spray calendar', detail: 'Preventive fungicide 15–20 days after transplant cuts blast and blight incidence significantly. Contact your local agriculture officer for a state-specific spray schedule card (usually free).' },
]

export default function Tips() {
  const [region, setRegion] = useState('')
  const [crop, setCrop] = useState('')
  const [aiTips, setAiTips] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAiTips = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getSeasonalTips({ region, crop })
      setAiTips(data)
    } catch (e) {
      setError(e.message || 'Could not load tips. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className={styles.header}>
        <h1>Field Tips</h1>
        <p>Practical, India-tested advice for protecting your crops across the season.</p>
      </div>

      {/* Static tips */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Universal best practices</h2>
        <div className={styles.tipsGrid}>
          {staticTips.map(({ icon, title, detail }) => {
            const Icon = iconMap[icon] || Leaf
            return (
              <div key={title} className={`card ${styles.tipCard}`}>
                <div className={styles.tipIcon}><Icon size={18} /></div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* AI seasonal tips */}
      <section className={styles.section}>
        <div className={styles.aiSection}>
          <div className={styles.aiHeader}>
            <div>
              <h2>Seasonal AI tips for your crop</h2>
              <p>Get personalised, current-season advice for your specific crop and region.</p>
            </div>
          </div>
          <div className={styles.aiControls}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label"><MapPin size={13} /> Your region</label>
              <select className="form-select" value={region} onChange={e => setRegion(e.target.value)}>
                <option value="">Any region</option>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label"><Leaf size={13} /> Your crop</label>
              <select className="form-select" value={crop} onChange={e => setCrop(e.target.value)}>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={fetchAiTips} disabled={loading} style={{ alignSelf: 'flex-end', height: 42 }}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Loading…</> : <><Zap size={15} /> Get tips</>}
            </button>
          </div>

          {error && <p style={{ color: 'var(--red-600)', fontSize: 14, marginTop: 10 }}>{error}</p>}

          {aiTips && (
            <div className={styles.aiResults}>
              {aiTips.alert && (
                <div className={styles.alertBox}>
                  ⚠️ <strong>Advisory:</strong> {aiTips.alert}
                </div>
              )}
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: '1rem' }}>Season: {aiTips.season}</p>
              <div className={styles.tipsGrid}>
                {(aiTips.tips || []).map((tip, i) => {
                  const Icon = iconMap[tip.icon] || Leaf
                  return (
                    <div key={i} className={`card ${styles.tipCard}`}>
                      <div className={styles.tipIcon}><Icon size={18} /></div>
                      <h3>{tip.title}</h3>
                      <p>{tip.detail}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ICAR callout */}
      <div className={`card ${styles.kvkCard}`}>
        <div className={styles.kvkIcon}><MapPin size={20} /></div>
        <div>
          <h3>ICAR — Indian Council of Agricultural Research</h3>
          <p>Access official crop disease guidelines, pest management bulletins, and research publications from India's top agricultural body.</p>
          <a href="https://icar.org.in" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ marginTop: '0.75rem', display: 'inline-flex' }}>
            Visit ICAR Portal →
          </a>
        </div>
      </div>

    </div>
  )
}
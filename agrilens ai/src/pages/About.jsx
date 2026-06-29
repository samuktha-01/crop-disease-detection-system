import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Leaf, MapPin, IndianRupee, ShieldCheck, Database } from 'lucide-react'
import styles from './About.module.css'

const tech = [
  { icon: Brain, title: 'Claude Vision AI', desc: 'gemini\'s Claude claude-sonnet-4-6 model with multimodal vision analyses visible symptoms with plant-pathology-expert-level accuracy.' },
  { icon: Database, title: 'ICAR knowledge base', desc: 'Recommendations reference Indian Council of Agricultural Research bulletins and state agriculture department guidelines.' },
  { icon: MapPin, title: 'Agro-climatic awareness', desc: 'The AI understands India\'s 15 agro-climatic zones — advice accounts for your monsoon pattern, soil type, and available local inputs.' },
  { icon: Leaf, title: 'Bio-pesticide first', desc: 'The system always suggests organic and bio-pesticide options before recommending chemical interventions.' },
  { icon: IndianRupee, title: 'Budget-tiered advice', desc: 'Treatments are ranked from free household remedies up to commercial interventions, in ₹ per acre estimates.' },
  { icon: ShieldCheck, title: 'Privacy by design', desc: 'Photos are sent directly to gemini\'s API for analysis. We store nothing on a server — history stays on your device.' },
]

export default function About() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className={styles.header}>
        <h1>How CropHealth AI works</h1>
        <p>CropHealth AI combines smartphone photography with frontier AI to give every Indian farmer access to expert crop disease diagnosis — instantly and affordably.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        {tech.map(({ icon: Icon, title, desc }) => (
          <div key={title} className={`card ${styles.techCard}`}>
            <div className={styles.techIcon}><Icon size={20} /></div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>

      <div className={styles.disclaimer}>
        <h3>Important note</h3>
        <p>CropHealth AI is a first-response diagnostic assistant. For severe outbreaks, unusual symptoms, or before applying any chemical treatment for the first time, please verify advice with your local agricultural officer or Krishi Vigyan Kendra (KVK). The AI can make mistakes, especially with poor-quality photos or ambiguous symptoms.</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="https://icar.org.in" target="_blank" rel="noreferrer" className="btn btn-secondary">ICAR portal</a>
          <a href="https://kvk.icar.gov.in" target="_blank" rel="noreferrer" className="btn btn-secondary">Find your KVK</a>
        </div>
      </div>

      <div className={styles.cta}>
        <h2>Ready to try it?</h2>
        <Link to="/diagnose" className="btn btn-primary btn-lg">Start your first diagnosis</Link>
      </div>
    </div>
  )
}

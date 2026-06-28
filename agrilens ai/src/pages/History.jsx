import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Clock, Leaf, Camera } from 'lucide-react'
import { getHistory, deleteEntry, clearHistory } from '../services/history.js'
import styles from './History.module.css'

const severityColor = { high: '#dc2626', medium: '#d97706', low: '#16a34a' }

export default function History() {
  const [entries, setEntries] = useState([])

  useEffect(() => { setEntries(getHistory()) }, [])

  const remove = (id) => {
    deleteEntry(id)
    setEntries(e => e.filter(x => x.id !== id))
  }

  const clear = () => {
    if (!confirm('Clear all diagnosis history?')) return
    clearHistory()
    setEntries([])
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className={styles.header}>
        <div>
          <h1>Diagnosis history</h1>
          <p>Your last {entries.length} crop analyses, saved on this device.</p>
        </div>
        {entries.length > 0 && (
          <button className="btn btn-ghost" onClick={clear}>
            <Trash2 size={15} /> Clear all
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><Clock size={32} /></div>
          <h3>No history yet</h3>
          <p>Run your first diagnosis and it will appear here.</p>
          <Link to="/diagnose" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <Camera size={16} /> Start a diagnosis
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {entries.map(entry => {
            const d = entry.result?.diagnosis || {}
            const date = new Date(entry.timestamp)
            return (
              <div key={entry.id} className={`card ${styles.entryCard}`}>
                {entry.imageDataUrl && (
                  <img src={entry.imageDataUrl} alt="Crop" className={styles.thumb} />
                )}
                <div className={styles.entryBody}>
                  <div className={styles.entryTop}>
                    <div>
                      <h3 className={styles.condition}>{d.condition || 'Unknown'}</h3>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                        {entry.meta?.crop && <span className="badge badge-green"><Leaf size={11} /> {entry.meta.crop}</span>}
                        {entry.meta?.region && <span className="badge badge-gray">{entry.meta.region}</span>}
                        <span className="badge" style={{ background: severityColor[d.severity] + '18', color: severityColor[d.severity] }}>
                          {d.severity} severity
                        </span>
                      </div>
                    </div>
                    <div className={styles.entryMeta}>
                      <span>{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>{date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  {d.description && <p className={styles.desc}>{d.description}</p>}
                </div>
                <button className={styles.deleteBtn} onClick={() => remove(entry.id)} aria-label="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

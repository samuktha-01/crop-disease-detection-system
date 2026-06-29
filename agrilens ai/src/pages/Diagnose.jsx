import React, { useState, useRef, useCallback } from 'react'
import {
  Upload, Camera, X, Leaf, Bug, AlertTriangle,
  CheckCircle2, ChevronDown, ChevronUp, Send, RotateCcw,
  AlertCircle, IndianRupee, ShieldAlert, Clock
} from 'lucide-react'
import { diagnoseCrop, askFollowUp } from '../services/gemini.js'
import { saveToHistory } from '../services/history.js'
import styles from './Diagnose.module.css'

const CROPS = ['Rice / Paddy','Wheat','Cotton','Sugarcane','Tomato','Chilli','Mango','Groundnut','Soybean','Maize / Corn','Potato','Banana','Onion','Turmeric','Ginger','Other']
const STAGES = ['Seedling','Vegetative','Flowering','Fruiting / Pod fill','Maturity / Harvest']
const REGIONS = ['Punjab / Haryana','Uttar Pradesh','Maharashtra','Karnataka','Tamil Nadu','Andhra Pradesh / Telangana','Gujarat','Madhya Pradesh','Rajasthan','West Bengal','Bihar','Odisha','Himachal Pradesh','Uttarakhand','Kerala','Jharkhand','Other']
const BUDGETS = ['Very low — free / household items only','Low — under ₹500/acre','Medium — ₹500–2000/acre','High — any effective solution']

const typeIcon = { disease: Bug, pest: AlertTriangle, deficiency: Leaf, healthy: CheckCircle2 }
const typeColor = { disease: '#dc2626', pest: '#d97706', deficiency: '#2563eb', healthy: '#16a34a' }
const severityBadge = {
  high: { class: styles.badgeRed, label: 'High severity' },
  medium: { class: styles.badgeAmber, label: 'Medium severity' },
  low: { class: styles.badgeGreen, label: 'Low severity' },
}
const spreadBadge = {
  high: { class: styles.badgeRed, label: '⚡ Spreads fast — act immediately' },
  medium: { class: styles.badgeAmber, label: 'Moderate spread risk' },
  low: { class: styles.badgeGreen, label: 'Low spread risk' },
}

export default function Diagnose() {
  const [image, setImage] = useState(null) // { file, dataUrl, base64, mimeType }
  const [dragging, setDragging] = useState(false)
  const [meta, setMeta] = useState({ crop: '', stage: '', region: '', budget: '' })
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [expandedTx, setExpandedTx] = useState(null)
  const [followUp, setFollowUp] = useState('')
  const [qaList, setQaList] = useState([])
  const [qaLoading, setQaLoading] = useState(false)
  const fileRef = useRef()

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      const base64 = dataUrl.split(',')[1]
      setImage({ file, dataUrl, base64, mimeType: file.type })
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  const handleMeta = (k, v) => setMeta(m => ({ ...m, [k]: v }))

  const canAnalyse = image || meta.crop

  const runAnalysis = async () => {
    setStatus('loading')
    setResult(null)
    setQaList([])
    try {
      const data = await diagnoseCrop({
        base64Image: image?.base64 || null,
        mimeType: image?.mimeType || 'image/jpeg',
        ...meta,
      })
      setResult(data)
      setStatus('done')
      saveToHistory({ imageDataUrl: image?.dataUrl || null, result: data, meta })
    } catch (e) {
      setErrorMsg(e.message || 'Analysis failed. Check your API key in .env')
      setStatus('error')
    }
  }

  const reset = () => {
    setImage(null)
    setStatus('idle')
    setResult(null)
    setQaList([])
    setMeta({ crop: '', stage: '', region: '', budget: '' })
  }

  const sendQuestion = async () => {
    if (!followUp.trim()) return
    const q = followUp.trim()
    setFollowUp('')
    setQaLoading(true)
    setQaList(l => [...l, { q, a: null }])
    try {
      const a = await askFollowUp({ question: q, diagnosisContext: result })
      setQaList(l => l.map((item, i) => i === l.length - 1 ? { ...item, a } : item))
    } catch {
      setQaList(l => l.map((item, i) => i === l.length - 1 ? { ...item, a: 'Sorry, could not get a response. Try again.' } : item))
    } finally {
      setQaLoading(false)
    }
  }

  const D = result?.diagnosis || {}
  const DIcon = typeIcon[D.type] || Leaf

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className={styles.header}>
        <h1>Crop Diagnosis</h1>
        <p>Upload a photo of your affected plant for an AI-powered analysis with India-specific treatment recommendations.</p>
      </div>

      <div className={styles.layout}>
        {/* Left — Input panel */}
        <div className={styles.inputPanel}>
          {/* Upload zone */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className={styles.panelHead}>
              <Camera size={16} />
              Photo
            </div>
            {image ? (
              <div className={styles.previewWrap}>
                <img src={image.dataUrl} alt="Crop" className={styles.preview} />
                <button className={styles.removeImg} onClick={() => setImage(null)} aria-label="Remove image">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                className={`${styles.dropzone} ${dragging ? styles.dropping : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
              >
                <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />
                <Upload size={28} className={styles.uploadIcon} />
                <p className={styles.dropMain}>Drag photo here or tap to browse</p>
                <p className={styles.dropSub}>JPG, PNG, WEBP — any smartphone photo works</p>
              </div>
            )}
          </div>

          {/* Context */}
          <div className="card" style={{ marginTop: '1rem', padding: '0', overflow: 'hidden' }}>
            <div className={styles.panelHead}><Leaf size={16} /> Crop details</div>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Crop type</label>
                <select className="form-select" value={meta.crop} onChange={e => handleMeta('crop', e.target.value)}>
                  <option value="">Select crop…</option>
                  {CROPS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Growth stage</label>
                <select className="form-select" value={meta.stage} onChange={e => handleMeta('stage', e.target.value)}>
                  <option value="">Select stage…</option>
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">State / Region</label>
                <select className="form-select" value={meta.region} onChange={e => handleMeta('region', e.target.value)}>
                  <option value="">Select state…</option>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Treatment budget</label>
                <select className="form-select" value={meta.budget} onChange={e => handleMeta('budget', e.target.value)}>
                  <option value="">Select budget…</option>
                  {BUDGETS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>

          {status === 'idle' || status === 'error' ? (
            <button className={`btn btn-primary ${styles.analyseBtn}`} onClick={runAnalysis} disabled={!canAnalyse}>
              <Camera size={18} />
              {status === 'error' ? 'Retry analysis' : 'Analyse crop'}
            </button>
          ) : status === 'loading' ? (
            <button className={`btn btn-primary ${styles.analyseBtn}`} disabled>
              <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Analysing…
            </button>
          ) : (
            <button className={`btn btn-ghost ${styles.analyseBtn}`} onClick={reset}>
              <RotateCcw size={16} />
              New diagnosis
            </button>
          )}

          {status === 'error' && (
            <div className={styles.errorBox}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right — Results panel */}
        <div className={styles.resultPanel}>
          {status === 'idle' && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><Leaf size={32} /></div>
              <h3>Awaiting diagnosis</h3>
              <p>Upload a photo and fill in crop details, then click "Analyse crop" to get started.</p>
            </div>
          )}

          {status === 'loading' && (
            <div className={styles.loadingState}>
              <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
              <h3>Analysing your crop…</h3>
              <p>Examining symptoms and matching against disease database</p>
            </div>
          )}

          {status === 'done' && result && (
            <>
              {/* Diagnosis card */}
              <div className="card">
                <div className={styles.diagHeader}>
                  <div className={styles.diagIconWrap} style={{ background: typeColor[D.type] + '18', color: typeColor[D.type] }}>
                    <DIcon size={22} />
                  </div>
                  <div className={styles.diagMeta}>
                    <h2 className={styles.conditionName}>{D.condition}</h2>
                    <div className={styles.badgeRow}>
                      <span className={`badge ${severityBadge[D.severity]?.class}`}>{severityBadge[D.severity]?.label}</span>
                      <span className={`badge ${styles.badgeGray}`}>{D.confidence}% confidence</span>
                      <span className={`badge ${spreadBadge[result.spread_risk]?.class}`}>{spreadBadge[result.spread_risk]?.label}</span>
                    </div>
                  </div>
                </div>

                {result.urgency_days && (
                  <div className={styles.urgencyBar}>
                    <Clock size={14} />
                    Act within <strong>{result.urgency_days} days</strong> to prevent yield loss
                  </div>
                )}

                <hr className="divider" />
                <div className={styles.infoGrid}>
                  <div>
                    <h4>Diagnosis</h4>
                    <p style={{ fontSize: 14, marginTop: 6 }}>{D.description}</p>
                  </div>
                  <div>
                    <h4>What you're seeing</h4>
                    <p style={{ fontSize: 14, marginTop: 6 }}>{result.symptoms_visible}</p>
                  </div>
                  <div>
                    <h4>Cause</h4>
                    <p style={{ fontSize: 14, marginTop: 6 }}>{result.cause}</p>
                  </div>
                  {result.affected_crops_nearby?.length > 0 && (
                    <div>
                      <h4>Watch nearby crops</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                        {result.affected_crops_nearby.map(c => (
                          <span key={c} className="badge badge-gray" style={{ fontSize: 12 }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Treatments */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <IndianRupee size={16} />
                  Treatment options
                </h3>
                <div className={styles.txList}>
                  {(result.treatments || []).map((tx, i) => (
                    <div key={i} className={`card ${styles.txCard}`}>
                      <button
                        className={styles.txHeader}
                        onClick={() => setExpandedTx(expandedTx === i ? null : i)}
                      >
                        <span className={`badge ${tx.type === 'organic' ? 'badge-green' : tx.type === 'chemical' ? 'badge-amber' : 'badge-blue'}`}>
                          {tx.type}
                        </span>
                        <span className={styles.txName}>{tx.name}</span>
                        <span className={styles.txCost}>{tx.cost_estimate}</span>
                        {expandedTx === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {expandedTx === i && (
                        <div className={styles.txBody}>
                          <p className={styles.txDetail}>{tx.detail}</p>
                          <p className={styles.txAvail}>📍 {tx.availability}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention */}
              {result.prevention && (
                <div className="card" style={{ background: 'var(--green-50)', borderColor: 'var(--green-200)' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <ShieldAlert size={18} style={{ color: 'var(--green-700)', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <h4 style={{ color: 'var(--green-800)', marginBottom: 6 }}>Prevention</h4>
                      <p style={{ fontSize: 14, color: 'var(--green-900)' }}>{result.prevention}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ICAR reference */}
              {result.icar_reference && (
                <div className="card" style={{ background: 'var(--blue-50)', borderColor: 'var(--blue-100)' }}>
                  <p style={{ fontSize: 13, color: 'var(--blue-700)' }}>
                    📋 <strong>ICAR / KVK guidance:</strong> {result.icar_reference}
                  </p>
                </div>
              )}

              {/* Follow-up Q&A */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}><Send size={16} /> Ask a follow-up question</h3>
                <div className={styles.qaInput}>
                  <input
                    className="form-input"
                    placeholder="e.g. When is the best time to spray? Can I mix treatments?"
                    value={followUp}
                    onChange={e => setFollowUp(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendQuestion()}
                  />
                  <button className="btn btn-primary" onClick={sendQuestion} disabled={qaLoading || !followUp.trim()}>
                    {qaLoading ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Send size={15} />}
                  </button>
                </div>
                {qaList.map((item, i) => (
                  <div key={i} className={styles.qaItem}>
                    <div className={styles.qaQ}>You: {item.q}</div>
                    <div className={styles.qaA}>{item.a || <span style={{ color: 'var(--text-muted)' }}>…</span>}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

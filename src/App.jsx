import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const PLATFORM_CONFIG = {
  li:   { label: 'LinkedIn',    tag: 'in', color: '#70C4FF', bg: '#0A1A2A', emoji: '💼' },
  meta: { label: 'Meta',        tag: 'fb', color: '#a78bfa', bg: '#0D0D24', emoji: '📘' },
  x:    { label: 'X / Twitter', tag: '𝕏',  color: '#ccc',    bg: '#111',    emoji: '𝕏'  },
  yt:   { label: 'YouTube',     tag: '▶',  color: '#FF8080', bg: '#1A0505', emoji: '▶️' },
}

const TYPE_CONFIG = {
  carrousel: { label: 'Carrousel PDF',  icon: '▤', bg: '#1A3C6B', color: '#93C4F5' },
  video:     { label: 'Vidéo native',   icon: '▶', bg: '#6B2200', color: '#FFAA70' },
  texte:     { label: 'Post texte',     icon: '✎', bg: '#0A3150', color: '#70C4FF' },
  live:      { label: 'LinkedIn Live',  icon: '●', bg: '#4A0808', color: '#FF8080' },
  article:   { label: 'Article natif',  icon: '≡', bg: '#0A3520', color: '#5DE8B4' },
  recap:     { label: 'Post récap',     icon: '★', bg: '#28185A', color: '#C4A8FF' },
}

const PHASE_CONFIG = {
  pre:  { label: 'Pré-événement',  color: '#0A7BC4' },
  site: { label: 'Sur site GITEX', color: '#fbc600' },
  post: { label: 'Post-événement', color: '#1A9E6E' },
}

const BLOCKS = [
  {
    key: 'mars', phase: 'pre', label: 'Pré-événement — Mars 2026', dates: '9 – 31 Mars',
    cells: [
      { day: '9 Mars',  label: 'Lun 9'  }, { day: '10 Mars', label: 'Mar 10' }, { day: '11 Mars', label: 'Mer 11' }, { day: '12 Mars', label: 'Jeu 12' }, { day: '13 Mars', label: 'Ven 13' }, { day: '14 Mars', label: 'Sam 14' }, { day: '15 Mars', label: 'Dim 15' },
      { day: '16 Mars', label: 'Lun 16' }, { day: '17 Mars', label: 'Mar 17' }, { day: '18 Mars', label: 'Mer 18' }, { day: '19 Mars', label: 'Jeu 19' }, { day: '20 Mars', label: 'Ven 20' }, { day: '21 Mars', label: 'Sam 21' }, { day: '22 Mars', label: 'Dim 22' },
      { day: '23 Mars', label: 'Lun 23' }, { day: '24 Mars', label: 'Mar 24' }, { day: '25 Mars', label: 'Mer 25' }, { day: '26 Mars', label: 'Jeu 26' }, { day: '27 Mars', label: 'Ven 27' }, { day: '28 Mars', label: 'Sam 28' }, { day: '29 Mars', label: 'Dim 29' },
      { day: '30 Mars', label: 'Lun 30' }, { day: '31 Mars', label: 'Mar 31' }, { day: '1 Avr',  label: 'Mer 1'  }, { day: '2 Avr',  label: 'Jeu 2'  }, { day: '3 Avr',  label: 'Ven 3'  }, { day: '4 Avr',  label: 'Sam 4'  }, { day: '5 Avr',  label: 'Dim 5'  },
    ],
  },
  {
    key: 'avr-pre', phase: 'pre', label: 'Pré-événement — Avril 2026', dates: '6 Avril',
    cells: [
      { day: '6 Avr', label: 'Lun 6' }, { day: null, label: '' }, { day: null, label: '' }, { day: null, label: '' }, { day: null, label: '' }, { day: null, label: '' }, { day: null, label: '' },
    ],
  },
  {
    key: 'site', phase: 'site', label: 'Sur site — GITEX Africa 2026 · Marrakech', dates: '7 – 9 Avril',
    cells: [
      { day: '7 Avr', label: 'Mar 7', gitex: 'J1' }, { day: '8 Avr', label: 'Mer 8', gitex: 'J2' }, { day: '9 Avr', label: 'Jeu 9', gitex: 'J3' },
      { day: null, label: '' }, { day: null, label: '' }, { day: null, label: '' }, { day: null, label: '' },
    ],
  },
  {
    key: 'post', phase: 'post', label: 'Post-événement — Avril 2026', dates: '10 – 30 Avril',
    cells: [
      { day: '10 Avr', label: 'Ven 10' }, { day: '11 Avr', label: 'Sam 11' }, { day: '12 Avr', label: 'Dim 12' }, { day: '13 Avr', label: 'Lun 13' }, { day: '14 Avr', label: 'Mar 14' }, { day: '15 Avr', label: 'Mer 15' }, { day: '16 Avr', label: 'Jeu 16' },
      { day: '17 Avr', label: 'Ven 17' }, { day: '18 Avr', label: 'Sam 18' }, { day: '19 Avr', label: 'Dim 19' }, { day: '20 Avr', label: 'Lun 20' }, { day: '21 Avr', label: 'Mar 21' }, { day: '22 Avr', label: 'Mer 22' }, { day: '23 Avr', label: 'Jeu 23' },
      { day: '24 Avr', label: 'Ven 24' }, { day: '25 Avr', label: 'Sam 25' }, { day: '26 Avr', label: 'Dim 26' }, { day: '27 Avr', label: 'Lun 27' }, { day: '28 Avr', label: 'Mar 28' }, { day: '29 Avr', label: 'Mer 29' }, { day: '30 Avr', label: 'Jeu 30' },
    ],
  },
]

const INITIAL_PILLS = [
  { id: 'p1',  block_key: 'mars', cell_day: '11 Mars', type: 'texte',     platform: 'li',   time: '8h30',   title: 'Annonce officielle GITEX',    description: 'Annonce officielle participation GITEX Africa 2026 — stand [N°], Marrakech' },
  { id: 'p2',  block_key: 'mars', cell_day: '13 Mars', type: 'texte',     platform: 'li',   time: '12h00',  title: '3 questions transfo digitale', description: '3 questions qu\'on nous pose tout le temps sur la transformation digitale au Maroc' },
  { id: 'p3',  block_key: 'mars', cell_day: '15 Mars', type: 'carrousel', platform: 'li',   time: '8h30',   title: '5 signes SI freine croissance', description: '5 signes que votre SI freine votre croissance' },
  { id: 'p4',  block_key: 'mars', cell_day: '18 Mars', type: 'video',     platform: 'li',   time: '8h30',   title: 'Teaser GITEX',                 description: 'Teaser GITEX filmé au bureau Karizma — équipe, ambiance, annonce' },
  { id: 'p5',  block_key: 'mars', cell_day: '19 Mars', type: 'texte',     platform: 'li',   time: '12h00',  title: 'Transfo digitale Afrique 2026', description: 'Pourquoi la transformation digitale africaine ne peut plus attendre en 2026' },
  { id: 'p6',  block_key: 'mars', cell_day: '21 Mars', type: 'carrousel', platform: 'li',   time: '8h30',   title: 'ERP vs dev sur mesure',        description: 'ERP vs développement sur mesure : comment choisir pour votre PME ?' },
  { id: 'p7',  block_key: 'mars', cell_day: '25 Mars', type: 'video',     platform: 'yt',   time: '8h30',   title: 'Interview CEO Vision IT',      description: 'Vision IT Afrique 2026 — ce qui change pour les entreprises' },
  { id: 'p8',  block_key: 'mars', cell_day: '26 Mars', type: 'texte',     platform: 'meta', time: '12h00',  title: 'Retour client ERP ↑60%',       description: 'Retour client chiffré : délais de reporting réduits de 60% après intégration ERP' },
  { id: 'p9',  block_key: 'mars', cell_day: '28 Mars', type: 'carrousel', platform: 'li',   time: '8h30',   title: 'Cloud en Afrique 2026',        description: 'Pourquoi les entreprises africaines basculent vers le cloud en 2026' },
  { id: 'p10', block_key: 'mars', cell_day: '30 Mars', type: 'texte',     platform: 'x',    time: '8h30',   title: 'J-7 : Réserver un RDV',        description: 'J-7 : réservez votre créneau avec l\'équipe Karizma à Marrakech + QR code' },
  { id: 'p11', block_key: 'mars', cell_day: '31 Mars', type: 'texte',     platform: 'li',   time: '12h00',  title: 'Agenda stand GITEX',           description: 'Agenda stand : démos disponibles, horaires, numéro stand GITEX Africa' },
  { id: 'p12', block_key: 'avr-pre',  cell_day: '1 Avr',   type: 'texte',     platform: 'li',   time: '12h00',  title: 'Agenda stand Karizma',         description: 'Agenda stand détaillé : démos disponibles, horaires, numéro stand' },
  { id: 'p13', block_key: 'avr-pre',  cell_day: '3 Avr',   type: 'texte',     platform: 'meta', time: '8h30',   title: 'J-3 : 3 défis IT à GITEX',    description: 'J-3 : les 3 défis IT dont on veut parler à GITEX Africa 2026' },
  { id: 'p14', block_key: 'avr-pre',  cell_day: '6 Avr',   type: 'texte',     platform: 'li',   time: '20h00',  title: 'J-1 : On arrive à Marrakech',  description: 'J-1 : Demain on est à Marrakech — retrouvez-nous stand [N°]' },
  { id: 'p15', block_key: 'site',     cell_day: '7 Avr',   type: 'texte',     platform: 'li',   time: '8h30',   title: 'Ouverture stand',              description: 'Stand installé, équipe prête — C\'est parti !' },
  { id: 'p16', block_key: 'site',     cell_day: '7 Avr',   type: 'live',      platform: 'li',   time: '9h30',   title: 'Live ouverture',               description: 'Ouverture officielle — CEO présente le stand, l\'équipe et le programme GITEX' },
  { id: 'p17', block_key: 'site',     cell_day: '7 Avr',   type: 'video',     platform: 'yt',   time: '10h-17h',title: 'Stories ambiance stand',       description: 'Ambiance stand — 3 stories rapides entre 10h et 17h' },
  { id: 'p18', block_key: 'site',     cell_day: '8 Avr',   type: 'video',     platform: 'li',   time: '11h00',  title: 'Interview visiteur J2',        description: 'Interview d\'un visiteur / partenaire stratégique rencontré sur stand' },
  { id: 'p19', block_key: 'site',     cell_day: '8 Avr',   type: 'texte',     platform: 'x',    time: '18h00',  title: 'Moment fort J2',               description: 'Moment fort J2 : démo produit + réaction visiteur surprise' },
  { id: 'p20', block_key: 'site',     cell_day: '9 Avr',   type: 'texte',     platform: 'li',   time: '17h00',  title: 'Clôture stand — Merci !',      description: 'Dernier jour — merci à tous ceux qui sont passés nous voir' },
  { id: 'p21', block_key: 'site',     cell_day: '9 Avr',   type: 'video',     platform: 'meta', time: '20h00',  title: 'Vidéo fin d\'événement',       description: 'Montage du dernier jour en 30s — ambiance finale, équipe, contacts' },
  { id: 'p22', block_key: 'post',     cell_day: '10 Avr',  type: 'recap',     platform: 'li',   time: '8h00',   title: 'Bilan chiffré GITEX',          description: 'Chiffres clés GITEX : visiteurs, rencontres, moments forts + photos' },
  { id: 'p23', block_key: 'post',     cell_day: '12 Avr',  type: 'video',     platform: 'yt',   time: '10h00',  title: 'Vidéo récap GITEX',            description: 'Montage post-event : meilleurs moments des 3 jours à Marrakech' },
  { id: 'p24', block_key: 'post',     cell_day: '14 Avr',  type: 'texte',     platform: 'meta', time: '12h00',  title: '5 surprises de GITEX',         description: '5 choses qu\'on n\'attendait pas de GITEX Africa 2026' },
  { id: 'p25', block_key: 'post',     cell_day: '17 Avr',  type: 'article',   platform: 'li',   time: '8h30',   title: 'Article : lessons GITEX',      description: 'Ce que GITEX Africa 2026 nous a appris sur la transformation digitale africaine' },
  { id: 'p26', block_key: 'post',     cell_day: '21 Avr',  type: 'carrousel', platform: 'li',   time: '8h30',   title: 'Top 5 insights Marrakech',     description: 'Top 5 insights business ramenés de Marrakech' },
  { id: 'p27', block_key: 'post',     cell_day: '23 Avr',  type: 'video',     platform: 'yt',   time: '12h00',  title: 'Témoignage client',            description: 'Témoignage client ou partenaire rencontré sur stand — version montée' },
  { id: 'p28', block_key: 'post',     cell_day: '25 Avr',  type: 'texte',     platform: 'x',    time: '8h30',   title: 'Annonce suite GITEX',          description: 'Suite à nos échanges à Marrakech — voici ce qu\'on lance' },
  { id: 'p29', block_key: 'post',     cell_day: '28 Avr',  type: 'texte',     platform: 'li',   time: '8h30',   title: 'Projet né de GITEX',           description: 'Annonce concrète née de GITEX : projet, partenariat ou offre lancée' },
]

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function genId() {
  return 'p' + Date.now() + Math.random().toString(36).slice(2, 6)
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function App() {
  const [pills, setPills] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePhase, setActivePhase] = useState('all')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ title: '', time: '', description: '', type: 'texte', platform: 'li' })
  const [tooltip, setTooltip] = useState(null)
  const [syncStatus, setSyncStatus] = useState('connected') // connected | syncing | error
  const [dragPill, setDragPill] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [toast, setToast] = useState(null)
  const [hiddenTypes, setHiddenTypes] = useState(new Set())
  const [hoveredCell, setHoveredCell] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState(1)
  const toastTimer = useRef(null)
  const skipNextRef = useRef(new Set()) // track ids we just mutated so we don't double-apply realtime

  // ── Load initial data from Supabase ──
  useEffect(() => {
    async function loadPills() {
      setLoading(true)
      const { data, error } = await supabase
        .from('pills')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Load error:', error)
        // Fallback to initial data if table empty or error
        setPills(INITIAL_PILLS)
      } else if (data && data.length > 0) {
        setPills(data)
      } else {
        // First run — seed with initial data
        const { error: insertError } = await supabase.from('pills').insert(INITIAL_PILLS)
        if (insertError) console.error('Seed error:', insertError)
        setPills(INITIAL_PILLS)
      }
      setLoading(false)
    }
    loadPills()
  }, [])

  // ── Auto-refresh every 5 seconds (polling) ──
  useEffect(() => {
    setSyncStatus('connected')
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('pills')
        .select('*')
        .order('created_at', { ascending: true })
      if (!error && data) {
        setPills(prev => {
          const prevIds = prev.map(p => p.id).join(',')
          const newIds = data.map(p => p.id).join(',')
          if (prevIds === newIds && JSON.stringify(prev) === JSON.stringify(data)) return prev
          return data
        })
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  function showToast(msg, color = '#1A9E6E') {
    clearTimeout(toastTimer.current)
    setToast({ msg, color })
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  // ── CRUD with Supabase ──
  async function addPill(data) {
    const newPill = { id: genId(), ...data, created_at: new Date().toISOString() }
    skipNextRef.current.add(newPill.id)
    setPills(prev => [...prev, newPill]) // optimistic
    setSyncStatus('syncing')
    const { error } = await supabase.from('pills').insert(newPill)
    if (error) { console.error(error); setPills(prev => prev.filter(p => p.id !== newPill.id)); showToast('⚠ Erreur de sauvegarde', '#FF4444') }
    else { setSyncStatus('connected'); showToast('✓ Publication ajoutée') }
  }

  async function updatePill(id, data) {
    skipNextRef.current.add(id)
    setPills(prev => prev.map(p => p.id === id ? { ...p, ...data } : p)) // optimistic
    setSyncStatus('syncing')
    const { error } = await supabase.from('pills').update(data).eq('id', id)
    if (error) { console.error(error); showToast('⚠ Erreur de sauvegarde', '#FF4444') }
    else { setSyncStatus('connected'); showToast('✓ Publication mise à jour') }
  }

  async function removePill(id) {
    skipNextRef.current.add(id)
    setPills(prev => prev.filter(p => p.id !== id)) // optimistic
    setSyncStatus('syncing')
    const { error } = await supabase.from('pills').delete().eq('id', id)
    if (error) { console.error(error); showToast('⚠ Erreur de suppression', '#FF4444') }
    else { setSyncStatus('connected'); showToast('✓ Publication supprimée') }
  }

  // ── Modal ──
  function openAdd(blockKey, cellDay) {
    setForm({ title: '', time: '', description: '', type: 'texte', platform: 'li' })
    setModal({ mode: 'add', blockKey, cellDay })
    setTooltip(null)
  }

  function openEdit(pill, e) {
    if (e) e.stopPropagation()
    setForm({ title: pill.title, time: pill.time, description: pill.description, type: pill.type, platform: pill.platform })
    setModal({ mode: 'edit', pill })
    setTooltip(null)
  }

  async function saveForm() {
    if (!form.title.trim()) { setModal(null); return }
    if (modal.mode === 'add') {
      await addPill({ block_key: modal.blockKey, cell_day: modal.cellDay, ...form })
    } else {
      await updatePill(modal.pill.id, form)
    }
    setModal(null)
  }

  // ── Drag & Drop ──
  function onDragStart(e, pill) {
    setDragPill(pill)
    setTooltip(null)
    e.dataTransfer.effectAllowed = 'move'
    const ghost = document.createElement('div')
    ghost.textContent = pill.title
    ghost.style.cssText = 'position:fixed;top:-100px;left:-100px;background:#fbc600;color:#fff;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;white-space:nowrap;pointer-events:none;font-family:DM Sans,sans-serif'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  function onDragEnd() { setDragPill(null); setDragOver(null) }

  function onDragOver(e, key) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOver(key) }

  async function onDrop(e, blockKey, cellDay) {
    e.preventDefault()
    if (!dragPill || !cellDay) return
    if (dragPill.block_key === blockKey && dragPill.cell_day === cellDay) { setDragPill(null); setDragOver(null); return }
    await updatePill(dragPill.id, { block_key: blockKey, cell_day: cellDay })
    setDragPill(null)
    setDragOver(null)
    showToast('✓ Publication déplacée')
  }

  // ── Stats ──
  const countByPhase = (phase) => {
    const keys = BLOCKS.filter(b => b.phase === phase).map(b => b.key)
    return pills.filter(p => keys.includes(p.block_key)).length
  }

  const syncDot = syncStatus === 'syncing' ? '#fbc600' : syncStatus === 'error' ? '#FF8080' : '#1A9E6E'
  const syncLabel = syncStatus === 'syncing' ? 'Sync...' : syncStatus === 'error' ? '⚠ Hors ligne' : '✓ Connecté'

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ background: '#0D1117', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', color: '#E6EDF3' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Karizma <span style={{ color: '#fbc600' }}>×</span> GITEX
          </div>
          <div style={{ fontSize: '0.8rem', color: '#484F58', animation: 'pulse 1.2s infinite' }}>Chargement du calendrier partagé...</div>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@800&family=DM+Sans:wght@400&display=swap')`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0D1117', minHeight: '100vh', padding: '20px 16px', fontFamily: "'DM Sans', sans-serif", color: '#E6EDF3' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0D1117}::-webkit-scrollbar-thumb{background:#30363D;border-radius:3px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
        .pill-wrap{animation:fadeUp .18s ease;position:relative}
        .pill-wrap:hover .pill-actions{opacity:1!important}
        .pill-wrap:hover .pill-inner{opacity:.85}
        .tab-item{transition:all .18s}.tab-item:hover{border-color:#fbc600!important;color:#fbc600!important}
        .leg-row{transition:all .12s;cursor:pointer;border-radius:7px;user-select:none}.leg-row:hover{background:#21262D}
        input:focus,textarea:focus{border-color:#fbc600!important;outline:none}
        .modal-wrap{animation:popIn .2s ease}
        .save-btn:hover{background:#ff6a0d!important}
        .cancel-btn:hover{border-color:#fbc600!important;color:#fbc600!important}
        .cell-zone{transition:background .1s}
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: toast.color, color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 600, zIndex: 9999, animation: 'fadeUp .3s ease', boxShadow: '0 4px 20px rgba(0,0,0,.5)', maxWidth: 280 }}>
          {toast.msg}
        </div>
      )}

      {/* TOOLTIP */}
      {tooltip && !dragPill && (
        <div style={{ position: 'fixed', left: tooltip.x, top: tooltip.y, zIndex: 9998, background: '#1C2128', border: '1px solid #373E47', borderRadius: 10, padding: '11px 13px', width: 240, pointerEvents: 'none', boxShadow: '0 10px 40px rgba(0,0,0,.7)', animation: 'fadeUp .12s ease' }}>
          <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: TYPE_CONFIG[tooltip.pill.type]?.color, marginBottom: 4 }}>{TYPE_CONFIG[tooltip.pill.type]?.label}</div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: '0.6rem', padding: '1px 6px', borderRadius: 3, fontWeight: 700, background: PLATFORM_CONFIG[tooltip.pill.platform]?.bg, color: PLATFORM_CONFIG[tooltip.pill.platform]?.color }}>
              {PLATFORM_CONFIG[tooltip.pill.platform]?.label}
            </span>
          </div>
          {tooltip.pill.description && <div style={{ fontSize: '0.75rem', color: '#C9D1D9', lineHeight: 1.5, marginBottom: 5 }}>{tooltip.pill.description}</div>}
          {tooltip.pill.time && <div style={{ fontSize: '0.66rem', color: '#484F58' }}>🕐 {tooltip.pill.time}</div>}
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
          Calendrier · <span style={{ color: '#fbc600' }}>Karizma × GITEX Africa 2026</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Online users */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.68rem', color: '#8B949E', padding: '5px 10px', background: '#161B22', border: '1px solid #21262D', borderRadius: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A9E6E' }} />
            {onlineUsers} en ligne
          </div>
          {/* Sync status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.68rem', color: syncStatus === 'connected' ? '#5DE8B4' : syncStatus === 'syncing' ? '#FFAA70' : '#FF8080', padding: '5px 10px', background: '#161B22', border: '1px solid #21262D', borderRadius: 8, transition: 'all .3s' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: syncDot, flexShrink: 0, animation: syncStatus === 'syncing' ? 'pulse 0.6s infinite' : 'none' }} />
            {syncLabel}
          </div>
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#161B22', border: '1px solid #21262D', borderRadius: 10, padding: '8px 14px', marginBottom: 14, fontSize: '0.72rem', color: '#8B949E', flexWrap: 'wrap' }}>
        <span>🖱️ <strong style={{ color: '#C9D1D9' }}>Cliquer</strong> sur une case pour ajouter</span>
        <span style={{ color: '#30363D' }}>·</span>
        <span>✋ <strong style={{ color: '#C9D1D9' }}>Glisser</strong> un post pour le déplacer</span>
        <span style={{ color: '#30363D' }}>·</span>
        <span>✏️ <strong style={{ color: '#C9D1D9' }}>Survoler</strong> un post pour le modifier</span>
        <span style={{ color: '#30363D' }}>·</span>
        <span>🌐 <strong style={{ color: '#1A9E6E' }}>Sync temps réel</strong> — visible par tous</span>
      </div>

      {/* PHASE TABS */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
        {[['all', 'Toutes les phases'], ['pre', '📅 Pré-événement'], ['site', '🔴 Sur site GITEX'], ['post', '✅ Post-événement']].map(([key, label]) => (
          <button key={key} className="tab-item" onClick={() => setActivePhase(key)}
            style={{ padding: '6px 16px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${activePhase === key ? '#fbc600' : '#21262D'}`, background: activePhase === key ? '#fbc600' : '#161B22', color: activePhase === key ? '#fff' : '#8B949E', fontFamily: 'inherit' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>

        {/* SIDEBAR */}
        <div style={{ width: 186, flexShrink: 0, background: '#161B22', border: '1px solid #21262D', borderRadius: 14, padding: '14px 12px', position: 'sticky', top: 16 }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>Mars –<br /><span style={{ color: '#fbc600' }}>Avril</span></div>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#30363D', marginBottom: 12 }}>2026</div>

          {/* Content types */}
          <SbSection label="Content Type">
            {Object.entries(TYPE_CONFIG).map(([k, v]) => (
              <div key={k} className="leg-row" onClick={() => setHiddenTypes(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 6px', fontSize: '0.7rem', fontWeight: 500, marginBottom: 2, color: '#C9D1D9', opacity: hiddenTypes.has(k) ? 0.3 : 1 }}>
                <div style={{ width: 24, height: 18, borderRadius: 4, background: v.bg, color: v.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.56rem', fontWeight: 700 }}>{v.icon}</div>
                {v.label}
              </div>
            ))}
          </SbSection>

          {/* Platforms */}
          <SbSection label="Plateformes">
            {Object.entries(PLATFORM_CONFIG).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', fontSize: '0.67rem', color: '#8B949E', marginBottom: 2 }}>
                <span style={{ fontSize: '0.58rem', padding: '1px 4px', borderRadius: 3, fontWeight: 700, background: v.bg, color: v.color }}>{v.tag}</span>
                {v.label}
              </div>
            ))}
          </SbSection>

          {/* Phases */}
          <SbSection label="Phases">
            {Object.entries(PHASE_CONFIG).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.67rem', color: '#8B949E', marginBottom: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: v.color, flexShrink: 0 }} />
                {v.label} · <strong style={{ color: '#fbc600', marginLeft: 3 }}>{countByPhase(k)}</strong>
              </div>
            ))}
          </SbSection>

          {/* Stats */}
          <SbSection label="Stats">
            {[['Publications', pills.length], ['Carrousels', pills.filter(p => p.type === 'carrousel').length], ['Vidéos', pills.filter(p => p.type === 'video').length], ['Lives', pills.filter(p => p.type === 'live').length]].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.67rem', color: '#8B949E', padding: '3px 0', borderBottom: '1px solid #1C2128' }}>
                {l} <strong style={{ color: '#fbc600' }}>{c}</strong>
              </div>
            ))}
          </SbSection>

          {/* Live indicator */}
          <div style={{ marginTop: 12, padding: '7px 8px', background: '#0A1A0A', border: '1px solid #1A9E6E33', borderRadius: 7, fontSize: '0.62rem', color: '#3A7A5A', textAlign: 'center', lineHeight: 1.5 }}>
            <div style={{ color: '#1A9E6E', fontWeight: 700, marginBottom: 2 }}>🔴 Supabase Live</div>
            Les modifications sont<br />visibles par tous en temps réel
          </div>
        </div>

        {/* CALENDAR */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {BLOCKS.filter(b => activePhase === 'all' || b.phase === activePhase).map(block => (
            <div key={block.key} style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>

              {/* Block header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 14px', borderBottom: '1px solid #21262D', background: '#0D1117' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: PHASE_CONFIG[block.phase].color, flexShrink: 0 }} />
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{block.label}</div>
                <div style={{ marginLeft: 'auto', fontSize: '0.63rem', color: '#484F58' }}>{block.dates}</div>
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid #21262D' }}>
                {DAYS.map(d => <div key={d} style={{ textAlign: 'center', padding: '5px 2px', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#21262D' }}>{d}</div>)}
              </div>

              {/* Cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
                {block.cells.map((cell, ci) => {
                  const cellKey = `${block.key}__${cell.day}`
                  const isDropTarget = dragOver === cellKey && cell.day
                  const isHovered = hoveredCell === cellKey && cell.day
                  const cellPills = pills.filter(p => p.block_key === block.key && p.cell_day === cell.day && !hiddenTypes.has(p.type))
                  const isBlank = !cell.day

                  return (
                    <div key={ci} className="cell-zone"
                      onClick={() => cell.day && !dragPill && openAdd(block.key, cell.day)}
                      onMouseEnter={() => cell.day && setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                      onDragOver={e => cell.day && onDragOver(e, cellKey)}
                      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null) }}
                      onDrop={e => onDrop(e, block.key, cell.day)}
                      style={{
                        borderRight: ci % 7 === 6 ? 'none' : '1px solid #1C2128',
                        borderBottom: '1px solid #1C2128',
                        minHeight: 95, padding: '6px 5px', position: 'relative',
                        cursor: cell.day ? (dragPill ? 'copy' : 'pointer') : 'default',
                        background: isDropTarget ? '#0d1f14' : cell.gitex ? '#120D04' : isHovered && !dragPill ? '#13181f' : 'transparent',
                        outline: isDropTarget ? '2px dashed #1A9E6E' : 'none',
                        outlineOffset: -2,
                        opacity: isBlank ? 0.15 : 1,
                        pointerEvents: isBlank ? 'none' : 'auto',
                      }}
                    >
                      {cell.gitex && <div style={{ fontSize: '0.46rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fbc600', marginBottom: 3 }}>🔴 GITEX {cell.gitex}</div>}

                      {cell.day
                        ? <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: cellPills.length > 0 ? '#484F58' : cell.gitex ? '#fbc600' : '#8B949E', marginBottom: 3 }}>{cell.label || cell.day}</div>
                        : <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.6rem', fontWeight: 700, color: '#21262D' }}>{cell.label || ''}</div>
                      }

                      {/* Pills */}
                      {cellPills.map(pill => {
                        const tc = TYPE_CONFIG[pill.type]
                        const pc = PLATFORM_CONFIG[pill.platform]
                        return (
                          <div key={pill.id} className="pill-wrap"
                            draggable
                            onDragStart={e => { e.stopPropagation(); onDragStart(e, pill) }}
                            onDragEnd={e => { e.stopPropagation(); onDragEnd() }}
                            onClick={e => { e.stopPropagation(); openEdit(pill, e) }}
                            onMouseEnter={e => {
                              if (dragPill) return
                              const r = e.currentTarget.getBoundingClientRect()
                              setTooltip({ pill, x: Math.min(r.right + 8, window.innerWidth - 250), y: Math.max(r.top - 10, 8) })
                            }}
                            onMouseLeave={() => setTooltip(null)}
                            style={{ marginBottom: 3, position: 'relative', cursor: 'grab' }}
                          >
                            <div className="pill-inner" style={{ borderRadius: 5, padding: '4px 22px 4px 6px', fontSize: '0.6rem', fontWeight: 600, lineHeight: 1.3, background: tc?.bg, color: tc?.color, transition: 'opacity .12s' }}>
                              <span style={{ display: 'block', fontSize: '0.5rem', fontWeight: 400, opacity: 0.65, marginBottom: 1 }}>{pill.time}</span>
                              <span style={{ fontSize: '0.44rem', fontWeight: 700, padding: '0 3px', borderRadius: 2, marginRight: 2, background: pc?.bg, color: pc?.color, verticalAlign: 'middle' }}>{pc?.tag}</span>
                              {tc?.icon} {pill.title}
                            </div>
                            <div className="pill-actions" style={{ position: 'absolute', top: 2, right: 2, display: 'flex', gap: 2, opacity: 0, transition: 'opacity .15s' }}>
                              <button onClick={e => { e.stopPropagation(); openEdit(pill, e) }} style={{ background: 'rgba(0,0,0,.6)', border: 'none', color: '#fff', width: 14, height: 14, borderRadius: 3, cursor: 'pointer', fontSize: '0.48rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏</button>
                              <button onClick={e => { e.stopPropagation(); removePill(pill.id) }} style={{ background: 'rgba(180,30,30,.7)', border: 'none', color: '#fff', width: 14, height: 14, borderRadius: 3, cursor: 'pointer', fontSize: '0.48rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                            </div>
                          </div>
                        )
                      })}

                      {/* Add hint */}
                      {cell.day && !dragPill && isHovered && (
                        <div style={{ fontSize: '0.55rem', color: '#fbc600', textAlign: 'center', marginTop: 2, pointerEvents: 'none', fontWeight: 600, opacity: 0.7 }}>
                          + Ajouter
                        </div>
                      )}

                      {/* Drop hint */}
                      {isDropTarget && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                          <span style={{ fontSize: '0.6rem', color: '#1A9E6E', fontWeight: 700, background: '#0d1f14', padding: '2px 6px', borderRadius: 4 }}>Déposer ici</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="modal-wrap" onClick={e => e.stopPropagation()} style={{ background: '#161B22', border: '1px solid #373E47', borderRadius: 16, padding: 24, width: 460, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>

            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              {modal.mode === 'add' ? '➕ Nouvelle' : '✏️ Modifier'} <span style={{ color: '#fbc600' }}>publication</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#484F58', marginBottom: 18 }}>
              📅 {modal.mode === 'add' ? modal.cellDay : modal.pill.cell_day}
            </div>

            {/* Title + Time */}
            {[['Titre', 'title', 'Ex : Interview CEO J1'], ['Heure', 'time', 'Ex : 8h30']].map(([label, key, ph]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#8B949E', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} onKeyDown={e => e.key === 'Enter' && saveForm()}
                  style={{ width: '100%', background: '#0D1117', border: '1px solid #373E47', borderRadius: 8, padding: '8px 12px', color: '#E6EDF3', fontSize: '0.8rem', fontFamily: 'inherit', transition: 'border-color .2s' }} />
              </div>
            ))}

            {/* Description */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#8B949E', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.08em' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Détail du contenu..." rows={2}
                style={{ width: '100%', background: '#0D1117', border: '1px solid #373E47', borderRadius: 8, padding: '8px 12px', color: '#E6EDF3', fontSize: '0.8rem', fontFamily: 'inherit', resize: 'vertical', transition: 'border-color .2s' }} />
            </div>

            {/* Platform */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#8B949E', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.08em' }}>Plateforme</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
                {Object.entries(PLATFORM_CONFIG).map(([k, v]) => (
                  <div key={k} onClick={() => setForm(f => ({ ...f, platform: k }))}
                    style={{ padding: '8px 4px', borderRadius: 8, fontSize: '0.63rem', fontWeight: 700, cursor: 'pointer', border: `2px solid ${form.platform === k ? '#fff' : 'transparent'}`, textAlign: 'center', background: v.bg, color: v.color, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'all .15s', transform: form.platform === k ? 'scale(1.04)' : 'scale(1)' }}>
                    <span style={{ fontSize: '1rem' }}>{v.emoji}</span>{v.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Type */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#8B949E', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.08em' }}>Type de contenu</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
                {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                  <div key={k} onClick={() => setForm(f => ({ ...f, type: k }))}
                    style={{ padding: '7px 5px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', border: `2px solid ${form.type === k ? '#fff' : 'transparent'}`, textAlign: 'center', background: v.bg, color: v.color, transition: 'all .15s' }}>
                    {v.icon} {v.label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="save-btn" onClick={saveForm} style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: 'none', background: '#fbc600', color: '#fff', fontFamily: 'inherit', transition: 'background .2s' }}>
                💾 Enregistrer
              </button>
              <button className="cancel-btn" onClick={() => setModal(null)} style={{ padding: '8px 14px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: '1px solid #21262D', background: '#161B22', color: '#8B949E', fontFamily: 'inherit', transition: 'all .2s' }}>
                Annuler
              </button>
              {modal.mode === 'edit' && (
                <button onClick={() => removePill(modal.pill.id)} style={{ marginLeft: 'auto', padding: '8px 14px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: '1px solid #5C1414', background: '#3D0A0A', color: '#FF8080', fontFamily: 'inherit' }}>
                  🗑 Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Small helper component ──
function SbSection({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#30363D', paddingBottom: 5, borderTop: '1px solid #21262D', paddingTop: 8, marginTop: 4 }}>{label}</div>
      {children}
    </div>
  )
}

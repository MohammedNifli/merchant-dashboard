import React, { useState, useEffect, useRef } from 'react';

const API_BASE_URL = 'https://speako.nuro7.in/api/v1';

// ── Image-Inspired Sparkline SVG Chart ──
function SparklineChart({ data, color, gradientId }) {
  const W = 220, H = 45;
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = W / (data.length - 1);

  const points = data.map((val, i) => ({
    x: i * step,
    y: H - 4 - ((val - min) / range) * (H - 12)
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Mini Credit Quota Donut Chart (for Top-Right KPI 4) ──
function MiniCreditDonutChart() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '110px', height: '110px' }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="12" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="url(#miniCreditGrad)" strokeWidth="12" strokeDasharray="172 240" strokeLinecap="round" transform="rotate(-90 50 50)" />
          <defs>
            <linearGradient id="miniCreditGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CREDITS</span>
          <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)' }}>72%</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '10.5px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7' }}></span> Voice 960 cr
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4' }}></span> Text 480 cr
        </span>
      </div>
    </div>
  );
}

// ── Dual-Axis Aria Revenue ($) & Conversation Volume (#) Chart ──
function AriaSalesTrendChart({ trend }) {
  const raw = Array.isArray(trend) ? trend.filter(Boolean) : [];
  const points = raw.map((p) => {
    let label = p.month || p.period || p.label || p.date || p.bucket || '';
    if (/^\d{4}-\d{2}$/.test(label)) {
      const [y, m] = label.split('-').map(Number);
      label = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'short' }) + ` '${String(y).slice(2)}`;
    }
    return {
      label,
      revenue: Number(p.sales ?? p.revenue ?? p.total_revenue ?? p.total ?? 0),
      turns: Number(p.turns ?? p.message_count ?? p.messages ?? p.conversation_count ?? p.count ?? 0)
    };
  });

  const W = 540, H = 170;
  const hasData = points.length > 0;
  const maxRev = Math.max(...points.map((p) => p.revenue), 1);
  const maxTurns = Math.max(...points.map((p) => p.turns), 1);
  const xStep = hasData && points.length > 1 ? W / (points.length - 1) : 0;
  const revY = (v) => H - 8 - (v / maxRev) * (H - 24);
  const turnsY = (v) => H - 8 - (v / maxTurns) * (H - 24);

  const revPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * xStep).toFixed(1)} ${revY(p.revenue).toFixed(1)}`).join(' ');
  const turnsPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * xStep).toFixed(1)} ${turnsY(p.turns).toFixed(1)}`).join(' ');
  const areaPath = hasData ? `${revPath} L ${W} ${H} L 0 ${H} Z` : '';

  const fmtYAxis = (v) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${Math.round(v)}`);

  if (!hasData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '230px', fontSize: '12px', color: 'var(--text-muted)' }}>
        No revenue trend data available yet.
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '230px' }}>
      <div style={{ display: 'flex', position: 'relative', width: '100%', height: '190px' }}>
        {/* Left Y-Axis Labels ($) */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '9.5px', color: '#a855f7', fontWeight: '700', paddingRight: '6px', height: '100%' }}>
          <span>{fmtYAxis(maxRev)}</span>
          <span>{fmtYAxis(maxRev * 0.66)}</span>
          <span>{fmtYAxis(maxRev * 0.33)}</span>
          <span>$0</span>
        </div>

        {/* SVG Canvas */}
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="storeRevGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[20, 65, 110, 155].map((y, idx) => (
              <line key={idx} x1="0" y1={y} x2={W} y2={y} stroke="rgba(139, 92, 246, 0.08)" strokeDasharray="3 3" />
            ))}

            {/* Solid Purple Curve: Aria Assisted Sales ($) */}
            {areaPath && <path d={areaPath} fill="url(#storeRevGradient)" />}
            {revPath && <path d={revPath} fill="none" stroke="#a855f7" strokeWidth="3" />}

            {/* Dotted Cyan Curve: Conversation Count (# Dialogue Turns) */}
            {turnsPath && <path d={turnsPath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="5 4" />}

            {/* Active Point Markers */}
            {points.length > 0 && (
              <>
                <circle cx={W} cy={revY(points[points.length - 1].revenue)} r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                <circle cx={W} cy={turnsY(points[points.length - 1].turns)} r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                <line x1={W} y1={revY(points[points.length - 1].revenue)} x2={W} y2={H} stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" strokeDasharray="4 2" />
              </>
            )}
          </svg>

          {/* Interactive Dual-Axis Tooltip Callout */}
          {points.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '8px',
              background: 'rgba(18, 14, 36, 0.95)',
              border: '1px solid #a855f7',
              borderRadius: '8px',
              padding: '6px 12px',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)',
              fontSize: '10.5px',
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <div style={{ fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>
                {points[points.length - 1].label || 'Latest'} Point
              </div>
              <div style={{ color: '#a855f7', fontWeight: '700' }}>Sales: ${points[points.length - 1].revenue.toLocaleString()}</div>
              <div style={{ color: '#06b6d4', fontWeight: '700' }}>Dialogue Turns: {points[points.length - 1].turns.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Right Y-Axis Labels (Conversation Count #) */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '9.5px', color: '#06b6d4', fontWeight: '700', paddingLeft: '6px', height: '100%' }}>
          <span>{Math.round(maxTurns)}</span>
          <span>{Math.round(maxTurns * 0.66)}</span>
          <span>{Math.round(maxTurns * 0.33)}</span>
          <span>0</span>
        </div>
      </div>

      {/* Month Labels along X-Axis */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '32px', paddingRight: '28px', marginTop: '6px', fontSize: '10px', color: 'var(--text-light)' }}>
        {points.map((p, i) => <span key={i}>{p.label}</span>)}
      </div>
    </div>
  );
}

// ── Circular Usage Donut Chart ──
function DonutUsageChart({ used, total, label = 'Used' }) {
  const size = 150;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = total ? Math.min(100, Math.max(0, (Number(used) / Number(total)) * 100)) : 0;
  const offset = c - (pct / 100) * c;
  const color = pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#8b5cf6';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>{pct.toFixed(0)}%</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{label}</span>
        </div>
      </div>
      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text-main)' }}>{used != null ? Number(used).toLocaleString() : '—'}</strong> of {total != null ? Number(total).toLocaleString() : '—'}
      </div>
    </div>
  );
}

// ── Customer Intent Distribution (Top 5 & Expandable 9 Classes) ──
function CustomerIntentDistributionChart() {
  const [showAllIntents, setShowAllIntents] = useState(false);

  const primaryIntents = [
    { label: 'Product Discovery & Search', pct: 45, count: '648 queries', color: 'linear-gradient(90deg, #6366f1, #4f46e5)', icon: '🔍' },
    { label: 'Cart & Checkout Actions', pct: 28, count: '403 queries', color: 'linear-gradient(90deg, #06b6d4, #3b82f6)', icon: '🛒' },
    { label: 'Order Tracking', pct: 15, count: '216 queries', color: 'linear-gradient(90deg, #ec4899, #f43f5e)', icon: '📦' },
    { label: 'Inventory & Variant Checks', pct: 7, count: '101 queries', color: 'linear-gradient(90deg, #10b981, #059669)', icon: '🏷️' },
    { label: 'Conversational Discounts Applied', pct: 5, count: '72 queries', color: 'linear-gradient(90deg, #f59e0b, #d97706)', icon: '⚡' },
  ];

  const extraIntents = [
    { label: 'Greetings & Chitchat', pct: 2, count: '29 queries', color: 'rgba(99, 102, 241, 0.4)', icon: '💬' },
    { label: 'Store Info & Policies', pct: 1.5, count: '22 queries', color: 'rgba(6, 182, 212, 0.4)', icon: 'ℹ️' },
    { label: 'Product Comparisons', pct: 1, count: '14 queries', color: 'rgba(236, 72, 153, 0.4)', icon: '⚖️' },
    { label: 'FAQ Redirects', pct: 0.5, count: '7 queries', color: 'rgba(245, 158, 11, 0.4)', icon: '❓' },
  ];

  const displayedIntents = showAllIntents ? [...primaryIntents, ...extraIntents] : primaryIntents;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {displayedIntents.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{item.icon}</span> {item.label}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-main)', fontSize: '11.5px' }}>{item.pct}%</strong> ({item.count})
            </span>
          </div>
          <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              width: `${item.pct}%`,
              height: '100%',
              background: item.color,
              borderRadius: '6px',
              transition: 'var(--transition)'
            }} />
          </div>
        </div>
      ))}

      <button 
        onClick={() => setShowAllIntents(!showAllIntents)} 
        style={{
          alignSelf: 'center',
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontSize: '11px',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {showAllIntents ? '▲ Show Top 5 Intents' : 'View All 9 Intent Classes ∨'}
      </button>
    </div>
  );
}

// ── Support Ticket Escalation & Heat Rating Donut Chart ──
function SupportEscalationDonutChart() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '4px 0' }}>
        <div style={{ position: 'relative', width: '115px', height: '115px' }}>
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="11" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="11" strokeDasharray="195 240" strokeLinecap="round" transform="rotate(-90 50 50)" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="11" strokeDasharray="36 240" strokeDashoffset="-196" strokeLinecap="round" transform="rotate(-90 50 50)" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="11" strokeDasharray="8 240" strokeDashoffset="-232" strokeLinecap="round" transform="rotate(-90 50 50)" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)' }}>82%</span>
            <span style={{ fontSize: '8.5px', color: 'var(--success)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>AUTO-RESOLVED</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Automated by Aria</span>
            <strong style={{ marginLeft: 'auto', color: '#10b981' }}>82%</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Escalated - Hot Heat</span>
            <strong style={{ marginLeft: 'auto', color: '#ef4444' }}>3%</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
            <span style={{ color: 'var(--text-muted)' }}>Escalated - Warm/Cold</span>
            <strong style={{ marginLeft: 'auto', color: '#f59e0b' }}>15%</strong>
          </div>
        </div>
      </div>

      {/* Clean Unbordered Note */}
      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
        ✨ <strong>1,180 queries</strong> resolved without human agent intervention.
      </div>
    </div>
  );
}

// ── Offer Create Form Sub-Component ──
function OfferCreateForm({ onCreate }) {
  const [form, setForm] = useState({ platform_id: '', product_name: '', title: '', description: '', offer_type: 'promotion', discount_percent: '', discount_amount: '', ends_at: '', priority: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.platform_id.trim()) return;
    const payload = {
      platform_id: form.platform_id.trim(),
      product_name: form.product_name.trim() || form.title.trim(),
      offer_type: form.offer_type,
      title: form.title.trim(),
      description: form.description.trim() || null,
      ...(form.discount_percent !== '' ? { discount_percent: parseFloat(form.discount_percent) } : {}),
      ...(form.discount_amount !== '' ? { discount_amount: parseFloat(form.discount_amount) } : {}),
      ...(form.ends_at ? { ends_at: new Date(form.ends_at).toISOString() } : {}),
      ...(form.priority !== '' ? { priority: parseInt(form.priority, 10) } : {})
    };
    setSubmitting(true);
    const ok = await onCreate(payload);
    setSubmitting(false);
    if (ok) setForm({ platform_id: '', product_name: '', title: '', description: '', offer_type: 'promotion', discount_percent: '', discount_amount: '', ends_at: '', priority: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Create New Promotion Offer</h2>

      <div className="form-group">
        <label>Product Platform ID</label>
        <input className="form-control" value={form.platform_id} onChange={(e) => setForm({ ...form, platform_id: e.target.value })} placeholder="e.g. 7956... (Shopify product id)" required />
      </div>

      <div className="form-group">
        <label>Product Name</label>
        <input className="form-control" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} placeholder="Organic Cotton Crew Shirt" />
      </div>

      <div className="form-group">
        <label>Offer Title</label>
        <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="End of season flash sale" required />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ minHeight: '60px' }} />
      </div>

      <div className="form-group">
        <label>Offer Category Type</label>
        <select className="form-control" value={form.offer_type} onChange={(e) => setForm({ ...form, offer_type: e.target.value })}>
          <option value="promotion">Promotion</option>
          <option value="dead_stock">Dead Stock Clearance</option>
          <option value="new_arrival">New Arrival Special</option>
          <option value="seasonal">Seasonal Discount</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label>Discount %</label>
          <input type="number" className="form-control" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} min="0" max="100" placeholder="e.g. 20" />
        </div>
        <div className="form-group">
          <label>Fixed Discount ($)</label>
          <input type="number" className="form-control" value={form.discount_amount} onChange={(e) => setForm({ ...form, discount_amount: e.target.value })} min="0" placeholder="e.g. 5.00" />
        </div>
      </div>

      <div className="form-group">
        <label>Expiration Date</label>
        <input type="datetime-local" className="form-control" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Offer'}
        </button>
      </div>
    </form>
  );
}

// ── Main App Component ──
export default function App() {
  const [theme, setTheme] = useState('dark');

  // Auth & Mode State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [loginEmail, setLoginEmail] = useState('owner@cartify-upo9duqv.myshopify.com');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const loginAttemptsRef = useRef({ count: 0, firstAt: 0 }); // client-side throttle (public endpoint)

  // Sidebar & Navigation
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Tenant Config State
  const [tenant, setTenant] = useState({
    id: '252d2f28-368f-4035-9077-2965ab8cab32',
    name: 'Cartify Store',
    email: 'admin@cartify.com',
    plan: 'starter',
    platform: 'shopify',
    is_active: true,
    shopify_domain: 'cartify-upo9duqv.myshopify.com',
    woocommerce_store_url: '',
    custom_api_base_url: '',
    currency_symbol: '$',
    shipping_policy: 'Free shipping on orders over $50. Standard shipping takes 3-5 business days.',
    returns_policy: '30-day money-back guarantee. Return shipping is free for exchanges.',
    payment_methods: 'Credit Cards (Visa, Mastercard, AMEX), Apple Pay, and Google Pay.',
    about_text: 'Cartify is your premium source for curated products designed to make your life easier.',
    support_email: 'support@cartify.com',
    support_phone: '+1 (555) 0199',
    business_hours: 'Mon-Fri: 9 AM - 6 PM EST',
    ai_personality: 'friendly',
    greeting_message: 'Hi there! I am Aria, your personal shopping assistant. How can I help you find the perfect product today?',
    logo_url: '',
    shopify_access_token: '',
    shopify_storefront_token: '',
    woocommerce_consumer_key: '',
    woocommerce_consumer_secret: '',
    custom_api_key: ''
  });

  const [editedTenant, setEditedTenant] = useState({ ...tenant });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Conversations State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Logs terminal state
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'info', text: 'Speako Merchant Dashboard Initialized (Obsidian Theme)' }
  ]);
  const [showAlert, setShowAlert] = useState(true);

  // Table pagination state
  const [productPage, setProductPage] = useState(0);
  const [ticketPage, setTicketPage] = useState(0);
  const [orderPage, setOrderPage] = useState(0);
  const [ticketsTabPage, setTicketsTabPage] = useState(0);
  const PAGE_SIZE = 5;

  // AI Voice Simulator state
  const [simulatorQuery, setSimulatorQuery] = useState('');
  const [simulatorReply, setSimulatorReply] = useState('');
  const [isSimulatorLoading, setIsSimulatorLoading] = useState(false);

  const logTerminalRef = useRef(null);

  // Analytics State
  const [summary, setSummary] = useState({ total_conversations: 523, completed_purchases: 48, total_revenue: 9560, conversion_rate: 0.091 });
  const [metrics, setMetrics] = useState([]);
  const [agentSold, setAgentSold] = useState(null);
  const [agentProducts, setAgentProducts] = useState([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Dashboard Metrics State (from GET /merchant/dashboard/metrics)
  const [dashMetrics, setDashMetrics] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  // Billing State
  const [billingPlans, setBillingPlans] = useState([]);
  const [billingSubscription, setBillingSubscription] = useState(null);
  const [isLoadingBilling, setIsLoadingBilling] = useState(false);

  // Orders, Tickets, Offers state
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');

  const [tickets, setTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState('open');
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [ticketNoteInput, setTicketNoteInput] = useState('');

  // Ticket Action Modals State (View Transcript & Live Takeover)
  const [viewTicketModal, setViewTicketModal] = useState(null);
  const [takeoverModal, setTakeoverModal] = useState(null);
  const [takeoverMessage, setTakeoverMessage] = useState('');

  const [offers, setOffers] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);

  // Boot Token check
  useEffect(() => {
    const savedToken = sessionStorage.getItem('speako_access') || localStorage.getItem('speako_token');

    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchTenantData(savedToken);
    } else if (localStorage.getItem('speako_sandbox') === 'true') {
      setIsSandboxMode(true);
      setIsAuthenticated(true);
      addLog('success', 'Logged in via Sandbox Mode (Demo)');
    }
    // No token → show real login screen (ready to fetch from speako.nuro7.in)
  }, []);

  // Sync theme attribute to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keep logs scrolled to bottom
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type, text) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type, text }]);
  };

  // API Call: Tenant Config
  const fetchTenantData = async (authToken) => {
    try {
      addLog('info', 'Fetching tenant profile details...');
      const response = await authFetch('/tenants/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTenant(prev => ({ ...prev, ...data }));
        setEditedTenant(prev => ({ ...prev, ...data }));
        addLog('success', `Retrieved profile for tenant: ${data.name}`);
        fetchConversations(authToken);
        fetchAnalytics(authToken);
        fetchDashboardMetrics(authToken);
      } else {
        addLog('error', 'Failed to fetch tenant data.');
      }
    } catch (err) {
      addLog('error', `Connection error: ${err.message}. Sandbox fallback active.`);
    }
  };

  // API Call: Analytics (summary + metrics + agent-sold + agent-products)
  const fetchAnalytics = async (authToken = token) => {
    setIsLoadingAnalytics(true);
    const range = ''; // optionally add ?from_date=&to_date= later
    try {
      const [sRes, mA, aRes, pRes] = await Promise.all([
        authFetch(`/analytics/summary`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
        authFetch(`/analytics/metrics${range}`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
        authFetch(`/analytics/agent-sold${range}`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
        authFetch(`/analytics/agent-products${range}`, { headers: { 'Authorization': `Bearer ${authToken}` } })
      ]);
      if (sRes.ok) setSummary(await sRes.json());
      if (mA.ok) setMetrics((await mA.json()).metrics || []);
      if (aRes.ok) setAgentSold(await aRes.json());
      if (pRes.ok) setAgentProducts(await pRes.json());
    } catch (err) {
      addLog('error', `Analytics fetch error: ${err.message}`);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // API Call: Dashboard Metrics (GET /merchant/dashboard/metrics)
  const fetchDashboardMetrics = async (authToken = token) => {
    setIsLoadingDashboard(true);
    try {
      const response = await authFetch('/merchant/dashboard/metrics', { headers: { 'Authorization': `Bearer ${authToken}` } });
      if (response.ok) {
        const json = await response.json();
        setDashMetrics(json.data || json);
        addLog('success', 'Dashboard metrics loaded.');
      } else {
        addLog('error', `Dashboard metrics failed (HTTP ${response.status}). Using fallback data.`);
      }
    } catch (err) {
      addLog('error', `Dashboard metrics error: ${err.message}`);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const refreshDashboard = () => {
    fetchAnalytics();
    fetchDashboardMetrics();
    addLog('info', 'Refreshed dashboard metrics.');
  };

  // ── Dashboard Metrics Accessors (defensive against missing/alternate field names) ──
  const dm = dashMetrics || {};
  const dmKpis = dm.kpis || {};
  const dmRev = dmKpis.revenue || {};
  const dmConv = dmKpis.conversions || {};
  const dmEng = dmKpis.engagement || {};
  const dmPlan = dmKpis.plan_usage || {};
  const dmPulse = (dm.performance_hub || {}).live_pulse || {};
  const dmTrend = (dm.performance_hub || {}).revenue_dialogue_trend || [];
  const dmProducts = (dm.operational_desk || {}).top_converted_products || [];
  const dmEsc = (dm.operational_desk || {}).support_escalations || {};
  const dmTickets = dmEsc.recent_tickets || [];

  const voiceSplit = dmEng.voice_split_percentage ?? dmEng.voice_split;
  const textSplit = dmEng.text_split_percentage ?? dmEng.text_split;
  const avgTurnSeconds = dmEng.avg_voice_turn_seconds;
  const creditsUsed = dmPlan.credits_used ?? dmPlan.used_credits ?? dmPlan.credits_consumed ?? dmPlan.used;
  const creditsTotal = dmPlan.credits_total ?? dmPlan.total_credits ?? dmPlan.max_conversations ?? dmPlan.limit;
  const planName = dmPlan.plan_tier ?? dmPlan.plan_name ?? dmPlan.tier;

  const toMoney = (v, fb) => {
    if (v == null || isNaN(Number(v))) return fb;
    return Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 });
  };
  const toPct = (v, fb) => {
    if (v == null || isNaN(Number(v))) return fb;
    return `${Number(v).toFixed(1)}%`;
  };
  const planPct = creditsTotal ? Math.min(100, Math.round((creditsUsed / creditsTotal) * 100)) : 0;
  const escAuto = toPct(dmEsc.auto_resolved_percentage ?? dmEsc.auto_resolved_pct, '0%');
  const escEscalated = toPct(dmEsc.escalated_percentage ?? dmEsc.escalated_pct, '0%');
  const statusText = dmPulse.status_message || 'All systems operational • Redis & WS Connected';
  const isStatusOk = !dmPulse.status_message || !/down|offline|disconnect|error/i.test(dmPulse.status_message);

  const productPageCount = Math.max(1, Math.ceil(dmProducts.length / PAGE_SIZE));
  const ticketPageCount = Math.max(1, Math.ceil(dmTickets.length / PAGE_SIZE));
  const shownProducts = dmProducts.slice(productPage * PAGE_SIZE, (productPage + 1) * PAGE_SIZE);
  const shownTickets = dmTickets.slice(ticketPage * PAGE_SIZE, (ticketPage + 1) * PAGE_SIZE);

  const PaginationControls = ({ page, pageCount, onPageChange }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '16px', fontSize: '12px' }}>
        <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }} disabled={page === 0} onClick={() => onPageChange(page - 1)}>‹ Prev</button>
        <span style={{ color: 'var(--text-muted)' }}>Page {page + 1} / {pageCount}</span>
        <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }} disabled={page >= pageCount - 1} onClick={() => onPageChange(page + 1)}>Next ›</button>
      </div>
    );
  };

  // API Call: Save Config
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    addLog('info', 'Updating tenant configuration...');

    try {
      if (isSandboxMode) {
        setTenant({ ...editedTenant });
        setSaveSuccess(true);
        addLog('success', 'Local tenant configuration saved (Sandbox Mode).');
        setTimeout(() => setSaveSuccess(false), 3000);
        return;
      }

      const response = await authFetch('/tenants/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editedTenant)
      });
      if (response.ok) {
        const updated = await response.json();
        setTenant(updated);
        setEditedTenant(updated);
        setSaveSuccess(true);
        addLog('success', 'Tenant details successfully updated in backend database.');
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        addLog('error', 'Backend failed to commit configuration changes.');
      }
    } catch (err) {
      addLog('error', `Error saving settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // API Call: Conversations
  const fetchConversations = async (authToken = token) => {
    setIsLoadingConversations(true);
    addLog('info', 'Loading recent conversations list...');
    try {
      if (isSandboxMode) {
        const mockConv = [
          { id: '1', session_id: 'sess_9824_voice', channel: 'voice', created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: '2', session_id: 'sess_9823_chat', channel: 'text', created_at: new Date(Date.now() - 7200000).toISOString() },
          { id: '3', session_id: 'sess_9821_voice', channel: 'voice', created_at: new Date(Date.now() - 86400000).toISOString() }
        ];
        setConversations(mockConv);
        setSelectedConversation(mockConv[0]);
        setChatMessages([
          { id: 'm1', role: 'user', content: 'Do you have free shipping on orders over $50?', created_at: '10:14 AM' },
          { id: 'm2', role: 'assistant', content: 'Yes! We provide free standard shipping on all orders over $50 within 3-5 business days.', created_at: '10:14 AM' }
        ]);
        addLog('success', 'Loaded mock conversation transcripts (Sandbox).');
        return;
      }
      const response = await authFetch('/conversations/', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.conversations || []);
        setConversations(list);
        addLog('success', `Retrieved ${list.length} conversation sessions.`);
      }
    } catch (err) {
      addLog('error', `Error fetching conversations: ${err.message}`);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // API Call: Chat Messages
  const fetchChatHistory = async (sessionId) => {
    setIsLoadingChat(true);
    try {
      if (isSandboxMode) {
        setChatMessages([
          { id: 'm1', role: 'user', content: `Can I return this shirt if it does not fit? (Session ${sessionId})`, created_at: '11:02 AM' },
          { id: 'm2', role: 'assistant', content: 'Absolutely! We offer a 30-day money-back guarantee with free return shipping for exchanges.', created_at: '11:02 AM' }
        ]);
        return;
      }
      const response = await authFetch(`/conversations/${encodeURIComponent(sessionId)}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setChatMessages(Array.isArray(data) ? data : (data.messages || []));
      }
    } catch (err) {
      addLog('error', `Error fetching transcript history: ${err.message}`);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Orders, Tickets, Offers Handlers
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      if (isSandboxMode) {
        setOrders([
          { id: 'ord_89312a', customer_email: 'sarah.j@gmail.com', total: 124.50, currency: '$', created_at: new Date().toISOString(), status: 'paid' },
          { id: 'ord_89311b', customer_email: 'michael.b@yahoo.com', total: 78.00, currency: '$', created_at: new Date(Date.now() - 86400000).toISOString(), status: 'shipped' }
        ]);
        return;
      }
      const statusParam = orderStatusFilter ? `&status=${encodeURIComponent(orderStatusFilter)}` : '';
      const response = await authFetch(`/orders/?skip=0&limit=100${statusParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : (data.orders || []));
      }
    } catch (err) {
      addLog('error', `Error fetching orders: ${err.message}`);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      if (isSandboxMode) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        addLog('success', `Order ${orderId.slice(0, 8)} status set to ${status}.`);
        return;
      }
      const response = await authFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        const updated = await response.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        addLog('success', `Order ${orderId.slice(0, 8)} updated.`);
      }
    } catch (err) {
      addLog('error', `Error updating order status: ${err.message}`);
    }
  };

  const fetchTickets = async () => {
    setIsLoadingTickets(true);
    try {
      if (isSandboxMode) {
        setTickets([
          { id: 'tck_101', ticket_number: 'TCK-1001', priority: 'high', heat: 'hot', status: 'open', issue_type: 'shipping', issue_summary: 'Customer tracking link showing exception delay.', customer_name: 'David Miller', customer_email: 'david@example.com', created_at: new Date().toISOString() },
          { id: 'tck_102', ticket_number: 'TCK-1002', priority: 'medium', heat: 'warm', status: 'in_progress', issue_type: 'product_query', issue_summary: 'Inquiry regarding size 10 restock date.', customer_name: 'Elena Rostova', customer_email: 'elena@example.com', created_at: new Date(Date.now() - 43200000).toISOString() }
        ]);
        return;
      }
      const statusParam = ticketStatusFilter ? `status=${encodeURIComponent(ticketStatusFilter)}` : '';
      const response = await authFetch(`/merchant/tickets?${statusParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(Array.isArray(data) ? data : (data.tickets || []));
      }
    } catch (err) {
      addLog('error', `Error fetching tickets: ${err.message}`);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleUpdateTicket = async (ticketId, payload) => {
    try {
      if (isSandboxMode) {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, ...payload } : t));
        addLog('success', `Ticket ${ticketId} updated.`);
        return;
      }
      const response = await authFetch(`/merchant/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const updated = await response.json();
        setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
        addLog('success', `Ticket updated.`);
      }
    } catch (err) {
      addLog('error', `Error updating ticket: ${err.message}`);
    }
  };

  const fetchOffers = async () => {
    setIsLoadingOffers(true);
    try {
      if (isSandboxMode) {
        setOffers([
          { id: 'off_1', title: 'End of Summer Clearance', product_name: 'Premium Leather Jacket', offer_type: 'dead_stock', discount_percent: 25, is_active: true, created_at: new Date().toISOString() },
          { id: 'off_2', title: 'New Arrival Intro Sale', product_name: 'Wireless Earbuds Pro', offer_type: 'new_arrival', discount_amount: 15, is_active: false, created_at: new Date().toISOString() }
        ]);
        return;
      }
      const response = await authFetch('/offers/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOffers(Array.isArray(data) ? data : (data.offers || []));
      }
    } catch (err) {
      addLog('error', `Error fetching offers: ${err.message}`);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const handleCreateOffer = async (payload) => {
    try {
      if (isSandboxMode) {
        const newOffer = { id: `off_${Date.now()}`, ...payload, is_active: true, created_at: new Date().toISOString() };
        setOffers(prev => [...prev, newOffer]);
        addLog('success', `Created offer: ${payload.title}`);
        return true;
      }
      const response = await authFetch('/offers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const created = await response.json();
        setOffers(prev => [...prev, created]);
        addLog('success', `Offer created: ${created.title}`);
        return true;
      }
      return false;
    } catch (err) {
      addLog('error', `Error creating offer: ${err.message}`);
      return false;
    }
  };

  const handleToggleOffer = async (offer) => {
    try {
      if (isSandboxMode) {
        setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, is_active: !o.is_active } : o));
        addLog('success', `Offer ${!offer.is_active ? 'activated' : 'paused'}: ${offer.title}`);
        return;
      }
      const response = await authFetch(`/offers/${offer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ is_active: !offer.is_active })
      });
      if (response.ok) {
        const updated = await response.json();
        setOffers(prev => prev.map(o => o.id === offer.id ? updated : o));
        addLog('success', `Offer ${updated.is_active ? 'activated' : 'paused'}: ${updated.title}`);
      }
    } catch (err) {
      addLog('error', `Error updating offer: ${err.message}`);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    try {
      if (isSandboxMode) {
        setOffers(prev => prev.filter(o => o.id !== offerId));
        addLog('success', `Deleted offer ${offerId}.`);
        return;
      }
      const response = await authFetch(`/offers/${offerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setOffers(prev => prev.filter(o => o.id !== offerId));
        addLog('success', `Offer deleted.`);
      }
    } catch (err) {
      addLog('error', `Error deleting offer: ${err.message}`);
    }
  };

  // API Call: Billing
  const fetchBilling = async () => {
    setIsLoadingBilling(true);
    try {
      const [plansRes, subRes] = await Promise.all([
        authFetch('/billing/plans', { headers: { 'Authorization': `Bearer ${token}` } }),
        authFetch('/billing/subscription', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (plansRes.ok) {
        const pj = await plansRes.json();
        setBillingPlans(Array.isArray(pj) ? pj : Array.isArray(pj?.data) ? pj.data : Array.isArray(pj?.plans) ? pj.plans : []);
      }
      if (subRes.ok) {
        const sj = await subRes.json();
        setBillingSubscription((sj && typeof sj === 'object' && !sj.data && !sj.subscription) ? sj : (sj?.data ?? sj?.subscription ?? sj));
      }
    } catch (err) {
      addLog('error', `Billing fetch error: ${err.message}`);
    } finally {
      setIsLoadingBilling(false);
    }
  };

  // Tone Simulator
  const runSimulator = (e) => {
    e.preventDefault();
    if (!simulatorQuery.trim()) return;
    setIsSimulatorLoading(true);
    const p = editedTenant.ai_personality || 'friendly';
    setTimeout(() => {
      let reply = '';
      if (p === 'luxury') {
        reply = `Greetings. In response to your inquiry regarding "${simulatorQuery}", allow me to provide our finest white-glove solution designed for distinguished clientele.`;
      } else if (p === 'professional') {
        reply = `Thank you for contacting support. Regarding "${simulatorQuery}", our records confirm standard operating guidelines apply.`;
      } else if (p === 'casual') {
        reply = `Hey there! Got your question about "${simulatorQuery}". Super easy — we've totally got you covered!`;
      } else {
        reply = `Hi! Thanks for asking about "${simulatorQuery}". I am happy to help you with all details right away!`;
      }
      setSimulatorReply(reply);
      setIsSimulatorLoading(false);
      addLog('info', `Simulated tone test for personality: ${p}`);
    }, 500);
  };

  // ── Token persistence ──
  // refresh_token must NOT live in localStorage; use sessionStorage (cleared on tab close).
  const saveTokens = (data) => {
    const access = data.access_token || '';
    const refresh = data.refresh_token || '';
    setToken(access);
    if (refresh) setRefreshToken(refresh);
    if (access) sessionStorage.setItem('speako_access', access);
    if (refresh) sessionStorage.setItem('speako_refresh', refresh);
  };

  const getStoredAccess = () => token || sessionStorage.getItem('speako_access') || '';

  const clearTokens = () => {
    sessionStorage.removeItem('speako_access');
    sessionStorage.removeItem('speako_refresh');
  };

  // POST /auth/refresh → rotate tokens (old refresh token revoked)
  const refreshTokens = async () => {
    const rt = refreshToken || sessionStorage.getItem('speako_refresh');
    if (!rt) return false;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: rt })
      });
      if (response.ok) {
        saveTokens(await response.json());
        addLog('success', 'Access token refreshed.');
        return true;
      }
    } catch (err) {
      addLog('error', `Token refresh failed: ${err.message}`);
    }
    return false;
  };

  // 401 interceptor: every merchant call goes through here → refresh once, then replay.
  const authFetch = async (path, options = {}, retry = true) => {
    if (isSandboxMode) return { ok: false, status: 999, sandbox: true };
    const headers = { ...(options.headers || {}), 'Authorization': `Bearer ${getStoredAccess()}` };
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    if (response.status === 401 && retry) {
      const refreshed = await refreshTokens();
      if (refreshed) return authFetch(path, options, false);
    }
    return response;
  };

  // ── Primary login: POST /auth/email-login { email } → { access_token, refresh_token } ──
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    // client-side throttle: max 3 login attempts per minute
    const now = Date.now();
    const { firstAt } = loginAttemptsRef.current;
    if (firstAt && now - firstAt > 60000) loginAttemptsRef.current = { count: 0, firstAt: now };
    if (loginAttemptsRef.current.count >= 3) {
      const wait = Math.ceil((60000 - (now - loginAttemptsRef.current.firstAt)) / 1000);
      setAuthError(`Too many login attempts. Try again in ${wait}s.`);
      return;
    }
    loginAttemptsRef.current = { count: loginAttemptsRef.current.count + 1, firstAt: loginAttemptsRef.current.firstAt || now };
    setIsLoggingIn(true);
    setAuthError('');
    addLog('info', `Email login for ${loginEmail}...`);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/email-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim() })
      });
      if (response.ok) {
        const data = await response.json();
        saveTokens(data);
        setIsAuthenticated(true);
        addLog('success', `Authenticated for ${loginEmail}. sub (tenant id) scopes all data.`);
        fetchTenantData(data.access_token);
      } else if (response.status === 401) {
        setAuthError('Merchant not found or inactive. Check the email and try again.');
      } else if (response.status === 422) {
        setAuthError('Invalid email format.');
      } else {
        const errData = await response.json().catch(() => ({}));
        setAuthError(errData.detail || 'Login failed. Please try again.');
      }
    } catch (err) {
      addLog('error', `Email login failed: ${err.message}`);
      setAuthError('Cannot reach API. Verify CORS / backend URL, or use the sandbox preview below.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Auth Submit → email-login
  const handleLogin = (e) => {
    e.preventDefault();
    return handleEmailLogin(e);
  };

  const handleSandboxEnter = () => {
    setIsSandboxMode(true);
    localStorage.setItem('speako_sandbox', 'true');
    setIsAuthenticated(true);
    addLog('success', 'Logged in via Sandbox Mode (Demo). Simulation active.');
  };

  const handleLogout = () => {
    if (!isSandboxMode && refreshToken) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      }).catch(() => {});
    }
    clearTokens();
    localStorage.removeItem('speako_token');
    localStorage.removeItem('speako_sandbox');
    setIsAuthenticated(false);
    setIsSandboxMode(false);
    setToken('');
    setRefreshToken('');
    addLog('info', 'Logged out.');
  };

  // Login Screen Render
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <span className="sidebar-logo-box">V</span>
            <span style={{ fontSize: '22px', fontWeight: '800', marginLeft: '12px', color: 'var(--text-main)' }}>VALUE ANALYTICS</span>
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '18px', color: 'var(--text-main)' }}>Merchant Portal Login</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
            Access real-time voice analytics, order pipelines, and assistant configurations.
          </p>

          {authError && (
            <div style={{ backgroundColor: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Store Owner Email</label>
              <input type="email" className="form-control" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                Logs in via <code>POST /auth/email-login</code> — no password needed.
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }} disabled={isLoggingIn}>
              {isLoggingIn ? 'Working...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <button onClick={handleSandboxEnter} className="btn btn-secondary" style={{ width: '100%' }}>
            Launch Demo Sandbox (Instant Preview)
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Main Render
  return (
    <div className="app-container">
      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <a href="#" className="sidebar-logo">
            <span className="sidebar-logo-box">S</span>
            {!sidebarCollapsed && <span>SPEAKO AI</span>}
          </a>
          <button className="sidebar-toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 19l-7-7 7-7" />}
            </svg>
          </button>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-nav-section">
            {!sidebarCollapsed && <div className="sidebar-nav-title">Core Menu</div>}
            
            <div className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); refreshDashboard(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">📊</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Dashboard</span>}
              </div>
            </div>

            <div className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setOrderStatusFilter(''); fetchOrders(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">📦</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Orders & Sales</span>}
              </div>
            </div>

            <div className={`sidebar-item ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => { setActiveTab('tickets'); setTicketStatusFilter('open'); fetchTickets(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">🎫</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Support Tickets</span>}
              </div>
              {!sidebarCollapsed && <span className="sidebar-badge">2</span>}
            </div>

            <div className={`sidebar-item ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => { setActiveTab('offers'); fetchOffers(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">🏷️</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Promotions & Offers</span>}
              </div>
            </div>

            <div className={`sidebar-item ${activeTab === 'conversations' ? 'active' : ''}`} onClick={() => { setActiveTab('conversations'); fetchConversations(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">💬</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Conversations & Transcripts</span>}
              </div>
              {!sidebarCollapsed && <span className="sidebar-badge">8</span>}
            </div>
          </div>

          <div className="sidebar-nav-section">
            {!sidebarCollapsed && <div className="sidebar-nav-title">AI Assistant</div>}
            
            <div className={`sidebar-item ${activeTab === 'ai-config' ? 'active' : ''}`} onClick={() => setActiveTab('ai-config')}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">🤖</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Persona & Voice Config</span>}
              </div>
            </div>
          </div>

          <div className="sidebar-nav-section">
            {!sidebarCollapsed && <div className="sidebar-nav-title">Store & Setup</div>}
            
            <div className={`sidebar-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => { setActiveTab('billing'); fetchBilling(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">💳</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Billing & Usage</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          {!sidebarCollapsed ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>v1.0 {isSandboxMode ? '(Sandbox)' : '(Live)'}</span>
              <span style={{ cursor: 'pointer', color: 'var(--danger)', fontWeight: '700' }} onClick={handleLogout}>Log out</span>
            </div>
          ) : (
            <span style={{ cursor: 'pointer' }} onClick={handleLogout} title="Logout">🚪</span>
          )}
        </div>
      </aside>

      {/* ── Main Panel Wrapper ── */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <header className="topnav" style={{ height: '64px', padding: '0 32px' }}>
          <div className="topnav-left" style={{ gap: '16px' }}>
            <h2 className="topnav-title" style={{ fontSize: '15px', letterSpacing: '0.05em', fontWeight: '700' }}>SPEAKO</h2>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              Store: Cartify Shopify
            </span>
          </div>

          <div className="topnav-actions" style={{ gap: '16px' }}>
            <button className="pill-filter" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '12px', padding: '6px 12px' }}>
              Last 30 Days ∨
            </button>
            
            <div className="topnav-search" style={{ width: '240px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🔍</span>
              <input type="text" placeholder="Search..." style={{ fontSize: '13px' }} />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>⌘K</span>
            </div>

            <button className="topnav-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Theme" style={{ background: 'transparent', border: 'none' }}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            <button className="topnav-btn" onClick={() => alert('Notifications')} title="Notifications" style={{ background: 'transparent', border: 'none' }}>
              🔔
              <span className="topnav-btn-badge" style={{ background: 'var(--primary)' }}></span>
            </button>

            <div className="avatar" style={{ width: '32px', height: '32px', cursor: 'pointer', background: 'var(--primary-gradient)', fontSize: '12px' }}>
              MB
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="content-area">
          {/* Dismissible banner */}
          {showAlert && isSandboxMode && (
            <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px' }}>
                <span style={{ fontSize: '18px' }}>✨</span>
                <span>
                  <strong>Purple Obsidian Theme Active</strong>: Running in interactive demonstration mode. All cards, charts, gauges, and settings are live.
                </span>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }} onClick={() => setShowAlert(false)}>×</button>
            </div>
          )}

          {/* ── TAB: DASHBOARD OVERVIEW (Stripe/Vercel Aesthetic) ── */}
          {activeTab === 'dashboard' && (
            <div style={{ padding: '8px 0' }}>
              {/* ── ROW 1: TOP KPI STAT CARDS (grid-cols-4 gap-6) ── */}
              <div className="dashboard-grid-4">
                {/* KPI 1: ARIA REVENUE */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>Aria Revenue</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '30px', fontWeight: '600', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                      {dmRev.total_amount != null ? `${tenant.currency_symbol}${toMoney(dmRev.total_amount)}` : (isLoadingDashboard ? '—' : `${tenant.currency_symbol}0.00`)}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                      {dmRev.lift_percentage != null ? `↑ ${toPct(dmRev.lift_percentage)}` : '—'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {dmRev.share_of_sales_percentage != null ? `${toPct(dmRev.share_of_sales_percentage)} of total sales` : '—'}
                  </div>
                </div>

                {/* KPI 2: ARIA CONVERSIONS */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>Aria Orders</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '30px', fontWeight: '600', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                      {dmConv.order_count != null ? Number(dmConv.order_count).toLocaleString() : (isLoadingDashboard ? '—' : '0')}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                      {dmConv.lift_percentage != null ? `${toPct(dmConv.lift_percentage)} Lift` : '—'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {dmConv.avg_order_value != null ? `${tenant.currency_symbol}${toMoney(dmConv.avg_order_value)} Avg Order Value` : '—'}
                  </div>
                </div>

                {/* KPI 3: VOICE VS TEXT SPLIT */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>Voice vs Text</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '30px', fontWeight: '600', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                      {voiceSplit != null ? `${toPct(voiceSplit)} / ${toPct(textSplit)}` : (isLoadingDashboard ? '—' : '—')}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {avgTurnSeconds != null ? `Avg Voice Turn: ${Math.round(Number(avgTurnSeconds))}s` : '—'}
                  </div>
                </div>

                {/* KPI 4: PLAN USAGE & CREDITS */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>Plan Usage</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <DonutUsageChart used={creditsUsed} total={creditsTotal} label={planName || 'Credits'} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {creditsUsed != null && creditsTotal != null ? `${planPct}% Used` : '—'}{planName ? ` • ${planName}` : ''}
                  </div>
                </div>
              </div>

              {/* ── ROW 2: PRIMARY PERFORMANCE HUB (grid-cols-12 gap-6) ── */}
              <div className="dashboard-grid-12">
                {/* Left Card: Revenue & Dialogue Trend (col-span-8) */}
                <div className="card col-span-8">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Revenue & Dialogue Volume</span>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span> Sales ($)</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></span> Turns (#)</span>
                    </div>
                  </div>
                  <AriaSalesTrendChart trend={dmTrend} />
                </div>

                {/* Right Card: Live Storefront Pulse (col-span-4) */}
                <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Live Storefront Pulse</span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: isStatusOk ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isStatusOk ? '#10b981' : '#ef4444', boxShadow: `0 0 8px ${isStatusOk ? '#10b981' : '#ef4444'}` }}></span> Live
                    </span>
                  </div>

                  <div className="pulse-grid" style={{ flex: 1, marginTop: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Shoppers</div>
                      <div style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>{dmPulse.active_shoppers ?? 34}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Voice Streams</div>
                      <div style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>{dmPulse.voice_streams ?? 6}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Managed Carts</div>
                      <div style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>{dmPulse.managed_carts ?? 18}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pending Checkouts</div>
                      <div style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>{dmPulse.pending_checkouts ?? 5}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {statusText}
                  </div>
                </div>
              </div>

              {/* ── ROW 3: SECONDARY OPERATIONAL DESK (grid-cols-12 gap-6) ── */}
              <div className="dashboard-grid-12">
                {/* Left Card: Top Converted Products (col-span-6) */}
                <div className="card col-span-6">
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '24px' }}>Top Converted Products</div>
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                      <tr>
                        <th style={{ paddingBottom: '12px', fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                        <th style={{ paddingBottom: '12px', fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Promo</th>
                        <th style={{ paddingBottom: '12px', fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Qty</th>
                        <th style={{ paddingBottom: '12px', fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dmProducts.length ? (
                        shownProducts.map((p, idx, arr) => {
                        const name = p.product_name || p.title || p.product_title || p.name || p.product || '—';
                        const qty = p.qty_sold ?? p.quantity ?? p.qty ?? p.units_sold ?? p.promo_qty ?? p.count ?? 0;
                        const rev = p.revenue ?? p.total_revenue ?? p.sales ?? 0;
                        const promoRaw = p.promo_badge ?? p.offer_title ?? p.offer_name ?? p.badge ?? p.promo ?? p.offer ?? p.promo_title;
                        const promoQty = p.promo_qty ?? p.promo_quantity ?? (promoRaw && typeof promoRaw === 'object' ? (promoRaw.qty ?? promoRaw.quantity) : null);
                        let badge = '';
                        if (promoRaw != null) {
                          badge = (typeof promoRaw === 'object') ? (promoRaw.title || promoRaw.name || promoRaw.label || promoRaw.badge || '') : String(promoRaw);
                        }
                        return (
                        <tr key={idx} style={{ borderBottom: idx !== arr.length - 1 ? '1px solid rgba(255, 255, 255, 0.03)' : 'none' }}>
                          <td style={{ padding: '16px 0', fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>{name}</td>
                          <td style={{ padding: '16px 0', textAlign: 'center' }}>
                            {badge || promoQty != null ? (
                              <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                {badge}{promoQty != null && badge ? ` · ` : ''}{promoQty != null ? `×${Number(promoQty).toLocaleString()}` : ''}
                              </span>
                            ) : <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>—</span>}
                          </td>
                          <td style={{ padding: '16px 0', textAlign: 'right', fontSize: '13px', color: 'var(--text-muted)' }}>{Number(qty).toLocaleString()}</td>
                          <td style={{ padding: '16px 0', textAlign: 'right', fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>
                            {tenant.currency_symbol}{toMoney(rev, '0.00')}
                          </td>
                        </tr>
                        );
                      })
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ padding: '24px 0', textAlign: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
                            No product data available yet.
                          </td>
                        </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls page={productPage} pageCount={productPageCount} onPageChange={setProductPage} />
                </div>

                {/* Right Card: Support Escalations & Tickets (col-span-6) */}
                <div className="card col-span-6">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Support Escalations</span>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span><strong style={{ color: '#10b981' }}>{escAuto}</strong> Auto-Resolved</span>
                      <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                      <span><strong style={{ color: 'var(--text-main)' }}>{escEscalated}</strong> Escalated</span>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                      <tr>
                        <th style={{ paddingBottom: '12px', fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket</th>
                        <th style={{ paddingBottom: '12px', fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer & Issue</th>
                        <th style={{ paddingBottom: '12px', fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Heat</th>
                        <th style={{ paddingBottom: '12px', fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dmTickets.length ? (
                        shownTickets.map((t, idx, arr) => {
                        const ticket = {
                          id: t.ticket_id || t.ticket_number || t.id || t.tk_number || '—',
                          name: t.customer_name || t.customer || t.name || '—',
                          issue: t.issue_type || t.issue || t.category || t.issue_summary || '—',
                          heat: t.heat_rating || t.heat || 'Cold',
                          heatColor: t.heat_color_hex || { Hot: '#ef4444', Warm: '#f59e0b', Cold: '#3b82f6' }[t.heat_rating || t.heat || 'Cold'] || '#3b82f6',
                          transcript: t.transcript_snippet || t.snippet || t.transcript || 'No transcript available.'
                        };
                        return (
                        <tr key={idx} style={{ borderBottom: idx !== arr.length - 1 ? '1px solid rgba(255, 255, 255, 0.03)' : 'none' }}>
                          <td style={{ padding: '16px 0', fontSize: '13px', fontWeight: '500', color: 'var(--primary)' }}>
                            <a href={`#${ticket.id}`} onClick={(e) => { e.preventDefault(); setViewTicketModal(ticket); }} style={{ color: 'inherit', textDecoration: 'none' }}>{ticket.id}</a>
                          </td>
                          <td style={{ padding: '16px 0', fontSize: '13px', color: 'var(--text-main)' }}>
                            {ticket.name} <span style={{ color: 'var(--text-muted)' }}>• {ticket.issue}</span>
                          </td>
                          <td style={{ padding: '16px 0' }}>
                            <span style={{ fontSize: '11px', fontWeight: '500', color: ticket.heatColor }}>{ticket.heat}</span>
                          </td>
                          <td style={{ padding: '16px 0', textAlign: 'right' }}>
                            <button 
                              onClick={() => setTakeoverModal(ticket)}
                              style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}
                            >
                              Take Over
                            </button>
                          </td>
                        </tr>
                        );
                      })
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ padding: '24px 0', textAlign: 'center', fontSize: '12px', color: 'var(--text-light)' }}>
                            No recent tickets.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  </div>
                  <PaginationControls page={ticketPage} pageCount={ticketPageCount} onPageChange={setTicketPage} />
                </div>
              </div>

              {/* ── TICKET TRANSCRIPT MODAL ── */}
              {viewTicketModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                  <div className="card" style={{ maxWidth: '550px', width: '100%', border: '1px solid var(--primary)' }}>
                    <div className="card-header">
                      <span className="card-title">🎙️ Ticket Transcript: {viewTicketModal.id} ({viewTicketModal.name})</span>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }} onClick={() => setViewTicketModal(null)}>×</button>
                    </div>

                    <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '12px', borderRadius: '8px', margin: '12px 0', fontSize: '12px' }}>
                      <div><strong>Customer:</strong> {viewTicketModal.name}</div>
                      <div><strong>Issue Type:</strong> {viewTicketModal.issue}</div>
                      <div><strong>Heat Rating:</strong> <span style={{ color: viewTicketModal.heatColor }}>{viewTicketModal.heat}</span></div>
                    </div>

                    <div style={{ fontSize: '12.5px', color: 'var(--text-main)', background: 'var(--card-bg-solid)', padding: '14px', borderRadius: '8px', border: '1px solid var(--card-border)', whiteSpace: 'pre-line', maxHeight: '180px', overflowY: 'auto' }}>
                      {viewTicketModal.transcript}
                    </div>

                    {/* Audio Player Simulation */}
                    <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>▶️ Voice Recording (0:42)</span>
                      </span>
                      <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>Waveform Active</span>
                    </div>

                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => setViewTicketModal(null)}>
                      Close Transcript
                    </button>
                  </div>
                </div>
              )}

              {/* ── LIVE CHAT TAKEOVER MODAL ── */}
              {takeoverModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                  <div className="card" style={{ maxWidth: '550px', width: '100%', border: '1px solid var(--secondary)' }}>
                    <div className="card-header">
                      <span className="card-title">💬 Take Over Live Session: {takeoverModal.id}</span>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }} onClick={() => setTakeoverModal(null)}>×</button>
                    </div>

                    <div style={{ fontSize: '12.5px', color: 'var(--text-main)', marginBottom: '14px' }}>
                      You are taking over live communication with <strong>{takeoverModal.name}</strong>. Aria will pause automated responses for this session.
                    </div>

                    <textarea 
                      className="form-control" 
                      rows="3" 
                      value={takeoverMessage} 
                      onChange={(e) => setTakeoverMessage(e.target.value)}
                      placeholder="Type live message to send directly to shopper..."
                    />

                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1 }}
                        onClick={() => {
                          addLog('success', `Human agent took over ticket ${takeoverModal.id}. Message sent to shopper.`);
                          alert(`Message sent to ${takeoverModal.name}! Takeover active.`);
                          setTakeoverModal(null);
                          setTakeoverMessage('');
                        }}
                      >
                        Send Agent Reply
                      </button>
                      <button className="btn btn-secondary" onClick={() => setTakeoverModal(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: MESSAGES / CONVERSATIONS ── */}
          {activeTab === 'conversations' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Voice & Text Transcripts</h1>
                  <p className="page-subtitle">Inspect historical customer sessions and turn-by-turn AI conversations.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => fetchConversations()}>🔄 Refresh Sessions</button>
              </div>

              <div className="conversations-layout">
                <div className="sessions-list">
                  {isLoadingConversations ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading sessions...</div>
                  ) : conversations.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No sessions recorded.</div>
                  ) : (
                    conversations.map(c => (
                      <div 
                        key={c.id} 
                        className={`session-item ${selectedConversation?.session_id === c.session_id ? 'active' : ''}`}
                        onClick={() => { setSelectedConversation(c); fetchChatHistory(c.session_id); }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{c.session_id}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleTimeString()}</span>
                          <span className="badge badge-purple">{c.channel}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-pane">
                  {selectedConversation ? (
                    <>
                      <div className="chat-pane-header">
                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Transcript: {selectedConversation.session_id}</span>
                      </div>
                      
                      <div className="chat-messages">
                        {isLoadingChat ? (
                          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading messages...</div>
                        ) : (
                          chatMessages.map(m => (
                            <div key={m.id} className={`message-bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                              <div>{m.content}</div>
                              <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>{m.created_at || '11:02 AM'}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '10px' }}>
                      <span style={{ fontSize: '32px' }}>💬</span>
                      <span>Select a conversation session to read the full dialogue.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: ORDERS ── */}
          {activeTab === 'orders' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Store Orders</h1>
                  <p className="page-subtitle">Track orders created via Aria voice assistant. Filter by fulfilment status.</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchOrders}>🔄 Refresh Orders</button>
              </div>

              <div className="card">
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {['', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button
                      key={s}
                      className={`btn ${orderStatusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => { setOrderStatusFilter(s); setOrderPage(0); }}
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      {s === '' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>

                {isLoadingOrders ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders match this status.</div>
                ) : (
                  <>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Source</th>
                          <th>Total</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .filter(o => !orderStatusFilter || o.status === orderStatusFilter)
                          .slice(orderPage * PAGE_SIZE, (orderPage + 1) * PAGE_SIZE)
                          .map(o => (
                            <tr key={o.id}>
                              <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{o.id.slice(0, 8)}</td>
                              <td>{o.customer_email || 'guest@store.com'}</td>
                              <td>
                                {o.source === 'agent' ? <span className="badge badge-cyan">AI</span> : <span className="badge">Store</span>}
                              </td>
                              <td style={{ fontWeight: '700' }}>{o.currency || tenant.currency_symbol}{(o.total || 0).toFixed(2)}</td>
                              <td>{new Date(o.created_at).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${o.status === 'paid' || o.status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                                  {o.status}
                                </span>
                              </td>
                              <td>
                                <select
                                  className="form-control"
                                  style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="paid">Paid</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <PaginationControls page={orderPage} pageCount={Math.max(1, Math.ceil(orders.filter(o => !orderStatusFilter || o.status === orderStatusFilter).length / PAGE_SIZE))} onPageChange={setOrderPage} />
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: TICKETS ── */}
          {activeTab === 'tickets' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Support Tickets Inbox</h1>
                  <p className="page-subtitle">Escalated inquiries auto-assigned when Aria identifies complex requests.</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchTickets}>🔄 Refresh Inbox</button>
              </div>

              <div className="card">
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {['open', 'in_progress', 'resolved'].map(s => (
                    <button
                      key={s}
                      className={`btn ${ticketStatusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => { setTicketStatusFilter(s); setExpandedTicket(null); setTicketsTabPage(0); setTimeout(fetchTickets, 0); }}
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      {s.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>

                {isLoadingTickets ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>No {ticketStatusFilter} tickets right now.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {tickets.slice(ticketsTabPage * PAGE_SIZE, (ticketsTabPage + 1) * PAGE_SIZE).map(t => (
                      <div key={t.id} style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', background: 'rgba(139, 92, 246, 0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{t.ticket_number || t.id.slice(0, 8)}</strong>
                            <span className="badge badge-purple">{t.priority} priority</span>
                            <span className="badge badge-cyan">{t.status.replace('_', ' ')}</span>
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{new Date(t.created_at).toLocaleString()}</span>
                        </div>

                        <p style={{ fontSize: '13.5px', color: 'var(--text-main)', margin: '10px 0' }}>{t.issue_summary}</p>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Customer: {t.customer_name} ({t.customer_email})</div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                          <select
                            className="form-control"
                            style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                            value={t.status}
                            onChange={(e) => handleUpdateTicket(t.id, { status: e.target.value })}
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '12px' }} onClick={() => setExpandedTicket(expandedTicket === t.id ? null : t.id)}>
                            {expandedTicket === t.id ? 'Close Notes' : 'Internal Notes'}
                          </button>
                        </div>

                        {expandedTicket === t.id && (
                          <div style={{ marginTop: '14px', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
                            {t.notes && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Saved Note: {t.notes}</div>}
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                className="form-control"
                                placeholder="Add team note..."
                                value={ticketNoteInput}
                                onChange={(e) => setTicketNoteInput(e.target.value)}
                              />
                              <button className="btn btn-primary" onClick={() => { if (!ticketNoteInput.trim()) return; handleUpdateTicket(t.id, { notes: ticketNoteInput.trim() }); setTicketNoteInput(''); }}>
                                Save Note
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <PaginationControls page={ticketsTabPage} pageCount={Math.max(1, Math.ceil(tickets.length / PAGE_SIZE))} onPageChange={setTicketsTabPage} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: OFFERS ── */}
          {activeTab === 'offers' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Active Promotions & Deals</h1>
                  <p className="page-subtitle">Manage discount rules surfaced by Aria during customer conversations.</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchOffers}>🔄 Refresh Offers</button>
              </div>

              <div className="grid-cols-2" style={{ alignItems: 'start' }}>
                <div className="card">
                  <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Active Deals ({offers.length})</h2>
                  {offers.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No promotional offers found. Create one using the form.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {offers.map(o => (
                        <div key={o.id} style={{ border: '1px solid var(--card-border)', borderRadius: '10px', padding: '14px', background: 'rgba(139, 92, 246, 0.05)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{o.title}</strong>
                                <span className={`badge ${o.is_active ? 'badge-success' : 'badge-warning'}`}>{o.is_active ? 'Active' : 'Paused'}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Product: {o.product_name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700', marginTop: '4px' }}>
                                {o.discount_percent ? `${o.discount_percent}% Discount` : `${tenant.currency_symbol}${o.discount_amount} Off`}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => handleToggleOffer(o)}>
                                {o.is_active ? 'Pause' : 'Activate'}
                              </button>
                              <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => handleDeleteOffer(o.id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <OfferCreateForm onCreate={handleCreateOffer} />
              </div>
            </div>
          )}

          {/* ── TAB: AI PERSONALITY CONFIG ── */}
          {activeTab === 'ai-config' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Aria AI Assistant Configuration</h1>
                  <p className="page-subtitle">Configure tone presets, greeting messages, and corporate store info.</p>
                </div>
              </div>

              <div className="grid-cols-2">
                <form onSubmit={handleSaveSettings} className="card">
                  <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Personality Controls</h2>
                  
                  <div className="form-group">
                    <label>Tone Preset</label>
                    <select className="form-control" value={editedTenant.ai_personality || 'friendly'} onChange={(e) => setEditedTenant({ ...editedTenant, ai_personality: e.target.value })}>
                      <option value="friendly">Friendly & Helpful (Recommended)</option>
                      <option value="professional">Formal & Direct</option>
                      <option value="luxury">Luxury & Premium</option>
                      <option value="casual">Casual & Relaxed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Spoken Greeting Phrase</label>
                    <textarea 
                      className="form-control"
                      value={editedTenant.greeting_message || ''}
                      onChange={(e) => setEditedTenant({ ...editedTenant, greeting_message: e.target.value })}
                      placeholder="Hi! I am Aria, your shopping assistant."
                      maxLength={250}
                    />
                  </div>

                  <div className="form-group">
                    <label>Support Email Address</label>
                    <input type="email" className="form-control" value={editedTenant.support_email || ''} onChange={(e) => setEditedTenant({ ...editedTenant, support_email: e.target.value })} />
                  </div>

                  <div className="form-group">
                    <label>Support Phone</label>
                    <input type="text" className="form-control" value={editedTenant.support_phone || ''} onChange={(e) => setEditedTenant({ ...editedTenant, support_phone: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
                    {saveSuccess && <span style={{ color: 'var(--success)', alignSelf: 'center', fontSize: '13px' }}>✓ Saved successfully</span>}
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save AI Personality'}
                    </button>
                  </div>
                </form>

                {/* Tone Simulator */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Interactive Tone Simulator</h2>
                  
                  <div style={{ flex: 1, backgroundColor: 'rgba(7, 6, 17, 0.5)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    {simulatorReply ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="message-bubble user">{simulatorQuery}</div>
                        <div className="message-bubble assistant">
                          <strong>Aria ({editedTenant.ai_personality || 'friendly'}):</strong><br/>
                          {simulatorReply}
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                        Type a question below to test how Aria responds using the selected tone.
                      </div>
                    )}
                  </div>

                  <form onSubmit={runSimulator} style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-control" placeholder="Ask Aria a question..." value={simulatorQuery} onChange={(e) => setSimulatorQuery(e.target.value)} />
                    <button type="submit" className="btn btn-primary" disabled={isSimulatorLoading || !simulatorQuery.trim()}>
                      {isSimulatorLoading ? 'Testing...' : 'Simulate'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: GENERAL SETTINGS ── */}
          {activeTab === 'settings' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">General Store Settings</h1>
                  <p className="page-subtitle">Configure business currency, return policies, and brand pitch text.</p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="card" style={{ maxWidth: '780px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Store Name</label>
                    <input type="text" className="form-control" value={editedTenant.name} onChange={(e) => setEditedTenant({ ...editedTenant, name: e.target.value })} required />
                  </div>

                  <div className="form-group">
                    <label>Currency Format</label>
                    <select className="form-control" value={editedTenant.currency_symbol || '$'} onChange={(e) => setEditedTenant({ ...editedTenant, currency_symbol: e.target.value })}>
                      <option value="$">US Dollar ($)</option>
                      <option value="₹">Indian Rupee (₹)</option>
                      <option value="€">Euro (€)</option>
                      <option value="£">British Pound (£)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Store Pitch / Description</label>
                  <textarea className="form-control" value={editedTenant.about_text || ''} onChange={(e) => setEditedTenant({ ...editedTenant, about_text: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Shipping Policy Details</label>
                  <textarea className="form-control" value={editedTenant.shipping_policy || ''} onChange={(e) => setEditedTenant({ ...editedTenant, shipping_policy: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Returns & Exchanges Policy</label>
                  <textarea className="form-control" value={editedTenant.returns_policy || ''} onChange={(e) => setEditedTenant({ ...editedTenant, returns_policy: e.target.value })} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
                  {saveSuccess && <span style={{ color: 'var(--success)', alignSelf: 'center', fontSize: '13px' }}>✓ Settings updated</span>}
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Updating...' : 'Commit Store Config'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB: BILLING & LIMITS ── */}
          {activeTab === 'billing' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Billing & Session Consumption</h1>
                  <p className="page-subtitle">Track your monthly active voice session quota and invoice receipts.</p>
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="card">
                  <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Current Subscription</h2>
                  {isLoadingBilling ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading subscription...</div>
                  ) : billingSubscription || dmPlan ? (
                    <>
                      {(() => {
                        const sub = billingSubscription || {};
                        const subUsed = sub.used ?? sub.sessions_used ?? sub.credits_used ?? sub.usage ?? null;
                        const subLimit = sub.limit ?? sub.session_limit ?? sub.credits_total ?? sub.quota ?? null;
                        const used = subUsed != null ? Number(subUsed) : (creditsUsed != null ? Number(creditsUsed) : null);
                        const limit = subLimit != null ? Number(subLimit) : (creditsTotal != null ? Number(creditsTotal) : null);
                        const plan = sub.plan ?? sub.name ?? sub.plan_name ?? planName ?? tenant.plan ?? 'Growth';
                        const desc = sub.description || `Includes ${limit != null ? `${limit.toLocaleString()} voice sessions` : 'monthly voice sessions'}/month, Shopify integration, and Aria AI assistant.`;
                        return (
                          <>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', textTransform: 'capitalize' }}>
                              {plan} Tier
                            </div>
                            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '10px 0 20px' }}>
                              {desc}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                              <DonutUsageChart used={used} total={limit} label={limit != null ? `${limit.toLocaleString()} Sessions` : 'Sessions'} />
                            </div>
                            {sub.renews_at && (
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px' }}>
                                Renews on {new Date(sub.renews_at).toLocaleDateString()}.
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {tenant.plan} Tier — no subscription returned yet.
                    </div>
                  )}
                  <div style={{ marginTop: '16px' }}>
                    <button className="btn btn-primary" onClick={() => alert('Redirecting to payment gateway...')}>
                      Upgrade Subscription
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Available Plans</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {billingPlans.length === 0 && !isLoadingBilling ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No plan options loaded.</div>
                    ) : (
                      billingPlans.map((plan, i) => (
                        <div key={plan.id || i} style={{ border: '1px solid var(--card-border)', borderRadius: '10px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', textTransform: 'capitalize' }}>{plan.name}</div>
                            {plan.features && <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>{plan.features.join(' · ')}</div>}
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>
                            {tenant.currency_symbol}{plan.price}{plan.interval ? `/${plan.interval}` : ''}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

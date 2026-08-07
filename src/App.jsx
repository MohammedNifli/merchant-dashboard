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

// ── Devices Circular Donut Chart (Image 2 style) ──
function DevicesDonutChart() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px' }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {/* Desktop Ring Segment (Purple) */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="120 240" strokeDashoffset="0" transform="rotate(-90 50 50)" />
          {/* Mobile Ring Segment (Magenta) */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="12" strokeDasharray="85 240" strokeDashoffset="-125" transform="rotate(-90 50 50)" />
          {/* Tablet Ring Segment (Orange) */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#f97316" strokeWidth="12" strokeDasharray="35 240" strokeDashoffset="-213" transform="rotate(-90 50 50)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</span>
          <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>545</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '11px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span> Desktop 49%
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }}></span> Mobile 36%
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }}></span> Tablet 15%
        </span>
      </div>
    </div>
  );
}

// ── Multi-Curve Site Traffic Chart (Image 2 style) ──
function SiteTrafficMultiChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (
    <div style={{ position: 'relative', width: '100%', height: '220px' }}>
      <svg viewBox="0 0 600 200" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid horizontal lines */}
        {[30, 80, 130, 180].map((y, idx) => (
          <line key={idx} x1="0" y1={y} x2="600" y2={y} stroke="rgba(139, 92, 246, 0.08)" strokeDasharray="3 3" />
        ))}

        {/* Purple Area Curve (New Visitors) */}
        <path d="M 0 150 C 50 140, 80 120, 120 110 C 160 100, 200 130, 250 80 C 300 30, 350 100, 400 40 C 450 20, 520 90, 600 50 L 600 190 L 0 190 Z" fill="url(#purpleGradient)" />
        <path d="M 0 150 C 50 140, 80 120, 120 110 C 160 100, 200 130, 250 80 C 300 30, 350 100, 400 40 C 450 20, 520 90, 600 50" fill="none" stroke="#a855f7" strokeWidth="3" />

        {/* Cyan Area Curve (Returning Visitors) */}
        <path d="M 0 170 C 60 160, 100 140, 150 130 C 200 120, 240 70, 300 110 C 360 150, 420 90, 470 70 C 530 50, 570 120, 600 100 L 600 190 L 0 190 Z" fill="url(#cyanGradient)" />
        <path d="M 0 170 C 60 160, 100 140, 150 130 C 200 120, 240 70, 300 110 C 360 150, 420 90, 470 70 C 530 50, 570 120, 600 100" fill="none" stroke="#06b6d4" strokeWidth="3" />

        {/* Hover Point Marker for Aug 16 */}
        <circle cx="400" cy="40" r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
        <line x1="400" y1="40" x2="400" y2="190" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 2" />
      </svg>

      {/* Hover Tooltip Card (Aug 16 - 680) */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '360px',
        background: 'rgba(18, 14, 36, 0.95)',
        border: '1px solid #a855f7',
        borderRadius: '8px',
        padding: '4px 10px',
        boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff' }}>680</div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Aug 16</div>
      </div>

      {/* Month Labels along X-Axis */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-light)' }}>
        {months.map((m, i) => <span key={i}>{m}</span>)}
      </div>
    </div>
  );
}

// ── Image 1 Inspired 9805 Radial Gauge Card ──
function Radial9805Gauge() {
  return (
    <div className="gauge-container">
      <div className="gauge-circle-wrap">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="6" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gaugeGrad)" strokeWidth="6" strokeDasharray="200 260" strokeLinecap="round" transform="rotate(-90 50 50)" />
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="gauge-circle-inner">
          <span className="gauge-value">9805</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</span>
        </div>
      </div>
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Throughput: 450</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Monitoring Overview</div>
      </div>
    </div>
  );
}

// ── Middle Time on Site Bar Chart (Image 2 style) ──
function MiddleTimeBarChart() {
  const bars = [
    { day: '30 Jan', h: 40 },
    { day: '31 Jan', h: 60 },
    { day: '1 Feb', h: 35 },
    { day: '2 Feb', h: 75 },
    { day: '3 Feb', h: 50 },
    { day: '4 Feb', h: 65 },
    { day: '5 Feb', h: 80 },
    { day: '6 Feb', h: 45 },
    { day: '7 Feb', h: 95, active: true },
    { day: '8 Feb', h: 70 },
    { day: '9 Feb', h: 55 },
    { day: '10 Feb', h: 60 },
    { day: '11 Feb', h: 85 },
    { day: '12 Feb', h: 40 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '220px', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, paddingBottom: '10px', position: 'relative' }}>
        {bars.map((b, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
            {b.active && (
              <div style={{
                position: 'absolute',
                top: `${100 - b.h - 22}%`,
                background: 'var(--card-bg-solid)',
                border: '1px solid var(--primary)',
                borderRadius: '6px',
                padding: '2px 6px',
                fontSize: '10.5px',
                fontWeight: '700',
                color: '#ffffff',
                boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)',
                whiteSpace: 'nowrap'
              }}>
                12.51 min
              </div>
            )}
            <div style={{
              width: '14px',
              height: `${b.h}%`,
              background: b.active ? 'linear-gradient(180deg, #c084fc 0%, #7c3aed 100%)' : 'rgba(139, 92, 246, 0.25)',
              borderRadius: '4px 4px 0 0',
              boxShadow: b.active ? '0 0 12px rgba(168, 85, 247, 0.5)' : 'none',
              transition: 'var(--transition)'
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', paddingTop: '6px', fontSize: '10px', color: 'var(--text-light)' }}>
        {bars.map((b, idx) => <span key={idx}>{b.day.split(' ')[0]}</span>)}
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
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authStep, setAuthStep] = useState('email'); // email | magic-sent | set-password
  const [magicLink, setMagicLink] = useState('');
  const [loginMode, setLoginMode] = useState('email'); // email | magic
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

  // Widget Visual Customizer state
  const [widgetColor, setWidgetColor] = useState('#8b5cf6');
  const [widgetPosition, setWidgetPosition] = useState('bottom-right');
  const [enableVoice, setEnableVoice] = useState(true);
  const [enableText, setEnableText] = useState(true);
  const [autoOpenMobile, setAutoOpenMobile] = useState(false);
  const [excludedPages, setExcludedPages] = useState('/cart\n/checkout');

  // Logs terminal state
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'info', text: 'Speako Merchant Dashboard Initialized (Obsidian Theme)' }
  ]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSyncingProducts, setIsSyncingProducts] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

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

  const [offers, setOffers] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);

  // Boot Token check
  useEffect(() => {
    const savedToken = sessionStorage.getItem('speako_access') || localStorage.getItem('speako_token');
    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('token');

    if (magicToken) {
      // Magic-link verification → /auth/magic-verify returns tokens (+ needs_password)
      verifyMagicToken(magicToken);
    } else if (savedToken) {
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

  const refreshDashboard = () => {
    fetchAnalytics();
    addLog('info', 'Refreshed dashboard metrics.');
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

  // API Call: Rotate Credentials
  const handleRotateCredentials = async () => {
    if (!window.confirm('Are you sure you want to regenerate key tokens? Old credentials will be invalidated.')) return;
    addLog('info', 'Rotating API tokens...');
    if (isSandboxMode) {
      const newKey = `cust_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;
      setEditedTenant(prev => ({ ...prev, custom_api_key: newKey }));
      addLog('success', `Generated new Custom API Lookup Key: ${newKey}`);
      return;
    }
    try {
      const response = await authFetch('/tenants/me/rotate-credentials', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEditedTenant(prev => ({ ...prev, ...data }));
        addLog('success', 'Store credentials rotated successfully.');
      } else {
        addLog('error', 'Credential rotation rejected by server.');
      }
    } catch (err) {
      addLog('error', `Rotate failed: ${err.message}`);
    }
  };

  // API Call: Sync Products
  const handleSyncProducts = async () => {
    setIsSyncingProducts(true);
    addLog('info', 'Triggering storefront product catalog synchronization...');
    try {
      if (isSandboxMode) {
        setTimeout(() => {
          setIsSyncingProducts(false);
          addLog('success', 'Simulated sync: 148 products & 312 variants refreshed.');
        }, 1200);
        return;
      }
      const response = await authFetch('/merchant/sync-products', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        addLog('success', 'Product re-sync initiated successfully.');
      } else {
        addLog('error', 'Re-sync API request rejected by server.');
      }
    } catch (err) {
      addLog('error', `Sync failed: ${err.message}`);
    } finally {
      setIsSyncingProducts(false);
    }
  };

  // API Call: Test Connection
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    addLog('info', 'Pinging storefront connection endpoint...');
    try {
      if (isSandboxMode) {
        setTimeout(() => {
          setIsTestingConnection(false);
          addLog('success', `Sandbox Test: Connected to ${tenant.platform} (${tenant.shopify_domain || 'mock.store'}) with 18ms latency.`);
        }, 800);
        return;
      }
      const response = await authFetch('/merchant/test-connection', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        addLog('success', `Connection status: ${data.message || 'Active'}`);
      } else {
        addLog('error', 'Connection test failed.');
      }
    } catch (err) {
      addLog('error', `Connection error: ${err.message}`);
    } finally {
      setIsTestingConnection(false);
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
      if (plansRes.ok) setBillingPlans(await plansRes.json());
      if (subRes.ok) setBillingSubscription(await subRes.json());
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

  // POST /auth/magic-request → one-time email link (dev_link shown if no SMTP)
  const requestMagicLink = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/magic-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        const data = await response.json();
        setMagicLink(data.dev_link || '');
        addLog('success', data.sent ? 'Magic link sent.' : 'Magic link ready (dev mode).');
        return true;
      }
      setAuthError('Magic link request failed.');
      return false;
    } catch (err) {
      addLog('error', `Magic link error: ${err.message}`);
      return false;
    }
  };

  // POST /auth/magic-verify {token}
  const verifyMagicToken = async (magicToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/magic-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: magicToken })
      });
      if (response.ok) {
        const data = await response.json();
        saveTokens(data);
        if (data.needs_password) {
          setAuthStep('set-password');
        } else {
          setIsAuthenticated(true);
          fetchTenantData(data.access_token);
        }
      } else {
        setAuthError('Magic link is invalid or expired.');
      }
    } catch (err) {
      setAuthError(`Magic verification error: ${err.message}`);
    }
  };

  // POST /auth/set-password {password, confirm_password}
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    if (!loginPassword || loginPassword.length < 8) {
      setAuthError('Password must be at least 8 characters.');
      setIsLoggingIn(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getStoredAccess()}` },
        body: JSON.stringify({ password: loginPassword, confirm_password: loginPassword })
      });
      if (response.ok || response.status === 204) {
        setIsAuthenticated(true);
        fetchTenantData(getStoredAccess());
      } else {
        const errData = await response.json();
        setAuthError(errData.detail || 'Could not set password.');
      }
    } catch (err) {
      setAuthError(`Set password error: ${err.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Auth Submit → email-login | magic-request | set-password
  const handleLogin = async (e) => {
    e.preventDefault();
    if (authStep === 'set-password') return handleSetPassword(e);
    if (loginMode === 'magic') {
      setIsLoggingIn(true);
      const sent = await requestMagicLink(loginEmail);
      setIsLoggingIn(false);
      if (sent) setAuthStep('magic-sent');
      return;
    }
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

            {authStep === 'set-password' && (
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Choose a Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }} disabled={isLoggingIn}>
              {isLoggingIn
                ? 'Working...'
                : authStep === 'set-password'
                  ? 'Set Password & Enter'
                  : loginMode === 'magic'
                    ? 'Send Magic Link'
                    : 'Sign In to Dashboard'}
            </button>
          </form>

          {authStep === 'magic-sent' && (
            <div style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
              A one-time login link has been sent to <strong>{loginEmail}</strong>. Check your inbox and paste the link here, or use the dev link below.
              {magicLink && (
                <a href={magicLink} style={{ display: 'block', marginTop: '8px', color: 'var(--primary)', fontWeight: '700', fontSize: '12px' }}>
                  Open dev magic link →
                </a>
              )}
            </div>
          )}

          {authStep !== 'set-password' && authStep !== 'magic-sent' && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: '12px' }}
              onClick={() => setLoginMode(loginMode === 'magic' ? 'email' : 'magic')}
            >
              {loginMode === 'magic' ? 'Use Email Login Instead' : 'Continue with Magic Link Instead'}
            </button>
          )}

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
            <span className="sidebar-logo-box">V</span>
            {!sidebarCollapsed && <span>VALUE ANALYTICS</span>}
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
                {!sidebarCollapsed && <span className="sidebar-item-label">Orders</span>}
              </div>
            </div>

            <div className={`sidebar-item ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => { setActiveTab('tickets'); setTicketStatusFilter('open'); fetchTickets(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">🎫</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Tickets</span>}
              </div>
              {!sidebarCollapsed && <span className="sidebar-badge">2</span>}
            </div>

            <div className={`sidebar-item ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => { setActiveTab('offers'); fetchOffers(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">🏷️</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Offers</span>}
              </div>
            </div>

            <div className={`sidebar-item ${activeTab === 'conversations' ? 'active' : ''}`} onClick={() => { setActiveTab('conversations'); fetchConversations(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">💬</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Messages</span>}
              </div>
              {!sidebarCollapsed && <span className="sidebar-badge">8</span>}
            </div>
          </div>

          <div className="sidebar-nav-section">
            {!sidebarCollapsed && <div className="sidebar-nav-title">AI Assistant</div>}
            
            <div className={`sidebar-item ${activeTab === 'ai-config' ? 'active' : ''}`} onClick={() => setActiveTab('ai-config')}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">🤖</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Personality Config</span>}
              </div>
            </div>

            <div className={`sidebar-item ${activeTab === 'widget' ? 'active' : ''}`} onClick={() => setActiveTab('widget')}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">🎨</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Widget Design</span>}
              </div>
            </div>
          </div>

          <div className="sidebar-nav-section">
            {!sidebarCollapsed && <div className="sidebar-nav-title">Store & Setup</div>}
            
            <div className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">⚙️</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">General Settings</span>}
              </div>
            </div>

            <div className={`sidebar-item ${activeTab === 'integrations' ? 'active' : ''}`} onClick={() => setActiveTab('integrations')}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">🔗</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Integrations</span>}
              </div>
            </div>

            <div className={`sidebar-item ${activeTab === 'diagnostics' ? 'active' : ''}`} onClick={() => setActiveTab('diagnostics')}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">🩺</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Diagnostics</span>}
              </div>
            </div>

            <div className={`sidebar-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => { setActiveTab('billing'); fetchBilling(); }}>
              <div className="sidebar-item-left">
                <span className="sidebar-item-icon">💳</span>
                {!sidebarCollapsed && <span className="sidebar-item-label">Billing & Limits</span>}
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
        <header className="topnav">
          <div className="topnav-left">
            <h2 className="topnav-title">Dashboard</h2>
            <div className="topnav-pills">
              <button className="pill-filter active">Overview ∨</button>
              <button className="pill-filter">Last week ∨</button>
            </div>
          </div>

          <div className="topnav-search">
            <span>🔍</span>
            <input type="text" placeholder="Search analytics, orders, clients..." />
            <span style={{ fontSize: '10px', color: 'var(--text-light)', border: '1px solid var(--card-border)', padding: '2px 6px', borderRadius: '4px' }}>⌘K</span>
          </div>

          <div className="topnav-actions">
            {/* Theme Toggle */}
            <button className="topnav-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Light/Dark Theme">
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            {/* Notification Bell */}
            <button className="topnav-btn" onClick={() => alert('No new notifications')} title="Notifications">
              🔔
              <span className="topnav-btn-badge"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="profile-dropdown">
              <div className="avatar">MB</div>
              <div className="profile-info">
                <span className="profile-name">Malena Bayer</span>
                <span className="profile-role">Super Admin</span>
              </div>
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

          {/* ── TAB: DASHBOARD OVERVIEW (Image 1 & 2 layout) ── */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Top Row: 4 KPI Cards with Sparklines */}
              <div className="grid-cols-4">
                {/* KPI 1: Sessions */}
                <div className="card metric-card">
                  <div className="metric-header">
                    <span className="metric-title">Sessions</span>
                    <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>Last week ∨</button>
                  </div>
                  <div className="metric-value-row">
                    <span className="metric-value">856</span>
                    <span className="metric-change negative">↓ -12%</span>
                  </div>
                  <div className="sparkline-wrapper">
                    <SparklineChart data={[40, 55, 30, 65, 80, 45, 90, 70, 856]} color="#f97316" gradientId="sparkOrange" />
                  </div>
                </div>

                {/* KPI 2: Users / Conversations */}
                <div className="card metric-card">
                  <div className="metric-header">
                    <span className="metric-title">Users</span>
                    <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>Last week ∨</button>
                  </div>
                  <div className="metric-value-row">
                    <span className="metric-value">{summary.total_conversations}</span>
                    <span className="metric-change positive">↑ +23%</span>
                  </div>
                  <div className="sparkline-wrapper">
                    <SparklineChart data={[30, 45, 60, 40, 75, 90, 80, 95, 523]} color="#ec4899" gradientId="sparkMagenta" />
                  </div>
                </div>

                {/* KPI 3: Time spent / Revenue */}
                <div className="card metric-card">
                  <div className="metric-header">
                    <span className="metric-title">Time spent / Revenue</span>
                    <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>Last week ∨</button>
                  </div>
                  <div className="metric-value-row">
                    <span className="metric-value">{tenant.currency_symbol}{(summary.total_revenue / 1000).toFixed(2)}k</span>
                    <span className="metric-change positive">↑ {(summary.conversion_rate * 100).toFixed(1)}% conv.</span>
                  </div>
                  <div className="sparkline-wrapper">
                    <SparklineChart
                      data={metrics.length ? metrics.map(m => m.revenue || 0) : [20, 35, 50, 40, 65, 55, 75, 85, 95]}
                      color="#06b6d4"
                      gradientId="sparkCyan"
                    />
                  </div>
                </div>

                {/* KPI 4: Devices Circular Donut Chart */}
                <div className="card metric-card">
                  <div className="metric-header">
                    <span className="metric-title">Devices</span>
                    <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>Today ∨</button>
                  </div>
                  <DevicesDonutChart />
                </div>
              </div>

              {/* ── AI ATTRIBUTION PANEL (from /analytics/agent-sold + agent-products + metrics) ── */}
              <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
                {/* AI Sold Stats */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">AI Attribution</span>
                    <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>Agent vs Store</button>
                  </div>
                  {agentSold ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Agent Revenue</div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)' }}>
                          {tenant.currency_symbol}{(agentSold.agent_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Agent Orders</div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>{agentSold.agent_order_count || 0}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Agent AOV</div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
                          {tenant.currency_symbol}{(agentSold.agent_aov || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Share of Revenue</div>
                        <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--secondary)' }}>
                          {((agentSold.share_of_revenue || 0) * 100).toFixed(1)}%
                        </div>
                      </div>
                      {agentSold.boost_percent != null && (
                        <div style={{ gridColumn: '1 / -1', fontSize: '12.5px', color: 'var(--success)' }}>
                          ↑ {tenant.currency_symbol}{(agentSold.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} total revenue boosted by {(agentSold.boost_percent * 100).toFixed(1)}% via AI
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '18px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                      {isLoadingAnalytics ? 'Loading AI attribution...' : 'No AI-attributed sales data yet. New orders must flow through the Storefront cart with source="agent".'}
                    </div>
                  )}
                </div>

                {/* Products sold via AI */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Products Sold via AI</span>
                    <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>Top sellers</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th style={{ textAlign: 'right' }}>Qty</th>
                          <th style={{ textAlign: 'right' }}>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agentProducts.length === 0 ? (
                          <tr><td colSpan="3" style={{ color: 'var(--text-muted)', padding: '16px' }}>No agent-sold products yet.</td></tr>
                        ) : (
                          agentProducts.map((p, i) => (
                            <tr key={p.product_id || i}>
                              <td style={{ fontWeight: '600' }}>{p.name}</td>
                              <td style={{ textAlign: 'right', color: 'var(--primary)', fontWeight: '700' }}>{p.quantity}</td>
                              <td style={{ textAlign: 'right', fontWeight: '700' }}>{tenant.currency_symbol}{(p.revenue || 0).toFixed(2)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Middle Row: Site Traffic & Real-time Data + Gauge / Pages Grid */}
              <div className="grid-cols-2">
                {/* Site Traffic & Real-time Multi-curve Chart */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Site traffic</span>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11.5px', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></span> New visitor
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }}></span> Returning visitor
                      </span>
                      <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>This year ∨</button>
                    </div>
                  </div>
                  <SiteTrafficMultiChart />

                  {/* Real-time Data breakdown row */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>Real-time Data</div>
                    <div className="realtime-list">
                      <div className="realtime-item">
                        <span className="realtime-label">Online visitors</span>
                        <div><span className="realtime-val">545</span><span className="realtime-max">max 685</span></div>
                      </div>
                      <div className="realtime-item">
                        <span className="realtime-label">New visitors</span>
                        <div><span className="realtime-val">421</span><span className="realtime-max">max 568</span></div>
                      </div>
                      <div className="realtime-item">
                        <span className="realtime-label">Sessions</span>
                        <div><span className="realtime-val">984</span><span className="realtime-max">max 1256</span></div>
                      </div>
                      <div className="realtime-item">
                        <span className="realtime-label">Page views</span>
                        <div><span className="realtime-val">134</span><span className="realtime-max">max 287</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Time on Site + Pages Ranked List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Circular Radial Gauge Card (Image 1 style) */}
                  <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <div>
                      <div className="card-title" style={{ marginBottom: '8px' }}>Monitoring Overview</div>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', maxWidth: '180px' }}>
                        Live transactions response time & throughput.
                      </p>
                      <div style={{ marginTop: '12px', fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                        6.07s <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>Response time</span>
                      </div>
                    </div>
                    <Radial9805Gauge />
                  </div>

                  {/* Middle Time on Site Bar Chart */}
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Middle time on site</span>
                      <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>Last 14 days ∨</button>
                    </div>
                    <MiddleTimeBarChart />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Pages Table & Social Traffic Donut */}
              <div className="grid-cols-2">
                {/* Traffic from Social */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Traffic from social</span>
                    <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>Last week ∨</button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0' }}>
                    <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                      <svg viewBox="0 0 100 100" width="100%" height="100%">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#f97316" strokeWidth="12" strokeDasharray="110 240" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="12" strokeDasharray="50 240" strokeDashoffset="-115" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="35 240" strokeDashoffset="-170" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="25 240" strokeDashoffset="-210" />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>1578</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '160px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }}></span> YouTube
                        </span>
                        <span style={{ fontWeight: '700' }}>710 / 45%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '160px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }}></span> Instagram
                        </span>
                        <span style={{ fontWeight: '700' }}>316 / 20%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '160px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span> LinkedIn
                        </span>
                        <span style={{ fontWeight: '700' }}>237 / 15%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '160px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></span> Facebook
                        </span>
                        <span style={{ fontWeight: '700' }}>174 / 11%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ranked Pages Table */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Pages breakdown</span>
                    <button className="pill-filter" style={{ padding: '2px 8px', fontSize: '10.5px' }}>Last month ∨</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Page Path</th>
                          <th>Trend</th>
                          <th style={{ textAlign: 'right' }}>Total Views</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { path: 'Homepage', views: '59 085', pct: 90 },
                          { path: 'Catalog', views: '58 325', pct: 85 },
                          { path: 'Products', views: '51 187', pct: 75 },
                          { path: 'Gallery', views: '49 258', pct: 68 },
                          { path: 'Video', views: '38 567', pct: 50 },
                        ].map((p, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: '600' }}>{p.path}</td>
                            <td>
                              <div className="mini-progress-bg">
                                <div className="mini-progress-fill" style={{ width: `${p.pct}%` }}></div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--primary)' }}>{p.views}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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
                      onClick={() => setOrderStatusFilter(s)}
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
                      onClick={() => { setTicketStatusFilter(s); setExpandedTicket(null); setTimeout(fetchTickets, 0); }}
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
                    {tickets.map(t => (
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

          {/* ── TAB: WIDGET DESIGN ── */}
          {activeTab === 'widget' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Widget Visual Customizer</h1>
                  <p className="page-subtitle">Customize chat bubble accent colors, screen placement, and excluded paths.</p>
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="card">
                  <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Theme Controls</h2>
                  
                  <div className="form-group">
                    <label>Primary Brand Accent Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="color" value={widgetColor} onChange={(e) => setWidgetColor(e.target.value)} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                      <input type="text" className="form-control" value={widgetColor} onChange={(e) => setWidgetColor(e.target.value)} style={{ width: '130px' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Widget Screen Position</label>
                    <select className="form-control" value={widgetPosition} onChange={(e) => setWidgetPosition(e.target.value)}>
                      <option value="bottom-right">Bottom Right (Default)</option>
                      <option value="bottom-left">Bottom Left</option>
                    </select>
                  </div>

                  <div className="switch-group">
                    <div className="switch-info">
                      <span className="switch-title">Voice Conversation Mode</span>
                      <span className="switch-desc">Allow customers to speak using microphone audio.</span>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={enableVoice} onChange={(e) => setEnableVoice(e.target.checked)} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="switch-group">
                    <div className="switch-info">
                      <span className="switch-title">Text Chat Mode</span>
                      <span className="switch-desc">Enable keyboard text input fallback in widget window.</span>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={enableText} onChange={(e) => setEnableText(e.target.checked)} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                {/* Excluded paths & preview */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Live Preview</h2>
                  
                  <div style={{ flex: 1, border: '1px dashed var(--card-border)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(7, 6, 17, 0.4)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Chat Bubble Screen Widget:</span>
                    
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: widgetColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: `0 0 25px ${widgetColor}66` }}>
                      💬
                    </div>

                    <span style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '12px' }}>
                      Placement: {widgetPosition}
                    </span>
                  </div>
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

          {/* ── TAB: INTEGRATIONS ── */}
          {activeTab === 'integrations' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Storefront Platform Credentials</h1>
                  <p className="page-subtitle">Link your Shopify or WooCommerce store API tokens to sync catalog data.</p>
                </div>
              </div>

              <div className="card" style={{ maxWidth: '780px' }}>
                <form onSubmit={handleSaveSettings}>
                  <div className="form-group">
                    <label>Platform System</label>
                    <select className="form-control" value={editedTenant.platform || 'shopify'} onChange={(e) => setEditedTenant({ ...editedTenant, platform: e.target.value })}>
                      <option value="shopify">Shopify Integration</option>
                      <option value="woocommerce">WooCommerce REST API</option>
                      <option value="custom_api">Custom Inbound REST API</option>
                    </select>
                  </div>

                  {editedTenant.platform === 'shopify' && (
                    <>
                      <div className="form-group">
                        <label>Shopify Store Domain</label>
                        <input type="text" className="form-control" value={editedTenant.shopify_domain || ''} onChange={(e) => setEditedTenant({ ...editedTenant, shopify_domain: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Admin Access Token</label>
                        <input type="password" className="form-control" value={editedTenant.shopify_access_token || ''} onChange={(e) => setEditedTenant({ ...editedTenant, shopify_access_token: e.target.value })} />
                      </div>
                    </>
                  )}

                  {editedTenant.platform === 'woocommerce' && (
                    <>
                      <div className="form-group">
                        <label>WooCommerce Base Store URL</label>
                        <input type="text" className="form-control" value={editedTenant.woocommerce_store_url || ''} onChange={(e) => setEditedTenant({ ...editedTenant, woocommerce_store_url: e.target.value })} />
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button type="button" className="btn btn-secondary" onClick={handleRotateCredentials}>
                      🔄 Rotate Keys
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Encrypting...' : 'Save Credentials'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── TAB: DIAGNOSTICS & SYSTEM ── */}
          {activeTab === 'diagnostics' && (
            <div>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Diagnostics & Terminal Logs</h1>
                  <p className="page-subtitle">Trigger product catalog syncs, test DNS connections, and read real-time activity logs.</p>
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="card">
                  <h2 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>System Actions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <button className="btn btn-primary" onClick={handleSyncProducts} disabled={isSyncingProducts}>
                      {isSyncingProducts ? 'Syncing Catalog...' : 'Trigger Product Catalog Re-sync'}
                    </button>
                    <button className="btn btn-secondary" onClick={handleTestConnection} disabled={isTestingConnection}>
                      {isTestingConnection ? 'Testing...' : 'Test Backend Connection Ping'}
                    </button>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-header">
                    <span className="card-title">Live Log Console</span>
                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px' }} onClick={() => setLogs([])}>
                      Clear Logs
                    </button>
                  </div>
                  <div className="console-log" ref={logTerminalRef}>
                    {logs.map((l, index) => (
                      <div key={index} className={`log-line ${l.type}`}>
                        <span className="log-line time">[{l.time}]</span> {l.type.toUpperCase()}: {l.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                  ) : billingSubscription ? (
                    <>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', textTransform: 'capitalize' }}>
                        {billingSubscription.plan || tenant.plan} Tier
                      </div>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '10px 0 16px' }}>
                        {billingSubscription.description ||
                          `Includes 200 voice sessions/month, Shopify integration, and Aria AI assistant.`}
                      </p>
                      {billingSubscription.used != null && billingSubscription.limit != null && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Monthly Voice Sessions</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{billingSubscription.used} / {billingSubscription.limit} sessions</span>
                          </div>
                          <div className="mini-progress-bg" style={{ width: '100%', height: '10px', marginBottom: '16px' }}>
                            <div className="mini-progress-fill" style={{ width: `${Math.min(100, (billingSubscription.used / billingSubscription.limit) * 100)}%` }}></div>
                          </div>
                        </>
                      )}
                      {billingSubscription.renews_at && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Renews on {new Date(billingSubscription.renews_at).toLocaleDateString()}.
                        </div>
                      )}
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

      {/* Floating Chat Icon Preview */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: widgetPosition === 'bottom-right' ? '24px' : 'auto',
          left: widgetPosition === 'bottom-left' ? '24px' : 'auto',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: widgetColor,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: `0 0 20px ${widgetColor}88`,
          zIndex: 1000
        }}
        onClick={() => setActiveTab('widget')}
        title="Widget preview button"
      >
        💬
      </div>
    </div>
  );
}

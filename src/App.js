import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const COMPETITOR_API_URL =
  "https://d1qzxptevf.execute-api.ap-south-1.amazonaws.com/prod/coe/competitors/latest";

/*
  RBR competitor universe.

  Core = businesses closest to RBR's report-selling / industry-intelligence model.
  Benchmark = large research businesses worth watching for scale, trust and positioning,
  but not as directly comparable to RBR's purchase model.
*/
const COMPETITOR_UNIVERSE = [
  {
    id: "marketsandmarkets",
    competitor_id: "marketsandmarkets",
    name: "MarketsandMarkets",
    domain: "marketsandmarkets.com",
    group: "core",
    type: "Syndicated reports / custom research / market intelligence",
    revenue_band_india: "₹200–300 Cr",
    closeness: "Very high",
    priority: 1,
  },
  {
    id: "mordor-intelligence",
    competitor_id: "mordor-intelligence",
    name: "Mordor Intelligence",
    domain: "mordorintelligence.com",
    group: "core",
    type: "Online market research and industry reports",
    revenue_band_india: "₹75–100 Cr",
    closeness: "Very high",
    priority: 2,
  },
  {
    id: "grand-view-research",
    competitor_id: "grand-view-research",
    name: "Grand View Research",
    domain: "grandviewresearch.com",
    group: "core",
    type: "Syndicated market reports and consulting",
    revenue_band_india: "₹50–75 Cr",
    closeness: "Very high",
    priority: 3,
  },
  {
    id: "fortune-business-insights",
    competitor_id: "fortune-business-insights",
    name: "Fortune Business Insights",
    domain: "fortunebusinessinsights.com",
    group: "core",
    type: "Market research reports and consulting",
    revenue_band_india: "₹25–50 Cr",
    closeness: "Very high",
    priority: 4,
  },
  {
    id: "imarc",
    competitor_id: "imarc",
    name: "IMARC",
    domain: "imarcgroup.com",
    group: "core",
    type: "Market reports, feasibility studies and consulting",
    revenue_band_india: "₹25–50 Cr",
    closeness: "Very high",
    priority: 5,
  },
  {
    id: "global-market-insights",
    competitor_id: "global-market-insights",
    name: "Global Market Insights",
    domain: "gminsights.com",
    group: "core",
    type: "Market intelligence and industry reports",
    revenue_band_india: "₹25–50 Cr",
    closeness: "Very high",
    priority: 6,
  },
  {
    id: "techsci-research",
    competitor_id: "techsci-research",
    name: "TechSci Research",
    domain: "techsciresearch.com",
    group: "core",
    type: "Market research reports and consulting",
    revenue_band_india: "₹10–25 Cr",
    closeness: "High",
    priority: 7,
  },
  {
    id: "ken-research",
    competitor_id: "ken-research",
    name: "Ken Research",
    domain: "kenresearch.com",
    group: "core",
    type: "Market research reports and advisory",
    revenue_band_india: "≈ ₹9 Cr",
    closeness: "High",
    priority: 8,
  },
  {
    id: "nielseniq-india",
    competitor_id: "nielseniq-india",
    name: "NielsenIQ India",
    domain: "nielseniq.com",
    group: "benchmark",
    type: "Enterprise data, measurement and market intelligence",
    revenue_band_india: "≈ ₹1,591 Cr",
    closeness: "Medium",
    priority: 101,
  },
  {
    id: "ipsos-research-india",
    competitor_id: "ipsos-research-india",
    name: "Ipsos Research India",
    domain: "ipsos.com",
    group: "benchmark",
    type: "Enterprise research and consulting",
    revenue_band_india: "₹500–750 Cr",
    closeness: "Medium",
    priority: 102,
  },
  {
    id: "kantar-india",
    competitor_id: "kantar-india",
    name: "Kantar India",
    domain: "kantar.com",
    group: "benchmark",
    type: "Enterprise research, analytics and consulting",
    revenue_band_india: "Several hundred Cr across India entities",
    closeness: "Medium",
    priority: 103,
  },
  {
    id: "market-xcel",
    competitor_id: "market-xcel",
    name: "Market Xcel",
    domain: "market-xcel.com",
    group: "benchmark",
    type: "Market research and consulting",
    revenue_band_india: "₹50–75 Cr",
    closeness: "Medium / high",
    priority: 104,
  },
];

const TRACKING_SEGMENTS = [
  {
    id: "overview",
    label: "Overview",
    short: "Overview",
    description: "Company activity, report-count movement and employee movement.",
  },
  {
    id: "search",
    label: "SEO / Search visibility",
    short: "Search",
    description:
      "Keywords, Google positions, organic visibility and search overlap with RBR.",
  },
  {
    id: "catalog",
    label: "Report catalogue & topics",
    short: "Catalogue",
    description:
      "Report count, newly launched reports, sectors, countries and topic coverage.",
  },
  {
    id: "pricing",
    label: "Pricing & offers",
    short: "Pricing",
    description:
      "Displayed report prices, discounts, licence options, samples and promotional offers.",
  },
  {
    id: "journey",
    label: "Purchase journey",
    short: "Purchase",
    description:
      "Google/search entry → report page → trust → sample/enquiry → payment or sales contact.",
  },
  {
    id: "leadgen",
    label: "Lead generation",
    short: "Lead gen",
    description:
      "Sample forms, enquiry forms, WhatsApp/chat, email capture, callbacks and sales hand-offs.",
  },
  {
    id: "trust",
    label: "Trust signals",
    short: "Trust",
    description:
      "Client logos, analyst credentials, methodology, testimonials, citations and guarantees.",
  },
  {
    id: "marketing",
    label: "Content & marketing",
    short: "Marketing",
    description:
      "News, blogs, PR, social/content activity, landing pages and campaign messages.",
  },
  {
    id: "threat",
    label: "RBR competitive threat",
    short: "Threat",
    description:
      "A consolidated RBR view of overlap, activity, pricing pressure and likely competitive risk.",
  },
];

const EMPTY_METRIC = {
  label: "Metric change",
  from: "0",
  to: "0",
  change: "0",
};

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9]/g, "");
}

function emptyCompetitor(seed) {
  return {
    ...seed,
    status: "Awaiting first collection",
    last_checked_at: null,
    updated_at: "",
    news: [],
    updates: [],
    reportCount: {
      ...EMPTY_METRIC,
      label: "Website report count change",
    },
    employeeCount: {
      ...EMPTY_METRIC,
      label: "LinkedIn employee count change",
    },
    segments: {},
  };
}

function mergeCompetitorUniverse(apiCompetitors = []) {
  const usedIndexes = new Set();

  const mergedSeeds = COMPETITOR_UNIVERSE.map((seed) => {
    const seedKeys = [
      normalize(seed.id),
      normalize(seed.competitor_id),
      normalize(seed.name),
      normalize(seed.domain),
    ].filter(Boolean);

    const matchIndex = apiCompetitors.findIndex((item, index) => {
      if (usedIndexes.has(index)) return false;

      const apiKeys = [
        normalize(item.id),
        normalize(item.competitor_id),
        normalize(item.name),
        normalize(item.domain),
      ].filter(Boolean);

      return apiKeys.some((key) => seedKeys.includes(key));
    });

    if (matchIndex === -1) return emptyCompetitor(seed);

    usedIndexes.add(matchIndex);
    const apiItem = apiCompetitors[matchIndex];

    return {
      ...emptyCompetitor(seed),
      ...apiItem,
      // Keep strategic classifications defined by RBR in the frontend.
      group: seed.group,
      closeness: seed.closeness,
      revenue_band_india: seed.revenue_band_india,
      priority: seed.priority,
      // Prefer API domain/type only when populated.
      domain: apiItem.domain || seed.domain,
      type: apiItem.type || seed.type,
      reportCount: {
        ...emptyCompetitor(seed).reportCount,
        ...(apiItem.reportCount || {}),
      },
      employeeCount: {
        ...emptyCompetitor(seed).employeeCount,
        ...(apiItem.employeeCount || {}),
      },
      news: Array.isArray(apiItem.news) ? apiItem.news : [],
      updates: Array.isArray(apiItem.updates) ? apiItem.updates : [],
      segments:
        apiItem.segments && typeof apiItem.segments === "object"
          ? apiItem.segments
          : {},
    };
  });

  // Keep any API competitors that are not yet part of the RBR curated universe.
  const extras = apiCompetitors
    .filter((_, index) => !usedIndexes.has(index))
    .map((item, index) => ({
      ...emptyCompetitor({
        id: item.id || item.competitor_id || `api-${index}`,
        competitor_id: item.competitor_id || item.id || `api-${index}`,
        name: item.name || "Unnamed competitor",
        domain: item.domain || "",
        group: "other",
        type: item.type || "Competitor",
        revenue_band_india: item.revenue_band_india || "Not classified",
        closeness: item.closeness || "Not classified",
        priority: Number(item.priority || 500 + index),
      }),
      ...item,
      group: item.group || "other",
      reportCount: {
        ...EMPTY_METRIC,
        label: "Website report count change",
        ...(item.reportCount || {}),
      },
      employeeCount: {
        ...EMPTY_METRIC,
        label: "LinkedIn employee count change",
        ...(item.employeeCount || {}),
      },
    }));

  return [...mergedSeeds, ...extras].sort(
    (a, b) => Number(a.priority || 999) - Number(b.priority || 999)
  );
}

function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="6" y="25" width="7" height="15" rx="2" />
      <rect x="19" y="17" width="7" height="23" rx="2" />
      <rect x="32" y="9" width="7" height="31" rx="2" />
      <path
        d="M8 21L22 10L35 5"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="17" fill="none" strokeWidth="3" />
      <path d="M7 24h34" fill="none" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M24 7c5 5 7.5 10.7 7.5 17S29 36 24 41c-5-5-7.5-10.7-7.5-17S19 12 24 7z"
        fill="none"
        strokeWidth="3"
      />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect
        x="10"
        y="9"
        width="24"
        height="30"
        rx="2"
        fill="none"
        strokeWidth="3"
      />
      <path
        d="M16 17h12M16 24h12M16 31h8M34 16h4v22a3 3 0 0 1-3 3h-1"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 39h29" fill="none" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M15 34V22M24 34V13M33 34V26"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="18" cy="17" r="6" fill="none" strokeWidth="3" />
      <circle cx="32" cy="18" r="5" fill="none" strokeWidth="3" />
      <path
        d="M8 39v-4c0-6 4-10 10-10s10 4 10 10v4"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M29 28c5 1 8 4 8 9v2"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 5l16 8v20l-16 10L8 33V13l16-8z"
        fill="none"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M8 13l16 9 16-9M24 22v21"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SourceLink({ children = "link", url }) {
  if (!url) {
    return (
      <span className="source-link" style={{ opacity: 0.65 }}>
        {children}
      </span>
    );
  }

  return (
    <a
      className="source-link"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

function MetricLine({ metric, iconType }) {
  return (
    <section className="monitor-section">
      <div className={`section-icon ${iconType}`}>
        {iconType === "chart" ? <ChartIcon /> : <PeopleIcon />}
      </div>

      <div className="section-content">
        <h3>{metric?.label || "Metric change"}</h3>
        <p className="metric-text">
          Changed from <strong>{metric?.from ?? "0"}</strong> to{" "}
          <strong>{metric?.to ?? "0"}</strong>
          <span className="delta-badge">{metric?.change ?? "0"}</span>
        </p>
      </div>
    </section>
  );
}

function EmptyListMessage({ text }) {
  return <p className="metric-text">{text}</p>;
}

function formatSegmentValue(value) {
  if (value === null || value === undefined || value === "") return "Not collected yet";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not collected yet";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function SegmentEvidence({ segment }) {
  if (!segment || typeof segment !== "object") return null;

  const items = Array.isArray(segment.evidence)
    ? segment.evidence
    : Array.isArray(segment.items)
    ? segment.items
    : [];

  if (!items.length) return null;

  return (
    <div style={{ marginTop: 14 }}>
      <strong style={{ display: "block", marginBottom: 8 }}>Latest evidence</strong>
      <ol className="updates-list">
        {items.map((item, index) => {
          const text =
            typeof item === "string"
              ? item
              : item.text || item.title || item.summary || "Observed signal";
          const sourceUrl =
            typeof item === "object" ? item.source_url || item.url : "";
          const source =
            typeof item === "object" ? item.source || "source" : "";

          return (
            <li key={`segment-evidence-${index}`}>
              <span>{text}</span>
              {sourceUrl || source ? (
                <small>
                  Source: <SourceLink url={sourceUrl}>{source || "link"}</SourceLink>
                </small>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SegmentCard({ title, value, note }) {
  return (
    <div
      style={{
        border: "1px solid rgba(120, 130, 150, 0.22)",
        borderRadius: 14,
        padding: "16px 18px",
        minHeight: 96,
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 12,
          opacity: 0.68,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 8,
        }}
      >
        {title}
      </span>
      <strong style={{ display: "block", fontSize: 18 }}>
        {formatSegmentValue(value)}
      </strong>
      {note ? (
        <small style={{ display: "block", marginTop: 7, opacity: 0.72 }}>
          {note}
        </small>
      ) : null}
    </div>
  );
}

function SegmentView({ competitor, segmentId }) {
  const segment = competitor?.segments?.[segmentId] || {};

  const layouts = {
    search: [
      ["RBR-overlap keywords", segment.keyword_overlap ?? segment.keywords_overlap],
      ["Organic visibility", segment.organic_visibility ?? segment.visibility],
      ["Tracked rankings", segment.tracked_keywords ?? segment.ranking_count],
      ["Search trend", segment.trend ?? segment.change],
    ],
    catalog: [
      ["Current report count", segment.report_count ?? competitor?.reportCount?.to],
      ["New reports", segment.new_reports ?? segment.added_reports],
      ["Top sectors", segment.top_sectors ?? segment.sectors],
      ["Topic overlap with RBR", segment.topic_overlap ?? segment.overlap],
    ],
    pricing: [
      ["Typical displayed price", segment.typical_price ?? segment.price],
      ["Discount / offer", segment.offer ?? segment.discount],
      ["Licence options", segment.licences ?? segment.license_options],
      ["Free sample", segment.free_sample ?? segment.sample_available],
    ],
    journey: [
      ["Primary CTA", segment.primary_cta ?? segment.cta],
      ["Price visible", segment.price_visible],
      ["Direct checkout", segment.direct_checkout ?? segment.checkout],
      ["Sales friction", segment.sales_friction ?? segment.friction],
    ],
    leadgen: [
      ["Sample capture", segment.sample_capture ?? segment.sample_form],
      ["Enquiry form", segment.enquiry_form],
      ["Chat / WhatsApp", segment.chat_whatsapp ?? segment.chat],
      ["Sales callback", segment.callback ?? segment.sales_callback],
    ],
    trust: [
      ["Client / customer proof", segment.client_proof ?? segment.client_logos],
      ["Methodology", segment.methodology],
      ["Analyst credentials", segment.analyst_credentials ?? segment.analysts],
      ["Testimonials / citations", segment.testimonials ?? segment.citations],
    ],
    marketing: [
      ["Content activity", segment.content_activity ?? segment.activity],
      ["Recent campaigns", segment.recent_campaigns ?? segment.campaigns],
      ["PR / news activity", segment.pr_activity ?? segment.news_activity],
      ["Primary message", segment.positioning ?? segment.primary_message],
    ],
    threat: [
      ["Threat score", segment.threat_score ?? competitor?.threat_score],
      ["RBR overlap", segment.rbr_overlap ?? segment.overlap],
      ["Momentum", segment.momentum],
      ["Recommended RBR action", segment.recommended_action ?? segment.action],
    ],
  };

  const cards = layouts[segmentId] || [];

  return (
    <section className="monitor-section" style={{ display: "block" }}>
      <div className="section-content" style={{ width: "100%" }}>
        <h3>
          {TRACKING_SEGMENTS.find((item) => item.id === segmentId)?.label ||
            "Tracking segment"}
        </h3>
        <p className="metric-text">
          {TRACKING_SEGMENTS.find((item) => item.id === segmentId)?.description}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          {cards.map(([title, value]) => (
            <SegmentCard
              key={title}
              title={title}
              value={value}
              note={
                value === null || value === undefined || value === ""
                  ? "Collector field ready"
                  : ""
              }
            />
          ))}
        </div>

        <SegmentEvidence segment={segment} />

        {!Object.keys(segment).length ? (
          <p className="metric-text" style={{ marginTop: 16 }}>
            No collected data for this segment yet. The interface is ready for the
            backend collector to populate <strong>segments.{segmentId}</strong>.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function App() {
  const [competitors, setCompetitors] = useState(
    mergeCompetitorUniverse([])
  );
  const [selectedId, setSelectedId] = useState("marketsandmarkets");
  const [selectedSegment, setSelectedSegment] = useState("overview");
  const [groupFilter, setGroupFilter] = useState("core");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCompetitors() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(COMPETITOR_API_URL);

        if (!response.ok) {
          throw new Error(`API failed with status ${response.status}`);
        }

        const data = await response.json();
        const apiCompetitors = Array.isArray(data.competitors)
          ? data.competitors
          : [];

        if (!isMounted) return;

        const merged = mergeCompetitorUniverse(apiCompetitors);
        setCompetitors(merged);

        // Keep the user's selected competitor where possible.
        setSelectedId((current) => {
          if (
            merged.some(
              (item) =>
                item.id === current || item.competitor_id === current
            )
          ) {
            return current;
          }

          return merged[0]?.id || merged[0]?.competitor_id || "";
        });
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to load competitors:", error);

        // Do not make the entire RBR competitor module disappear if the API is down.
        setCompetitors(mergeCompetitorUniverse([]));
        setLoadError(
          "Live API data is temporarily unavailable. Showing the RBR competitor universe with saved baseline classifications."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCompetitors();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCompetitors = useMemo(() => {
    if (groupFilter === "all") return competitors;
    return competitors.filter((item) => item.group === groupFilter);
  }, [competitors, groupFilter]);

  const selectedCompetitor = useMemo(() => {
    if (!competitors.length) return null;

    return (
      competitors.find(
        (competitor) =>
          competitor.id === selectedId ||
          competitor.competitor_id === selectedId
      ) || competitors[0]
    );
  }, [competitors, selectedId]);

  const summary = useMemo(() => {
    if (!selectedCompetitor) {
      return {
        monitored: 0,
        core: 0,
        benchmark: 0,
        highActivity: 0,
        totalSignals: 0,
      };
    }

    return {
      monitored: competitors.length,
      core: competitors.filter((item) => item.group === "core").length,
      benchmark: competitors.filter((item) => item.group === "benchmark").length,
      highActivity: competitors.filter((item) =>
        String(item.status || "").toLowerCase().includes("high")
      ).length,
      totalSignals:
        (selectedCompetitor.news || []).length +
        (selectedCompetitor.updates || []).length +
        Object.keys(selectedCompetitor.segments || {}).length,
    };
  }, [competitors, selectedCompetitor]);

  return (
    <div className="coe-monitor-page">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-icon">
            <AnalyticsIcon />
          </div>
          <h1>RBR AI CoE India</h1>
        </div>

        <div className="topbar-divider" />

        <div className="module-title">
          <h2>Competitor Intelligence</h2>
          <p>
            Track RBR's closest report-selling competitors across search, catalogue,
            pricing, purchase journey, lead generation, trust and market activity.
          </p>
        </div>
      </header>

      <main className="monitor-shell">
        <section className="details-panel">
          {loadError ? (
            <div
              style={{
                marginBottom: 14,
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255, 180, 0, 0.25)",
                fontSize: 13,
              }}
            >
              {loadError}
            </div>
          ) : null}

          {selectedCompetitor ? (
            <>
              <div className="details-header">
                <div>
                  <p className="eyebrow">
                    {selectedCompetitor.group === "core"
                      ? "Core RBR competitor"
                      : selectedCompetitor.group === "benchmark"
                      ? "Benchmark competitor"
                      : "Tracked competitor"}
                  </p>
                  <h2>{selectedCompetitor.name}</h2>
                  <p className="competitor-type">{selectedCompetitor.type}</p>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginTop: 10,
                      fontSize: 13,
                    }}
                  >
                    <span className="delta-badge">
                      India revenue: {selectedCompetitor.revenue_band_india}
                    </span>
                    <span className="delta-badge">
                      RBR closeness: {selectedCompetitor.closeness}
                    </span>
                    {selectedCompetitor.domain ? (
                      <span className="delta-badge">
                        {selectedCompetitor.domain}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="status-card">
                  <span>Status</span>
                  <strong>{selectedCompetitor.status || "Monitoring"}</strong>
                </div>
              </div>

              <div className="summary-strip">
                <div>
                  <span>Competitors monitored</span>
                  <strong>{summary.monitored}</strong>
                </div>
                <div>
                  <span>Core RBR competitors</span>
                  <strong>{summary.core}</strong>
                </div>
                <div>
                  <span>Benchmark players</span>
                  <strong>{summary.benchmark}</strong>
                </div>
                <div>
                  <span>Signals in this company</span>
                  <strong>{summary.totalSignals}</strong>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  margin: "16px 0 18px",
                }}
              >
                {TRACKING_SEGMENTS.map((segment) => (
                  <button
                    key={segment.id}
                    type="button"
                    onClick={() => setSelectedSegment(segment.id)}
                    aria-pressed={selectedSegment === segment.id}
                    style={{
                      border:
                        selectedSegment === segment.id
                          ? "1px solid currentColor"
                          : "1px solid rgba(120,130,150,.28)",
                      borderRadius: 999,
                      padding: "8px 12px",
                      cursor: "pointer",
                      font: "inherit",
                      fontSize: 13,
                      fontWeight: selectedSegment === segment.id ? 700 : 500,
                      background:
                        selectedSegment === segment.id
                          ? "rgba(120,130,150,.13)"
                          : "transparent",
                      color: "inherit",
                    }}
                  >
                    {segment.short}
                  </button>
                ))}
              </div>

              {selectedSegment === "overview" ? (
                <>
                  <section className="monitor-section updates-section">
                    <div className="section-icon updates">
                      <BoxIcon />
                    </div>

                    <div className="section-content">
                      <h3>Product updates / Company updates</h3>

                      {(selectedCompetitor.updates || []).length > 0 ? (
                        <ol className="updates-list">
                          {selectedCompetitor.updates.map((item, index) => (
                            <li
                              key={`${
                                selectedCompetitor.id ||
                                selectedCompetitor.competitor_id
                              }-update-${index}`}
                            >
                              <span>{item.text}</span>
                              <small>
                                {item.date ? <>On date: {item.date}. </> : null}
                                Source:{" "}
                                <SourceLink url={item.source_url}>
                                  {item.source || "link"}
                                </SourceLink>
                              </small>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <EmptyListMessage text="No product or company updates found yet. This will populate after the collector runs." />
                      )}
                    </div>
                  </section>

                  <section className="monitor-section news-section">
                    <div className="section-icon news">
                      <NewsIcon />
                    </div>

                    <div className="section-content">
                      <h3>
                        Latest internet news about {selectedCompetitor.name}
                      </h3>

                      {(selectedCompetitor.news || []).length > 0 ? (
                        <ol className="news-list">
                          {selectedCompetitor.news.map((item, index) => (
                            <li
                              key={`${
                                selectedCompetitor.id ||
                                selectedCompetitor.competitor_id
                              }-news-${index}`}
                            >
                              <span>{item.text}</span>
                              <small>
                                Source:{" "}
                                <SourceLink url={item.source_url}>
                                  {item.source || "link"}
                                </SourceLink>
                              </small>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <EmptyListMessage text="No news items found yet. This will populate after the collector runs." />
                      )}
                    </div>
                  </section>

                  <MetricLine
                    metric={selectedCompetitor.reportCount}
                    iconType="chart"
                  />

                  <MetricLine
                    metric={selectedCompetitor.employeeCount}
                    iconType="people"
                  />
                </>
              ) : (
                <SegmentView
                  competitor={selectedCompetitor}
                  segmentId={selectedSegment}
                />
              )}
            </>
          ) : (
            <div className="details-header">
              <div>
                <p className="eyebrow">No records</p>
                <h2>No competitors found</h2>
              </div>
            </div>
          )}
        </section>

        <aside className="competitor-panel">
          <div className="competitor-panel-heading">
            <p className="eyebrow">Monitoring list</p>
            <h3>Competitors</h3>
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              margin: "0 0 12px",
            }}
          >
            {[
              ["core", "Core"],
              ["benchmark", "Benchmarks"],
              ["all", "All"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setGroupFilter(value)}
                aria-pressed={groupFilter === value}
                style={{
                  border:
                    groupFilter === value
                      ? "1px solid currentColor"
                      : "1px solid rgba(120,130,150,.25)",
                  borderRadius: 999,
                  padding: "6px 10px",
                  cursor: "pointer",
                  background:
                    groupFilter === value
                      ? "rgba(120,130,150,.13)"
                      : "transparent",
                  color: "inherit",
                  font: "inherit",
                  fontSize: 12,
                  fontWeight: groupFilter === value ? 700 : 500,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="competitor-list">
            {filteredCompetitors.map((competitor) => {
              const competitorId = competitor.id || competitor.competitor_id;
              const isSelected = competitorId === selectedId;

              return (
                <button
                  key={competitorId}
                  className={`competitor-card ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => setSelectedId(competitorId)}
                  aria-pressed={isSelected}
                >
                  <span className="competitor-icon">
                    <GlobeIcon />
                  </span>

                  <span className="competitor-copy">
                    <strong>{competitor.name}</strong>
                    <small>
                      {competitor.revenue_band_india} ·{" "}
                      {competitor.status || "Monitoring"}
                    </small>
                  </span>

                  <span className="chevron">›</span>
                </button>
              );
            })}
          </div>

          <div className="future-note">
            <span>{loading ? "Refreshing live data…" : "RBR tracking model"}</span>
            <p>
              Core competitors are tracked separately from benchmark research
              companies. Segment collectors can populate SEO, catalogue, pricing,
              purchase journey, lead generation, trust, marketing and threat data
              without changing this UI again.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;

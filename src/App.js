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
    id: "catalogue",
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
    id: "lead_generation",
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
  if (value === null || value === undefined || value === "") return "Not publicly verified";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (Array.isArray(value)) {
    if (!value.length) return "Not publicly verified";
    return value
      .map((item) => {
        if (item === null || item === undefined) return "";
        if (typeof item === "string" || typeof item === "number") return String(item);
        if (typeof item === "object") {
          return (
            item.report_title ||
            item.title ||
            item.text ||
            item.label ||
            item.name ||
            item.description ||
            item.url ||
            item.source_url ||
            JSON.stringify(item)
          );
        }
        return String(item);
      })
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    return (
      value.text ||
      value.title ||
      value.label ||
      value.name ||
      value.description ||
      JSON.stringify(value)
    );
  }

  return String(value);
}

function hasUsefulValue(value) {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function SegmentEvidence({ segment }) {
  if (!segment || typeof segment !== "object") return null;

  const sources = Array.isArray(segment.sources) ? segment.sources : [];
  const candidateEvidence = [
    ...(Array.isArray(segment.observations) ? segment.observations : []),
    ...(Array.isArray(segment.catalogue_observations) ? segment.catalogue_observations : []),
    ...(Array.isArray(segment.pricing_notes) ? segment.pricing_notes : []),
    ...(Array.isArray(segment.steps) ? segment.steps : []),
    ...(Array.isArray(segment.friction_points) ? segment.friction_points : []),
    ...(Array.isArray(segment.strong_points) ? segment.strong_points : []),
    ...(Array.isArray(segment.lead_magnets) ? segment.lead_magnets : []),
    ...(Array.isArray(segment.trust_signals) ? segment.trust_signals : []),
    ...(Array.isArray(segment.marketing_observations) ? segment.marketing_observations : []),
    ...(Array.isArray(segment.reasons) ? segment.reasons : []),
    ...(Array.isArray(segment.competitor_advantages) ? segment.competitor_advantages : []),
    ...(Array.isArray(segment.rbr_advantages) ? segment.rbr_advantages : []),
    ...(Array.isArray(segment.recommended_actions) ? segment.recommended_actions : []),
  ];

  const evidence = candidateEvidence
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        return String(item.text || item.title || item.description || item.label || "").trim();
      }
      return "";
    })
    .filter(Boolean);

  if (!evidence.length && !sources.length) return null;

  return (
    <div style={{ marginTop: 18 }}>
      {evidence.length ? (
        <>
          <strong style={{ display: "block", marginBottom: 8 }}>Key observations</strong>
          <ol className="updates-list">
            {evidence.slice(0, 12).map((item, index) => (
              <li key={`segment-evidence-${index}`}>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      {sources.length ? (
        <div style={{ marginTop: evidence.length ? 16 : 0 }}>
          <strong style={{ display: "block", marginBottom: 8 }}>Sources</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {sources.map((source, index) => {
              const label =
                typeof source === "string"
                  ? source
                  : source?.label || source?.source || source?.url || "source";
              const url =
                typeof source === "string"
                  ? source
                  : source?.url || source?.source_url || "";

              return (
                <SourceLink key={`segment-source-${index}`} url={url}>
                  {label}
                </SourceLink>
              );
            })}
          </div>
        </div>
      ) : null}
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
      ["Visibility score", segment.visibility_score],
      ["Visibility level", segment.visibility_level],
      ["Top topics", segment.top_topics],
      ["Observed queries", segment.observed_queries],
      ["Keyword overlap", segment.keyword_overlap],
    ],
    catalogue: [
      ["Observed / verified report count", segment.report_count_verified ? segment.estimated_report_count : null],
      ["Count method", segment.report_count_method && segment.report_count_method !== "none" ? segment.report_count_method : null],
      ["Publicly claimed report count", segment.publicly_claimed_report_count ?? null],
      ["Public claim text", segment.publicly_claimed_report_count_text || null],
      ["New reports in 30 days", segment.new_reports_30d],
      ["Top categories", segment.top_categories],
      ["Industries", segment.industries],
      ["Geographies", segment.geographies],
    ],
    pricing: [
      ["Pricing visible", segment.pricing_visible],
      ["Sample available", segment.sample_available],
      ["Lowest observed price", segment.lowest_observed_price],
      ["Highest observed price", segment.highest_observed_price],
      ["Currency", segment.currency],
      ["Licence options", segment.licence_options],
      ["Discount detected", segment.discount_detected],
      ["Discount details", segment.discount_details],
    ],
    journey: [
      ["Direct checkout", segment.direct_checkout],
      ["Enquiry required", segment.enquiry_required],
      ["Sample CTA", segment.sample_cta],
      ["Talk to analyst", segment.talk_to_analyst],
      ["Journey model", segment.journey_model],
      ["Journey steps", segment.steps],
    ],
    lead_generation: [
      ["Sample form", segment.sample_form],
      ["Email capture", segment.email_capture],
      ["Phone capture", segment.phone_capture],
      ["Contact sales", segment.contact_sales],
      ["Newsletter", segment.newsletter],
      ["Lead magnets", segment.lead_magnets],
    ],
    trust: [
      ["Methodology visible", segment.methodology_visible],
      ["Client logos", segment.client_logos],
      ["Testimonials", segment.testimonials],
      ["Analyst profiles", segment.analyst_profiles],
      ["Author names", segment.author_names],
      ["Source transparency", segment.source_transparency],
    ],
    marketing: [
      ["Content types", segment.content_types],
      ["Promotions", segment.promotions],
      ["Thought leadership", segment.thought_leadership],
      ["Social activity", segment.social_activity],
    ],
    threat: [
      ["Threat score", segment.threat_score],
      ["Threat level", segment.threat_level],
      ["Search visibility", segment.score_breakdown?.search_visibility],
      ["Catalogue", segment.score_breakdown?.catalogue],
      ["Pricing strength", segment.score_breakdown?.pricing_strength],
      ["Purchase journey", segment.score_breakdown?.purchase_journey],
      ["Trust", segment.score_breakdown?.trust],
      ["Lead generation + marketing", segment.score_breakdown?.lead_generation_marketing],
      ["Business-model overlap", segment.score_breakdown?.business_model_overlap],
    ],
  };

  const cards = layouts[segmentId] || [];

  const hasMeaningfulValue = (value) => {
    if (value === null || value === undefined || value === "") return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };

  const populatedCards = cards.filter(([, value]) => hasMeaningfulValue(value));
  const missingLabels = cards
    .filter(([, value]) => !hasMeaningfulValue(value))
    .map(([title]) => title);

  const implication =
    segment.rbr_implication ||
    (segmentId === "threat" && Array.isArray(segment.recommended_actions)
      ? segment.recommended_actions.join(" • ")
      : "");

  const priceObservations =
    segmentId === "pricing" && Array.isArray(segment.price_observations)
      ? segment.price_observations
      : [];

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

        {implication ? (
          <div
            style={{
              marginTop: 14,
              padding: "13px 15px",
              borderRadius: 12,
              border: "1px solid rgba(120,130,150,.20)",
              background: "rgba(120,130,150,.06)",
            }}
          >
            <small
              style={{
                display: "block",
                textTransform: "uppercase",
                letterSpacing: ".06em",
                opacity: .55,
                marginBottom: 5,
              }}
            >
              RBR implication
            </small>
            <strong style={{ lineHeight: 1.5 }}>{implication}</strong>
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          {populatedCards.map(([title, value]) => (
            <SegmentCard
              key={title}
              title={title}
              value={value}
              note=""
            />
          ))}
        </div>

        {missingLabels.length ? (
          <p style={{ margin: "10px 0 0", fontSize: 12, opacity: .5, lineHeight: 1.5 }}>
            Not publicly verified in this refresh: {missingLabels.join(", ")}
          </p>
        ) : null}

        {priceObservations.length ? (
          <div style={{ marginTop: 18 }}>
            <strong style={{ display: "block", marginBottom: 8 }}>
              Verified public prices
            </strong>
            <ol className="updates-list">
              {priceObservations.map((item, index) => (
                <li key={`price-observation-${index}`}>
                  <span>
                    {item.report_title || "Observed report"} —{" "}
                    <strong>
                      {item.currency ? `${item.currency} ` : ""}
                      {item.price}
                    </strong>
                    {item.licence ? ` (${item.licence})` : ""}
                  </span>
                  <small>
                    Source:{" "}
                    <SourceLink url={item.source_url}>
                      {item.source_url ? "open price source" : "source"}
                    </SourceLink>
                  </small>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <SegmentEvidence segment={segment} />

        {!Object.keys(segment).length ? (
          <p className="metric-text" style={{ marginTop: 16 }}>
            No collected data for this segment yet.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function PrimarySegmentCard({ competitor, segmentId, selected, onSelect }) {
  const segment = competitor?.segments?.[segmentId] || {};

  const threatBreakdown = competitor?.segments?.threat?.score_breakdown || {};

  const configs = {
    search: {
      title: "Search visibility",
      subtitle: "Can customers find them before they find RBR?",
      stat1Label: "Visibility level",
      stat1: segment.visibility_level,
      stat2Label: "Search evidence",
      stat2: threatBreakdown.search_visibility !== null && threatBreakdown.search_visibility !== undefined
        ? `${threatBreakdown.search_visibility}/20`
        : (Array.isArray(segment.top_topics) ? `${segment.top_topics.length} topics found` : null),
    },

    catalogue: {
      title: "Report catalogue",
      subtitle: "What markets, industries and geographies are they covering?",
      stat1Label: "Observed / verified report count",
      stat1: segment.report_count_verified ? segment.estimated_report_count : null,
      stat2Label: "Top categories",
      stat2: Array.isArray(segment.top_categories)
        ? segment.top_categories.slice(0, 2)
        : segment.top_categories,
    },

    pricing: {
      title: "Pricing & offers",
      subtitle: "What does the visitor see before deciding to buy?",
      stat1Label: "Pricing visible",
      stat1: segment.pricing_visible,
      stat2Label: segment.sample_available !== null && segment.sample_available !== undefined
        ? "Sample available"
        : "Licence options",
      stat2: segment.sample_available !== null && segment.sample_available !== undefined
        ? segment.sample_available
        : segment.licence_options,
    },

    journey: {
      title: "Purchase journey",
      subtitle: "How do they move a visitor toward enquiry or payment?",
      stat1Label: "Direct checkout",
      stat1: segment.direct_checkout,
      stat2Label: "Enquiry required",
      stat2: segment.enquiry_required,
    },
  };

  const config = configs[segmentId];
  const hasCollectedData = Object.keys(segment).length > 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        width: "100%",
        textAlign: "left",
        border: selected
          ? "2px solid currentColor"
          : "1px solid rgba(120,130,150,.24)",
        borderRadius: 18,
        padding: "18px 18px 16px",
        background: selected
          ? "rgba(100,120,180,.10)"
          : "rgba(255,255,255,.025)",
        color: "inherit",
        cursor: "pointer",
        font: "inherit",
        minHeight: 190,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                opacity: .58,
                marginBottom: 7,
              }}
            >
              Priority analysis
            </span>
            <strong style={{ display: "block", fontSize: 21, lineHeight: 1.2 }}>
              {config.title}
            </strong>
          </div>
          <span style={{ opacity: .55, fontSize: 22 }}>›</span>
        </div>

        <p
          style={{
            margin: "9px 0 16px",
            opacity: .68,
            fontSize: 13,
            lineHeight: 1.45,
          }}
        >
          {config.subtitle}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <div>
          <small style={{ display: "block", opacity: .55, marginBottom: 4 }}>
            {config.stat1Label}
          </small>
          <strong style={{ fontSize: 15 }}>{formatSegmentValue(config.stat1)}</strong>
        </div>
        <div>
          <small style={{ display: "block", opacity: .55, marginBottom: 4 }}>
            {config.stat2Label}
          </small>
          <strong style={{ fontSize: 15 }}>{formatSegmentValue(config.stat2)}</strong>
        </div>
      </div>

      {!hasCollectedData ? (
        <small style={{ marginTop: 12, opacity: .48 }}>
          No verified public evidence in latest refresh
        </small>
      ) : null}
    </button>
  );
}


function ActivitySignalsSummary({ competitor, onOpenDetails }) {
  const updatesCount = (competitor?.updates || []).length;
  const newsCount = (competitor?.news || []).length;
  const reportChange = competitor?.reportCount?.change ?? "0";
  const employeeChange = competitor?.employeeCount?.change ?? "0";

  const signals = [
    { label: "Product / company updates", value: updatesCount, note: "Recent tracked changes" },
    { label: "Internet news", value: newsCount, note: "Recent mentions found" },
    { label: "Report-count change", value: reportChange, note: `${competitor?.reportCount?.from ?? "0"} → ${competitor?.reportCount?.to ?? "0"}` },
    { label: "Employee-count change", value: employeeChange, note: `${competitor?.employeeCount?.from ?? "0"} → ${competitor?.employeeCount?.to ?? "0"}` },
  ];

  return (
    <section
      style={{
        margin: "0 0 18px",
        padding: "15px 16px 16px",
        border: "1px solid rgba(120,130,150,.18)",
        borderRadius: 16,
        background: "rgba(255,255,255,.018)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p className="eyebrow" style={{ margin: "0 0 3px" }}>Secondary competitive signals</p>
          <h3 style={{ margin: 0, fontSize: 17 }}>Activity & signals</h3>
        </div>
        <button
          type="button"
          onClick={onOpenDetails}
          style={{
            border: "1px solid rgba(120,130,150,.24)",
            borderRadius: 999,
            padding: "7px 11px",
            cursor: "pointer",
            background: "transparent",
            color: "inherit",
            font: "inherit",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          View signal details
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {signals.map((signal) => (
          <div
            key={signal.label}
            style={{
              padding: "12px 13px",
              borderRadius: 12,
              border: "1px solid rgba(120,130,150,.14)",
              background: "rgba(255,255,255,.018)",
              minHeight: 88,
            }}
          >
            <small style={{ display: "block", opacity: .58, marginBottom: 7 }}>
              {signal.label}
            </small>
            <strong style={{ display: "block", fontSize: 20, lineHeight: 1.15 }}>
              {signal.value}
            </strong>
            <small style={{ display: "block", opacity: .5, marginTop: 6 }}>
              {signal.note}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}

function OverviewView({ competitor }) {
  return (
    <>
      <section className="monitor-section updates-section">
        <div className="section-icon updates">
          <BoxIcon />
        </div>
        <div className="section-content">
          <h3>Product / company updates</h3>
          {(competitor.updates || []).length > 0 ? (
            <ol className="updates-list">
              {competitor.updates.map((item, index) => (
                <li key={`overview-update-${index}`}>
                  <span>{item.text}</span>
                  <small>
                    {item.date ? <>On date: {item.date}. </> : null}
                    Source: <SourceLink url={item.source_url}>{item.source || "link"}</SourceLink>
                  </small>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyListMessage text="No product or company updates found yet." />
          )}
        </div>
      </section>

      <section className="monitor-section news-section">
        <div className="section-icon news">
          <NewsIcon />
        </div>
        <div className="section-content">
          <h3>Latest internet news about {competitor.name}</h3>
          {(competitor.news || []).length > 0 ? (
            <ol className="news-list">
              {competitor.news.map((item, index) => (
                <li key={`overview-news-${index}`}>
                  <span>{item.text}</span>
                  <small>
                    Source: <SourceLink url={item.source_url}>{item.source || "link"}</SourceLink>
                  </small>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyListMessage text="No news items found yet." />
          )}
        </div>
      </section>

      <MetricLine metric={competitor.reportCount} iconType="chart" />
      <MetricLine metric={competitor.employeeCount} iconType="people" />
    </>
  );
}

function App() {
  const [competitors, setCompetitors] = useState(mergeCompetitorUniverse([]));
  const [selectedId, setSelectedId] = useState("marketsandmarkets");
  const [selectedSegment, setSelectedSegment] = useState("search");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCompetitors() {
      try {
        setLoading(true);
        setLoadError("");
        const response = await fetch(COMPETITOR_API_URL);
        if (!response.ok) throw new Error(`API failed with status ${response.status}`);

        const data = await response.json();
        const apiCompetitors = Array.isArray(data.competitors) ? data.competitors : [];
        if (!isMounted) return;

        const merged = mergeCompetitorUniverse(apiCompetitors);
        setCompetitors(merged);
        setSelectedId((current) =>
          merged.some((item) => item.id === current || item.competitor_id === current)
            ? current
            : merged[0]?.id || merged[0]?.competitor_id || ""
        );
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load competitors:", error);
        setCompetitors(mergeCompetitorUniverse([]));
        setLoadError(
          "Live API data is temporarily unavailable. Showing the RBR competitor universe with baseline classifications."
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

  const selectedCompetitor = useMemo(() => {
    if (!competitors.length) return null;
    return (
      competitors.find(
        (competitor) =>
          competitor.id === selectedId || competitor.competitor_id === selectedId
      ) || competitors[0]
    );
  }, [competitors, selectedId]);

  const coreCompetitors = competitors.filter((item) => item.group === "core");
  const benchmarkCompetitors = competitors.filter((item) => item.group === "benchmark");
  const otherCompetitors = competitors.filter(
    (item) => item.group !== "core" && item.group !== "benchmark"
  );

  const secondarySegments = ["lead_generation", "trust", "marketing", "threat", "overview"];

  return (
    <div className="coe-monitor-page">
      <header className="topbar" style={{ paddingBottom: 14 }}>
        <div className="topbar-brand">
          <div className="brand-icon"><AnalyticsIcon /></div>
          <h1>RBR AI CoE India</h1>
        </div>
        <div className="topbar-divider" />
        <div className="module-title">
          <h2>Competitor Intelligence</h2>
          <p>Compare the signals that can directly improve RBR sales.</p>
        </div>
      </header>

      <main
        className="monitor-shell"
        style={{
          display: "block",
          width: "100%",
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        <section className="details-panel" style={{ width: "100%" }}>
          {loadError ? (
            <div
              style={{
                marginBottom: 12,
                padding: "9px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,180,0,.25)",
                fontSize: 12,
                opacity: .82,
              }}
            >
              {loadError}
            </div>
          ) : null}

          {selectedCompetitor ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(260px, 420px) 1fr",
                  gap: 18,
                  alignItems: "center",
                  marginBottom: 18,
                  padding: "14px 16px",
                  border: "1px solid rgba(120,130,150,.18)",
                  borderRadius: 16,
                }}
              >
                <div>
                  <label
                    htmlFor="competitor-select"
                    style={{
                      display: "block",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      opacity: .55,
                      marginBottom: 6,
                    }}
                  >
                    Competitor being analysed
                  </label>
                  <select
                    id="competitor-select"
                    value={selectedId}
                    onChange={(event) => setSelectedId(event.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(120,130,150,.28)",
                      background: "transparent",
                      color: "inherit",
                      font: "inherit",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    <optgroup label="Core RBR competitors">
                      {coreCompetitors.map((competitor) => {
                        const id = competitor.id || competitor.competitor_id;
                        return <option key={id} value={id}>{competitor.name}</option>;
                      })}
                    </optgroup>
                    <optgroup label="Benchmark competitors">
                      {benchmarkCompetitors.map((competitor) => {
                        const id = competitor.id || competitor.competitor_id;
                        return <option key={id} value={id}>{competitor.name}</option>;
                      })}
                    </optgroup>
                    {otherCompetitors.length ? (
                      <optgroup label="Other tracked competitors">
                        {otherCompetitors.map((competitor) => {
                          const id = competitor.id || competitor.competitor_id;
                          return <option key={id} value={id}>{competitor.name}</option>;
                        })}
                      </optgroup>
                    ) : null}
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <strong style={{ fontSize: 17 }}>{selectedCompetitor.name}</strong>
                  <span className="delta-badge">India revenue: {selectedCompetitor.revenue_band_india}</span>
                  <span className="delta-badge">RBR closeness: {selectedCompetitor.closeness}</span>
                  <span className="delta-badge">{loading ? "Refreshing…" : selectedCompetitor.status || "Monitoring"}</span>
                </div>
              </div>

              {selectedCompetitor.executive_summary ? (
                <section
                  style={{
                    marginBottom: 18,
                    padding: "15px 17px",
                    borderRadius: 14,
                    border: "1px solid rgba(120,130,150,.18)",
                    background: "rgba(255,255,255,.02)",
                  }}
                >
                  <p className="eyebrow" style={{ margin: "0 0 5px" }}>
                    Competitive intelligence summary
                  </p>
                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.6,
                      fontSize: 14,
                      opacity: .86,
                    }}
                  >
                    {selectedCompetitor.executive_summary}
                  </p>
                </section>
              ) : null}

              <div style={{ marginBottom: 10 }}>
                <p className="eyebrow" style={{ marginBottom: 4 }}>What matters for RBR</p>
                <h2 style={{ margin: 0, fontSize: 24 }}>Competitive sales analysis</h2>
                <p className="competitor-type" style={{ marginTop: 5 }}>
                  Start with the four segments most likely to explain why a visitor chooses a competitor over RBR.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 12,
                  margin: "14px 0 18px",
                }}
              >
                {["search", "catalogue", "pricing", "journey"].map((segmentId) => (
                  <PrimarySegmentCard
                    key={segmentId}
                    competitor={selectedCompetitor}
                    segmentId={segmentId}
                    selected={selectedSegment === segmentId}
                    onSelect={() => setSelectedSegment(segmentId)}
                  />
                ))}
              </div>

              <ActivitySignalsSummary
                competitor={selectedCompetitor}
                onOpenDetails={() => setSelectedSegment("overview")}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {secondarySegments.map((segmentId) => {
                    const segment = TRACKING_SEGMENTS.find((item) => item.id === segmentId);
                    const selected = selectedSegment === segmentId;
                    return (
                      <button
                        key={segmentId}
                        type="button"
                        onClick={() => setSelectedSegment(segmentId)}
                        aria-pressed={selected}
                        style={{
                          border: selected
                            ? "1px solid currentColor"
                            : "1px solid rgba(120,130,150,.24)",
                          borderRadius: 999,
                          padding: "7px 11px",
                          cursor: "pointer",
                          background: selected ? "rgba(120,130,150,.12)" : "transparent",
                          color: "inherit",
                          font: "inherit",
                          fontSize: 12,
                          fontWeight: selected ? 700 : 500,
                        }}
                      >
                        {segment?.label || segmentId}
                      </button>
                    );
                  })}
                </div>

                <small style={{ opacity: .5 }}>
                  {selectedCompetitor.domain || ""}
                </small>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(120,130,150,.18)",
                  paddingTop: 14,
                }}
              >
                {selectedSegment === "overview" ? (
                  <OverviewView competitor={selectedCompetitor} />
                ) : (
                  <SegmentView competitor={selectedCompetitor} segmentId={selectedSegment} />
                )}
              </div>
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
      </main>
    </div>
  );
}

export default App;

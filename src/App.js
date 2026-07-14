import React, { useMemo, useState } from "react";
import "./App.css";

const competitors = [
  {
    id: "marketreports",
    name: "MarketReports.com",
    type: "Commercial report marketplace",
    status: "High activity",
    news: [
      {
        text: "Recently got $100 billion funding.",
        source: "link",
      },
      {
        text: "Launched new branch in UK.",
        source: "link",
      },
    ],
    reportCount: {
      label: "Website report count change",
      from: "12,000",
      to: "15,000",
      change: "+3,000",
    },
    employeeCount: {
      label: "LinkedIn employee count change",
      from: "100",
      to: "10,000",
      change: "+9,900",
    },
    updates: [
      {
        text: 'Added "Automobile industry" in the categories of the reports.',
        date: "13-July-2026",
        source: "link",
      },
      {
        text: "Stock value of the company rose by 2 points, currently at 138.",
        source: "link",
      },
    ],
  },
  {
    id: "ibisworld",
    name: "IBISWorld.com",
    type: "Industry research platform",
    status: "Moderate activity",
    news: [
      {
        text: "Expanded new research coverage for emerging business sectors.",
        source: "link",
      },
      {
        text: "Published updated industry outlook pages for small businesses.",
        source: "link",
      },
    ],
    reportCount: {
      label: "Website report count change",
      from: "9,400",
      to: "9,850",
      change: "+450",
    },
    employeeCount: {
      label: "LinkedIn employee count change",
      from: "620",
      to: "690",
      change: "+70",
    },
    updates: [
      {
        text: "Added new industry analysis pages for B2B services.",
        date: "10-July-2026",
        source: "link",
      },
      {
        text: "Updated pricing and subscription communication on selected pages.",
        source: "link",
      },
    ],
  },
  {
    id: "marketresearch",
    name: "MarketResearch.com",
    type: "Report aggregation platform",
    status: "Watch closely",
    news: [
      {
        text: "Started promoting new syndicated research categories.",
        source: "link",
      },
      {
        text: "Added new publisher partnerships in selected report verticals.",
        source: "link",
      },
    ],
    reportCount: {
      label: "Website report count change",
      from: "28,500",
      to: "29,100",
      change: "+600",
    },
    employeeCount: {
      label: "LinkedIn employee count change",
      from: "210",
      to: "235",
      change: "+25",
    },
    updates: [
      {
        text: "Added new reports in food processing and specialty chemicals.",
        date: "11-July-2026",
        source: "link",
      },
      {
        text: "Refreshed several category landing pages with updated report lists.",
        source: "link",
      },
    ],
  },
  {
    id: "niti",
    name: "NITI Aayog",
    type: "Policy and public research source",
    status: "Policy signal source",
    news: [
      {
        text: "Published new policy discussion material for Indian growth sectors.",
        source: "link",
      },
      {
        text: "Released new public data points useful for industry opportunity tracking.",
        source: "link",
      },
    ],
    reportCount: {
      label: "Website report count change",
      from: "1,240",
      to: "1,310",
      change: "+70",
    },
    employeeCount: {
      label: "LinkedIn employee count change",
      from: "1,100",
      to: "1,170",
      change: "+70",
    },
    updates: [
      {
        text: "Added policy-linked materials relevant to manufacturing and exports.",
        date: "09-July-2026",
        source: "link",
      },
      {
        text: "Updated selected public resource pages with newer references.",
        source: "link",
      },
    ],
  },
  {
    id: "corpium",
    name: "Corpium.co.uk",
    type: "UK competitor / reference site",
    status: "Low activity",
    news: [
      {
        text: "Updated company service pages with new market-entry messaging.",
        source: "link",
      },
      {
        text: "Added new website content around international expansion.",
        source: "link",
      },
    ],
    reportCount: {
      label: "Website report count change",
      from: "830",
      to: "890",
      change: "+60",
    },
    employeeCount: {
      label: "LinkedIn employee count change",
      from: "42",
      to: "49",
      change: "+7",
    },
    updates: [
      {
        text: "Added new service page for international company research.",
        date: "07-July-2026",
        source: "link",
      },
      {
        text: "Changed homepage content and call-to-action positioning.",
        source: "link",
      },
    ],
  },
];

function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="6" y="25" width="7" height="15" rx="2" />
      <rect x="19" y="17" width="7" height="23" rx="2" />
      <rect x="32" y="9" width="7" height="31" rx="2" />
      <path d="M8 21L22 10L35 5" fill="none" strokeWidth="4" strokeLinecap="round" />
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
      <rect x="10" y="9" width="24" height="30" rx="2" fill="none" strokeWidth="3" />
      <path d="M16 17h12M16 24h12M16 31h8M34 16h4v22a3 3 0 0 1-3 3h-1" fill="none" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 39h29" fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 34V22M24 34V13M33 34V26" fill="none" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="18" cy="17" r="6" fill="none" strokeWidth="3" />
      <circle cx="32" cy="18" r="5" fill="none" strokeWidth="3" />
      <path d="M8 39v-4c0-6 4-10 10-10s10 4 10 10v4" fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="M29 28c5 1 8 4 8 9v2" fill="none" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 5l16 8v20l-16 10L8 33V13l16-8z" fill="none" strokeWidth="3" strokeLinejoin="round" />
      <path d="M8 13l16 9 16-9M24 22v21" fill="none" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SourceLink({ children = "link" }) {
  return (
    <a className="source-link" href="#source" onClick={(event) => event.preventDefault()}>
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
        <h3>{metric.label}</h3>
        <p className="metric-text">
          Changed from <strong>{metric.from}</strong> to <strong>{metric.to}</strong>
          <span className="delta-badge">{metric.change}</span>
        </p>
      </div>
    </section>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState("marketreports");

  const selectedCompetitor = useMemo(
    () => competitors.find((competitor) => competitor.id === selectedId) || competitors[0],
    [selectedId]
  );

  const summary = useMemo(() => {
    return {
      monitored: competitors.length,
      highActivity: competitors.filter((item) => item.status.toLowerCase().includes("high")).length,
      totalSignals:
        selectedCompetitor.news.length +
        selectedCompetitor.updates.length +
        2,
    };
  }, [selectedCompetitor]);

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
          <h2>Competitor Monitoring</h2>
          <p>Track competitor news, website changes, LinkedIn changes, and product updates.</p>
        </div>
      </header>

      <main className="monitor-shell">
        <section className="details-panel">
          <div className="details-header">
            <div>
              <p className="eyebrow">Selected competitor</p>
              <h2>{selectedCompetitor.name}</h2>
              <p className="competitor-type">{selectedCompetitor.type}</p>
            </div>

            <div className="status-card">
              <span>Status</span>
              <strong>{selectedCompetitor.status}</strong>
            </div>
          </div>

          <div className="summary-strip">
            <div>
              <span>Competitors monitored</span>
              <strong>{summary.monitored}</strong>
            </div>
            <div>
              <span>High activity</span>
              <strong>{summary.highActivity}</strong>
            </div>
            <div>
              <span>Signals in this view</span>
              <strong>{summary.totalSignals}</strong>
            </div>
          </div>

          <section className="monitor-section news-section">
            <div className="section-icon news">
              <NewsIcon />
            </div>

            <div className="section-content">
              <h3>Latest news in internet about {selectedCompetitor.name}</h3>

              <ol className="news-list">
                {selectedCompetitor.news.map((item, index) => (
                  <li key={`${selectedCompetitor.id}-news-${index}`}>
                    <span>{item.text}</span>
                    <small>
                      Source: <SourceLink>{item.source}</SourceLink>
                    </small>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <MetricLine metric={selectedCompetitor.reportCount} iconType="chart" />

          <MetricLine metric={selectedCompetitor.employeeCount} iconType="people" />

          <section className="monitor-section updates-section">
            <div className="section-icon updates">
              <BoxIcon />
            </div>

            <div className="section-content">
              <h3>Product updates / Company updates</h3>

              <ol className="updates-list">
                {selectedCompetitor.updates.map((item, index) => (
                  <li key={`${selectedCompetitor.id}-update-${index}`}>
                    <span>{item.text}</span>
                    <small>
                      {item.date ? <>On date: {item.date}. </> : null}
                      Source: <SourceLink>{item.source}</SourceLink>
                    </small>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </section>

        <aside className="competitor-panel">
          <div className="competitor-panel-heading">
            <p className="eyebrow">Monitoring list</p>
            <h3>Competitors</h3>
          </div>

          <div className="competitor-list">
            {competitors.map((competitor) => {
              const isSelected = competitor.id === selectedId;

              return (
                <button
                  key={competitor.id}
                  className={`competitor-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedId(competitor.id)}
                  aria-pressed={isSelected}
                >
                  <span className="competitor-icon">
                    <GlobeIcon />
                  </span>

                  <span className="competitor-copy">
                    <strong>{competitor.name}</strong>
                    <small>{competitor.status}</small>
                  </span>

                  <span className="chevron">›</span>
                </button>
              );
            })}
          </div>

          <div className="future-note">
            <span>Next integration</span>
            <p>
              Connect this module to Google Search, LinkedIn page checks, website
              crawlers, and report-count comparison APIs.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;

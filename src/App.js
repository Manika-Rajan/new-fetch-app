import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const COMPETITOR_API_URL = "https://d1qzxptevf.execute-api.ap-south-1.amazonaws.com/prod/coe/competitors/latest";

const fallbackCompetitors = [
  {
    id: "loading",
    competitor_id: "loading",
    name: "Loading competitors...",
    domain: "",
    type: "Please wait",
    status: "Loading",
    priority: 999,
    last_checked_at: null,
    updated_at: "",
    news: [],
    updates: [],
    reportCount: {
      label: "Website report count change",
      from: "0",
      to: "0",
      change: "0",
    },
    employeeCount: {
      label: "LinkedIn employee count change",
      from: "0",
      to: "0",
      change: "0",
    },
  },
];

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
      <a
        className="source-link"
        href="#source"
        onClick={(event) => event.preventDefault()}
      >
        {children}
      </a>
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
          Changed from <strong>{metric?.from || "0"}</strong> to{" "}
          <strong>{metric?.to || "0"}</strong>
          <span className="delta-badge">{metric?.change || "0"}</span>
        </p>
      </div>
    </section>
  );
}

function EmptyListMessage({ text }) {
  return <p className="metric-text">{text}</p>;
}

function App() {
  const [competitors, setCompetitors] = useState(fallbackCompetitors);
  const [selectedId, setSelectedId] = useState("");
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

        if (apiCompetitors.length === 0) {
          setCompetitors([]);
          setSelectedId("");
          setLoadError("No competitor records found in latest table.");
          return;
        }

        setCompetitors(apiCompetitors);
        setSelectedId(apiCompetitors[0].id || apiCompetitors[0].competitor_id);
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to load competitors:", error);
        setCompetitors([]);
        setSelectedId("");
        setLoadError(
          "Unable to load competitor data. Please check the API Gateway URL and CORS settings."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
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
          competitor.id === selectedId ||
          competitor.competitor_id === selectedId
      ) || competitors[0]
    );
  }, [competitors, selectedId]);

  const summary = useMemo(() => {
    if (!selectedCompetitor) {
      return {
        monitored: 0,
        highActivity: 0,
        totalSignals: 0,
      };
    }

    return {
      monitored: competitors.length,
      highActivity: competitors.filter((item) =>
        String(item.status || "").toLowerCase().includes("high")
      ).length,
      totalSignals:
        (selectedCompetitor.news || []).length +
        (selectedCompetitor.updates || []).length +
        2,
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
          <h2>Competitor Monitoring</h2>
          <p>
            Track competitor news, website changes, LinkedIn changes, and product
            updates.
          </p>
        </div>
      </header>

      <main className="monitor-shell">
        <section className="details-panel">
          {loading ? (
            <div className="details-header">
              <div>
                <p className="eyebrow">Loading</p>
                <h2>Loading competitors...</h2>
                <p className="competitor-type">
                  Fetching latest records from DynamoDB.
                </p>
              </div>
            </div>
          ) : loadError ? (
            <div className="details-header">
              <div>
                <p className="eyebrow">Error</p>
                <h2>Unable to load data</h2>
                <p className="competitor-type">{loadError}</p>
              </div>
            </div>
          ) : selectedCompetitor ? (
            <>
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

              <section className="monitor-section updates-section">
                <div className="section-icon updates">
                  <BoxIcon />
                </div>

                <div className="section-content">
                  <h3>Product updates / Company updates</h3>

                  {(selectedCompetitor.updates || []).length > 0 ? (
                    <ol className="updates-list">
                      {selectedCompetitor.updates.map((item, index) => (
                        <li key={`${selectedCompetitor.id}-update-${index}`}>
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
                    <EmptyListMessage text="No product or company updates found yet. This will populate after the daily collector runs." />
                  )}
                </div>
              </section>

              <section className="monitor-section news-section">
                <div className="section-icon news">
                  <NewsIcon />
                </div>

                <div className="section-content">
                  <h3>Latest news in internet about {selectedCompetitor.name}</h3>

                  {(selectedCompetitor.news || []).length > 0 ? (
                    <ol className="news-list">
                      {selectedCompetitor.news.map((item, index) => (
                        <li key={`${selectedCompetitor.id}-news-${index}`}>
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
                    <EmptyListMessage text="No news items found yet. This will populate after the daily collector runs." />
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
            <div className="details-header">
              <div>
                <p className="eyebrow">No records</p>
                <h2>No competitors found</h2>
                <p className="competitor-type">
                  Please add records to the latest table.
                </p>
              </div>
            </div>
          )}
        </section>

        <aside className="competitor-panel">
          <div className="competitor-panel-heading">
            <p className="eyebrow">Monitoring list</p>
            <h3>Competitors</h3>
          </div>

          <div className="competitor-list">
            {competitors.map((competitor) => {
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
                  disabled={loading}
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

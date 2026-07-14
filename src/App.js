import React, { useMemo, useState } from "react";
import "./App.css";

const navItems = [
  "Executive Dashboard",
  "Market Intelligence",
  "Report Opportunities",
  "Website Insights",
  "Google Ads Insights",
  "Reports Performance",
  "AI Chat Assistant",
  "Alerts & Notifications",
  "Knowledge Hub",
  "Settings",
];

const kpis = [
  {
    label: "Total Report Opportunities",
    value: "128",
    change: "+18 this week",
    tone: "blue",
  },
  {
    label: "High Demand Opportunities",
    value: "42",
    change: "Strong demand signals",
    tone: "green",
  },
  {
    label: "Website Search Queries",
    value: "24.6K",
    change: "+11.4% vs last week",
    tone: "purple",
  },
  {
    label: "Top Performing Reports",
    value: "17",
    change: "Conversion-ready reports",
    tone: "orange",
  },
];

const opportunities = [
  {
    title: "EV Charging Station Business in India",
    demand: 94,
    status: "High demand",
    reason: "Rising website searches + strong Google Ads intent",
    sources: ["Google Ads", "Website Search", "Report Catalog"],
  },
  {
    title: "Cold Pressed Oil Manufacturing Business",
    demand: 88,
    status: "Ready to promote",
    reason: "Entrepreneur searches are increasing across metro cities",
    sources: ["Website Search", "Trends"],
  },
  {
    title: "Biodegradable Packaging Market in India",
    demand: 85,
    status: "Create report",
    reason: "Sustainability searches and B2B demand signals are moving up",
    sources: ["Trends", "AI Suggestion"],
  },
  {
    title: "Ready-Made Garments Export Opportunities",
    demand: 81,
    status: "Update existing report",
    reason: "Import/export buyer interest can be connected with RBR data",
    sources: ["DynamoDB", "Website Search"],
  },
];

const trendingIndustries = [
  { name: "EV Infrastructure", score: 96, note: "High search intent" },
  { name: "Food Processing", score: 91, note: "SME-friendly demand" },
  { name: "Packaging", score: 87, note: "B2B growth signals" },
  { name: "Pharma Ingredients", score: 82, note: "Export-linked interest" },
  { name: "Textiles & Garments", score: 79, note: "Buyer lead opportunity" },
];

const websiteSearches = [
  { query: "dimethyl amine", count: 218, intent: "Industrial buyer research" },
  { query: "ev charging business", count: 194, intent: "Business opportunity" },
  { query: "cold pressed oil project report", count: 173, intent: "Purchase intent" },
  { query: "paper cup manufacturing", count: 151, intent: "Startup planning" },
  { query: "garments export buyers", count: 139, intent: "Export opportunity" },
];

const adsRows = [
  {
    campaign: "RBR – Search – Business Reports",
    clicks: 1432,
    cost: "₹18,420",
    leads: 41,
    quality: "Medium",
  },
  {
    campaign: "RBR | Entrepreneurs",
    clicks: 982,
    cost: "₹9,880",
    leads: 34,
    quality: "High",
  },
  {
    campaign: "RBR – Search – Prebook – High Intent",
    clicks: 326,
    cost: "₹5,140",
    leads: 19,
    quality: "High",
  },
];

const reportPerformance = [
  { report: "EV Charging Station Market Report", views: 1120, buys: 19 },
  { report: "Cold Pressed Oil Business Report", views: 970, buys: 14 },
  { report: "FMCG Distribution Business Report", views: 850, buys: 11 },
  { report: "Paper Cup Manufacturing Report", views: 790, buys: 9 },
];

const aiInsights = [
  "Prioritize reports where website searches and Google Ads keywords overlap.",
  "Create one landing page per high-demand opportunity before increasing ad budget.",
  "Move high-intent searches into a weekly report creation queue.",
  "Use AI to compare existing report catalog with unmet search demand.",
];

const alerts = [
  {
    title: "High search spike detected",
    description: "EV charging and food processing searches increased sharply.",
    level: "Important",
  },
  {
    title: "Report refresh suggested",
    description: "Cold Pressed Oil report has strong traffic but should be updated.",
    level: "Action",
  },
  {
    title: "New opportunity cluster",
    description: "Packaging-related search terms are forming a new report category.",
    level: "Watch",
  },
];

function App() {
  const [activeNav, setActiveNav] = useState("Executive Dashboard");
  const [selectedOpportunity, setSelectedOpportunity] = useState(opportunities[0]);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text:
        "Hello Rajan. I am ready to analyze RBR demand signals, website searches, Google Ads performance, and report opportunities.",
    },
  ]);

  const totalAdLeads = useMemo(
    () => adsRows.reduce((sum, row) => sum + row.leads, 0),
    []
  );

  const handleNavClick = (item) => {
    setActiveNav(item);
    const element = document.getElementById(item.replaceAll(" ", "-"));
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const createAiReply = (question) => {
    const lower = question.toLowerCase();

    if (lower.includes("high demand") || lower.includes("opportunities")) {
      return "The strongest current opportunities are EV Charging Station Business, Cold Pressed Oil Manufacturing, Biodegradable Packaging, and Ready-Made Garments Export Opportunities. These should be prioritized because they combine user search interest, paid traffic intent, and report monetization potential.";
    }

    if (lower.includes("trending") || lower.includes("industries")) {
      return "Top trending industries right now are EV Infrastructure, Food Processing, Packaging, Pharma Ingredients, and Textiles & Garments. EV Infrastructure has the highest urgency because demand is both consumer-facing and business-facing.";
    }

    if (lower.includes("website") || lower.includes("searching")) {
      return "Users are searching for industrial chemicals, EV charging business ideas, cold pressed oil project reports, paper cup manufacturing, and garments export buyers. These searches should be grouped into report opportunity clusters.";
    }

    if (lower.includes("ads") || lower.includes("google")) {
      return "Google Ads should be optimized around high-intent report terms. The best next step is to separate business idea traffic, project report traffic, and buyer/export traffic into different landing page flows.";
    }

    return "My recommendation is to compare three signals together: website searches, Google Ads search terms, and existing report catalog coverage. Wherever demand is high but report coverage is weak, create or update a report first.";
  };

  const sendMessage = (textFromButton) => {
    const finalText = textFromButton || chatInput.trim();
    if (!finalText) return;

    const userMessage = { role: "user", text: finalText };
    const aiMessage = { role: "ai", text: createAiReply(finalText) };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setChatInput("");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">AI</div>
          <div>
            <h1>RBR AI CoE</h1>
            <p>India Command Center</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item}
              className={`nav-item ${activeNav === item ? "active" : ""}`}
              onClick={() => handleNavClick(item)}
            >
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="mini-label">System Mode</p>
          <h3>Frontend Preview</h3>
          <p>
            Data is currently sample data. API connections can be added after
            deployment.
          </p>
        </div>
      </aside>

      <main className="main-content">
        <section className="hero-section" id="Executive-Dashboard">
          <div>
            <p className="eyebrow">Rajan Business Reports</p>
            <h2>Welcome to RBR AI CoE India</h2>
            <p className="hero-copy">
              AI-powered insights for report opportunities, trending industries,
              website searches, Google Ads performance, and growth decisions.
            </p>

            <div className="hero-actions">
              <button onClick={() => handleNavClick("Report Opportunities")}>
                View Report Opportunities
              </button>
              <button
                className="ghost"
                onClick={() => handleNavClick("AI Chat Assistant")}
              >
                Ask RBR AI
              </button>
            </div>
          </div>

          <div className="hero-panel">
            <p>Today’s focus</p>
            <h3>Find high-demand reports before competitors do.</h3>
            <div className="signal-row">
              <span>Google Ads</span>
              <span>Website Searches</span>
              <span>Report Catalog</span>
            </div>
          </div>
        </section>

        <section className="kpi-grid">
          {kpis.map((kpi) => (
            <article key={kpi.label} className={`kpi-card ${kpi.tone}`}>
              <p>{kpi.label}</p>
              <h3>{kpi.value}</h3>
              <span>{kpi.change}</span>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel large" id="Report-Opportunities">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Opportunity Engine</p>
                <h3>High Demand Report Opportunities</h3>
              </div>
              <span className="pill">AI Ranked</span>
            </div>

            <div className="opportunity-list">
              {opportunities.map((item) => (
                <button
                  key={item.title}
                  className={`opportunity-card ${
                    selectedOpportunity.title === item.title ? "selected" : ""
                  }`}
                  onClick={() => setSelectedOpportunity(item)}
                >
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.reason}</p>
                    <div className="source-row">
                      {item.sources.map((source) => (
                        <span key={source}>{source}</span>
                      ))}
                    </div>
                  </div>
                  <div className="score-block">
                    <strong>{item.demand}</strong>
                    <small>Demand</small>
                  </div>
                </button>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Selected Opportunity</p>
                <h3>{selectedOpportunity.title}</h3>
              </div>
            </div>

            <div className="selected-box">
              <p className="status-text">{selectedOpportunity.status}</p>
              <div className="big-score">{selectedOpportunity.demand}</div>
              <p>{selectedOpportunity.reason}</p>
              <button className="full-button">Prepare Report Plan</button>
            </div>
          </article>

          <article className="panel" id="Market-Intelligence">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Market Intelligence</p>
                <h3>Top Trending Industries Right Now?</h3>
              </div>
            </div>

            <div className="trend-list">
              {trendingIndustries.map((industry) => (
                <div className="trend-row" key={industry.name}>
                  <div>
                    <strong>{industry.name}</strong>
                    <span>{industry.note}</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${industry.score}%` }}
                    />
                  </div>
                  <b>{industry.score}</b>
                </div>
              ))}
            </div>
          </article>

          <article className="panel" id="Website-Insights">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Website Demand</p>
                <h3>What are users searching most on our website?</h3>
              </div>
            </div>

            <div className="search-list">
              {websiteSearches.map((item, index) => (
                <div className="search-row" key={item.query}>
                  <span className="rank">{index + 1}</span>
                  <div>
                    <strong>{item.query}</strong>
                    <p>{item.intent}</p>
                  </div>
                  <b>{item.count}</b>
                </div>
              ))}
            </div>
          </article>

          <article className="panel wide" id="Google-Ads-Insights">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Paid Traffic Intelligence</p>
                <h3>Google Ads Performance Overview</h3>
              </div>
              <span className="pill green">{totalAdLeads} leads</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Clicks</th>
                    <th>Cost</th>
                    <th>Leads</th>
                    <th>Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {adsRows.map((row) => (
                    <tr key={row.campaign}>
                      <td>{row.campaign}</td>
                      <td>{row.clicks}</td>
                      <td>{row.cost}</td>
                      <td>{row.leads}</td>
                      <td>
                        <span
                          className={`quality ${
                            row.quality === "High" ? "high" : "medium"
                          }`}
                        >
                          {row.quality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel" id="Reports-Performance">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Report Sales Signals</p>
                <h3>Reports Performance</h3>
              </div>
            </div>

            <div className="report-list">
              {reportPerformance.map((item) => {
                const conversion =
                  item.views === 0 ? 0 : ((item.buys / item.views) * 100).toFixed(1);

                return (
                  <div className="report-row" key={item.report}>
                    <div>
                      <strong>{item.report}</strong>
                      <span>
                        {item.views} views · {item.buys} buys
                      </span>
                    </div>
                    <b>{conversion}%</b>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="panel" id="AI-Chat-Assistant">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">AI Assistant</p>
                <h3>Ask RBR AI</h3>
              </div>
            </div>

            <div className="quick-prompts">
              <button onClick={() => sendMessage("high demand report opportunities")}>
                High demand report opportunities
              </button>
              <button onClick={() => sendMessage("top trending industries right now")}>
                Top trending industries
              </button>
              <button
                onClick={() =>
                  sendMessage("What are users searching most on our website?")
                }
              >
                Website searches
              </button>
            </div>

            <div className="chat-box">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  {message.text}
                </div>
              ))}
            </div>

            <div className="chat-input-row">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask about sales, trends, searches, ads, or reports..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
              />
              <button onClick={() => sendMessage()}>Ask</button>
            </div>
          </article>

          <article className="panel" id="Alerts-&-Notifications">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Action Center</p>
                <h3>Alerts & Notifications</h3>
              </div>
            </div>

            <div className="alert-list">
              {alerts.map((alert) => (
                <div className="alert-card" key={alert.title}>
                  <span>{alert.level}</span>
                  <strong>{alert.title}</strong>
                  <p>{alert.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel" id="Knowledge-Hub">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Knowledge Hub</p>
                <h3>AI Insights Summary</h3>
              </div>
            </div>

            <ul className="insight-list">
              {aiInsights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </article>

          <article className="panel wide" id="Settings">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">System Setup</p>
                <h3>Future Data Connections</h3>
              </div>
            </div>

            <div className="connection-grid">
              <div>
                <strong>Google Trends</strong>
                <p>Connect trending industry signals.</p>
              </div>
              <div>
                <strong>Google Ads</strong>
                <p>Connect campaign, keyword, and search term performance.</p>
              </div>
              <div>
                <strong>Website Searches</strong>
                <p>Connect S3 daily website search logs.</p>
              </div>
              <div>
                <strong>Report Catalog</strong>
                <p>Connect existing RBR report list and sales performance.</p>
              </div>
              <div>
                <strong>ChatGPT</strong>
                <p>Connect AI recommendations and opportunity scoring.</p>
              </div>
              <div>
                <strong>DynamoDB</strong>
                <p>Connect report metadata, buyers, and company records.</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;

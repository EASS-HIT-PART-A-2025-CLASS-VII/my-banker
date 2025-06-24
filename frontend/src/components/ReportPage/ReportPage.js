import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReportPage.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

export default function ReportPage() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const token = localStorage.getItem('jwt_token');

    try {
      const response = await fetch('http://localhost:8000/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ walletAddress, chain }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();

      if (data.data?.message) {
        setReport(data.data.message);
      } else {
        setError('Error fetching report');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatInsights = (text) => {
    if (!text) return [];

    return text
      .split('\n')
      .map((line, index) => {
        line = line.trim();
        if (!line) return null;

        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h4 key={index} className="insight-title">
              {line.replace(/\*\*/g, '')}
            </h4>
          );
        } else if (line.match(/^\d+\./)) {
          return (
            <div key={index} className="insight-point">
              <div className="bullet-point"></div>
              <p className="insight-text">{line}</p>
            </div>
          );
        } else if (line.startsWith('*')) {
          return (
            <div key={index} className="insight-sub-point">
              <div className="sub-bullet"></div>
              <p className="sub-insight-text">{line.replace(/^\*\s*/, '')}</p>
            </div>
          );
        } else if (line.trim()) {
          return <p key={index} className="insight-paragraph">{line}</p>;
        }
        return null;
      })
      .filter(Boolean);
  };

  const getTopHoldings = () => {
    if (!report?.balances) return [];

    const holdings = [];

    if (report.balances.nativeBalance) {
      holdings.push({
        symbol: report.balances.nativeBalance.symbol,
        balance: report.balances.nativeBalance.balance,
        type: 'native'
      });
    }

    if (report.balances.tokens) {
      report.balances.tokens.forEach(token => {
        holdings.push({
          symbol: token.symbol,
          balance: token.balance,
          type: 'token'
        });
      });
    }

    return holdings.filter(holding => holding.balance > 0);
  };

  const getTotalTransactions = () => {
    if (!report?.actions) return 0;
    return Object.values(report.actions).reduce((total, action) => {
      return total + (action.totalActions || 0);
    }, 0);
  };

  const getDiversificationData = () => {
    if (!report?.balances) return { labels: [], datasets: [] };

    const holdings = getTopHoldings();
    const labels = holdings.map(h => h.symbol);
    // Equal distribution - each asset gets same slice size
    const data = holdings.map(() => 1);

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#F9B64D', '#E8A83E', '#D6962F', '#C48420',
          '#B27211', '#A06002', '#8E4E00', '#7C3C00'
        ],
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }]
    };
  };

  const getTradingActivityData = () => {
    if (!report?.actions) return { labels: [], datasets: [] };

    const assets = Object.keys(report.actions)
      .filter(symbol => {
        const action = report.actions[symbol];
        return action && (action.buyActions > 0 || action.sellActions > 0);
      })
      .slice(0, 6);

    const buyData = assets.map(symbol => report.actions[symbol]?.buyActions || 0);
    const sellData = assets.map(symbol => report.actions[symbol]?.sellActions || 0);

    return {
      labels: assets,
      datasets: [
        {
          label: 'Acquisitions',
          data: buyData,
          backgroundColor: '#10B981',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Dispositions',
          data: sellData,
          backgroundColor: '#EF4444',
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    };
  };

  const formatBalance = (balance) => {
    const num = parseFloat(balance);
    if (isNaN(num)) return balance;

    if (num > 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num > 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else if (num < 1) {
      return num.toFixed(6);
    }
    return num.toLocaleString();
  };

  return (
    <div className="report-page">
      <header className="report-header">
        <div className="report-header-content">
          <button className="back-btn" onClick={() => navigate('/')}>
            ←
          </button>
          <h1 className="header-title">Portfolio Analysis Report</h1>
        </div>
      </header>

      <div className="report-form-container">
        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Wallet Address</label>
              <input
                type="text"
                placeholder="Enter your wallet address..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Blockchain Network</label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="form-select"
              >
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="avalanche">Avalanche</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="optimism">Optimism</option>
                <option value="fantom">Fantom</option>
                <option value="binance">Binance Smart Chain</option>
                <option value="sepolia">Sepolia</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Generate Report'}
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </form>
      </div>

      {report && (
        <div className="report-container">
          <section className="executive-summary">
            <h2 className="summary-title">Executive Summary</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">
                  {report.balances?.tokens?.length ? report.balances.tokens.length + 1 : 1}
                </div>
                <div className="metric-label">Asset Classes</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">
                  {getTotalTransactions()}
                </div>
                <div className="metric-label">Total Transactions</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">
                  {report.balances?.nativeBalance ? formatBalance(report.balances.nativeBalance.balance) : '0'}
                </div>
                <div className="metric-label">
                  {report.balances?.nativeBalance?.symbol || 'Native'} Holdings
                </div>
              </div>
            </div>
          </section>

          {getTopHoldings().length > 0 && (
            <section className="report-section">
              <h2 className="section-title">Asset Distribution</h2>
              <div className="chart-wrapper">
                <Doughnut
                  data={getDiversificationData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          color: '#E8F4FD',
                          font: { size: 12, weight: '500' },
                          padding: 12
                        }
                      }
                    }
                  }}
                />
              </div>
            </section>
          )}

          {Object.keys(report.actions || {}).length > 0 && (
            <section className="report-section">
              <h2 className="section-title">Top Trading Activity</h2>
              <div className="chart-wrapper">
                <Bar
                  data={getTradingActivityData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: '#E8F4FD', font: { weight: '500', size: 12 } }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: '#A0AEC0', font: { weight: '500', size: 11 } },
                        grid: { color: 'rgba(249, 182, 77, 0.1)' }
                      },
                      y: {
                        ticks: { color: '#A0AEC0', font: { weight: '500', size: 11 } },
                        grid: { color: 'rgba(249, 182, 77, 0.1)' },
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </section>
          )}

          {report.insights && (
            <section className="insights-section">
              <div className="ai-header">
                <div className="ai-icon">AI</div>
                <h2 className="ai-title">Strategic Analysis & Recommendations</h2>
              </div>
              <div className="insights-content">
                {formatInsights(report.insights)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
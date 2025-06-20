import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReportPage.css';

import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
    return text
      .replace(/^---|---$/g, '')
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**')) {
          return <h4 key={index}>{line.replace(/\*\*/g, '')}</h4>;
        } else if (line.trim().startsWith('*')) {
          return <li key={index}>{line.replace('*', '').trim()}</li>;
        } else if (line.trim()) {
          return <p key={index}>{line}</p>;
        } else {
          return null;
        }
      });
  };

  return (
    <div className="report-page">
      <header className="report-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ←
        </button>
        <h1>Wallet Report</h1>
      </header>

      <form className="report-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={e => setWalletAddress(e.target.value)}
          required
        />
        <select value={chain} onChange={e => setChain(e.target.value)}>
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="avalanche">Avalanche</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="optimism">Optimism</option>
          <option value="fantom">Fantom</option>
          <option value="binance">Binance Smart Chain</option>
          <option value="sepolia">Sepolia</option>
        </select>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      {report && (
        <section className="report-container">
          <section className="report-section balances-section">
            <h2>Balances</h2>
            <p><strong>Native:</strong> {report.balances.nativeBalance.balance} {report.balances.nativeBalance.symbol}</p>
            {report.balances.tokens.length > 0 ? (
              <ul className="tokens-list">
                {report.balances.tokens.map((token, i) => (
                  <li key={i}><strong>{token.symbol}:</strong> {token.balance}</li>
                ))}
              </ul>
            ) : (
              <p>No tokens held.</p>
            )}
          </section>

          <section className="report-section charts-section">
            <h2>Portfolio Breakdown</h2>
            <div className="chart-wrapper">
              <Bar
                data={{
                  labels: [
                    report.balances.nativeBalance.symbol,
                    ...report.balances.tokens.map(token => token.symbol)
                  ],
                  datasets: [
                    {
                      label: 'Estimated Value (USD)',
                      data: [
                        1,
                        ...report.balances.tokens.map(() => 1)
                      ],
                      backgroundColor: '#F9B64D',
                      borderRadius: 8
                    }
                  ]
                }}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: () => 'Token held'
                      }
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    }
                  }
                }}
                height={150}
              />
            </div>

            <h2 style={{ marginTop: '2rem' }}>Buy vs Sell Actions</h2>
            <div className="chart-wrapper">
              <Bar
                data={{
                  labels: ['Buy', 'Sell'],
                  datasets: [
                    {
                      label: 'Actions',
                      data: [report.actions.buyActions, report.actions.sellActions],
                      backgroundColor: ['#36A2EB', '#FF6384'],
                      borderRadius: 8,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
                height={150}
              />
            </div>
          </section>


          <section className="report-section actions-section">
            <h2>Actions Summary</h2>
            <dl>
              <dt>Calculation Method:</dt>
              <dd>{report.actions.calculationMethod}</dd>

              <dt>Total Actions:</dt>
              <dd>{report.actions.totalActions}</dd>

              <dt>Buy Actions:</dt>
              <dd>{report.actions.buyActions}</dd>

              <dt>Sell Actions:</dt>
              <dd>{report.actions.sellActions}</dd>

              <dt>Trading Volume:</dt>
              <dd>{report.actions.tradingVolume}</dd>

              <dt>Average Trade Size:</dt>
              <dd>{report.actions.avgTradeSize}</dd>
            </dl>
          </section>

          <section className="report-section pnl-section">
            <h2>Profit & Loss</h2>
            <dl>
              <dt>Gain:</dt>
              <dd>{report.profitAndLoss.Gains}</dd>

              <dt>Loss:</dt>
              <dd>{report.profitAndLoss.Loss}</dd>

              <dt>Fees:</dt>
              <dd>{report.profitAndLoss.Fees}</dd>

              <dt>Return %:</dt>
              <dd>{report.profitAndLoss.portfolioReturnPercent}%</dd>
            </dl>
          </section>

          <section className="report-section insights-section">
            <h2>Insights</h2>
            <ul className="insights-list">
              {formatInsights(report.insights)}
            </ul>
          </section>
        </section>
      )}

    </div>
  );
}

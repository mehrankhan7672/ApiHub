import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("Mingora");
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  // Currency selection states
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [currencyAmount, setCurrencyAmount] = useState(1);

  // Loading states
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [currencyLoading, setCurrencyLoading] = useState(false);

  // Error states
  const [weatherError, setWeatherError] = useState(null);
  const [newsError, setNewsError] = useState(null);
  const [currencyError, setCurrencyError] = useState(null);

  // Backend connection state
  const [backendStatus, setBackendStatus] = useState("checking");
  const [backendUrl, setBackendUrl] = useState(
    "https://api-hub-ldzd.vercel.app",
  );

  // Complete currencies list with flags
  const allCurrencies = [
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
    { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
    { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
    { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
    { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
    { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
    { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
    { code: "QAR", name: "Qatari Riyal", flag: "🇶🇦" },
    { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼" },
    { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭" },
    { code: "OMR", name: "Omani Rial", flag: "🇴🇲" },
    { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
    { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
    { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
    { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
    { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
    { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰" },
    { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵" },
  ];

  useEffect(() => {
    checkBackendConnection();
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      setDarkMode(savedTheme === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      ".service-section, .service-card, .info-card, .hero-content",
    );
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const checkBackendConnection = async () => {
    setBackendStatus("checking");
    try {
      const res = await axios.get(`${backendUrl}/api/test`, { timeout: 5000 });
      if (res.data.success) {
        setBackendStatus("connected");
        console.log("✅ Backend connected successfully");
      } else {
        setBackendStatus("disconnected");
      }
    } catch (err) {
      console.error("❌ Backend connection failed:", err.message);
      setBackendStatus("disconnected");
    }
  };

  const getWeather = async () => {
    if (backendStatus !== "connected") {
      setWeatherError("Backend server is not connected");
      return;
    }
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await axios.get(
        `${backendUrl}/api/weather?city=${encodeURIComponent(city)}`,
        { timeout: 10000 },
      );
      setWeather(res.data);
    } catch (err) {
      console.error("Weather error:", err);
      setWeatherError(
        err.response?.data?.details ||
          err.message ||
          "Failed to fetch weather data",
      );
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const getNews = async () => {
    if (backendStatus !== "connected") {
      setNewsError("Backend server is not connected");
      return;
    }
    setNewsLoading(true);
    setNewsError(null);
    try {
      const res = await axios.get(`${backendUrl}/api/news`, { timeout: 10000 });
      setNews(res.data.articles || []);
    } catch (err) {
      console.error("News error:", err);
      setNewsError(err.message || "Failed to fetch news");
      setNews([]);
    } finally {
      setNewsLoading(false);
    }
  };

  const getCurrency = async () => {
    if (backendStatus !== "connected") {
      setCurrencyError("Backend server is not connected");
      return;
    }
    setCurrencyLoading(true);
    setCurrencyError(null);
    try {
      const res = await axios.get(
        `${backendUrl}/api/currency?from=${fromCurrency}&to=${toCurrency}`,
        { timeout: 10000 },
      );
      setCurrency(res.data);
    } catch (err) {
      console.error("Currency error:", err);
      setCurrencyError(
        err.response?.data?.details ||
          err.message ||
          "Failed to fetch currency rate",
      );
      setCurrency(null);
    } finally {
      setCurrencyLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount =
    currency && currency.conversion_rate
      ? (currencyAmount * currency.conversion_rate).toFixed(2)
      : 0;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? "dark-theme" : "light-theme"}`}>
      {/* Modern Navigation with Dark Mode Toggle */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">⚡</div>
            <span className="logo-text">
              API<span className="logo-highlight">Hub</span>
            </span>
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#weather" className="nav-link">
              Weather
            </a>
            <a href="#news" className="nav-link">
              News
            </a>
            <a href="#currency" className="nav-link">
              Currency
            </a>
          </div>
          <div className="nav-actions">
            <button
              onClick={toggleDarkMode}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <div className={`status-badge status-${backendStatus}`}>
              {backendStatus === "connected"
                ? "🟢 Active"
                : backendStatus === "disconnected"
                  ? "🔴 Offline"
                  : "🟡 Connecting"}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            Premium API Services
          </div>
          <h1 className="hero-title">
            Power Your Applications
            <br />
            with <span className="hero-gradient">Real-Time Data</span>
          </h1>
          <p className="hero-description">
            Access enterprise-grade weather, news, and currency APIs with 99.9%
            uptime. Built for developers, trusted by businesses worldwide.
          </p>
          <div className="hero-buttons">
            <a href="#weather" className="btn-primary-large">
              Explore Services
            </a>
            <a href="#currency" className="btn-secondary-large">
              View Pricing →
            </a>
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <section className="service-section" id="weather">
        <div className="section-bg"></div>
        <div className="container">
          <div className="section-header">
            <span className="section-number">01</span>
            <span className="section-badge">🌤️ Weather Intelligence</span>
            <h2 className="section-title">
              Global Weather <span className="title-gradient">Forecast</span>
            </h2>
            <p className="section-subtitle">
              Get accurate real-time weather data for any city worldwide
            </p>
          </div>
          <div className="service-wrapper">
            <div className="service-info">
              <div className="info-card">
                <div className="info-icon">🌡️</div>
                <h3>Real-Time Temperature</h3>
                <p>Live updates from weather stations</p>
              </div>
              <div className="info-card">
                <div className="info-icon">💨</div>
                <h3>Wind Speed & Direction</h3>
                <p>Precise atmospheric data</p>
              </div>
              <div className="info-card">
                <div className="info-icon">💧</div>
                <h3>Humidity Levels</h3>
                <p>Accurate moisture readings</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📈</div>
                <h3>Barometric Pressure</h3>
                <p>Advanced weather metrics</p>
              </div>
            </div>
            <div className="service-card glass-effect">
              <div className="service-controls">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="modern-input"
                    onKeyPress={(e) => e.key === "Enter" && getWeather()}
                  />
                  <button
                    onClick={getWeather}
                    disabled={weatherLoading}
                    className="action-btn"
                  >
                    {weatherLoading ? (
                      <div className="spinner-small"></div>
                    ) : (
                      "🔍 Get Weather"
                    )}
                  </button>
                </div>
                {weatherError && (
                  <div className="error-message">{weatherError}</div>
                )}
                {weather && !weatherError && (
                  <div className="weather-display">
                    <div className="weather-main-data">
                      <div className="weather-temp-display">
                        <span className="temp-value">
                          {Math.round(weather.main?.temp)}
                        </span>
                        <span className="temp-unit">°C</span>
                      </div>
                      <div className="weather-location">
                        <h3>{weather.name}</h3>
                        <p>{weather.weather?.[0]?.description}</p>
                      </div>
                    </div>
                    <div className="weather-stats-grid">
                      <div className="stat-pill">
                        💧 {weather.main?.humidity}%
                      </div>
                      <div className="stat-pill">
                        💨 {weather.wind?.speed} m/s
                      </div>
                      <div className="stat-pill">
                        📈 {weather.main?.pressure} hPa
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="service-section alt" id="news">
        <div className="container">
          <div className="section-header">
            <span className="section-number">02</span>
            <span className="section-badge">📰 Global News Network</span>
            <h2 className="section-title">
              Breaking <span className="title-gradient">Headlines</span>
            </h2>
            <p className="section-subtitle">
              Stay informed with the latest news from trusted sources
            </p>
          </div>
          <div className="service-wrapper reverse">
            <div className="service-info">
              <div className="info-card">
                <div className="info-icon">🔥</div>
                <h3>Breaking News</h3>
                <p>Real-time updates on major events</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🎯</div>
                <h3>Trusted Sources</h3>
                <p>Curated from reputable outlets</p>
              </div>
              <div className="info-card">
                <div className="info-icon">⚡</div>
                <h3>Instant Updates</h3>
                <p>Always fresh content</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🌍</div>
                <h3>Global Coverage</h3>
                <p>News from around the world</p>
              </div>
            </div>
            <div className="service-card glass-effect">
              <div className="service-controls">
                <button
                  onClick={getNews}
                  disabled={newsLoading}
                  className="action-btn full-width"
                >
                  {newsLoading ? (
                    <div className="spinner-small"></div>
                  ) : (
                    "📡 Load Latest News"
                  )}
                </button>
                {newsError && <div className="error-message">{newsError}</div>}
                <div className="news-feed">
                  {news.length > 0 &&
                    news.map((item, index) => (
                      <div key={index} className="news-card-item">
                        <h4>{item.title}</h4>
                        <p>{item.description?.substring(0, 100)}...</p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read more →
                        </a>
                      </div>
                    ))}
                  {news.length === 0 && !newsLoading && !newsError && (
                    <div className="empty-state">
                      📭 Click "Load Latest News" to see headlines
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Currency Section with Get Rate Button */}
      <section className="service-section" id="currency">
        <div className="container">
          <div className="section-header">
            <span className="section-number">03</span>
            <span className="section-badge">💱 Currency Exchange</span>
            <h2 className="section-title">
              Live <span className="title-gradient">Exchange Rates</span>
            </h2>
            <p className="section-subtitle">
              Convert between 25+ world currencies with real-time rates
            </p>
          </div>
          <div className="service-wrapper">
            <div className="service-info">
              <div className="info-card">
                <div className="info-icon">⚡</div>
                <h3>Live Rates</h3>
                <p>Real-time exchange data</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🔄</div>
                <h3>Auto-Conversion</h3>
                <p>Instant calculations</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📊</div>
                <h3>25+ Currencies</h3>
                <p>Global coverage</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🎯</div>
                <h3>Accurate Rates</h3>
                <p>Premium data sources</p>
              </div>
            </div>
            <div className="service-card glass-effect">
              <div className="service-controls">
                <div className="currency-converter-panel">
                  <div className="amount-field">
                    <label>Amount</label>
                    <input
                      type="number"
                      value={currencyAmount}
                      onChange={(e) =>
                        setCurrencyAmount(parseFloat(e.target.value) || 0)
                      }
                      className="modern-input"
                    />
                  </div>
                  <div className="currency-fields">
                    <div className="currency-field">
                      <label>From</label>
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="modern-select"
                      >
                        {allCurrencies.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button onClick={swapCurrencies} className="swap-button">
                      ⇄
                    </button>
                    <div className="currency-field">
                      <label>To</label>
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="modern-select"
                      >
                        {allCurrencies.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={getCurrency}
                    disabled={currencyLoading}
                    className="action-btn get-rate-btn"
                  >
                    {currencyLoading ? (
                      <div className="spinner-small"></div>
                    ) : (
                      "💱 Get Exchange Rate"
                    )}
                  </button>

                  {currencyError && (
                    <div className="error-message">{currencyError}</div>
                  )}
                  {currency && !currencyError && (
                    <div className="currency-result-panel">
                      <div className="rate-box">
                        <span className="rate-label">Exchange Rate</span>
                        <span className="rate-value">
                          1 {fromCurrency} = {currency.conversion_rate}{" "}
                          {toCurrency}
                        </span>
                      </div>
                      <div className="conversion-box">
                        <span className="conversion-label">
                          Converted Amount
                        </span>
                        <span className="conversion-value">
                          {currencyAmount} {fromCurrency} ={" "}
                          <strong>
                            {convertedAmount} {toCurrency}
                          </strong>
                        </span>
                      </div>
                      {currency.last_updated && (
                        <div className="update-info">
                          🕒 Updated:{" "}
                          {new Date(currency.last_updated).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand-logo">⚡ APIHub</div>
              <p>Enterprise-grade API solutions for modern applications.</p>
            </div>
            <div className="footer-links-grid">
              <div className="footer-link-group">
                <h4>Services</h4>
                <a href="#weather">Weather API</a>
                <a href="#news">News API</a>
                <a href="#currency">Currency API</a>
              </div>
              <div className="footer-link-group">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
              </div>
              <div className="footer-link-group">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Security</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 APIHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

import React, { useEffect, useMemo, useState } from "react";
import { getRandomVersion, themes, trainingVersions } from "./data/questionBank.js";
import { revisionCards } from "./data/revisionCards.js";

const emptyThemeScores = () =>
  themes.reduce((scores, theme) => {
    scores[theme] = { correct: 0, total: 0 };
    return scores;
  }, {});

const normalize = (values = []) => [...values].sort().join("|");

function isCorrect(question, selected = []) {
  return normalize(question.answers) === normalize(selected);
}

function resultMessage(percent) {
  if (percent >= 85) return "Très solide : tu peux surtout revoir les erreurs restantes.";
  if (percent >= 65) return "Bon niveau : consolide les thèmes où le score descend.";
  if (percent >= 45) return "Base présente : refais une version et relis les fiches.";
  return "À retravailler : commence par les fiches puis refais les QCM par thème.";
}

function Header({ activeTab, setActiveTab, darkMode, setDarkMode }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">SAE 203</p>
        <h1>Révision SAE 203 – Gestion de tickets</h1>
      </div>
      <div className="header-actions">
        <nav className="tabs" aria-label="Navigation principale">
          <button className={activeTab === "training" ? "active" : ""} onClick={() => setActiveTab("training")}>
            Entraînement
          </button>
          <button className={activeTab === "revision" ? "active" : ""} onClick={() => setActiveTab("revision")}>
            Révision
          </button>
        </nav>
        <button className="icon-button" onClick={() => setDarkMode((value) => !value)} title="Changer de thème">
          {darkMode ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}

function VersionPicker({ onSelect }) {
  return (
    <section className="intro-section">
      <div className="intro-copy">
        <p>
          Choisis une version pour t'entraîner dans le format annoncé : 30 QCM puis 10 questions ouvertes.
          Les QCM sont corrigés automatiquement et les questions ouvertes affichent une correction attendue.
        </p>
      </div>
      <div className="version-grid">
        {trainingVersions.map((version) => (
          <button className="version-card" key={version.id} onClick={() => onSelect(version)}>
            <span>{version.label}</span>
            <strong>{version.mcq.length} QCM + {version.open.length} ouvertes</strong>
            <small>{version.description}</small>
          </button>
        ))}
        <button className="version-card random" onClick={() => onSelect(getRandomVersion())}>
          <span>Version aléatoire</span>
          <strong>30 QCM + 10 ouvertes</strong>
          <small>Tirage sans doublon depuis toute la banque.</small>
        </button>
      </div>
    </section>
  );
}

function ProgressBar({ answered, total }) {
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  return (
    <div className="progress-wrap" aria-label={`Progression ${percent}%`}>
      <div className="progress-meta">
        <span>Progression</span>
        <strong>{answered}/{total}</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function McqQuestion({ question, selected, submitted, onChange }) {
  const selectedValues = selected ?? [];
  const questionCorrect = submitted && isCorrect(question, selectedValues);

  function toggleAnswer(answerId) {
    if (submitted) return;
    if (question.type === "single") {
      onChange(question.id, [answerId]);
      return;
    }
    const next = selectedValues.includes(answerId)
      ? selectedValues.filter((value) => value !== answerId)
      : [...selectedValues, answerId];
    onChange(question.id, next);
  }

  return (
    <article className={`question-card ${submitted ? (questionCorrect ? "correct" : "wrong") : ""}`}>
      <div className="question-topline">
        <span className="theme-badge">{question.theme}</span>
        <span className="type-badge">{question.type === "single" ? "Choix simple" : "Choix multiple"}</span>
        <span className="source-badge">{question.source}</span>
      </div>
      <h3>{question.question}</h3>
      <div className="answers">
        {question.options.map((answer) => {
          const checked = selectedValues.includes(answer.id);
          const isExpected = question.answers.includes(answer.id);
          return (
            <label
              className={`answer ${checked ? "selected" : ""} ${submitted && isExpected ? "expected" : ""}`}
              key={answer.id}
            >
              <input
                type={question.type === "single" ? "radio" : "checkbox"}
                name={question.id}
                checked={checked}
                disabled={submitted}
                onChange={() => toggleAnswer(answer.id)}
              />
              <span className="answer-key">{answer.id}</span>
              <span>{answer.text}</span>
            </label>
          );
        })}
      </div>
      {submitted && (
        <div className="explanation">
          <strong>{questionCorrect ? "Bonne réponse." : "À revoir."}</strong>
          <span>{question.explanation}</span>
        </div>
      )}
    </article>
  );
}

function OpenQuestion({ question, value, showCorrection, onTextChange, onToggleCorrection }) {
  return (
    <article className="question-card open-question">
      <div className="question-topline">
        <span className="theme-badge">{question.theme}</span>
        <span className="type-badge">Question ouverte</span>
        <span className="source-badge">{question.source}</span>
      </div>
      <h3>{question.question}</h3>
      <textarea
        value={value ?? ""}
        onChange={(event) => onTextChange(question.id, event.target.value)}
        placeholder="Rédige ta réponse ici..."
      />
      <button className="secondary-button" onClick={() => onToggleCorrection(question.id)}>
        {showCorrection ? "Masquer la correction" : "Afficher les éléments attendus"}
      </button>
      {showCorrection && (
        <div className="open-correction">
          <strong>Éléments attendus</strong>
          <ul>
            {question.expectedPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <strong>Exemple de réponse</strong>
          <p>{question.sampleAnswer}</p>
        </div>
      )}
    </article>
  );
}

function Results({ version, answers }) {
  const score = version.mcq.reduce((total, question) => total + (isCorrect(question, answers[question.id]) ? 1 : 0), 0);
  const percent = Math.round((score / version.mcq.length) * 100);
  const themeScores = version.mcq.reduce((acc, question) => {
    acc[question.theme].total += 1;
    if (isCorrect(question, answers[question.id])) acc[question.theme].correct += 1;
    return acc;
  }, emptyThemeScores());

  return (
    <section className="results-panel">
      <div>
        <p className="eyebrow">Résultat QCM</p>
        <h2>{score}/{version.mcq.length} bonnes réponses</h2>
        <p>{resultMessage(percent)}</p>
      </div>
      <div className="score-ring" aria-label={`Score ${percent}%`}>
        {percent}%
      </div>
      <div className="theme-scores">
        {themes.map((theme) => {
          const item = themeScores[theme];
          const localPercent = item.total ? Math.round((item.correct / item.total) * 100) : 0;
          return (
            <div className="theme-score" key={theme}>
              <span>{theme}</span>
              <strong>{item.correct}/{item.total}</strong>
              <div className="mini-track">
                <div style={{ width: `${localPercent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TrainingView({ version, onBack }) {
  const [answers, setAnswers] = useState({});
  const [openAnswers, setOpenAnswers] = useState({});
  const [visibleCorrections, setVisibleCorrections] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setOpenAnswers({});
    setVisibleCorrections({});
    setSubmitted(false);
  }, [version.id]);

  const answeredCount = useMemo(() => {
    const mcqAnswered = version.mcq.filter((question) => (answers[question.id] ?? []).length > 0).length;
    const openAnswered = version.open.filter((question) => (openAnswers[question.id] ?? "").trim().length > 0).length;
    return mcqAnswered + openAnswered;
  }, [answers, openAnswers, version]);

  return (
    <main>
      <section className="training-header">
        <button className="secondary-button" onClick={onBack}>Changer de version</button>
        <div>
          <p className="eyebrow">{version.label}</p>
          <h2>{version.description}</h2>
        </div>
        <button className="primary-button" onClick={() => setSubmitted(true)}>Valider les QCM</button>
      </section>

      <ProgressBar answered={answeredCount} total={version.mcq.length + version.open.length} />

      {submitted && <Results version={version} answers={answers} />}

      <section className="question-section">
        <div className="section-title">
          <h2>QCM</h2>
          <span>{version.mcq.length} questions</span>
        </div>
        {version.mcq.map((question, index) => (
          <div className="numbered-card" key={question.id}>
            <span className="question-number">{index + 1}</span>
            <McqQuestion
              question={question}
              selected={answers[question.id]}
              submitted={submitted}
              onChange={(id, next) => setAnswers((current) => ({ ...current, [id]: next }))}
            />
          </div>
        ))}
      </section>

      <section className="question-section">
        <div className="section-title">
          <h2>Questions ouvertes</h2>
          <span>{version.open.length} questions</span>
        </div>
        {version.open.map((question, index) => (
          <div className="numbered-card" key={question.id}>
            <span className="question-number">{index + 1}</span>
            <OpenQuestion
              question={question}
              value={openAnswers[question.id]}
              showCorrection={Boolean(visibleCorrections[question.id])}
              onTextChange={(id, value) => setOpenAnswers((current) => ({ ...current, [id]: value }))}
              onToggleCorrection={(id) => setVisibleCorrections((current) => ({ ...current, [id]: !current[id] }))}
            />
          </div>
        ))}
      </section>
    </main>
  );
}

function RevisionView() {
  return (
    <main className="revision-layout">
      <section className="revision-hero">
        <p className="eyebrow">Mode révision</p>
        <h2>Les notions à retenir avant le contrôle</h2>
        <p>Ces fiches résument les points qui reviennent dans les TP : PHP, SQL, formulaires, CRUD et sécurité minimale.</p>
      </section>
      <section className="revision-grid">
        {revisionCards.map((card) => (
          <article className="revision-card" key={card.title}>
            <span className="theme-badge">{card.theme}</span>
            <h3>{card.title}</h3>
            <p>{card.summary}</p>
            <code>{card.example}</code>
          </article>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("training");
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("sae203-theme") === "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("sae203-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app-shell">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} setDarkMode={setDarkMode} />
      {activeTab === "training" ? (
        selectedVersion ? (
          <TrainingView version={selectedVersion} onBack={() => setSelectedVersion(null)} />
        ) : (
          <VersionPicker onSelect={setSelectedVersion} />
        )
      ) : (
        <RevisionView />
      )}
    </div>
  );
}

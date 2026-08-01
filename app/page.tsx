"use client";

import { useEffect, useMemo, useState } from "react";

const prompts = [
  {
    label: "今日训练 · 论证",
    title: "Can remote work improve researchers’ productivity?",
    task: "Write 120–180 words. State a clear position, support it with one mechanism and one example, then acknowledge a limitation.",
    tags: ["Claim", "Evidence", "Nuance"],
  },
  {
    label: "进阶训练 · 摘要",
    title: "Summarize a study on social media and well-being",
    task: "Write 100–150 words. Include the research question, method, main finding and implication without overstating causality.",
    tags: ["Precision", "Structure", "Caution"],
  },
  {
    label: "表达训练 · 讨论",
    title: "Explain why a null result can still be valuable",
    task: "Write 120–180 words for a Discussion section. Interpret the result, connect it to theory and propose one next step.",
    tags: ["Interpretation", "Synthesis", "Future work"],
  },
];

const phrases = [
  ["提出论点", "We argue that…", "The evidence suggests that…"],
  ["谨慎表达", "These findings may indicate…", "One possible explanation is…"],
  ["转折衔接", "Nevertheless,…", "Taken together,…"],
  ["说明局限", "This interpretation is limited by…", "A key caveat is that…"],
];

function scoreDraft(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.split(/[.!?]+/).filter((item) => item.trim().length > 5).length;
  const hasClaim = /\b(argue|suggest|demonstrate|indicate|show|propose|contend)\b/i.test(text);
  const hasEvidence = /\b(because|evidence|for example|for instance|result|study|data)\b/i.test(text);
  const hasNuance = /\b(however|although|nevertheless|limitation|caveat|may|might)\b/i.test(text);
  const connectors = (text.match(/\b(however|therefore|moreover|furthermore|consequently|in contrast|taken together)\b/gi) || []).length;
  const lengthScore = Math.min(30, Math.round((words / 140) * 30));
  const structureScore = Math.min(25, sentences * 4 + connectors * 3);
  const evidenceScore = (hasClaim ? 12 : 0) + (hasEvidence ? 13 : 0);
  const nuanceScore = hasNuance ? 20 : Math.min(10, connectors * 3);
  const total = Math.min(96, lengthScore + structureScore + evidenceScore + nuanceScore);
  return { words, total, hasClaim, hasEvidence, hasNuance, sentences };
}

export default function Home() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [streak, setStreak] = useState(6);
  const [view, setView] = useState<"practice" | "phrases">("practice");
  const result = useMemo(() => scoreDraft(draft), [draft]);
  const prompt = prompts[promptIndex];

  useEffect(() => {
    const saved = window.localStorage.getItem("scholarcraft-streak");
    if (saved) setStreak(Number(saved));
  }, []);

  function reviewDraft() {
    if (!draft.trim()) return;
    setReviewed(true);
    const next = Math.max(streak, 7);
    setStreak(next);
    window.localStorage.setItem("scholarcraft-streak", String(next));
  }

  function nextPrompt() {
    setPromptIndex((current) => (current + 1) % prompts.length);
    setDraft("");
    setReviewed(false);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Scholarcraft home">
          <span className="brand-mark">S</span>
          <span>Scholarcraft</span>
        </a>
        <nav aria-label="Main navigation">
          <button className={view === "practice" ? "nav-active" : ""} onClick={() => setView("practice")}>训练台</button>
          <button className={view === "phrases" ? "nav-active" : ""} onClick={() => setView("phrases")}>表达库</button>
          <a href="#method">学习方法</a>
        </nav>
        <div className="streak" title="连续训练天数"><span>◆</span> {streak} 天连续训练</div>
      </header>

      {view === "practice" ? (
        <>
          <section className="hero" id="top">
            <div className="eyebrow">ACADEMIC ENGLISH, DELIBERATELY PRACTICED</div>
            <h1>把复杂想法，写得<br /><em>清晰、有力、可信。</em></h1>
            <p>每天 15 分钟，练习学术写作中最关键的技能：论证、衔接、语气与精确表达。</p>
            <div className="hero-stats" aria-label="Learning progress">
              <div><strong>12</strong><span>已完成训练</span></div>
              <div><strong>2,840</strong><span>本月写作词数</span></div>
              <div><strong>+18%</strong><span>表达清晰度</span></div>
            </div>
          </section>

          <section className="workspace" aria-label="Daily writing practice">
            <div className="prompt-panel">
              <div className="section-kicker">{prompt.label}</div>
              <h2>{prompt.title}</h2>
              <p className="task-copy">{prompt.task}</p>
              <div className="prompt-tags">{prompt.tags.map((tag, index) => <span key={tag}><b>0{index + 1}</b>{tag}</span>)}</div>
              <div className="coach-note">
                <span className="coach-icon">✦</span>
                <div><strong>写作教练提示</strong><p>先用一句话写出中心论点。每一段只承担一个功能，避免用复杂词汇掩盖模糊逻辑。</p></div>
              </div>
              <button className="text-button" onClick={nextPrompt}>换一个题目 <span>→</span></button>
            </div>

            <div className="editor-panel">
              <div className="editor-head"><span>YOUR RESPONSE</span><span>{result.words} / 180 words</span></div>
              <textarea
                value={draft}
                onChange={(event) => { setDraft(event.target.value); setReviewed(false); }}
                placeholder="Begin with a clear claim…"
                aria-label="Academic writing response"
              />
              <div className="editor-actions">
                <span>⌘ Enter 提交</span>
                <button onClick={reviewDraft} disabled={!draft.trim()}>获得即时反馈 <b>→</b></button>
              </div>
            </div>
          </section>

          {reviewed && (
            <section className="feedback" aria-live="polite">
              <div className="score-ring"><strong>{result.total}</strong><span>/ 100</span></div>
              <div className="feedback-copy">
                <div className="section-kicker">即时诊断</div>
                <h2>{result.total >= 75 ? "论证框架已经很清楚。" : "基础已成形，再加强论证链。"}</h2>
                <div className="checks">
                  <p className={result.hasClaim ? "done" : "todo"}><span>{result.hasClaim ? "✓" : "→"}</span><b>中心论点</b> {result.hasClaim ? "已检测到明确的立场表达。" : "加入 argue, suggest 或 indicate 来标记主张。"}</p>
                  <p className={result.hasEvidence ? "done" : "todo"}><span>{result.hasEvidence ? "✓" : "→"}</span><b>证据支撑</b> {result.hasEvidence ? "论点后有理由或例证。" : "用 because 或 for example 补足论据。"}</p>
                  <p className={result.hasNuance ? "done" : "todo"}><span>{result.hasNuance ? "✓" : "→"}</span><b>学术语气</b> {result.hasNuance ? "表达保持了必要的审慎。" : "加入 may, however 或 limitation，避免过度断言。"}</p>
                </div>
              </div>
            </section>
          )}

          <section className="method" id="method">
            <div><div className="section-kicker">THE PRACTICE LOOP</div><h2>真正有效的写作训练，<br />不是“多看”，而是“刻意改”。</h2></div>
            <div className="method-grid">
              <article><span>01</span><h3>短写</h3><p>聚焦一个真实学术场景，控制在 15 分钟内完成。</p></article>
              <article><span>02</span><h3>诊断</h3><p>从论点、证据、结构与语气四个维度获得反馈。</p></article>
              <article><span>03</span><h3>重写</h3><p>只改一个最关键问题，让新表达成为长期能力。</p></article>
            </div>
          </section>
        </>
      ) : (
        <section className="phrase-page" id="top">
          <div className="section-kicker">ACADEMIC PHRASE BANK</div>
          <h1>别背“大词”。<br /><em>积累能完成任务的句型。</em></h1>
          <p className="phrase-intro">按写作功能整理的高频表达。点击任意句型即可复制到剪贴板。</p>
          <div className="phrase-grid">
            {phrases.map(([title, ...items], i) => (
              <article key={title}>
                <span>0{i + 1}</span><h2>{title}</h2>
                {items.map((item) => <button key={item} onClick={() => navigator.clipboard?.writeText(item)}>{item}<b>＋</b></button>)}
              </article>
            ))}
          </div>
          <button className="back-button" onClick={() => setView("practice")}>← 返回今日训练</button>
        </section>
      )}

      <footer><span>Scholarcraft © 2026</span><p>Write with clarity. Revise with purpose.</p></footer>
    </main>
  );
}

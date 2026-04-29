import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  DEFAULT_MEMBERS,
  REQUIRED_MEMBER_COUNT,
  TEAM_COUNT,
  createTeams,
  formatTeams,
  validateRoster,
  type Team,
} from "./teamUtils";

const DEFAULT_ROSTER = DEFAULT_MEMBERS.join("\n");
const STORAGE_KEY = "team-draw-h5-state";

type StoredState = {
  rosterText?: string;
  teams?: Team[];
  drawnAt?: string;
};

function loadStoredState(): StoredState {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return {};

  try {
    return JSON.parse(rawValue) as StoredState;
  } catch {
    return {};
  }
}

function buildDrawnAt() {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function App() {
  const storedState = useMemo(loadStoredState, []);
  const [rosterText, setRosterText] = useState(storedState.rosterText || DEFAULT_ROSTER);
  const [teams, setTeams] = useState<Team[]>(storedState.teams || []);
  const [drawnAt, setDrawnAt] = useState(storedState.drawnAt || "");
  const [isDrawing, setIsDrawing] = useState(false);
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => validateRoster(rosterText), [rosterText]);
  const canDraw = validation.ok && !isDrawing;
  const resultText = useMemo(() => formatTeams(teams), [teams]);

  useEffect(() => {
    const nextState: StoredState = { rosterText, teams, drawnAt };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }, [drawnAt, rosterText, teams]);

  const handleDraw = () => {
    if (!validation.ok) return;

    setCopied(false);
    setIsDrawing(true);
    setTeams([]);

    window.setTimeout(() => {
      setTeams(createTeams(validation.names));
      setDrawnAt(buildDrawnAt());
      setIsDrawing(false);
    }, 620);
  };

  const handleResetRoster = () => {
    setRosterText(DEFAULT_ROSTER);
    setTeams([]);
    setDrawnAt("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!resultText) return;

    await copyText(`抽签组队结果\n${resultText}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">16 人 · 8 组 · 每组 2 人</span>
          <h1>今晚怎么组队，交给手气。</h1>
          <p>
            输入名单，一键洗牌。结果留在本机，可复制给群聊，适合聚会、比赛、
            团建和课堂现场快速分组。
          </p>
        </div>

        <div className="hero-ticket" aria-hidden="true">
          <span>抽</span>
          <span>签</span>
        </div>
      </header>

      <main className="workspace">
        <section className="panel roster-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">名单</p>
              <h2>把 16 个人放进签筒</h2>
            </div>
            <span className={validation.ok ? "count-pill is-ready" : "count-pill"}>
              {validation.names.length}/{REQUIRED_MEMBER_COUNT}
            </span>
          </div>

          <textarea
            value={rosterText}
            onChange={(event) => setRosterText(event.target.value)}
            aria-label="参与抽签的成员名单"
            spellCheck={false}
          />

          <div className={validation.ok ? "helper is-ready" : "helper is-error"}>
            {validation.message}
          </div>

          <div className="roster-actions">
            <button className="primary-btn" type="button" disabled={!canDraw} onClick={handleDraw}>
              {isDrawing ? "摇签中..." : "开始抽签"}
            </button>
            <button className="ghost-btn" type="button" onClick={handleResetRoster}>
              恢复默认名单
            </button>
          </div>
        </section>

        <section className="panel result-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">结果</p>
              <h2>{teams.length > 0 ? "分组已经出炉" : "等待第一轮抽签"}</h2>
            </div>
            {drawnAt && <span className="time-pill">{drawnAt}</span>}
          </div>

          <div className={isDrawing ? "draw-stage is-drawing" : "draw-stage"}>
            {isDrawing && (
              <div className="shuffling-card">
                <span />
                <strong>正在洗牌</strong>
                <p>签纸翻飞，马上揭晓。</p>
              </div>
            )}

            {!isDrawing && teams.length === 0 && (
              <div className="empty-state">
                <div className="paper-stack">
                  <span />
                  <span />
                  <span />
                </div>
                <strong>先准备名单，再开始抽签</strong>
                <p>每轮都会重新随机打散，公平地生成 {TEAM_COUNT} 组。</p>
              </div>
            )}

            {!isDrawing && teams.length > 0 && (
              <div className="team-grid">
                {teams.map((team, index) => (
                  <article
                    className="team-card"
                    key={team.id}
                    style={{ "--delay": `${index * 55}ms` } as CSSProperties}
                  >
                    <span className="team-id">第 {team.id} 组</span>
                    <div className="members">
                      {team.members.map((member) => (
                        <strong key={member}>{member}</strong>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="result-actions">
            <button
              className="ghost-btn"
              type="button"
              disabled={!validation.ok || isDrawing || teams.length === 0}
              onClick={handleDraw}
            >
              重新抽一次
            </button>
            <button className="copy-btn" type="button" disabled={teams.length === 0} onClick={handleCopy}>
              {copied ? "已复制" : "复制结果"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

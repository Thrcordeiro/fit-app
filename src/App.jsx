import { useState, useEffect, useRef } from "react";

const TEAL = "#5ba4a4";

const DAYS = [
  { label: "Dom", full: "Domingo", short: 0 },
  { label: "Seg", full: "Segunda", short: 1 },
  { label: "Ter", full: "Terça", short: 2 },
  { label: "Qua", full: "Quarta", short: 3 },
  { label: "Qui", full: "Quinta", short: 4 },
  { label: "Sex", full: "Sexta", short: 5 },
  { label: "Sáb", full: "Sábado", short: 6 },
];

const meals = [
  {
    time: "7h", icon: "🌅", name: "Café da manhã",
    options: [
      "2 ovos mexidos + 1 fatia de pão integral + chá verde",
      "Shake de whey (1 scoop) + banana + aveia — bater com água ou leite vegetal",
      "Iogurte grego natural + frutas vermelhas + chia",
      "Tapioca fina com cottage e tomate cereja",
      "Omelete de 2 ovos com espinafre e cogumelo",
      "Panqueca de banana com aveia (sem açúcar)",
      "Bowl de iogurte + granola sem açúcar + kiwi",
    ],
    tip: "Sem açúcar, sem suco de caixinha", whey: false,
  },
  {
    time: "10h", icon: "🍎", name: "Lanche da manhã",
    options: [
      "1 maçã + punhado de castanhas do Pará",
      "1 banana + chá de hibisco gelado",
      "1 fatia de melão + 6 amêndoas",
      "Cenoura baby + homus caseiro",
      "1 kiwi + chá verde gelado",
      "2 damascos secos + 10 amendoins",
      "1 pera + chá de gengibre com limão",
    ],
    tip: "Evita barrinhas industrializadas", whey: false,
  },
  {
    time: "13h", icon: "🥗", name: "Almoço",
    options: [
      "Frango grelhado + abobrinha refogada + salada de folhas",
      "Peixe assado + batata-doce + brócolis no vapor",
      "Carne magra grelhada + arroz integral (½ xíc) + couve",
      "Salmão grelhado + espinafre + cenoura assada",
      "Frango desfiado + mandioquinha cozida + salada",
      "Tilápia ao forno com limão + vagem + tomate",
      "Bowl de quinoa + grão-de-bico + legumes assados",
    ],
    tip: "Tempera com limão, azeite e ervas — sem sal extra", whey: false,
  },
  {
    time: "16h30", icon: "🏋️‍♀️", name: "Pré-treino",
    options: [
      "1 banana + café preto sem açúcar",
      "1 fatia de pão integral + pasta de amendoim (1 col)",
      "1 maçã + 10 castanhas",
      "Shake leve: ½ scoop whey + água + 1 fruta pequena",
      "1 iogurte grego natural + 1 fruta",
      "Batata-doce pequena cozida + 1 ovo cozido",
      "1 banana amassada + aveia + canela",
    ],
    tip: "Come 45–60 min antes do treino. Leve, sem excesso.", whey: false,
  },
  {
    time: "19h", icon: "🥤", name: "Pós-treino (Whey)",
    options: [
      "Shake: 1 scoop whey + água + banana pequena",
      "Shake: 1 scoop whey + leite vegetal + 1 col de aveia",
      "Shake: 1 scoop whey + água de coco (200ml)",
      "Shake: 1 scoop whey + água + morango",
      "Shake: 1 scoop whey + água + canela — simples e rápido",
      "Shake: 1 scoop whey + leite vegetal + cacau em pó sem açúcar",
      "Shake: 1 scoop whey + água + 1 col de pasta de amendoim",
    ],
    tip: "Toma em até 40 min após o treino. Nos dias de descanso, toma no café da manhã.", whey: true,
  },
  {
    time: "20h30", icon: "🍽️", name: "Jantar",
    options: [
      "Sopa leve de legumes com frango desfiado",
      "Omelete de 2 ovos + salada de folhas + tomate",
      "Peixe assado + abobrinha grelhada",
      "Frango grelhado + chuchu cozido + alface",
      "Sopa de abóbora com gengibre (leve, sem creme)",
      "Wrap de alface com atum + tomate + pepino",
      "Tilápia grelhada + aspargos + salada",
    ],
    tip: "Jantar leve = menos inchaço ao acordar. Sem sal extra.", whey: false,
  },
];

const water = [
  { time: "Ao acordar (6h30)", amount: "300ml", tip: "Em jejum, antes de qualquer coisa" },
  { time: "Antes do café (7h)", amount: "200ml", tip: "15 min antes de comer" },
  { time: "Manhã (9h)", amount: "300ml", tip: "Aos poucos, não de uma vez" },
  { time: "Antes do almoço (12h30)", amount: "200ml", tip: "15 min antes — reduz apetite" },
  { time: "Tarde (15h)", amount: "300ml", tip: "Pico de desidratação do dia" },
  { time: "Pré-treino (16h)", amount: "200ml", tip: "Hidratação antes de malhar" },
  { time: "Durante treino", amount: "300ml", tip: "Gole a gole ao longo do treino" },
  { time: "Pós-treino (19h)", amount: "200ml", tip: "Reposição imediata — pode misturar no shake" },
  { time: "Noite (21h)", amount: "200ml", tip: "Última dose — não exagera" },
];

// 7-day workout split
const workouts = [
  {
    label: "Superiores + Core", focus: "Peito, costas & abdômen",
    exercises: [
      { name: "Supino com halteres", sets: "3x12", rest: "60s" },
      { name: "Remada unilateral", sets: "3x12", rest: "60s" },
      { name: "Desenvolvimento ombros", sets: "3x12", rest: "60s" },
      { name: "Crucifixo no cabo", sets: "3x15", rest: "45s" },
      { name: "Prancha abdominal", sets: "3x45s", rest: "30s" },
      { name: "Abdominal bicicleta", sets: "3x20", rest: "30s" },
    ],
    cardio: "20 min esteira leve (inclinação 5–8%) ao final", color: "#E8C5A0", rest: false,
  },
  {
    label: "Inferiores — Glúteo", focus: "Glúteo, posterior & abdução",
    exercises: [
      { name: "Agachamento sumô", sets: "4x12", rest: "60s" },
      { name: "Leg press 45°", sets: "3x15", rest: "60s" },
      { name: "Stiff com halteres", sets: "3x12", rest: "60s" },
      { name: "Abdução no cabo", sets: "3x20", rest: "45s" },
      { name: "Elevação pélvica", sets: "4x15", rest: "45s" },
      { name: "Panturrilha em pé", sets: "3x20", rest: "30s" },
    ],
    cardio: "20 min bike moderado ao final", color: "#C5D4A0", rest: false,
  },
  {
    label: "Cardio + Abdômen", focus: "Queima e definição do core",
    exercises: [
      { name: "Prancha frontal", sets: "4x45s", rest: "30s" },
      { name: "Abdominal supra", sets: "3x20", rest: "30s" },
      { name: "Prancha lateral", sets: "3x30s cada", rest: "30s" },
      { name: "Mountain climber", sets: "3x30", rest: "30s" },
      { name: "Abdominal bicicleta", sets: "3x20", rest: "30s" },
    ],
    cardio: "35 min esteira ou elíptico ritmo moderado — foco no cardio hoje", color: "#A0C5D4", rest: false,
  },
  {
    label: "Ombros + Braços", focus: "Definição superiores",
    exercises: [
      { name: "Desenvolvimento com halteres", sets: "4x12", rest: "60s" },
      { name: "Elevação lateral", sets: "3x15", rest: "45s" },
      { name: "Elevação frontal", sets: "3x15", rest: "45s" },
      { name: "Rosca direta", sets: "3x12", rest: "45s" },
      { name: "Tríceps no cabo", sets: "3x15", rest: "45s" },
      { name: "Rosca martelo", sets: "3x12", rest: "45s" },
    ],
    cardio: "15 min bike leve ao final", color: "#D4C5A0", rest: false,
  },
  {
    label: "Inferiores — Quadríceps", focus: "Volume e força nas pernas",
    exercises: [
      { name: "Agachamento livre", sets: "4x10", rest: "75s" },
      { name: "Extensora", sets: "3x15", rest: "60s" },
      { name: "Cadeira flexora", sets: "3x15", rest: "60s" },
      { name: "Afundo alternado", sets: "3x12 cada", rest: "60s" },
      { name: "Panturrilha sentada", sets: "3x20", rest: "30s" },
    ],
    cardio: "15 min bike leve — só pra ativar circulação", color: "#D4A0C5", rest: false,
  },
  {
    label: "Full Body Funcional", focus: "Força + mobilidade + queima",
    exercises: [
      { name: "Agachamento goblet", sets: "3x15", rest: "45s" },
      { name: "Remada com barra", sets: "3x12", rest: "45s" },
      { name: "Flexão de joelho deitada", sets: "3x15", rest: "45s" },
      { name: "Agachamento + press ombro", sets: "3x12", rest: "45s" },
      { name: "Prancha com rotação", sets: "3x10 cada", rest: "30s" },
      { name: "Elevação pélvica", sets: "3x15", rest: "30s" },
    ],
    cardio: "25 min esteira ou caminhada rápida", color: "#A0D4C5", rest: false,
  },
  {
    label: "Descanso Ativo 🌿", focus: "Recuperação e mobilidade",
    exercises: [
      { name: "Caminhada leve 30–40 min", sets: "—", rest: "—" },
      { name: "Alongamento completo", sets: "—", rest: "—" },
      { name: "Yoga ou mobilidade", sets: "—", rest: "—" },
    ],
    cardio: "Sem academia. Hidrata bem e descansa — o músculo cresce no descanso.", color: "#F5E6C8", rest: true,
  },
];

const measureFields = [
  { key: "peso", label: "Peso", unit: "kg", icon: "⚖️" },
  { key: "busto", label: "Busto", unit: "cm", icon: "📏" },
  { key: "cintura", label: "Cintura", unit: "cm", icon: "📏" },
  { key: "quadril", label: "Quadril", unit: "cm", icon: "📏" },
  { key: "coxa", label: "Coxa", unit: "cm", icon: "📏" },
  { key: "braco", label: "Braço", unit: "cm", icon: "📏" },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function todayDayOfWeek() {
  return new Date().getDay(); // 0=Sun
}

function CheckBox({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 24, height: 24, borderRadius: 8, flexShrink: 0, cursor: "pointer",
      background: checked ? TEAL : "#fff", border: `2px solid ${checked ? TEAL : "#ddd"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.2s", boxShadow: checked ? "0 2px 8px rgba(91,164,164,0.35)" : "none",
    }}>
      {checked && <span style={{ color: "#fff", fontSize: 13, lineHeight: 1 }}>✓</span>}
    </div>
  );
}

function resizeImage(file, maxW = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Week dates for display
function getWeekDates(dayOfWeek) {
  const today = new Date();
  const diff = today.getDay() - dayOfWeek; // how many days ago was this day
  const d = new Date(today);
  d.setDate(today.getDate() - diff + (diff > 0 ? 0 : 0));
  // Actually just show the date for each day of this week
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  const result = new Date(sunday);
  result.setDate(sunday.getDate() + dayOfWeek);
  return result.toISOString().slice(0, 10);
}

export default function App() {
  const [activeTab, setActiveTab] = useState("cardapio");
  const [activeDay, setActiveDay] = useState(todayDayOfWeek());
  const [activeMeal, setActiveMeal] = useState(null);
  const [mealOptionIdx, setMealOptionIdx] = useState({});
  const [checks, setChecks] = useState({});
  const [measurements, setMeasurements] = useState({});
  const [measureInput, setMeasureInput] = useState({});
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  // Date string for selected day (within this week)
  const activeDateStr = getWeekDates(activeDay);
  const isToday = activeDateStr === todayStr();

  useEffect(() => {
    async function load() {
      for (const [key, setter] of [
        ["fit-checks", setChecks],
        ["fit-measurements", setMeasurements],
        ["fit-photos", setPhotos],
        ["fit-meal-options", setMealOptionIdx],
      ]) {
        try { const r = await window.storage.get(key); if (r) setter(JSON.parse(r.value)); } catch {}
      }
    }
    load();
  }, []);

  async function persist(key, value) {
    try { await window.storage.set(key, JSON.stringify(value)); } catch {}
  }

  // checks are keyed by actual date
  function checkKey(type, idx) {
    return `${activeDateStr}-${type}-${idx}`;
  }

  function toggleCheck(key) {
    const next = { ...checks, [key]: !checks[key] };
    setChecks(next); persist("fit-checks", next);
  }

  function cycleMealOption(dayIdx, mealIdx, dir) {
    const key = `${dayIdx}-${mealIdx}`;
    const total = meals[mealIdx].options.length;
    const current = mealOptionIdx[key] ?? (dayIdx % total);
    const next = ((current + dir) + total) % total;
    const updated = { ...mealOptionIdx, [key]: next };
    setMealOptionIdx(updated); persist("fit-meal-options", updated);
  }

  function getMealOption(dayIdx, mealIdx) {
    const key = `${dayIdx}-${mealIdx}`;
    return mealOptionIdx[key] ?? (dayIdx % meals[mealIdx].options.length);
  }

  function checkedCount(type, total) {
    let n = 0;
    for (let i = 0; i < total; i++) if (checks[checkKey(type, i)]) n++;
    return n;
  }

  async function saveMeasure() {
    setSaving(true);
    const existing = measurements[activeDateStr] || {};
    const merged = { ...existing, ...measureInput };
    const next = { ...measurements, [activeDateStr]: merged };
    setMeasurements(next); persist("fit-measurements", next);
    setMeasureInput({}); setSaving(false);
  }

  async function handlePhoto(e) {
    const file = e.target.files[0]; if (!file) return;
    const b64 = await resizeImage(file);
    const entry = {
      src: b64,
      dayLabel: DAYS[activeDay].label,
      date: new Date().toLocaleDateString("pt-BR"),
      dateStr: activeDateStr,
    };
    const next = [...photos, entry];
    setPhotos(next); persist("fit-photos", next);
    e.target.value = "";
  }

  async function deletePhoto(idx) {
    const next = photos.filter((_, i) => i !== idx);
    setPhotos(next); persist("fit-photos", next);
  }

  const tabs = [
    { id: "cardapio", label: "🥗 Cardápio" },
    { id: "agua", label: "💧 Água" },
    { id: "treino", label: "💪 Treino" },
    { id: "medidas", label: "📊 Medidas" },
  ];

  const workout = workouts[activeDay];

  // last 5 measurement entries for evolution
  const measureEntries = Object.entries(measurements)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-5);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf6ec 0%, #e8f4f8 100%)", fontFamily: "Georgia, serif", paddingBottom: 48 }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #5ba4a4, #7bc4c4 60%, #a8d8a8)",
        padding: "28px 20px 20px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, margin: "0 0 4px", letterSpacing: 3, textTransform: "uppercase" }}>seu plano semanal</p>
        <h1 style={{ color: "#fff", fontSize: 26, margin: "0 0 4px", fontWeight: "bold" }}>Fit & Desinchada 🌊</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: 0 }}>
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Day selector */}
      <div style={{ overflowX: "auto", padding: "14px 12px 0" }}>
        <div style={{ display: "flex", gap: 6, minWidth: "max-content", margin: "0 auto", justifyContent: "center" }}>
          {DAYS.map((d, i) => {
            const dateStr = getWeekDates(i);
            const dayNum = new Date(dateStr).getDate();
            const isActive = activeDay === i;
            const isTodayDay = dateStr === todayStr();
            return (
              <button key={i} onClick={() => setActiveDay(i)} style={{
                padding: "8px 10px", borderRadius: 14, border: "none", cursor: "pointer",
                fontFamily: "Georgia, serif",
                background: isActive ? TEAL : "#fff",
                color: isActive ? "#fff" : "#666",
                boxShadow: isActive ? "0 2px 10px rgba(91,164,164,0.4)" : "0 1px 4px rgba(0,0,0,0.08)",
                transition: "all 0.2s", minWidth: 44, position: "relative",
              }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: "bold" }}>{d.label}</p>
                <p style={{ margin: 0, fontSize: 12 }}>{dayNum}</p>
                {isTodayDay && (
                  <div style={{
                    position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)",
                    width: 4, height: 4, borderRadius: "50%",
                    background: isActive ? "rgba(255,255,255,0.8)" : TEAL,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day label */}
      <p style={{ textAlign: "center", color: "#aaa", fontSize: 12, margin: "8px 0 0" }}>
        {isToday ? "📍 Hoje" : DAYS[activeDay].full} • {new Date(activeDateStr + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "10px 12px 0", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "9px 13px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 12,
            fontFamily: "Georgia, serif", background: activeTab === t.id ? "#fff" : "transparent",
            color: activeTab === t.id ? TEAL : "#999",
            boxShadow: activeTab === t.id ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
            fontWeight: activeTab === t.id ? "bold" : "normal", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "14px 14px 0" }}>

        {/* ── CARDÁPIO ── */}
        {activeTab === "cardapio" && (
          <div>
            <div style={{
              background: "linear-gradient(135deg, #ede8ff, #e8f0ff)", border: "1px solid #c8c0f0",
              borderRadius: 14, padding: "10px 14px", marginBottom: 12,
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🥤</span>
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: "bold", fontSize: 12, color: "#5040a0" }}>Whey no cardápio</p>
                <p style={{ margin: 0, fontSize: 11, color: "#555", lineHeight: 1.5 }}>
                  No <strong>café da manhã</strong> (opção 2) e no slot <strong>Pós-treino</strong>. Prefere <strong>whey isolado</strong> — menos inchaço. 1 scoop/dose.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ color: "#aaa", fontSize: 11, margin: 0 }}>Toca pra expandir • troca opção com ◀ ▶</p>
              <span style={{ background: TEAL, color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: "bold" }}>
                {checkedCount("meal", meals.length)}/{meals.length}
              </span>
            </div>

            {meals.map((meal, i) => {
              const optIdx = getMealOption(activeDay, i);
              const ck = checkKey("meal", i);
              const done = !!checks[ck];
              return (
                <div key={i} style={{
                  background: done ? "#f0faf8" : meal.whey ? "#f5f0ff" : "#fff",
                  borderRadius: 16, padding: "13px 14px", marginBottom: 9,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  borderLeft: `4px solid ${done ? TEAL : meal.whey ? "#9070d0" : activeMeal === i ? TEAL : "transparent"}`,
                  transition: "all 0.2s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckBox checked={done} onChange={() => toggleCheck(ck)} />
                    <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setActiveMeal(activeMeal === i ? null : i)}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 20 }}>{meal.icon}</span>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <p style={{ margin: 0, fontWeight: "bold", fontSize: 13, color: done ? TEAL : "#333", textDecoration: done ? "line-through" : "none" }}>{meal.name}</p>
                              {meal.whey && <span style={{ background: "#e0d0ff", color: "#6040b0", fontSize: 9, borderRadius: 6, padding: "1px 5px", fontWeight: "bold" }}>WHEY</span>}
                            </div>
                            <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>{meal.time}</p>
                          </div>
                        </div>
                        <span style={{ color: "#ccc", fontSize: 13 }}>{activeMeal === i ? "▲" : "▼"}</span>
                      </div>
                    </div>
                  </div>

                  {activeMeal === i && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f0f0f0" }}>
                      <div style={{
                        background: meal.whey ? "linear-gradient(135deg, #ede8ff, #e8ecff)" : "linear-gradient(135deg, #e8f8f5, #f0f8e8)",
                        borderRadius: 12, padding: "10px 12px", marginBottom: 8,
                      }}>
                        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#333", fontWeight: "bold", lineHeight: 1.4 }}>
                          {meal.options[optIdx]}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={(e) => { e.stopPropagation(); cycleMealOption(activeDay, i, -1); }} style={{
                            background: "#fff", border: "1px solid #ddd", borderRadius: 8,
                            padding: "4px 10px", cursor: "pointer", fontSize: 13, color: TEAL,
                          }}>◀</button>
                          <span style={{ fontSize: 11, color: "#aaa", flex: 1, textAlign: "center" }}>
                            {optIdx + 1} / {meal.options.length}
                          </span>
                          <button onClick={(e) => { e.stopPropagation(); cycleMealOption(activeDay, i, 1); }} style={{
                            background: "#fff", border: "1px solid #ddd", borderRadius: 8,
                            padding: "4px 10px", cursor: "pointer", fontSize: 13, color: TEAL,
                          }}>▶</button>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: meal.whey ? "#7050a0" : "#7ba4a4", fontStyle: "italic" }}>⚡ {meal.tip}</p>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ background: "linear-gradient(135deg, #fff5e8, #ffeee0)", borderRadius: 16, padding: 14, marginTop: 6, border: "1px solid #f5d0a0" }}>
              <p style={{ margin: "0 0 8px", fontWeight: "bold", fontSize: 12, color: "#a06030" }}>⚠️ Sempre evitar</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {["Refrigerante", "Sal extra", "Embutidos", "Álcool", "Fritura", "Açúcar", "Pão branco", "Fast food"].map(f => (
                  <span key={f} style={{ background: "#fff", borderRadius: 20, padding: "3px 9px", fontSize: 11, color: "#c06030", border: "1px solid #f5d0a0" }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ÁGUA ── */}
        {activeTab === "agua" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${TEAL}, #7bc4c4)`, borderRadius: 20, padding: 18, textAlign: "center", marginBottom: 14 }}>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, margin: "0 0 2px", letterSpacing: 2, textTransform: "uppercase" }}>meta diária</p>
              <p style={{ color: "#fff", fontSize: 38, margin: "0 0 2px", fontWeight: "bold" }}>2.2L</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: "0 0 10px" }}>distribuídos ao longo do dia</p>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, height: 8 }}>
                <div style={{
                  height: 8, borderRadius: 8, background: "#fff",
                  width: `${(checkedCount("water", water.length) / water.length) * 100}%`,
                  transition: "width 0.4s",
                }} />
              </div>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, margin: "6px 0 0" }}>
                {checkedCount("water", water.length)}/{water.length} doses ✓
              </p>
            </div>

            {water.map((w, i) => {
              const ck = checkKey("water", i);
              const done = !!checks[ck];
              return (
                <div key={i} style={{
                  background: done ? "#f0faf8" : "#fff", borderRadius: 14, padding: "11px 13px",
                  marginBottom: 7, boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex", alignItems: "center", gap: 10,
                  borderLeft: `4px solid ${done ? TEAL : "transparent"}`, transition: "all 0.2s",
                }}>
                  <CheckBox checked={done} onChange={() => toggleCheck(ck)} />
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: done ? "linear-gradient(135deg, #c8f0e8, #a8e0d8)" : "linear-gradient(135deg, #e8f8f8, #c8eef0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: "bold", color: TEAL,
                  }}>{w.amount}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: "bold", color: done ? TEAL : "#333", textDecoration: done ? "line-through" : "none" }}>{w.time}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{w.tip}</p>
                  </div>
                </div>
              );
            })}

            <div style={{ background: "linear-gradient(135deg, #e8f8f5, #f0f8e8)", borderRadius: 14, padding: 12, marginTop: 6, border: "1px solid #c0e8d8" }}>
              <p style={{ margin: "0 0 5px", fontWeight: "bold", fontSize: 12, color: "#3a8060" }}>💡 Dicas</p>
              <p style={{ margin: "0 0 3px", fontSize: 11, color: "#555" }}>• Água com pepino e hortelã — diurético natural</p>
              <p style={{ margin: "0 0 3px", fontSize: 11, color: "#555" }}>• Chá de hibisco conta pra meta</p>
              <p style={{ margin: 0, fontSize: 11, color: "#555" }}>• Urina clara = hidratação ideal ✅</p>
            </div>
          </div>
        )}

        {/* ── TREINO ── */}
        {activeTab === "treino" && (
          <div>
            <div style={{ background: workout.color, borderRadius: 20, padding: 18, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase" }}>{DAYS[activeDay].full}</p>
                <p style={{ margin: "0 0 2px", fontSize: 19, fontWeight: "bold", color: "#333" }}>{workout.label}</p>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#555" }}>🎯 {workout.focus}</p>
                <span style={{ background: "rgba(255,255,255,0.6)", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: "bold", color: "#444" }}>
                  {checkedCount("ex", workout.exercises.length)}/{workout.exercises.length} feitos
                </span>
              </div>
              <span style={{ fontSize: 34 }}>{workout.rest ? "🌿" : "🏋️‍♀️"}</span>
            </div>

            {workout.exercises.map((ex, i) => {
              const ck = checkKey("ex", i);
              const done = !!checks[ck];
              return (
                <div key={i} style={{
                  background: done ? "#f0faf8" : "#fff", borderRadius: 12, padding: "11px 13px",
                  marginBottom: 7, boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  borderLeft: `4px solid ${done ? TEAL : "transparent"}`, transition: "all 0.2s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckBox checked={done} onChange={() => toggleCheck(ck)} />
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%", background: workout.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: "bold", color: "#444", flexShrink: 0,
                    }}>{i + 1}</div>
                    <p style={{ margin: 0, fontSize: 13, color: done ? TEAL : "#333", textDecoration: done ? "line-through" : "none" }}>{ex.name}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: "bold", color: TEAL }}>{ex.sets}</p>
                    {ex.rest !== "—" && <p style={{ margin: 0, fontSize: 10, color: "#aaa" }}>{ex.rest}</p>}
                  </div>
                </div>
              );
            })}

            <div style={{ background: "linear-gradient(135deg, #f0f0ff, #e8f8f8)", borderRadius: 14, padding: 13, marginTop: 6, border: "1px solid #d0d8f0" }}>
              <p style={{ margin: "0 0 3px", fontWeight: "bold", fontSize: 12, color: "#5060a0" }}>🏃‍♀️ {workout.rest ? "Atividade do dia" : "Cardio do dia"}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#555" }}>{workout.cardio}</p>
            </div>

            {!workout.rest && (
              <div style={{ background: "linear-gradient(135deg, #f0ebff, #ebe8ff)", borderRadius: 14, padding: 13, marginTop: 8, border: "1px solid #d0c8f0" }}>
                <p style={{ margin: "0 0 3px", fontWeight: "bold", fontSize: 12, color: "#6040a0" }}>🥤 Whey pós-treino</p>
                <p style={{ margin: 0, fontSize: 12, color: "#555" }}>1 scoop + água (ou opção do dia) em até 40 min após o treino.</p>
              </div>
            )}
          </div>
        )}

        {/* ── MEDIDAS ── */}
        {activeTab === "medidas" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p style={{ margin: "0 0 4px", fontWeight: "bold", fontSize: 14, color: "#333" }}>📝 Registrar medidas</p>
              <p style={{ margin: "0 0 12px", fontSize: 11, color: "#aaa" }}>
                {DAYS[activeDay].full} • {new Date(activeDateStr + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {measureFields.map(f => {
                  const saved = measurements[activeDateStr]?.[f.key];
                  return (
                    <div key={f.key}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888" }}>{f.icon} {f.label} ({f.unit})</p>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number" step="0.1"
                          placeholder={saved ? String(saved) : "0.0"}
                          value={measureInput[f.key] || ""}
                          onChange={e => setMeasureInput(p => ({ ...p, [f.key]: e.target.value }))}
                          style={{
                            width: "100%", boxSizing: "border-box", padding: "9px 12px",
                            borderRadius: 10, border: `1.5px solid ${saved ? TEAL : "#eee"}`,
                            fontSize: 14, fontFamily: "Georgia, serif",
                            background: saved ? "#f0faf8" : "#fafafa",
                            outline: "none", color: "#333",
                          }}
                        />
                        {saved && !measureInput[f.key] && (
                          <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: TEAL, fontWeight: "bold", pointerEvents: "none" }}>
                            {saved}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={saveMeasure} style={{
                width: "100%", marginTop: 14, padding: "12px", borderRadius: 12, border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${TEAL}, #7bc4c4)`,
                color: "#fff", fontSize: 14, fontWeight: "bold", fontFamily: "Georgia, serif",
                boxShadow: "0 4px 14px rgba(91,164,164,0.4)",
              }}>
                {saving ? "Salvando..." : "✓ Salvar medidas"}
              </button>
            </div>

            {/* Evolution */}
            {measureEntries.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <p style={{ margin: "0 0 12px", fontWeight: "bold", fontSize: 14, color: "#333" }}>📈 Evolução (últimos {measureEntries.length} registros)</p>
                {measureFields.map(f => {
                  const entries = measureEntries.map(([date, vals]) => ({ date, val: vals[f.key] })).filter(e => e.val);
                  if (!entries.length) return null;
                  const diff = entries.length > 1 ? parseFloat(entries[entries.length - 1].val) - parseFloat(entries[0].val) : null;
                  return (
                    <div key={f.key} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                        <p style={{ margin: 0, fontSize: 12, color: "#666", fontWeight: "bold" }}>{f.icon} {f.label}</p>
                        {diff !== null && (
                          <span style={{
                            fontSize: 11, fontWeight: "bold",
                            color: diff < 0 ? "#3a8060" : diff > 0 ? "#c06030" : "#888",
                            background: diff < 0 ? "#e8f8f0" : diff > 0 ? "#fff0e8" : "#f0f0f0",
                            borderRadius: 20, padding: "2px 8px",
                          }}>
                            {diff > 0 ? "+" : ""}{diff.toFixed(1)}{f.unit}
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {entries.map((e, i) => (
                          <div key={i} style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ background: i === entries.length - 1 ? TEAL : "#e8f4f4", borderRadius: 8, padding: "6px 2px" }}>
                              <p style={{ margin: 0, fontSize: 12, fontWeight: "bold", color: i === entries.length - 1 ? "#fff" : "#333" }}>{e.val}</p>
                              <p style={{ margin: 0, fontSize: 9, color: i === entries.length - 1 ? "rgba(255,255,255,0.75)" : "#aaa" }}>
                                {new Date(e.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Photos */}
            <div style={{ background: "#fff", borderRadius: 18, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: 14, color: "#333" }}>📸 Fotos de progresso</p>
                <span style={{ fontSize: 11, color: "#aaa" }}>{photos.length} foto{photos.length !== 1 ? "s" : ""}</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
              <button onClick={() => fileRef.current.click()} style={{
                width: "100%", padding: "13px", borderRadius: 12, border: `2px dashed ${TEAL}`,
                background: "linear-gradient(135deg, #f0faf8, #f8fffe)",
                color: TEAL, fontSize: 13, fontWeight: "bold",
                fontFamily: "Georgia, serif", cursor: "pointer", marginBottom: 12,
              }}>
                + Adicionar foto ({DAYS[activeDay].label})
              </button>

              {photos.length === 0 && (
                <p style={{ textAlign: "center", color: "#ccc", fontSize: 13, margin: 0 }}>Nenhuma foto ainda 📷</p>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <img src={p.src} alt="" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
                      padding: "24px 8px 6px", display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                    }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: "bold", color: "#fff" }}>{p.dayLabel}</p>
                        <p style={{ margin: 0, fontSize: 9, color: "rgba(255,255,255,0.7)" }}>{p.date}</p>
                      </div>
                      <button onClick={() => deletePhoto(i)} style={{
                        background: "rgba(220,60,60,0.85)", border: "none", borderRadius: 6,
                        color: "#fff", fontSize: 10, padding: "3px 7px", cursor: "pointer",
                      }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

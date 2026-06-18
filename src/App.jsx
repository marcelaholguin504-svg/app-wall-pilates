import { useState } from "react";

const COLORS = {
  primary: "#6C3FC5",
  primaryLight: "#8B5CF6",
  primaryDark: "#4C2A9A",
  secondary: "#F472B6",
  accent: "#10B981",
  bg: "#0F0A1E",
  bgCard: "#1A1035",
  bgCardLight: "#231448",
  text: "#FFFFFF",
  textMuted: "#A78BCA",
  textLight: "#D1C4E9",
  border: "#3D2A6E",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const exercises = [
  {
    id: 1,
    name: "Ponte de Parede",
    duration: "45 seg",
    reps: "3 séries",
    level: "Iniciante",
    muscles: ["Glúteos", "Core"],
    description:
      "Apoie os pés na parede e eleve o quadril formando uma ponte. Mantenha por 3 segundos.",
    emoji: "🧘",
    calories: 45,
  },
  {
    id: 2,
    name: "Agachamento na Parede",
    duration: "60 seg",
    reps: "3 séries",
    level: "Iniciante",
    muscles: ["Pernas", "Glúteos"],
    description:
      "Com as costas na parede, desça até 90° nos joelhos. Segure a posição.",
    emoji: "🏋️",
    calories: 60,
  },
  {
    id: 3,
    name: "Pilates Leg Circles",
    duration: "30 seg",
    reps: "4 séries",
    level: "Intermediário",
    muscles: ["Core", "Quadris"],
    description:
      "Deite com as pernas na parede e faça círculos controlados com as pernas.",
    emoji: "⭕",
    calories: 50,
  },
  {
    id: 4,
    name: "Flexão Parede",
    duration: "40 seg",
    reps: "3 séries",
    level: "Iniciante",
    muscles: ["Peito", "Braços"],
    description:
      "Com as mãos na parede, faça flexões inclinadas mantendo o corpo reto.",
    emoji: "💪",
    calories: 55,
  },
  {
    id: 5,
    name: "Pliê Parede",
    duration: "50 seg",
    reps: "3 séries",
    level: "Intermediário",
    muscles: ["Pernas", "Core"],
    description:
      "Pés afastados com dedos apontados para fora, desça o quadril mantendo o core ativo.",
    emoji: "🩰",
    calories: 65,
  },
  {
    id: 6,
    name: "Roll Down Parede",
    duration: "30 seg",
    reps: "5 séries",
    level: "Avançado",
    muscles: ["Coluna", "Core"],
    description:
      "De pé na parede, role a coluna vertebra por vertebra até dobrar completamente.",
    emoji: "🌀",
    calories: 40,
  },
];

const mealPlans = [
  {
    time: "Café da manhã",
    time_short: "07:00",
    icon: "🌅",
    meal: "Bowl de Açaí com Granola",
    calories: 320,
    protein: "8g",
    carbs: "52g",
    fat: "10g",
    color: "#8B5CF6",
  },
  {
    time: "Lanche da Manhã",
    time_short: "10:00",
    icon: "🍎",
    meal: "Frutas + Castanhas",
    calories: 180,
    protein: "4g",
    carbs: "22g",
    fat: "9g",
    color: "#F472B6",
  },
  {
    time: "Almoço",
    time_short: "13:00",
    icon: "☀️",
    meal: "Frango Grelhado + Quinoa + Salada",
    calories: 450,
    protein: "35g",
    carbs: "38g",
    fat: "12g",
    color: "#10B981",
  },
  {
    time: "Lanche da Tarde",
    time_short: "16:00",
    icon: "🥤",
    meal: "Iogurte Grego + Mel + Chia",
    calories: 210,
    protein: "15g",
    carbs: "28g",
    fat: "4g",
    color: "#F59E0B",
  },
  {
    time: "Jantar",
    time_short: "19:00",
    icon: "🌙",
    meal: "Salmão + Legumes no Vapor + Arroz Integral",
    calories: 520,
    protein: "38g",
    carbs: "45g",
    fat: "16g",
    color: "#3B82F6",
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "Qual é seu principal objetivo?",
    options: [
      { label: "Perder peso", icon: "⚡" },
      { label: "Ganhar flexibilidade", icon: "🧘" },
      { label: "Fortalecer o core", icon: "💪" },
      { label: "Reduzir estresse", icon: "🌿" },
    ],
  },
  {
    id: 2,
    question: "Qual é o seu nível de experiência?",
    options: [
      { label: "Iniciante", icon: "🌱" },
      { label: "Intermediário", icon: "🌿" },
      { label: "Avançado", icon: "🌳" },
      { label: "Expert", icon: "🏆" },
    ],
  },
  {
    id: 3,
    question: "Quantos dias por semana você pode treinar?",
    options: [
      { label: "2-3 dias", icon: "📅" },
      { label: "4-5 dias", icon: "🗓️" },
      { label: "Todos os dias", icon: "🔥" },
      { label: "Apenas fins de semana", icon: "🌟" },
    ],
  },
  {
    id: 4,
    question: "Quanto tempo tem para cada treino?",
    options: [
      { label: "15-20 minutos", icon: "⏱️" },
      { label: "30 minutos", icon: "⏰" },
      { label: "45 minutos", icon: "🕐" },
      { label: "1 hora ou mais", icon: "🕑" },
    ],
  },
];

const stats = [
  { label: "Treinos Completos", value: "24", icon: "🏆", color: "#8B5CF6" },
  { label: "Calorias Queimadas", value: "3.240", icon: "🔥", color: "#F472B6" },
  { label: "Dias Consecutivos", value: "7", icon: "⚡", color: "#10B981" },
  { label: "Minutos Ativos", value: "480", icon: "⏱️", color: "#F59E0B" },
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const completedDays = [0, 1, 2, 3, 5];

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [activeTab, setActiveTab] = useState("home");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [filterLevel, setFilterLevel] = useState("Todos");

  // Splash → Onboarding → Quiz → Home
  const handleSplash = () => setScreen("onboarding");
  const handleOnboarding = () => setScreen("quiz");
  const handleQuizAnswer = (answer) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setScreen("home");
    }
  };

  const filteredExercises =
    filterLevel === "Todos"
      ? exercises
      : exercises.filter((e) => e.level === filterLevel);

  const styles = {
    app: {
      backgroundColor: COLORS.bg,
      minHeight: "100vh",
      maxWidth: "430px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      position: "relative",
      overflowX: "hidden",
    },
    // SPLASH
    splash: {
      background: `linear-gradient(160deg, ${COLORS.primaryDark} 0%, ${COLORS.bg} 60%, #0D0626 100%)`,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    splashGlow: {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${COLORS.primary}44 0%, transparent 70%)`,
      top: "10%",
      left: "50%",
      transform: "translateX(-50%)",
      pointerEvents: "none",
    },
    splashLogo: {
      fontSize: "72px",
      marginBottom: "16px",
      filter: "drop-shadow(0 0 20px #8B5CF688)",
    },
    splashBrand: {
      fontSize: "13px",
      color: COLORS.textMuted,
      letterSpacing: "3px",
      textTransform: "uppercase",
      marginBottom: "8px",
    },
    splashTitle: {
      fontSize: "36px",
      fontWeight: "900",
      color: COLORS.text,
      lineHeight: "1.1",
      marginBottom: "8px",
      background: `linear-gradient(135deg, #fff 0%, ${COLORS.primaryLight} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    splashSubtitle: {
      fontSize: "16px",
      color: COLORS.textLight,
      marginBottom: "48px",
      lineHeight: "1.5",
    },
    splashFeatures: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      width: "100%",
      marginBottom: "40px",
    },
    splashFeatureItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: `${COLORS.bgCard}99`,
      borderRadius: "12px",
      padding: "12px 16px",
      border: `1px solid ${COLORS.border}`,
    },
    splashFeatureIcon: { fontSize: "24px" },
    splashFeatureText: {
      fontSize: "14px",
      color: COLORS.textLight,
      textAlign: "left",
    },
    // ONBOARDING
    onboarding: {
      background: `linear-gradient(180deg, ${COLORS.primary}22 0%, ${COLORS.bg} 40%)`,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "0",
    },
    onboardingImage: {
      width: "100%",
      height: "380px",
      background: `linear-gradient(160deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 50%, ${COLORS.secondary}66 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "120px",
      position: "relative",
      overflow: "hidden",
    },
    onboardingBadge: {
      position: "absolute",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      background: `${COLORS.bgCard}CC`,
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "6px 16px",
      border: `1px solid ${COLORS.border}`,
      fontSize: "12px",
      color: COLORS.textMuted,
      letterSpacing: "2px",
      textTransform: "uppercase",
    },
    onboardingContent: {
      padding: "32px 24px 40px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    onboardingTag: {
      background: `${COLORS.primary}33`,
      color: COLORS.primaryLight,
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "2px",
      textTransform: "uppercase",
      padding: "4px 12px",
      borderRadius: "20px",
      display: "inline-block",
      marginBottom: "16px",
      border: `1px solid ${COLORS.primary}44`,
    },
    onboardingTitle: {
      fontSize: "30px",
      fontWeight: "900",
      color: COLORS.text,
      lineHeight: "1.2",
      marginBottom: "12px",
    },
    onboardingDesc: {
      fontSize: "15px",
      color: COLORS.textMuted,
      lineHeight: "1.6",
      marginBottom: "32px",
      flex: 1,
    },
    pillsRow: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginBottom: "28px",
    },
    pill: {
      background: `${COLORS.bgCardLight}`,
      border: `1px solid ${COLORS.border}`,
      borderRadius: "20px",
      padding: "6px 14px",
      fontSize: "12px",
      color: COLORS.textLight,
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    // QUIZ
    quiz: {
      background: COLORS.bg,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: "24px",
    },
    quizProgress: {
      display: "flex",
      gap: "6px",
      marginBottom: "32px",
    },
    quizProgressBar: (active, done) => ({
      flex: 1,
      height: "4px",
      borderRadius: "2px",
      background: done || active ? COLORS.primary : COLORS.border,
      transition: "background 0.3s",
    }),
    quizHeader: {
      marginBottom: "32px",
    },
    quizStep: {
      fontSize: "12px",
      color: COLORS.textMuted,
      letterSpacing: "2px",
      textTransform: "uppercase",
      marginBottom: "8px",
    },
    quizQuestion: {
      fontSize: "24px",
      fontWeight: "800",
      color: COLORS.text,
      lineHeight: "1.3",
    },
    quizOptions: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      flex: 1,
    },
    quizOption: (hover) => ({
      background: hover ? `${COLORS.primary}33` : COLORS.bgCard,
      border: `2px solid ${hover ? COLORS.primary : COLORS.border}`,
      borderRadius: "16px",
      padding: "20px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      transition: "all 0.2s",
      transform: hover ? "scale(1.03)" : "scale(1)",
    }),
    quizOptionIcon: { fontSize: "32px" },
    quizOptionLabel: {
      fontSize: "13px",
      color: COLORS.text,
      fontWeight: "600",
      textAlign: "center",
    },
    // COMMON
    btn: (variant = "primary") => ({
      background:
        variant === "primary"
          ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`
          : variant === "secondary"
          ? `${COLORS.bgCard}`
          : "transparent",
      color: COLORS.text,
      border: variant === "secondary" ? `1px solid ${COLORS.border}` : "none",
      borderRadius: "16px",
      padding: "16px 24px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      width: "100%",
      letterSpacing: "0.5px",
      boxShadow:
        variant === "primary" ? `0 8px 24px ${COLORS.primary}44` : "none",
      transition: "all 0.2s",
    }),
    // MAIN HOME
    header: {
      padding: "20px 20px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: {},
    headerGreet: {
      fontSize: "12px",
      color: COLORS.textMuted,
      letterSpacing: "1px",
    },
    headerName: {
      fontSize: "22px",
      fontWeight: "900",
      color: COLORS.text,
    },
    headerAvatar: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      boxShadow: `0 4px 12px ${COLORS.primary}66`,
    },
    scrollArea: {
      overflowY: "auto",
      paddingBottom: "100px",
    },
    section: {
      padding: "20px 20px 0",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "14px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "800",
      color: COLORS.text,
    },
    sectionLink: {
      fontSize: "13px",
      color: COLORS.primaryLight,
      fontWeight: "600",
      cursor: "pointer",
      background: "none",
      border: "none",
    },
    // HERO CARD
    heroCard: {
      margin: "20px",
      borderRadius: "20px",
      background: `linear-gradient(135deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 60%, ${COLORS.secondary}88 100%)`,
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 12px 40px ${COLORS.primary}44`,
    },
    heroGlow: {
      position: "absolute",
      right: "-20px",
      top: "-20px",
      width: "160px",
      height: "160px",
      borderRadius: "50%",
      background: `${COLORS.secondary}33`,
      pointerEvents: "none",
    },
    heroEmoji: {
      fontSize: "60px",
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
    },
    heroTag: {
      background: "rgba(255,255,255,0.2)",
      color: "#fff",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "2px",
      textTransform: "uppercase",
      padding: "4px 10px",
      borderRadius: "20px",
      display: "inline-block",
      marginBottom: "10px",
    },
    heroTitle: {
      fontSize: "22px",
      fontWeight: "900",
      color: "#fff",
      marginBottom: "6px",
      lineHeight: "1.2",
    },
    heroSub: {
      fontSize: "13px",
      color: "rgba(255,255,255,0.8)",
      marginBottom: "16px",
    },
    heroMetaRow: {
      display: "flex",
      gap: "16px",
    },
    heroMeta: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "12px",
      color: "rgba(255,255,255,0.85)",
    },
    // STATS
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    statCard: (color) => ({
      background: COLORS.bgCard,
      borderRadius: "16px",
      padding: "16px",
      border: `1px solid ${COLORS.border}`,
      position: "relative",
      overflow: "hidden",
    }),
    statAccent: (color) => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "3px",
      background: color,
      borderRadius: "16px 16px 0 0",
    }),
    statIcon: { fontSize: "22px", marginBottom: "8px" },
    statValue: {
      fontSize: "26px",
      fontWeight: "900",
      color: COLORS.text,
      lineHeight: 1,
      marginBottom: "4px",
    },
    statLabel: {
      fontSize: "11px",
      color: COLORS.textMuted,
      letterSpacing: "0.5px",
    },
    // WEEK TRACKER
    weekTracker: {
      background: COLORS.bgCard,
      borderRadius: "16px",
      padding: "16px",
      border: `1px solid ${COLORS.border}`,
    },
    weekRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    weekDay: (done, today) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
    }),
    weekDayLabel: (today) => ({
      fontSize: "10px",
      color: today ? COLORS.primaryLight : COLORS.textMuted,
      fontWeight: today ? "700" : "400",
      letterSpacing: "0.5px",
    }),
    weekDayCircle: (done, today) => ({
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: done
        ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`
        : today
        ? `${COLORS.primary}33`
        : COLORS.bgCardLight,
      border: today && !done ? `2px solid ${COLORS.primary}` : "2px solid transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      color: done ? "#fff" : today ? COLORS.primaryLight : COLORS.textMuted,
      fontWeight: done ? "700" : "400",
      boxShadow: done ? `0 4px 12px ${COLORS.primary}44` : "none",
    }),
    // EXERCISE CARD
    exerciseCard: {
      background: COLORS.bgCard,
      borderRadius: "16px",
      padding: "16px",
      border: `1px solid ${COLORS.border}`,
      display: "flex",
      alignItems: "center",
      gap: "14px",
      cursor: "pointer",
      transition: "all 0.2s",
      marginBottom: "10px",
    },
    exerciseEmoji: {
      width: "54px",
      height: "54px",
      borderRadius: "14px",
      background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "26px",
      flexShrink: 0,
      boxShadow: `0 4px 12px ${COLORS.primary}44`,
    },
    exerciseInfo: { flex: 1, minWidth: 0 },
    exerciseName: {
      fontSize: "15px",
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: "4px",
    },
    exerciseMeta: {
      fontSize: "12px",
      color: COLORS.textMuted,
      marginBottom: "6px",
    },
    exerciseTags: { display: "flex", gap: "6px", flexWrap: "wrap" },
    exerciseTag: (color) => ({
      fontSize: "10px",
      fontWeight: "600",
      color: color || COLORS.primaryLight,
      background: `${color || COLORS.primary}22`,
      padding: "2px 8px",
      borderRadius: "10px",
      border: `1px solid ${color || COLORS.primary}44`,
    }),
    exerciseArrow: {
      fontSize: "18px",
      color: COLORS.textMuted,
    },
    // FILTER PILLS
    filterRow: {
      display: "flex",
      gap: "8px",
      marginBottom: "16px",
      overflowX: "auto",
      paddingBottom: "4px",
    },
    filterPill: (active) => ({
      padding: "6px 16px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      background: active
        ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`
        : COLORS.bgCard,
      color: active ? "#fff" : COLORS.textMuted,
      border: active ? "none" : `1px solid ${COLORS.border}`,
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "all 0.2s",
      flexShrink: 0,
      boxShadow: active ? `0 4px 12px ${COLORS.primary}44` : "none",
    }),
    // MEAL CARD
    mealCard: (color) => ({
      background: COLORS.bgCard,
      borderRadius: "16px",
      padding: "14px 16px",
      border: `1px solid ${COLORS.border}`,
      display: "flex",
      alignItems: "center",
      gap: "14px",
      cursor: "pointer",
      marginBottom: "10px",
      borderLeft: `3px solid ${color}`,
      transition: "all 0.2s",
    }),
    mealTime: {
      fontSize: "11px",
      color: COLORS.textMuted,
      fontWeight: "600",
      minWidth: "42px",
    },
    mealIcon: { fontSize: "24px" },
    mealInfo: { flex: 1 },
    mealName: {
      fontSize: "14px",
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: "3px",
    },
    mealCals: {
      fontSize: "12px",
      color: COLORS.textMuted,
    },
    mealArrow: { fontSize: "16px", color: COLORS.textMuted },
    // BOTTOM NAV
    bottomNav: {
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "430px",
      background: `${COLORS.bgCard}EE`,
      backdropFilter: "blur(20px)",
      borderTop: `1px solid ${COLORS.border}`,
      display: "flex",
      alignItems: "center",
      padding: "8px 0 16px",
      zIndex: 100,
    },
    navItem: (active) => ({
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
      cursor: "pointer",
      background: "none",
      border: "none",
      padding: "4px",
    }),
    navIcon: (active) => ({
      fontSize: "22px",
      filter: active ? "none" : "grayscale(100%) opacity(0.5)",
      transition: "all 0.2s",
      transform: active ? "scale(1.1)" : "scale(1)",
    }),
    navLabel: (active) => ({
      fontSize: "10px",
      color: active ? COLORS.primaryLight : COLORS.textMuted,
      fontWeight: active ? "700" : "400",
      letterSpacing: "0.3px",
    }),
    navActiveIndicator: (active) => ({
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      background: active ? COLORS.primaryLight : "transparent",
      marginBottom: "0px",
    }),
    // MODAL
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(4px)",
      zIndex: 200,
      display: "flex",
      alignItems: "flex-end",
    },
    modalSheet: {
      background: COLORS.bgCard,
      borderRadius: "24px 24px 0 0",
      padding: "24px",
      width: "100%",
      maxHeight: "85vh",
      overflowY: "auto",
      border: `1px solid ${COLORS.border}`,
    },
    modalHandle: {
      width: "40px",
      height: "4px",
      borderRadius: "2px",
      background: COLORS.border,
      margin: "0 auto 20px",
    },
    modalTitle: {
      fontSize: "22px",
      fontWeight: "900",
      color: COLORS.text,
      marginBottom: "6px",
    },
    modalSubtitle: {
      fontSize: "14px",
      color: COLORS.textMuted,
      marginBottom: "20px",
      lineHeight: "1.5",
    },
    macroRow: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    macroBox: (color) => ({
      flex: 1,
      background: `${color}22`,
      border: `1px solid ${color}44`,
      borderRadius: "12px",
      padding: "12px 8px",
      textAlign: "center",
    }),
    macroValue: {
      fontSize: "18px",
      fontWeight: "800",
      color: COLORS.text,
      marginBottom: "2px",
    },
    macroLabel: {
      fontSize: "10px",
      color: COLORS.textMuted,
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    // PROFILE
    profileHeader: {
      padding: "40px 20px 20px",
      textAlign: "center",
    },
    profileAvatar: {
      width: "90px",
      height: "90px",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "40px",
      margin: "0 auto 16px",
      boxShadow: `0 8px 24px ${COLORS.primary}66`,
    },
    profileName: {
      fontSize: "24px",
      fontWeight: "900",
      color: COLORS.text,
      marginBottom: "4px",
    },
    profileSub: {
      fontSize: "13px",
      color: COLORS.textMuted,
    },
    profileMenuSection: {
      padding: "0 20px",
      marginBottom: "16px",
    },
    profileMenuItem: {
      background: COLORS.bgCard,
      borderRadius: "14px",
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
      cursor: "pointer",
      marginBottom: "8px",
      border: `1px solid ${COLORS.border}`,
    },
    profileMenuIcon: {
      width: "36px",
      height: "36px",
      borderRadius: "10px",
      background: `${COLORS.primary}33`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
    },
    profileMenuLabel: {
      flex: 1,
      fontSize: "15px",
      fontWeight: "600",
      color: COLORS.text,
    },
    profileMenuArrow: {
      fontSize: "14px",
      color: COLORS.textMuted,
    },
    // WORKOUT TIMER
    timerCard: {
      background: `linear-gradient(135deg, ${COLORS.primaryDark}, ${COLORS.primary})`,
      borderRadius: "20px",
      padding: "24px",
      margin: "20px",
      textAlign: "center",
      boxShadow: `0 12px 40px ${COLORS.primary}44`,
    },
    timerDisplay: {
      fontSize: "64px",
      fontWeight: "900",
      color: "#fff",
      letterSpacing: "2px",
      marginBottom: "8px",
      fontVariantNumeric: "tabular-nums",
    },
    timerLabel: {
      fontSize: "13px",
      color: "rgba(255,255,255,0.7)",
      marginBottom: "20px",
    },
    timerBtns: {
      display: "flex",
      gap: "12px",
      justifyContent: "center",
    },
    timerBtn: (variant) => ({
      background:
        variant === "start"
          ? "rgba(255,255,255,0.25)"
          : "rgba(255,255,255,0.1)",
      border: "2px solid rgba(255,255,255,0.3)",
      borderRadius: "14px",
      padding: "12px 24px",
      fontSize: "15px",
      fontWeight: "700",
      color: "#fff",
      cursor: "pointer",
    }),
  };

  const tabs = [
    { id: "home", icon: "🏠", label: "Início" },
    { id: "workout", icon: "💪", label: "Treinos" },
    { id: "nutrition", icon: "🥗", label: "Nutrição" },
    { id: "progress", icon: "📊", label: "Progresso" },
    { id: "profile", icon: "👤", label: "Perfil" },
  ];

  const renderHome = () => (
    <div style={styles.scrollArea}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerGreet}>Bom dia, 👋</div>
          <div style={styles.headerName}>Bem-vindo!</div>
        </div>
        <div style={styles.headerAvatar}>🧘</div>
      </div>

      {/* Hero Card */}
      <div style={styles.heroCard}>
        <div style={styles.heroGlow} />
        <div style={styles.heroTag}>TREINO DE HOJE</div>
        <div style={styles.heroTitle}>Wall Pilates{"\n"}Iniciante</div>
        <div style={styles.heroSub}>30 min · 6 exercícios</div>
        <div style={styles.heroMetaRow}>
          <div style={styles.heroMeta}>🔥 240 kcal</div>
          <div style={styles.heroMeta}>⭐ 4.9</div>
          <div style={styles.heroMeta}>👥 12k</div>
        </div>
        <div style={styles.heroEmoji}>🧘‍♀️</div>
        <button
          style={{ ...styles.btn("secondary"), marginTop: "16px", width: "auto", padding: "10px 20px", fontSize: "14px", border: "2px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.15)", color: "#fff" }}
          onClick={() => setActiveTab("workout")}
        >
          Começar Treino →
        </button>
      </div>

      {/* Week Tracker */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>Sua Semana</div>
          <span style={{ fontSize: "12px", color: COLORS.textMuted }}>5/7 dias ✨</span>
        </div>
        <div style={styles.weekTracker}>
          <div style={styles.weekRow}>
            {weekDays.map((d, i) => {
              const done = completedDays.includes(i);
              const today = i === 4;
              return (
                <div key={d} style={styles.weekDay(done, today)}>
                  <div style={styles.weekDayCircle(done, today)}>
                    {done ? "✓" : today ? "•" : d.charAt(0)}
                  </div>
                  <div style={styles.weekDayLabel(today)}>{d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>Estatísticas</div>
        </div>
        <div style={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statCard(s.color)}>
              <div style={styles.statAccent(s.color)} />
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Exercises */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>Exercícios Rápidos</div>
          <button style={styles.sectionLink} onClick={() => setActiveTab("workout")}>
            Ver todos
          </button>
        </div>
        {exercises.slice(0, 3).map((ex) => (
          <div
            key={ex.id}
            style={styles.exerciseCard}
            onClick={() => setSelectedExercise(ex)}
          >
            <div style={styles.exerciseEmoji}>{ex.emoji}</div>
            <div style={styles.exerciseInfo}>
              <div style={styles.exerciseName}>{ex.name}</div>
              <div style={styles.exerciseMeta}>
                {ex.duration} · {ex.reps}
              </div>
              <div style={styles.exerciseTags}>
                {ex.muscles.map((m) => (
                  <span key={m} style={styles.exerciseTag()}>
                    {m}
                  </span>
                ))}
                <span
                  style={styles.exerciseTag(
                    ex.level === "Iniciante"
                      ? COLORS.success
                      : ex.level === "Intermediário"
                      ? COLORS.warning
                      : COLORS.danger
                  )}
                >
                  {ex.level}
                </span>
              </div>
            </div>
            <div style={styles.exerciseArrow}>›</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkout = () => (
    <div style={styles.scrollArea}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={styles.sectionTitle}>Treinos Wall Pilates</div>
        <div style={{ fontSize: "13px", color: COLORS.textMuted, marginTop: "4px", marginBottom: "16px" }}>
          Exercícios com suporte de parede
        </div>

        {/* Timer Card */}
        <div style={styles.timerCard}>
          <div style={styles.timerDisplay}>
            {String(Math.floor(workoutTimer / 60)).padStart(2, "0")}:
            {String(workoutTimer % 60).padStart(2, "0")}
          </div>
          <div style={styles.timerLabel}>Tempo de Treino</div>
          <div style={styles.timerBtns}>
            <button
              style={styles.timerBtn("start")}
              onClick={() => {
                if (activeWorkout) {
                  setActiveWorkout(false);
                } else {
                  setActiveWorkout(true);
                  const interval = setInterval(() => {
                    setWorkoutTimer((t) => t + 1);
                  }, 1000);
                  // TODO: armazenar referência do interval para limpar corretamente
                }
              }}
            >
              {activeWorkout ? "⏸ Pausar" : "▶ Iniciar"}
            </button>
            <button
              style={styles.timerBtn("reset")}
              onClick={() => {
                setWorkoutTimer(0);
                setActiveWorkout(false);
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Filter */}
        <div style={styles.filterRow}>
          {["Todos", "Iniciante", "Intermediário", "Avançado"].map((f) => (
            <button
              key={f}
              style={styles.filterPill(filterLevel === f)}
              onClick={() => setFilterLevel(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Exercise List */}
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            style={styles.exerciseCard}
            onClick={() => setSelectedExercise(ex)}
          >
            <div style={styles.exerciseEmoji}>{ex.emoji}</div>
            <div style={styles.exerciseInfo}>
              <div style={styles.exerciseName}>{ex.name}</div>
              <div style={styles.exerciseMeta}>
                {ex.duration} · {ex.reps} · 🔥 {ex.calories} kcal
              </div>
              <div style={styles.exerciseTags}>
                {ex.muscles.map((m) => (
                  <span key={m} style={styles.exerciseTag()}>
                    {m}
                  </span>
                ))}
                <span
                  style={styles.exerciseTag(
                    ex.level === "Iniciante"
                      ? COLORS.success
                      : ex.level === "Intermediário"
                      ? COLORS.warning
                      : COLORS.danger
                  )}
                >
                  {ex.level}
                </span>
              </div>
            </div>
            <div style={styles.exerciseArrow}>›</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNutrition = () => {
    const totalCals = mealPlans.reduce((a, m) => a + m.calories, 0);
    const goalCals = 1800;
    const pct = Math.round((totalCals / goalCals) * 100);

    return (
      <div style={styles.scrollArea}>
        <div style={{ padding: "20px 20px 0" }}>
          <div style={styles.sectionTitle}>Plano Alimentar</div>
          <div style={{ fontSize: "13px", color: COLORS.textMuted, marginTop: "4px", marginBottom: "16px" }}>
            Nutrição balanceada para seus objetivos
          </div>

          {/* Calorie Progress */}
          <div
            style={{
              background: COLORS.bgCard,
              borderRadius: "16px",
              padding: "20px",
              border: `1px solid ${COLORS.border}`,
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div>
                <div style={{ fontSize: "13px", color: COLORS.textMuted }}>Calorias Hoje</div>
                <div style={{ fontSize: "28px", fontWeight: "900", color: COLORS.text }}>
                  {totalCals}
                  <span style={{ fontSize: "14px", color: COLORS.textMuted, fontWeight: "400" }}>
                    {" "}/ {goalCals} kcal
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: `conic-gradient(${COLORS.primary} ${pct * 3.6}deg, ${COLORS.border} 0deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: COLORS.bgCard,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: COLORS.primaryLight,
                  }}
                >
                  {pct}%
                </div>
              </div>
            </div>
            <div
              style={{
                height: "6px",
                borderRadius: "3px",
                background: COLORS.border,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
                  borderRadius: "3px",
                  transition: "width 0.5s",
                }}
              />
            </div>
          </div>

          {/* Meals */}
          {mealPlans.map((meal) => (
            <div
              key={meal.time}
              style={styles.mealCard(meal.color)}
              onClick={() => setSelectedMeal(meal)}
            >
              <div style={styles.mealTime}>{meal.time_short}</div>
              <div style={styles.mealIcon}>{meal.icon}</div>
              <div style={styles.mealInfo}>
                <div style={styles.mealName}>{meal.meal}</div>
                <div style={styles.mealCals}>{meal.time} · {meal.calories} kcal</div>
              </div>
              <div style={styles.mealArrow}>›</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProgress = () => (
    <div style={styles.scrollArea}>
      <div style={{ padding: "20px 20px 0" }}>
        <div style={styles.sectionTitle}>Meu Progresso</div>
        <div style={{ fontSize: "13px", color: COLORS.textMuted, marginTop: "4px", marginBottom: "20px" }}>
          Continue assim! Você está indo muito bem 🌟
        </div>

        {/* Achievement Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.warning}33, ${COLORS.warning}11)`,
            border: `1px solid ${COLORS.warning}44`,
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{ fontSize: "40px" }}>🏆</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: COLORS.text, marginBottom: "4px" }}>
              7 Dias Consecutivos!
            </div>
            <div style={{ fontSize: "12px", color: COLORS.textMuted }}>
              Você conquistou o distintivo "Semana Perfeita"
            </div>
          </div>
        </div>

        {/* Stats Full */}
        <div style={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statCard(s.color)}>
              <div style={styles.statAccent(s.color)} />
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Bars */}
        <div
          style={{
            background: COLORS.bgCard,
            borderRadius: "16px",
            padding: "20px",
            border: `1px solid ${COLORS.border}`,
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>
            Metas da Semana
          </div>
          {[
            { label: "Treinos Realizados", value: 5, max: 7, color: COLORS.primary },
            { label: "Meta de Calorias", value: 80, max: 100, color: COLORS.secondary, unit: "%" },
            { label: "Hidratação", value: 6, max: 8, color: COLORS.accent, unit: "copos" },
            { label: "Horas de Sono", value: 7, max: 8, color: COLORS.warning, unit: "h" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: COLORS.textLight }}>{item.label}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: COLORS.text }}>
                  {item.value}/{item.max} {item.unit || ""}
                </span>
              </div>
              <div style={{ height: "8px", borderRadius: "4px", background: COLORS.border, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(item.value / item.max) * 100}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}BB)`,
                    borderRadius: "4px",
                    transition: "width 0.5s",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div style={{ fontSize: "16px", fontWeight: "700", color: COLORS.text, marginBottom: "12px" }}>
          Conquistas
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          {[
            { emoji: "🔥", label: "7 Dias", unlocked: true },
            { emoji: "💪", label: "20 Treinos", unlocked: true },
            { emoji: "🧘", label: "Pilates Pro", unlocked: true },
            { emoji: "⚡", label: "Maratonista", unlocked: false },
            { emoji: "🌟", label: "30 Dias", unlocked: false },
            { emoji: "🏅", label: "Elite", unlocked: false },
          ].map((a) => (
            <div
              key={a.label}
              style={{
                background: a.unlocked ? `${COLORS.primary}22` : COLORS.bgCard,
                border: `1px solid ${a.unlocked ? COLORS.primary + "44" : COLORS.border}`,
                borderRadius: "14px",
                padding: "14px 8px",
                textAlign: "center",
                opacity: a.unlocked ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "6px", filter: a.unlocked ? "none" : "grayscale(1)" }}>
                {a.emoji}
              </div>
              <div style={{ fontSize: "11px", color: a.unlocked ? COLORS.textLight : COLORS.textMuted, fontWeight: "600" }}>
                {a.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div style={styles.scrollArea}>
      <div style={styles.profileHeader}>
        <div style={styles.profileAvatar}>🧘</div>
        <div style={styles.profileName}>Meu Perfil</div>
        <div style={styles.profileSub}>Josue Business & Developing LLC</div>
        <div
          style={{
            display: "inline-block",
            marginTop: "8px",
            background: `${COLORS.primary}33`,
            border: `1px solid ${COLORS.primary}44`,
            borderRadius: "20px",
            padding: "4px 14px",
            fontSize: "12px",
            color: COLORS.primaryLight,
            fontWeight: "600",
          }}
        >
          ✨ Plano Premium
        </div>
      </div>

      <div style={styles.profileMenuSection}>
        <div style={{ fontSize: "11px", color: COLORS.textMuted, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px", paddingLeft: "4px" }}>
          Minha Conta
        </div>
        {[
          { icon: "👤", label: "Dados Pessoais" },
          { icon: "🎯", label: "Meus Objetivos" },
          { icon: "📏", label: "Medidas Corporais" },
          { icon: "🔔", label: "Notificações" },
        ].map((item) => (
          <div key={item.label} style={styles.profileMenuItem}>
            <div style={styles.profileMenuIcon}>{item.icon}</div>
            <div style={styles.profileMenuLabel}>{item.label}</div>
            <div style={styles.profileMenuArrow}>›</div>
          </div>
        ))}
      </div>

      <div style={styles.profileMenuSection}>
        <div style={{ fontSize: "11px", color: COLORS.textMuted, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px", paddingLeft: "4px" }}>
          Preferências
        </div>
        {[
          { icon: "🌐", label: "Idioma: Português (BR)" },
          { icon: "⚙️", label: "Configurações" },
          { icon: "🔒", label: "Privacidade" },
          { icon: "❓", label: "Ajuda e Suporte" },
        ].map((item) => (
          <div key={item.label} style={styles.profileMenuItem}>
            <div style={styles.profileMenuIcon}>{item.icon}</div>
            <div style={styles.profileMenuLabel}>{item.label}</div>
            <div style={styles.profileMenuArrow}>›</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            background: `${COLORS.danger}11`,
            border: `1px solid ${COLORS.danger}33`,
            borderRadius: "14px",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: `${COLORS.danger}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            🚪
          </div>
          <div style={{ flex: 1, fontSize: "15px", fontWeight: "600", color: COLORS.danger }}>
            Sair da Conta
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: COLORS.textMuted }}>
          CORPOLEVE - WALL PILATES v1.0.0{"\n"}
          <br />
          © 2024 Josue Business & Developing LLC
        </div>
      </div>
    </div>
  );

  // SPLASH SCREEN
  if (screen === "splash") {
    return (
      <div style={styles.app}>
        <div style={styles.splash}>
          <div style={styles.splashGlow} />
          <div style={styles.splashLogo}>🧘</div>
          <div style={styles.splashBrand}>Josue Business & Developing LLC</div>
          <div style={styles.splashTitle}>CORPOLEVE</div>
          <div style={{ fontSize: "16px", fontWeight: "600", color: COLORS.primaryLight, marginBottom: "4px", letterSpacing: "4px" }}>
            WALL PILATES
          </div>
          <div style={styles.splashSubtitle}>
            Transforme seu corpo com exercícios de parede. Pilates acessível para todos os níveis.
          </div>
          <div style={styles.splashFeatures}>
            {[
              { icon: "🏋️", text: "Treinos personalizados de Wall Pilates" },
              { icon: "🥗", text: "Planos alimentares balanceados" },
              { icon: "📊", text: "Acompanhamento de progresso em tempo real" },
            ].map((f) => (
              <div key={f.text} style={styles.splashFeatureItem}>
                <div style={styles.splashFeatureIcon}>{f.icon}</div>
                <div style={styles.splashFeatureText}>{f.text}</div>
              </div>
            ))}
          </div>
          <button style={styles.btn("primary")} onClick={handleSplash}>
            Começar Agora →
          </button>
          <div style={{ marginTop: "16px", fontSize: "12px", color: COLORS.textMuted }}>
            Já tem uma conta?{" "}
            <span style={{ color: COLORS.primaryLight, fontWeight: "600", cursor: "pointer" }} onClick={() => setScreen("home")}>
              Entrar
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ONBOARDING
  if (screen === "onboarding") {
    return (
      <div style={styles.app}>
        <div style={styles.onboarding}>
          <div style={styles.onboardingImage}>
            <div style={styles.onboardingBadge}>CORPOLEVE · WALL PILATES</div>
            <span style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.3))", zIndex: 1 }}>
              🧘‍♀️
            </span>
            {/* Decorative circles */}
            <div style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)", bottom: "-50px", right: "-50px" }} />
            <div style={{ position: "absolute", width: "150px", height: "150px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.08)", top: "30px", left: "-30px" }} />
          </div>
          <div style={styles.onboardingContent}>
            <div style={styles.onboardingTag}>🌟 Bem-vinda ao Corpoleve</div>
            <div style={styles.onboardingTitle}>
              Wall Pilates para Todos os Níveis
            </div>
            <div style={styles.onboardingDesc}>
              Exercícios seguros e eficazes usando apenas uma parede. Fortaleça o core, melhore a postura e ganhe flexibilidade no conforto da sua casa.
            </div>
            <div style={styles.pillsRow}>
              {["🧘 Flexibilidade", "💪 Força", "⚖️ Equilíbrio", "🌿 Bem-estar"].map((p) => (
                <div key={p} style={styles.pill}>{p}</div>
              ))}
            </div>
            <button style={styles.btn("primary")} onClick={handleOnboarding}>
              Personalizar meu plano →
            </button>
            <button
              style={{ ...styles.btn("secondary"), marginTop: "10px" }}
              onClick={() => setScreen("home")}
            >
              Pular
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ
  if (screen === "quiz") {
    const q = quizQuestions[quizStep];
    return (
      <div style={styles.app}>
        <div style={styles.quiz}>
          {/* Progress */}
          <div style={styles.quizProgress}>
            {quizQuestions.map((_, i) => (
              <div
                key={i}
                style={styles.quizProgressBar(i === quizStep, i < quizStep)}
              />
            ))}
          </div>

          <div style={styles.quizHeader}>
            <div style={styles.quizStep}>
              Pergunta {quizStep + 1} de {quizQuestions.length}
            </div>
            <div style={styles.quizQuestion}>{q.question}</div>
          </div>

          <div style={styles.quizOptions}>
            {q.options.map((opt) => (
              <button
                key={opt.label}
                style={styles.quizOption(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${COLORS.primary}33`;
                  e.currentTarget.style.borderColor = COLORS.primary;
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = COLORS.bgCard;
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => handleQuizAnswer(opt.label)}
              >
                <div style={styles.quizOptionIcon}>{opt.icon}</div>
                <div style={styles.quizOptionLabel}>{opt.label}</div>
              </button>
            ))}
          </div>

          <button
            style={{ ...styles.btn("secondary"), marginTop: "24px", fontSize: "14px", padding: "12px" }}
            onClick={() => quizStep > 0 ? setQuizStep(quizStep - 1) : setScreen("onboarding")}
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={styles.app}>
      {/* Page Title Bar */}
      <div
        style={{
          padding: "16px 20px 0",
          background: `${COLORS.bg}CC`,
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: activeTab !== "home" ? `1px solid ${COLORS.border}` : "none",
        }}
      >
        {activeTab !== "home" && (
          <div style={{ paddingBottom: "12px" }}>
            <div
              style={{
                fontSize: "11px",
                color: COLORS.textMuted,
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "2px",
              }}
            >
              CORPOLEVE
            </div>
            <div style={{ fontSize: "20px", fontWeight: "900", color: COLORS.text }}>
              {tabs.find((t) => t.id === activeTab)?.label}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        {activeTab === "home" && renderHome()}
        {activeTab === "workout" && renderWorkout()}
        {activeTab === "nutrition" && renderNutrition()}
        {activeTab === "progress" && renderProgress()}
        {activeTab === "profile" && renderProfile()}
      </div>

      {/* Bottom Nav */}
      <div style={styles.bottomNav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            style={styles.navItem(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            <div style={styles.navActiveIndicator(activeTab === tab.id)} />
            <div style={styles.navIcon(activeTab === tab.id)}>{tab.icon}</div>
            <div style={styles.navLabel(activeTab === tab.id)}>{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Exercise Modal */}
      {selectedExercise && (
        <div style={styles.modalOverlay} onClick={() => setSelectedExercise(null)}>
          <div style={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHandle} />
            <div style={{ textAlign: "center", fontSize: "60px", marginBottom: "16px" }}>
              {selectedExercise.emoji}
            </div>
            <div style={styles.modalTitle}>{selectedExercise.name}</div>
            <div style={styles.modalSubtitle}>{selectedExercise.description}</div>

            <div style={styles.macroRow}>
              <div style={styles.macroBox(COLORS.primary)}>
                <div style={styles.macroValue}>{selectedExercise.duration}</div>
                <div style={styles.macroLabel}>Duração</div>
              </div>
              <div style={styles.macroBox(COLORS.secondary)}>
                <div style={styles.macroValue}>{selectedExercise.reps}</div>
                <div style={styles.macroLabel}>Séries</div>
              </div>
              <div style={styles.macroBox(COLORS.warning)}>
                <div style={styles.macroValue}>{selectedExercise.calories}</div>
                <div style={styles.macroLabel}>Kcal</div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: COLORS.textMuted, marginBottom: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
                Músculos Trabalhados
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {selectedExercise.muscles.map((m) => (
                  <span key={m} style={{ ...styles.exerciseTag(), padding: "6px 14px", fontSize: "13px" }}>
                    💪 {m}
                  </span>
                ))}
              </div>
            </div>

            <button
              style={styles.btn("primary")}
              onClick={() => {
                setSelectedExercise(null);
                setActiveTab("workout");
              }}
            >
              🔥 Iniciar Exercício
            </button>
            <button
              style={{ ...styles.btn("secondary"), marginTop: "10px" }}
              onClick={() => setSelectedExercise(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Meal Modal */}
      {selectedMeal && (
        <div style={styles.modalOverlay} onClick={() => setSelectedMeal(null)}>
          <div style={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHandle} />
            <div style={{ textAlign: "center", fontSize: "60px", marginBottom: "16px" }}>
              {selectedMeal.icon}
            </div>
            <div style={{ fontSize: "12px", color: selectedMeal.color, fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>
              {selectedMeal.time} · {selectedMeal.time_short}
            </div>
            <div style={styles.modalTitle}>{selectedMeal.meal}</div>
            <div style={styles.modalSubtitle}>
              Refeição balanceada para seu objetivo de saúde e bem-estar.
            </div>

            <div style={styles.macroRow}>
              <div style={styles.macroBox(COLORS.warning)}>
                <div style={styles.macroValue}>{selectedMeal.calories}</div>
                <div style={styles.macroLabel}>Kcal</div>
              </div>
              <div style={styles.macroBox(COLORS.primary)}>
                <div style={styles.macroValue}>{selectedMeal.protein}</div>
                <div style={styles.macroLabel}>Proteína</div>
              </div>
              <div style={styles.macroBox(COLORS.secondary)}>
                <div style={styles.macroValue}>{selectedMeal.carbs}</div>
                <div style={styles.macroLabel}>Carbos</div>
              </div>
              <div style={styles.macroBox(COLORS.accent)}>
                <div style={styles.macroValue}>{selectedMeal.fat}</div>
                <div style={styles.macroLabel}>Gordura</div>
              </div>
            </div>

            <button style={styles.btn("primary")} onClick={() => setSelectedMeal(null)}>
              ✅ Marcar como consumida
            </button>
            <button
              style={{ ...styles.btn("secondary"), marginTop: "10px" }}
              onClick={() => setSelectedMeal(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
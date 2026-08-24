import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { loadState, saveState } from "../lib/storage.js";
import { generateId } from "../lib/ids.js";
import { trackEvent } from "../lib/analytics.js";
import { EVENTS } from "../content/analyticsEvents.js";

const initialState = {
  user: null,
  child: null,
  sleepLogs: [],
  caregivers: [],
  routines: {},
  subscription: { plan: "free", billingCycle: null, startedAt: null },
  settings: {
    nightModeAuto: true,
    nightModeStart: "21:00",
    nightModeEnd: "07:00",
    activeCaregiverRole: "mama",
  },
  sos: { dateKey: null, count: 0, sessionTried: [] },
  momVoiceMessages: [],
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload };

    case "REGISTER_USER": {
      const user = { id: generateId("user"), name: action.name, email: action.email, createdAt: new Date().toISOString() };
      return { ...state, user };
    }

    case "CREATE_CHILD": {
      const child = { id: generateId("child"), ...action.child };
      trackEvent(EVENTS.CHILD_PROFILE_CREATED, { childId: child.id });
      return { ...state, child };
    }

    case "UPDATE_CHILD":
      return { ...state, child: { ...state.child, ...action.patch } };

    case "LOG_SLEEP_EVENT": {
      const entry = {
        id: generateId("log"),
        type: action.logType,
        timestamp: action.timestamp || new Date().toISOString(),
        source: action.source || state.settings.activeCaregiverRole,
      };
      if (entry.type === "nap_end") trackEvent(EVENTS.NAP_LOGGED, { childId: state.child?.id });
      if (entry.type === "wake") trackEvent(EVENTS.NIGHT_SLEEP_LOGGED, { childId: state.child?.id });
      return { ...state, sleepLogs: [entry, ...state.sleepLogs].slice(0, 500) };
    }

    case "ADD_CAREGIVER": {
      const caregiver = { id: generateId("caregiver"), status: "invitado", ...action.caregiver };
      trackEvent(EVENTS.CAREGIVER_INVITED, { role: caregiver.role });
      return { ...state, caregivers: [...state.caregivers, caregiver] };
    }

    case "REMOVE_CAREGIVER":
      return { ...state, caregivers: state.caregivers.filter((c) => c.id !== action.id) };

    case "SET_ACTIVE_CAREGIVER_ROLE":
      return { ...state, settings: { ...state.settings, activeCaregiverRole: action.role } };

    case "UPDATE_ROUTINE":
      return { ...state, routines: { ...state.routines, [action.routineType]: action.steps } };

    case "SET_SUBSCRIPTION": {
      trackEvent(EVENTS.SUBSCRIPTION_STARTED, { plan: action.plan, cycle: action.billingCycle });
      return {
        ...state,
        subscription: { plan: action.plan, billingCycle: action.billingCycle || null, startedAt: new Date().toISOString() },
      };
    }

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case "SOS_INCREMENT_USAGE": {
      const key = todayKey();
      const count = state.sos.dateKey === key ? state.sos.count + 1 : 1;
      return { ...state, sos: { ...state.sos, dateKey: key, count } };
    }

    case "SOS_MARK_TRIED":
      return { ...state, sos: { ...state.sos, sessionTried: [...state.sos.sessionTried, action.strategyId] } };

    case "SOS_RESET_SESSION":
      return { ...state, sos: { ...state.sos, sessionTried: [] } };

    case "ADD_MOM_VOICE":
      return { ...state, momVoiceMessages: [...state.momVoiceMessages, action.message] };

    case "REMOVE_MOM_VOICE":
      return { ...state, momVoiceMessages: state.momVoiceMessages.filter((m) => m.id !== action.id) };

    case "LOGOUT":
      return { ...initialState };

    default:
      return state;
  }
}

const AppStateContext = createContext(null);
const AppDispatchContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const persisted = loadState();
    return persisted ? { ...init, ...persisted } : init;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState debe usarse dentro de AppProvider");
  return ctx;
}

export function useAppDispatch() {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error("useAppDispatch debe usarse dentro de AppProvider");
  return ctx;
}

export function todayKeyUtil() {
  return todayKey();
}

export const FREE_SOS_DAILY_LIMIT = 3;

export function sosUsesRemainingToday(state) {
  if (state.subscription.plan !== "free") return Infinity;
  const key = todayKey();
  const usedToday = state.sos.dateKey === key ? state.sos.count : 0;
  return Math.max(0, FREE_SOS_DAILY_LIMIT - usedToday);
}

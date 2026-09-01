import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import type { ChildProfile, PlanAction, SleepEvent, SleepEventType, SleepPlan } from "@/types";
import { generateId } from "@/utils/id";
import { trackEvent } from "@/services/events";
import { DEFAULT_PLAN_TEMPLATE } from "@/data/planTemplates";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchChildProfileRow,
  mapRowToChildProfile,
  mapRowToPlan,
  updatePlanSection as persistPlanSection,
  updateWindowOffset as persistWindowOffset,
  upsertChildProfile,
} from "@/services/childProfileService";
import { deleteSleepEvent, fetchSleepEvents, insertSleepEvent } from "@/services/sleepEventsService";

function freshPlan(): SleepPlan {
  const toActions = (texts: string[]) => texts.map((text) => ({ id: generateId("action"), text }));
  return {
    morning: toActions(DEFAULT_PLAN_TEMPLATE.morning),
    afternoon: toActions(DEFAULT_PLAN_TEMPLATE.afternoon),
    night: toActions(DEFAULT_PLAN_TEMPLATE.night),
    updatedAt: null,
  };
}

export interface AppState {
  child: ChildProfile | null;
  events: SleepEvent[];
  plan: SleepPlan;
  windowOffsetMinutes: number;
  ready: boolean; // true una vez que se intentó cargar desde Supabase
}

const initialState: AppState = {
  child: null,
  events: [],
  plan: freshPlan(),
  windowOffsetMinutes: 0,
  ready: false,
};

// Acciones internas del reducer: siempre payloads ya resueltos (ids,
// timestamps, account_id ya calculados). El reducer es puro — la
// persistencia y la analítica viven en el dispatch envolvente de abajo.
type InternalAction =
  | { type: "HYDRATE"; payload: Partial<AppState> }
  | { type: "SET_CHILD"; child: ChildProfile }
  | { type: "UPDATE_CHILD"; patch: Partial<ChildProfile> }
  | { type: "ADD_EVENT_ENTRY"; event: SleepEvent }
  | { type: "DELETE_EVENT"; id: string }
  | { type: "SET_PLAN_SECTION"; section: "morning" | "afternoon" | "night"; actions: PlanAction[] }
  | { type: "SET_WINDOW_OFFSET"; offset: number }
  | { type: "CLEAR" };

// Acciones públicas: la forma que ya usan las pantallas existentes.
export type Action =
  | { type: "CREATE_PROFILE"; child: Omit<ChildProfile, "id" | "createdAt" | "accountId"> }
  | { type: "UPDATE_PROFILE"; patch: Partial<ChildProfile> }
  | { type: "SET_PHOTO"; photoDataUrl: string | undefined }
  | { type: "ADD_EVENT"; eventType: SleepEventType; timestamp?: string }
  | { type: "DELETE_EVENT"; id: string }
  | { type: "UPDATE_PLAN_SECTION"; section: "morning" | "afternoon" | "night"; actions: PlanAction[] }
  | { type: "SET_WINDOW_OFFSET"; offset: number };

function reducer(state: AppState, action: InternalAction): AppState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, ready: true };

    case "SET_CHILD":
      return { ...state, child: action.child };

    case "UPDATE_CHILD":
      return state.child ? { ...state, child: { ...state.child, ...action.patch } } : state;

    case "ADD_EVENT_ENTRY":
      return { ...state, events: [action.event, ...state.events].slice(0, 400) };

    case "DELETE_EVENT":
      return { ...state, events: state.events.filter((e) => e.id !== action.id) };

    case "SET_PLAN_SECTION":
      return { ...state, plan: { ...state.plan, [action.section]: action.actions, updatedAt: new Date().toISOString() } };

    case "SET_WINDOW_OFFSET":
      return { ...state, windowOffsetMinutes: action.offset };

    case "CLEAR":
      return { ...initialState, plan: freshPlan(), ready: true };

    default:
      return state;
  }
}

const StateContext = createContext<AppState | null>(null);
const DispatchContext = createContext<((action: Action) => void) | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { membership, session, loading: authLoading } = useAuth();
  const [state, rawDispatch] = useReducer(reducer, initialState);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const accountId = membership?.status === "activo" ? membership.accountId : null;

  // Hidrata (o limpia) el estado cuando cambia la cuenta activa. Mientras la
  // autenticación todavía se está resolviendo (authLoading), NO tocamos el
  // estado: membership empieza en null antes de resolverse, y si limpiáramos
  // aquí (ready=true, child=null) justo en ese instante, RequireProfile
  // (que ya lee ese estado) redirigía a /onboarding un instante antes de que
  // la hidratación real terminara — perdiendo a una usuaria con perfil
  // completo en la pantalla de onboarding sin motivo.
  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    if (!accountId) {
      rawDispatch({ type: "CLEAR" });
      return;
    }

    async function hydrate() {
      const [row, events] = await Promise.all([fetchChildProfileRow(accountId!), fetchSleepEvents(accountId!)]);
      if (cancelled) return;
      rawDispatch({
        type: "HYDRATE",
        payload: {
          child: row ? mapRowToChildProfile(row) : null,
          plan: row ? mapRowToPlan(row) : freshPlan(),
          windowOffsetMinutes: row?.window_offset_minutes ?? 0,
          events,
        },
      });
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [accountId, authLoading]);

  function dispatch(action: Action) {
    const email = session?.user?.email || null;

    switch (action.type) {
      case "CREATE_PROFILE": {
        if (!accountId) return;
        const child: ChildProfile = {
          id: generateId("child"),
          accountId,
          createdAt: new Date().toISOString(),
          ...action.child,
        };
        rawDispatch({ type: "SET_CHILD", child });
        void upsertChildProfile(accountId, child);
        trackEvent("perfil_creado", { ageStage: child.ageStage });
        return;
      }

      case "UPDATE_PROFILE": {
        if (!stateRef.current.child) return;
        const updated = { ...stateRef.current.child, ...action.patch };
        rawDispatch({ type: "UPDATE_CHILD", patch: action.patch });
        if (accountId) void upsertChildProfile(accountId, updated);
        trackEvent("perfil_editado", { fields: Object.keys(action.patch) });
        return;
      }

      case "SET_PHOTO": {
        if (!stateRef.current.child) return;
        const updated = { ...stateRef.current.child, photoDataUrl: action.photoDataUrl };
        rawDispatch({ type: "UPDATE_CHILD", patch: { photoDataUrl: action.photoDataUrl } });
        if (accountId) void upsertChildProfile(accountId, updated);
        trackEvent("foto_actualizada", { hasPhoto: Boolean(action.photoDataUrl) });
        return;
      }

      case "ADD_EVENT": {
        if (!accountId) return;
        const event: SleepEvent = {
          id: generateId("event"),
          accountId,
          type: action.eventType,
          timestamp: action.timestamp || new Date().toISOString(),
        };
        rawDispatch({ type: "ADD_EVENT_ENTRY", event });
        void insertSleepEvent(event, email);
        trackEvent("registro_creado", { type: event.type });
        return;
      }

      case "DELETE_EVENT": {
        rawDispatch({ type: "DELETE_EVENT", id: action.id });
        void deleteSleepEvent(action.id);
        return;
      }

      case "UPDATE_PLAN_SECTION": {
        rawDispatch({ type: "SET_PLAN_SECTION", section: action.section, actions: action.actions });
        if (accountId) void persistPlanSection(accountId, action.section, action.actions);
        trackEvent("plan_editado", { section: action.section });
        return;
      }

      case "SET_WINDOW_OFFSET": {
        rawDispatch({ type: "SET_WINDOW_OFFSET", offset: action.offset });
        if (accountId) void persistWindowOffset(accountId, action.offset);
        trackEvent("ventana_sueno_ajustada", { offset: action.offset });
        return;
      }

      default:
        return;
    }
  }

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppState debe usarse dentro de AppProvider");
  return ctx;
}

export function useAppDispatch(): (action: Action) => void {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useAppDispatch debe usarse dentro de AppProvider");
  return ctx;
}

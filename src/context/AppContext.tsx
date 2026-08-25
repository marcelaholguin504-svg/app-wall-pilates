import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import type { Caregiver, ChildProfile, SleepEvent, SleepEventType, SleepPlan } from "@/types";
import { loadState, saveState } from "@/services/storage";
import { generateId } from "@/utils/id";
import { trackEvent } from "@/services/events";
import { DEFAULT_PLAN_TEMPLATE } from "@/data/planTemplates";

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
  caregivers: Caregiver[];
  events: SleepEvent[];
  plan: SleepPlan;
  windowOffsetMinutes: number;
}

const initialState: AppState = {
  child: null,
  caregivers: [],
  events: [],
  plan: freshPlan(),
  windowOffsetMinutes: 0,
};

type Action =
  | { type: "HYDRATE"; payload: Partial<AppState> }
  | { type: "CREATE_PROFILE"; child: Omit<ChildProfile, "id" | "createdAt"> }
  | { type: "UPDATE_PROFILE"; patch: Partial<ChildProfile> }
  | { type: "SET_PHOTO"; photoDataUrl: string | undefined }
  | { type: "ADD_EVENT"; eventType: SleepEventType; timestamp?: string }
  | { type: "DELETE_EVENT"; id: string }
  | { type: "ADD_CAREGIVER"; caregiver: Omit<Caregiver, "id"> }
  | { type: "REMOVE_CAREGIVER"; id: string }
  | { type: "UPDATE_PLAN_SECTION"; section: "morning" | "afternoon" | "night"; actions: { id: string; text: string }[] }
  | { type: "SET_WINDOW_OFFSET"; offset: number }
  | { type: "RESET_ALL" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload };

    case "CREATE_PROFILE": {
      const child: ChildProfile = { id: generateId("child"), createdAt: new Date().toISOString(), ...action.child };
      trackEvent("perfil_creado", { ageStage: child.ageStage, caregiverType: child.caregiverType });
      return { ...state, child };
    }

    case "UPDATE_PROFILE": {
      if (!state.child) return state;
      trackEvent("perfil_editado", { fields: Object.keys(action.patch) });
      return { ...state, child: { ...state.child, ...action.patch } };
    }

    case "SET_PHOTO": {
      if (!state.child) return state;
      trackEvent("foto_actualizada", { hasPhoto: Boolean(action.photoDataUrl) });
      return { ...state, child: { ...state.child, photoDataUrl: action.photoDataUrl } };
    }

    case "ADD_EVENT": {
      const event: SleepEvent = {
        id: generateId("event"),
        type: action.eventType,
        timestamp: action.timestamp || new Date().toISOString(),
      };
      trackEvent("registro_creado", { type: event.type });
      return { ...state, events: [event, ...state.events].slice(0, 400) };
    }

    case "DELETE_EVENT":
      return { ...state, events: state.events.filter((e) => e.id !== action.id) };

    case "ADD_CAREGIVER": {
      const caregiver: Caregiver = { id: generateId("caregiver"), ...action.caregiver };
      trackEvent("cuidador_agregado", { type: caregiver.type });
      return { ...state, caregivers: [...state.caregivers, caregiver] };
    }

    case "REMOVE_CAREGIVER":
      return { ...state, caregivers: state.caregivers.filter((c) => c.id !== action.id) };

    case "UPDATE_PLAN_SECTION": {
      trackEvent("plan_editado", { section: action.section });
      return {
        ...state,
        plan: { ...state.plan, [action.section]: action.actions, updatedAt: new Date().toISOString() },
      };
    }

    case "SET_WINDOW_OFFSET":
      trackEvent("ventana_sueno_ajustada", { offset: action.offset });
      return { ...state, windowOffsetMinutes: action.offset };

    case "RESET_ALL":
      return { ...initialState, plan: freshPlan() };

    default:
      return state;
  }
}

const StateContext = createContext<AppState | null>(null);
const DispatchContext = createContext<React.Dispatch<Action> | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const persisted = loadState<AppState>();
    return persisted ? { ...init, ...persisted } : init;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

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

export function useAppDispatch(): React.Dispatch<Action> {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useAppDispatch debe usarse dentro de AppProvider");
  return ctx;
}

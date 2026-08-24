// Arquitectura preparada: nombres técnicos de eventos (en inglés por convención
// interna). No se envían a ningún servicio todavía; ver src/lib/analytics.js.

export const EVENTS = {
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_COMPLETED: "onboarding_completed",
  CHILD_PROFILE_CREATED: "child_profile_created",
  SOS_STARTED: "sos_started",
  SOS_COMPLETED: "sos_completed",
  SOS_SUCCESSFUL: "sos_successful",
  NAP_LOGGED: "nap_logged",
  NIGHT_SLEEP_LOGGED: "night_sleep_logged",
  CAREGIVER_INVITED: "caregiver_invited",
  PAYWALL_VIEWED: "paywall_viewed",
  TRIAL_STARTED: "trial_started",
  SUBSCRIPTION_STARTED: "subscription_started",
};

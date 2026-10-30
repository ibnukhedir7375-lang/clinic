export const ROLES = {
  ADMIN: "admin",
  RECEPTION: "reception",
  NURSE: "nurse",
  DOCTOR: "doctor",
  LAB: "lab",
  PHARMACY: "pharmacy",
};

export const ROLE_LABELS = {
  admin: "Administrator",
  reception: "Reception",
  nurse: "Nurse",
  doctor: "Doctor",
  lab: "Laboratory",
  pharmacy: "Pharmacy",
};

const ALL = Object.values(ROLES);

// Sidebar links. The first link a role can see is its home page.
export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "grid", roles: [ROLES.ADMIN] },
  { to: "/reception", label: "Reception", icon: "desk", roles: [ROLES.RECEPTION, ROLES.ADMIN] },
  { to: "/triage", label: "Triage", icon: "heart", roles: [ROLES.NURSE] },
  { to: "/consultations", label: "Consultations", icon: "stethoscope", roles: [ROLES.DOCTOR] },
  { to: "/laboratory", label: "Laboratory", icon: "flask", roles: [ROLES.LAB] },
  { to: "/pharmacy", label: "Pharmacy", icon: "pill", roles: [ROLES.PHARMACY] },
  { to: "/patients", label: "Patients", icon: "users", roles: ALL },
  { to: "/staff", label: "Staff", icon: "badge", roles: [ROLES.ADMIN] },
];

export const navFor = (role) => NAV_ITEMS.filter((item) => item.roles.includes(role));
export const homeFor = (role) => navFor(role)[0]?.to ?? "/patients";

// Is `path` one of the pages this role may open? (Used after login to decide
// whether to return to the page the user came from.)
export function canVisit(role, path) {
  const item = NAV_ITEMS.find((nav) => path.startsWith(nav.to));
  return item ? item.roles.includes(role) : true;
}

export type Language = "ro" | "en" | "es";

export const translations = {
  ro: {
    appName: "RemindDocs",

    dashboard: "Dashboard",
    documents: "Documente",
    folders: "Foldere",
    calendar: "Calendar",
    notifications: "Notificări",
    ai: "AI Assistant",
    settings: "Setări",

    logout: "Logout",

    addDocument: "Adaugă document",
    documentName: "Nume document",
    expiryDate: "Data expirării",
    folder: "Folder",

    save: "Salvează",
    cancel: "Anulează",

    totalDocuments: "Total documente",
    active: "Active",
    expired: "Expirate",
    expiringSoon: "Expiră curând",

    myDocuments: "Documentele mele",

    noDocuments: "Nu există documente.",

    loading: "Se încarcă...",

    smartManager: "Gestionare inteligentă a documentelor",

    soon: "În curând",
  },

  en: {
    appName: "RemindDocs",

    dashboard: "Dashboard",
    documents: "Documents",
    folders: "Folders",
    calendar: "Calendar",
    notifications: "Notifications",
    ai: "AI Assistant",
    settings: "Settings",

    logout: "Logout",

    addDocument: "Add document",
    documentName: "Document name",
    expiryDate: "Expiry date",
    folder: "Folder",

    save: "Save",
    cancel: "Cancel",

    totalDocuments: "Total documents",
    active: "Active",
    expired: "Expired",
    expiringSoon: "Expiring soon",

    myDocuments: "My Documents",

    noDocuments: "No documents.",

    loading: "Loading...",

    smartManager: "Smart document manager",

    soon: "Soon",
  },

  es: {
    appName: "RemindDocs",

    dashboard: "Panel",
    documents: "Documentos",
    folders: "Carpetas",
    calendar: "Calendario",
    notifications: "Notificaciones",
    ai: "Asistente IA",
    settings: "Configuración",

    logout: "Cerrar sesión",

    addDocument: "Añadir documento",
    documentName: "Nombre del documento",
    expiryDate: "Fecha de expiración",
    folder: "Carpeta",

    save: "Guardar",
    cancel: "Cancelar",

    totalDocuments: "Documentos",
    active: "Activos",
    expired: "Expirados",
    expiringSoon: "Próximos a vencer",

    myDocuments: "Mis documentos",

    noDocuments: "No hay documentos.",

    loading: "Cargando...",

    smartManager: "Gestor inteligente de documentos",

    soon: "Próximamente",
  },
} as const;
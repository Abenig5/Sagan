// Copy ported verbatim (both languages) from the design prototype's `T` object.
// Treat this file as the source of truth for site copy.

export type Lang = "en" | "de";
export const LOCALES: Lang[] = ["en", "de"];
export const DEFAULT_LOCALE: Lang = "de";

export interface Dictionary {
  nav: [string, string, string, string];
  bookNow: string;
  /** Short label for the header button on phones, where space is tight. */
  bookShort: string;
  book: string;
  langU: string;
  heroTitle: string;
  heroBody: string;
  heroCta: string;
  heroPrices: string;
  offerKicker: string;
  offerTitle: string;
  fullList: string;
  from: string;
  studioKicker: string;
  studioTitle: string;
  studioBody: string;
  about: string;
  hoursKicker: string;
  ctaTitle: string;
  ctaBody: string;
  svcKicker: string;
  svcTitle: string;
  svcBody: string;
  shortU: string;
  mediumU: string;
  longU: string;
  lengths: [string, string, string];
  perHour: string;
  vat: string;
  bkKicker: string;
  stepsL: [string, string, string, string];
  q1: string;
  q2: string;
  hairLength: string;
  q3: string;
  pickDay: string;
  noTimes: string;
  morning: string;
  afternoon: string;
  legendSel: string;
  legendToday: string;
  legendClosed: string;
  fName: string;
  fPhone: string;
  fEmail: string;
  fNotes: string;
  phNotes: string;
  thanksTitle: string;
  thanks: (service: string, date: string, time: string) => string;
  another: string;
  backHome: string;
  back: string;
  cont: string;
  send: string;
  yourAppt: string;
  price: string;
  vatPay: string;
  sum: [string, string, string, string];
  aboutKicker: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  pillars: [[string, string], [string, string], [string, string]];
  cKicker: string;
  cTitle: string;
  cRows: [string, string, string];
  address: string;
  msgTitle: string;
  msgThanks: string;
  name: string;
  message: string;
  sendMsg: string;
  forAppts: string;
  onlineBooking: string;
  days: string[];
  daysLong: string[];
  months: string[];
  monthsLong: string[];
  closedL: string;
  open: string;
  loginTitle: string;
  loginBody: string;
  password: string;
  signIn: string;
  loginErr: string;
  adminSub: string;
  viewSite: string;
  logout: string;
  tabs: [string, string, string];
  bookingsTitle: string;
  search: string;
  list: string;
  day: string;
  today: string;
  statsL: [string, string, string, string];
  all: string;
  st: { pending: string; confirmed: string; declined: string };
  thWhen: string;
  thClient: string;
  thService: string;
  thType: string;
  thStatus: string;
  noRows: string;
  closed: string;
  selL: [string, string, string, string, string, string, string];
  notesU: string;
  accept: string;
  decline: string;
  reopen: string;
  selectHint: string;
  bookingN: (n: number) => string;
  setTitle: string;
  setBody: string;
  autoSaved: string;
  hoursTitle: string;
  hoursNote: string;
  slotsTitle: string;
  slotsNote: string;
  slotInt: string;
  lastBefore: string;
  lastOptsL: [string, string, string, string];
  window: string;
  weeksL: (w: number) => string;
  previewL: (d: string) => string;
  styleTitle: string;
  styleNote: string;
  logoNames: [string, string, string];
  current: string;
  resetDefaults: string;
  bookedL: string;
  unavailL: string;
  slOpen: string;
  slBlocked: string;
  legendFull: string;
  freeN: (n: number) => string;
  freeShort: (n: number) => string;
  avTitle: string;
  avBody: string;
  thisWeek: string;
  blockDay: string;
  openDay: string;
  inPeriod: string;
  blockAllWeek: string;
  openAllWeek: string;
  blockAllDay: string;
  openAllDay: string;
  avStatsL: [string, string, string];
  closuresTitle: string;
  closuresNote: string;
  fromL: string;
  toL: string;
  noteL: string;
  notePh: string;
  addClosure: string;
  noClosures: string;
  remove: string;
  closedOn: string;
  pagesU: string;
  visitU: string;
  staff: string;
  galleryTitle: string;
  galleryNote: string;
  gallerySlots: [string, string];
  galleryAdd: string;
  galleryUploading: (n: number) => string;
  galleryCount: (n: number) => string;
  galleryEmpty: string;
  galleryError: (name: string) => string;
  galleryEarlier: string;
  galleryLater: string;
  mapTitle: string;
  mapNote: string;
  mapSearchPh: string;
  mapSearch: string;
  mapNoResults: string;
  mapNotSet: string;
  mapClear: string;
  openMap: string;
  adminMenu: string;
  adminGroups: [string, string, string];
  adminNav: {
    bookings: string;
    calendar: string;
    closures: string;
    photos: string;
    location: string;
    logo: string;
    hours: string;
    rules: string;
  };
  bookingsDesc: string;
  pendingBadge: (n: number) => string;
  filtersL: string;
  statusL: string;
  categoryL: string;
  viewL: string;
  weekActionsL: string;
  calendarL: string;
  closeL: string;
  bookingDetailsL: string;
  resetTitle: string;
  resetNote: string;
}

export const dictionaries: Record<Lang, Dictionary> = {
  en: {
    nav: ["Home", "Services", "About us", "Contact"],
    bookNow: "Book now",
    bookShort: "Book now",
    book: "Book",
    langU: "LANGUAGE",
    heroTitle: "A hair and beauty studio for women, men and children.",
    heroBody:
      "Cuts, colour, styling, make-up and brow care. Choose your service, pick a time and we will confirm your appointment.",
    heroCta: "Book an appointment",
    heroPrices: "View prices",
    offerKicker: "SERVICES",
    offerTitle: "What we offer",
    fullList: "Full price list",
    from: "from CHF",
    studioKicker: "THE STUDIO",
    studioTitle: "Time for you",
    studioBody:
      "Sagan Beauty is a hair and beauty studio. We take time for a proper consultation before every appointment, so that cut, colour and care suit you and your everyday life.",
    about: "About us",
    hoursKicker: "OPENING HOURS",
    ctaTitle: "Book your appointment online",
    ctaBody: "Choose a service and a time. We confirm every request personally.",
    svcKicker: "PRICE LIST",
    svcTitle: "Services & prices",
    svcBody: "All prices in CHF, including 8.1% VAT. Women's hair services are priced by hair length.",
    shortU: "SHORT",
    mediumU: "MEDIUM",
    longU: "LONG",
    lengths: ["Short", "Medium", "Long"],
    perHour: "per hour",
    vat: "Prices incl. 8.1% VAT",
    bkKicker: "BOOKING",
    stepsL: ["Category", "Service", "Date & time", "Your details"],
    q1: "Who is the appointment for?",
    q2: "Choose a service",
    hairLength: "Hair length",
    q3: "Pick a day and time",
    pickDay: "Choose a day in the calendar to see the available times.",
    noTimes: "No times left on this day. Please choose another day.",
    morning: "MORNING",
    afternoon: "AFTERNOON",
    legendSel: "Selected",
    legendToday: "Today",
    legendClosed: "Closed or unavailable",
    fName: "Full name",
    fPhone: "Phone",
    fEmail: "Email",
    fNotes: "Notes (optional)",
    phNotes: "Anything we should know, e.g. current colour or allergies",
    thanksTitle: "Thank you, request received",
    thanks: (s, d, t) =>
      `We have received your request for ${s} on ${d} at ${t}. You will receive a confirmation by email once the salon has accepted it.`,
    another: "Make another booking",
    backHome: "Back to home",
    back: "Back",
    cont: "Continue →",
    send: "Send request",
    yourAppt: "YOUR APPOINTMENT",
    price: "Price",
    vatPay: "Incl. 8.1% VAT. Payment in the salon.",
    sum: ["Category", "Service", "Date", "Time"],
    aboutKicker: "ABOUT US",
    aboutTitle: "Hair, beauty and wellness under one roof",
    aboutP1:
      "Sagan Beauty is a hair and beauty studio for the whole family. From a quick contour cut to colour, balayage or event make-up, every visit starts with a consultation and ends with a result that is easy to wear at home.",
    aboutP2:
      "Replace this paragraph with the salon's own story: when it opened, who works here and what matters to you.",
    pillars: [
      ["Hair", "Cuts and styling for women, men and children, plus colour, highlights, balayage and perms."],
      ["Beauty", "Day, event and stage make-up, brow shaping and tinting for brows and lashes."],
      ["Wellness", "A calm studio and unhurried appointments, with time for consultation at every visit."],
    ],
    cKicker: "CONTACT",
    cTitle: "Visit or get in touch",
    cRows: ["ADDRESS", "PHONE", "EMAIL"],
    address: "Street and number, 0000 Town, Switzerland",
    msgTitle: "Send us a message",
    msgThanks: "Thank you. We will get back to you shortly.",
    name: "Name",
    message: "Message",
    sendMsg: "Send message",
    forAppts: "For appointments, please use",
    onlineBooking: "online booking",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysLong: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    monthsLong: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    closedL: "Closed",
    open: "Open",
    loginTitle: "Staff login",
    loginBody: "Sign in to manage bookings, opening hours and booking times.",
    password: "Password",
    signIn: "Sign in",
    loginErr: "Please enter your email and password.",
    adminSub: "SALON ADMIN",
    viewSite: "View website",
    logout: "Log out",
    tabs: ["Bookings", "Availability", "Settings"],
    bookingsTitle: "Bookings",
    search: "Search client or service",
    list: "List",
    day: "Day",
    today: "Today",
    statsL: ["PENDING", "TODAY", "CONFIRMED · 7 DAYS", "ALL REQUESTS"],
    all: "All",
    st: { pending: "Pending", confirmed: "Confirmed", declined: "Declined" },
    thWhen: "When",
    thClient: "Client",
    thService: "Service",
    thType: "Type",
    thStatus: "Status",
    noRows: "No bookings match these filters.",
    closed: "The salon is closed on this day.",
    selL: ["Date", "Time", "Type", "Service", "Price", "Phone", "Email"],
    notesU: "NOTES",
    accept: "Accept",
    decline: "Decline",
    reopen: "Move back to pending",
    selectHint: "Select a booking to see details and accept or decline it.",
    bookingN: (n) => (n === 1 ? "1 booking" : `${n} bookings`),
    setTitle: "Settings",
    setBody: "Changes apply to the website and online booking straight away.",
    autoSaved: "Saved automatically",
    hoursTitle: "Opening hours",
    hoursNote: "Shown on the home and contact pages",
    slotsTitle: "Booking times",
    slotsNote: "Controls which start times clients can pick online.",
    slotInt: "Start times every",
    lastBefore: "Last appointment starts",
    lastOptsL: ["At close", "−30 min", "−60 min", "−90 min"],
    window: "Bookable in advance",
    weeksL: (w) => `${w} wk`,
    previewL: (d) => `PREVIEW · ${d.toUpperCase()}`,
    styleTitle: "Website style",
    styleNote: "Which logo artwork appears in the home page hero.",
    logoNames: ["Monogram", "Gold on black", "Script"],
    current: "In use",
    resetDefaults: "Reset to defaults",
    bookedL: "Booked",
    unavailL: "Unavailable",
    slOpen: "Open",
    slBlocked: "Blocked",
    legendFull: "Fully booked",
    freeN: (n) => (n === 1 ? "1 time free" : `${n} times free`),
    freeShort: (n) => `${n} free`,
    avTitle: "Availability",
    avBody:
      "Click an open slot to block it and click a blocked slot to open it again. Booked slots show the client; click one to open the booking. Clients only see times that are open.",
    thisWeek: "This week",
    blockDay: "Close day",
    openDay: "Reopen",
    inPeriod: "Closure",
    blockAllWeek: "Block all open this week",
    openAllWeek: "Open all blocked this week",
    blockAllDay: "Block all open",
    openAllDay: "Open all blocked",
    avStatsL: ["OPEN SLOTS", "BOOKED", "BLOCKED"],
    closuresTitle: "Closures & holidays",
    closuresNote: "On these dates the salon shows as closed and no bookings can be made.",
    fromL: "From",
    toL: "To",
    noteL: "Note (optional)",
    notePh: "e.g. Holidays",
    addClosure: "Add closure",
    noClosures: "No closures planned.",
    remove: "Remove",
    closedOn: "Closed",
    pagesU: "PAGES",
    visitU: "VISIT",
    staff: "Staff login",
    galleryTitle: "Photos",
    galleryNote: "Photos shown as slideshows on the website. They play in this order; use the arrows to reorder. Large photos are resized automatically.",
    gallerySlots: ["Studio photo · home page", "Portrait photo · about page"],
    galleryAdd: "Add photos",
    galleryUploading: (n) => `Uploading ${n}…`,
    galleryCount: (n) => (n === 1 ? "1 photo" : `${n} photos`),
    galleryEmpty: "No photos yet. A placeholder is shown on the website.",
    galleryError: (name) => `Could not upload ${name}. Please try a JPG, PNG or WebP image.`,
    galleryEarlier: "Move earlier",
    galleryLater: "Move later",
    mapTitle: "Storefront location",
    mapNote: "Shown on the contact page map. Search for the address, or click the map to place the pin, then drag it to fine-tune. The zoom level is saved too.",
    mapSearchPh: "Search address, e.g. Bahnhofstrasse 1, Zürich",
    mapSearch: "Search",
    mapNoResults: "No matching places found.",
    mapNotSet: "No location set. The contact page shows a placeholder.",
    mapClear: "Remove pin",
    openMap: "Open in map",
    adminMenu: "Menu",
    adminGroups: ["Bookings", "Website", "Salon"],
    adminNav: {
      bookings: "Bookings",
      calendar: "Calendar",
      closures: "Holidays & closures",
      photos: "Photos",
      location: "Map location",
      logo: "Home page logo",
      hours: "Opening hours",
      rules: "Booking rules",
    },
    bookingsDesc: "All booking requests. Select one to see the details and accept or decline it.",
    pendingBadge: (n) => (n === 1 ? "1 booking waiting for a reply" : `${n} bookings waiting for a reply`),
    filtersL: "Filters",
    statusL: "Status",
    categoryL: "Category",
    viewL: "View",
    weekActionsL: "Quick actions",
    calendarL: "Calendar",
    closeL: "Close",
    bookingDetailsL: "Booking details",
    resetTitle: "Reset to defaults",
    resetNote: "Restores the default opening hours, booking rules and home page logo. Bookings, photos and the map location are not affected.",
  },
  de: {
    nav: ["Home", "Leistungen", "Über uns", "Kontakt"],
    bookNow: "Termin buchen",
    bookShort: "Buchen",
    book: "Buchen",
    langU: "SPRACHE",
    heroTitle: "Ein Coiffeur- und Beautystudio für Damen, Herren und Kinder.",
    heroBody:
      "Schnitt, Farbe, Styling, Make-up und Brauenpflege. Wählen Sie Ihre Leistung und Ihre Wunschzeit, wir bestätigen Ihren Termin.",
    heroCta: "Termin buchen",
    heroPrices: "Preise ansehen",
    offerKicker: "LEISTUNGEN",
    offerTitle: "Unser Angebot",
    fullList: "Ganze Preisliste",
    from: "ab CHF",
    studioKicker: "DAS STUDIO",
    studioTitle: "Zeit für Sie",
    studioBody:
      "Sagan Beauty ist ein Coiffeur- und Beautystudio. Vor jedem Termin nehmen wir uns Zeit für eine Beratung, damit Schnitt, Farbe und Pflege zu Ihnen und Ihrem Alltag passen.",
    about: "Über uns",
    hoursKicker: "ÖFFNUNGSZEITEN",
    ctaTitle: "Termin online buchen",
    ctaBody: "Wählen Sie Leistung und Uhrzeit. Wir bestätigen jede Anfrage persönlich.",
    svcKicker: "PREISLISTE",
    svcTitle: "Leistungen & Preise",
    svcBody: "Alle Preise in CHF, inkl. 8.1% MWST. Damen-Leistungen nach Haarlänge.",
    shortU: "KURZ",
    mediumU: "MITTEL",
    longU: "LANG",
    lengths: ["Kurz", "Mittel", "Lang"],
    perHour: "pro Stunde",
    vat: "inkl. MWST 8.1%",
    bkKicker: "TERMIN",
    stepsL: ["Kategorie", "Leistung", "Datum & Zeit", "Ihre Angaben"],
    q1: "Für wen ist der Termin?",
    q2: "Leistung wählen",
    hairLength: "Haarlänge",
    q3: "Tag und Uhrzeit wählen",
    pickDay: "Wählen Sie im Kalender einen Tag, um die freien Zeiten zu sehen.",
    noTimes: "An diesem Tag sind keine Zeiten mehr frei. Bitte wählen Sie einen anderen Tag.",
    morning: "VORMITTAG",
    afternoon: "NACHMITTAG",
    legendSel: "Gewählt",
    legendToday: "Heute",
    legendClosed: "Geschlossen oder belegt",
    fName: "Vor- und Nachname",
    fPhone: "Telefon",
    fEmail: "E-Mail",
    fNotes: "Bemerkungen (optional)",
    phNotes: "z. B. aktuelle Haarfarbe oder Allergien",
    thanksTitle: "Vielen Dank, Anfrage erhalten",
    thanks: (s, d, t) =>
      `Wir haben Ihre Anfrage für ${s} am ${d} um ${t} erhalten. Sie erhalten eine Bestätigung per E-Mail, sobald der Salon den Termin angenommen hat.`,
    another: "Weiteren Termin buchen",
    backHome: "Zur Startseite",
    back: "Zurück",
    cont: "Weiter →",
    send: "Anfrage senden",
    yourAppt: "IHR TERMIN",
    price: "Preis",
    vatPay: "inkl. 8.1% MWST. Bezahlung im Salon.",
    sum: ["Kategorie", "Leistung", "Datum", "Uhrzeit"],
    aboutKicker: "ÜBER UNS",
    aboutTitle: "Haare, Beauty und Wellness unter einem Dach",
    aboutP1:
      "Sagan Beauty ist ein Coiffeur- und Beautystudio für die ganze Familie. Vom schnellen Konturenschnitt bis zu Farbe, Balayage oder Event-Make-up beginnt jeder Besuch mit einer Beratung und endet mit einem Resultat, das sich auch zu Hause leicht tragen lässt.",
    aboutP2:
      "Ersetzen Sie diesen Absatz durch die Geschichte des Salons: seit wann es ihn gibt, wer hier arbeitet und was Ihnen wichtig ist.",
    pillars: [
      ["Hair", "Schnitt und Styling für Damen, Herren und Kinder, dazu Farbe, Meches, Balayage und Dauerwelle."],
      ["Beauty", "Tages-, Event- und Bühnen-Make-up, Augenbrauen zupfen, Brauen und Wimpern färben."],
      ["Wellness", "Ein ruhiges Studio und Termine ohne Eile, mit Zeit für Beratung bei jedem Besuch."],
    ],
    cKicker: "KONTAKT",
    cTitle: "Besuchen Sie uns",
    cRows: ["ADRESSE", "TELEFON", "E-MAIL"],
    address: "Strasse und Nr., 0000 Ort, Schweiz",
    msgTitle: "Nachricht senden",
    msgThanks: "Vielen Dank. Wir melden uns in Kürze.",
    name: "Name",
    message: "Nachricht",
    sendMsg: "Nachricht senden",
    forAppts: "Für Termine nutzen Sie bitte die",
    onlineBooking: "Online-Buchung",
    days: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    daysLong: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    months: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    monthsLong: [
      "Januar", "Februar", "März", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Dezember",
    ],
    closedL: "Geschlossen",
    open: "Geöffnet",
    loginTitle: "Login für Mitarbeitende",
    loginBody: "Melden Sie sich an, um Buchungen, Öffnungszeiten und Buchungszeiten zu verwalten.",
    password: "Passwort",
    signIn: "Anmelden",
    loginErr: "Bitte E-Mail und Passwort eingeben.",
    adminSub: "SALON-VERWALTUNG",
    viewSite: "Zur Website",
    logout: "Abmelden",
    tabs: ["Buchungen", "Verfügbarkeit", "Einstellungen"],
    bookingsTitle: "Buchungen",
    search: "Kunde oder Leistung suchen",
    list: "Liste",
    day: "Tag",
    today: "Heute",
    statsL: ["OFFEN", "HEUTE", "BESTÄTIGT · 7 TAGE", "ALLE ANFRAGEN"],
    all: "Alle",
    st: { pending: "Offen", confirmed: "Bestätigt", declined: "Abgelehnt" },
    thWhen: "Termin",
    thClient: "Kunde",
    thService: "Leistung",
    thType: "Kategorie",
    thStatus: "Status",
    noRows: "Keine Buchungen für diese Filter.",
    closed: "Der Salon ist an diesem Tag geschlossen.",
    selL: ["Datum", "Uhrzeit", "Kategorie", "Leistung", "Preis", "Telefon", "E-Mail"],
    notesU: "BEMERKUNGEN",
    accept: "Annehmen",
    decline: "Ablehnen",
    reopen: "Wieder auf offen setzen",
    selectHint: "Wählen Sie eine Buchung, um Details zu sehen und sie anzunehmen oder abzulehnen.",
    bookingN: (n) => (n === 1 ? "1 Buchung" : `${n} Buchungen`),
    setTitle: "Einstellungen",
    setBody: "Änderungen gelten sofort für Website und Online-Buchung.",
    autoSaved: "Automatisch gespeichert",
    hoursTitle: "Öffnungszeiten",
    hoursNote: "Angezeigt auf Startseite und Kontaktseite",
    slotsTitle: "Buchungszeiten",
    slotsNote: "Legt fest, welche Startzeiten online gewählt werden können.",
    slotInt: "Startzeiten alle",
    lastBefore: "Letzter Termin beginnt",
    lastOptsL: ["Bei Schluss", "−30 Min", "−60 Min", "−90 Min"],
    window: "Im Voraus buchbar",
    weeksL: (w) => `${w} Wo`,
    previewL: (d) => `VORSCHAU · ${d.toUpperCase()}`,
    styleTitle: "Website-Stil",
    styleNote: "Welches Logo im Startbereich der Website erscheint.",
    logoNames: ["Monogramm", "Gold auf Schwarz", "Schriftzug"],
    current: "Aktiv",
    resetDefaults: "Standard wiederherstellen",
    bookedL: "Gebucht",
    unavailL: "Nicht verfügbar",
    slOpen: "Frei",
    slBlocked: "Gesperrt",
    legendFull: "Ausgebucht",
    freeN: (n) => (n === 1 ? "1 Zeit frei" : `${n} Zeiten frei`),
    freeShort: (n) => `${n} frei`,
    avTitle: "Verfügbarkeit",
    avBody:
      "Klicken Sie auf eine freie Zeit, um sie zu sperren, und auf eine gesperrte, um sie wieder freizugeben. Gebuchte Zeiten zeigen den Kunden; ein Klick öffnet die Buchung. Kunden sehen nur freie Zeiten.",
    thisWeek: "Diese Woche",
    blockDay: "Tag schliessen",
    openDay: "Wieder öffnen",
    inPeriod: "Schliesszeit",
    blockAllWeek: "Alle freien dieser Woche sperren",
    openAllWeek: "Alle gesperrten dieser Woche freigeben",
    blockAllDay: "Alle freien sperren",
    openAllDay: "Alle gesperrten freigeben",
    avStatsL: ["FREIE ZEITEN", "GEBUCHT", "GESPERRT"],
    closuresTitle: "Ferien & Schliesstage",
    closuresNote: "An diesen Tagen wird der Salon als geschlossen angezeigt und es sind keine Buchungen möglich.",
    fromL: "Von",
    toL: "Bis",
    noteL: "Notiz (optional)",
    notePh: "z. B. Ferien",
    addClosure: "Hinzufügen",
    noClosures: "Keine Schliesstage geplant.",
    remove: "Entfernen",
    closedOn: "Geschlossen",
    pagesU: "SEITEN",
    visitU: "BESUCH",
    staff: "Login für Mitarbeitende",
    galleryTitle: "Fotos",
    galleryNote: "Fotos, die auf der Website als Diashow erscheinen. Sie laufen in dieser Reihenfolge; mit den Pfeilen umsortieren. Grosse Fotos werden automatisch verkleinert.",
    gallerySlots: ["Studiofoto · Startseite", "Porträtfoto · Über uns"],
    galleryAdd: "Fotos hinzufügen",
    galleryUploading: (n) => `${n} wird hochgeladen…`,
    galleryCount: (n) => (n === 1 ? "1 Foto" : `${n} Fotos`),
    galleryEmpty: "Noch keine Fotos. Auf der Website erscheint ein Platzhalter.",
    galleryError: (name) => `${name} konnte nicht hochgeladen werden. Bitte ein JPG-, PNG- oder WebP-Bild verwenden.`,
    galleryEarlier: "Nach vorne",
    galleryLater: "Nach hinten",
    mapTitle: "Standort des Salons",
    mapNote: "Erscheint auf der Karte der Kontaktseite. Adresse suchen oder in die Karte klicken, um die Nadel zu setzen, dann zum Feinjustieren ziehen. Die Zoomstufe wird ebenfalls gespeichert.",
    mapSearchPh: "Adresse suchen, z. B. Bahnhofstrasse 1, Zürich",
    mapSearch: "Suchen",
    mapNoResults: "Keine passenden Orte gefunden.",
    mapNotSet: "Kein Standort gesetzt. Die Kontaktseite zeigt einen Platzhalter.",
    mapClear: "Nadel entfernen",
    openMap: "In Karte öffnen",
    adminMenu: "Menü",
    adminGroups: ["Buchungen", "Website", "Salon"],
    adminNav: {
      bookings: "Buchungen",
      calendar: "Kalender",
      closures: "Ferien & Schliesstage",
      photos: "Fotos",
      location: "Kartenstandort",
      logo: "Logo Startseite",
      hours: "Öffnungszeiten",
      rules: "Buchungsregeln",
    },
    bookingsDesc: "Alle Buchungsanfragen. Wählen Sie eine aus, um Details zu sehen und sie anzunehmen oder abzulehnen.",
    pendingBadge: (n) => (n === 1 ? "1 Buchung wartet auf Antwort" : `${n} Buchungen warten auf Antwort`),
    filtersL: "Filter",
    statusL: "Status",
    categoryL: "Kategorie",
    viewL: "Ansicht",
    weekActionsL: "Schnellaktionen",
    calendarL: "Kalender",
    closeL: "Schliessen",
    bookingDetailsL: "Buchungsdetails",
    resetTitle: "Standard wiederherstellen",
    resetNote: "Stellt die Standard-Öffnungszeiten, Buchungsregeln und das Logo der Startseite wieder her. Buchungen, Fotos und Kartenstandort bleiben unverändert.",
  },
};

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

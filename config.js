/* ============================================================
   WEDDING INVITATION — EDIT ONLY THIS FILE
   Replace the placeholder text and image paths below with your
   own details. Nothing else in the project needs to change.
   ============================================================ */
const WEDDING_CONFIG = {
  // Couple
  brideName: "Vidyshree",
  groomName: "Saiprasad",
  familyName: "Shet Family and Revankar Family ",

  // Wedding date/time. Use ISO format with timezone.
  // Example: 2026-11-25T10:30:00+05:30
  weddingDate: "2026-11-25T10:30:00+05:30",
  weddingDateLabel: "November 25, 2026",

  // Replace these with your own PNG/JPG files (no SVG required).
  // Drop your files into the assets/ folder and point to them here.
  assets: {
    door: "assets/door-placeholder.png",             // full-screen closed-door artwork
    couplePhoto: "assets/couple.jpg",     // hero photograph
    invitation: "assets/invitation-placeholder.svg",  // shareable invitation card
    ogImage: "assets/invitation-placeholder.svg"      // used for link previews
  },

  // Optional text
  invitationLine: "Together with their families, they invite you to celebrate their wedding.",
  countdownHeading: "To the beginning of forever.",
  closingLine: "A warm invite from",

  // WhatsApp caption. The invitation image is shared as media on supported phones.
  // {bride}, {groom}, {date} and {venue} are replaced automatically.
  whatsappCaption: "You are warmly invited to celebrate the wedding of {bride} & {groom}. 💛\n\n{date}\n{venue}\n\nWe would love to celebrate this special day with you!",

  // Optional: a specific WhatsApp number to send to, in international
  // format with no + or spaces (e.g. "919876543210"). Leave empty to let
  // the guest choose who to send it to from their contacts.
  whatsappPhone: "",

  // Events: add/remove/edit as needed.
  // maps can be a Google Maps URL, a place URL, or a search URL.
  events: [
    {
      name: "Mehendi",
      date: "24 Nov 2026",
      time: "4:00 PM onwards",
      venue: "The Garden Courtyard, Bengaluru",
      description: "An evening of henna, music and colour.",
      maps: "https://maps.google.com/?q=Garden+Courtyard+Bengaluru"
    }
  ]
};

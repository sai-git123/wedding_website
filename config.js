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
    invitationEn: "assets/English.png",  // English invitation card
    invitationKn: "assets/kannada.png",  // Kannada invitation card
    ogImage: "assets/kannada.png"      // used for link previews
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
      date: "23 Nov 2026",
      time: "10:00 AM onwards",
      venue: "Shri Ganesha Nilaya, Baggon, Kumta",
      description: "A day of henna, music and colour.",
      maps: "https://maps.app.goo.gl/oaPr6WyuejV1NDnFA"
    },
    {
      name: "Haldi",
      date: "24 Nov 2026",
      time: "09:00 AM onwards",
      venue: "Shri Ganesha Nilaya, Baggon, Kumta",
      description: "A morning of Turmeric.",
      maps: "https://maps.app.goo.gl/oaPr6WyuejV1NDnFA"
    },
    {
      name: "Sangeet and Engagement",
      date: "24 Nov 2026",
      time: "07:00 PM onwards",
      venue: "Halakki Vokkaligara Samudaya Bhavana, Divgi, Kumta",
      description: "A evening of music, dance and fun.",
      maps: "https://maps.app.goo.gl/8qUNm63owE6WcYCo8"
    },
    {
      name: "Wedding",
      date: "25 Nov 2026",
      time: "10:30 AM muhurtham",
      venue: "Halakki Vokkaligara Samudaya Bhavana, Divgi, Kumta",
      description: "The Wedding.",
      maps: "https://maps.app.goo.gl/oaPr6WyuejV1NDnFA"
    }
  ]
};

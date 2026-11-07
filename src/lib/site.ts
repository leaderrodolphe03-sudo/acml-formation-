// Informations de l'entreprise affichées sur le site vitrine.
// ⚠️ À compléter avec les vraies coordonnées d'ACML avant la mise en ligne.
export const SITE = {
  name: 'ACML',
  fullName: "L'Anglais Comme Ma Langue",
  tagline: 'Avec aisance, avec passion !',
  phone: '+229 01 00 00 00 00',
  whatsapp: '+229 01 00 00 00 00',
  email: 'contact@acml.bj',
  address: 'Cotonou, Bénin',
  hours: 'Lun – Sam : 8h – 19h',
}

// Photos d'illustration (Unsplash, libres de droits) – à remplacer par vos propres photos.
const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`
export const PHOTOS = {
  hero: u('photo-1571260899304-425eee4c7efc', 1100),
  classroom: u('photo-1509062522246-3755977927d7', 1000),
  group: u('photo-1522202176988-66273c2fd55f', 1000),
  online: u('photo-1546410531-bb4caa6b424d', 1000),
}

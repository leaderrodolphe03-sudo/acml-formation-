# ACML – L'Anglais Comme Ma Langue

Site vitrine + plateforme d'apprentissage (espaces **étudiant** et **superviseur**), construite d'après le
*Document de conception de la plateforme ACML*.

## Lancer le projet

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # version de production dans dist/
```

## Comptes de démonstration

| Rôle        | E-mail                | Mot de passe |
|-------------|-----------------------|--------------|
| Étudiant    | etudiant@acml.bj      | demo-acml    |
| Superviseur | superviseur@acml.bj   | demo-acml    |

Des boutons de connexion rapide sont aussi proposés sur `/connexion`.
Codes de classe pour tester l'inscription d'un étudiant (`/rejoindre`) : `SAMEDI-24`, `OCTO-25`.

> Phase de maquette : les données sont stockées dans le navigateur (localStorage).
> « Mes classes → Réinitialiser la démo » restaure le jeu de données d'exemple.

## Ce qui est en place

**Site vitrine** (`/`) : accueil, chiffres clés, 3 parcours (Débutant / Intermédiaire / Avancé), « Pourquoi ACML »,
méthode, présentation des espaces, témoignages, formulaire de cours d'essai, pied de page.

**Authentification** : connexion par e-mail ou téléphone, mot de passe oublié, inscription par code / lien de classe,
redirection selon le rôle.

**Espace étudiant** (`/etudiant`) : tableau de bord (prochaine vidéo, retards, progression, série de jours, badges),
leçons par module, lecteur (reprise automatique, vitesse, sous-titres EN/FR, temps de visionnage réel, validation à 90 %),
ressources, quiz, calendrier mensuel, messagerie avec le superviseur.

**Espace superviseur** (`/superviseur`) : tableau de bord de classe (actifs, taux de complétion, vidéos les plus / moins vues,
étudiants à relancer), liste triable des étudiants + fiche détaillée, invitation par code / lien, transfert / retrait,
programmation du parcours en un clic (jours, rythme, date de début), déplacement manuel, pause vacances, règles
(revoir après la date, exiger la vidéo précédente), historique des modifications, journal d'activité filtrable,
annonces / messages / rappels aux retardataires, création de classes, export CSV du bilan.

## À faire avant la mise en ligne

- Remplacer les coordonnées dans `src/lib/site.ts` (téléphone, e-mail, adresse…).
- Remplacer les **témoignages d'exemple** (`src/pages/Home.tsx`) par de vrais avis, et les photos Unsplash par vos photos.
- Brancher **Supabase** (comptes, rôles, mots de passe chiffrés, progression, journal) à la place de `src/lib/store.tsx`.
- Brancher l'hébergeur vidéo (Bunny Stream, Vimeo, Mux…) à la place du lecteur de démonstration (`src/pages/etudiant/Lesson.tsx`).
- Espace administrateur, notifications e-mail / WhatsApp, PWA (phases 2 et 3 du document).

## Structure

```
src/
  lib/        catalog (niveaux, modules, leçons) · schedule (programmation, statuts) · insights (statistiques, alertes)
              store (état + actions) · seed (données de démo) · site (coordonnées, photos)
  components/ Navbar, Footer, Logo, Shell (mise en page des espaces), Thread (messagerie), ui
  pages/      Home, Login, Register, etudiant/*, superviseur/*
```

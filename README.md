# Karizma × GITEX Africa 2026 — Calendrier collaboratif

Calendrier de contenu avec sync temps réel via Supabase. Toute modification est instantanément visible par tous les collaborateurs.

---

## 🚀 Setup en 4 étapes

### Étape 1 — Créer le projet Supabase (gratuit)

1. Aller sur [supabase.com](https://supabase.com) → **Start your project**
2. Créer un compte et un nouveau projet (choisir une région proche : `eu-west-1` par exemple)
3. Attendre ~2 minutes que le projet s'initialise

### Étape 2 — Créer la table `pills`

Dans Supabase, aller dans **SQL Editor** et coller ce SQL puis cliquer **Run** :

```sql
-- Créer la table
create table pills (
  id text primary key,
  block_key text not null,
  cell_day text not null,
  type text not null default 'texte',
  platform text not null default 'li',
  time text default '',
  title text not null,
  desc text default '',
  created_at timestamptz default now()
);

-- Activer la sécurité Row Level Security
alter table pills enable row level security;

-- Permettre la lecture publique
create policy "Public read" on pills
  for select using (true);

-- Permettre l'écriture publique (ajuster selon vos besoins)
create policy "Public insert" on pills
  for insert with check (true);

create policy "Public update" on pills
  for update using (true);

create policy "Public delete" on pills
  for delete using (true);

-- Activer la réplication temps réel
alter publication supabase_realtime add table pills;
```

### Étape 3 — Récupérer vos clés API

Dans Supabase : **Settings** → **API**

Copier :
- **Project URL** → `https://xxxx.supabase.co`
- **anon public key** → longue chaîne de caractères

### Étape 4 — Configurer les variables d'environnement

**En local :**
```bash
cp .env.example .env
```
Éditer `.env` :
```
VITE_SUPABASE_URL=https://votre-projet-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-ici
```

**Sur Netlify :**
Dans votre site Netlify → **Site configuration** → **Environment variables** → **Add variable** :
- `VITE_SUPABASE_URL` = votre URL
- `VITE_SUPABASE_ANON_KEY` = votre clé anon

---

## 💻 Lancer en local

```bash
npm install
npm run dev
```
→ Ouvrir [http://localhost:5173](http://localhost:5173)

## 🏗 Build pour production

```bash
npm run build
```
Le dossier `dist/` est prêt à être déployé.

---

## 🌐 Déployer sur Netlify (Option A — GitHub)

1. Push ce dossier sur GitHub
2. Aller sur [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Sélectionner votre repo
4. Paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
5. Ajouter les variables d'environnement Supabase (voir Étape 4)
6. Cliquer **Deploy site**

Chaque `git push` redéploie automatiquement ✅

## 🌐 Déployer sur Netlify (Option B — Drag & Drop)

```bash
npm run build
```
Aller sur [app.netlify.com/drop](https://app.netlify.com/drop) et glisser le dossier `dist/`.

⚠️ Avec cette option, les variables d'environnement ne sont pas injectées. Utiliser l'Option A pour la production.

---

## ✨ Fonctionnalités

- 📅 Calendrier Mars–Avril 2026 (Pré-GITEX, Sur site, Post-event)
- ➕ Cliquer sur n'importe quelle case pour ajouter un post
- ✋ Drag & drop pour déplacer un post vers une autre date
- 🌐 Sync temps réel Supabase — modifications visibles par tous instantanément
- 👥 Compteur d'utilisateurs en ligne (Supabase Presence)
- 📱 LinkedIn, Meta, X/Twitter, YouTube
- 🎨 6 types de contenu (Carrousel, Vidéo, Post texte, Live, Article, Récap)
- 🔍 Filtres par phase et par type de contenu

# Quittances Web

Frontend SvelteKit de gestion des quittances.

## Prerequis

- Node.js 20+
- API backend disponible sur `http://localhost:8080`

## Installation

```bash
npm install
```

## Lancement local

```bash
npm run dev
```

Le frontend est generalement disponible sur `http://localhost:5173`.

## Variables utiles

- `API_BASE_URL` (ou `PRIVATE_API_BASE_URL`) pour pointer vers l'API.
- Valeur par defaut si non definie : `http://localhost:8080`.

## Authentification

- Connexion proprio : endpoint backend `/api/proprios/login`.
- Connexion admin : si l'email respecte `^[a-zA-Z0-9]+@root.com$`, le frontend appelle `/api/admins/login`.
- Le token est stocke en cookie `auth_token` (httpOnly).
- Le flag admin est maintenu cote frontend dans un store (`src/lib/stores/auth.js`).

## Navigation admin

Quand un admin est connecte :

- Le dashboard proprio est masque.
- La route `/dashboard` redirige vers `/dashboard/admin/proprios`.
- Le header affiche des actions admin (centre) :
	- Tous les proprios
	- Perf & stats
	- Journal d'audit

Pages admin actuelles :

- `/dashboard/admin/proprios`
- `/dashboard/admin/performance`
- `/dashboard/admin/audit`

## Verification

```bash
npm run check
npm run lint
```

## Build

```bash
npm run build
npm run preview
```

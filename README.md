# Blacklist Bot

Un bot Discord permettant de **blacklister globalement** des utilisateurs à travers tous les serveurs sur lesquels le bot est présent. Un utilisateur blacklist est automatiquement banni de chaque serveur, et toute tentative de rejoindre un serveur ou d'y envoyer un message entraîne un bannissement immédiat.

Basé sur **discord.js v14**, avec support des commandes préfixées (`!`) et des slash commands (`/`).

## ✨ Fonctionnalités

- 🔨 **Blacklist globale** — bannit un utilisateur de tous les serveurs où le bot est présent
- 🔁 **Revive** — débannit un utilisateur blacklist de tous les serveurs et le retire de la blacklist
- 🛡️ **Protection automatique** — un utilisateur blacklist est re-banni instantanément s'il rejoint un serveur (`guildMemberAdd`) ou envoie un message (`messageCreate`)
- 📋 **Liste paginée** des utilisateurs blacklist (boutons ◀ / ▶)
- ℹ️ **Fiche d'information** détaillée sur un utilisateur blacklist (avatar, bannière, date, raison, auteur)
- 🧹 **Unban all** — débannit tous les utilisateurs bannis d'un serveur
- 🧹 **Unblacklist all** — vide entièrement la base de données de blacklist
- 🔒 Système de permissions : commandes réservées au(x) propriétaire(s) du bot, au propriétaire du serveur, ou selon les permissions Discord
- ⚡ Double support : commandes textuelles (préfixe configurable) **et** slash commands

## 📦 Commandes

| Commande | Alias | Utilisation | Description | Accès |
|---|---|---|---|---|
| `blacklist` | `bl` | `[user] [raison]` | Blacklist un utilisateur (le bannit de tous les serveurs) ou affiche la liste si aucun argument | Bot Owner |
| `blinfo` | `blacklistinfo` | `<user>` | Affiche les informations d'un utilisateur blacklist | Bot Owner |
| `revive` | `revive` | `<user>` | Unblacklist un utilisateur et le débannit de tous les serveurs | Bot Owner |
| `unblacklist` | `unbl` | `<user>` | Retire un utilisateur de la blacklist (sans le débannir) | Bot Owner |
| `unblacklistall` | `unblall` | — | Vide toute la blacklist | Bot Owner |
| `unbanall` | `unbanall` | — | Débannit tous les utilisateurs bannis du serveur courant | Bot Owner |
| `help` | — | — | Affiche la liste des commandes disponibles | Tout le monde |
| `ping` | — | — | Affiche la latence du bot | Tout le monde |

## 🗂️ Structure du projet

```
├── commands/
│   ├── blacklist.js
│   ├── blinfo.js
│   ├── help.js
│   ├── ping.js
│   ├── revive.js
│   ├── unbanall.js
│   ├── unblacklist.js
│   └── unblacklistall.js
└── events/
    ├── guildMemberAdd.js     # Auto-ban à l'arrivée d'un membre blacklist
    ├── interactionCreate.js  # Gestion des slash commands + vérification des permissions
    ├── messageCreate.js      # Gestion des commandes préfixées + auto-ban sur message
    └── ready.js               # Enregistrement des slash commands au démarrage
```

## ⚙️ Configuration (`client.config`)

Le bot attend un objet de configuration sur le client avec au minimum :

```js
{
  prefix: "!",              // Préfixe des commandes textuelles
  owners: ["ID1", "ID2"],   // Liste des IDs des propriétaires du bot
  slashs: true              // true pour enregistrer les slash commands, false pour les désactiver
}
```

## 💾 Base de données

Le bot utilise une base de données simple exposée via `client.db`, un objet clé/valeur où :

- la **clé** est l'ID Discord de l'utilisateur blacklist
- la **valeur** contient :
  ```js
  {
    reason: "Raison du blacklist",
    date: 1234567890,      // Timestamp de la blacklist
    authorId: "ID"          // ID de la personne ayant blacklist l'utilisateur
  }
  ```

Une méthode `client.saveDB()` doit être implémentée pour persister les changements (fichier JSON, base de données, etc.).

## 🚀 Installation

```bash
git clone https://github.com/yuniko-dsc/Blacklist-Bot.git
cd Blacklist-Bot
npm install
```

Configurez votre token et vos owners, puis lancez le bot :

```bash
node index.js
```

> ⚠️ Ce README a été généré à partir de l'analyse du code fourni (`commands/` et `events/`). Adaptez les sections **Installation** et **Configuration** selon la structure réelle de votre point d'entrée (`index.js`, `.env`, etc.).

## 🔐 Système de permissions

- `botOwnerOnly: true` — commande réservée aux IDs listés dans `client.config.owners`
- `guildOwnerOnly: true` — commande réservée au propriétaire du serveur (ou aux bot owners)
- `permissions: [...]` — permissions Discord requises (ex: `ViewChannel`)

Ces vérifications sont effectuées à la fois dans `messageCreate.js` (commandes textuelles) et `interactionCreate.js` (slash commands).

## 📄 Licence

À définir par le propriétaire du dépôt.
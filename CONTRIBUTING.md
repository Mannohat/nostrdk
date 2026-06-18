# Bidrage til Nostr.dk / Contributing to Nostr.dk

Tak for din interesse i at bidrage til Nostr.dk! 🙏

## 📋 Indholdsfortegnelse / Table of Contents

- [Tilføj en Ressource](#tilføj-en-ressource--add-a-resource)
- [Filstruktur](#filstruktur--file-structure)
- [Skabelon](#skabelon--template)
- [Kategorier](#kategorier--categories)
- [Pull Request Proces](#pull-request-proces)

---

## 🎯 Tilføj en Ressource / Add a Resource

Der er **to måder** at foreslå en ny ressource:

### Metode 1: Issue (Anbefalede for Forslag)

1. Gå til [Issues](../../issues)
2. Klik **"New Issue"**
3. Vælg **"Foreslå Ny Ressource"**
4. Udfyld formularen
5. Klik **"Submit"**

**Fordele:** Nemt, ingen teknisk viden krævet

### Metode 2: Pull Request (Direkte Implementering)

1. **Fork** dette repository
2. **Klon** din fork lokalt:
```bash
   git clone https://github.com/dit-brugernavn/nostr.dk.git
   cd nostr.dk
```
3. **Opret en branch:**
```bash
   git checkout -b add-my-app
```
4. **Tilføj din ressource fil** i `src/content/resources/`
5. **Commit og push:**
```bash
   git add src/content/resources/my-app.md
   git commit -m "Add My App to resources"
   git push origin add-my-app
```
6. **Opret Pull Request** på GitHub

**Fordele:** Hurtigere, direkte implementering

---

## 📁 Filstruktur / File Structure
```
nostr.dk/
├── src/
│   ├── content/
│   │   ├── resources/           ← Tilføj din .md fil her / Add your .md file here
│   │   │   ├── primal.md
│   │   │   ├── damus.md
│   │   │   └── your-app.md     ← Ny fil / New file
│   │   └── config.ts
│   └── pages/
│       └── apps.astro
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md
    └── ISSUE_TEMPLATE/
```

---

## 📝 Skabelon / Template

### Navngivning / Naming
Filnavn skal være:
- **Lowercase** (små bogstaver)
- **Bindestreger** i stedet for mellemrum
- **`.md` extension**

✅ Korrekt: `my-cool-app.md`  
❌ Forkert: `My Cool App.md`

### Indhold / Content

Brug denne skabelon i din nye `.md` fil:
```markdown
---
title: "App Navn"
description: "Kort beskrivelse på dansk om hvad appen gør."
url: "https://example.com/"
category: "nostr-alternatives"
section: "Type/Kategori"
order: 10
published: true
---
```

### Felter / Fields

| Felt | Påkrævet | Beskrivelse |
|------|----------|-------------|
| `title` | ✅ Ja | Navn på app/tjeneste |
| `description` | ✅ Ja | 1-2 sætninger på dansk (afslut med punktum) |
| `descriptionEn` | ❌ Nej | Engelsk beskrivelse til `/en`-siden (falder tilbage til `description` hvis udeladt) |
| `url` | ✅ Ja | Link til ressourcen |
| `category` | ✅ Ja | Se kategorier nedenfor |
| `section` | ❌ Nej | Valgfri tag (f.eks. "Wallet", "Meetup Alternative") |
| `order` | ✅ Ja | Position i kategorien (1 = først) |
| `published` | ✅ Ja | `true` for synlig, `false` for skjult |

---

## 🗂️ Kategorier / Categories

Vælg **én** kategori:

### 1. `nostr-alternatives`
**🔄 Nostr Alternativer til Centraliserede Tjenester**
- Decentraliserede alternativer til Twitter, YouTube, Instagram, osv.
- Eksempler: Primal, Damus, Coracle

### 2. `services`
**⚡ Nostr Services**
- Specialiserede tjenester bygget på Nostr
- Eksempler: Nostr.build (media), Zap.stream (streaming)

### 3. `extensions`
**🔌 Browser Udvidelser**
- Nøglestyring og signering i browseren
- Eksempler: Alby, nos2x, Flamingo

### 4. `tools`
**🛠️ Nostr Værktøjer**
- Hjælpeværktøjer til navigation i Nostr
- Eksempler: Nostr.watch, nosta.me

### 5. `relays`
**🌐 Nostr Relays**
- Find og administrer Nostr relays
- Eksempler: Relay-lister, relay management tools

---

## 🔄 Pull Request Proces

### Før du Indsender

Tjek at:
- [ ] Filnavnet følger konventionen (lowercase-with-hyphens.md)
- [ ] Alle påkrævede felter er udfyldt
- [ ] Beskrivelsen er på **dansk**
- [ ] URL'en virker
- [ ] Kategorien er korrekt valgt
- [ ] `order` værdi er sat (højere tal = senere i listen)

### Indsend Pull Request

1. Gå til din fork på GitHub
2. Klik **"Pull requests"** → **"New pull request"**
3. Udfyld PR template
4. Klik **"Create pull request"**

### Hvad Sker Der Nu?

1. **Maintainer reviewer** din PR
2. Eventuelle **ændringer anmodes**
3. Efter godkendelse: **Merge!** 🎉
4. Din ressource vises på Nostr.dk

---

## 💡 Tips

- **Test URL'en** før du indsender
- **Hold beskrivelsen kort** (1-2 sætninger)
- **Vælg en passende `order`** værdi:
  - Populære apps: 1-5
  - Moderate apps: 6-15
  - Niche apps: 16+
- **Brug `section` tag** til at kategorisere yderligere

---

## 🤔 Spørgsmål?

- Åbn et [Issue](../../issues)
- Kommenter på din PR
- Kontakt maintainer

---

## 📜 Licensering

Ved at bidrage accepterer du at dit bidrag vil være licenseret under samme licens som dette projekt.

---

Tak for at hjælpe med at gøre Nostr.dk bedre! 🙌

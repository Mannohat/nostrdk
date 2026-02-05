# Tilføj Ny Ressource / Add New Resource

## Ressource Information

**Navn / Name:**  
[Navn på appen/tjenesten]

**URL:**  
[https://example.com]

**Kategori / Category:**  
- [ ] 🔄 Nostr Alternativer (nostr-alternatives)
- [ ] ⚡ Nostr Services (services)
- [ ] 🔌 Browser Udvidelser (extensions)
- [ ] 🛠️ Nostr Værktøjer (tools)
- [ ] 🌐 Nostr Relays (relays)

**Section Tag (valgfri / optional):**  
[f.eks. "Social Media", "Wallet", "Media Storage"]

## Beskrivelse / Description

[Kort beskrivelse på dansk af hvad ressourcen gør / Brief description in Danish of what the resource does]

## Hvorfor skal denne ressource tilføjes? / Why should this resource be added?

[Forklar hvorfor denne ressource er værdifuld for Nostr-brugere / Explain why this resource is valuable for Nostr users]

## Tjekliste / Checklist

- [ ] Jeg har testet at ressourcen virker / I have tested that the resource works
- [ ] URL'en er korrekt / The URL is correct
- [ ] Beskrivelsen er på dansk / Description is in Danish
- [ ] Jeg har valgt den korrekte kategori / I have selected the correct category
- [ ] Filen følger navngivningskonventionen (lowercase-with-hyphens.md)
- [ ] Frontmatter er korrekt formateret / Frontmatter is correctly formatted

## Yderligere Information / Additional Information

[Eventuelle ekstra kommentarer / Any additional comments]
EOFcat > .github/ISSUE_TEMPLATE/resource-suggestion.yml << 'EOF'
name: Foreslå Ny Ressource / Suggest New Resource
description: Foreslå en ny app eller tjeneste til Nostr.dk
title: "[RESSOURCE] "
labels: ["ressource-forslag", "needs-review"]
body:
  - type: markdown
    attributes:
      value: |
        Tak for at foreslå en ny ressource! / Thanks for suggesting a new resource!
        
  - type: input
    id: name
    attributes:
      label: Ressource Navn / Resource Name
      description: Hvad hedder appen/tjenesten?
      placeholder: f.eks. Primal, Damus, Alby
    validations:
      required: true

  - type: input
    id: url
    attributes:
      label: URL
      description: Link til ressourcen
      placeholder: https://example.com
    validations:
      required: true

  - type: dropdown
    id: category
    attributes:
      label: Kategori / Category
      description: Hvilken kategori passer bedst?
      options:
        - 🔄 Nostr Alternativer (nostr-alternatives)
        - ⚡ Nostr Services (services)
        - 🔌 Browser Udvidelser (extensions)
        - 🛠️ Nostr Værktøjer (tools)
        - 🌐 Nostr Relays (relays)
    validations:
      required: true

  - type: input
    id: section
    attributes:
      label: Section Tag (valgfri / optional)
      description: F.eks. "Social Media", "Wallet", "Media Storage"
      placeholder: Social Media

  - type: textarea
    id: description
    attributes:
      label: Beskrivelse / Description
      description: Kort beskrivelse på dansk (1-2 sætninger)
      placeholder: En decentraliseret social media klient bygget på Nostr protokollen
    validations:
      required: true

  - type: textarea
    id: why
    attributes:
      label: Hvorfor? / Why?
      description: Hvorfor skal denne ressource tilføjes til Nostr.dk?
      placeholder: Denne app gør det nemt for nye brugere at komme i gang med Nostr...
    validations:
      required: true

  - type: checkboxes
    id: testing
    attributes:
      label: Har du testet ressourcen? / Have you tested the resource?
      options:
        - label: Ja, jeg har testet at ressourcen virker / Yes, I have tested that the resource works
          required: true

  - type: textarea
    id: additional
    attributes:
      label: Yderligere Information / Additional Info
      description: Eventuelle ekstra kommentarer
      placeholder: Dette kunne også være relevant...
EOFcat > RESOURCE_TEMPLATE.md << 'EOF'
---
title: "Navn på App/Tjeneste"
description: "Kort beskrivelse på dansk (1-2 sætninger om hvad appen gør)."
url: "https://example.com/"
category: "nostr-alternatives"
section: "Type/Kategori"
order: 10
published: true
---

<!-- 
==========================================
SKABELON TIL NYE RESSOURCER
==========================================

FIELD FORKLARING:
- title: Navn på appen/tjenesten
- description: Kort beskrivelse på dansk (afslut med punktum)
- url: Link til ressourcen (inkl. trailing slash hvis relevant)
- category: Vælg én af kategorierne nedenfor
- section: Valgfri undertag (f.eks. "Social Media", "Meetup Alternative", "Wallet")
- order: Position i kategorien (1 = først, højere tal = senere)
- published: true (synlig) eller false (skjult)

KATEGORIER (vælg én):
- nostr-alternatives: Decentraliserede alternativer til centraliserede tjenester
- services: Specialiserede tjenester bygget på Nostr
- extensions: Browser udvidelser (nøglestyring, signering)
- tools: Hjælpeværktøjer til navigation i Nostr
- relays: Relay services og managere

EKSEMPEL:

---
title: "Flockstr"
description: "Decentralt alternativ til Meetup.com for at organisere events."
url: "https://www.flockstr.com/"
category: "nostr-alternatives"
section: "Meetup Alternative"
order: 1
published: true
---

-->
EOF# Create directory structure
mkdir -p .github/ISSUE_TEMPLATE

# 1. PR Template
cat > .github/PULL_REQUEST_TEMPLATE.md << 'EOF'
# Tilføj Ny Ressource / Add New Resource

## Ressource Information

**Navn / Name:**  
[Navn på appen/tjenesten]

**URL:**  
[https://example.com]

**Kategori / Category:**  
- [ ] 🔄 Nostr Alternativer (nostr-alternatives)
- [ ] ⚡ Nostr Services (services)
- [ ] 🔌 Browser Udvidelser (extensions)
- [ ] 🛠️ Nostr Værktøjer (tools)
- [ ] 🌐 Nostr Relays (relays)

**Section Tag (valgfri / optional):**  
[f.eks. "Social Media", "Wallet", "Media Storage"]

## Beskrivelse / Description

[Kort beskrivelse på dansk af hvad ressourcen gør / Brief description in Danish of what the resource does]

## Hvorfor skal denne ressource tilføjes? / Why should this resource be added?

[Forklar hvorfor denne ressource er værdifuld for Nostr-brugere / Explain why this resource is valuable for Nostr users]

## Tjekliste / Checklist

- [ ] Jeg har testet at ressourcen virker / I have tested that the resource works
- [ ] URL'en er korrekt / The URL is correct
- [ ] Beskrivelsen er på dansk / Description is in Danish
- [ ] Jeg har valgt den korrekte kategori / I have selected the correct category
- [ ] Filen følger navngivningskonventionen (lowercase-with-hyphens.md)
- [ ] Frontmatter er korrekt formateret / Frontmatter is correctly formatted

## Yderligere Information / Additional Information

[Eventuelle ekstra kommentarer / Any additional comments]

# Planning — Gantt & lien avec Git (Sharegames)

Ce fichier sert de **support visuel** pour la diapo *« Gestion de projet »* (point 14 de `FICHE-DIAPO-ORAL-CCP-SHAREGAMES.md`).

**Limite actuelle :** le workspace local n’est **pas** un dépôt Git (`git` absent), donc les diagrammes ci‑dessous sont des **modèles cohérents** avec ton stack (Angular, API Express, service upload, MySQL). Tu remplaces les dates par celles de **ton** historique GitHub (voir § 3).

---

## 1. Diagramme de Gantt — phases projet (périmètre CCP)

Basé sur les blocs habituels : besoins → conception → front → API → médias → tests → préparation oral / dossier.

```mermaid
gantt
    title Sharegames — phases (exemple de calendrier à ajuster)
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Cadrage
    Expression des besoins & périmètre     :a1, 2025-10-01, 14d
    Maquettes / charte UI                  :a2, after a1, 21d

    section Réalisation
    Auth & comptes (front + API)           :b1, 2025-11-01, 21d
    Catalogue jeux & fiches détaillées       :b2, after b1, 28d
    Admin & formulaires (création jeu)     :b3, after b2, 21d
    Service upload & médias                :b4, after b3, 14d

    section Qualité & livrables
    Tests unitaires (services Angular)     :c1, 2026-02-01, 14d
    Plan de tests & jeu d’essai (dossier)  :c2, after c1, 14d
    Doc déploiement / variables d’env      :c3, after c2, 10d

    section Clôture
    Dossier papier & préparation oral CCP   :d1, 2026-03-15, 12d
```

---

## 2. Diagramme de Gantt « rythme de livraison » (lié aux commits)

Même sans tes vrais pushs, on peut montrer au jury **comment** le planning suit des **jalons** (features livrées par vague). Exemple de découpage par **sprints / lots** — à recaler sur tes dates Git réelles.

```mermaid
gantt
    title Jalons type « vagues de commits » (à personnaliser avec ton GitHub)
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Lot 1 — socle
    Repo & structure monorepo                :m1, 2025-10-15, 10d
    Auth JWT & routes utilisateur          :m2, after m1, 12d

    section Lot 2 — métier jeu
    CRUD jeux & routes API                   :m3, after m2, 18d
    Intégration front (liste, détail)        :m4, after m3, 14d

    section Lot 3 — fichiers & finitions
    API upload & affichage médias            :m5, after m4, 12d
    Tests & correctifs (fix)                 :m6, after m5, 10d
```

Pour l’oral : une capture **GitHub → Insights → Contributors** ou **Network**, + ce Gantt, montre la **cohérence** entre planning et historique.

---

## 3. Récupérer *tes* dates depuis GitHub (à exécuter sur ta machine)

Dans le clone de **ton** dépôt (celui qui est sur GitHub) :

```bash
# Liste des commits avec date (pour recaler le Gantt ou un tableau Excel)
git log --reverse --format="%ad | %s" --date=short

# Fréquence par semaine (aperçu charge de travail)
git log --format="%ad" --date=short | cut -c1-7 | sort | uniq -c
```

Tu copies les **premières / dernières dates** de grosses features dans le `gantt` (sections et `start` / `duration`), ou tu exportes vers Excel / Project / Notion Gantt.

---

## 4. « UML » utile pour la même diapo (pas un Gantt)

Le **Gantt n’est pas un diagramme UML**. En revanche, pour compléter le dossier, un **diagramme de packages** ou **déploiement** est souvent attendu. Exemple minimal **packages** (front / API / BDD) :

```mermaid
flowchart LR
    subgraph Front
        A[Angular — ng-playforge]
    end
    subgraph API
        B[Express — api-Rest]
        C[Upload — api-upload]
    end
    subgraph Données
        D[(MySQL)]
    end
    A -->|HTTP REST JSON| B
    A -->|fichiers / images| C
    B --> D
    C --> D
```

Si ton RE exige du **UML strict** (cas d’utilisation, séquences), réutilise plutôt les diagrammes déjà prévus dans le dossier (CU, séquences auth, etc.).

---

*Fichier généré comme base de travail — à ajuster avec ton planning réel et ton export GitHub.*

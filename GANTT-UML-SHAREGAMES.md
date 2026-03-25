# Planning — Gantt calé sur Git (Sharegames)

Support pour la diapo *« Gestion de projet »* (`FICHE-DIAPO-ORAL-CCP-SHAREGAMES.md`, point 14).

---

## 1. Fréquence des commits par mois (aperçu charge)

| Mois (YYYY-MM) | api-Rest | api-upload | ng-playforge |
|----------------|----------|------------|--------------|
| 2024-06 | 44 | — | 1 |
| 2024-07 | 106 | — | 10 |
| 2024-08 | 3 | — | 6 |
| 2024-09 | 18 | 7 | 9 |
| 2024-10 | 3 | 2 | 3 |
| 2025-02 | 1 | 1 | 2 |
| 2025-04 | 4 | 1 | 8 |
| 2025-05 | 1 | 1 | 7 |
| 2025-11 | 13 | 4 | 8 |
| 2026-03 | 2 | 3 | 5 |
| *Autres mois* | *0* | *0* | *0* |

---

## 2. Diagramme de Gantt — vagues dérivées des trois dépôts


```mermaid
gantt
    title Sharegames — vagues d’activité (git : api-Rest, api-upload, ng-playforge)
    dateFormat  YYYY-MM-DD
    axisFormat  %b %y

    section api-Rest
    2024 H2 — API Game, jointures, search, catégories, auth JWT   :rest_a, 2024-06-17, 107d
    2025 — admin, profil, filtres, stats, rôles                     :rest_b, 2025-02-04, 112d
    2025-11 — Drizzle, commentaires, déploiement Render             :rest_c, 2025-11-19, 7d
    2026-03 — Sharegames, config BDD, nettoyage                     :rest_d, 2026-03-24, 1d

    section api-upload
    2024-09→10 — POST fichiers, GET images, token                  :up_a, 2024-09-14, 19d
    2025-02→05 — scripts démarrage, dépendances                     :up_b, 2025-02-04, 112d
    2025-11 — CORS, README upload, checks BDD                       :up_c, 2025-11-20, 6d
    2026-03 — deps, extraction jeux, renommage Sharegames           :up_d, 2026-03-24, 1d

    section ng-playforge
    2024 H2 — UI jeu, responsive, search, auth, rôles               :ng_a, 2024-06-17, 107d
    2025 — admin, bibliothèque, notifications, thème               :ng_b, 2025-02-04, 112d
    2025-11 — commentaires, notes, ng build                         :ng_c, 2025-11-19, 7d
    2026-03 — rebrand Sharegames, tests HttpClient                  :ng_d, 2026-03-24, 1d
```

---


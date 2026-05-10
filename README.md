# Airbnb and Rental Dynamics in Milan

This project studies how short-term rental activity (Airbnb) relates to long-term rental market dynamics in Milan between 2018 and 2024.

**Project website:** [mturco3.github.io/Data-Visualization-2026](https://mturco3.github.io/Data-Visualization-2026/)
**Interactive dashboard:** [Tableau Public — Milan Housing Dynamics](https://public.tableau.com/app/profile/michele.turco/viz/Milan_Housing_Dynamics/Dashboard1)

## Project Objective

Instead of asking only "does Airbnb increase rents?", the project asks where Airbnb pressure and rental values evolve together, where they diverge, and how much of the observed variation reflects spatial concentration versus broader city trends. This makes the analysis more useful for urban and policy discussions, because findings can be interpreted zone by zone rather than only at city-average level.

The goal is reached through creative visualizations and descriptive analysis rather than complex econometric modeling. The project is designed to be reproducible and extendable, with clear data inputs, processing steps, and outputs.

The target audience is non-expert urban stakeholders (students, residents, and local policy observers) who need clear evidence, not only technical metrics. The system is designed to support five tasks: compare neighborhoods, identify spatial concentration, inspect temporal evolution, contrast ethical and misleading narratives (white-hat vs black-hat), and communicate actionable findings.

## Data Sources

| Dataset | Description | Link |
|---------|-------------|------|
| Inside Airbnb — Milan | Listing-level snapshot with review history (2018–2024) | [insideairbnb.com/get-the-data](https://insideairbnb.com/get-the-data/) |
| OMI — Agenzia delle Entrate | Official long-term rent estimates by zone and semester | [dati.comune.milano.it — OMI](https://dati.comune.milano.it/dataset?tags=OMI) |

Local files in `Data/`:
- `listings_milan.csv` and `listings_milan_clean.csv`: Airbnb listing-level information.
- `reviews_milan.csv`: review activity used for temporal signals.
- `total_rentals.csv`: aggregated rental market indicators.
- `quotazioni_omi_locazione_YYYY_S.csv`: semi-annual OMI rental quotations (2018–2024).

## Repository Structure

```
src/
  0_Notebook.ipynb          # Main analysis and visualizations
  utils/                    # Mapping utilities (neighbourhood → OMI zone)
  io/plots/                 # Generated figure outputs
docs/
  index.html                # Project website (served via GitHub Pages)
  main.js / landmark.js     # D3 and Three.js interactive components
  style.css
report.tex                  # LaTeX project report (compile with pdflatex)
Data/                       # Raw and cleaned data files
```

## Reproducing the Analysis

1. Install dependencies: `pip install pandas matplotlib seaborn numpy`
2. Run `src/0_Notebook.ipynb` from top to bottom.
3. Generated plots are saved to `src/io/plots/`.
4. The LaTeX report can be compiled with: `pdflatex report.tex`

## Key Findings

1. **Concentration is real but not citywide uniform.** The five largest neighbourhoods account for ~28% of all listings.
2. **Airbnb presence aligns with expensive rent contexts.** Cross-sectional correlation with 2024 OMI midpoint rent: *r* ≈ 0.62.
3. **COVID was a sharp interruption, not a reset.** Review activity fell ~67.5% in 2020, then rebounded to ~329% above 2019 levels by 2024.
4. **The stock is heavily commercialised.** Entire homes ~87.9%; professional hosts (≥5 listings) ~45.1%.
5. **Pressure does not automatically imply displacement.** The data show correlation, not evidence of direct displacement.

---

Analysis performed for educational purposes only. All data is publicly available.

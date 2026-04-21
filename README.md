# Airbnb and Rental Dynamics in Milan

This project studies how short-term rental activity (Airbnb) relates to long-term rental market dynamics in Milan.
The core idea is to move from a simple correlation question to a neighborhood-level evidence framework. The analysis measures Airbnb presence and intensity by neighborhood, links neighborhoods to OMI (Osservatorio del Mercato Immobiliare) rental zones, and compares Airbnb pressure with rental levels across space and time.

## Project Objective

Instead of asking only "does Airbnb increase rents?", the project asks where Airbnb pressure and rental values evolve together, where they diverge, and how much of the observed variation reflects spatial concentration versus broader city trends. This makes the analysis more useful for urban and policy discussions, because findings can be interpreted zone by zone rather than only at city-average level.
The goal is reached through creative visualizations and descriptive analysis rather than complex econometric modeling. The project is designed to be reproducible and extendable, with clear data inputs, processing steps, and outputs.

The target audience is non-expert urban stakeholders (students, residents, and local policy observers) who need clear evidence, not only technical metrics. The system is designed to support five tasks: compare neighborhoods, identify spatial concentration, inspect temporal evolution, contrast ethical and misleading narratives (white-hat vs black-hat), and communicate actionable findings.

## Data Inputs

Main datasets are stored in `Data/`:
- `listings_milan.csv` and `listings_milan_clean.csv`: Airbnb listing-level information.
- `reviews_milan.csv`: review activity used for temporal signals.
- `total_rentals.csv`: aggregated rental market indicators.
- `quotazioni_omi_locazione_YYYY_S.csv`: semi-annual OMI rental quotations (2018-2024).

These sources are integrated to satisfy the multi-dataset requirement, and data limitations or potential bias are discussed in the notebooks and final report.

## Repository Workflow

The workflow starts with Airbnb exploration and cleaning in `airbnb_milan_eda.ipynb`, continues with OMI rental analysis in `OMI_data.ipynb`, and extends to temporal patterns in `reviews_listings_temporal_analysis.ipynb`. Neighborhoods are then linked to OMI zones through `map_neighbourhoods_to_omi.py`.

## Outputs

All analysis outputs will be added to the `Output/` folder.

In line with the course guidelines, the full project package also includes the interactive visual analytics views, the white-hat and black-hat static views, a small original JavaScript interactive component in the project webpage, and the accompanying short paper-style report.

## Relevance of the Study

Milan is a useful case for studying the interaction between tourism platforms and housing markets. By combining Airbnb microdata with official OMI rental quotes, the project provides a reproducible path to investigate spatial pressure, rental heterogeneity, and potential displacement signals at neighborhood scale.

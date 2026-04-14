# Airbnb and Rent Analysis (Milan Scope)

This project analyzes Airbnb and rental indicators for Milan and generates the required visualization outputs.

The current analysis is built to answer this question:
- do zones with higher Airbnb pressure also show higher rental increases over time?

## Data Required

Put these files in Data/:

- Data/listings_milan.csv
- Data/total_rentals.csv

## Environment Setup

PowerShell:

        .\Data_Viz\Scripts\Activate.ps1

Install dependencies:

        python -m pip install -r requirements.txt

## Run

Generate all project plots:

        python visualizations.py

All generated plots are saved in:

- Outputs/plots/

## Visualization Set (Current)

The script exports PNG plots only:

- viz1_pressure_ranking.png
        - Ranked pressure profile by neighborhood (composite score).

- viz2_price_vs_entire_home.png
        - Bubble scatter of neighborhood median Airbnb price vs entire-home share.

- viz3_host_concentration.png
        - Host concentration curve to show supply concentration.

- viz4_rent_vs_airbnb.png
        - Two-panel temporal view:
                - city-level rental trend over years
                - top zones with strongest rental levels across time

- viz5_explanatory.png
        - Explanatory summary for non-technical audience.

- viz6_creative_spatial.png
        - Spatial distribution of listings in Milan with visual emphasis on intensity.

- viz7_white_hat.png
        - Main diagnostic figure for the research question:
                - city trend
                - Airbnb pressure by neighborhood
                - pressure vs rent-growth scatter with correlation line and coefficient
                - interpretation panel

- viz8_black_hat.png
        - Intentionally misleading version (same underlying data) for ethics comparison.

## Interpretation Notes

- Correlation in V7 does not imply causation.
- Matching between Airbnb neighborhood names and rental zones may be partial, depending on naming consistency in total_rentals.csv.
- If zone names are mismatched, V7 reports fewer matched areas in the insight panel.

## Files

- visualizations.py: script that generates plots
- visualizations_specification.md: detailed visualization specification
- Resources/instructions.md: technical implementation instructions

## Troubleshooting

- If file parsing fails, verify total_rentals.csv delimiter and encoding.
- The loader attempts multiple parsing modes (comma/semicolon, utf-8/latin1, safe row skipping).
- If package installation fails with pip launcher issues, use:

        .\Data_Viz\Scripts\python.exe -m pip install <package>
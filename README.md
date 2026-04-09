# Airbnb Impact on Italian Cities

## Data Setup

This repository does not include the raw data or project resources. You need to place them manually before running any notebooks.

### Required folders

```
Project/
├── Data/
│   ├── listings_florence.csv
│   ├── listings_milan.csv
│   └── listings_rome.csv
└── Resources/
    └── plan.md
```

### Where to get the data

Download the listings CSV files from [Inside Airbnb](http://insideairbnb.com/get-the-data/) for the following cities:
- Florence (Firenze)
- Milan (Milano)
- Rome (Roma)

Select the `listings.csv` (summary) file for each city and rename them as shown above.

### Generating the notebook

Run the notebook generator script:

```bash
python generate_notebook.py
```

This will create `airbnb_analysis.ipynb` in the project root.

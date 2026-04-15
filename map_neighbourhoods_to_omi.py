"""
Utility module for mapping between Airbnb neighbourhoods and OMI zones.
Provides a single function to apply bidirectional mapping to dataframe columns.
"""

import pandas as pd


NEIGHBOURHOOD_TO_ZONA = {
    "Adriano": "D35",
    "Affori": "D32",
    "Baggio": "E5",
    "Bande Nere": "D25",
    "Barona": "D21",
    "Bicocca": "D34",
    "Bovisa": "D31",
    "Bovisasca": "D32",
    "Brera": "B15",
    "Bruzzano": "E8",
    "Buenos Aires - Venezia": "C12",
    "Cantalupa": "E7",
    "Centrale": "C15",
    "Chiaravalle": "D39",
    "Citta' Studi": "D12",
    "Comasina": "D32",
    "Corsica": "D12",
    "De Angeli - Monte Rosa": "C17",
    "Dergano": "D31",
    "Duomo": "B12",
    "Ex Om - Morivione": "D20",
    "Farini": "C16",
    "Figino": "E6",
    "Forze Armate": "D25",
    "Gallaratese": "E6",
    "Garibaldi Repubblica": "C14",
    "Ghisolfa": "C16",
    "Giambellino": "D25",
    "Giardini Porta Venezia": "B18",
    "Gratosoglio - Ticinello": "E7",
    "Greco": "D34",
    "Guastalla": "B13",
    "Isola": "C14",
    "Lambrate": "D13",
    "Lodi - Corvetto": "D16",
    "Lorenteggio": "D25",
    "Loreto": "C12",
    "Maciachini - Maggiolina": "D36",
    "Magenta - S. Vittore": "B16",
    "Maggiore - Musocco": "D30",
    "Mecenate": "D15",
    "Muggiano": "E5",
    "Navigli": "C18",
    "Niguarda - Ca' Granda": "D33",
    "Ortomercato": "D15",
    "Padova": "D10",
    "Pagano": "C17",
    "Parco Agricolo Sud": "D40",
    "Parco Bosco In Citt": "E6",
    "Parco Dei Navigli": "D21",
    "Parco Delle Abbazie": "E7",
    "Parco Forlanini - Ortica": "D15",
    "Parco Lambro - Cimiano": "D10",
    "Parco Monlue' - Ponte Lambro": "D37",
    "Parco Nord": "D33",
    "Parco Sempione": "B17",
    "Porta Romana": "B19",
    "Portello": "D28",
    "Qt 8": "D28",
    "Quarto Cagnino": "E5",
    "Quarto Oggiaro": "E8",
    "Quinto Romano": "E5",
    "Quintosole": "D38",
    "Ripamonti": "D18",
    "Rogoredo": "D37",
    "Ronchetto Delle Rane": "D40",
    "Ronchetto Sul Naviglio": "D21",
    "S. Cristoforo": "C18",
    "S. Siro": "D24",
    "Sacco": "E8",
    "Sarpi": "C16",
    "Scalo Romana": "C19",
    "Selinunte": "D24",
    "Stadera": "D18",
    "Stephenson": "D30",
    "Tibaldi": "C19",
    "Ticinese": "B21",
    "Tortona": "C18",
    "Tre Torri": "C13",
    "Trenno": "E6",
    "Triulzo Superiore": "D39",
    "Umbria - Molise": "C20",
    "Viale Monza": "D35",
    "Vigentina": "B20",
    "Villapizzone": "D30",
    "Washington": "C17",
    "Xxii Marzo": "C20",
}

# Reverse mapping (Zona -> neighbourhood)
ZONA_TO_NEIGHBOURHOOD = {v: k for k, v in NEIGHBOURHOOD_TO_ZONA.items()}


def apply_mapping(df: pd.DataFrame,
    column: str,
    direction: str = "neighbourhood_to_zona",
    inplace: bool = False,
) -> pd.DataFrame:
    """
    Apply neighbourhood-to-Zona or Zona-to-neighbourhood mapping to a dataframe column.
    
    Args:
        df: Input dataframe.
        column: Column name to apply mapping to.
        direction: 'neighbourhood_to_zona' or 'zona_to_neighbourhood'.
        inplace: If True, modifies the dataframe in place. If False, returns a copy.
    
    Returns:
        DataFrame with mapped column (or None if inplace=True).
    
    Raises:
        ValueError: If direction is invalid or column doesn't exist.
    """
    if column not in df.columns:
        raise ValueError(f"Column '{column}' not found in dataframe.")
    
    if direction not in ("neighbourhood_to_zona", "zona_to_neighbourhood"):
        raise ValueError(
            "direction must be 'neighbourhood_to_zona' or 'zona_to_neighbourhood'."
        )
    
    mapping = (
        NEIGHBOURHOOD_TO_ZONA
        if direction == "neighbourhood_to_zona"
        else ZONA_TO_NEIGHBOURHOOD
    )
    
    if inplace:
        df[column] = df[column].map(mapping)
        return None
    else:
        result = df.copy()
        result[column] = result[column].map(mapping)
        return result

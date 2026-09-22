import pandas as pd
import json
import math

def clean_value(val):
    if pd.isna(val) or (isinstance(val, float) and math.isnan(val)):
        return None
    return str(val).strip()

def extract():
    file_path = r'E:\projects\byw\UPDATED_FINAL_BYW_Sports_Fest_Tracker_With_Qualifiers_Semis_Finals.xlsx'
    xls = pd.ExcelFile(file_path)
    
    # 1. Teams & Players
    df_rosters = pd.read_excel(xls, 'Team Rosters')
    players = []
    teams = set()
    
    # Finding the actual header row (which is row 3 in 0-indexed)
    # Based on our previous analysis, row 3 has: Team, Player Code, Player Name (INPUT), Gender (INPUT), Notes
    df_rosters.columns = df_rosters.iloc[3]
    df_rosters = df_rosters.iloc[4:].reset_index(drop=True)
    
    for _, row in df_rosters.iterrows():
        team_id = clean_value(row.get('Team'))
        player_code = clean_value(row.get('Player Code'))
        player_name = clean_value(row.get('Player Name (INPUT)'))
        gender = clean_value(row.get('Gender (INPUT)'))
        
        if team_id and player_code:
            teams.add(team_id)
            players.append({
                "team": team_id,
                "code": player_code,
                "name": player_name,
                "gender": gender
            })
            
    # 2. Matches
    df_matches = pd.read_excel(xls, 'Match Results')
    df_matches.columns = df_matches.iloc[3]
    df_matches = df_matches.iloc[4:].reset_index(drop=True)
    
    matches = []
    for _, row in df_matches.iterrows():
        match_no = clean_value(row.get('Match No.'))
        if not match_no:
            continue
        
        matches.append({
            "match_no": match_no,
            "time": clean_value(row.get('Time')),
            "sport": clean_value(row.get('Sport')),
            "category": clean_value(row.get('Category')),
            "stage": clean_value(row.get('Stage')),
            "team1": clean_value(row.get('Team 1')),
            "team2": clean_value(row.get('Team 2')),
            "winner": clean_value(row.get('Winner (INPUT)')),
            "completed": clean_value(row.get('Completed?'))
        })

    data = {
        "teams": list(teams),
        "players": players,
        "matches": matches
    }
    
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=4)
        
    print("Data extracted successfully to data.json")

if __name__ == '__main__':
    extract()

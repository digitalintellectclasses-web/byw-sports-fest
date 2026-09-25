import pandas as pd
import math
import traceback
import os
import json

def clean_value(val):
    if pd.isna(val) or (isinstance(val, float) and math.isnan(val)):
        return None
    return str(val).strip()

def run_seed():
    excel_path = r'E:\projects\byw\docs_and_scripts\UPDATED_FINAL_BYW_Sports_Fest_Tracker_With_Qualifiers_Semis_Finals.xlsx'
    
    if not os.path.exists(excel_path):
        print(f"Excel file not found at {excel_path}")
        return

    try:
        xls = pd.ExcelFile(excel_path)
        
        # 1. TEAMS & PLAYERS
        df_rosters = pd.read_excel(xls, 'Team Rosters')
        df_rosters.columns = df_rosters.iloc[3]
        df_rosters = df_rosters.iloc[4:].reset_index(drop=True)
        
        teams = set()
        players = []
        for _, row in df_rosters.iterrows():
            team_id = clean_value(row.get('Team'))
            p_code = clean_value(row.get('Player Code'))
            p_name = clean_value(row.get('Player Name (INPUT)'))
            gender = clean_value(row.get('Gender (INPUT)'))
            if team_id and p_code:
                teams.add(team_id)
                players.append({"code": p_code, "name": p_name, "gender": gender, "teamId": team_id})

        # 2. MATCHES
        df_matches = pd.read_excel(xls, 'Match Results')
        df_matches.columns = df_matches.iloc[3]
        df_matches = df_matches.iloc[4:].reset_index(drop=True)
        
        matches = []
        for _, row in df_matches.iterrows():
            match_no = clean_value(row.get('Match No.'))
            if not match_no:
                continue
            
            time_val = clean_value(row.get('Time'))
            sport = clean_value(row.get('Sport'))
            category = clean_value(row.get('Category'))
            stage = clean_value(row.get('Stage'))
            team1 = clean_value(row.get('Team 1'))
            team2 = clean_value(row.get('Team 2'))
            winner = clean_value(row.get('Winner (INPUT)'))
            completed = clean_value(row.get('Completed?'))
            
            matches.append({
                "id": str(match_no),
                "time": time_val if time_val else None,
                "sport": sport if sport else None,
                "category": category if category else None,
                "stage": stage if stage else None,
                "team1Id": team1 if team1 else None, 
                "team2Id": team2 if team2 else None, 
                "winnerId": winner if winner else None, 
                "completed": completed
            })

        # 3. PLAYER APPEARANCES
        df_app = pd.read_excel(xls, 'Player Usage')
        df_app.columns = df_app.iloc[3]
        df_app = df_app.iloc[4:].reset_index(drop=True)
        
        appearances = []
        for _, row in df_app.iterrows():
            match_no = clean_value(row.get('Match No.'))
            p_code = clean_value(row.get('Player Code (INPUT)'))
            team_id = clean_value(row.get('Playing Team'))
            
            if match_no and p_code:
                app_id = f"{match_no}_{p_code}"
                appearances.append({"id": app_id, "matchId": str(match_no), "playerCode": p_code, "teamId": team_id})
                
        output = {
            "teams": list(teams),
            "players": players,
            "matches": matches,
            "appearances": appearances
        }
        with open("seed_data.json", "w") as f:
            json.dump(output, f)
        print("Data exported to seed_data.json")

    except Exception as e:
        print(f"Error seeding database: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    run_seed()

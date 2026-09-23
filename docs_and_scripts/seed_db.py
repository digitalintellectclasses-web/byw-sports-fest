import pandas as pd
import sqlite3
import math
import traceback
import os

def clean_value(val):
    if pd.isna(val) or (isinstance(val, float) and math.isnan(val)):
        return None
    return str(val).strip()

def run_seed():
    db_path = r'E:\projects\byw\web-app\prisma\dev.db'
    excel_path = r'E:\projects\byw\UPDATED_FINAL_BYW_Sports_Fest_Tracker_With_Qualifiers_Semis_Finals.xlsx'
    
    if not os.path.exists(excel_path):
        print(f"Excel file not found at {excel_path}")
        return

    # Check if DB exists, if not it will be created, but we need the schema.
    # We assume Prisma has already pushed the schema.
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

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
                players.append((p_code, p_name, gender, team_id))
                
        # Insert Teams
        for t in teams:
            cursor.execute('''
                INSERT OR IGNORE INTO Team (id, name, penalty_points)
                VALUES (?, ?, 0)
            ''', (t, t))
            
        # Insert Players
        for p in players:
            cursor.execute('''
                INSERT OR IGNORE INTO Player (code, name, gender, teamId)
                VALUES (?, ?, ?, ?)
            ''', p)

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
            
            matches.append((
                str(match_no), time_val, sport, category, stage,
                team1 if team1 else None, 
                team2 if team2 else None, 
                winner if winner else None, 
                completed
            ))
            
        for m in matches:
            cursor.execute('''
                INSERT OR IGNORE INTO Match (id, time, sport, category, stage, team1Id, team2Id, winnerId, completed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', m)

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
                # generate a unique id for the appearance
                app_id = f"{match_no}_{p_code}"
                appearances.append((app_id, str(match_no), p_code, team_id))
                
        for app in appearances:
            cursor.execute('''
                INSERT OR IGNORE INTO PlayerAppearance (id, matchId, playerCode, teamId)
                VALUES (?, ?, ?, ?)
            ''', app)
            
        conn.commit()
        print("Database seeded successfully from Excel!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == '__main__':
    run_seed()

import json
import copy

pdf_schedule = {
    145: {"sport": "Carrom", "category": "Boys Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "3:30 PM-4:00 PM"},
    146: {"sport": "Carrom", "category": "Girls Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "3:30 PM-4:00 PM"},
    147: {"sport": "Carrom", "category": "Mixed Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "3:30 PM-4:00 PM"},
    148: {"sport": "Table Tennis", "category": "Boys Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "3:30 PM-4:00 PM"},
    149: {"sport": "Table Tennis", "category": "Mixed Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "3:30 PM-4:00 PM"},
    
    150: {"sport": "Carrom", "category": "Boys Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "4:00 PM-4:30 PM"},
    151: {"sport": "Carrom", "category": "Girls Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "4:00 PM-4:30 PM"},
    152: {"sport": "Carrom", "category": "Mixed Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "4:00 PM-4:30 PM"},
    153: {"sport": "Table Tennis", "category": "Boys Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "4:00 PM-4:30 PM"},
    154: {"sport": "Table Tennis", "category": "Mixed Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "4:00 PM-4:30 PM"},

    155: {"sport": "Badminton", "category": "Girls Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "4:30 PM-5:00 PM"},
    156: {"sport": "Badminton", "category": "Girls Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "4:30 PM-5:00 PM"},
    157: {"sport": "Badminton", "category": "Mixed Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "4:30 PM-5:00 PM"},
    158: {"sport": "Football", "category": "Boys", "stage": "SF1", "rule": ("A1", "B2"), "time": "4:30 PM-5:00 PM"},
    
    159: {"sport": "Badminton", "category": "Boys Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "5:00 PM-5:30 PM"},
    160: {"sport": "Badminton", "category": "Boys Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "5:00 PM-5:30 PM"},
    161: {"sport": "Badminton", "category": "Mixed Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "5:00 PM-5:30 PM"},

    162: {"sport": "Pickleball", "category": "Girls Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "5:30 PM-6:00 PM"},
    163: {"sport": "Pickleball", "category": "Girls Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "5:30 PM-6:00 PM"},
    164: {"sport": "Pickleball", "category": "Mixed Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "5:30 PM-6:00 PM"},
    165: {"sport": "Football", "category": "Boys", "stage": "SF2", "rule": ("A2", "B1"), "time": "5:30 PM-6:00 PM"},
    
    166: {"sport": "Pickleball", "category": "Boys Doubles", "stage": "SF1", "rule": ("A1", "B2"), "time": "6:00 PM-6:30 PM"},
    167: {"sport": "Pickleball", "category": "Boys Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "6:00 PM-6:30 PM"},
    168: {"sport": "Pickleball", "category": "Mixed Doubles", "stage": "SF2", "rule": ("A2", "B1"), "time": "6:00 PM-6:30 PM"},

    # Finals
    169: {"sport": "Carrom", "category": "Boys Doubles", "stage": "Final", "time": "6:30 PM-7:00 PM"},
    170: {"sport": "Carrom", "category": "Girls Doubles", "stage": "Final", "time": "6:30 PM-7:00 PM"},
    171: {"sport": "Carrom", "category": "Mixed Doubles", "stage": "Final", "time": "6:30 PM-7:00 PM"},
    
    172: {"sport": "Table Tennis", "category": "Boys Doubles", "stage": "Final", "time": "7:00 PM-7:30 PM"},
    173: {"sport": "Table Tennis", "category": "Mixed Doubles", "stage": "Final", "time": "7:00 PM-7:30 PM"},
    
    175: {"sport": "Badminton", "category": "Boys Doubles", "stage": "Final", "time": "7:30 PM-8:00 PM"},
    176: {"sport": "Badminton", "category": "Girls Doubles", "stage": "Final", "time": "7:30 PM-8:00 PM"},
    177: {"sport": "Badminton", "category": "Mixed Doubles", "stage": "Final", "time": "7:30 PM-8:00 PM"},
    
    178: {"sport": "Pickleball", "category": "Boys Doubles", "stage": "Final", "time": "8:00 PM-8:30 PM"},
    179: {"sport": "Pickleball", "category": "Girls Doubles", "stage": "Final", "time": "8:00 PM-8:30 PM"},
    180: {"sport": "Pickleball", "category": "Mixed Doubles", "stage": "Final", "time": "8:00 PM-8:30 PM"},
    
    181: {"sport": "Football", "category": "Boys", "stage": "Final", "time": "8:30 PM-9:00 PM"}
}

data = json.load(open('seed_data.json'))
matches = data['matches']

# calculate standings
categories = {}
for m in matches:
    if m['stage'] == 'League' and m.get('completed') == 'YES':
        sp = m['sport']
        cat = m['category']
        w = m.get('winnerId')
        if not w: continue
        if sp not in categories: categories[sp] = {}
        if cat not in categories[sp]: categories[sp][cat] = {'A': {}, 'B': {}}
        g = w[0]
        categories[sp][cat][g][w] = categories[sp][cat][g].get(w, 0) + 10

def get_top(sp, cat, group, rank):
    if sp not in categories or cat not in categories[sp]: return None
    g_scores = categories[sp][cat][group]
    sorted_teams = sorted(g_scores.items(), key=lambda x: x[1], reverse=True)
    if len(sorted_teams) >= rank:
        return sorted_teams[rank-1][0]
    return None

new_matches = []
# Keep league matches as they are (ID < 145)
for m in matches:
    if int(m['id']) < 145:
        new_matches.append(m)

# Generate Semifinals
sf_winners = {} # store winners to use in finals
for mid in range(145, 169):
    if mid not in pdf_schedule: continue
    info = pdf_schedule[mid]
    
    t1_rule, t2_rule = info['rule']
    t1 = get_top(info['sport'], info['category'], t1_rule[0], int(t1_rule[1]))
    t2 = get_top(info['sport'], info['category'], t2_rule[0], int(t2_rule[1]))
    
    winner = t1 # Make team 1 win by default for demo
    completed = "YES" if t1 and t2 else "NO"
    if completed == "NO": winner = None
    
    m = {
        "id": str(mid),
        "time": info["time"],
        "sport": info["sport"],
        "category": info["category"],
        "stage": info["stage"],
        "team1Id": t1,
        "team2Id": t2,
        "winnerId": winner,
        "completed": completed
    }
    new_matches.append(m)
    
    if winner:
        key = (info["sport"], info["category"], info["stage"])
        sf_winners[key] = winner

# Generate Finals
for mid in range(169, 182):
    if mid not in pdf_schedule: continue
    info = pdf_schedule[mid]
    
    sp = info["sport"]
    cat = info["category"]
    
    t1 = sf_winners.get((sp, cat, "SF1"))
    t2 = sf_winners.get((sp, cat, "SF2"))
    
    winner = None
    completed = "NO"
    # Make some finals completed just for demo variety
    if mid in [169, 175]: 
        winner = t1 if t1 else None
        completed = "YES" if winner else "NO"
    
    m = {
        "id": str(mid),
        "time": info["time"],
        "sport": info["sport"],
        "category": info["category"],
        "stage": info["stage"],
        "team1Id": t1,
        "team2Id": t2,
        "winnerId": winner,
        "completed": completed
    }
    new_matches.append(m)

data['matches'] = new_matches

with open('seed_data.json', 'w') as f:
    json.dump(data, f)
    
print("Updated seed_data.json")

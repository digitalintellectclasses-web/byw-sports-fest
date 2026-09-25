import json

data = json.load(open('seed_data.json'))
matches = data['matches']

# compute standings
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

# Helper to get #1 and #2
def get_top(sp, cat, group):
    if sp not in categories or cat not in categories[sp]: return None, None
    g_scores = categories[sp][cat][group]
    sorted_teams = sorted(g_scores.items(), key=lambda x: x[1], reverse=True)
    if len(sorted_teams) >= 2:
        return sorted_teams[0][0], sorted_teams[1][0]
    elif len(sorted_teams) == 1:
        return sorted_teams[0][0], None
    return None, None

def check_match(m, expected_t1, expected_t2):
    t1 = m.get('team1Id')
    t2 = m.get('team2Id')
    if (t1 == expected_t1 and t2 == expected_t2) or (t1 == expected_t2 and t2 == expected_t1):
        return True
    return False

rules = {
    145: ('A1', 'B2'), 146: ('A1', 'B2'), 147: ('A1', 'B2'), 148: ('A1', 'B2'), 149: ('A1', 'B2'),
    150: ('A2', 'B1'), 151: ('A2', 'B1'), 152: ('A2', 'B1'), 153: ('A2', 'B1'), 154: ('A2', 'B1'),
    155: ('A2', 'B1'), 156: ('A1', 'B2'), 157: ('A1', 'B2'), 158: ('A1', 'B2'),
    159: ('A1', 'B2'), 160: ('A2', 'B1'), 161: ('A2', 'B1'),
    162: ('A2', 'B1'), 163: ('A1', 'B2'), 164: ('A1', 'B2'), 165: ('A2', 'B1'),
    166: ('A1', 'B2'), 167: ('A2', 'B1'), 168: ('A2', 'B1')
}

for m in matches:
    mid = int(m['id'])
    if mid in rules:
        sp = m['sport']
        cat = m['category']
        a1, a2 = get_top(sp, cat, 'A')
        b1, b2 = get_top(sp, cat, 'B')
        
        rule = rules[mid]
        expected_t1 = a1 if rule[0] == 'A1' else a2
        expected_t2 = b1 if rule[1] == 'B1' else b2
        
        if not check_match(m, expected_t1, expected_t2):
            print(f"Mismatch in {mid} ({sp} {cat}): Expected {expected_t1} vs {expected_t2}, got {m.get('team1Id')} vs {m.get('team2Id')}")
            
# Also check Finals (169 to 181)
for m in matches:
    mid = int(m['id'])
    if 169 <= mid <= 181:
        sp = m['sport']
        cat = m['category']
        
        # Find SF1 and SF2 winners
        sf1_winner = next((sm.get('winnerId') for sm in matches if sm['sport']==sp and sm['category']==cat and sm['stage']=='SF1'), None)
        sf2_winner = next((sm.get('winnerId') for sm in matches if sm['sport']==sp and sm['category']==cat and sm['stage']=='SF2'), None)
        
        if not check_match(m, sf1_winner, sf2_winner):
             print(f"Mismatch in {mid} Final ({sp} {cat}): Expected {sf1_winner} vs {sf2_winner}, got {m.get('team1Id')} vs {m.get('team2Id')}")


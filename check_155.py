import json
data = json.load(open('seed_data.json'))
for m in data['matches']:
    if 155 <= int(m['id']) <= 168:
        print(f"{m['id']}: {m['sport']} {m['category']}")

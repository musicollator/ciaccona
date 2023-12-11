import yaml

# Load the YAML file
with open('docs/_artists.yaml', 'r') as file:
    data = yaml.safe_load(file)

# Iterate over each record and print the desired line
for record in data:
    video_id = record.get('▶', {}).get('id', '')
    print(f"https://youtu.be/{video_id}")

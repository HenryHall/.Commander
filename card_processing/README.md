Reads MTGJSON data and formats it into a slimmer format for Commander Dash.

Output Structure:

{
  "Card Name": {
    "images": [
      {"setName": setName, "setCode": setCode, "multiverseid": multiverseid}
    ]
  },
  "Card Name 2": {...},
  ...
}

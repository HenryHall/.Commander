
import urllib.request
import json

#Final Product
outputData = {}

#Make allCardsX Request
print("Getting all cards JSON...")
allCardsXURL = 'https://mtgjson.com/json/AllCards-x.json'
req = urllib.request.Request(allCardsXURL)
#Parse response
r = urllib.request.urlopen(req).read()
allCardsX = json.loads(r.decode('utf-8'))

#Make AllSets Request
print("Getting all sets JSON...")
allSetsURL = 'https://mtgjson.com/json/AllSets.json'
req = urllib.request.Request(allSetsURL)
#Parse response
r = urllib.request.urlopen(req).read()
allSets = json.loads(r.decode('utf-8'))



#Parce json
print("Parsing data...")
counter = 0
for card in allCardsX:
    counter += 1
    #if counter > 50:
    #    break

    #print("Adding:", card)
    outputData[card] = {}
    outputData[card]["images"] = []

    for printing in allCardsX[card]["printings"]:
        #print("Printing:", printing)
        for setCard in allSets[printing]["cards"]:
            if setCard["name"] == card:

                try:
                    setName = allSets[printing]["name"]
                except KeyError:
                    continue

                try:
                    multiverseid = setCard["multiverseid"]
                except KeyError:
                    continue

                outputData[card]["images"].append({"setName": setName, "setCode": printing, "multiverseid": multiverseid})
                break

with open('AllCards.json', 'w') as outfile:
    json.dump(outputData, outfile)

print(counter, "cards processed successfully.")

#print(outputData)

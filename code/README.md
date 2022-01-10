# Ausführung:

### Prerequisites:
* ```node```
### Zuerst
* ```cd code``` - Ihr Konsole muss im Ordner ```code``` sein
* ```npm install``` - Installiert die Node Packages.
### POC Ausführen
* ```npm run poc``` - Führt den poc aus.
### API Ausführen
* ```npm run api``` - Führt den api aus.

# Tagebuch:

# 22.12.2021
### fakeApi 
* fertig
* get request auf den PORT 3001, um Produkte als json Format zu erhalten
### mainApi 
* server startet (PORT 3000)
* router für wg wurde erstellt
* /help/JsonHelper.js - deleteFromJson geht die splice funktion nicht richtig

# 26.12.2021
### mainApi
* wg rest ist fertg implementiert - localhost:3000/wg
* mitbewohner rest angefangen - localhost:3000/mitbewohner/:wgID

# 04.01.2021
### mainApi
* code etwas verschoenert durch Funktionen ausserhalb der requests
* mitbewohner fast fertig -> funktion addSchulden funktioniert nicht richtig
* addSchulden
    *  -> Soll durch die Mitbewohnerliste gehen und in die Schuldenliste eintragen. (Funktioniert)
    *  -> Das Übernehmen von vorher eingetragenen Schuldenwert. (Funktioniert nicht)
    *  -> Prüfen ob der Name schon in der Schuldenliste vorhanden ist und demenstprechen ignorieren. (Funktioniert nicht)

# 07.01.2021
### mainApi
* neue Datenstruktur -> nutzen MongoDB -> alter code ist im branch "old" 
* WG Fertig
* User noch nicht ganz



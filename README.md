# Kyuto

# ToDo
 - !help, !commands -> cmd: description, category
 - !gender, !sex -> Man kann sein eigenes Geschlecht festlegen, dass der Bot für den Nutzer nutzt
 - Lokalisations-System für alle Befehle einbauen + alle Konsolen-Ausgaben (Mit Fallback arbeiten!!)
 - Der Bot muss erkennen, ob er auf dem Root oder bei einem Dev läuft. Wenn er bei einem Dev läuft, muss in der config eine GuildID angegeben werden, in der er antworten darf. Der Root-Bot muss in der config dann ein ignore-GuildID haben.
 - Alpha darf die RichEmbeds etc. von Sprax neu machen. Schön und übersichtlich halt <3
 - Prefix-Befehl in settings-Befehl integrieren
 - Lohnt sich der !Ping befehl? Denn der angezeigte Ping ist niemals korrekt (User sendet, Bot empfängt, verarbeitet async [empfangen und eigene Nachricht], berechnet) -> User-Ping, Bot-Ping und Bot-/Server-Auslastung sind alles Faktoren, die da reinspielen. Der Bot-Ping macht jedoch durchaus sinn, da dieser direkt geprüft werden kann
 - ToDos in der .template.js
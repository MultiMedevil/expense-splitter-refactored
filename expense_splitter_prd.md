# Expense Splitter - Product Requirement Document

## 1. Projektübersicht

### 1.1 Projektvision
Eine offline-fähige Web-Anwendung zur fairen Kostenaufteilung von Gruppenausgaben basierend auf individuellen Verbrauchsgewohnheiten und Ernährungspräferenzen.

### 1.2 Projektziele
- Automatisierte, faire Kostenaufteilung in Freundesgruppen
- Berücksichtigung individueller Präferenzen (vegetarisch, vegan, kein Alkohol, etc.)
- Offline-Funktionalität ohne Internetverbindung
- Einfache Bedienung auch für technische Laien
- OCR-basierte Kassenboneingabe zur Zeitersparnis

### 1.3 Zielgruppe
- Freundesgruppen im gemeinsamen Urlaub
- Wohngemeinschaften
- Vereine und kleinere Gruppen
- Primärer Anwender: Einzelperson, die die Abrechnung durchführt

### 1.4 Technische Anforderungen
- **Plattform:** Web-Anwendung (HTML/CSS/JavaScript)
- **Offline-Fähigkeit:** Vollständig ohne Internetverbindung nutzbar
- **Browser-Kompatibilität:** Moderne Desktop-Browser
- **Speicher:** Browser LocalStorage
- **Deployment:** Lokale Dateien, keine Server erforderlich

## 2. Funktionale Anforderungen

### 2.1 Projekt-/Reise-Verwaltung

#### 2.1.1 Reise erstellen
- **Beschreibung:** Nutzer kann neue Reise/Projekt anlegen
- **Input:** Reisename, optionales Startdatum
- **Output:** Neue Reise in der Übersicht
- **Validierung:** Reisename darf nicht leer sein

#### 2.1.2 Mehrere Reisen verwalten
- **Beschreibung:** Parallel mehrere Reiseprojekte verwalten
- **Funktionen:** Zwischen Reisen wechseln, Reisen löschen, Reisen duplizieren
- **Persistierung:** Alle Reisen in LocalStorage

#### 2.1.3 Datenexport/-import
- **Export:** JSON-Format für Backup-Zwecke
- **Import:** JSON-Dateien wieder einlesen
- **Validierung:** Importierte Daten auf Vollständigkeit prüfen

### 2.2 Benutzerverwaltung

#### 2.2.1 Benutzer anlegen
- **Input:** Name (Pflichtfeld)
- **Optional:** Avatar/Profilbild
- **Validierung:** Name darf nicht leer sein, keine Duplikate

#### 2.2.2 Tag-System
- **Vordefinierte Tags:**
  - Vegetarisch
  - Vegan
  - Kein Alkohol
  - Glutenfrei
  - Laktosefrei
- **Funktionalität:** Benutzer können mehrere Tags haben
- **Tag-Eigenschaften:** Binär (hat Tag / hat Tag nicht)
- **Erweiterbarkeit:** Eigene Tags erstellbar

#### 2.2.3 Benutzer bearbeiten/löschen
- **Bearbeiten:** Name und Tags ändern
- **Löschen:** Mit Warnung bei vorhandenen Ausgaben
- **Datenintegrität:** Überprüfung auf Abhängigkeiten

### 2.3 Kategorien-System

#### 2.3.1 Vordefinierte Kategorien
- **Neutral:** Für alle Benutzer (Benzin, Unterkunft, etc.)
- **Alkohol:** Ausgeschlossen für Tag "Kein Alkohol"
- **Fleisch:** Ausgeschlossen für Tags "Vegetarisch", "Vegan"
- **Milchprodukte:** Ausgeschlossen für Tags "Vegan", "Laktosefrei"
- **Gemüse/Obst:** Für alle verfügbar
- **Gluten:** Ausgeschlossen für Tag "Glutenfrei"

#### 2.3.2 Eigene Kategorien
- **Erstellung:** Name eingeben, Tags zuordnen die ausgeschlossen werden
- **Verwaltung:** Bearbeiten, löschen (mit Abhängigkeitsprüfung)
- **Validierung:** Kategoriename darf nicht leer oder doppelt sein

### 2.4 Ausgaben-Erfassung

#### 2.4.1 Manuelle Eingabe
- **Pflichtfelder:**
  - Ausgabenname (z.B. "REWE Einkauf", "Kino")
  - Gesamtbetrag
  - Bezahler (Dropdown mit Benutzern)
  - Kategorie
- **Optionale Felder:**
  - Datum (Standard: heute)
  - Beschreibung/Notizen
- **Validierung:** Betrag > 0, alle Pflichtfelder ausgefüllt

#### 2.4.2 OCR-basierte Eingabe
- **Unterstützte Formate:** JPG, PNG, PDF
- **Upload-Methoden:** Drag & Drop, Datei-Browser
- **OCR-Verarbeitung:**
  - Tesseract.js für Texterkennung
  - Extraktion: Produktname und Preis
  - Manuelle Nachbearbeitung möglich
- **Kategorisierung:** Jedes erkannte Produkt einer Kategorie zuordnen
- **Fehlerbehandlung:** OCR-Fehler durch manuelle Korrektur behebbar

#### 2.4.3 Ausgaben bearbeiten/löschen
- **Bearbeitung:** Alle Felder nachträglich änderbar
- **Löschung:** Mit Bestätigungsdialog
- **Auswirkungen:** Automatische Neuberechnung der Abrechnung

### 2.5 Abrechnungs-System

#### 2.5.1 Kostenverteilung
- **Neutrale Kosten:** Gleichmäßige Aufteilung auf alle Benutzer
- **Kategoriebasierte Kosten:** Nur Benutzer ohne ausschließende Tags zahlen
- **Rundung:** Mathematische Rundung auf 2 Nachkommastellen
- **Berechnung:** Echtzeit-Update bei Änderungen

#### 2.5.2 Übersichts-Modi
- **Vereinfacht:** "Person A schuldet Person B: X€"
- **Detailliert pro Person:** Aufschlüsselung aller anteiligen Kosten
- **Gesamtübersicht:** Alle Ausgaben und deren Verteilung
- **Kategoriefilter:** Anzeige nach bestimmten Kategorien

#### 2.5.3 Schulden-Optimierung
- **Darstellung:** Wer trägt welche Gesamtkosten (nicht: wer überweist an wen)
- **Transparenz:** Nachvollziehbare Aufschlüsselung pro Kategorie
- **Keine Transaktionen:** System führt keine Zahlungen durch

### 2.6 Export-Funktionalität

#### 2.6.1 PDF-Report
- **Inhalt:**
  - Reiseübersicht mit Teilnehmern
  - Alle Ausgaben chronologisch
  - Kostenverteilung pro Person
  - Kategorieaufschlüsselung
- **Format:** Professionell gestaltetes PDF mit Tabellen

#### 2.6.2 Excel-Export
- **Sheets:**
  - Ausgaben-Liste
  - Kostenverteilung
  - Benutzer und Tags
- **Format:** .xlsx mit berechneten Formeln

#### 2.6.3 JSON-Backup
- **Vollständiger Datenexport:** Alle Reisedaten
- **Verwendung:** Backup und Import in andere Instanzen

## 3. Non-Funktionale Anforderungen

### 3.1 Usability
- **Intuitive Bedienung:** Auch für Nicht-Techniker verständlich
- **Responsive Design:** Fokus auf Desktop, grundlegende Mobile-Unterstützung
- **Drag & Drop:** Einfacher Dateiupload für Kassenbons
- **Tastaturkürzel:** Für häufige Aktionen (Speichern, Neue Ausgabe)

### 3.2 Performance
- **Offline-Fähigkeit:** Vollständige Funktionalität ohne Internet
- **Lokaler Speicher:** Daten in Browser LocalStorage
- **OCR-Performance:** Kassenbon-Verarbeitung unter 10 Sekunden
- **Responsive UI:** Sofortige Reaktion auf Benutzereingaben

### 3.3 Zuverlässigkeit
- **Datenpersistierung:** Automatisches Speichern nach jeder Änderung
- **Fehlerbehandlung:** Graceful Degradation bei OCR-Fehlern
- **Datenvalidierung:** Eingabeprüfung vor Speicherung
- **Backup-Funktionalität:** Export/Import zur Datensicherung

### 3.4 Sicherheit
- **Datenschutz:** Keine Datenübertragung an Server
- **Lokale Verarbeitung:** Alle Berechnungen im Browser
- **Keine Authentifizierung:** Da rein lokale Anwendung

## 4. Technische Spezifikation

### 4.1 Frontend-Stack
- **Framework:** Vue.js 3 (CDN-Version)
- **Styling:** Moderne CSS3 mit Flexbox/Grid
- **Icons:** Font Awesome oder ähnliche Icon-Library
- **Responsive:** CSS Media Queries

### 4.2 JavaScript-Libraries
- **OCR:** Tesseract.js für Texterkennung
- **PDF-Export:** jsPDF für Report-Generierung
- **Excel-Export:** SheetJS für .xlsx-Dateien
- **File-Handling:** HTML5 File API

### 4.3 Datenstruktur
```javascript
// Beispiel LocalStorage Schema
{
  "trips": [
    {
      "id": "trip_1",
      "name": "Mallorca 2024",
      "startDate": "2024-08-01",
      "users": [
        {
          "id": "user_1",
          "name": "Max",
          "tags": ["vegetarisch", "kein_alkohol"]
        }
      ],
      "categories": [
        {
          "id": "cat_1",
          "name": "Fleisch",
          "excludedTags": ["vegetarisch", "vegan"]
        }
      ],
      "expenses": [
        {
          "id": "exp_1",
          "name": "REWE Einkauf",
          "date": "2024-08-02",
          "paidBy": "user_1",
          "items": [
            {
              "name": "Hackfleisch",
              "price": 4.99,
              "category": "cat_1"
            }
          ]
        }
      ]
    }
  ]
}
```

### 4.4 Projektstruktur
```
expense-splitter/
├── index.html              # Haupt-HTML-Datei
├── css/
│   ├── style.css          # Haupt-Stylesheet
│   └── components.css     # Component-spezifische Styles
├── js/
│   ├── app.js             # Vue.js Hauptanwendung
│   ├── data-manager.js    # LocalStorage Management
│   ├── calculator.js      # Abrechnungslogik
│   ├── ocr-handler.js     # OCR-Funktionalität
│   └── export-manager.js  # PDF/Excel Export
├── lib/                   # Externe Bibliotheken (CDN fallback)
└── assets/               # Icons, Bilder
```

## 5. User Stories

### 5.1 Epic: Grundsetup
- Als Nutzer möchte ich eine neue Reise erstellen können
- Als Nutzer möchte ich Freunde hinzufügen und deren Ernährungspräferenzen festlegen
- Als Nutzer möchte ich eigene Kategorien erstellen können

### 5.2 Epic: Ausgaben erfassen
- Als Nutzer möchte ich Ausgaben manuell eingeben können
- Als Nutzer möchte ich einen Kassenbon fotografieren und automatisch auswerten lassen
- Als Nutzer möchte ich OCR-Fehler nachträglich korrigieren können

### 5.3 Epic: Abrechnung
- Als Nutzer möchte ich sehen, welche Kosten jede Person trägt
- Als Nutzer möchte ich eine detaillierte Aufschlüsselung pro Person anzeigen
- Als Nutzer möchte ich die Abrechnung als PDF exportieren können

### 5.4 Epic: Datenverwaltung
- Als Nutzer möchte ich meine Daten als Backup exportieren können
- Als Nutzer möchte ich zwischen verschiedenen Reisen wechseln können
- Als Nutzer möchte ich Ausgaben nachträglich bearbeiten oder löschen können

## 6. Akzeptanzkriterien

### 6.1 Funktionale Tests
- [ ] Benutzer mit verschiedenen Tag-Kombinationen können erstellt werden
- [ ] Neutrale Ausgaben werden gleichmäßig auf alle Benutzer aufgeteilt
- [ ] Kategoriebasierte Ausgaben berücksichtigen Benutzer-Tags korrekt
- [ ] OCR erkennt Produktnamen und Preise aus Kassenbons
- [ ] PDF-Export enthält vollständige Abrechnungsdetails
- [ ] JSON-Export/-Import funktioniert ohne Datenverlust

### 6.2 Usability Tests
- [ ] Neue Benutzer können ohne Anleitung eine Grundabrechnung erstellen
- [ ] Kassenbon-Upload und -kategorisierung dauert < 5 Minuten
- [ ] Abrechnung ist für Laien nachvollziehbar dargestellt
- [ ] Fehlerhafte OCR-Ergebnisse können einfach korrigiert werden

### 6.3 Performance Tests
- [ ] Anwendung startet in < 3 Sekunden
- [ ] OCR-Verarbeitung dauert < 10 Sekunden pro Kassenbon
- [ ] UI reagiert sofort auf Benutzereingaben
- [ ] Daten werden automatisch nach jeder Änderung gespeichert

## 7. Risiken und Abhängigkeiten

### 7.1 Technische Risiken
- **OCR-Genauigkeit:** Kassenbons nicht perfekt erkennbar → Manuelle Nachbearbeitung als Fallback
- **Browser-Kompatibilität:** LocalStorage-Limits → Warnung bei großen Datenmengen
- **Performance:** Große Ausgaben-Listen → Pagination implementieren

### 7.2 Usability-Risiken
- **Komplexität:** Zu viele Features überfordern Nutzer → Stufenweise Feature-Einführung
- **OCR-Erwartungen:** Nutzer erwarten 100% Genauigkeit → Klare Kommunikation der Grenzen

## 8. Roadmap

### Phase 1: MVP (Minimum Viable Product)
- Grundlegende Benutzerverwaltung
- Manuelle Ausgaben-Eingabe
- Einfache Abrechnung
- PDF-Export

### Phase 2: OCR-Integration
- Kassenbon-Upload
- OCR-Verarbeitung
- Produktkategorisierung

### Phase 3: Erweiterte Features
- Excel-Export
- Erweiterte Berichte
- Multiple Reisen
- JSON-Import/Export

### Phase 4: Polish & Optimization
- UI/UX-Verbesserungen
- Performance-Optimierung
- Erweiterte Kategorien
- Mobile Optimierung

## 9. Definition of Done

Eine Funktion gilt als fertig, wenn:
- [ ] Funktionalität implementiert und getestet
- [ ] Code dokumentiert
- [ ] Responsive Design umgesetzt
- [ ] Fehlerbehandlung implementiert
- [ ] Benutzertests bestanden
- [ ] Performance-Anforderungen erfüllt
- [ ] Offline-Funktionalität sichergestellt
# Expense Splitter - Schritt-für-Schritt Entwicklungsanleitung

## Übersicht
Diese Anleitung führt dich durch die komplette Entwicklung der Expense Splitter Web-App mit Windsurf IDE. Die Entwicklung erfolgt in logischen Phasen, wobei jeder Schritt auf dem vorherigen aufbaut.

## Voraussetzungen
- Windsurf IDE installiert
- Moderner Browser (Chrome, Firefox, Safari, Edge)
- Grundverständnis für Dateien und Ordner
- Keine Programmierkenntnisse erforderlich

---

## Phase 1: Projekt Setup & Grundstruktur

### Schritt 1: Projektordner erstellen
1. Öffne Windsurf IDE
2. Erstelle einen neuen Ordner namens `expense-splitter`
3. Öffne diesen Ordner in Windsurf als Workspace

### Schritt 2: Grundlegende Projektstruktur anlegen
Erstelle folgende Ordnerstruktur:
```
expense-splitter/
├── index.html
├── css/
│   ├── style.css
│   └── components.css
├── js/
│   ├── app.js
│   ├── data-manager.js
│   └── calculator.js
├── lib/
└── assets/
    └── icons/
```

### Schritt 3: HTML-Grundgerüst erstellen
**Datei: `index.html`**
- Erstelle die Basis-HTML-Struktur
- Einbindung von Vue.js über CDN
- Meta-Tags für Responsive Design
- Grundlegende Seitenstruktur mit Navigation

### Schritt 4: CSS-Grundlayout
**Datei: `css/style.css`**
- Moderne CSS-Reset-Regeln
- Responsive Grid-Layout
- Grundfarben und Typography festlegen
- Mobile-First Approach

**Datei: `css/components.css`**
- Button-Styles
- Form-Styles
- Card-Layout für Listen
- Modal-Dialog Basis

### Schritt 5: Vue.js App initialisieren
**Datei: `js/app.js`**
- Vue-App Grundstruktur
- Routing zwischen verschiedenen Views
- Grundlegende State-Management
- Event-Handler Grundlagen

**Testen:** App sollte im Browser ladbar sein und "Hello World" anzeigen

---

## Phase 2: Benutzerverwaltung

### Schritt 6: Datenmanagement implementieren
**Datei: `js/data-manager.js`**
- LocalStorage Wrapper-Funktionen
- CRUD-Operationen für Benutzer
- Datenvalidierung
- Backup/Restore Funktionen

### Schritt 7: Benutzer-Interface erstellen
**HTML-Komponenten hinzufügen:**
- Benutzer-Liste Komponente
- Benutzer hinzufügen Modal
- Benutzer bearbeiten Form
- Tag-Management Interface

### Schritt 8: Tag-System implementieren
**Funktionalität:**
- Vordefinierte Tags (Vegetarisch, Vegan, etc.)
- Tag-Zuordnung zu Benutzern
- Multiple Tags pro Benutzer
- Tag-Validierung

### Schritt 9: Benutzer-CRUD Operationen
**Features implementieren:**
- Neuen Benutzer anlegen
- Benutzer bearbeiten
- Benutzer löschen (mit Warnung)
- Benutzer-Liste anzeigen

**Testen:** Benutzer können erstellt, bearbeitet und gelöscht werden

---

## Phase 3: Kategorien-System

### Schritt 10: Kategorien-Datenmodell
**Datei: `js/data-manager.js` erweitern**
- Kategorien-Datenstruktur
- Vordefinierte Kategorien laden
- Kategorie-Tag-Zuordnungen

### Schritt 11: Kategorien-Management UI
**Neue Komponenten:**
- Kategorien-Übersicht
- Neue Kategorie erstellen Modal
- Kategorie-Tag-Zuordnung Interface
- Kategorie bearbeiten/löschen

### Schritt 12: Kategorien-Logik implementieren
**Funktionen:**
- Welche Benutzer sind von Kategorie betroffen
- Kategorie-Validierung
- Standard-Kategorien vs. Custom-Kategorien

**Testen:** Kategorien können erstellt und Benutzern korrekt zugeordnet werden

---

## Phase 4: Ausgaben-Management (Manuell)

### Schritt 13: Ausgaben-Datenmodell
**Datei: `js/data-manager.js` erweitern**
- Ausgaben-Datenstruktur
- Ausgaben-CRUD Operationen
- Datums- und Währungsvalidierung

### Schritt 14: Manuelle Ausgaben-Eingabe UI
**Neue Komponenten:**
- Ausgaben-Liste Komponente
- "Neue Ausgabe" Modal
- Ausgaben-Detail-View
- Ausgaben bearbeiten/löschen

### Schritt 15: Ausgaben-Eingabe Logik
**Features:**
- Formular-Validierung
- Bezahler-Auswahl
- Kategorie-Zuordnung
- Datum/Zeit handling

**Testen:** Ausgaben können manuell eingegeben und verwaltet werden

---

## Phase 5: Grundlegende Abrechnung

### Schritt 16: Abrechnungs-Engine
**Datei: `js/calculator.js`**
- Kostenverteilung-Algorithmus
- Neutrale vs. kategoriebasierte Kosten
- Rundungslogik implementieren
- Echtzeit-Berechnung

### Schritt 17: Abrechnungs-UI erstellen
**Neue Komponenten:**
- Vereinfachte Übersicht ("Wer schuldet wem")
- Detailansicht pro Person
- Gesamtübersicht aller Ausgaben
- Kostenaufschlüsselung nach Kategorien

### Schritt 18: Abrechnungs-Display implementieren
**Features:**
- Responsive Tabellen
- Farbcodierung für verschiedene Kategorien
- Toggle zwischen verschiedenen Ansichten
- Sortier- und Filterfunktionen

**Testen:** Abrechnung zeigt korrekte Kostenverteilung basierend auf Tags

---

## Phase 6: PDF Export

### Schritt 19: jsPDF Integration
**Setup:**
- jsPDF Library über CDN einbinden
- PDF-Generator Grundfunktionen
- Template für Reise-Report

### Schritt 20: PDF-Export implementieren
**Datei: `js/export-manager.js` erstellen**
- PDF-Erstellung aus Abrechnungsdaten
- Formatierte Tabellen
- Professionelles Layout
- Download-Funktionalität

### Schritt 21: PDF-Export UI
**Features:**
- "PDF exportieren" Button
- Export-Optionen (Detailgrad auswählen)
- Fortschrittsanzeige
- Erfolgs-/Fehlermeldungen

**Testen:** PDF-Report wird korrekt generiert und heruntergeladen

---

## Phase 7: OCR-Integration

### Schritt 22: Tesseract.js Setup
**Library Integration:**
- Tesseract.js über CDN laden
- OCR-Worker konfigurieren
- Performance-Optimierung

### Schritt 23: Datei-Upload Interface
**Neue Komponenten:**
- Drag & Drop Zone
- Datei-Browser Integration
- Upload-Progress Indicator
- Unterstützte Formate-Validierung

### Schritt 24: OCR-Verarbeitung implementieren
**Datei: `js/ocr-handler.js` erstellen**
- Bild/PDF zu Text Konvertierung
- Produktname/Preis Extraktion
- Fehlerbehandlung
- Fortschrittsanzeige

### Schritt 25: OCR-Ergebnis Interface
**Komponenten:**
- OCR-Ergebnis Tabelle
- Manuelle Korrektur-Möglichkeiten
- Produktkategorisierung UI
- Batch-Kategorisierung

**Testen:** Kassenbons werden erkannt und können nachbearbeitet werden

---

## Phase 8: Erweiterte Features

### Schritt 26: Multiple Reisen Support
**Datenmodell erweitern:**
- Reise-Objekt als Container
- Reise-Switcher UI
- Import/Export pro Reise
- Reise-Archive Funktionalität

### Schritt 27: Excel-Export
**SheetJS Integration:**
- Library einbinden
- Excel-Generator implementieren
- Multiple Sheets (Ausgaben, Abrechnung, Benutzer)
- Formatierte Tabellen mit Formeln

### Schritt 28: JSON Backup-System
**Features:**
- Vollständiger Datenexport
- Import-Validierung
- Versions-Kompatibilität
- Merge-Funktionalität

**Testen:** Alle Export/Import-Funktionen arbeiten korrekt

---

## Phase 9: UI/UX Polish

### Schritt 29: Design-Verbesserungen
**CSS Updates:**
- Moderne Animationen und Übergänge
- Konsistente Farbschemata
- Bessere Typography
- Loading-States und Micro-Interactions

### Schritt 30: Responsive Design optimieren
**Mobile Optimierung:**
- Touch-freundliche Buttons
- Bessere Navigation auf kleinen Bildschirmen
- Optimierte Formulare
- Swipe-Gesten (optional)

### Schritt 31: Accessibility implementieren
**A11y Features:**
- Keyboard-Navigation
- Screen-Reader Support
- High-Contrast Mode
- Focus-Management

**Testen:** App funktioniert auf verschiedenen Geräten und ist zugänglich

---

## Phase 10: Testing & Deployment

### Schritt 32: Comprehensive Testing
**Test-Szenarien:**
- Verschiedene Benutzer-Tag-Kombinationen
- Edge Cases (leere Listen, große Zahlen)
- Browser-Kompatibilität
- Performance mit vielen Daten

### Schritt 33: Error Handling verbessern
**Robustheit:**
- Graceful Degradation bei Fehlern
- Benutzerfreundliche Fehlermeldungen
- Auto-Recovery Mechanismen
- Offline-Fallbacks

### Schritt 34: Dokumentation erstellen
**User Guide:**
- Schnellstart-Anleitung
- FAQ-Sektion
- Troubleshooting Guide
- Feature-Übersicht

### Schritt 35: Deployment vorbereiten
**Packaging:**
- Alle Dependencies prüfen
- Performance optimieren
- Zip-Package für Distribution
- Installation-Anleitung

---

## Debugging & Troubleshooting

### Häufige Probleme und Lösungen

#### Problem: Vue.js lädt nicht
**Lösung:**
- CDN-Links prüfen
- Browser-Konsole auf Fehler checken
- Internet-Verbindung testen

#### Problem: LocalStorage funktioniert nicht
**Lösung:**
- Browser-Einstellungen prüfen
- Private-Mode deaktivieren
- Storage-Quota checken

#### Problem: OCR erkennt nichts
**Lösung:**
- Bildqualität verbessern
- Unterstützte Formate prüfen
- Tesseract-Worker Status checken

#### Problem: PDF-Export schlägt fehl
**Lösung:**
- jsPDF Library-Version prüfen
- Datenformat validieren
- Browser-Kompatibilität testen

---

## Performance-Optimierung

### Tipps für bessere Performance

1. **Lazy Loading:** Nur benötigte Komponenten laden
2. **Debouncing:** Eingaben nicht bei jedem Keystroke verarbeiten
3. **Virtualisierung:** Große Listen virtuell rendern
4. **Caching:** OCR-Ergebnisse zwischenspeichern
5. **Compression:** Assets komprimieren

### Memory Management

- LocalStorage regelmäßig aufräumen
- Event-Listener korrekt entfernen
- OCR-Worker nach Gebrauch terminieren
- Große Dateien nach Verarbeitung aus Memory entfernen

---

## Wartung & Updates

### Regelmäßige Wartungsaufgaben

1. **Dependency Updates:** CDN-Links auf neueste Versionen prüfen
2. **Browser Testing:** Neue Browser-Versionen testen
3. **Performance Monitoring:** Loading-Zeiten überwachen
4. **User Feedback:** Feedback sammeln und umsetzen

### Feature-Erweiterungen

Mögliche zukünftige Features:
- Kamera-Integration für direkte Kassenbon-Fotos
- Cloud-Backup (optional)
- Multi-Language Support
- Erweiterte Statistiken
- Integration mit Banking-APIs

---

## Checkliste für Fertigstellung

### Funktionalität
- [ ] Alle Benutzer-CRUD Operationen funktionieren
- [ ] Kategorien können erstellt und zugeordnet werden
- [ ] Manuelle Ausgaben-Eingabe arbeitet korrekt
- [ ] OCR erkennt Kassenbons zuverlässig
- [ ] Abrechnung berücksichtigt alle Tags korrekt
- [ ] PDF-Export generiert vollständige Berichte
- [ ] Excel-Export funktioniert mit allen Daten
- [ ] JSON-Backup/Restore arbeitet fehlerfrei
- [ ] Multiple Reisen können verwaltet werden

### Qualität
- [ ] App läuft in allen modernen Browsern
- [ ] Responsive Design funktioniert auf verschiedenen Bildschirmgrößen
- [ ] Keine JavaScript-Fehler in Browser-Konsole
- [ ] Alle Formulare haben Validierung
- [ ] Loading-States sind implementiert
- [ ] Fehlermeldungen sind benutzerfreundlich

### Dokumentation
- [ ] README.md mit Installation-Anweisungen
- [ ] User-Guide für End-Benutzer
- [ ] Code ist kommentiert
- [ ] API-Dokumentation für Datenstrukturen

### Deployment
- [ ] Alle Files sind im Package enthalten
- [ ] No external dependencies außer CDNs
- [ ] Zip-File für einfache Distribution
- [ ] Installations-Test auf frischem System

---

## Fazit

Diese Anleitung führt dich systematisch durch die Entwicklung einer vollständigen Expense Splitter Anwendung. Jede Phase baut auf der vorherigen auf und kann einzeln getestet werden.

**Geschätzte Entwicklungszeit:** 40-60 Stunden
**Schwierigkeitsgrad:** Anfänger bis Fortgeschritten
**Endresultat:** Vollständig funktionsfähige Offline Web-App

Viel Erfolg bei der Entwicklung! 🚀
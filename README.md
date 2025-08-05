# Expense Splitter - Vue 3 Refactoring

Eine moderne, modulare Expense Splitter Anwendung, neu implementiert mit Vue 3, Vite und Pinia.

## 🚀 Features

- **Moderne Tech-Stack**: Vue 3, Vite, Pinia, Composition API
- **Modulare Architektur**: Klare Trennung von Concerns
- **Type Safety**: TypeScript-Unterstützung
- **Responsive Design**: Mobile-first Ansatz
- **Testing Ready**: Vitest für Unit-Tests
- **Modernes Styling**: CSS-Variablen und Utility-Klassen

## 📁 Projektstruktur

```
src/
├── components/           # Vue Komponenten
│   ├── common/          # Wiederverwendbare Komponenten
│   ├── layout/          # Layout-Komponenten
│   ├── users/           # Benutzerverwaltung
│   ├── expenses/        # Ausgabenverwaltung
│   ├── trips/           # Reisen & Events
│   └── settings/        # Einstellungen
├── stores/              # Pinia Stores
│   ├── users.js         # Benutzer-Store
│   ├── expenses.js      # Ausgaben-Store
│   └── calculator.js    # Berechnungs-Store
├── services/            # Services
│   ├── storage.service.js     # LocalStorage Service
│   ├── calculator.service.js  # Berechnungs-Logik
│   └── validation.service.js  # Validierungs-Logik
├── composables/         # Vue Composables
├── utils/              # Utility-Funktionen
├── styles/            # Globale Styles
└── types/             # TypeScript-Typen
```

## 🛠️ Entwicklung

### Voraussetzungen
- Node.js (v18+)
- npm oder yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Tests
```bash
npm run test
npm run test:ui
```

### Linting
```bash
npm run lint
npm run format
```

## 🏗️ Architektur

### State Management
- **Pinia Stores** für globale State-Verwaltung
- **Modular Stores** für Users, Expenses und Calculator
- **Reaktive Updates** bei Datenänderungen

### Komponenten-Design
- **Composition API** für bessere Lesbarkeit
- **Props & Events** für Komponenten-Kommunikation
- **Scoped Styles** für CSS-Isolation

### Services
- **StorageService**: LocalStorage-Interaktion
- **CalculatorService**: Business-Logik für Berechnungen
- **ValidationService**: Eingabevalidierung

## 📊 Refactoring-Status

### ✅ Phase 1: Setup & Basisstruktur
- [x] Vue 3 + Vite Setup
- [x] Pinia Store-Setup
- [x] Basis-Komponenten-Struktur
- [x] Development-Umgebung
- [x] Linting & Formatting

### 🔄 Phase 2: Komponenten-Extraktion
- [ ] Users-Komponenten vollständig
- [ ] Expenses-Komponenten vollständig
- [ ] Trips-Komponenten vollständig
- [ ] Modal-Komponenten
- [ ] Form-Komponenten

### 📋 Phase 3: Services & Store-Integration
- [ ] Calculator-Service vollständig
- [ ] Storage-Service vollständig
- [ ] Validation-Service
- [ ] Error-Handling

### 🧪 Phase 4: Testing
- [ ] Unit-Tests für Stores
- [ ] Komponenten-Tests
- [ ] Service-Tests
- [ ] E2E-Tests

### 🚀 Phase 5: Optimierung & Deployment
- [ ] Performance-Optimierung
- [ ] Bundle-Optimierung
- [ ] Deployment-Pipeline
- [ ] Dokumentation

## 🎯 Nächste Schritte

1. **Users-Komponenten** vollständig implementieren
2. **Expenses-Komponenten** erstellen
3. **Calculator-Logik** migrieren
4. **Testing-Infrastruktur** aufbauen
5. **Performance-Optimierung** durchführen

## 📝 Mitwirkung

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Commit deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

export const DDL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Karte (
  control_number TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  vehicle_registration_number TEXT,
  chassis_number TEXT,
  vehicle_model TEXT,
  inspection_expiry_date TEXT,
  case_type TEXT NOT NULL CHECK (case_type IN ('repair', 'inspection', 'sales')),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS Prescription (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  control_number TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_title TEXT NOT NULL,
  invoice_mode INTEGER NOT NULL DEFAULT 1 CHECK (invoice_mode IN (0, 1)),
  issuer_registration_number TEXT,
  issue_date TEXT NOT NULL,
  finalized_at TEXT,
  subtotal_amount INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL DEFAULT 0,
  rounding_rule TEXT NOT NULL DEFAULT 'ROUND' CHECK (rounding_rule IN ('ROUND', 'FLOOR', 'CEIL')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'cancelled')),
  FOREIGN KEY (control_number) REFERENCES Karte(control_number)
);

CREATE TABLE IF NOT EXISTS PrescriptionItem (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prescription_id INTEGER NOT NULL,
  line_no INTEGER NOT NULL,
  scope_label TEXT,
  task_or_part TEXT NOT NULL,
  remarks TEXT,
  unit_label TEXT,
  quantity REAL NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL DEFAULT 0,
  line_amount INTEGER NOT NULL DEFAULT 0,
  tax_rate_percent REAL NOT NULL,
  tax_class TEXT NOT NULL DEFAULT 'taxable' CHECK (tax_class IN ('taxable', 'non_taxable')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (prescription_id) REFERENCES Prescription(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StatutoryFee (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  control_number TEXT NOT NULL,
  fee_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  note TEXT,
  FOREIGN KEY (control_number) REFERENCES Karte(control_number) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SecondhandLedger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  control_number TEXT NOT NULL,
  prescription_id INTEGER NOT NULL,
  transaction_kind TEXT NOT NULL CHECK (transaction_kind IN ('inbound', 'outbound')),
  transaction_date TEXT NOT NULL,
  counterparty_name TEXT,
  vehicle_identification TEXT,
  amount INTEGER NOT NULL,
  legal_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (control_number) REFERENCES Karte(control_number),
  FOREIGN KEY (prescription_id) REFERENCES Prescription(id)
);

CREATE TABLE IF NOT EXISTS TaxConfiguration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  effective_from TEXT NOT NULL,
  tax_rate_percent REAL NOT NULL,
  rounding_rule TEXT NOT NULL DEFAULT 'ROUND' CHECK (rounding_rule IN ('ROUND', 'FLOOR', 'CEIL')),
  invoice_mode INTEGER NOT NULL DEFAULT 1 CHECK (invoice_mode IN (0, 1)),
  registration_number TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(effective_from, invoice_mode)
);

CREATE TABLE IF NOT EXISTS AppSetting (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

import pool from "./database-config"

// Create and fill tables
async function initializeTables() {
  try {
    await pool.query(queries.createOUTableQuery)
    console.log("OUs Table: Done")

    await pool.query(queries.createTeamsTableQuery)
    console.log("Teams Table: Done")

    await pool.query(queries.createUsersTableQuery)
    console.log("Users Table: Done")

    await pool.query(queries.createTrackingLogTableQuery)
    console.log("Tracking Log Table: Done")

    await pool.query(queries.createAdminsTableQuery)
    console.log("Admins Table: Done")

    await pool.query(queries.createSentEmailsTableQuery)
    console.log("Emails Table: Done")

    await pool.query(queries.addMyMailAsAdmin, [process.env.ADMIN_ACCESS_EMAIL])
    console.log("Self Access: Done")

    await pool.query(queries.addOUs)
    console.log("Add OUs: Done")

    await pool.query(queries.addTeams)
    console.log("Add Teams: Done")
  } catch (error) {
    console.error("Error initializing tables:", error)
  }
}

const queries = {
  createUsersTableQuery: `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name_first VARCHAR(255) NOT NULL,
        name_last VARCHAR(255) NOT NULL,
        team_id INTEGER NOT NULL,
        FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE
      );
    `,
  createTrackingLogTableQuery: `
      CREATE TABLE IF NOT EXISTS tracking_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        page VARCHAR(255) NOT NULL,
        message VARCHAR(255) NOT NULL,
        count INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `,
  createAdminsTableQuery: `
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        cookies VARCHAR(255)
      );
    `,
  createOUTableQuery: `
      CREATE TABLE IF NOT EXISTS ous (
        id SERIAL PRIMARY KEY,
        ou VARCHAR(255) NOT NULL UNIQUE
      );
    `,
  createTeamsTableQuery: `
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        ou_id INTEGER NOT NULL,
        team VARCHAR(255) NOT NULL UNIQUE,
        FOREIGN KEY (ou_id) REFERENCES ous (id) ON DELETE CASCADE
      );
    `,
  createSentEmailsTableQuery: `
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        template VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `,
  addMyMailAsAdmin: `
      INSERT INTO admins (email)
      VALUES ($1)
      ON CONFLICT (email) DO NOTHING;
    `,
  addOUs: `
      INSERT INTO ous (ou)
      VALUES 
      ('Siége'),
      ('CO2C'),
      ('UO CA'),
      ('UO LC'),
      ('UO LN'),
      ('UO LS')
      ON CONFLICT (ou) DO NOTHING;
    `,
  addTeams: `
  INSERT INTO teams (team, ou_id)
  VALUES
  ('DIRECTION EIC LORCA', (SELECT id FROM ous WHERE ou = 'Siége')),
  ('POLE CAPACITE PRODUCTION', (SELECT id FROM ous WHERE ou = 'Siége')),
  ('POLE DEVELOPPEMENT', (SELECT id FROM ous WHERE ou = 'Siége')),
  ('POLE PERFORMANCE', (SELECT id FROM ous WHERE ou = 'Siége')),
  ('POLE RH', (SELECT id FROM ous WHERE ou = 'Siége')),
  ('POLE SECURITE', (SELECT id FROM ous WHERE ou = 'Siége')),
  -- CO2C
  ('CELLULE OPERATIONNELLE GESTION DE CRISE', (SELECT id FROM ous WHERE ou = 'CO2C')),
  ('COGC CRC GUICHET OP TRANSPORTS EXCEPT', (SELECT id FROM ous WHERE ou = 'CO2C')),
  ('COGC REGULATEUR', (SELECT id FROM ous WHERE ou = 'CO2C')),
  ('DIRECTION CO2C', (SELECT id FROM ous WHERE ou = 'CO2C')),
  -- UO CA
  ('IN BAR LE DUC  ET REVIGNY', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN CHALONS EPERNAY', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN CHALONS LIGNE EXTERIEURE', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN CHARLEVILLE', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN DIR UO CHAMPAGNE ARDENNES', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN GIVET REVIN SEDAN', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN NOGENT-ROMILLY', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN REIMS EXTERIEUR', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN REIMS PAI', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN TROYES', (SELECT id FROM ous WHERE ou = 'UO CA')),
  ('IN VITRY ST DIZIER', (SELECT id FROM ous WHERE ou = 'UO CA')),
  -- UO LC
  ('IN CCR 1  PAGNY SUR MOSELLE', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN CCR 2 PAGNY SUR MOSELLE', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN CCR3', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN DIR UO LORRAINE CENTRE', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN JARVILLE CHAMPIGNEULLES', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN LEROUVILLE', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN PAGNY SUR MOSELLE LIGNE CLASSIQUE', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN PAI NANCY', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN PCD PAGNY SUR MOSELLE', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN PONT A MOUSSON  DIEULOUARD', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN REMILLY', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN THIONVILLE POSTE A', (SELECT id FROM ous WHERE ou = 'UO LC')),
  ('IN TOUL NEUFCHATEAU', (SELECT id FROM ous WHERE ou = 'UO LC')),
  -- UO LN
  ('IN APACH', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN CONFLANS VERDUN', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN CREUTZWALD', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN DIR UO LORRAINE NORD', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN FORBACH BENING', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN HAGONDANGE GANDRANGE', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN LONGUYON LONGWY', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN SARREGUEMINES', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN THIONVILLE PRCI', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN UCKANGE HAYANGE', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN WOIPPY PRS', (SELECT id FROM ous WHERE ou = 'UO LN')),
  ('IN WOIPPY TRIAGE', (SELECT id FROM ous WHERE ou = 'UO LN')),
  -- UO LS
  ('IN BLAINVILLE', (SELECT id FROM ous WHERE ou = 'UO LS')),
  ('IN CHALINDREY', (SELECT id FROM ous WHERE ou = 'UO LS')),
  ('IN CHAUMONT LANGRES', (SELECT id FROM ous WHERE ou = 'UO LS')),
  ('IN DIR UO LORRAINE SUD', (SELECT id FROM ous WHERE ou = 'UO LS')),
  ('IN EPINAL REMIREMONT', (SELECT id FROM ous WHERE ou = 'UO LS')),
  ('IN LIGNE 14', (SELECT id FROM ous WHERE ou = 'UO LS')),
  ('IN LUNEVILLE', (SELECT id FROM ous WHERE ou = 'UO LS')),
  ('IN SAINT DIE', (SELECT id FROM ous WHERE ou = 'UO LS')),
  ('IN VARANGEVILLE PONT ST VINCENT', (SELECT id FROM ous WHERE ou = 'UO LS'))
  ON CONFLICT (team) DO NOTHING;
    `,
}

initializeTables()

-- Sensor Calibration Portal Database Schema
-- PostgreSQL Database

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS report_measurements CASCADE;
DROP TABLE IF EXISTS calibration_reports CASCADE;
DROP TABLE IF EXISTS test_equipment CASCADE;
DROP TABLE IF EXISTS sensors CASCADE;
DROP TABLE IF EXISTS personnel CASCADE;

-- Personnel (Authors and Lab Unit members)
CREATE TABLE personnel (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    email VARCHAR(255),
    lab_unit VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensors
CREATE TABLE sensors (
    id SERIAL PRIMARY KEY,
    sensor_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    property_of TEXT,
    model VARCHAR(255),
    sensor_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Equipment
CREATE TABLE test_equipment (
    id SERIAL PRIMARY KEY,
    instrument VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    serial_number VARCHAR(100),
    notes TEXT,
    equipment_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calibration Reports
CREATE TABLE calibration_reports (
    id SERIAL PRIMARY KEY,
    report_number VARCHAR(100) UNIQUE,
    sensor_id INTEGER REFERENCES sensors(id) ON DELETE CASCADE,
    test_date DATE NOT NULL,
    created_by INTEGER REFERENCES personnel(id),
    status VARCHAR(50) DEFAULT 'draft',
    
    -- Page 1: Sensor Under Test (mostly from sensor table, but storing authors)
    authors TEXT[], -- Array of personnel IDs or names
    lab_unit VARCHAR(255),
    
    -- Page 2: Test Equipment Used
    equipment_ids INTEGER[], -- Array of test_equipment IDs used in this calibration
    equipment_details JSONB, -- Detailed equipment info with report-specific notes
    conductivity_testing_level TEXT DEFAULT '1',
    uncertainty TEXT DEFAULT 'Expanded Measurement Uncertainty (95% level of confidence; k = 2) for conductivity: 0.00033 S/m (Gerin and Savonitto, 2024).',
    
    -- Page 3: Sensor Calibration Sheet - As Received
    page3_test_date DATE,
    page3_ambient_temp DECIMAL(5,2),
    page3_ambient_temp_uncertainty DECIMAL(5,2),
    page3_relative_humidity DECIMAL(5,2),
    page3_relative_humidity_uncertainty DECIMAL(5,2),
    page3_atmospheric_pressure DECIMAL(6,2),
    page3_atmospheric_pressure_uncertainty DECIMAL(6,2),
    page3_as_received_g VARCHAR(50),
    page3_as_received_h VARCHAR(50),
    page3_as_received_i VARCHAR(50),
    page3_as_received_j VARCHAR(50),
    page3_as_received_cpcor VARCHAR(50),
    page3_as_received_ctcor VARCHAR(50),
    page3_formula_text TEXT DEFAULT 'f = Inst Freq [kHz]
t = ITS-90 Temperature [°C]; p = pressure [decibars] = 0; α = CTcor; β = CPcor
Conductivity = (g + hf² + if³ + jf⁴) / [10(1 + αt + βp)] [S/m]',
    page3_accuracy_note TEXT DEFAULT '§Accuracy declared by the Manufacturer = ±0.0003 S/m.',
    page3_table_legend TEXT DEFAULT 'where:
Inst Temp = the temperature (°C, ITS-90) of the seawater filling the bath as read by the instrument''s temperature sensor at the reference set-point conductivity;
Reference = the set-point conductivity (S/m) of the bath seawater, measured using the laboratory salinometer;
Inst Freq = the instrument output frequency (Hz) at the reference set-point conductivity;
Predicted = the bath set-point conductivity (S/m), as computed by the instrument using the new calibration coefficients;
Predicted-Reference = the conductivity residual (S/m), i.e. the difference between the "Predicted" and "Reference" set-point conductivities',
    
    -- Page 4: Sensor Calibration Sheet - New Coefficients
    page4_new_g VARCHAR(50),
    page4_new_h VARCHAR(50),
    page4_new_i VARCHAR(50),
    page4_new_j VARCHAR(50),
    page4_new_cpcor VARCHAR(50),
    page4_new_ctcor VARCHAR(50),
    page4_formula_text TEXT DEFAULT 'f = Inst Freq [kHz]
t = ITS-90 Temperature [°C]; p = pressure [decibars] = 0; α = CTcor; β = CPcor
Conductivity = (g + hf² + if³ + jf⁴) / [10(1 + αt + βp)] [S/m]',
    page4_accuracy_note TEXT DEFAULT '§Accuracy declared by the Manufacturer = ±0.0003 S/m.',
    page4_table_legend TEXT DEFAULT 'where:
Inst Temp = the temperature (°C, ITS-90) of the seawater filling the bath as read by the instrument''s temperature sensor at the reference set-point conductivity;
Reference = the set-point conductivity (S/m) of the bath seawater, measured using the laboratory salinometer;
Inst Freq = the instrument output frequency (Hz) at the reference set-point conductivity;
Predicted = the bath set-point conductivity (S/m), as computed by the instrument using the new calibration coefficients;
Predicted-Reference = the conductivity residual (S/m), i.e. the difference between the "Predicted" and "Reference" set-point conductivities',
    
    -- Page 5: Conclusions
    conclusions TEXT,
    "references" TEXT DEFAULT 'Gerin R. and Savonitto G. (2024). Uncertainty estimate associated with the measurement of ITS-90 temperature and conductivity at the Oceanographic Calibration and Metrology Center (CTMO) of OGS Rel. OGS 2024, Trieste, Italy, 7 pp.',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Measurement Data Tables (for Page 3 and Page 4)
CREATE TABLE report_measurements (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES calibration_reports(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL, -- 3 or 4
    row_order INTEGER NOT NULL, -- Order of rows in the table
    inst_temp DECIMAL(10,4),
    reference_conductivity DECIMAL(10,5),
    inst_freq DECIMAL(10,2),
    predicted_conductivity DECIMAL(10,5),
    residual DECIMAL(10,5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(report_id, page_number, row_order)
);

-- Indexes for better query performance
CREATE INDEX idx_sensors_serial ON sensors(serial_number);
CREATE INDEX idx_reports_sensor ON calibration_reports(sensor_id);
CREATE INDEX idx_reports_date ON calibration_reports(test_date);
CREATE INDEX idx_measurements_report ON report_measurements(report_id, page_number);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_personnel_updated_at BEFORE UPDATE ON personnel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sensors_updated_at BEFORE UPDATE ON sensors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_equipment_updated_at BEFORE UPDATE ON test_equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calibration_reports_updated_at BEFORE UPDATE ON calibration_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO personnel (name, role, email, lab_unit) VALUES
('Riccardo Gerin', 'Researcher', 'rgerin@ogs.it', 'Marine Calibrations & Metrology Unit'),
('Cinzia Comici', 'Researcher', 'ccomici@ogs.it', 'Marine Calibrations & Metrology Unit'),
('Gilda Savonitto', 'Technician', 'gsavonitto@ogs.it', 'Marine Calibrations & Metrology Unit'),
('Stefano Küchler', 'Researcher', 'skuchler@ogs.it', 'Marine Calibrations & Metrology Unit');

INSERT INTO sensors (sensor_name, serial_number, property_of, model, sensor_type) VALUES
('SBE 4 CTMO Conductivity Transfer Standard', '6227', 'Istituto Nazionale di Oceanografia e di Geofisica Sperimentale – OGS, Trieste', 'SBE 4', 'Conductivity');

INSERT INTO test_equipment (instrument, model, serial_number, notes, equipment_type) VALUES
('Seawater Calibration Bath', 'Fluke Hart Scientific 7052', 'C2A012', 'Calibration bath filled with 50 L of natural seawater, filtered (filter size/type: 0.45 µm/Millipore) and UV sterilized seawater', 'Bath'),
('Deep Ocean Standards Thermometer', 'SBE 35', '0084', 'Deep Ocean Standards Thermometer last calibrated on 30 August 2023 sub-range 11 (0.01°C - 29.7646 °C) of the International Temperature Scale of 1990 (ITS-90) using a Fluke 5901A-Q Triple Point of Water cell and a Fluke 5943 Gallium Melting Point cell', 'Thermometer'),
('Multi-Channel Counter', 'SBE 31', '3179135-0168', '', 'Counter'),
('Submersible Pump', 'SBE 5P', '05-11062', '', 'Pump'),
('Laboratory Salinometer', 'Guildline Autosal 8400B', '65744', 'When in use, the Laboratory Salinometer is standardized every 24 hours, using IAPSO Standard Seawater (Batch: P167)', 'Salinometer');

-- Migration: Add uncertainty fields for ambient conditions and footnotes
-- Run this script to add the new columns to existing database

-- Add Page 3 uncertainty fields
ALTER TABLE calibration_reports 
ADD COLUMN IF NOT EXISTS page3_ambient_temp_uncertainty DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS page3_relative_humidity_uncertainty DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS page3_atmospheric_pressure_uncertainty DECIMAL(6,2);

-- Add Page 4 test date and ambient conditions fields
ALTER TABLE calibration_reports
ADD COLUMN IF NOT EXISTS page4_test_date DATE,
ADD COLUMN IF NOT EXISTS page4_ambient_temp DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS page4_ambient_temp_uncertainty DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS page4_relative_humidity DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS page4_relative_humidity_uncertainty DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS page4_atmospheric_pressure DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS page4_atmospheric_pressure_uncertainty DECIMAL(6,2);

-- Add footnote fields for all pages
ALTER TABLE calibration_reports
ADD COLUMN IF NOT EXISTS page1_footnotes TEXT,
ADD COLUMN IF NOT EXISTS page2_footnotes TEXT,
ADD COLUMN IF NOT EXISTS page3_footnotes TEXT,
ADD COLUMN IF NOT EXISTS page4_footnotes TEXT,
ADD COLUMN IF NOT EXISTS page5_footnotes TEXT;

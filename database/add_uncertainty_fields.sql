-- Migration: Add uncertainty fields for ambient conditions
-- Run this script to add the new uncertainty columns to existing database

ALTER TABLE calibration_reports 
ADD COLUMN IF NOT EXISTS page3_ambient_temp_uncertainty DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS page3_relative_humidity_uncertainty DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS page3_atmospheric_pressure_uncertainty DECIMAL(6,2);

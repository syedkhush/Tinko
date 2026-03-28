-- SQL Schema for Tinko (Supabase)

-- 1. Careers Table
CREATE TABLE careers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  roadmap JSONB, -- Array of steps
  salary_start TEXT,
  salary_growth TEXT,
  risk_level TEXT,
  work_life_balance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Business Table
CREATE TABLE business (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  investment TEXT,
  profit_timeline TEXT,
  risk TEXT,
  steps JSONB, -- Array of steps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Farming Table
CREATE TABLE farming (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  investment TEXT,
  monthly_income TEXT,
  risks TEXT,
  govt_schemes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Applications Table (Apply Now System)
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 10th / 12th / degree / govt / abroad
  description TEXT,
  eligibility TEXT,
  apply_link TEXT,
  deadline DATE,
  difficulty_level TEXT, -- Easy / Moderate / Hard
  type TEXT, -- exam / course / job
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on applications" ON applications;
CREATE POLICY "Allow public read on applications" ON applications FOR SELECT USING (true);

-- Sample Data for Applications
INSERT INTO applications (title, category, description, eligibility, apply_link, deadline, difficulty_level, type) VALUES
('JEE Main 2026', '12th', 'National level engineering entrance exam for NITs, IIITs and GFTIs.', '12th Pass with PCM', 'https://jeemain.nta.nic.in/', '2026-04-15', 'Hard', 'exam'),
('NEET UG 2026', '12th', 'National Eligibility cum Entrance Test for medical courses in India.', '12th Pass with PCB', 'https://neet.nta.nic.in/', '2026-05-05', 'Hard', 'exam'),
('NDA (I) 2026', '12th', 'National Defence Academy entrance for Army, Navy and Air Force.', '12th Pass (Any stream for Army, PCM for Navy/AF)', 'https://upsc.gov.in/', '2026-06-10', 'Moderate', 'exam'),
('UPSC Civil Services', 'degree', 'India''s premier exam for IAS, IPS, and IFS services.', 'Any Graduate', 'https://upsconline.nic.in/', '2026-03-30', 'Hard', 'exam'),
('IELTS Academic', 'abroad', 'English language proficiency test for study abroad.', 'Valid Passport', 'https://www.ielts.org/', '2026-12-31', 'Moderate', 'exam'),
('SAT (Digital)', 'abroad', 'Standardized test for undergraduate admission in USA and other countries.', 'High School Student', 'https://satsuite.collegeboard.org/', '2026-10-01', 'Moderate', 'exam'),
('IISER Aptitude Test (IAT)', '12th', 'Entrance for BS-MS research programs at IISERs and IISc.', '12th Pass with Science', 'https://www.iiseradmission.in/', '2026-05-25', 'Hard', 'exam'),
('CAT 2026', 'degree', 'Common Admission Test for MBA in IIMs and top business schools.', 'Any Graduate (50%)', 'https://iimcat.ac.in/', '2026-09-20', 'Hard', 'exam'),
('Merchant Navy (IMU CET)', '12th', 'Entrance for maritime studies and career at sea.', '12th Pass with PCM (60%)', 'https://www.imu.edu.in/', '2026-05-20', 'Moderate', 'exam')
ON CONFLICT DO NOTHING;

-- 6. User Access Table
CREATE TABLE IF NOT EXISTS users_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  payment_id TEXT UNIQUE NOT NULL,
  order_id TEXT,
  access_granted BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE users_access ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read on users_access" ON users_access;
CREATE POLICY "Allow public read on users_access" ON users_access FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on users_access" ON users_access;
CREATE POLICY "Allow public insert on users_access" ON users_access FOR INSERT WITH CHECK (true);

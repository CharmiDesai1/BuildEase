CREATE TABLE Developer (
    developer_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password_hash NVARCHAR(MAX) NOT NULL,
);

INSERT INTO Developer (full_name, email, password_hash, remember_me)
VALUES ('Charmi Desai', 'charmidesai3112@gmail.com', HASHBYTES('SHA2_256', 'charmi3112'), 1);


DELETE FROM Developer;
DBCC CHECKIDENT ('Developer', RESEED, 0);

DELETE FROM Developer WHERE developer_id = 3;
DECLARE @maxId INT;
SELECT @maxId = ISNULL(MAX(developer_id), 0) FROM Developer;
DBCC CHECKIDENT ('Developer', RESEED, @maxId);

ALTER TABLE Developer
ADD mobile_number NVARCHAR(15);

UPDATE Developer
SET mobile_number = '8200867810'
WHERE developer_id = 1;

UPDATE Developer
SET mobile_number = '8200867952'
WHERE developer_id = 2;

SELECT * FROM Developer;

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password_hash NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

ALTER TABLE Users
ADD mobile_number NVARCHAR(15);

UPDATE Users
SET mobile_number = '8200867810'
WHERE user_id = 1;

UPDATE Users
SET mobile_number = '8200867952'
WHERE user_id = 2;

SELECT * FROM Users;

DROP TABLE Users;

SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'Ad Hoc Distributed Queries', 1;
RECONFIGURE;

SELECT servicename, service_account FROM sys.dm_server_services;

EXEC sp_who2;
DBCC INPUTBUFFER(66);
KILL 66;

EXEC sp_configure 'remote access', 1;
RECONFIGURE;

CREATE TABLE Properties (
    property_id INT IDENTITY(1,1) PRIMARY KEY,
    project_name VARCHAR(255),
    apartment_type VARCHAR(50),
    carpet_area VARCHAR(50),
    development_stage VARCHAR(50),
    image_url VARCHAR(500),
    brochure_file_name VARCHAR(255),
    brochure_file_data VARBINARY(MAX),
    floor_plan_file_name VARCHAR(255),
    floor_plan_file_data VARBINARY(MAX)
);

CREATE TABLE UserPropertyMapping (
    mapping_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    property_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (property_id) REFERENCES Properties(property_id)
);

INSERT INTO Properties (project_name, apartment_type, carpet_area, development_stage, image_url, 
    brochure_file_name, brochure_file_data, floor_plan_file_name, floor_plan_file_data)
VALUES (
    'A Shridhar Kaveri-sangam', '3BHK', '1,000 - 1,065 sq ft', 'Early Development Stage',
    'https://cdn.builder.io/api/v1/image/assets/TEMP/cd168df9fc9d8e92caadcbfc8fc2741793ec03a9f995b843c5e0e8dd5d92ffd7',
    'Shridhar_Brochure.pdf',
    (SELECT * FROM OPENROWSET(BULK 'C:\\Users\\Administrator\\Documents\\SQL Server Management Studio\\brochure1.pdf', SINGLE_BLOB) AS Brochure),
    'Shridhar_FloorPlan.pdf',
    (SELECT * FROM OPENROWSET(BULK 'C:\\Users\\Administrator\\Documents\\SQL Server Management Studio\\01_housing-Model.pdf', SINGLE_BLOB) AS FloorPlan)
);

INSERT INTO Properties (project_name, apartment_type, carpet_area, development_stage, image_url, 
    brochure_file_name, brochure_file_data, floor_plan_file_name, floor_plan_file_data)
VALUES (
    'A Shridhar Athens', '2BHK', '800 - 1000 sq ft', 'Last Development Stage',
    'https://cdn.builder.io/api/v1/image/assets/TEMP/6d2789ad3c40ba07384f6a8e95f0be524d4db48c867c46b8e4d61ae63edb2a06?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b',
    'Athens_Brochure.pdf',
    (SELECT * FROM OPENROWSET(BULK 'C:\\Users\\Administrator\\Documents\\SQL Server Management Studio\\brochure2.pdf', SINGLE_BLOB) AS Brochure),
    'Athens_FloorPlan.pdf',
    (SELECT * FROM OPENROWSET(BULK 'C:\\Users\\Administrator\\Documents\\SQL Server Management Studio\\02_housing-Model.pdf', SINGLE_BLOB) AS FloorPlan)
);

INSERT INTO Properties (project_name, apartment_type, carpet_area, development_stage, image_url, 
    brochure_file_name, brochure_file_data, floor_plan_file_name, floor_plan_file_data)
VALUES (
    'A Shridhar Vandemataram', '4BHK', '1100 - 1500 sq ft', 'Under Construction',
    'https://cdn.builder.io/api/v1/image/assets/TEMP/6d2789ad3c40ba07384f6a8e95f0be524d4db48c867c46b8e4d61ae63edb2a06?placeholderIfAbsent=true&apiKey=159365e216d040bfb41dcf7dfa9bbf0b',
    'Vande_Brochure.pdf',
    (SELECT * FROM OPENROWSET(BULK 'C:\\Users\\Administrator\\Documents\\SQL Server Management Studio\\brochure3.pdf', SINGLE_BLOB) AS Brochure),
    'Vande_FloorPlan.pdf',
    (SELECT * FROM OPENROWSET(BULK 'C:\\Users\\Administrator\\Documents\\SQL Server Management Studio\\03_housing-Model.pdf', SINGLE_BLOB) AS FloorPlan)
);

UPDATE Properties 
SET image_url = 'https://cdn.builder.io/api/v1/image/assets/TEMP/cd168df9fc9d8e92caadcbfc8fc2741793ec03a9f995b843c5e0e8dd5d92ffd7'
WHERE property_id = 3;

DECLARE @propertyId INT;
SET @propertyId = (SELECT property_id FROM Properties WHERE project_name = 'A Shridhar Kaveri-sangam' AND apartment_type = '3BHK');

INSERT INTO UserPropertyMapping (user_id, property_id) VALUES (2, @propertyId);
INSERT INTO UserPropertyMapping (user_id, property_id) VALUES (3, @propertyId);

CREATE TABLE PropertySuggestions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    property_id INT NOT NULL,
    user_id INT NULL,
    suggestion_text NVARCHAR(MAX) NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    FOREIGN KEY (property_id) REFERENCES Properties(property_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE NO ACTION
);

ALTER TABLE PropertySuggestions
ADD created_at DATETIME DEFAULT GETDATE();

ALTER TABLE PropertySuggestions
ADD voted_users NVARCHAR(MAX) DEFAULT '[]';

ALTER TABLE PropertySuggestions 
ADD created_at DATETIME NULL;

UPDATE PropertySuggestions
SET created_at = GETDATE()
WHERE created_at IS NULL;

DELETE FROM PropertySuggestions WHERE id = 3;
DECLARE @maxId INT;
SELECT @maxId = ISNULL(MAX(id), 0) FROM PropertySuggestions;
DBCC CHECKIDENT ('PropertySuggestions', RESEED, @maxId);

INSERT INTO PropertySuggestions (property_id, user_id, suggestion_text) VALUES (
		1, 2, 'Design a kitchen with windows for air circulation.');

INSERT INTO PropertySuggestions (property_id, user_id, suggestion_text) VALUES (
		1, 3, 'Including a dedicated dog park.');

SELECT 
    ps.id,
    ps.suggestion_text AS suggestion,
    ps.likes,
    ps.dislikes,
    u.full_name AS submitter
FROM PropertySuggestions ps
LEFT JOIN Users u ON ps.user_id = u.user_id
WHERE ps.property_id = 1;  -- Replace 1 with actual property_id you are testing

ALTER TABLE PropertySuggestions ADD voted_users NVARCHAR(MAX) DEFAULT '[]';

ALTER TABLE PropertySuggestions
ADD status NVARCHAR(50) DEFAULT 'No action taken';

UPDATE PropertySuggestions
SET status = 'No action taken'
WHERE status IS NULL;

ALTER TABLE Properties 
ADD annotated_floor_plan_file_name VARCHAR(255), 
    annotated_floor_plan_file_data VARBINARY(MAX);

ALTER TABLE Properties 
DROP COLUMN annotated_floor_plan_file_name, annotated_floor_plan_file_data;

ALTER TABLE Properties 
ADD developer_id INT;

ALTER TABLE Properties 
ADD CONSTRAINT FK_Properties_Developer FOREIGN KEY (developer_id) 
REFERENCES Developer(developer_id);

UPDATE Properties 
SET developer_id = 1 
WHERE property_id = 3;

CREATE TABLE Annotations (
    annotation_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    property_id INT,
    annotated_file_name VARCHAR(255),
    annotated_file_data VARBINARY(MAX),
    annotation_timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (property_id) REFERENCES Properties(property_id)
);

select * from Annotations;

SELECT annotated_floor_plan_file_name, 
       DATALENGTH(annotated_floor_plan_file_data) AS file_size 
FROM Properties 
WHERE property_id = 1;

SELECT 
    a.annotation_id, 
    a.user_id, 
    u.full_name, 
    a.property_id, 
    a.annotated_file_name, 
    a.annotated_file_data, 
    a.annotation_timestamp
FROM annotations a
JOIN users u ON a.user_id = u.user_id;

CREATE TABLE PropertyConstructionStatus (
    id INT IDENTITY(1,1) PRIMARY KEY, property_id INT NOT NULL, planning_permit_date DATE NULL, site_preparation_date DATE NULL, structural_utility_date DATE NULL,
    interior_exterior_date DATE NULL, possession_handover_date DATE NULL,
    planning_permit_status AS (CASE WHEN planning_permit_date <= GETDATE() THEN 'Completed' ELSE 'Pending' END),
    site_preparation_status AS (CASE WHEN site_preparation_date <= GETDATE() THEN 'Completed' ELSE 'Pending' END),
    structural_utility_status AS (CASE WHEN structural_utility_date <= GETDATE() THEN 'Completed' ELSE 'Pending' END),
    interior_exterior_status AS (CASE WHEN interior_exterior_date <= GETDATE() THEN 'Completed' ELSE 'Pending' END),
    possession_handover_status AS (CASE WHEN possession_handover_date <= GETDATE() THEN 'Completed' ELSE 'Pending' END),
    FOREIGN KEY (property_id) REFERENCES Properties(property_id) ON DELETE CASCADE
);

INSERT INTO PropertyConstructionStatus (property_id, planning_permit_date, site_preparation_date, structural_utility_date, interior_exterior_date, possession_handover_date)
VALUES 
(1, '2025-01-15', '2025-03-01', '2025-06-10', '2025-09-20', '2025-12-05');

select * from PropertyConstructionStatus;
SELECT * FROM UserPropertyMapping WHERE user_id = 2;
SELECT * FROM Properties WHERE property_id = 1

SELECT property_id FROM Properties WHERE LOWER(project_name) = LOWER('A Shridhar Kaveri-sangam');
SELECT image_path FROM WarrantyClaim;
DROP TABLE WarrantyClaim;

CREATE TABLE WarrantyClaim (
    id INT PRIMARY KEY IDENTITY(1,1), user_id INT NOT NULL, developer_id INT NOT NULL, property_id INT NOT NULL, category VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, 
	description TEXT NOT NULL, image_path VARCHAR(500) NOT NULL, date_of_possession DATE NOT NULL, resolution_type VARCHAR(255) NOT NULL, other_resolution VARCHAR(255) DEFAULT NULL, 
	submitted_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (developer_id) REFERENCES Developer(developer_id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES Properties(property_id) ON DELETE CASCADE
);

ALTER TABLE WarrantyClaim
ADD approval_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE WarrantyClaim ALTER COLUMN approval_status VARCHAR(255);

USE Developers;
SELECT * FROM Properties;
SELECT * FROM Developer;
SELECT * FROM Users;
SELECT * FROM UserPropertyMapping;
SELECT * FROM PropertySuggestions;
SELECT * FROM PropertyConstructionStatus;
SELECT * FROM Annotations;
SELECT * FROM WarrantyClaim;

SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE' 
AND TABLE_CATALOG = 'Developers';
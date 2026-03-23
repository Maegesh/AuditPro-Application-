create DATABASE Audit_System_db



-- Departments table
CREATE TABLE Departments(
    DepartmentId INT IDENTITY PRIMARY KEY,
    DepartmentName NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL
);

-- Users Table
CREATE TABLE Users(
    UserId INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    Password NVARCHAR(100) NOT NULL,
    Role NVARCHAR(50) NOT NULL,
    DepartmentId INT,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    IsDeleted BIT DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId)
);

-- Audit Table
CREATE TABLE Audits(
    AuditId INT IDENTITY PRIMARY KEY,
    AuditCode NVARCHAR(50),
    AuditName NVARCHAR(200) NOT NULL,
    DepartmentId INT NOT NULL,
    AuditorId INT NOT NULL,
    CreatedByUserId INT,
    StartDate DATE,
    EndDate DATE,
    Status NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    IsDeleted BIT DEFAULT 0,
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    FOREIGN KEY (AuditorId) REFERENCES Users(UserId),
    FOREIGN KEY (CreatedByUserId) REFERENCES Users(UserId)
);

-- Observations table
CREATE TABLE Observations(
    ObservationId INT IDENTITY PRIMARY KEY,
    AuditId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Severity NVARCHAR(50),
    DueDate DATE,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    IsDeleted BIT DEFAULT 0,
    FOREIGN KEY (AuditId) REFERENCES Audits(AuditId)
);

-- corrective actions table
CREATE TABLE CorrectiveActions(
    ActionId INT IDENTITY PRIMARY KEY,
    ObservationId INT NOT NULL,
    AssignedToUserId INT,
    ActionDescription NVARCHAR(MAX),
    DueDate DATE,
    Status NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    IsDeleted BIT DEFAULT 0,
    FOREIGN KEY (ObservationId) REFERENCES Observations(ObservationId),
    FOREIGN KEY (AssignedToUserId) REFERENCES Users(UserId)
);
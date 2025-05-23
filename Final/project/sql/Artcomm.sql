-- DROP DATABASE artcomm;
CREATE DATABASE IF NOT EXISTS artcomm;
USE artcomm;

CREATE TABLE IF NOT EXISTS Admin(
	AdminID CHAR(13) NOT NULL,
    AdminGmail VARCHAR(100) NOT NULL,
    AMFirstname VARCHAR(30) NOT NULL,
    AMLastname VARCHAR(30) NOT NULL,
    PRIMARY KEY(AdminID)
);

CREATE TABLE IF NOT EXISTS Adminlogin(
	Username CHAR(50) NOT NULL,
    Password VARCHAR(50) NOT NULL,
    LAdminID CHAR(13),
    PRIMARY KEY (Username),
    FOREIGN KEY(LAdminID) REFERENCES Admin(AdminID)
);

CREATE TABLE IF NOT EXISTS Category(
	CID CHAR(13) NOT NULL,
    C_Name VARCHAR(30) NOT NULL,
    PRIMARY KEY(CID)
);

CREATE TABLE IF NOT EXISTS Search_log(
	LogID CHAR(13) NOT NULL,
    SCID CHAR(13) NOT NULL,
    Title VARCHAR(100) NOT NULL,
    PRIMARY KEY(LogID),
    FOREIGN KEY(SCID) REFERENCES Category(CID)
);

CREATE TABLE IF NOT EXISTS Organize(
	OCID CHAR(13) NOT NULL,
    OAdminID CHAR(13) NOT NULL,
    PRIMARY KEY(OCID,OAdminID),
    FOREIGN KEY(OCID) REFERENCES Category(CID),
    FOREIGN KEY(OAdminID) REFERENCES Admin(AdminID)
);

CREATE TABLE IF NOT EXISTS Artist(
	ArtistID CHAR(13) NOT NULL,
    ArtistName VARCHAR(30) NOT NULL,
    ArtistLanguage VARCHAR(100) NOT NULL,
    ArtistCountry VARCHAR(100) NOT NULL,
    ACID CHAR(13) NOT NULL,
    BasePrice DECIMAL(10,2) ,
    Status VARCHAR(30) NOT NULL,
    AAdminID CHAR(13),
    ALogID CHAR(13) ,
    PRIMARY KEY(ArtistID),
    FOREIGN KEY(ACID) REFERENCES Category(CID),
    FOREIGN KEY(AAdminID) REFERENCES Admin(AdminID),
    FOREIGN KEY(ALogID) REFERENCES Search_log(LogID)
);
ALTER TABLE Artist
ADD COLUMN AboutMe TEXT DEFAULT NULL;
ALTER TABLE Artist ADD COLUMN PhotoPath VARCHAR(255);


USE artcomm;
INSERT INTO Admin(AdminID, AdminGmail, AMFirstname, AMLastname) VALUES
    ('ADM000000001', 'Francis.admin@gmail.com', 'Jiaxian', 'Chen'),
    ('ADM000000002', 'Thanaporn.admin@gmail.com', 'Thanaporn', 'Artidtayamontol'),
    ('ADM000000003', 'Rawisara.admin@gmail.com', 'Rawisara', 'Chantravutikorn'),
    ('ADM000000004', 'Teerada.admin@gmail.com', 'Teerada', 'Chatrattanawuth'),
    ('ADM000000005', 'Nichakorn.admin@gmail.com', 'Nichakorn', 'Wisalkamol');

INSERT INTO Adminlogin(Username, Password, LAdminID) VALUES
    ('Francis_admin', 'passAlice123', 'ADM000000001'),
    ('Thanaporn_admin', 'secureBob456', 'ADM000000002'),
    ('Rawisara_admin', 'carla789!', 'ADM000000003'),
    ('Teerada_admin', 'davidKey321', 'ADM000000004'),
    ('Nichakorn_admin', 'emmapwd456', 'ADM000000005');

INSERT INTO Category(CID, C_Name) VALUES
    ('CAT000000001', 'Anime Style'),
    ('CAT000000002', 'Realism'),
    ('CAT000000003', 'Cartoon'),
    ('CAT000000004', 'Pixel Art'),
    ('CAT000000005', 'Chibi');

INSERT INTO Search_log(LogID, SCID, Title) VALUES
    ('LOG000000001', 'CAT000000001', 'Anime Art'),
    ('LOG000000002', 'CAT000000002', 'Realistic Cartoon'),
    ('LOG000000003', 'CAT000000003', 'Cartoon-style icon'),
    ('LOG000000004', 'CAT000000004', 'Pixel Game Asset'),
    
    ('LOG000000005', 'CAT000000005', 'Cute Chibi'),
    ('LOG000000006', 'CAT000000001', 'Anime Style Character Design'),
    ('LOG000000007', 'CAT000000002', 'Realism'),
    ('LOG000000008', 'CAT000000003', 'Cartoon'),
    ('LOG000000009', 'CAT000000004', 'Background'),
    ('LOG000000010', 'CAT000000005', 'Chibi');

INSERT INTO Organize(OCID, OAdminID) VALUES
    ('CAT000000001', 'ADM000000001'),
    ('CAT000000002', 'ADM000000002'),
    ('CAT000000003', 'ADM000000003'),
    ('CAT000000004', 'ADM000000004'),
    ('CAT000000005', 'ADM000000005');

INSERT INTO Artist(ArtistID, ArtistName, ArtistLanguage, ArtistCountry, ACID, BasePrice, Status, AAdminID, ALogID,AboutMe) VALUES
    ('ART000000001', 'LunaDraws', 'English', 'USA', 'CAT000000001', 30.00, 'Available', 'ADM000000001', 'LOG000000001','test'),
    ('ART000000002', 'PixelPete', 'Japanese', 'Japan', 'CAT000000004', 45.00, 'Unavailable', 'ADM000000004', 'LOG000000004','test2'),
    ('ART000000003', 'RealAmy', 'Spanish', 'Spain', 'CAT000000002', 70.00, 'Available', 'ADM000000002', 'LOG000000002','test3'),
    ('ART000000004', 'ChibiChan', 'Korean', 'South Korea', 'CAT000000005', 25.00, 'Available', 'ADM000000005', 'LOG000000005','test4'),
    ('ART000000005', 'ToonMaster', 'English', 'UK', 'CAT000000003', 35.00, 'Available', 'ADM000000003', 'LOG000000003','test5'),
    ('ART000000006', 'SkylineArt', 'English', 'Canada', 'CAT000000001', 60.00, 'Unavailable', 'ADM000000001', 'LOG000000006','test6'),
    ('ART000000007', 'CyberInk', 'English', 'Germany', 'CAT000000002', 55.00, 'Available', 'ADM000000002', 'LOG000000007','test7'),
    ('ART000000008', 'FaceCrafter', 'French', 'France', 'CAT000000003', 40.00, 'Unavailable', 'ADM000000003', 'LOG000000008','test8'),
    ('ART000000009', 'SceneQueen', 'English', 'USA', 'CAT000000004', 50.00, 'Available', 'ADM000000004', 'LOG000000009','test9'),
    ('ART000000010', 'MysticMuse', 'English', 'Australia', 'CAT000000005', 80.00, 'Available', 'ADM000000005', 'LOG000000010','test10');

-- INSERT INTO Artist_Skills(Skill, SArtistID) VALUES
--     ('Lineart', 'ART000000001'),
--     ('Coloring', 'ART000000001'),
--     ('Pixel Design', 'ART000000002'),
--     ('Environment', 'ART000000006'),
--     ('Sketching', 'ART000000003'),
--     ('Anatomy', 'ART000000003'),
--     ('Chibi', 'ART000000004'),
--     ('Comics', 'ART000000005'),
--     ('Pixel Art', 'ART000000009'),
--     ('Chibi', 'ART000000010'),
--     ('Realism Themes', 'ART000000007'),
--     ('Cartoons', 'ART000000008'),
--     ('Anime Style Design', 'ART000000006'),
--     ('Game Art', 'ART000000002'),
--     ('Expression Drawing', 'ART000000004');



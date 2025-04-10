\c postgres;
DROP DATABASE IF EXISTS bank;
CREATE DATABASE bank;
\c bank;
CREATE TABLE Client(
    numCompte varchar(11) NOT NULL PRIMARY KEY,
    nom varchar(200) NOT NULL,
    solde real DEFAULT 0.0
);

CREATE VIEW Client_Status AS
SELECT  
        numCompte,
        nom, 
        solde,
        CASE 
            WHEN solde < 1000 THEN 'insuffisant'
            WHEN ( solde BETWEEN 1000 AND 5000 ) THEN 'moyen'
            ELSE 'eleve' 
        END AS obs
FROM Client ;


CREATE VIEW Constat_minmax AS
SELECT 
    (SELECT nom FROM Client WHERE solde = (SELECT MIN(solde) FROM Client)) AS nom_min,
    (SELECT MIN(solde) FROM Client) AS solde_min,
    (SELECT nom FROM Client WHERE solde = (SELECT MAX(solde) FROM Client)) AS nom_max,
    (SELECT MAX(solde) FROM Client) AS solde_max;

INSERT INTO Client( 
    numCompte, 
    nom,
    solde 
) VALUES(
    '88630419553',
    'SOLOFO',
    2000
),
(
    '04961530808',
    'DODA',
    -2500.0
),
(
    '32537814118',
    'KOTO',
    51000.0
);

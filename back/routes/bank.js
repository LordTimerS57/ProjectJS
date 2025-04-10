const express = require('express');
const router = express.Router();
const connexion = require('../connectDb');

// Read (data)
router.get('/', async(req, res) => {
        const result = await connexion.query("SELECT * FROM Client_Status ORDER BY nom") ;
        result.rows = result.rows.map((row) => { 
            row.obs = (row.obs === 'eleve') ? 'élevé' : row.obs;
            return row
        } )
        const totalSolde = result.rows.reduce((acc,row) => acc + row.solde, 0);
        if(totalSolde === 0){
            res.json({
                undefinedValues : true
            })
        }
        else{
            const soldeConst = await connexion.query("SELECT * FROM Constat_minmax");
            const SpecificClientConst = await connexion.query("SELECT * FROM Specific_Client"); 
            res.json({
                undefinedValues : false,
                clients: result.rows,
                soldeInstance: soldeConst.rows,
                SpecificClients: SpecificClientConst.rows,
                totalSolde
            });
        }
});


// Create
router.post('/add', async(req, res) => {
    try {
        const { numcompte, nom, solde } = req.body;
        console.log(req.body);
        const result = await connexion.query("INSERT INTO Client( numcompte, nom, solde ) VALUES ($1, $2, $3)" , [ numcompte, nom, solde ]);
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du client." });
    }
});

// Delete
router.delete('/delete/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await connexion.query("DELETE FROM Client WHERE numcompte = $1",[id]);
        res.json({ message: "Suppression du client avec succès." });
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: "Erreur lors de la suppression du client." });
    }
});

// Update
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, solde } = req.body;

        if (!id || !nom || !solde) {
            return res.status(400).json({ error: "L'ID, le nom et le solde sont requis." });
        }

        const result = await connexion.query(
            "UPDATE Client SET nom = $1, solde = $2 WHERE numcompte = $3",
            [nom, solde, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Client non trouvé." });
        }

        console.log({
            numcompte : id,
            nom: nom,
            solde: solde
        })

        res.json({ message: "Client mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du client." });
    }
});

module.exports = router;
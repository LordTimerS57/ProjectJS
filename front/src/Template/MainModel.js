import { useEffect , useRef , useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Add, Edit, Delete } from './APIClient';

//  Structure d'intérieur
//  Ajout 
function CreateClient({ numcompte, setNumcompte, nom, setNom, solde, setSolde }) {
    return (
        <form>
            <div>
                <label>Numéro de compte :</label> 
                <input type='text' value={numcompte} onChange={(e) => setNumcompte(e.target.value)} />
            </div>
            <div>
                <label>Nom :</label> 
                <input type='text' value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
            <div>
                <label>Solde :</label> 
                <input type='text' value={solde} onChange={(e) => setSolde(e.target.value)} />
            </div>
        </form>
    );
}

//   Modification
function EditClient({ numcompte, setNumcompte, nom, setNom, solde, setSolde, client }) {  
  return (
    <form>
      <div>
        <label>Numéro de compte : </label> 
        <input 
          type='text' 
          value={numcompte} 
          placeholder={client?.numcompte} 
          readOnly 
          onChange={(e) => setNumcompte(e.target.value)}
        />
      </div>
      <div>
        <label>Nom : </label> 
        <input 
          type='text' 
          value={nom} 
          placeholder={client?.nom} 
          onChange={(e) => setNom(e.target.value)} // Prend placeholder si vide
        />
      </div>
      <div>
        <label>Solde : </label> 
        <input 
          type='text' 
          value={solde} 
          placeholder={client?.solde} 
          onChange={(e) => setSolde(e.target.value)} // Prend placeholder si vide
        />
      </div>
    </form>
  );
}

// Structure pour la suppression du client
function DeleteClient({numcompte , onRefresh}){
    const handleSubmit = async () => {
      if( Delete(numcompte) ){
        onRefresh();
      }
    };

    return(
      <button onClick={handleSubmit}>Supprimer</button>
    )
}

//  Structure de la fenêtre
//  Ajout
function ModalAdd({ isOpen, handleClose, onRefresh }) {
    const dialogRef = useRef(null);
    const [numcompte, setNumcompte] = useState('');
    const [nom, setNom] = useState('');
    const [solde, setSolde] = useState('');

    const handleSubmit = async () => {
        if (!numcompte || !nom || !solde) {
            alert("Veuillez remplir tous les champs");
            return;
        }
        if( Add(numcompte, nom, solde) ){
          handleClose();
          onRefresh();
        }
    };

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog) {
            if (isOpen && !dialog.open) {
                dialog.showModal();
            } else {
                dialog.close();
            }
        }
    }, [isOpen]);

    return (
        <dialog ref={dialogRef} onClose={handleClose}>
            <header>
                <h1>Ajouter un Client</h1> 
            </header>
            <main>
                <CreateClient 
                    numcompte={numcompte} setNumcompte={setNumcompte} 
                    nom={nom} setNom={setNom} 
                    solde={solde} setSolde={setSolde} 
                />
            </main>
            <footer>
                <button onClick={handleSubmit}>Add</button>
                <button type="button" onClick={handleClose}>Close</button>
            </footer>
        </dialog>
    );
}

//  Modification
function ModalEdit({ isOpen, handleClose, client , onRefresh}) {
  const dialogRef = useRef(null);
  const [numcompte, setNumcompte] = useState('');
  const [nom, setNom] = useState('');
  const [solde, setSolde] = useState('');

  useEffect(() => {
      if (client) {
          setNumcompte(client.numcompte || '');
          setNom(client.nom || '');
          setSolde(client.solde || '');
      }
  }, [client]); 

  const handleSubmit = async () => {
    if (!client?.numcompte) {
        alert("Erreur : ID du compte manquant !");
        return;
    }

    // Vérification des champs et fallback sur la valeur existante
    const updatedNom = nom.trim() !== '' ? nom : client.nom;
    const updatedSolde = solde !== null ? solde : client.solde;

    // Vérification finale
    if (!updatedNom || !updatedSolde) {
        alert("Erreur : Le nom et le solde sont requis !");
        return;
    }

    const success = await Edit(client.numcompte, updatedNom, updatedSolde);
    if (success) { 
      handleClose();
      onRefresh();
    }
};

  useEffect(() => {
      const dialog = dialogRef.current;
      if (dialog) {
          if (isOpen && !dialog.open) {
              dialog.showModal();
          } else {
              dialog.close();
          }
      }
  }, [isOpen]);

  return (
      <dialog ref={dialogRef} onClose={handleClose}>
          <header>
              <h2>Modifier le client</h2>
          </header>
          <main>
              <EditClient
                  numcompte={numcompte} setNumcompte={setNumcompte}
                  nom={nom} setNom={setNom}
                  solde={solde} setSolde={setSolde}
                  client={client}
              />
          </main>
          <div>
              <button onClick={handleSubmit}> Edit </button>
              <button type="button" onClick={handleClose}> Close </button>
          </div>
      </dialog>
  );
}

// Modèle de construction de diagramme en barres pour les soldes 
function ChartModel({ soldeMin, soldeMax, totalSolde }) {
  const dataset = [
    {
      type: 'Solde',
      soldemin: soldeMin,
      soldemax: soldeMax,
      totalsolde: totalSolde,
    },
  ];
  
  const valueFormatter = (value) => `${value} Ar`;

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'type' }]}
      series={[
        { dataKey: 'soldemin', label: 'Solde minimal', valueFormatter, color: "#a9edea" },
        { dataKey: 'soldemax', label: 'Solde maximal', valueFormatter, color: "#7fdbff"},
        { dataKey: 'totalsolde', label: 'Total des soldes', valueFormatter, color: "#4169e1" },
      ]}
      margin={{ top: 50, right: 0, bottom: 50, left: 55 }} 
      height={500}
      width={600}
    />
  );
}

/*
function ModelErrorDialog() {

}

function ModelInfoDialog(){

}
*/

export { ModalAdd , ModalEdit , DeleteClient , ChartModel }; 
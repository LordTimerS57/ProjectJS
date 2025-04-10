import { useEffect, useState } from 'react';
import './css/App.css';
import { ModalAdd, ModalEdit, DeleteClient, ChartModel } from './MainModel';
import { fetchClients } from './APIClient';

function App() {
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const refreshClients = async () => {
    const result = await fetchClients();
    if (result) {
      setData(result);
      console.log("Clients mis à jour :", result);
    }
  };

  useEffect(() => {
    refreshClients();
  }, [refresh]);
  
  const handleClient = async () => setRefresh(key => key + 1);

  if (!data) {
    return <div>Loading...</div>;
  }

  const soldeMin = data.soldeInstance?.[0]?.solde_min || 0;
  const soldeMax = data.soldeInstance?.[0]?.solde_max || 0;
  const totalSolde = data.totalSolde || 0;

  return (
    <>
      <div>
        <ModalAdd isOpen={isOpen} handleClose={() => setIsOpen(false)} onRefresh={handleClient} />
        <ModalEdit isOpen={isEditOpen} handleClose={() => setIsEditOpen(false)} client={selectedClient} onRefresh={refreshClients} />
      </div>
      <header>
        <h1>Liste des Clients</h1>
      </header>
      <main>
        <table className='MainTable'>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Solde ( en Ar )</th>
              <th>Observation</th> 
              <th>
                <button onClick={() => setIsOpen(true)}>Ajouter</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.clients.map(client => (
              <tr key={client.numcompte}>
                <td>{client.nom}</td>
                <td>{client.solde}</td>
                <td>{client.obs}</td>
                <td>
                  <div>
                    <button onClick={() => { setSelectedClient(client); setIsEditOpen(true); }}>Modifier</button>
                    <DeleteClient numcompte={client.numcompte} onRefresh={handleClient} />                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      
      <footer>
        <h2>Représentation des soldes</h2>
        <div className="FooterContainer">
          <div className="SoldeSection">
            <fieldset className="ModelSolde">
              <div>
                <label>Solde minimal: </label>
                <label>{soldeMin} Ar</label>
              </div>
              <div>
                <label>Solde maximal: </label>
                <label>{soldeMax} Ar</label>
              </div>
              <div>
                <label>Total des soldes: </label>
                <label>{totalSolde} Ar</label>
              </div>
            </fieldset>
          </div>
          <div className="ChartSection">
            <ChartModel soldeMin={soldeMin} soldeMax={soldeMax} totalSolde={totalSolde} />
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;

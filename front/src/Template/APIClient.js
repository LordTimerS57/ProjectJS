async function fetchClients() {
    try {
      const response = await fetch("http://localhost:5000/bank");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
};
async function Add(numcompte, nom, solde) {
  try {
    const response = await fetch('http://localhost:5000/bank/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numcompte, nom, solde })
    });
    
    const data = await response.json(); // Lire la réponse du serveur

    if (response.ok) {
      alert("Client ajouté avec succès");
      return true;
    } else {
      alert("Erreur : " + (data.error || "Impossible d'ajouter le client"));
      return false;
    }
  } catch (error) {
    
    console.error("Erreur Fetch :", error);
    alert("Une erreur réseau s'est produite.");
    return false;

  }

}

async function Edit(id, nom, solde) {
  try {
    const response = await fetch(`http://localhost:5000/bank/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, solde })
    });

    const data = await response.json();
    if (response.ok) {
      alert("Client modifié avec succès");
      return true;
    } else {
      alert("Erreur : " + (data.error || "Impossible de modifier le client"));
      return false;
    }
  } catch (error) {
    console.error("Erreur Fetch :", error);
    alert("Une erreur réseau s'est produite.");
    return false;
  }
}

async function Delete(id) {
  try {
      const response = await fetch(`http://localhost:5000/bank/delete/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
      });

      // Vérifie si la réponse est vide avant d'essayer de la parser
      const text = await response.text();
      let data;
      try {
          data = text ? JSON.parse(text) : {}; // Si vide, retourne un objet vide
      } catch (e) {
          console.warn("Réponse non JSON reçue :", text);
          return false; // Évite de planter l'application
      }

      if (response.ok) {
          alert("Client supprimé avec succès");
          return true;
      } else {
          alert("Erreur : " + (data.error || "Impossible de supprimer le client"));
          return false;
      }
  } catch (error) {
      console.error("Erreur Fetch :", error);
      alert("Une erreur réseau s'est produite.");
      return false;
  }
}



export { fetchClients , Add , Edit , Delete };
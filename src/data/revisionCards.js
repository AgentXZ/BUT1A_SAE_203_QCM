export const revisionCards = [
  {
    title: "die()",
    theme: "PHP",
    summary:
      "Arrête immédiatement le script PHP et peut afficher un message. Utile quand une ressource indispensable manque.",
    example: "if (!file_exists($envFile)) { die('Fichier .env manquant'); }",
  },
  {
    title: "exit()",
    theme: "PHP",
    summary:
      "Termine le script. Après une redirection avec header(), exit() évite que le reste du code continue à s'exécuter.",
    example: "header('location: login.php'); exit();",
  },
  {
    title: "@param",
    theme: "PHP",
    summary:
      "Balise PHPDoc qui documente le type et le rôle d'un paramètre de fonction.",
    example: "@param PDO $pdo La connexion à la base de données.",
  },
  {
    title: "@return",
    theme: "PHP",
    summary:
      "Balise PHPDoc qui indique ce qu'une fonction renvoie, par exemple un tableau, un booléen ou false.",
    example: "@return array|false Le ticket trouvé ou false.",
  },
  {
    title: "INSERT INTO",
    theme: "SQL",
    summary:
      "Commande SQL qui ajoute une nouvelle ligne dans une table.",
    example: "INSERT INTO Ticket (sujet_ticket) VALUES (?);",
  },
  {
    title: "WHERE",
    theme: "SQL",
    summary:
      "Filtre les lignes concernées par une requête. Indispensable dans UPDATE ou DELETE pour éviter d'agir sur toute la table.",
    example: "UPDATE Ticket SET statut_ticket = ? WHERE id_ticket = ?;",
  },
  {
    title: "Boucles",
    theme: "PHP",
    summary:
      "foreach parcourt naturellement les tableaux PHP, par exemple pour afficher une liste de tickets.",
    example: "foreach ($tickets as $ticket) { echo $ticket['sujet_ticket']; }",
  },
  {
    title: "Formulaires",
    theme: "HTML",
    summary:
      "Un formulaire HTML envoie les champs vers un script PHP avec action et method.",
    example: '<form action="submit_ticket.php" method="POST">',
  },
  {
    title: "CRUD",
    theme: "Architecture",
    summary:
      "Create, Read, Update, Delete : créer un ticket, le lire, le modifier, le supprimer ou l'archiver.",
    example: "createTicket(), getAllTickets(), updateTicket(), softDeleteTicket().",
  },
  {
    title: "Requêtes préparées",
    theme: "SQL",
    summary:
      "Séparent le SQL des valeurs utilisateur et réduisent fortement le risque d'injection SQL.",
    example: "$stmt = $pdo->prepare('SELECT * FROM Ticket WHERE uid_ticket = ?');",
  },
];

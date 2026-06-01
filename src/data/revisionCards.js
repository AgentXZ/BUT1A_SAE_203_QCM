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
  {
    title: "UID de ticket",
    theme: "Gestion de tickets",
    summary:
      "Un UID alphanumerique public evite d'exposer un ID numerique facile a deviner. Il doit etre unique et assez difficile a enumerer.",
    example: "do { $uid = generateTicketUid(); } while (!isTicketUidUnique($pdo, $uid));",
  },
  {
    title: "Suivi UID + email",
    theme: "Gestion de tickets",
    summary:
      "Demander l'UID du ticket et l'email associe renforce le suivi public : connaitre le code seul ne suffit pas.",
    example: "WHERE t.uid_ticket = ? AND u.email_utilisateur = ? AND t.is_deleted = 0",
  },
  {
    title: "Utilisateur sans mot de passe",
    theme: "Architecture",
    summary:
      "Un utilisateur simple qui ne se connecte pas n'a pas besoin de mot de passe. Stocker NULL reduit les donnees sensibles inutiles.",
    example: "mot_de_passe VARCHAR(255) NULL",
  },
  {
    title: "Nom et prenom",
    theme: "Gestion de tickets",
    summary:
      "Demander le nom et le prenom evite de deviner l'identite depuis l'email et donne des informations plus propres a l'administrateur.",
    example: "createUser($pdo, $nom, $prenom, $email, null, 'utilisateur');",
  },
  {
    title: "Statut archive",
    theme: "SQL",
    summary:
      "Le statut archive conserve un ticket hors du flux actif sans le confondre avec ferme, qui indique plutot une resolution.",
    example: "statut_ticket ENUM('ouvert', 'en_cours', 'ferme', 'archive')",
  },
  {
    title: "Suppression logique",
    theme: "Architecture",
    summary:
      "Au lieu de supprimer directement, on marque l'element comme supprime. Il peut ensuite etre restaure ou supprime definitivement.",
    example: "UPDATE Ticket SET is_deleted = 1 WHERE id_ticket = ?;",
  },
  {
    title: "Vue corbeille",
    theme: "Gestion de tickets",
    summary:
      "Une corbeille separe les tickets actifs des tickets supprimes logiquement et propose des actions de restauration ou suppression definitive.",
    example: "SELECT * FROM Ticket WHERE is_deleted = 1 ORDER BY date_creation DESC;",
  },
  {
    title: "Statistiques dashboard",
    theme: "SQL",
    summary:
      "COUNT et GROUP BY permettent d'afficher le total des tickets actifs et la repartition par statut dans le tableau de bord.",
    example: "SELECT statut_ticket, COUNT(*) AS total FROM Ticket WHERE is_deleted = 0 GROUP BY statut_ticket;",
  },
  {
    title: "ON DELETE CASCADE",
    theme: "SQL",
    summary:
      "Une suppression en cascade peut supprimer automatiquement les tickets lies a un utilisateur. Il faut la comprendre avant toute suppression.",
    example: "FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE",
  },
  {
    title: "Roles administrateur",
    theme: "Architecture",
    summary:
      "Les roles limitent les droits. Une promotion en administrateur doit etre reservee a un compte ayant un niveau d'autorisation plus eleve.",
    example: "UPDATE Utilisateur SET role = 'administrateur' WHERE id_utilisateur = ?;",
  },
  {
    title: "Protection des super admins",
    theme: "PHP",
    summary:
      "Les actions sensibles doivent verifier le role en session pour eviter qu'un administrateur classique modifie un compte super administrateur.",
    example: "if ($_SESSION['role'] !== 'super_administrateur') { exit('Acces refuse'); }",
  },
  {
    title: "htmlspecialchars()",
    theme: "PHP",
    summary:
      "Les donnees affichees depuis un formulaire ou une base doivent etre echappees pour reduire le risque XSS.",
    example: "echo htmlspecialchars($ticket['sujet_ticket']);",
  },
  {
    title: "nl2br()",
    theme: "PHP",
    summary:
      "nl2br conserve les retours a la ligne d'une description utilisateur lors de l'affichage HTML.",
    example: "echo nl2br(htmlspecialchars($ticket['description_ticket']));",
  },
  {
    title: "Redirection apres creation",
    theme: "PHP",
    summary:
      "Apres une creation reussie, une redirection evite de renvoyer le formulaire et permet d'afficher une confirmation claire.",
    example: "header('location: track_ticket.php?uid_ticket=' . $uid . '&success=true'); exit();",
  },
];

export const FAQ_EN = [
  {
    title: 'Getting started',
    items: [
      { q: 'What is Wedd?', a: 'Wedd is a wedding management platform: guests, tables, room layout, protocol meetings, tickets and attendance.' },
      { q: 'How do I create an account?', a: 'From the home page, click Register. Fill in your details and the wedding information. Your account is created with the Client role.' },
      { q: 'How do I sign in?', a: 'Open Sign in, enter your email and password. Depending on your role, you go to the dashboard or the administrator area.' },
      { q: 'I forgot my password', a: 'On the sign-in page, use “Forgot password”. An email lets you reset your access.' },
    ],
  },
  {
    title: 'Roles and permissions',
    items: [
      { q: 'Which roles exist?', a: 'Admin (all accounts), Client (wedding organiser), Manager (guests and tickets), Protocol lead (meetings and follow-up), Protocol (search and attendance).' },
      { q: 'Who can create a Manager, Protocol lead or Protocol account?', a: 'Only the Client, from Administration. Each staff member is linked to the client who created them.' },
      { q: 'What can a Manager do?', a: 'Add, edit and delete guests, send tickets and arrange the room. A manager cannot manage staff.' },
      { q: 'What can Protocol lead and Protocol do?', a: 'They view guests and the room. The Protocol lead also opens meetings. Protocol focuses on search and attendance.' },
      { q: 'What does the Admin do?', a: 'The admin manages every account, can edit or delete them, and sees which client each staff member belongs to.' },
    ],
  },
  {
    title: 'Guests',
    items: [
      { q: 'How do I add a guest?', a: 'From the dashboard or “Add a guest”, enter the details. Status starts as Absent and can later become Present.' },
      { q: 'What do Present and Absent mean?', a: 'Absent: the guest is not confirmed yet. Present: attendance has been validated, often by scan or guest search.' },
      { q: 'How do I assign a table?', a: 'When creating or editing a guest, enter the table name in capitals. It must match a table in the room.' },
      { q: 'How do I send a ticket?', a: 'In the guest table, open the row and download the PDF or send it. The Manager and the Client can do this.' },
      { q: 'How do I find a guest?', a: 'Use “Find a guest” with the name, phone or identifier. Useful for protocol on the day.' },
    ],
  },
  {
    title: 'Room and tables',
    items: [
      { q: 'How do I see the room?', a: 'Open “View the room” (or “Arrange the room” to edit). You see the 3D table plan.' },
      { q: 'How do I zoom the room?', a: 'At the top right of the room view, use − and + (Size). Default restores 100%.' },
      { q: 'Who can edit the room?', a: 'The Client and the Manager. They can move tables, add some, change colours and save.' },
      { q: 'Why are table names in capitals?', a: 'So guests and tables stay matched without spelling differences, for example B747 or BUFFET 1.' },
    ],
  },
  {
    title: 'Meetings',
    items: [
      { q: 'What are meetings for?', a: 'They plan appointments with protocol (date, place, subject). They also appear in the client notifications.' },
      { q: 'Who manages meetings?', a: 'Mainly the Client and the Protocol lead, from the Meetings page.' },
    ],
  },
  {
    title: 'Administration (Client)',
    items: [
      { q: 'How do I create my team?', a: 'Go to Administration and create a user with the role Manager, Protocol lead or Protocol. Keep the generated password: it is shown once.' },
      { q: 'Can I regenerate a staff password?', a: 'Yes, from the list of created users in Administration.' },
      { q: 'Can I disable a staff account?', a: 'Yes. Activate or disable each account you created. A disabled account can no longer sign in. You and the admin can see the sign-in history.' },
    ],
  },
  {
    title: 'Profile and security',
    items: [
      { q: 'How do I edit my profile?', a: 'On the Profile page, change your name, email, phone, wedding details (for clients) and password.' },
      { q: 'Is my data protected?', a: 'Pages and the API require a sign-in. Each staff member only sees the data of the client they belong to.' },
    ],
  },
];

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../app.js';
import AuditLog from '../Models/AuditLog.js';
import Invite from '../Models/Invite.js';
import User from '../Models/User.js';

let mongo;

const password = 'secret12';

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

const registerClient = (email = 'client@wedd.test') =>
  request(app).post('/api/register').send({
    nom: 'Doe',
    prenom: 'Jane',
    email,
    telephone: '600000000',
    password,
    confirmPassword: password,
    dateMariage: '2027-06-01',
    lieuMariage: 'Yaounde',
    couleurSite: '#ffffff',
    themeMariage: 'or',
  });

const login = (email) =>
  request(app).post('/api/login').send({ email, password });

const createUser = async (overrides) => {
  const hashed = await bcrypt.hash(password, 10);
  return User.create({
    nom: 'Test',
    prenom: 'User',
    telephone: '611111111',
    password: hashed,
    ...overrides,
  });
};

describe('authentification', () => {
  it('connecte un client et renvoie un refresh token', async () => {
    await registerClient();
    const response = await login('client@wedd.test');

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.refreshToken).toBeTruthy();
    expect(response.body.expiresIn).toBe(15 * 60 * 1000);
  });

  it('journalise un échec de connexion', async () => {
    await registerClient();
    const response = await request(app).post('/api/login').send({
      email: 'client@wedd.test',
      password: 'mauvais',
    });

    expect(response.status).toBe(400);
    const logs = await AuditLog.find({ action: 'login_failure' });
    expect(logs.length).toBe(1);
  });

  it('refuse un compte désactivé', async () => {
    await registerClient();
    await User.updateOne({ email: 'client@wedd.test' }, { actif: false });
    const response = await login('client@wedd.test');

    expect(response.status).toBe(403);
    expect(response.body.code).toBe('ACCOUNT_DISABLED');
  });

  it('renouvelle un access token expiré', async () => {
    await registerClient();
    const session = await login('client@wedd.test');
    const response = await request(app).post('/api/refresh').send({
      refreshToken: session.body.refreshToken,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });
});

describe('rôles', () => {
  it('refuse la liste des comptes à un visiteur', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(401);
  });

  it('refuse la liste des comptes à un client', async () => {
    await registerClient();
    const session = await login('client@wedd.test');
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${session.body.token}`);

    expect(response.status).toBe(403);
  });

  it('donne la vue par rôle à l\'administrateur', async () => {
    await registerClient();
    await createUser({
      email: 'admin@wedd.test',
      role: 'admin',
      prenom: 'Ada',
    });
    await createUser({
      email: 'proto@wedd.test',
      role: 'protocole',
      prenom: 'Paul',
    });

    const session = await login('admin@wedd.test');
    const response = await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${session.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.roles).toEqual({
      admin: 1,
      client: 1,
      manager: 0,
      chef_protocole: 0,
      protocole: 1,
    });
  });

  it('empêche un protocole d\'ajouter un invité', async () => {
    const created = await registerClient();
    const client = await User.findOne({ email: 'client@wedd.test' });
    expect(created.status).toBe(201);
    await createUser({
      email: 'proto@wedd.test',
      role: 'protocole',
      createdBy: client._id,
    });

    const session = await login('proto@wedd.test');
    const response = await request(app)
      .post('/api/invite')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ titre: 'M', nom: 'Kamga', prenom: 'Paul', status: 'A' });

    expect(response.status).toBe(403);
  });

  it('empêche un admin de se désactiver', async () => {
    const admin = await createUser({ email: 'admin@wedd.test', role: 'admin' });
    const session = await login('admin@wedd.test');
    const response = await request(app)
      .put(`/api/admin/users/${admin._id}/status`)
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ actif: false });

    expect(response.status).toBe(400);
  });
});

describe('invités', () => {
  it('ajoute un invité et enregistre sa présence', async () => {
    await registerClient();
    const session = await login('client@wedd.test');
    const created = await request(app)
      .post('/api/invite')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ titre: 'M', nom: 'Kamga', prenom: 'Paul', telephone: '699000000', status: 'A' });

    expect(created.status).toBe(201);

    const presence = await request(app)
      .post(`/api/invites/${created.body.invite.inviteId}/presence`)
      .set('Authorization', `Bearer ${session.body.token}`);

    expect(presence.status).toBe(200);
    expect(presence.body.invite.status).toBe('P');

    const logs = await AuditLog.find({ action: 'presence' });
    expect(logs.length).toBe(1);
  });

  it('refuse le scan d\'un compte déjà connecté puis désactivé', async () => {
    await registerClient();
    const client = await User.findOne({ email: 'client@wedd.test' });
    await createUser({
      email: 'proto@wedd.test',
      role: 'protocole',
      createdBy: client._id,
    });
    const clientSession = await login('client@wedd.test');
    const created = await request(app)
      .post('/api/invite')
      .set('Authorization', `Bearer ${clientSession.body.token}`)
      .send({ titre: 'M', nom: 'Kamga', prenom: 'Paul', telephone: '699000000', status: 'A' });
    const session = await login('proto@wedd.test');
    await User.updateOne({ email: 'proto@wedd.test' }, { actif: false });

    const presence = await request(app)
      .post(`/api/invites/${created.body.invite.inviteId}/presence`)
      .set('Authorization', `Bearer ${session.body.token}`);

    expect(presence.status).toBe(403);
    expect(presence.body.code).toBe('ACCOUNT_DISABLED');
    const invite = await Invite.findOne({ inviteId: created.body.invite.inviteId });
    expect(invite.status).toBe('A');
  });

  it('refuse le scan quand le client propriétaire est désactivé', async () => {
    await registerClient();
    const client = await User.findOne({ email: 'client@wedd.test' });
    await createUser({
      email: 'proto@wedd.test',
      role: 'protocole',
      createdBy: client._id,
    });
    const clientSession = await login('client@wedd.test');
    const created = await request(app)
      .post('/api/invite')
      .set('Authorization', `Bearer ${clientSession.body.token}`)
      .send({ titre: 'M', nom: 'Kamga', prenom: 'Paul', telephone: '699000000', status: 'A' });
    const session = await login('proto@wedd.test');
    await User.updateOne({ email: 'client@wedd.test' }, { actif: false });

    const presence = await request(app)
      .post(`/api/invites/${created.body.invite.inviteId}/presence`)
      .set('Authorization', `Bearer ${session.body.token}`);

    expect(presence.status).toBe(403);
    expect(presence.body.code).toBe('ACCOUNT_DISABLED');
    const invite = await Invite.findOne({ inviteId: created.body.invite.inviteId });
    expect(invite.status).toBe('A');
  });
});

describe('suppression du compte', () => {
  it('exige le mot de passe puis retire le mariage', async () => {
    await registerClient();
    const client = await User.findOne({ email: 'client@wedd.test' });
    await Invite.create({
      titre: 'M',
      nom: 'Kamga',
      prenom: 'Paul',
      userId: client._id,
      status: 'A',
    });
    await createUser({
      email: 'staff@wedd.test',
      role: 'manager',
      createdBy: client._id,
    });

    const session = await login('client@wedd.test');
    const wrong = await request(app)
      .post('/api/account/delete')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ password: 'autre' });
    expect(wrong.status).toBe(400);

    const removed = await request(app)
      .post('/api/account/delete')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ password });

    expect(removed.status).toBe(200);
    expect(await User.findOne({ email: 'client@wedd.test' })).toBeNull();
    expect(await User.findOne({ email: 'staff@wedd.test' })).toBeNull();
    expect(await Invite.countDocuments()).toBe(0);
  });
});

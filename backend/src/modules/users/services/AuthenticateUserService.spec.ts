import 'dotenv/config';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123123',
    });

    const session = await authenticateUser.execute({
      email: 'johndoe@exemple.com',
      password: '123123',
    });

    expect(session).toHaveProperty('token');
    expect(session.user).toBe(user);
  });

  it('should not be able to authenticate with a non existing user', async () => {
    await createUser.execute({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123123',
    });

    expect(
      authenticateUser.execute({
        email: 'johndoe123@exemple.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a wrong password', async () => {
    await createUser.execute({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123123',
    });

    expect(
      authenticateUser.execute({
        email: 'johndoe@exemple.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

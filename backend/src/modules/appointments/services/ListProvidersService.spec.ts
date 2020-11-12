import User from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      email: 'johntre@exemple.com',
      name: 'John Tre',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      email: 'johnqua@exemple.com',
      name: 'John Qua',
      password: '123456',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });

  it('should be able to list providers with a cache', async () => {
    const user1 = await fakeUsersRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      email: 'johntre@exemple.com',
      name: 'John Tre',
      password: '123456',
    });

    jest
      .spyOn(fakeCacheProvider, 'recover')
      .mockImplementationOnce(async (): Promise<User[]> => [user1, user2]);

    const loggedUser = await fakeUsersRepository.create({
      email: 'johnqua@exemple.com',
      name: 'John Qua',
      password: '123456',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});

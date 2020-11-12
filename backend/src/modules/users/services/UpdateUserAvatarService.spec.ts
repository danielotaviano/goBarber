import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to update a user avatar', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123123',
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'meuAVATAR.png',
    });

    expect(user.avatar).toBe('meuAVATAR.png');
  });

  it('should not be  able to update a avatar for inexistent user', async () => {
    expect(
      updateUserAvatar.execute({
        user_id: '151515',
        avatarFilename: 'meuAVATAR.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123123',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'meuAVATAR.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'meuAVATAR2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('meuAVATAR.png');

    expect(user.avatar).toBe('meuAVATAR2.png');
  });
});

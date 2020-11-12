interface IAuthInterface {
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export default {
  jwt: {
    secret: process.env.APP_SECRET,
    expiresIn: '1d',
  },
} as IAuthInterface;

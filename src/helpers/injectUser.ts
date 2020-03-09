import { IUser } from '../interfaces';

export const injectUser = (text: string, users: IUser[]) => {
  return text.replace(/[^<@]+.(?=>)/g, (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user?.name || '[USER NOT FOUND, PLEASE CONTACT THE ADMIN]';
  });
};

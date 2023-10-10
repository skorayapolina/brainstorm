import { faker } from '@faker-js/faker';
import {v4 as uuidv4} from 'uuid';

const argumentTypes = ['pros', 'cons'];
const voteTypes = ['like', 'dislike'];

export const getRandomArguments = () => {
  return [{
    id: uuidv4(),
    likes: 0,
    dislikes: 0,
    type: faker.helpers.arrayElement(argumentTypes),
    value: faker.lorem.sentence({ min: 3, max: 5 }),
  }]
}

export const getRandomVotes = (argsIds) => {
  return  Array.from({ length: 34 }).map((el) => ({
    argId: faker.helpers.arrayElement(argsIds),
    type: faker.helpers.arrayElement(voteTypes)
  }))
}

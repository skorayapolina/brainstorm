import { faker } from '@faker-js/faker';
import {v4 as uuidv4} from 'uuid';

const argumentTypes = ['pros', 'cons'];

export const getRandomArguments = () => (
    [{
      eventType: 'arguments',
      argument: {
        id: uuidv4(),
        likes: 0,
        dislikes: 0,
        type: faker.helpers.arrayElement(argumentTypes),
        value: faker.lorem.sentence({ min: 3, max: 5 }),
      }
    }]
)

export const getRandomVotes = (argsIds) => {
  const argsNumber = argsIds.length;
  const votesNumber = Math.floor(34 / argsNumber);

  const votes = argsIds.map((id) => {
    const likes = votesNumber >= 2
        ? faker.helpers.rangeToNumber({ min: 1, max: votesNumber})
        : faker.helpers.arrayElement([0, 1]);
    const dislikes = votesNumber - likes;

    return ({
      eventType: 'votes',
      id,
      likes,
      dislikes,
    });
  });

  return votes;
}

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

const getTotalVotesNumber = (argIdsNumber) => {
  if (argIdsNumber >= 18) {
    return 34;
  }

  if (argIdsNumber >= 8) {
    return 44;
  }

  if (argIdsNumber >= 5) {
    return 52;
  }

  return 5;
}

export const getRandomVotes = (argsIds) => {
  const randomArgIds = faker.helpers.arrayElements(argsIds, {
    min: 1,
    max: argsIds.length * 0.6 > 1 ? Math.ceil(argsIds.length * 0.6) : 1
  });
  let totalVotesNumber = getTotalVotesNumber(argsIds.length);

  const argsNumber = randomArgIds.length;
  const votesNumber = Math.floor(totalVotesNumber / argsNumber);

  const votes = randomArgIds.map((id) => {
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

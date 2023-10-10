import { useMachine } from '@xstate/react';
import { brainstormMachine } from './machines/brainstormMachine';
import { getTime } from './helpers/helpers';
import './App.css';

function App() {
  const [state, send] = useMachine(brainstormMachine);

  return (
    <div className="App">
      <header className="App-header">Pros and Cons</header>
      <main>
        {getTime(state.context.timer)}
        {state.matches('inactive') && (
          <button onClick={() => send('START')}>
            Start
          </button>
        )}
        {state.matches('active') && (
          <>
            <ul>
              {state.context.arguments.map(arg => (
                <li key={arg.id}>
                  <div>{arg.type} - {arg.value}</div>
                  <div>{arg.likes} / - {arg.dislikes}</div>
                  <div>
                    <button onClick={() => (
                      send({
                        type: 'VOTE',
                        data: {
                          argId: arg.id,
                          type: 'like'
                        },
                      })
                    )}>
                      like
                      </button>
                    <button onClick={() => (
                      send({
                        type: 'VOTE',
                        data: {
                          argId: arg.id,
                          type: 'dislike'
                        },
                      })
                    )}>
                      dislike
                      </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {state.matches('active') && (
          <>
            <textarea
              onFocus={() => send('ADD_ARGUMENT')}
              onBlur={() => send('STOP_ADDING_ARGUMENT')}
              onChange={(e) => send({
                type: 'SET_ARGUMENT',
                data: {
                  newPro: e.target.value
                }
              })}
              placeholder='New pro'
              value={state.context.newPro}
            />
            {!!state.context.newPro && (
              <button onClick={() => (
                send({
                  type: 'SEND_ARGUMENT',
                  data: {
                    type: 'pros',
                    value: state.context.newPro,
                  }
                })
              )}>
                Send pro
              </button>
            )}
            <textarea
              onFocus={() => send('ADD_ARGUMENT')}
              onBlur={() => send('STOP_ADDING_ARGUMENT')}
              onChange={(e) => send({
                type: 'SET_ARGUMENT',
                data: {
                  newCon: e.target.value
                }
              })}
              placeholder='New con'
              value={state.context.newCon}
            />
            {!!state.context.newCon && (
                <button onClick={() => (
                  send({
                    type: 'SEND_ARGUMENT',
                    data: {
                      type: 'cons',
                      value: state.context.newCon,
                    }
                  })
                )}>
                Send con
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;

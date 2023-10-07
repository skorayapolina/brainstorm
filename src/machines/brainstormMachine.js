import {createMachine} from 'xstate';

const brainstormMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCMBOBDAlgO1gFwHtUBbAOh3QGM9MA3MAYgGUAVAQQCUWBtABgF1EoAA4FYmGgWxCQAD0QBaACy8AzKV4AmXgE4AbAFYlSgOxKAHKs16ANCACeizWdIHeavXvMBGTZu+mSgC+QXZoWLiEJKRUNPQMAGIAkgBySUwAEnyCSCCi4pLSufII3uYmpCZG5gYmnrVVOiZ2jgjK5nquqnqqOt5l7prBoSDhOPhEZLF0jKwA8gAK2TL5EphSMiUK3nrepHp9XuZaNQbmmi2Kbp16vN61qhZNfcNhGONRU9QzDABqcywAKLLXKrQqbRTGXikcqaHQGJoIwxaS5tHTmfaWPRVMoBJQ6XohN4RCbRabxNgAEUpAH1OABxACqAFlASkeAIVmI1htiopvC4TKoDNpNB1bm4BaiFFY9iYmmYlAZVI86noiaN3pFJjFvvRSAB3VBrbBQNioKAAV2IYGweGYbNpDJZbI5ORE3PBfLaO1I+MMlmVAt4xiV0us0OxvD0Su8vAM92jr01JM+uriYENxpopvNVptdodLDpHCZrPZII9BXWRVAJTj0LV6LM3j6YqU3mlhlcmgRxgOJhqBw1Y210QmwmEkAYHEZKUreU9NYhbRc3keT16BmxZ2aDkhPg08d8JhMcOVfhCI2wBAgcBko9JxC51d5dYPGNh8MR+jcF33bReEoMLdKYvAmHGEFKKoI5ak+5DYOSYAvjytZyJCqh7GUBImLw5hKH465DNKCYVAm7gdtGmiqPK3iwamOpIShXrvm0qjuKQBLmDoYpnj4Vj-q0yi6KQcKnviQzuHhyaPmmSFZiaZoWtatp4Mxy7egovaaJxqjcbxYpEdR0q+AYlQir4HRDH48oGPRHw6hOU4QOpb7oT6SquLc9Qqj4Z7GCR5yiaePFeLsYpivZY5kAAZjgmCwAAFpArlofW2IaPKeHVAcCYkU0pAqjGngUWUvZXkEQA */
    id: 'brainstorm',
    initial: "inactive",
    context: {
        numberOfParticipants: 1000,
        arguments: [],
    },
    states: {
        inactive: {
            on: {
                START: "active"
            }
        },
        active: {
            states: {
                writingArgument: {
                    on: {
                        SEND_ARGUMENT: {
                            target: "#brainstorm.active",
                            actions: 'sendArgument'
                        },
                        SET_ARGUMENT: {
                            target: "#brainstorm.active",
                            actions: 'setArgument'
                        }
                    }
                }
            },
            on: {
                FINISH: "finished",
                STOP: "stopped",
                VOTE: {
                    actions: "sendVote",
                },
                ADD_ARGUMENT: ".writingArgument"
            },
        },
        stopped: {
            on: {
                RUN: "active"
            }
        },
        finished: {
            type: "final"
        }
    },
    actions: {
        sendVote: () => {

        },
        sendArgument: () => {
            
        },
        setArgument: () => {

        }
    }
});

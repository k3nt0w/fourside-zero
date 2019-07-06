import { actions } from './actions'
import { operations } from './operations'
import { Actions, initialState, reducer, State } from './reducers'
import { selectors } from './selectors'
import { ActionTypes } from './types'

export {
  Actions,
  initialState,
  State,
  ActionTypes as UserActionTypes,
  actions as userActions,
  operations as userOperations,
  selectors as userSelectors
}
export default reducer

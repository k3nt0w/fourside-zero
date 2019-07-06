import { createSelector } from 'reselect'
import { RootState } from '../../types'
import { State } from './reducers'

const clockSelector = (state: RootState): State => state.clock

const getCount = createSelector(
  clockSelector,
  (state: State): number => state.count
)

export const selectors = {
  getCount
}

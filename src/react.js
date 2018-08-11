import React from "react"
import PropTypes from "prop-types"

export const ElfiContext = React.createContext(null)

export const storeShape = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
})

export function connect(
  WrappedComponent,
  mapStateToProps = storeState => ({
    storeState,
  }),
) {
  function ConnectedComponent(props) {
    return (
      <ElfiContext.Consumer>
        {store => {
          const propsFromStore = mapStateToProps(store.getState(), store)
          return (
            <WrappedComponent {...props} {...propsFromStore} store={store} />
          )
        }}
      </ElfiContext.Consumer>
    )
  }

  ConnectedComponent.displayName = `Connect$${WrappedComponent.name}`

  return ConnectedComponent
}

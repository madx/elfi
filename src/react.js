import React, { Children } from "react"
import PropTypes from "prop-types"

export const storeShape = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
})

export class Provider extends React.Component {
  static propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired,
  }

  static childContextTypes = {
    store: storeShape.isRequired,
  }

  store = this.props.store

  componentDidMount() {
    this.unsubscribe = this.store.subscribe(() => this.handleStoreUpdate())
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleStoreUpdate() {
    // We always forceUpdate here because elfi skips updating us if the
    // underlying state hasn't changed, so we only receive updates when data
    // actually changed.
    this.forceUpdate()
  }

  getChildContext() {
    return {
      store: this.store,
    }
  }

  render() {
    return Children.only(this.props.children)
  }
}

export function connect(WrappedComponent) {
  const ConnectedComponent = (props, context) => (
    <WrappedComponent {...props} store={context.store} />
  )

  ConnectedComponent.contextTypes = {
    store: storeShape.isRequired,
  }

  ConnectedComponent.displayName = `Connect$${WrappedComponent.name}`

  return ConnectedComponent
}

import React, { PropTypes, Children } from "react"

export const storeShape = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
})

export class Provider extends React.Component {
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

Provider.propTypes = {
  store: storeShape.isRequired,
  children: PropTypes.element.isRequired,
}

Provider.childContextTypes = {
  store: storeShape.isRequired,
}

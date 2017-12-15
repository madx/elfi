import React, { Children } from "react"
import PropTypes from "prop-types"

export const storeShape = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
})

export class Provider extends React.PureComponent {
  static propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired,
  }

  static childContextTypes = {
    store: storeShape.isRequired,
  }

  getChildContext() {
    return {
      store: this.props.store,
    }
  }

  render() {
    return Children.only(this.props.children)
  }
}

export function connect(
  WrappedComponent,
  mapStateToProps = storeState => ({ storeState }),
) {
  return class extends React.Component {
    static contextTypes = {
      store: storeShape.isRequired,
    }

    static displayName = `Connect$${WrappedComponent.name}`

    componentDidMount() {
      const { store } = this.context
      // We always forceUpdate here because elfi skips updating us if the
      // underlying state hasn't changed, so we only receive updates when data
      // actually changed.
      this.unsubscribe = store.subscribe(() => this.forceUpdate())
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      const { store } = this.context
      const propsFromStore = mapStateToProps(store.getState(), store)

      return (
        <WrappedComponent {...this.props} {...propsFromStore} store={store} />
      )
    }
  }
}

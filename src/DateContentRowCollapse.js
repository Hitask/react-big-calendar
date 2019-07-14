import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

const propTypes = {
  enabled: PropTypes.bool,
  collapsed: PropTypes.bool,
  closeCollapsedWeek: PropTypes.func,
}

const defaultProps = {
  enabled: false,
  collapsed: true,
  closeCollapsedWeek: null,
}

class DateContentRowCollapse extends React.Component {
  state = {
    collapsed: this.props.collapsed,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.collapsed !== this.props.collapsed) {
      this.setState({ collapsed: this.props.collapsed })
    }
  }

  handleButtonClick = () => {
    this.setState({ collapsed: !this.state.collapsed })
    if (this.props.closeCollapsedWeek) {
      this.props.closeCollapsedWeek()
    }
  }

  render() {
    const { enabled, children } = this.props
    if (!enabled) return children
    return (
      <React.Fragment>
        <div
          className={cn(
            'rbc-row-content-collapse',
            this.state.collapsed && 'collapsed'
          )}
        >
          {children}
        </div>
        <button
          onClick={this.handleButtonClick}
          className="rbc-collapse-button"
        >
          {this.state.collapsed ? <span>&#9660;</span> : <span>&#9650;</span>}
        </button>
      </React.Fragment>
    )
  }
}

DateContentRowCollapse.propTypes = propTypes
DateContentRowCollapse.defaultProps = defaultProps

export default DateContentRowCollapse

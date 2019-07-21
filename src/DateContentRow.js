import cn from 'classnames'
import getHeight from 'dom-helpers/query/height'
import qsa from 'dom-helpers/query/querySelectorAll'
import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'

import * as dates from './utils/dates'
import BackgroundCells from './BackgroundCells'
import EventRow from './EventRow'
import EventEndingRow from './EventEndingRow'
import DateContentRowCollapse from './DateContentRowCollapse'
import * as DateSlotMetrics from './utils/DateSlotMetrics'

class DateContentRow extends React.Component {
  constructor(...args) {
    super(...args)

    this.slotMetrics = DateSlotMetrics.getSlotMetrics()
  }

  handleSelectSlot = slot => {
    const { range, onSelectSlot } = this.props

    onSelectSlot(range.slice(slot.start, slot.end + 1), slot)
  }

  handleShowMore = (slot, target) => {
    const { range, onShowMore, weekIdx } = this.props
    let metrics = this.slotMetrics(this.props)
    let row = qsa(findDOMNode(this), '.rbc-row-bg')[0]

    let cell
    if (row) cell = row.children[slot - 1]

    let events = metrics.getEventsForSlot(slot)
    onShowMore(events, range[slot - 1], cell, slot, target, weekIdx)
  }

  createHeadingRef = r => {
    this.headingRow = r
  }

  createEventRef = r => {
    this.eventRow = r
  }

  containerRef = r => {
    this.container = r
  }

  getContainer = () => {
    const { container } = this.props
    return container ? container() : this.container
  }

  getRowLimit() {
    let eventHeight = getHeight(this.eventRow)
    let headingHeight = this.headingRow ? getHeight(this.headingRow) : 0
    let eventSpace = getHeight(findDOMNode(this)) - headingHeight

    return Math.max(Math.floor(eventSpace / eventHeight), 1)
  }

  renderHeadingCell = (date, index) => {
    let { renderHeader, getNow } = this.props

    return renderHeader({
      date,
      key: `header_${index}`,
      className: cn(
        'rbc-date-cell',
        dates.eq(date, getNow(), 'day') && 'rbc-now'
      ),
    })
  }

  renderDummy = () => {
    let { className, range, renderHeader } = this.props
    return (
      <div className={className}>
        <div className="rbc-row-content">
          {renderHeader && (
            <div className="rbc-row" ref={this.createHeadingRef}>
              {range.map(this.renderHeadingCell)}
            </div>
          )}
          <div className="rbc-row" ref={this.createEventRef}>
            <div className="rbc-row-segment">
              <div className="rbc-event">
                <div className="rbc-event-content">&nbsp;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      date,
      rtl,
      range,
      className,
      selected,
      selectable,
      renderForMeasure,

      accessors,
      getters,
      components,

      getNow,
      renderHeader,
      onSelect,
      localizer,
      onSelectStart,
      onSelectEnd,
      onDoubleClick,
      resourceId,
      longPressThreshold,
      isAllDay,
      collapsable,
    } = this.props

    if (renderForMeasure) return this.renderDummy()

    let metrics = this.slotMetrics(this.props)
    let { levels, extra } = metrics

    let WeekWrapper = components.weekWrapper

    const eventRowProps = {
      selected,
      accessors,
      getters,
      localizer,
      components,
      onSelect,
      onDoubleClick,
      resourceId,
      slotMetrics: metrics,
    }

    const isMonthView = !!this.props.closeCollapsedWeek
    const enabled =
      collapsable &&
      (isMonthView ? this.props.maxRows === Infinity : levels.length > 5)

    return (
      <DateContentRowCollapse
        enabled={enabled}
        collapsed={this.props.maxRows !== Infinity || !this.props.onShowMore} // opened by default in Month view
        closeCollapsedWeek={this.props.closeCollapsedWeek}
      >
        <div className={className} ref={this.containerRef}>
          <BackgroundCells
            date={date}
            getNow={getNow}
            rtl={rtl}
            range={range}
            selectable={selectable}
            container={this.getContainer}
            getters={getters}
            onSelectStart={onSelectStart}
            onSelectEnd={onSelectEnd}
            onSelectSlot={this.handleSelectSlot}
            components={components}
            longPressThreshold={longPressThreshold}
          />

          <div className="rbc-row-content">
            {renderHeader && (
              <div className="rbc-row " ref={this.createHeadingRef}>
                {range.map(this.renderHeadingCell)}
              </div>
            )}
            <WeekWrapper isAllDay={isAllDay} {...eventRowProps}>
              {levels.map((segs, idx) => (
                <EventRow key={idx} segments={segs} {...eventRowProps} />
              ))}
              {!!extra.length && (
                <EventEndingRow
                  segments={extra}
                  onShowMore={this.handleShowMore}
                  {...eventRowProps}
                />
              )}
            </WeekWrapper>
          </div>
        </div>
      </DateContentRowCollapse>
    )
  }
}

DateContentRow.propTypes = {
  weekIdx: PropTypes.number,
  date: PropTypes.instanceOf(Date),
  events: PropTypes.array.isRequired,
  range: PropTypes.array.isRequired,

  rtl: PropTypes.bool,
  resourceId: PropTypes.any,
  renderForMeasure: PropTypes.bool,
  renderHeader: PropTypes.func,

  container: PropTypes.func,
  selected: PropTypes.object,
  selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: PropTypes.number,

  collapsable: PropTypes.bool,
  closeCollapsedWeek: PropTypes.func,

  onShowMore: PropTypes.func,
  onSelectSlot: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectEnd: PropTypes.func,
  onSelectStart: PropTypes.func,
  onDoubleClick: PropTypes.func,
  dayPropGetter: PropTypes.func,

  getNow: PropTypes.func.isRequired,
  isAllDay: PropTypes.bool,

  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  localizer: PropTypes.object.isRequired,

  minRows: PropTypes.number.isRequired,
  maxRows: PropTypes.number.isRequired,
}

DateContentRow.defaultProps = {
  weekIdx: null,
  minRows: 0,
  maxRows: Infinity,
  collapsable: false,
  closeCollapsedWeek: null,
}

export default DateContentRow

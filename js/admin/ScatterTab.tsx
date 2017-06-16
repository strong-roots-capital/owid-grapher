import * as d3 from 'd3'
import * as _ from 'lodash'
import * as React from 'react'
import {observable, computed, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import Timeline from '../charts/Timeline'
import ChartConfig, {TimelineConfig} from '../charts/ChartConfig'

@observer
export default class ScatterTab extends React.Component<{ chart: ChartConfig }, undefined> {
    @observable timeline: TimelineConfig = {}

    @computed get hasTimeline() {
        return !!this.props.chart.timeline
    }

    constructor(props: { chart: ChartConfig }) {
        super(props)
        _.extend(this.timeline, props.chart.timeline)
    }

    componentDidMount() {
        $(".nav-tabs").append("<li className='nav-item'><a className='nav-link' href='#scatter-tab' data-toggle='tab'>Scatter</a></li>")
    }

    @action.bound onToggleTimeline(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked)
            this.props.chart.timeline = this.timeline
        else
            this.props.chart.timeline = null
    }    

    @action.bound onToggleEndsOnly(e: React.ChangeEvent<HTMLInputElement>) {
        this.timeline.compareEndPointsOnly = !!e.target.checked
        this.save()
    }

    save() {
        if (this.hasTimeline)
            this.props.chart.timeline = toJS(this.timeline)
    }

    render() {
        const {hasTimeline, timeline} = this
        const {chart} = this.props

        return <div id="scatter-tab" className="tab-pane">
            <section>
                <h2>Timeline</h2>
                <p className="form-section-desc">Note that the timeline settings will override any variable settings for target year (but not for tolerance).</p>
                <label className="clickable"><input type="checkbox" checked={!!hasTimeline} onChange={this.onToggleTimeline}/> Enable timeline</label>
                {hasTimeline && <div>
                    <label className="clickable"><input type="checkbox" checked={!!this.timeline.compareEndPointsOnly} onChange={this.onToggleEndsOnly}/> Compare end points only</label>
                </div>}
                <h2>Identity line</h2>
                <p className="form-section-desc">Indicates the expected path if x = y.</p>
                <label className="clickable"><input type="checkbox" checked={!!chart.identityLine} onChange={e => chart.identityLine = !chart.identityLine}/> Enable identity line</label>                
            </section>
        </div>
    }
}
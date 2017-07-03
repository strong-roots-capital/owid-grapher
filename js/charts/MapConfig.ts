/* MapConfig.ts       
 * ================                                                             
 *
 * MapConfig holds the data and underlying logic needed by MapTab.
 * It wraps the map property on ChartConfig.
 *
 */ 

import * as _ from 'lodash'
import colorbrewer from './owid.colorbrewer'
import {observable, computed} from 'mobx'
import MapProjection from './MapProjection'
import Chart from './ChartConfig'
import MapData from './MapData'
import {defaultTo} from './Util'

// Represents the actual entered configuration state in the editor
export class MapConfigProps {
	@observable.ref variableId?: number
	@observable.ref targetYear?: number
	@observable.ref timeTolerance?: number
	// Name of an owid.colorbrewer scheme, may then be further customized	
	@observable.ref baseColorScheme?: string
	// Number of numeric intervals used to color data
	@observable.ref colorSchemeInterval?: number = 10
	// Minimum value shown on map legend
	@observable.ref colorSchemeMinValue?: number = undefined
	@observable.ref colorSchemeValues: number[] = []
	@observable.ref colorSchemeLabels: string[] = []
	@observable.ref colorSchemeValuesAutomatic?: true = undefined
	// Whether to reverse the color scheme on output
	@observable.ref colorSchemeInvert?: true = undefined
	@observable.ref customColorsActive?: true = undefined
	// e.g. ["#000", "#c00", "#0c0", "#00c", "#c0c"]
	@observable.ref customNumericColors: string[] = []
	// e.g. { 'foo' => '#c00' }
	@observable.ref customCategoryColors: {[key: string]: string} = {}
	@observable.ref customCategoryLabels: {[key: string]: string} = {}

	// Allow hiding categories from the legend
	@observable.ref customHiddenCategories: {[key: string]: true} = {}
	@observable.ref projection: MapProjection = 'World'
	@observable.ref defaultProjection: MapProjection = 'World'

	@observable.ref legendDescription?: string = undefined
	@observable.ref legendStepSize: number = 20
}

export default class MapConfig {
	chart: Chart

	get props() {
		return (this.chart.props.map as MapConfigProps)
	}

	@computed get variableId() { return this.props.variableId }
	@computed get tolerance() { return defaultTo(this.props.timeTolerance, 0) }
	@computed get numBuckets() { return defaultTo(this.props.colorSchemeInterval, 10) }
	@computed get isAutoBuckets() { return defaultTo(this.props.colorSchemeValuesAutomatic, false) }
	@computed get minBucketValue() { return +defaultTo(this.props.colorSchemeMinValue, 0) }
	@computed get colorSchemeValues(): number[] { return defaultTo(this.props.colorSchemeValues, []) }
	@computed get isCustomColors() { return defaultTo(this.props.customColorsActive, false) }
	@computed get customNumericColors() { return defaultTo(this.isCustomColors ? this.props.customNumericColors : [], []) }
	@computed get customCategoryColors(): {[key: string]: string} { return defaultTo(this.isCustomColors ? this.props.customCategoryColors : {}, {}) }
	@computed get customHiddenCategories() { return defaultTo(this.props.customHiddenCategories, {}) }
	@computed get bucketLabels() { return defaultTo(this.props.colorSchemeLabels, []) }
	@computed get isColorSchemeInverted() { return defaultTo(this.props.colorSchemeInvert, false) }
	@computed get customCategoryLabels(): {[key: string]: string} { return defaultTo(this.props.customCategoryLabels, {}) }
	@computed get customBucketLabels() { return defaultTo(this.props.colorSchemeLabels, []) }
	@computed get projection() { return defaultTo(this.props.projection, "World") }

	@computed get baseColorScheme() { return defaultTo(this.props.baseColorScheme, "BuGn") }
	@computed get noDataColor() {
		return defaultTo(this.customCategoryColors['No data'], "#adacac")
	}

	@computed get data() {
		return this.chart.vardata.isReady && new MapData(this, this.chart.vardata)
	}

	set targetYear(value: number) {
		this.props.targetYear = value
	}

	constructor(chart: Chart) {
		this.chart = chart
	}
}
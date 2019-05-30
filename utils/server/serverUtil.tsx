import * as ReactDOMServer from 'react-dom/server'
import {quote} from 'shell-quote'
import * as urljoin from 'url-join'
import * as settings from 'settings'
import * as util from 'util'
import * as shell from 'shelljs'

import isString = require('lodash/isString')
import toString = require('lodash/toString')
import includes = require('lodash/includes')
import trim = require('lodash/trim')

export const promisifiedExec = util.promisify(shell.exec)

export async function exec(command: string): Promise<string> {
    try {
        return await promisifiedExec(command)
    } catch (err) {
        const error = new Error(`Received exit code ${err} from: ${command}`);
        (error as any).code = err
        throw error
    }
}

export async function tryExec(command: string): Promise<string> {
    try {
        return await exec(command)
    } catch (error) {
        console.error(error)
        return error.code
    }
}

// Exception format that can be easily given as an API error
export class JsonError extends Error {
    status: number
    constructor(message: string, status?: number) {
        super(message)
        this.status = status || 400
    }
}

// Fail-fast integer conversion, for e.g. ids in url params
export function expectInt(value: any): number {
    const num = parseInt(value)
    if (isNaN(num))
        throw new JsonError(`Expected integer value, not '${value}'`, 400)
    return num
}

export function tryInt(value: any, defaultNum: number): number {
    const num = parseInt(value)
    if (isNaN(num))
        return defaultNum
    return num
}

// Generate a static html page string from a given JSX element
export function renderToHtmlPage(element: any): string {
    return `<!doctype html>${ReactDOMServer.renderToStaticMarkup(element)}`
}

// Determine if input is suitable for use as a url slug
export function isValidSlug(slug: any) {
    return isString(slug) && slug.length > 1 && slug.match(/^[\w-]+$/)
}

export function shellEscape(s: string) {
    return quote([s])
}

export function csvEscape(value: any): string {
    const valueStr = toString(value)
    if (includes(valueStr, ","))
        return `"${value.replace(/\"/g, "\"\"")}"`
    else
        return value
}

export function csvRow(arr: string[]): string {
    return arr.map(x => csvEscape(x)).join(",")+"\n"
}

export function absoluteUrl(path: string): string {
    return urljoin(settings.ADMIN_BASE_URL, path)
}

// Take an arbitrary string and turn it into a nice url slug
export function slugify(s: string) {
    s = s.toLowerCase().replace(/\s*\*.+\*/, '').replace(/[^\w- ]+/g, '')
    return trim(s).replace(/ +/g, '-')
}

import * as filenamify from 'filenamify'
export { filenamify }

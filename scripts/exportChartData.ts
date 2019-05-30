// Script to export the data_values for all variables attached to charts

import * as db from 'db/db'
import chunk from 'lodash-es/chunk'

import { DB_NAME } from 'serverSettings'
import { exec } from 'utils/server/serverUtil'

async function dataExport() {
    await db.connect()

    const tmpFile = "/tmp/owid_chartdata.sql"

    const variablesToExportQuery = `
        SELECT DISTINCT cd.variableId FROM chart_dimensions cd
        WHERE NOT EXISTS (select * from tags t join chart_tags ct on ct.tagId = t.id where ct.chartId=cd.chartId and t.name='Private')
    `

    const variableIds = (await db.query(variablesToExportQuery)).map((row: any) => row.variableId)

    console.log(`Exporting data for ${variableIds.length} variables to ${tmpFile}`)

    await exec(`rm -f ${tmpFile}`)

    let count = 0
    for (const ids of chunk(variableIds, 100)) {
        await exec(`mysqldump --no-create-info ${DB_NAME} data_values --where="variableId IN (${ids.join(",")})" >> ${tmpFile}`)

        count += ids.length
        console.log(count)
    }

    await db.end()
}

dataExport()

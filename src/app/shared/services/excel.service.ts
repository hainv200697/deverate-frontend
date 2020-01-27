import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    constructor() { }

    public generateExcel(header, data, excelFileName: string): void {
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Car Data');
        let titleRow = worksheet.addRow([excelFileName]);
        // Set font, size and style in title row.
        titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
        //Add header
        let headerRow = worksheet.addRow(header);
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' },
                bgColor: { argb: 'FF0000FF' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
        //Add data
        worksheet.addRows(data);
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName + '.xlsx');
        })
    }
}
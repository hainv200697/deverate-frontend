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
        let worksheet = workbook.addWorksheet('Applicant');
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').value = excelFileName;
        worksheet.getCell('A1').alignment = { horizontal:'center'} ;
        // Set font, size and style in title row.
        worksheet.getCell('A1').font = { name: 'Calibri', family: 4, size: 20, bold: true };
        //Add header
        let headerRow = worksheet.addRow(header);
        headerRow.eachCell((cell, number) => {
            
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'CCCCCC' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            cell.font = { name: 'Calibri', family: 4, size: 13, bold: true };
        });
        worksheet.columns[0].width = 30;
        worksheet.columns[3].width = 30;
        //Add data
        worksheet.addRows(data);

        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, excelFileName + '.xlsx');
        })
    }
}
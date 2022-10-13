import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class DataExportationService {

  public CSV_EXTENSION: any = '.csv';
  public CSV_TYPE: any = 'text/plain;charset=utf-8';
  time: string;

  constructor() {
    this.time = new Date().toISOString()
   }

   /**exports grid entries to xlsx */
   exportDataXlsx(exportArray, title): void {
    exportArray = Array.from(new Set(exportArray));
    let doc = exportArray;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(doc, {header: [`FMCG ${this.time}`]});
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${title}`);
    XLSX.writeFile(wb, `${title}.xlsx`);
  }

  /**exports entries to pdf */
  exportToPdf(cols, rows, title): void {
    let doc = new jspdf.jsPDF();
    doc.text(`${title}`, 14, 30);
    autoTable(doc, {head: [cols], body: rows, styles: {fontSize: 4}, didDrawPage: (data) => {
      doc.setFontSize(5);
      doc.setTextColor(40);
      doc.text(`FMCG ${this.time}`, data.settings.margin.left, 5);
    } });
    doc.save(title);
  }

  /**exports entries to csv */
  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    saveAs(data, fileName);
  }

  exportToCsv(rows: object[], fileName: string, columns?: string[]): string {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]).filter(k => {
      if (columns.length) {
        return columns.includes(k);
      } else {
        return true;
      }
    });
    const csvContent = keys.join(separator) + '\n' + rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        cell = cell instanceof Date ? cell.toLocaleDateString() : cell.toString().replace(/" /g, '""');
        if (cell.search(/("|, |\n")/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');
    this.saveAsFile(csvContent, `${fileName}${this.CSV_EXTENSION}`, this.CSV_TYPE);
  }

}

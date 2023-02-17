const XLSX = require("xlsx")

var workbook = XLSX.readFile("test.xlsx")
workbook = workbook.Sheets[workbook.SheetNames[0]]

for (let index = 2; index < 7; index++){
    console.log(workbook[`B${index}`].v);
 
}



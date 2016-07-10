from openpyxl import load_workbook

wb = load_workbook('/tmp/a.xlsx')
sheet = wb[wb.get_sheet_names()[0]]
for row in sheet.rows:
    for cell in row:
        print cell.value, type(cell.value)